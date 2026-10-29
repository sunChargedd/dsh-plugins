import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/** Resolve the known_hosts file: SSH_KNOWN_HOSTS, else ~/.ssh/known_hosts. */
export function knownHostsPath(env = process.env) {
  return env.SSH_KNOWN_HOSTS || path.join(env.HOME || os.homedir(), '.ssh', 'known_hosts')
}

/** OpenSSH-style SHA256 fingerprint of a raw SSH public key blob. */
export function keyFingerprint(key) {
  const buffer = Buffer.isBuffer(key) ? key : Buffer.from(key ?? '')
  return `SHA256:${createHash('sha256').update(buffer).digest('base64').replace(/=+$/, '')}`
}

/** SSH key algorithm name from the raw public-key blob (e.g. ssh-ed25519). */
export function hostKeyType(key) {
  const buffer = Buffer.isBuffer(key) ? key : Buffer.from(key ?? '')
  if (buffer.length < 4) return ''
  const length = buffer.readUInt32BE(0)
  if (length <= 0 || length > buffer.length - 4) return ''
  const type = buffer.subarray(4, 4 + length).toString('ascii')
  return /^[A-Za-z0-9@._-]+$/.test(type) ? type : ''
}

/** Append one verified public key to known_hosts, preserving the file and avoiding duplicates. */
export function appendKnownHost(host, key, env = process.env) {
  const target = hostKeyTarget(host)
  const keyType = hostKeyType(key)
  const keyBuffer = Buffer.isBuffer(key) ? key : Buffer.from(key ?? '')
  if (!target) throw new Error('Cannot trust a host key without a hostname')
  if (!keyType || keyBuffer.length <= 4) throw new Error('Invalid SSH public key')
  const filePath = knownHostsPath(env)
  const line = `${target} ${keyType} ${keyBuffer.toString('base64')}`
  let current = ''
  try {
    current = readFileSync(filePath, 'utf8')
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
  if (current.split(/\r?\n/).some((entry) => entry.trim() === line)) {
    return { saved: false, already: true, target, keyType, fingerprint: keyFingerprint(keyBuffer), path: filePath }
  }
  mkdirSync(path.dirname(filePath), { recursive: true, mode: 0o700 })
  const prefix = current.length > 0 && !current.endsWith('\n') ? '\n' : ''
  appendFileSync(filePath, `${prefix}${line}\n`, { mode: 0o600 })
  return { saved: true, already: false, target, keyType, fingerprint: keyFingerprint(keyBuffer), path: filePath }
}

/** Host token used by known_hosts: plain host on port 22, bracketed host:port otherwise. */
export function hostKeyTarget(host) {
  const hostname = String((host && (host.hostname || host.host)) || '')
  const raw = Number((host && host.port) || 22)
  const port = Number.isInteger(raw) && raw > 0 && raw <= 65535 ? raw : 22
  return port === 22 ? hostname : `[${hostname}]:${port}`
}

function hashedPatternMatches(pattern, target) {
  const parts = pattern.split('|')
  if (parts.length !== 4 || parts[1] !== '1') return false
  let salt
  let expected
  try {
    salt = Buffer.from(parts[2], 'base64')
    expected = Buffer.from(parts[3], 'base64')
  } catch {
    return false
  }
  if (salt.length === 0 || expected.length === 0) return false
  const candidates = target === target.toLowerCase() ? [target] : [target, target.toLowerCase()]
  return candidates.some((candidate) => {
    const actual = createHmac('sha1', salt).update(candidate).digest()
    return actual.length === expected.length && timingSafeEqual(actual, expected)
  })
}

function globPatternMatches(pattern, target) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.')
  return new RegExp(`^${escaped}$`, 'i').test(target)
}

/** Match one known_hosts host pattern against a target token (supports hashes, wildcards and negation). */
export function matchHostPattern(pattern, target) {
  const value = String(pattern ?? '').trim()
  if (value === '') return false
  if (value.startsWith('|1|')) return hashedPatternMatches(value, target)
  if (value.includes('*') || value.includes('?')) return globPatternMatches(value, target)
  return value.toLowerCase() === target.toLowerCase()
}

function patternsMatch(patterns, target) {
  let matched = false
  for (const raw of patterns) {
    const pattern = String(raw ?? '').trim()
    if (pattern === '') continue
    const negated = pattern.startsWith('!')
    const body = negated ? pattern.slice(1) : pattern
    if (!matchHostPattern(body, target)) continue
    if (negated) return false
    matched = true
  }
  return matched
}

/** Parse a known_hosts file body into `{ marker, patterns, keyType, keyBlob }` entries. */
export function parseKnownHosts(text = '') {
  const entries = []
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim()
    if (line === '' || line.startsWith('#')) continue
    const tokens = line.split(/\s+/)
    let index = 0
    let marker = null
    if (tokens[0].startsWith('@')) {
      marker = tokens[0].toLowerCase()
      index = 1
    }
    const patternToken = tokens[index]
    const keyType = tokens[index + 1]
    const keyBlob = tokens[index + 2]
    if (!patternToken || !keyType || !keyBlob) continue
    entries.push({ marker, patterns: patternToken.split(','), keyType, keyBlob, line })
  }
  return entries
}

function sameBlob(knownHostsBlob, presented) {
  const known = Buffer.from(String(knownHostsBlob), 'base64')
  return known.length > 0 && known.equals(presented)
}

/**
 * Synchronously verify a server host key (raw SSH public key blob) against known_hosts.
 * Returns `{ ok: true, fingerprint, path, target }` or
 * `{ ok: false, reason, fingerprint, path, target }`; mismatches also include `expected`.
 */
export function verifyHostKey(host, key, env = process.env) {
  const keyBuffer = Buffer.isBuffer(key) ? key : Buffer.from(key ?? '')
  const fingerprint = keyFingerprint(keyBuffer)
  const target = hostKeyTarget(host)
  const filePath = knownHostsPath(env)
  let text
  try {
    text = readFileSync(filePath, 'utf8')
  } catch (error) {
    const reason = error?.code === 'ENOENT'
      ? `known_hosts is missing at ${filePath}`
      : `cannot read known_hosts at ${filePath}: ${error?.message ?? String(error)}`
    return { ok: false, reason, fingerprint, path: filePath, target }
  }
  const entries = parseKnownHosts(text).filter((entry) => patternsMatch(entry.patterns, target))
  const revoked = entries.find((entry) => entry.marker === '@revoked' && sameBlob(entry.keyBlob, keyBuffer))
  if (revoked) return { ok: false, reason: `host key is revoked for ${target}`, fingerprint, path: filePath, target }
  let hostMatched = false
  let expected = ''
  for (const entry of entries) {
    if (entry.marker) continue
    hostMatched = true
    if (sameBlob(entry.keyBlob, keyBuffer)) return { ok: true, fingerprint, path: filePath, target }
    if (expected === '') {
      const blob = Buffer.from(entry.keyBlob, 'base64')
      if (blob.length > 0) expected = keyFingerprint(blob)
    }
  }
  if (hostMatched) return { ok: false, reason: `host key mismatch for ${target}`, fingerprint, expected, path: filePath, target }
  return { ok: false, reason: `host key is not in known_hosts for ${target}`, fingerprint, path: filePath, target }
}

export const __test = { patternsMatch, globPatternMatches, hashedPatternMatches }
