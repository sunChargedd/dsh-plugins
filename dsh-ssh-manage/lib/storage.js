import { randomBytes } from 'node:crypto'
import * as fs from 'node:fs/promises'
import path from 'node:path'

const KEY_BYTES = 32

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

export async function loadOrCreateKey(paths) {
  const resolved = storagePaths(paths)
  try {
    const raw = await fs.readFile(resolved.keyPath)
    await fs.chmod(resolved.keyPath, 0o600).catch(() => {})
    if (raw.length === KEY_BYTES) return raw
    const decoded = Buffer.from(raw.toString('utf8').trim(), 'base64')
    if (decoded.length !== KEY_BYTES) throw new Error('SSH manager key has an invalid length')
    return decoded
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
    const key = randomBytes(KEY_BYTES)
    await atomicWriteFile(resolved.keyPath, key.toString('base64'), 0o600)
    // The base64 representation is easier to inspect safely while retaining 256 bits.
    const encoded = await fs.readFile(resolved.keyPath, 'utf8')
    return Buffer.from(encoded.trim(), 'base64')
  }
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
