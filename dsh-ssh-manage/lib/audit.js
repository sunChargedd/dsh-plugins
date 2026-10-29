import { appendFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { storagePaths } from './storage.js'

const MAX_AUDIT_BYTES = 1024 * 1024
const MAX_AUDIT_LINES = 500

function auditPath(paths) {
  return path.join(storagePaths(paths).stateDir, 'audit.jsonl')
}

function compact(value, max = 500) {
  return String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\b(password|passwd|token|secret|api[_-]?key)\b(\s*[=:]\s*)\S+/gi, '$1$2***')
    .slice(0, max)
}

/** Append one redacted, local audit record. Never pass a password into `detail`. */
export async function appendAudit(paths, record) {
  const resolved = storagePaths(paths)
  await mkdir(resolved.stateDir, { recursive: true, mode: 0o700 })
  const file = auditPath(paths)
  try {
    const info = await stat(file)
    if (info.size > MAX_AUDIT_BYTES) {
      const old = await readFile(file, 'utf8').catch(() => '')
      const lines = old.split('\n').filter(Boolean).slice(-Math.floor(MAX_AUDIT_LINES / 2))
      await writeFile(file, `${lines.join('\n')}\n`, { mode: 0o600 })
    }
  } catch {}
  const entry = {
    time: new Date().toISOString(),
    action: compact(record.action, 60),
    host: compact(record.host, 80),
    detail: compact(record.detail, 400),
    ok: record.ok === true,
    error: compact(record.error, 300),
  }
  await appendFile(file, `${JSON.stringify(entry)}\n`, { mode: 0o600 })
  return entry
}

export async function readAudit(paths, limit = 50) {
  const file = auditPath(paths)
  let text = ''
  try {
    text = await readFile(file, 'utf8')
  } catch {
    return []
  }
  return text
    .split('\n')
    .filter(Boolean)
    .slice(-Math.max(1, Math.min(Number(limit) || 50, MAX_AUDIT_LINES)))
    .reverse()
    .map((line) => {
      try { return JSON.parse(line) } catch { return null }
    })
    .filter(Boolean)
}
