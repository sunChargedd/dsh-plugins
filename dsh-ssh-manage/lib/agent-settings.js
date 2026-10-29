import { readJson, storagePaths, withStoreLock, atomicWriteFile } from './storage.js'

const DEFAULTS = Object.freeze({ approval: 'audit', readonly: false, healthCheck: false })

function normalize(value) {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  return {
    approval: input.approval === 'ask' ? 'ask' : 'audit',
    readonly: input.readonly === true,
    healthCheck: input.healthCheck === true,
  }
}

export async function loadAgentSettings(paths) {
  const resolved = storagePaths(paths)
  const value = await readJson(resolved.agentSettingsPath, DEFAULTS).catch(() => DEFAULTS)
  return normalize(value)
}

export async function saveAgentSettings(paths, patch) {
  const resolved = storagePaths(paths)
  return withStoreLock(`agent-settings:${resolved.stateDir}`, async () => {
    const current = await loadAgentSettings(paths)
    const next = normalize({ ...current, ...(patch && typeof patch === 'object' ? patch : {}) })
    await atomicWriteFile(resolved.agentSettingsPath, `${JSON.stringify(next, null, 2)}\n`, 0o600)
    return next
  })
}

export const __test = { normalize, DEFAULTS }
