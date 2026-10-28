import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { Readable } from 'node:stream'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import ssh2 from 'ssh2'
import { apply, __test } from '../index.js'
import { setPassword } from '../lib/vault.js'

const { Server, utils } = ssh2

class FakeResponse extends EventEmitter {
  constructor() {
    super()
    this.statusCode = 200
    this.headers = {}
    this.chunks = []
    this.body = undefined
    this.ended = false
    this.writableEnded = false
  }
  writeHead(status, headers) {
    this.statusCode = status
    Object.assign(this.headers, headers ?? {})
  }
  setHeader(name, value) {
    this.headers[String(name).toLowerCase()] = value
  }
  write(chunk) {
    this.chunks.push(Buffer.from(chunk))
    return true
  }
  end(body) {
    this.ended = true
    this.writableEnded = true
    if (body !== undefined) this.body = Buffer.from(body)
    this.emit('finish')
  }
}

function fakeRequest(method, body) {
  const request = Readable.from(body === undefined ? [] : [Buffer.from(JSON.stringify(body))])
  request.method = method
  request.url = '/'
  request.headers = { host: '127.0.0.1:1234', 'content-type': 'application/json' }
  return request
}

function sseEvents(response) {
  const text = Buffer.concat(response.chunks).toString('utf8')
  return text
    .split('\n\n')
    .flatMap((block) => block.split('\n').filter((line) => line.startsWith('data: ')).map((line) => JSON.parse(line.slice(6))))
}

async function waitForSse(response, predicate, timeout = 5000) {
  const started = Date.now()
  while (Date.now() - started < timeout) {
    const hit = sseEvents(response).find(predicate)
    if (hit) return hit
    await new Promise((resolve) => setTimeout(resolve, 20))
  }
  throw new Error(`timeout waiting for SSE event; got ${JSON.stringify(sseEvents(response)).slice(0, 500)}`)
}

function decode(event) {
  return Buffer.from(String(event.data ?? ''), 'base64').toString('utf8')
}

