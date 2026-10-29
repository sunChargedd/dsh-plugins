import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { acceptWebSocket, isWebSocketUpgrade } from './lib/ws.js'
import { resolveSshPaths, listSshHosts, saveSshHost, deleteSshHost } from './lib/ssh-config.js'
import { deleteMetadata, loadMetadata, updateMetadata } from './lib/metadata.js'
import { batchExec, deleteRemotePath, downloadFile, execCommand, inspectHost, listRemoteFiles, makeRemoteDirectory, openPty, renameRemotePath, testConnection, uploadFile } from './lib/ssh-client.js'
import { storagePaths } from './lib/storage.js'
import { getPassword, listPasswordAliases, removePassword, setPassword } from './lib/vault.js'

const STATE_ROUTE = '/dsh-ssh-manage/state'
const ACTION_ROUTE = '/dsh-ssh-manage/action'
const PTY_ROUTE = '/dsh-ssh-manage/pty'
const PTY_EVENTS_ROUTE = '/dsh-ssh-manage/pty/events'
const PTY_OPEN_ROUTE = '/dsh-ssh-manage/pty/open'
const PTY_INPUT_ROUTE = '/dsh-ssh-manage/pty/input'
const PTY_RESIZE_ROUTE = '/dsh-ssh-manage/pty/resize'
const PTY_ATTACH_ROUTE = '/dsh-ssh-manage/pty/attach'
const PTY_CLOSE_ROUTE = '/dsh-ssh-manage/pty/close'
const PTY_CLEAR_ROUTE = '/dsh-ssh-manage/pty/clear'
const PTY_TOUCH_ROUTE = '/dsh-ssh-manage/pty/touch'
const MAX_PTY_SESSIONS = 16
const PTY_BUFFER_BYTES = 256 * 1024
const PTY_IDLE_MS = 30 * 60 * 1000
const MAX_PTY_BUFFER_BYTES = 4 * 1024 * 1024
const PACKAGE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = [
  { path: '/dsh-ssh-manage/assets/xterm.js', file: 'xterm.js', contentType: 'text/javascript; charset=utf-8' },
  { path: '/dsh-ssh-manage/assets/xterm.css', file: 'xterm.css', contentType: 'text/css; charset=utf-8' },
  { path: '/dsh-ssh-manage/assets/addon-fit.js', file: 'addon-fit.js', contentType: 'text/javascript; charset=utf-8' },
  { path: '/dsh-ssh-manage/assets/addon-search.js', file: 'addon-search.js', contentType: 'text/javascript; charset=utf-8' },
]
const MAX_BODY_BYTES = 16 * 1024 * 1024
const ACTIONS = ['overview', 'list_hosts', 'save_host', 'delete_host', 'set_metadata', 'save_password', 'delete_password', 'test_connection', 'inspect_host', 'exec', 'batch_exec', 'sftp_list', 'sftp_upload', 'sftp_download', 'sftp_mkdir', 'sftp_rename', 'sftp_delete']

async function readJsonBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.byteLength
    if (size > MAX_BODY_BYTES) {
      req.resume()
      return undefined
    }
    chunks.push(chunk)
  }
  if (size === 0) return undefined
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return undefined
  }
}

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(payload))
}

