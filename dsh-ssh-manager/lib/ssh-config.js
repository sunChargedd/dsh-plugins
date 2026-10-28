import { randomBytes } from 'node:crypto'
import * as fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const HOST_RE = /^[A-Za-z0-9][A-Za-z0-9_.@-]{0,63}$/
const OPTION_NAMES = new Map([
  ['hostname', 'hostname'],
  ['user', 'user'],
  ['port', 'port'],
  ['identityfile', 'identityFile'],
  ['proxyjump', 'proxyJump'],
  ['forwardagent', 'forwardAgent'],
])
const MANAGED_FIELDS = [
  ['hostname', 'HostName'],
  ['user', 'User'],
  ['port', 'Port'],
  ['identityFile', 'IdentityFile'],
  ['proxyJump', 'ProxyJump'],
  ['forwardAgent', 'ForwardAgent'],
]
const MANAGED_DISPLAY = new Map(MANAGED_FIELDS)

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

function isWildPattern(value) {
  return /[*?!]/.test(value)
}

function parseScalar(value) {
  const trimmed = value.trim()
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1)
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1)
  return trimmed
}

function parseHostHeader(line) {
  const match = line.match(/^\s*Host\s+(.+?)\s*$/i)
  if (!match) return null
  return match[1].split(/\s+/).map(parseScalar).filter(Boolean)
}

function isSectionBoundary(line) {
  return Boolean(parseHostHeader(line)) || /^\s*Match\s+/i.test(line)
}

function parseOption(line) {
  const match = line.match(/^\s*([A-Za-z][A-Za-z0-9]*)\s+(.+?)\s*$/)
  if (!match) return null
  const field = OPTION_NAMES.get(match[1].toLowerCase())
  if (!field) return null
  return { field, value: parseScalar(match[2]) }
}

function emptyHost(host, aliases = []) {
  return {
    id: host,
    host,
    aliases,
    hostname: '',
    user: '',
    port: '',
    identityFile: '',
    proxyJump: '',
    forwardAgent: false,
  }
}

/** Parse the useful subset of OpenSSH config while retaining block positions. */
export function parseSshConfig(text = '') {
  const lines = String(text).replace(/^\uFEFF/, '').split(/\r?\n/)
  const boundaries = []
  for (let index = 0; index < lines.length; index += 1) {
    if (isSectionBoundary(lines[index])) boundaries.push(index)
  }
  const blocks = []
  const hosts = []
  for (let index = 0; index < boundaries.length; index += 1) {
    const start = boundaries[index]
    const patterns = parseHostHeader(lines[start])
    if (!patterns) continue
    const end = boundaries[index + 1] ?? lines.length
    const visible = patterns.filter((pattern) => !isWildPattern(pattern))
    const block = { start, end, patterns, text: lines.slice(start, end).join('\n') }
    blocks.push(block)
    if (visible.length === 0) continue
    const host = emptyHost(visible[0], visible.slice(1))
    for (let lineIndex = start + 1; lineIndex < end; lineIndex += 1) {
      const option = parseOption(lines[lineIndex])
      if (!option || host[option.field]) continue
      if (option.field === 'forwardAgent') {
        host.forwardAgent = /^(yes|on|true|1)$/i.test(option.value)
      } else {
        host[option.field] = option.value
      }
    }
    hosts.push(host)
  }
  return { lines, blocks, hosts }
}

export function resolveSshPaths(env = process.env) {
  const home = env.HOME || os.homedir()
  const sshDir = env.SSH_DIR || path.join(home, '.ssh')
  const configPath = env.SSH_CONFIG || path.join(sshDir, 'config')
  const dshHome = env.DSH_HOME || path.join(home, '.dsh')
  const stateDir = env.DSH_SSH_MANAGER_HOME || path.join(dshHome, '.ssh-manager')
  return { home, sshDir, configPath, stateDir, backupDir: path.join(stateDir, 'backups') }
}

