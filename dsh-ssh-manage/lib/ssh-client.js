import { Client } from 'ssh2'
import { verifyHostKey } from './known-hosts.js'

const DEFAULT_TIMEOUT = 15_000
const MAX_OUTPUT_BYTES = 1024 * 1024
const MAX_FILE_BYTES = 10 * 1024 * 1024
const PROBE_COMMAND = [
  'SYS=$(uname -s 2>/dev/null)',
  `OS=$(sed -n 's/^PRETTY_NAME=//p' /etc/os-release 2>/dev/null | head -n 1 | tr -d '"')`,
  'CORES=$(nproc 2>/dev/null || getconf _NPROCESSORS_ONLN 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null)',
  `MEM_MB=$(free -m 2>/dev/null | awk '/^Mem:/{print $2}')`,
  `if [ -z "$MEM_MB" ]; then MEM_MB=$(awk '/^MemTotal:/{print int($2/1024)}' /proc/meminfo 2>/dev/null); fi`,
  `DISK_MB=$(df -mP / 2>/dev/null | awk 'NR==2{print $2}')`,
  `printf 'SYS=%s\\nOS=%s\\nCORES=%s\\nMEM_MB=%s\\nDISK_MB=%s\\n' "$SYS" "$OS" "$CORES" "$MEM_MB" "$DISK_MB"`,
].join('\n')

function connectionConfig(host, password, verifyState = {}) {
  const label = host.host || host.hostname || ''
  const config = {
    host: host.hostname || host.host,
    port: Number(host.port || 22),
    username: host.user || undefined,
    password,
    readyTimeout: DEFAULT_TIMEOUT,
    keepaliveInterval: 15_000,
    keepaliveCountMax: 3,
    tryKeyboard: true,
    hostVerifier: (key) => {
      // Emergency-only escape hatch: disables host-key verification entirely.
      if (process.env.DSH_SSH_MANAGER_INSECURE_HOSTKEY === '1') return true
      const result = verifyHostKey(host, key)
      if (result.ok) return true
      const expected = result.expected ? ` (expected ${result.expected})` : ''
      verifyState.error = new Error(
        `Host key verification failed for "${label}": ${result.reason}${expected} (fingerprint ${result.fingerprint}; known_hosts: ${result.path})`,
      )
      return false
    },
  }
  if (host.proxyJump) throw new Error('ProxyJump is not supported by the plugin transport yet')
  return config
}

function connect(host, password, timeout = DEFAULT_TIMEOUT) {
  if (typeof password !== 'string' || password.length === 0) return Promise.reject(new Error('Password is required'))
  return new Promise((resolve, reject) => {
    const client = new Client()
    const verifyState = {}
    let settled = false
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      client.end()
      reject(new Error('SSH connection timed out'))
    }, timeout)
    const fail = (error) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      client.end()
      const reported = verifyState.error ?? error
      reject(reported instanceof Error ? reported : new Error(String(reported)))
    }
    client.once('ready', () => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve(client)
    })
    client.once('error', fail)
    // Some hardened hosts only offer keyboard-interactive with the same password.
    client.on('keyboard-interactive', (_name, _instructions, _language, prompts, finish) => {
      finish(prompts.map(() => password))
    })
    try { client.connect(connectionConfig(host, password, verifyState)) } catch (error) { fail(error) }
  })
}

function execOnClient(client, command, timeout) {
  return new Promise((resolve, reject) => {
    let stdout = ''
    let stderr = ''
    let settled = false
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      reject(new Error('Remote command timed out'))
    }, timeout)
    client.exec(command, (error, stream) => {
      if (error) { clearTimeout(timer); reject(error); return }
      stream.on('data', (chunk) => { if (Buffer.byteLength(stdout) < MAX_OUTPUT_BYTES) stdout += chunk.toString('utf8') })
      stream.stderr.on('data', (chunk) => { if (Buffer.byteLength(stderr) < MAX_OUTPUT_BYTES) stderr += chunk.toString('utf8') })
      stream.on('close', (code, signal) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        resolve({ code: code ?? 0, signal: signal || null, stdout, stderr, truncated: Buffer.byteLength(stdout) >= MAX_OUTPUT_BYTES || Buffer.byteLength(stderr) >= MAX_OUTPUT_BYTES })
      })
    })
  })
}

function safeRemotePath(value) {
  if (typeof value !== 'string' || value.trim() === '' || value.includes('\0')) throw new Error('Remote path is required')
  return value
}

function probeInteger(value) {
  const numeric = Number(String(value ?? '').trim())
  if (!Number.isFinite(numeric)) return 0
  return Math.max(Math.round(numeric), 0)
}

function probeScalar(value) {
  const text = String(value ?? '').trim()
  const quoted = text.length >= 2 && ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'")))
  return quoted ? text.slice(1, -1).trim() : text
}

/** Parse the K=V probe output into host facts. Missing or unparsable values become 0 or ''. */
export function parseProbeOutput(text) {
  const values = {}
  for (const line of String(text ?? '').split(/\r?\n/)) {
    const separator = line.indexOf('=')
    if (separator <= 0) continue
    const key = line.slice(0, separator).trim()
    if (!/^[A-Z][A-Z0-9_]*$/.test(key)) continue
    values[key] = probeScalar(line.slice(separator + 1))
  }
  return {
    system: probeScalar(values.OS) || probeScalar(values.SYS),
    cpuCores: probeInteger(values.CORES),
    memoryGB: Math.round(probeInteger(values.MEM_MB) / 1024),
    diskGB: Math.round(probeInteger(values.DISK_MB) / 1024),
  }
}