function rejectUnauthenticated(ctx, req, res) {
  const connection = ctx.get('connection')
  const requestRejection = connection?.requestRejection
  if (typeof requestRejection !== 'function') {
    sendJson(res, 403, { ok: false, error: { code: 'untrusted', message: 'No connection service' } })
    return true
  }
  const rejection = requestRejection.call(connection, req)
  if (rejection === undefined) return false
  res.statusCode = rejection
  res.end()
  return true
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

async function state(paths) {
  const [current, metadataResult, passwordsResult] = await Promise.all([
    listSshHosts(paths),
    loadMetadata(paths).then((value) => ({ value }), (error) => ({ error })),
    listPasswordAliases(paths).then((value) => ({ value }), (error) => ({ error })),
  ])
  const warnings = []
  let entries = {}
  if ('error' in metadataResult) warnings.push({ store: 'metadata', message: errorMessage(metadataResult.error) })
  else entries = metadataResult.value.entries
  let passwords = []
  if ('error' in passwordsResult) warnings.push({ store: 'vault', message: errorMessage(passwordsResult.error) })
  else passwords = passwordsResult.value
  const passwordSet = new Set(passwords)
  const stateDir = storagePaths(paths).stateDir
  return {
    ...current,
    stateDir,
    backupDir: paths.backupDir || path.join(stateDir, 'backups'),
    hosts: current.hosts.map((host) => ({ ...host, ...(entries[host.host] || {}), passwordConfigured: passwordSet.has(host.host) })),
    warnings,
  }
}

function requireString(params, key) {
  if (typeof params?.[key] !== 'string' || params[key].trim() === '') throw new Error(`"${key}" is required`)
  return params[key].trim()
}

async function findHost(paths, alias) {
  const name = requireString({ host: alias }, 'host')
  const current = await listSshHosts(paths)
  const host = current.hosts.find((entry) => entry.host === name)
  if (!host) throw new Error(`SSH host "${name}" was not found`)
  return host
}

async function requirePassword(paths, host) {
  const password = await getPassword(paths, host.host)
  if (!password) throw new Error(`Password is not configured for SSH host "${host.host}"`)
  return password
}

/** Move metadata and the encrypted password from a previous alias to the renamed host. */
async function migrateAlias(paths, from, to) {
  if (!from || from === to) return
  const metadata = await loadMetadata(paths)
  if (metadata.entries[from]) {
    await updateMetadata(paths, to, metadata.entries[from])
    await deleteMetadata(paths, from)
  }
  try {
    const password = await getPassword(paths, from)
    if (password) {
      await setPassword(paths, to, password)
      await removePassword(paths, from)
    }
  } catch {
    // The SSH config rename already succeeded; password migration is best effort.
  }
}

export async function runAction(paths, action, params = {}) {
  switch (action) {
    case 'state/refresh':
      return { state: await state(paths) }
    case 'host/save': {
      const originalHost = typeof params.originalHost === 'string' ? params.originalHost.trim() : ''
      const result = await saveSshHost({
        paths,
        originalHost: originalHost || undefined,
        host: params.host,
      })
      if (originalHost && originalHost !== result.host.host) await migrateAlias(paths, originalHost, result.host.host)
      return { ...result, state: await state(paths) }
    }
    case 'host/delete': {
      const alias = requireString(params, 'host')
      const result = await deleteSshHost({ paths, host: alias })
      await removePassword(paths, alias)
      await deleteMetadata(paths, alias)
      return { ...result, state: await state(paths) }
    }
    case 'credential/save': {
      const alias = requireString(params, 'host')
      await findHost(paths, alias)
      return await setPassword(paths, alias, params.password)
    }
    case 'credential/delete':
      return await removePassword(paths, requireString(params, 'host'))
    case 'host/metadata': {
      const alias = requireString(params, 'host')
      await findHost(paths, alias)
      const metadata = await updateMetadata(paths, alias, params.metadata || {})
      return { metadata, state: await state(paths) }
    }
    case 'ssh/test': {
      const host = await findHost(paths, params.host)
      const password = await requirePassword(paths, host)
      const started = Date.now()
      const result = await testConnection(host, password)
      const latencyMs = Math.round(Date.now() - started)
      const metadata = await updateMetadata(paths, host.host, { latencyMs, checkedAt: new Date().toISOString() })
      return { ...result, latencyMs, metadata, state: await state(paths) }
    }
    case 'ssh/inspect': {
      const host = await findHost(paths, params.host)
      const result = await inspectHost(host, await requirePassword(paths, host))
      const metadata = await updateMetadata(paths, host.host, {
        system: result.system,
        cpuCores: result.cpuCores,
        memoryGB: result.memoryGB,
        diskGB: result.diskGB,
        latencyMs: result.latencyMs,
        checkedAt: new Date().toISOString(),
      })
      return { ...result, metadata, state: await state(paths) }
    }
    case 'ssh/exec': {
      const host = await findHost(paths, params.host)
      return await execCommand(host, await requirePassword(paths, host), requireString(params, 'command'), params)
    }
    case 'ssh/batch-exec': {
      const aliases = Array.isArray(params.hosts) ? params.hosts : []
      if (aliases.length === 0) throw new Error('hosts is required')
      const hosts = await Promise.all(aliases.map((alias) => findHost(paths, alias)))
      return { results: await batchExec(hosts, (host) => requirePassword(paths, host), requireString(params, 'command'), params) }
    }
    case 'sftp/list': {
      const host = await findHost(paths, params.host)
      return { entries: await listRemoteFiles(host, await requirePassword(paths, host), params.path || '.') }
    }
    case 'sftp/upload': {
      const host = await findHost(paths, params.host)
      return await uploadFile(host, await requirePassword(paths, host), requireString(params, 'path'), requireString(params, 'contentBase64'))
    }
    case 'sftp/download': {
      const host = await findHost(paths, params.host)
      return await downloadFile(host, await requirePassword(paths, host), requireString(params, 'path'))
    }
    case 'sftp/mkdir': {
      const host = await findHost(paths, params.host)
      return await makeRemoteDirectory(host, await requirePassword(paths, host), requireString(params, 'path'))
    }
    case 'sftp/rename': {
      const host = await findHost(paths, params.host)
      return await renameRemotePath(host, await requirePassword(paths, host), requireString(params, 'path'), requireString(params, 'newPath'), { overwrite: params.overwrite === true })
    }
    case 'sftp/delete': {
      const host = await findHost(paths, params.host)
      return await deleteRemotePath(host, await requirePassword(paths, host), requireString(params, 'path'))
    }
    default:
      throw new Error(`Unknown action: ${String(action)}`)
  }
}

function managerTool(paths) {
  return {
    name: 'ssh_manager',
    description: 'Manage SSH hosts, encrypted local passwords, remote commands and SFTP operations. Passwords are never returned.',
    parameters: {
      type: 'object',
      additionalProperties: false,
      required: ['action'],
      properties: {
        action: { type: 'string', enum: ACTIONS, description: 'The operation to run.' },
        host: {
          oneOf: [{ type: 'string' }, { type: 'object' }],
          description: 'Host alias as a string for every action except save_host, which takes a host object: { host, hostname, user, port, identityFile, proxyJump, forwardAgent }.',
        },
        originalHost: { type: 'string', description: 'Existing alias when renaming a host.' },
        password: { type: 'string', description: 'Password to save for a host. It is write-only.' },
        command: { type: 'string', description: 'Remote shell command.' },
        hosts: { type: 'array', items: { type: 'string' }, description: 'Host aliases for a batch command.' },
        path: { type: 'string', description: 'Remote SFTP path.' },
        newPath: { type: 'string', description: 'New remote SFTP path for rename.' },
        overwrite: { type: 'boolean', description: 'Allow sftp_rename to replace an existing destination (default false).' },
        contentBase64: { type: 'string', description: 'Base64 encoded file content for upload.' },
        metadata: { type: 'object', description: '{ group, tags, favorite, label, note, system, cpuCores, memoryGB, diskGB, latencyMs, checkedAt }' },
      },
    },
    output: {
      schema: { type: 'object' },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    },
    execute: async (args) => {
      const input = args && typeof args === 'object' ? args : {}
      const params = { ...input }
      if (input.action !== 'save_host' && input.host && typeof input.host === 'object') params.host = input.host.host
      switch (input.action) {
        case 'overview': {
          const current = await state(paths)
          return { configPath: current.configPath, hostCount: current.hosts.length }
        }
        case 'list_hosts':
          return await state(paths)
        case 'save_host':
          return await runAction(paths, 'host/save', params)
        case 'delete_host':
          return await runAction(paths, 'host/delete', params)
        case 'set_metadata':
          return await runAction(paths, 'host/metadata', params)
        case 'save_password':
          return await runAction(paths, 'credential/save', params)
        case 'delete_password':
          return await runAction(paths, 'credential/delete', params)
        case 'test_connection':
          return await runAction(paths, 'ssh/test', params)
        case 'inspect_host':
          return await runAction(paths, 'ssh/inspect', params)
        case 'exec':
          return await runAction(paths, 'ssh/exec', params)
        case 'batch_exec':
          return await runAction(paths, 'ssh/batch-exec', params)
        case 'sftp_list':
          return await runAction(paths, 'sftp/list', params)
        case 'sftp_upload':
          return await runAction(paths, 'sftp/upload', params)
        case 'sftp_download':
          return await runAction(paths, 'sftp/download', params)
        case 'sftp_mkdir':
          return await runAction(paths, 'sftp/mkdir', params)
        case 'sftp_rename':
          return await runAction(paths, 'sftp/rename', params)
        case 'sftp_delete':
          return await runAction(paths, 'sftp/delete', params)
        default:
          throw new Error(`Unknown action: ${String(input.action)}`)
      }
    },
  }
}

const ptySessions = new Set()
const ptyTextSessions = new Map()
const ptyPendingIds = new Set()
const ptyEventClients = new Set()
let ptyOpening = 0

function createPtyRuntime() {
  return { generation: 0, active: true, upgrades: new Set() }
}

const defaultPtyRuntime = createPtyRuntime()

function isPtyRuntimeActive(runtime, generation) {
  return runtime.active && runtime.generation === generation
}

function closeTextSession(id, notify = true) {
  const entry = ptyTextSessions.get(id)
  if (!entry) return
  ptyTextSessions.delete(id)
  try { entry.session.close() } catch {}
  if (notify) broadcastPty({ kind: 'exit', id })
}

function writePtyEvent(client, event) {
  if (client.res.writableEnded) {
    ptyEventClients.delete(client)
    return
  }
  if (client.res.writableLength > 8 * 1024 * 1024) {
    ptyEventClients.delete(client)
    try { client.res.destroy() } catch {}
    return
  }
  try {
    client.res.write(`data: ${JSON.stringify(event)}\n\n`)
  } catch {
    ptyEventClients.delete(client)
  }
}

function broadcastPty(event) {
  for (const client of [...ptyEventClients]) writePtyEvent(client, event)
}

async function openTextSession(paths, payload, runtime = defaultPtyRuntime) {
  if (!runtime.active) throw new Error('Terminal runtime is not active')
  const id = typeof payload?.id === 'string' ? payload.id.trim() : ''
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(id)) throw new Error('A valid session id is required')
  const cols = boundedInteger(payload?.cols, 20, 500, 120)
  const rows = boundedInteger(payload?.rows, 5, 300, 32)
  const alias = typeof payload?.host === 'string' ? payload.host.trim() : ''
  if (alias === '') throw new Error('host is required')
  if (ptyTextSessions.has(id) || ptyPendingIds.has(id)) throw new Error('Terminal session already exists')
  const generation = runtime.generation
  ptyPendingIds.add(id)
  ptyOpening += 1
  try {
    if (ptySessions.size + ptyTextSessions.size + ptyOpening > MAX_PTY_SESSIONS) {
      throw new Error('Too many terminal sessions')
    }
    const host = await findHost(paths, alias)
    const password = await requirePassword(paths, host)
    if (!isPtyRuntimeActive(runtime, generation)) throw new Error('Terminal runtime is not active')
    const session = await openPty(host, password, { cols, rows })
    if (!isPtyRuntimeActive(runtime, generation)) {
      try { session.close() } catch {}
      throw new Error('Terminal runtime is not active')
    }
    if (ptyTextSessions.has(id)) {
      try { session.close() } catch {}
      throw new Error('Terminal session already exists')
    }
    const entry = { id, session, cols, rows, lastActivity: Date.now(), seq: 0, buffer: [], bufferBytes: 0 }
    ptyTextSessions.set(id, entry)
    session.stream.on('data', (chunk) => {
      entry.lastActivity = Date.now()
      const copy = Buffer.from(chunk)
      entry.seq += 1
      entry.buffer.push(copy)
      entry.bufferBytes += copy.length
      while (entry.bufferBytes > PTY_BUFFER_BYTES && entry.buffer.length > 0) {
        entry.bufferBytes -= entry.buffer.shift().length
      }
      broadcastPty({ kind: 'output', id, seq: entry.seq, data: copy.toString('base64') })
    })
    session.stream.on('close', () => {
      closeTextSession(id)
    })
    session.stream.on('error', (error) => {
      closeTextSession(id, false)
      broadcastPty({ kind: 'error', id, message: errorMessage(error) })
    })
    session.client.on('error', (error) => {
      closeTextSession(id, false)
      broadcastPty({ kind: 'error', id, message: errorMessage(error) })
    })
    return { id, seq: 0, cols, rows, output: '' }
  } finally {
    ptyPendingIds.delete(id)
    ptyOpening -= 1
  }
}