async function readConfig(paths) {
  try {
    return await fs.readFile(paths.configPath, 'utf8')
  } catch (error) {
    if (error?.code === 'ENOENT') return ''
    throw new Error(`Cannot read ${paths.configPath}: ${errorMessage(error)}`)
  }
}

async function backupConfig(paths, text) {
  if (!text) return null
  const directory = path.join(paths.backupDir, stamp())
  await fs.mkdir(directory, { recursive: true })
  const backup = path.join(directory, 'config')
  await fs.writeFile(backup, text, 'utf8')
  return backup
}

async function atomicWrite(paths, text) {
  await fs.mkdir(path.dirname(paths.configPath), { recursive: true })
  const temporary = `${paths.configPath}.tmp-${process.pid}-${randomBytes(6).toString('hex')}`
  try {
    await fs.writeFile(temporary, text, { encoding: 'utf8', mode: 0o600 })
    await fs.rename(temporary, paths.configPath)
  } catch (error) {
    await fs.rm(temporary, { force: true }).catch(() => {})
    throw new Error(`Cannot write ${paths.configPath}: ${errorMessage(error)}`)
  }
}

function validateHost(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('host is required')
  const host = String(input.host ?? '').trim()
  if (!HOST_RE.test(host) || isWildPattern(host)) throw new Error('Invalid SSH host alias')
  const aliases = Array.isArray(input.aliases) ? input.aliases.filter(Boolean).map(String) : []
  if (aliases.some((alias) => /[\r\n]/.test(alias))) throw new Error('SSH aliases cannot contain newlines')
  const output = emptyHost(host, aliases)
  for (const field of ['hostname', 'user', 'identityFile', 'proxyJump']) {
    if (input[field] !== undefined && input[field] !== null) {
      const value = String(input[field]).trim()
      if (/[\r\n]/.test(value)) throw new Error(`SSH ${field} cannot contain newlines`)
      output[field] = value
    }
  }
  if (input.port !== undefined && input.port !== null && String(input.port).trim() !== '') {
    const port = String(input.port).trim()
    if (!/^\d{1,5}$/.test(port) || Number(port) < 1 || Number(port) > 65535) throw new Error('Port must be between 1 and 65535')
    output.port = port
  }
  output.forwardAgent = input.forwardAgent === true
  return output
}

function serializeHost(host) {
  const aliases = Array.isArray(host.aliases) ? host.aliases.filter((alias) => alias && !isWildPattern(alias)) : []
  const lines = [`Host ${[host.host, ...aliases].join(' ')}`]
  const values = [
    ['HostName', host.hostname],
    ['User', host.user],
    ['Port', host.port],
    ['IdentityFile', host.identityFile],
    ['ProxyJump', host.proxyJump],
  ]
  for (const [key, value] of values) if (value) lines.push(`  ${key} ${value}`)
  if (host.forwardAgent) lines.push('  ForwardAgent yes')
  return lines.join('\n')
}

function parseManagedOption(line) {
  const match = line.match(/^(\s*)([A-Za-z][A-Za-z0-9]*)(\s+)(.*)$/)
  if (!match) return null
  const field = OPTION_NAMES.get(match[2].toLowerCase())
  if (!field) return null
  return { indent: match[1], field }
}

function managedValue(host, field) {
  if (field === 'forwardAgent') return host.forwardAgent ? 'yes' : ''
  const value = host[field]
  return value === undefined || value === null ? '' : String(value)
}

/**
 * Rewrite an existing Host block in place: keep the original header position,
 * update each managed option once, drop managed options that are now empty,
 * append missing ones, and preserve every unmanaged line (comments, blank
 * lines, ServerAliveInterval, LocalForward, Include, ...) verbatim.
 */
