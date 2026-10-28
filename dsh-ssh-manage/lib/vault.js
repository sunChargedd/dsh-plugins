import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { atomicWriteFile, loadOrCreateKey, readJson, storagePaths } from './storage.js'

const ALGORITHM = 'aes-256-gcm'
const IV_BYTES = 12
const VERSION = 1

function assertAlias(alias) {
  const value = String(alias ?? '').trim()
  if (!/^[A-Za-z0-9][A-Za-z0-9_.@-]{0,63}$/.test(value) || /[*?!\r\n]/.test(value)) throw new Error('Invalid SSH host alias')
  return value
}

function normalizeRecords(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).filter(([key, secret]) => typeof key === 'string' && typeof secret === 'string'))
}

export function encryptRecords(records, key) {
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(records), 'utf8'), cipher.final()])
  return {
    version: VERSION,
    algorithm: ALGORITHM,
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  }
}

export function decryptRecords(payload, key) {
  if (!payload || payload.version !== VERSION || payload.algorithm !== ALGORITHM) throw new Error('Unsupported SSH vault format')
  try {
    const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(payload.iv, 'base64'))
    decipher.setAuthTag(Buffer.from(payload.tag, 'base64'))
    const plaintext = Buffer.concat([decipher.update(Buffer.from(payload.ciphertext, 'base64')), decipher.final()]).toString('utf8')
    return normalizeRecords(JSON.parse(plaintext))
  } catch {
    throw new Error('Cannot decrypt SSH password vault')
  }
}

export async function loadVault(paths) {
  const resolved = storagePaths(paths)
  const key = await loadOrCreateKey(resolved)
  const payload = await readJson(resolved.vaultPath, null)
  const records = payload ? decryptRecords(payload, key) : {}
  return { paths: resolved, key, records }
}

export async function saveVault(paths, records) {
  const resolved = storagePaths(paths)
  const key = await loadOrCreateKey(resolved)
  const payload = encryptRecords(normalizeRecords(records), key)
  await atomicWriteFile(resolved.vaultPath, `${JSON.stringify(payload, null, 2)}\n`, 0o600)
  return { saved: true }
}

export async function setPassword(paths, alias, password) {
  const key = assertAlias(alias)
  if (typeof password !== 'string' || password.length === 0) throw new Error('Password is required')
  const vault = await loadVault(paths)
  vault.records[key] = password
  await saveVault(vault.paths, vault.records)
  return { saved: true, host: key }
}

export async function removePassword(paths, alias) {
  const key = assertAlias(alias)
  const vault = await loadVault(paths)
  const removed = Object.prototype.hasOwnProperty.call(vault.records, key)
  delete vault.records[key]
  if (removed) await saveVault(vault.paths, vault.records)
  return { removed }
}

export async function hasPassword(paths, alias) {
  const key = assertAlias(alias)
  const vault = await loadVault(paths)
  return Object.prototype.hasOwnProperty.call(vault.records, key)
}

export async function getPassword(paths, alias) {
  const key = assertAlias(alias)
  const vault = await loadVault(paths)
  return vault.records[key] ?? null
}

export async function listPasswordAliases(paths) {
  const vault = await loadVault(paths)
  return Object.keys(vault.records)
}

export const __test = { assertAlias, normalizeRecords }