const keys = utils.generateKeyPairSync('ed25519')
const server = new Server({ hostKeys: [keys.private] }, (client) => {
  client.on('authentication', (ctx) => {
    if (ctx.method === 'password' && ctx.username === 'tester' && ctx.password === 'secret') ctx.accept()
    else ctx.reject()
  })
  client.on('ready', () => {
    client.on('session', (accept) => {
      const session = accept()
      let pty = { cols: 80, rows: 24 }
      session.on('pty', (acceptPty, rejectPty, info) => {
        pty = info
        acceptPty?.()
      })
      session.on('window-change', (acceptChange, rejectChange, info) => {
        if (info) pty = info
        acceptChange?.()
      })
      session.on('shell', (acceptShell) => {
        const stream = acceptShell()
        stream.write('fake-shell$ ')
        stream.on('data', (chunk) => {
          const text = chunk.toString('utf8')
          if (!text.includes('\r')) {
            stream.write(text)
            return
          }
          const command = text.replace(/\r/g, '').trim()
          if (command === 'exit') {
            stream.exit(0)
            stream.end()
            return
          }
          stream.write(`\r\n${command} -> pty ${pty.cols}x${pty.rows}\r\nfake-shell$ `)
        })
      })
    })
  })
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const port = server.address().port
const temp = await mkdtemp(path.join(os.tmpdir(), 'ssh-sse-test-'))
const paths = { configPath: path.join(temp, 'config'), backupDir: path.join(temp, 'backups'), stateDir: path.join(temp, 'state') }
try {
  await mkdir(temp, { recursive: true })
  await writeFile(paths.configPath, `Host local\n  HostName 127.0.0.1\n  User tester\n  Port ${port}\n`, 'utf8')
  await setPassword(paths, 'local', 'secret')

  const savedEnv = {
    SSH_CONFIG: process.env.SSH_CONFIG,
    DSH_SSH_MANAGER_HOME: process.env.DSH_SSH_MANAGER_HOME,
  }
  process.env.SSH_CONFIG = paths.configPath
  process.env.DSH_SSH_MANAGER_HOME = paths.stateDir
  const routes = []
  const ctx = {
    effect: (callback) => {
      const dispose = callback()
      return typeof dispose === 'function' ? dispose : () => {}
    },
    webServer: {
      register: (route) => {
        routes.push(route)
        return () => {}
      },
      registerUpgrade: () => () => {},
      tapIndex: () => () => {},
    },
    get: (key) => (key === 'connection' ? { requestRejection: () => undefined } : undefined),
    inject: (names, callback) => callback({ effect: (fn) => fn(), tools: { register: () => () => {} } }),
  }
  apply(ctx)
  const restoreEnv = () => {
    for (const [key, value] of Object.entries(savedEnv)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
  const route = (routePath) => routes.find((entry) => entry.path === routePath)
  const eventsRoute = route(__test.PTY_EVENTS_ROUTE)
  const openRoute = route(__test.PTY_OPEN_ROUTE)
  const inputRoute = route(__test.PTY_INPUT_ROUTE)
  const resizeRoute = route(__test.PTY_RESIZE_ROUTE)
  const closeRoute = route(__test.PTY_CLOSE_ROUTE)
  assert.ok(eventsRoute && openRoute && inputRoute && resizeRoute && closeRoute)

  const sse = new FakeResponse()
  await eventsRoute.handler(fakeRequest('GET'), sse)
  assert.match(String(sse.headers['content-type']), /^text\/event-stream/)

  const openResponse = new FakeResponse()
  await openRoute.handler(fakeRequest('POST', { id: 'pty-sse-test', host: 'local', cols: 80, rows: 24 }), openResponse)
  const opened = JSON.parse(openResponse.body.toString())
  assert.equal(opened.ok, true)
  const prompt = await waitForSse(sse, (event) => event.kind === 'output' && decode(event).includes('fake-shell$'))
  assert.ok(prompt)

  const inputResponse = new FakeResponse()
  await inputRoute.handler(fakeRequest('POST', { id: 'pty-sse-test', data: 'uptime\r' }), inputResponse)
  assert.equal(JSON.parse(inputResponse.body.toString()).ok, true)
  const uptime = await waitForSse(sse, (event) => event.kind === 'output' && decode(event).includes('uptime -> pty 80x24'))
  assert.ok(uptime)

  const resizeResponse = new FakeResponse()
  await resizeRoute.handler(fakeRequest('POST', { id: 'pty-sse-test', cols: 100, rows: 30 }), resizeResponse)
  await new Promise((resolve) => setTimeout(resolve, 100))
  const scanResponse = new FakeResponse()
  await inputRoute.handler(fakeRequest('POST', { id: 'pty-sse-test', data: 'scan\r' }), scanResponse)
  const scan = await waitForSse(sse, (event) => event.kind === 'output' && decode(event).includes('scan -> pty 100x30'))
  assert.ok(scan)

  const closeResponse = new FakeResponse()
  await closeRoute.handler(fakeRequest('POST', { id: 'pty-sse-test' }), closeResponse)
  assert.equal(JSON.parse(closeResponse.body.toString()).ok, true)
  await waitForSse(sse, (event) => event.kind === 'exit' && event.id === 'pty-sse-test')
  sse.emit('close')
  console.log('ok - HTTP/SSE PTY transport end-to-end against mock ssh server (open/ready/input/resize/close)')

  const deniedRoutes = []
  const deniedCtx = {
    effect: (callback) => {
      const dispose = callback()
      return typeof dispose === 'function' ? dispose : () => {}
    },
    webServer: { register: (entry) => { deniedRoutes.push(entry); return () => {} }, registerUpgrade: () => () => {}, tapIndex: () => () => {} },
    get: (key) => (key === 'connection' ? { requestRejection: () => 401 } : undefined),
    inject: (names, callback) => callback({ effect: (fn) => fn(), tools: { register: () => () => {} } }),
  }
  apply(deniedCtx)
  const deniedEvents = deniedRoutes.find((entry) => entry.path === __test.PTY_EVENTS_ROUTE)
  const deniedEventsResponse = new FakeResponse()
  await deniedEvents.handler(fakeRequest('GET'), deniedEventsResponse)
  assert.equal(deniedEventsResponse.statusCode, 401)
  assert.equal(deniedEventsResponse.body, undefined)
  const deniedOpen = deniedRoutes.find((entry) => entry.path === __test.PTY_OPEN_ROUTE)
  const deniedResponse = new FakeResponse()
  await deniedOpen.handler(fakeRequest('POST', { id: 'pty-denied', host: 'local', cols: 80, rows: 24 }), deniedResponse)
  assert.equal(deniedResponse.statusCode, 401)
  assert.equal(deniedResponse.body, undefined)
  console.log('ok - HTTP PTY routes (events and open) require an authenticated browser session')
  restoreEnv()
} finally {
  await rm(temp, { recursive: true, force: true })
  server.close()
}