function patchHostBlock(blockLines, host) {
  const firstLine = String(blockLines[0] ?? '')
  const indent = (firstLine.match(/^\s*/) || [''])[0]
  const patterns = [...new Set([host.host, ...(Array.isArray(host.aliases) ? host.aliases : [])].filter(Boolean))]
  const output = [`${indent}Host ${patterns.join(' ')}`]
  const seen = new Set()
  for (const line of blockLines.slice(1)) {
    const managed = parseManagedOption(line)
    if (!managed) { output.push(line); continue }
    if (seen.has(managed.field)) {
      // Only the first IdentityFile is managed; keep additional fallback keys verbatim.
      if (managed.field === 'identityFile') output.push(line)
      continue
    }
    seen.add(managed.field)
    const value = managedValue(host, managed.field)
    if (!value) continue
    output.push(`${managed.indent}${MANAGED_DISPLAY.get(managed.field)} ${value}`)
  }
  const appended = []
  for (const [field, display] of MANAGED_FIELDS) {
    if (seen.has(field)) continue
    const value = managedValue(host, field)
    if (value) appended.push(`  ${display} ${value}`)
  }
  if (appended.length > 0) {
    let insertAt = output.length
    while (insertAt > 1 && output[insertAt - 1].trim() === '') insertAt -= 1
    output.splice(insertAt, 0, ...appended)
  }
  return output
}

function blockForHost(parsed, name) {
  return parsed.blocks.find((block) => block.patterns.includes(name))
}

export async function listSshHosts(paths = resolveSshPaths()) {
  const text = await readConfig(paths)
  const parsed = parseSshConfig(text)
  return { configPath: paths.configPath, hosts: parsed.hosts, exists: text.length > 0 }
}

export async function saveSshHost({ paths = resolveSshPaths(), host, originalHost } = {}) {
  const nextHost = validateHost(host)
  const aliasesProvided = Array.isArray(host?.aliases) && host.aliases.filter(Boolean).length > 0
  const previous = originalHost ? String(originalHost).trim() : null
  const text = await readConfig(paths)
  const parsed = parseSshConfig(text)
  const block = previous ? blockForHost(parsed, previous) : null
  const collision = blockForHost(parsed, nextHost.host)
  if (collision && (!block || collision.start !== block.start)) throw new Error(`SSH host "${nextHost.host}" already exists`)
  let lines = parsed.lines
  if (block) {
    if (!aliasesProvided) {
      const preserved = block.patterns.filter((pattern) => pattern !== previous)
      nextHost.aliases = [...new Set(preserved)]
    }
    const patched = patchHostBlock(parsed.lines.slice(block.start, block.end), nextHost)
    lines = [...parsed.lines.slice(0, block.start), ...patched, ...parsed.lines.slice(block.end)]
  } else {
    const replacement = serializeHost(nextHost)
    const base = text.trimEnd()
    lines = base ? `${base}\n\n${replacement}\n` : `${replacement}\n`
  }
  const nextText = Array.isArray(lines) ? `${lines.join('\n').replace(/\n+$/, '')}\n` : lines
  const backup = await backupConfig(paths, text)
  await atomicWrite(paths, nextText)
  return { saved: true, host: nextHost, backup }
}

export async function deleteSshHost({ paths = resolveSshPaths(), host } = {}) {
  const name = String(host ?? '').trim()
  if (!HOST_RE.test(name) || isWildPattern(name)) throw new Error('Invalid SSH host alias')
  const text = await readConfig(paths)
  const parsed = parseSshConfig(text)
  const block = blockForHost(parsed, name)
  if (!block) return { removed: false, backup: null }
  let lines = [...parsed.lines.slice(0, block.start), ...parsed.lines.slice(block.end)]
  while (block.start > 0 && lines[block.start - 1] === '') lines.splice(block.start - 1, 1)
  const nextText = `${lines.join('\n').replace(/\n+$/, '')}${lines.length ? '\n' : ''}`
  const backup = await backupConfig(paths, text)
  await atomicWrite(paths, nextText)
  return { removed: true, backup }
}

export const __test = { patchHostBlock }
