import { randomBytes } from 'node:crypto'
import * as fs from 'node:fs/promises'
import path from 'node:path'

const KEY_BYTES = 32
const storeLocks = new Map()
const keyCreations = new Map()

export function storagePaths(paths = {}) {
  const stateDir = paths.stateDir || path.join(paths.home || process.env.HOME || process.cwd(), '.dsh', '.ssh-manager')
  return {
    ...paths,
    stateDir,
    vaultPath: paths.vaultPath || path.join(stateDir, 'vault.json'),
    keyPath: paths.keyPath || path.join(stateDir, 'key'),
    metadataPath: paths.metadataPath || path.join(stateDir, 'hosts.json'),
  }
}

/**
 * Serialize one async read-modify-write sequence per store key. Callers must
 * only take the lock around their own read/write pair; the unlocked helpers in
 * the vault, metadata and SSH config modules exist so nested locks never wait
 * on themselves.
 */
export function withStoreLock(key, fn) {
  const previous = storeLocks.get(key) ?? Promise.resolve()
  const next = previous.then(() => fn())
  const tail = next.then(() => undefined, () => undefined)
  storeLocks.set(key, tail)
  void tail.then(() => {
    if (storeLocks.get(key) === tail) storeLocks.delete(key)
  })
  return next
}

export async function atomicWriteFile(filePath, data, mode = 0o600) {
  await fs.mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 })
  const temporary = `${filePath}.tmp-${process.pid}-${randomBytes(6).toString('hex')}`
  try {
    await fs.writeFile(temporary, data, { encoding: 'utf8', mode })
    await fs.chmod(temporary, mode).catch(() => {})
    await fs.rename(temporary, filePath)
  } catch (error) {
    await fs.rm(temporary, { force: true }).catch(() => {})
    throw error
  }
}

function decodeKey(raw) {
  if (Buffer.isBuffer(raw) && raw.length === KEY_BYTES) return raw
  const decoded = Buffer.from(String(raw).trim(), 'base64')
  if (decoded.length !== KEY_BYTES) throw new Error('SSH manager key has an invalid length')
  return decoded
}

async function readKey(keyPath) {
  const raw = await fs.readFile(keyPath)
  await fs.chmod(keyPath, 0o600).catch(() => {})
  return decodeKey(raw)
}

/** Create the key exactly once per path in this process; adopt another writer's key on EEXIST. */
function createKeyOnce(keyPath) {
  const pending = keyCreations.get(keyPath)
  if (pending) return pending
  const creation = (async () => {
    const key = randomBytes(KEY_BYTES)
    await fs.mkdir(path.dirname(keyPath), { recursive: true, mode: 0o700 })
    try {
      await fs.writeFile(keyPath, key.toString('base64'), { encoding: 'utf8', mode: 0o600, flag: 'wx' })
      return key
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error
      // Another process created the key first: never overwrite an existing key.
      return await readKey(keyPath)
    }
  })()
  keyCreations.set(keyPath, creation)
  const forget = () => {
    if (keyCreations.get(keyPath) === creation) keyCreations.delete(keyPath)
  }
  void creation.then(forget, forget)
  return creation
}

export async function loadOrCreateKey(paths) {
  const resolved = storagePaths(paths)
  try {
    return await readKey(resolved.keyPath)
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
  return createKeyOnce(resolved.keyPath)
}

export async function readJson(filePath, fallback) {
  try {
    const value = JSON.parse(await fs.readFile(filePath, 'utf8'))
    return value
  } catch (error) {
    if (error?.code === 'ENOENT') return fallback
    if (error instanceof SyntaxError) throw new Error(`Invalid JSON in ${filePath}`)
    throw error
  }
}

export { KEY_BYTES }