function registerPtyHttpRoutes(ctx, paths, runtime) {
  const register = (route, label) => {
    ctx.effect(() => ctx.webServer.register(route), `dsh-ssh-manage: ${label}`)
  }

  register(
    {
      kind: 'exact',
      path: PTY_EVENTS_ROUTE,
      handler: (req, res) => {
        if (rejectUnauthenticated(ctx, req, res)) return
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.setHeader('allow', 'GET')
          res.end()
          return
        }
        res.writeHead(200, {
          'content-type': 'text/event-stream; charset=utf-8',
          'cache-control': 'no-cache, no-transform',
          connection: 'keep-alive',
          'x-accel-buffering': 'no',
        })
        res.write(': connected\n\n')
        const client = { res }
        ptyEventClients.add(client)
        const heartbeat = setInterval(() => {
          try {
            res.write(': ping\n\n')
          } catch {
            clearInterval(heartbeat)
            ptyEventClients.delete(client)
          }
        }, 20_000)
        heartbeat.unref?.()
        const cleanup = () => {
          clearInterval(heartbeat)
          ptyEventClients.delete(client)
        }
        req.on('close', cleanup)
        res.on('close', cleanup)
        res.on('error', cleanup)
      },
    },
    'pty events route',
  )

  register(
    {
      kind: 'exact',
      path: PTY_OPEN_ROUTE,
      handler: async (req, res) => {
        if (rejectUnauthenticated(ctx, req, res)) return
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        const body = await readJsonBody(req)
        try {
          const value = await openTextSession(paths, body ?? {}, runtime)
          sendJson(res, 200, { ok: true, value })
        } catch (error) {
          sendJson(res, 200, { ok: false, error: { code: 'pty-open-failed', message: errorMessage(error) } })
        }
      },
    },
    'pty open route',
  )

  register(
    {
      kind: 'exact',
      path: PTY_ATTACH_ROUTE,
      handler: async (req, res) => {
        if (rejectUnauthenticated(ctx, req, res)) return
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        const body = (await readJsonBody(req)) ?? {}
        const id = typeof body.id === 'string' ? body.id : ''
        const entry = ptyTextSessions.get(id)
        if (!entry) {
          sendJson(res, 200, { ok: false, error: { code: 'pty-session-missing', message: 'Terminal session was not found' } })
          return
        }
        try {
          entry.lastActivity = Date.now()
          entry.cols = boundedInteger(body.cols, 20, 500, entry.cols)
          entry.rows = boundedInteger(body.rows, 5, 300, entry.rows)
          entry.session.stream.setWindow(entry.rows, entry.cols, 0, 0)
          const output = Buffer.concat(entry.buffer, entry.bufferBytes).toString('base64')
          sendJson(res, 200, {
            ok: true,
            value: { id, seq: entry.seq, cols: entry.cols, rows: entry.rows, output },
          })
        } catch (error) {
          sendJson(res, 200, { ok: false, error: { code: 'pty-attach-failed', message: errorMessage(error) } })
        }
      },
    },
    'pty attach route',
  )

  for (const [path, action, label] of [
    [PTY_INPUT_ROUTE, 'input', 'pty input route'],
    [PTY_RESIZE_ROUTE, 'resize', 'pty resize route'],
    [PTY_CLOSE_ROUTE, 'close', 'pty close route'],
    [PTY_CLEAR_ROUTE, 'clear', 'pty clear route'],
  ]) {
    register(
      {
        kind: 'exact',
        path,
        handler: async (req, res) => {
          if (rejectUnauthenticated(ctx, req, res)) return
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end()
            return
          }
          const body = (await readJsonBody(req)) ?? {}
          const id = typeof body.id === 'string' ? body.id : ''
          const entry = ptyTextSessions.get(id)
          if (!entry) {
            sendJson(res, 200, { ok: false, error: { code: 'pty-session-missing', message: 'Terminal session was not found' } })
            return
          }
          try {
            if (action === 'input') {
              if (typeof body.data === 'string' && body.data.length > 0 && body.data.length <= 65_536) {
                entry.session.stream.write(Buffer.from(body.data, 'utf8'))
              }
            } else if (action === 'resize') {
              entry.session.stream.setWindow(
                boundedInteger(body.rows, 5, 300, 32),
                boundedInteger(body.cols, 20, 500, 120),
                0,
                0,
              )
            } else if (action === 'clear') {
              entry.buffer = []
              entry.bufferBytes = 0
              broadcastPty({ kind: 'clear', id })
            } else {
              closeTextSession(id)
            }
            entry.lastActivity = Date.now()
            sendJson(res, 200, { ok: true, value: {} })
          } catch (error) {
            sendJson(res, 200, { ok: false, error: { code: 'pty-operation-failed', message: errorMessage(error) } })
          }
        },
      },
      label,
    )
  }

  register(
    {
      kind: 'exact',
      path: PTY_TOUCH_ROUTE,
      handler: async (req, res) => {
        if (rejectUnauthenticated(ctx, req, res)) return
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('allow', 'POST')
          res.end()
          return
        }
        const body = (await readJsonBody(req)) ?? {}
        const ids = Array.isArray(body.ids) ? body.ids.slice(0, 256) : []
        const now = Date.now()
        let touched = 0
        for (const id of ids) {
          if (typeof id !== 'string') continue
          const entry = ptyTextSessions.get(id)
          if (!entry) continue
          entry.lastActivity = now
          touched += 1
        }
        sendJson(res, 200, { ok: true, value: { touched } })
      },
    },
    'pty touch route',
  )
}

