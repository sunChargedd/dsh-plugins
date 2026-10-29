import { randomBytes } from 'node:crypto'
import { atomicWriteFile, readJson, storagePaths, withStoreLock } from './storage.js'

function clean(value, max) {
  return String(value ?? '').trim().slice(0, max)
}

function normalize(record) {
  return {
    id: clean(record?.id, 40) || `snip-${randomBytes(4).toString('hex')}`,
    name: clean(record?.name, 80),
    command: clean(record?.command, 2000),
    host: clean(record?.host, 80),
  }
}

function valid(record) {
  return record.name !== '' && record.command !== ''
}

export async function loadSnippets(paths) {
  const resolved = storagePaths(paths)
  const value = await readJson(resolved.snippetsPath, []).catch(() => [])
  const list = Array.isArray(value) ? value.map(normalize).filter(valid) : []
  return list.slice(0, 100)
}

export async function saveSnippets(paths, records) {
  const resolved = storagePaths(paths)
  return withStoreLock(`snippets:${resolved.stateDir}`, async () => {
    const list = (Array.isArray(records) ? records : []).map(normalize).filter(valid).slice(0, 100)
    await atomicWriteFile(resolved.snippetsPath, `${JSON.stringify(list, null, 2)}\n`, 0o600)
    return list
  })
}

export async function upsertSnippet(paths, record) {
  const list = await loadSnippets(paths)
  const next = normalize(record)
  if (!valid(next)) throw new Error('Snippet name and command are required')
  const index = list.findIndex((item) => item.id === next.id)
  if (index >= 0) list[index] = next
  else list.push(next)
  return saveSnippets(paths, list)
}

export async function deleteSnippet(paths, id) {
  return saveSnippets(paths, (await loadSnippets(paths)).filter((item) => item.id !== id))
}
