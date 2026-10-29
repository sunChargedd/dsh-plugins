import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto'
import { listSshHosts, saveSshHost } from './ssh-config.js'
import { loadMetadata, updateMetadata } from './metadata.js'
import { loadVault, saveVault } from './vault.js'

const FORMAT = 'dsh-ssh-manage-export'
const VERSION = 1
const ALGORITHM = 'aes-256-gcm'
const KDF = 'scrypt'
const KDF_N = 16384
const KDF_R = 8
const KDF_P = 1
const KEY_BYTES = 32
const SALT_BYTES = 16
const IV_BYTES = 12
const MAX_HOSTS = 500
const MAX_METADATA = 1000
const MAX_PASSWORDS = 1000
const ALIAS_RE = /^[A-Za-z0-9][A-Za-z0-9_.@-]{0,63}$/

function assertPassphrase(passphrase) {
  if (typeof passphrase !== 'string' || passphrase.length < 8) {
    throw new Error('Passphrase must be at least 8 characters')
  }
}

function deriveKey(passphrase, salt) {
  return scryptSync(Buffer.from(passphrase, 'utf8'), salt, KEY_BYTES, {
    N: KDF_N,
    r: KDF_R,
    p: KDF_P,
    maxmem: 64 * 1024 * 1024,
  })
}

function encryptSecrets(passwords, passphrase) {
  const salt = randomBytes(SALT_BYTES)
  const iv = randomBytes(IV_BYTES)
  const key = deriveKey(passphrase, salt)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify({ passwords }), 'utf8'),
    cipher.final(),
  ])
  return {
    version: VERSION,
    algorithm: ALGORITHM,
    kdf: KDF,
    kdfN: KDF_N,
    kdfR: KDF_R,
    kdfP: KDF_P,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  }
}

function decryptSecrets(payload, passphrase) {
  if (!payload || typeof payload !== 'object' || payload.algorithm !== ALGORITHM || payload.kdf !== KDF) {
    throw new Error('Unsupported export secrets format')
  }
  const n = Number(payload.kdfN)
  const r = Number(payload.kdfR)
  const p = Number(payload.kdfP)
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p) || n < 1024 || n > 65536 || r < 1 || r > 16 || p < 1 || p > 8) {
    throw new Error('Unsupported export KDF parameters')
  }
  try {
    const salt = Buffer.from(String(payload.salt ?? ''), 'base64')
    const iv = Buffer.from(String(payload.iv ?? ''), 'base64')
    const tag = Buffer.from(String(payload.tag ?? ''), 'base64')
    if (salt.length !== SALT_BYTES || iv.length !== IV_BYTES || tag.length === 0) throw new Error('bad envelope')
    const key = scryptSync(Buffer.from(passphrase, 'utf8'), salt, KEY_BYTES, {
      N: n,
      r,
      p,
      maxmem: 64 * 1024 * 1024,
    })
    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(String(payload.ciphertext ?? ''), 'base64')),
      decipher.final(),
    ]).toString('utf8')
    const parsed = JSON.parse(plaintext)
    if (!parsed || typeof parsed !== 'object' || !parsed.passwords || typeof parsed.passwords !== 'object' || Array.isArray(parsed.passwords)) {
      throw new Error('bad payload')
    }
    return parsed.passwords
  } catch {
    throw new Error('Cannot decrypt export: wrong passphrase or corrupted file')
  }
}

function hostRecord(host) {
  return {
    host: String(host?.host ?? ''),
    aliases: Array.isArray(host?.aliases) ? host.aliases.map(String) : [],
    hostname: String(host?.hostname ?? ''),
    user: String(host?.user ?? ''),
    port: String(host?.port ?? ''),
    identityFile: String(host?.identityFile ?? ''),
    proxyJump: String(host?.proxyJump ?? ''),
    forwardAgent: host?.forwardAgent === true,
  }
}

export async function createExport(paths, passphrase) {
  assertPassphrase(passphrase)
  const { hosts } = await listSshHosts(paths)
  const metadata = await loadMetadata(paths)
  const vault = await loadVault(paths)
  const passwords = {}
  for (const [alias, password] of Object.entries(vault.records)) {
    if (ALIAS_RE.test(alias) && typeof password === 'string' && password.length > 0) passwords[alias] = password
  }
  return {
    format: FORMAT,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    hosts: hosts.map(hostRecord),
    metadata: metadata.entries,
    secrets: encryptSecrets(passwords, passphrase),
  }
}

function validateEnvelope(exported) {
  if (!exported || typeof exported !== 'object' || Array.isArray(exported)) throw new Error('Invalid export file')
  if (exported.format !== FORMAT) throw new Error('Not a dsh-ssh-manage export file')
  if (exported.version !== VERSION) throw new Error(`Unsupported export version: ${String(exported.version)}`)
  if (!Array.isArray(exported.hosts) || exported.hosts.length > MAX_HOSTS) throw new Error('Invalid or too many hosts in export')
  if (!exported.metadata || typeof exported.metadata !== 'object' || Array.isArray(exported.metadata) || Object.keys(exported.metadata).length > MAX_METADATA) {
    throw new Error('Invalid metadata in export')
  }
  return {
    hosts: exported.hosts,
    metadata: exported.metadata,
    secrets: exported.secrets,
  }
}

function readableError(error) {
  return error instanceof Error ? error.message : String(error)
}

/**
 * Merge an export into the local config/metadata/vault. Existing hosts with the
 * same alias are updated in place; nothing is deleted. Per-host failures are
 * returned so a single malformed entry cannot abort the whole restore.
 */
export async function importExport(paths, exported, passphrase) {
  assertPassphrase(passphrase)
  const envelope = validateEnvelope(exported)
  if (!envelope.secrets) throw new Error('This export does not contain encrypted passwords')
  const passwords = decryptSecrets(envelope.secrets, passphrase)
  if (Object.keys(passwords).length > MAX_PASSWORDS) throw new Error('Too many passwords in export')

  const before = await listSshHosts(paths)
  const existing = new Set(before.hosts.map((host) => host.host))
  let created = 0
  let updated = 0
  const errors = []

  for (const raw of envelope.hosts) {
    try {
      const host = hostRecord(raw)
      if (!ALIAS_RE.test(host.host)) throw new Error('Invalid SSH host alias')
      const exists = existing.has(host.host)
      await saveSshHost({ paths, host, originalHost: exists ? host.host : null })
      if (exists) updated += 1
      else created += 1
    } catch (error) {
      errors.push(`${String(raw?.host ?? '?')}: ${readableError(error)}`)
    }
  }

  let metadataCount = 0
  for (const [alias, data] of Object.entries(envelope.metadata)) {
    if (!ALIAS_RE.test(alias)) continue
    try {
      await updateMetadata(paths, alias, data)
      metadataCount += 1
    } catch (error) {
      errors.push(`metadata ${alias}: ${readableError(error)}`)
    }
  }

  let passwordCount = 0
  const currentVault = await loadVault(paths)
  const merged = { ...currentVault.records }
  for (const [alias, password] of Object.entries(passwords)) {
    if (!ALIAS_RE.test(alias) || typeof password !== 'string' || password.length === 0) continue
    merged[alias] = password
    passwordCount += 1
  }
  if (passwordCount > 0) await saveVault(paths, merged)

  return { created, updated, metadata: metadataCount, passwords: passwordCount, errors }
}

export const __test = { encryptSecrets, decryptSecrets, hostRecord }
