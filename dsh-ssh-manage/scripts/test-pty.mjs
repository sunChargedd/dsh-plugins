import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import ssh2 from 'ssh2'
const { Server, utils } = ssh2

import { __test } from '../index.js'
import { setPassword } from '../lib/vault.js'

class FakeSocket extends EventEmitter {
  constructor() { super(); this.chunks = []; this.writable = true; this.writableLength = 0; this.ended = false }
  write(buf) { this.chunks.push(Buffer.from(buf)); return true }
  end() { this.ended = true; this.emit('close') }
  destroy() { this.ended = true; this.emit('close') }
}
function clientFrame(opcode, payload) {
  const body = Buffer.isBuffer(payload) ? payload : Buffer.from(payload)
  const mask = Buffer.from([1,2,3,4])
  let header
  if (body.length < 126) { header = Buffer.alloc(2); header[1] = 0x80 | body.length }
  else { header = Buffer.alloc(4); header[1] = 0x80 | 126; header.writeUInt16BE(body.length,2) }
  header[0] = 0x80 | opcode
  const masked = Buffer.allocUnsafe(body.length)
  for (let i=0;i<body.length;i++) masked[i] = body[i] ^ mask[i&3]
  return Buffer.concat([header, mask, masked])
}
function parseServerFrames(buffer) {
  const frames=[]; let offset=0
  while (offset+2 <= buffer.length) {
    const first=buffer[offset], second=buffer[offset+1]
    const opcode=first&0x0f; let len=second&0x7f; let p=offset+2
    if (len===126) { if (offset+4>buffer.length) break; len=buffer.readUInt16BE(offset+2); p=offset+4 }
    else if (len===127) { if (offset+10>buffer.length) break; len=Number(buffer.readBigUInt64BE(offset+2)); p=offset+10 }
    if (p+len > buffer.length) break
    frames.push({opcode, payload: buffer.subarray(p,p+len)})
    offset = p+len
  }
  return {frames, rest: buffer.subarray(offset)}
}

const keys = utils.generateKeyPairSync('ed25519')
const shellStates = []
const server = new Server({ hostKeys: [keys.private] }, (client) => {
  client.on('authentication', (ctx) => {
    if (ctx.method === 'password' && ctx.username === 'tester' && ctx.password === 'secret') ctx.accept()
    else ctx.reject()
  })
  client.on('ready', () => {
    client.on('session', (accept) => {
      const session = accept()
      let pty = { cols: 80, rows: 24 }
      session.on('pty', (acceptPty, rejectPty, info) => { pty = info; acceptPty?.() })
      session.on('window-change', (acceptChange, rejectChange, info) => { if (info) pty = info; acceptChange?.() })
      session.on('shell', (acceptShell) => {
        const stream = acceptShell()
        shellStates.push(pty)
        stream.write('fake-shell$ ')
        stream.on('data', (chunk) => {
          const text = chunk.toString('utf8')
          if (text.includes('\r')) {
            const command = text.replace(/\r/g,'').trim()
            if (command === 'exit') { stream.exit(0); stream.end(); return }
            stream.write(`\r\n${command} -> pty ${pty.cols}x${pty.rows}\r\nfake-shell$ `)
          } else {
            stream.write(text)
          }
        })
      })
    })
  })
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const port = server.address().port
const temp = await mkdtemp(path.join(os.tmpdir(), 'ssh-pty-test-'))
const paths = { configPath: path.join(temp, 'config'), backupDir: path.join(temp, 'backups'), stateDir: path.join(temp, 'state') }
try {
  await mkdir(temp, { recursive: true })
  await writeFile(paths.configPath, `Host local\n  HostName 127.0.0.1\n  User tester\n  Port ${port}\n`, 'utf8')
  await setPassword(paths, 'local', 'secret')
  const socket = new FakeSocket()
  const ctx = { get: () => ({ requestRejection: () => undefined }) }
  await __test.handlePtyUpgrade(ctx, paths, { headers: { upgrade: 'websocket', 'sec-websocket-key': 'dGhlIHNhbXBsZSBub25jZQ==', 'sec-websocket-version': '13' } }, socket, Buffer.alloc(0))
  // wait for handshake then send open
  const waitFor = async (predicate, timeout=5000) => {
    const started=Date.now()
    while (Date.now()-started < timeout) {
      const raw = Buffer.concat(socket.chunks)
      const boundary = raw.indexOf('\r\n\r\n')
      const frames = boundary >= 0 ? parseServerFrames(raw.subarray(boundary+4)).frames : []
      const hit = frames.find(predicate)
      if (hit) return hit
      await new Promise(r=>setTimeout(r,20))
    }
    throw new Error('timeout waiting for frame')
  }
  socket.emit('data', clientFrame(1, JSON.stringify({type:'open', host:'local', cols:80, rows:24})))
  let frame = await waitFor(f=>f.opcode===1 && JSON.parse(f.payload.toString()).type==='ready')
  const ready = JSON.parse(frame.payload.toString())
  assert.equal(ready.type,'ready')
  socket.emit('data', clientFrame(1, JSON.stringify({type:'input', data:'uptime\r'})))
  frame = await waitFor(f=>f.opcode===2 && f.payload.toString().includes('uptime -> pty 80x24'))
  assert.ok(frame.payload.toString().includes('uptime -> pty 80x24'))
  socket.emit('data', clientFrame(1, JSON.stringify({type:'resize', cols:100, rows:30})))
  await new Promise(r=>setTimeout(r,100))
  socket.emit('data', clientFrame(1, JSON.stringify({type:'input', data:'scan\r'})))
  frame = await waitFor(f=>f.opcode===2 && f.payload.toString().includes('scan -> pty 100x30'))
  assert.ok(frame.payload.toString().includes('scan -> pty 100x30'))
  socket.emit('data', clientFrame(1, JSON.stringify({type:'close'})))
  await new Promise(r=>setTimeout(r,100))
  console.log('ok - PTY websocket end-to-end against mock ssh server (ready/input/resize/close)')
} finally {
  await rm(temp, { recursive: true, force: true })
  server.close()
}