/** Close every PTY text session idle beyond PTY_IDLE_MS and return the number reaped. */
function sweepIdlePtySessions(now = Date.now()) {
  let reaped = 0
  for (const [id, entry] of [...ptyTextSessions]) {
    if (now - entry.lastActivity > PTY_IDLE_MS) {
      closeTextSession(id)
      reaped += 1
    }
  }
  return reaped
}

function boundedInteger(value, min, max, fallback) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return fallback
  return Math.min(Math.max(Math.round(numeric), min), max)
}

function denyUpgrade(socket, status) {
  try {
    const reason = status === 401 ? 'Unauthorized' : 'Forbidden'
    socket.write(`HTTP/1.1 ${status} ${reason}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`)
  } catch {}
  try {
    socket.destroy()
  } catch {}
}

/** Apply the Connection service trust checks to a raw upgrade request. */
function upgradeRejection(ctx, req) {
  const connection = ctx.get('connection')
  if (typeof connection?.requestRejection !== 'function') return 403
  const rejection = connection.requestRejection(req)
  return rejection === undefined ? undefined : rejection
}

async function handlePtyUpgrade(ctx, paths, req, socket, head, runtime = defaultPtyRuntime) {
  if (!runtime.active) {
    denyUpgrade(socket, 403)
    return
  }
  if (!isWebSocketUpgrade(req)) {
    try { socket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nContent-Length: 0\r\n\r\n') } catch {}
    socket.destroy()
    return
  }
  const rejection = upgradeRejection(ctx, req)
  if (rejection !== undefined) {
    denyUpgrade(socket, rejection)
    return
  }
  const ws = acceptWebSocket(req, socket, head)
  if (!ws) return
  const generation = runtime.generation
  let session = null
  let opening = false
  let cleaned = false
  let paused = false
  let shutdown = null
  const keepalive = setInterval(() => ws.ping(), 25_000)
  keepalive.unref?.()
  const cleanup = () => {
    if (cleaned) return
    cleaned = true
    clearInterval(keepalive)
    if (shutdown) runtime.upgrades.delete(shutdown)
    if (session) {
      ptySessions.delete(session)
      try { session.close() } catch {}
      session = null
    }
  }
  shutdown = () => {
    cleanup()
    try { ws.close(1001) } catch {}
  }
  runtime.upgrades.add(shutdown)
  ws.on('close', cleanup)
  socket.on('drain', () => {
    if (!paused || !session) return
    paused = false
    try { session.stream.resume() } catch {}
  })
  ws.on('message', async ({ binary, data }) => {
    if (binary) return
    let message
    try {
      message = JSON.parse(data.toString('utf8'))
    } catch {
      return
    }
    if (!message || typeof message.type !== 'string' || cleaned) return
    if (!session) {
      if (message.type !== 'open' || opening || !runtime.active) return
      opening = true
      ptyOpening += 1
      try {
        if (ptySessions.size + ptyTextSessions.size + ptyOpening > MAX_PTY_SESSIONS) throw new Error('Too many terminal sessions')
        const alias = typeof message.host === 'string' ? message.host.trim() : ''
        if (alias === '') throw new Error('host is required')
        const cols = boundedInteger(message.cols, 20, 500, 120)
        const rows = boundedInteger(message.rows, 5, 300, 32)
        const host = await findHost(paths, alias)
        const password = await requirePassword(paths, host)
        if (!isPtyRuntimeActive(runtime, generation)) throw new Error('Terminal runtime is not active')
        session = await openPty(host, password, { cols, rows })
        if (cleaned || !isPtyRuntimeActive(runtime, generation)) {
          try { session.close() } catch {}
          session = null
          return
        }
        ptySessions.add(session)
        const active = session
        active.stream.on('data', (chunk) => {
          if (ws.bufferedAmount() > MAX_PTY_BUFFER_BYTES) {
            if (!paused) {
              paused = true
              try { active.stream.pause() } catch {}
            }
          }
          ws.sendBinary(chunk)
        })
        active.stream.on('close', () => {
          ws.sendText(JSON.stringify({ type: 'exit' }))
          cleanup()
          try { ws.close(1000) } catch {}
        })
        active.stream.on('error', (error) => {
          ws.sendText(JSON.stringify({ type: 'error', message: errorMessage(error) }))
          cleanup()
          try { ws.close(1011) } catch {}
        })
        active.client.on('error', (error) => {
          ws.sendText(JSON.stringify({ type: 'error', message: errorMessage(error) }))
          cleanup()
          try { ws.close(1011) } catch {}
        })
        ws.sendText(JSON.stringify({ type: 'ready', cols, rows }))
      } catch (error) {
        try { ws.sendText(JSON.stringify({ type: 'error', message: errorMessage(error) })) } catch {}
        cleanup()
        try { ws.close(1011) } catch {}
      } finally {
        ptyOpening -= 1
        opening = false
      }
      return
    }
    if (message.type === 'input') {
      if (typeof message.data === 'string' && message.data.length > 0 && message.data.length <= 65_536) {
        try { session.stream.write(Buffer.from(message.data, 'utf8')) } catch {}
      }
    } else if (message.type === 'resize') {
      try {
        session.stream.setWindow(
          boundedInteger(message.rows, 5, 300, 32),
          boundedInteger(message.cols, 20, 500, 120),
          0,
          0,
        )
      } catch {}
    } else if (message.type === 'close') {
      cleanup()
      try { ws.close(1000) } catch {}
    }
  })
}

function registerAssetRoutes(ctx) {
  for (const asset of ASSETS) {
    let bodyPromise
    const load = () => {
      bodyPromise ??= readFile(path.join(PACKAGE_DIRECTORY, 'assets', asset.file)).catch((error) => {
        bodyPromise = undefined
        throw error
      })
      return bodyPromise
    }
    ctx.effect(
      () =>
        ctx.webServer.register({
          kind: 'exact',
          path: asset.path,
          handler: async (req, res) => {
            if (rejectUnauthenticated(ctx, req, res)) return
            if (req.method !== 'GET' && req.method !== 'HEAD') {
              res.statusCode = 405
              res.setHeader('allow', 'GET, HEAD')
              res.end()
              return
            }
            try {
              const body = await load()
              res.statusCode = 200
              res.setHeader('content-type', asset.contentType)
              res.setHeader('cache-control', 'public, max-age=3600')
              res.setHeader('content-length', String(body.length))
              res.end(req.method === 'HEAD' ? undefined : body)
            } catch {
              res.statusCode = 404
              res.end()
            }
          },
        }),
      `dsh-ssh-manage: asset ${asset.file}`,
    )
  }
}

export const __test = { resolveSshPaths, listSshHosts, saveSshHost, deleteSshHost, runAction, managerTool, MAX_BODY_BYTES, PTY_ROUTE, PTY_EVENTS_ROUTE, PTY_OPEN_ROUTE, PTY_ATTACH_ROUTE, PTY_INPUT_ROUTE, PTY_RESIZE_ROUTE, PTY_CLOSE_ROUTE, PTY_CLEAR_ROUTE, PTY_TOUCH_ROUTE, PTY_IDLE_MS, sweepIdlePtySessions, MAX_PTY_SESSIONS, PTY_BUFFER_BYTES, ASSETS, handlePtyUpgrade, ptyTextSessions }

export const inject = ['webServer']

export function apply(ctx) {
  if (!ctx || typeof ctx.webServer?.register !== 'function') {
    throw new Error('dsh-ssh-manage requires DeepSeek Harness >=0.2.1-rc.3: ctx.webServer.register is unavailable.')
  }
  const paths = resolveSshPaths(process.env)
  const runtime = createPtyRuntime()
  const runtimeIdleTimer = setInterval(() => {
    if (!runtime.active) return
    // Browser heartbeats (/pty/touch) keep attached sessions alive, so a session
    // left behind by a closed tab is reclaimed even while another tab retains
    // an SSE stream. All liveness sources refresh lastActivity.
    sweepIdlePtySessions()
  }, 60_000)
  runtimeIdleTimer.unref?.()
  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'exact',
        path: STATE_ROUTE,
        handler: async (req, res) => {
          if (rejectUnauthenticated(ctx, req, res)) return
          if (req.method !== 'GET') {
            res.statusCode = 405
            res.setHeader('allow', 'GET')
            res.end()
            return
          }
          try {
            sendJson(res, 200, { ok: true, value: { state: await state(paths) } })
          } catch (error) {
            sendJson(res, 200, { ok: false, error: { code: 'operation-failed', message: errorMessage(error) } })
          }
        },
      }),
    'dsh-ssh-manage: state route',
  )
  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'exact',
        path: ACTION_ROUTE,
        handler: async (req, res) => {
          if (rejectUnauthenticated(ctx, req, res)) return
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.setHeader('allow', 'POST')
            res.end()
            return
          }
          const body = await readJsonBody(req)
          if (!body || typeof body !== 'object' || typeof body.action !== 'string') {
            sendJson(res, 400, { ok: false, error: { code: 'invalid-body', message: 'Expected { action, ...params }' } })
            return
          }
          try {
            sendJson(res, 200, { ok: true, value: await runAction(paths, body.action, body) })
          } catch (error) {
            sendJson(res, 200, { ok: false, error: { code: 'operation-failed', message: errorMessage(error) } })
          }
        },
      }),
    'dsh-ssh-manage: action route',
  )
  registerPtyHttpRoutes(ctx, paths, runtime)
  registerAssetRoutes(ctx)
  if (typeof ctx.webServer.tapIndex === 'function') {
    const tags = [
      '<link id="dsh-ssh-manage-xterm-css" rel="stylesheet" href="/dsh-ssh-manage/assets/xterm.css">',
      '<script id="dsh-ssh-manage-xterm-script" src="/dsh-ssh-manage/assets/xterm.js"></script>',
      '<script id="dsh-ssh-manage-xterm-fit" src="/dsh-ssh-manage/assets/addon-fit.js"></script>',
    ].join('')
    ctx.effect(
      () =>
        ctx.webServer.tapIndex((html) =>
          html.includes('dsh-ssh-manage/assets/xterm.js') ? html : html.replace('</head>', `${tags}</head>`),
        ),
      'dsh-ssh-manage: terminal asset preload',
    )
  }
  ctx.effect(
    () =>
      ctx.webServer.registerUpgrade({
        path: PTY_ROUTE,
        handler: (req, socket, head) => {
          void handlePtyUpgrade(ctx, paths, req, socket, head, runtime).catch(() => {
            try { socket.destroy() } catch {}
          })
        },
      }),
    'dsh-ssh-manage: pty upgrade route',
  )
  ctx.effect(
    () => () => {
      runtime.active = false
      runtime.generation += 1
      for (const shutdown of [...runtime.upgrades]) {
        try { shutdown() } catch {}
      }
      runtime.upgrades.clear()
      clearInterval(runtimeIdleTimer)
      for (const session of ptySessions) {
        try { session.close() } catch {}
      }
      ptySessions.clear()
      ptyPendingIds.clear()
      for (const id of [...ptyTextSessions.keys()]) closeTextSession(id)
      for (const client of [...ptyEventClients]) {
        try { client.res.end() } catch {}
      }
      ptyEventClients.clear()
    },
    'dsh-ssh-manage: pty sessions',
  )
  ctx.inject(['tools'], (child) => {
    child.effect(() => child.tools.register(managerTool(paths)), 'dsh-ssh-manage: agent tool')
  })
}