export async function testConnection(host, password) {
  const client = await connect(host, password)
  client.end()
  return { connected: true }
}

export async function execCommand(host, password, command, options = {}) {
  if (typeof command !== 'string' || command.trim() === '') throw new Error('Command is required')
  const timeout = Math.min(Math.max(Number(options.timeout || DEFAULT_TIMEOUT), 1_000), 120_000)
  const client = await connect(host, password, timeout)
  try {
    return await execOnClient(client, command, timeout)
  } finally { client.end() }
}

/** Connect once, measure the handshake latency and collect system facts over the same session. */
export async function inspectHost(host, password) {
  const started = Date.now()
  const client = await connect(host, password)
  const latencyMs = Math.round(Date.now() - started)
  try {
    const output = await execOnClient(client, PROBE_COMMAND, DEFAULT_TIMEOUT)
    return { ...parseProbeOutput(output.stdout), latencyMs }
  } finally { client.end() }
}

export async function listRemoteFiles(host, password, remotePath = '.') {
  const target = safeRemotePath(remotePath)
  const client = await connect(host, password)
  try {
    return await new Promise((resolve, reject) => {
      client.sftp((error, sftp) => {
        if (error) return reject(error)
        sftp.readdir(target, (readError, entries) => {
          if (readError) return reject(readError)
          resolve(entries.map((entry) => ({ name: entry.filename, size: entry.attrs?.size ?? 0, mode: entry.attrs?.mode ?? 0, directory: Boolean(entry.attrs?.isDirectory?.()) })))
        })
      })
    })
  } finally { client.end() }
}

export async function uploadFile(host, password, remotePath, contentBase64) {
  const target = safeRemotePath(remotePath)
  if (typeof contentBase64 !== 'string') throw new Error('Base64 file content is required')
  const content = Buffer.from(contentBase64, 'base64')
  if (content.length > MAX_FILE_BYTES) throw new Error('File is too large')
  const client = await connect(host, password)
  try {
    await new Promise((resolve, reject) => client.sftp((error, sftp) => {
      if (error) return reject(error)
      sftp.writeFile(target, content, (writeError) => writeError ? reject(writeError) : resolve())
    }))
    return { uploaded: true, bytes: content.length }
  } finally { client.end() }
}

export async function downloadFile(host, password, remotePath) {
  const target = safeRemotePath(remotePath)
  const client = await connect(host, password)
  try {
    const content = await new Promise((resolve, reject) => client.sftp((error, sftp) => {
      if (error) return reject(error)
      sftp.stat(target, (statError, stats) => {
        if (statError) return reject(statError)
        if (stats.size > MAX_FILE_BYTES) return reject(new Error('File is too large'))
        sftp.readFile(target, (readError, data) => readError ? reject(readError) : resolve(data))
      })
    }))
    return { bytes: content.length, contentBase64: content.toString('base64') }
  } finally { client.end() }
}

export async function batchExec(hosts, passwordFor, command, options = {}) {
  const concurrency = Math.min(Math.max(Number(options.concurrency || 4), 1), 16)
  const results = []
  let cursor = 0
  async function worker() {
    while (cursor < hosts.length) {
      const index = cursor++
      const host = hosts[index]
      try {
        const password = await passwordFor(host)
        results[index] = { host: host.host, ok: true, result: await execCommand(host, password, command, options) }
      } catch (error) {
        results[index] = { host: host.host, ok: false, error: error instanceof Error ? error.message : String(error) }
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, hosts.length) }, () => worker()))
  return results
}

function boundedInteger(value, min, max, fallback) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return fallback
  return Math.min(Math.max(Math.round(numeric), min), max)
}

/** Open one interactive PTY shell. The caller owns `close()` and the stream events. */
export async function openPty(host, password, options = {}) {
  const cols = boundedInteger(options.cols, 20, 500, 120)
  const rows = boundedInteger(options.rows, 5, 300, 32)
  const term = typeof options.term === 'string' && options.term.trim() !== '' ? options.term.trim() : 'xterm-256color'
  const client = await connect(host, password)
  try {
    const stream = await new Promise((resolve, reject) => {
      client.shell({ term, cols, rows }, (error, shellStream) => {
        if (error) reject(error)
        else resolve(shellStream)
      })
    })
    let closed = false
    const close = () => {
      if (closed) return
      closed = true
      try { stream.end() } catch {}
      try { client.end() } catch {}
    }
    client.once('close', () => { closed = true })
    client.once('error', () => { closed = true })
    return { client, stream, close }
  } catch (error) {
    try { client.end() } catch {}
    throw error
  }
}

export function openInteractiveShell(host, password, onReady, options = {}) {
  return openPty(host, password, options).then((session) => {
    onReady?.(session)
    return session
  })
}

export const __test = { safeRemotePath, connectionConfig, parseProbeOutput, MAX_OUTPUT_BYTES, MAX_FILE_BYTES }
