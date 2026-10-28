import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Static guards for the hand-authored dynamic client module (module-load behavior is smoke-tested separately). */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(join(root, 'client.js'), 'utf8')
const failures = []
function check(condition, message) {
  if (!condition) failures.push(message)
}

/** Collect the `const model = { ... }` keys and every `model.<name>` / destructured reference. */
function modelKeys() {
  const start = source.indexOf('      const model = {')
  const end = source.indexOf('\n      function renderFloating()', start)
  check(start >= 0 && end > start, 'could not locate the App model literal')
  if (start < 0 || end <= start) return { keys: new Set(), references: new Set() }
  const keys = new Set([...source.slice(start, end).matchAll(/^\s+([A-Za-z_$][\w$]*)\s*[,:]/gm)].map((match) => match[1]))
  const references = new Set([...source.matchAll(/\bmodel\.([A-Za-z_$][\w$]*)/g)].map((match) => match[1]))
  for (const match of source.matchAll(/const\s*\{([^}]*)\}\s*=\s*model\b/g)) {
    for (const part of match[1].split(',')) {
      const name = part.trim().split(':')[0].trim()
      if (/^[A-Za-z_$][\w$]*$/.test(name)) references.add(name)
    }
  }
  return { keys, references }
}

/** Collect locale pair keys and every literal `t('key')` call. */
function localeKeys() {
  const start = source.indexOf('const TEXT = {')
  const end = source.indexOf('\n    const ZH = {}', start)
  check(start >= 0 && end > start, 'could not locate the TEXT dictionary')
  if (start < 0 || end <= start) return { declared: new Set(), used: new Set() }
  const body = source.slice(start, end)
  const declared = new Set()
  for (const line of body.split('\n')) {
    const match = line.match(/^\s+'([^']+)':\s*\[/) || line.match(/^\s+([A-Za-z_][\w.]*):\s*\[/)
    if (!match) continue
    declared.add(match[1])
    check(/\[\s*'[^']*'\s*,\s*'[^']*'\s*\]\s*,\s*$/.test(line.trim()), `locale pair "${match[1]}" must contain a zh and an en string`)
  }
  const used = new Set([...source.matchAll(/\bt\('([^']+)'/g)].map((match) => match[1]))
  return { declared, used }
}

check(source.includes('window.__ModuleLoader__.load({'), 'client.js must register through window.__ModuleLoader__.load')
const requires = [...source.matchAll(/require\('([^']+)'\)/g)].map((match) => match[1])
check(requires.length === 1 && requires[0] === 'react', `client.js may only require react (found: ${requires.join(', ')})`)

const { keys, references } = modelKeys()
const missingModel = [...references].filter((name) => !keys.has(name)).sort()
check(missingModel.length === 0, `model.* references missing from the model object: ${missingModel.join(', ')}`)

const { declared, used } = localeKeys()
const missingLocale = [...used].filter((key) => !declared.has(key)).sort()
check(missingLocale.length === 0, `t() calls without a declared locale key: ${missingLocale.join(', ')}`)

if (failures.length > 0) {
  for (const failure of failures) console.error(`client-check: ${failure}`)
  process.exitCode = 1
} else {
  console.log(`ok - client structure checks (${declared.size} locale pairs, ${references.size} model references)`)
}
