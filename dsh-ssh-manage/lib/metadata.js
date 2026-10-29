import { atomicWriteFile, readJson, storagePaths, withStoreLock } from './storage.js'

function clean(value, max = 80) {
  return String(value ?? '').trim().slice(0, max)
}

function nonNegativeInteger(value, cap) {
  const numeric = typeof value === 'number' || typeof value === 'string' ? Number(value) : Number.NaN
  if (!Number.isFinite(numeric)) return 0
  return Math.min(Math.max(Math.round(numeric), 0), cap)
}

function normalizeEntry(alias, input = {}) {
  return {
    group: clean(input.group),
    tags: Array.isArray(input.tags) ? [...new Set(input.tags.map((tag) => clean(tag, 32)).filter(Boolean))].slice(0, 20) : [],
    favorite: input.favorite === true,
    label: clean(input.label, 120),
    note: clean(input.note, 240),
    system: clean(input.system, 80),
    cpuCores: nonNegativeInteger(input.cpuCores, 4096),
    memoryGB: nonNegativeInteger(input.memoryGB, 1048576),
    diskGB: nonNegativeInteger(input.diskGB, 1048576),
    latencyMs: nonNegativeInteger(input.latencyMs, 600000),
    checkedAt: clean(input.checkedAt, 40),
    health: input.health === 'online' || input.health === 'offline' ? input.health : '',
    lastError: clean(input.lastError, 200),
  }
}

function metadataLockKey(paths) {
  return `metadata:${storagePaths(paths).stateDir}`
}

/** Read the metadata store without taking the store lock; mutators hold it. */
async function loadMetadataUnlocked(paths) {
  const resolved = storagePaths(paths)
  const value = await readJson(resolved.metadataPath, {})
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { paths: resolved, entries: {} }
  const entries = Object.fromEntries(Object.entries(value).map(([alias, data]) => [alias, normalizeEntry(alias, data)]))
  return { paths: resolved, entries }
}

/** Write the metadata store without taking the store lock; mutators hold it. */
async function saveMetadataUnlocked(paths, entries) {
  const resolved = storagePaths(paths)
  const normalized = Object.fromEntries(Object.entries(entries || {}).map(([alias, data]) => [alias, normalizeEntry(alias, data)]))
  await atomicWriteFile(resolved.metadataPath, `${JSON.stringify(normalized, null, 2)}\n`, 0o600)
  return { saved: true }
}

export async function loadMetadata(paths) {
  return loadMetadataUnlocked(paths)
}

export async function saveMetadata(paths, entries) {
  return withStoreLock(metadataLockKey(paths), () => saveMetadataUnlocked(paths, entries))
}

export async function updateMetadata(paths, alias, data) {
  return withStoreLock(metadataLockKey(paths), async () => {
    const current = await loadMetadataUnlocked(paths)
    current.entries[alias] = normalizeEntry(alias, { ...current.entries[alias], ...data })
    await saveMetadataUnlocked(current.paths, current.entries)
    return current.entries[alias]
  })
}

export async function deleteMetadata(paths, alias) {
  return withStoreLock(metadataLockKey(paths), async () => {
    const current = await loadMetadataUnlocked(paths)
    delete current.entries[alias]
    await saveMetadataUnlocked(current.paths, current.entries)
  })
}

export const __test = { normalizeEntry }
