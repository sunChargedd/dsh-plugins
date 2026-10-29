import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { parseSshConfig, listSshHosts, saveSshHost, deleteSshHost, resolveSshPaths } from '../lib/ssh-config.js'
import { getPassword, hasPassword, listPasswordAliases, removePassword, setPassword } from '../lib/vault.js'
import { __test as metadataTest, loadMetadata, updateMetadata } from '../lib/metadata.js'
import { __test as sshTest, deleteRemotePath, execCommand, makeRemoteDirectory, renameRemotePath } from '../lib/ssh-client.js'
import { knownHostsPath, keyFingerprint, parseKnownHosts, verifyHostKey } from '../lib/known-hosts.js'
import { createExport, importExport } from '../lib/transfer.js'
import { __test as indexTest } from '../index.js'

const { normalizeEntry } = metadataTest
const { parseProbeOutput } = sshTest
const { runAction } = indexTest

const temp = await mkdtemp(path.join(os.tmpdir(), 'dsh-ssh-manage-'))
const paths = {
  configPath: path.join(temp, '.ssh', 'config'),
  backupDir: path.join(temp, '.state', 'backups'),
}
try {
  const source = '# keep this comment\nHost *\n  AddKeysToAgent yes\n\nHost prod prod-old\n  HostName example.com\n  User deploy\n  Port 2222\n  ForwardAgent yes\n\nHost local\n  HostName 127.0.0.1\n'
  await mkdir(path.dirname(paths.configPath), { recursive: true })
  await writeFile(paths.configPath, source, 'utf8')
  const parsed = parseSshConfig(source)
  assert.deepEqual(parsed.hosts.map((host) => host.host), ['prod', 'local'])
  assert.equal(parsed.hosts[0].aliases[0], 'prod-old')
  assert.equal(parsed.hosts[0].forwardAgent, true)

  let state = await listSshHosts(paths)
  assert.equal(state.hosts.length, 2)
  const saved = await saveSshHost({ paths, originalHost: 'prod', host: { host: 'staging', aliases: ['staging-old'], hostname: 'staging.example.com', user: 'ops', port: '22', identityFile: '~/.ssh/id_ed25519', proxyJump: 'bastion', forwardAgent: false } })
  assert.equal(saved.saved, true)
  assert.ok(saved.backup)
  const afterSave = await readFile(paths.configPath, 'utf8')
  assert.match(afterSave, /Host staging staging-old/)
  assert.match(afterSave, /Host \*\n  AddKeysToAgent yes/)
  assert.doesNotMatch(afterSave, /Host prod prod-old/)

  await assert.rejects(() => saveSshHost({ paths, host: { host: 'local', hostname: 'collision' } }), /already exists/)
  await assert.rejects(() => saveSshHost({ paths, host: { host: 'injected', hostname: 'safe\nHost evil' } }), /cannot contain newlines/)
  const removed = await deleteSshHost({ paths, host: 'staging' })
  assert.equal(removed.removed, true)
  state = await listSshHosts(paths)
  assert.deepEqual(state.hosts.map((host) => host.host), ['local'])
  console.log('ok - SSH config parse, atomic save, collision guard and delete')

  const patchPaths = {
    configPath: path.join(temp, '.patch', 'config'),
    backupDir: path.join(temp, '.patch', 'backups'),
  }
  const patchSource = [
    '# global comment',
    'Host db db-old',
    '  HostName db.example.com',
    '  User admin',
    '  Port 2200',
    '  # keep this comment',
    '  ServerAliveInterval 60',
    '  LocalForward 8080 localhost:80',
    '',
    'Match host db',
    '  User matchuser',
    '',
    'Host web',
    '  HostName web.example.com',
    '',
  ].join('\n')
  await mkdir(path.dirname(patchPaths.configPath), { recursive: true })
  await writeFile(patchPaths.configPath, patchSource, 'utf8')
  const patchedParse = parseSshConfig(patchSource)
  assert.deepEqual(patchedParse.hosts.map((host) => host.host), ['db', 'web'])
  assert.deepEqual(patchedParse.hosts[0].aliases, ['db-old'])
  assert.equal(patchedParse.blocks.length, 2)
  const dbBlock = patchedParse.blocks.find((block) => block.patterns.includes('db'))
  assert.ok(dbBlock)
  assert.doesNotMatch(dbBlock.text, /Match host db/)
  assert.match(dbBlock.text, /LocalForward 8080 localhost:80/)

  // (1) edit in place: unmanaged lines and the extra alias survive, managed options update once.
  await saveSshHost({ paths: patchPaths, originalHost: 'db', host: { host: 'db', hostname: 'db2.example.com', user: 'admin2', port: '2201' } })
  let patchText = await readFile(patchPaths.configPath, 'utf8')
  assert.match(patchText, /^Host db db-old$/m)
  assert.match(patchText, /Host db db-old\n  HostName db2\.example\.com\n  User admin2\n  Port 2201\n  # keep this comment\n  ServerAliveInterval 60\n  LocalForward 8080 localhost:80\n/)
  assert.match(patchText, /^Match host db\n  User matchuser$/m)
  assert.equal((patchText.match(/HostName/g) || []).length, 2)

  // Saving again must never duplicate managed options.
  await saveSshHost({ paths: patchPaths, originalHost: 'db', host: { host: 'db', hostname: 'db2.example.com', user: 'admin2', port: '2201' } })
  patchText = await readFile(patchPaths.configPath, 'utf8')
  assert.equal((patchText.match(/HostName/g) || []).length, 2)

  // Missing managed options are appended; options that become empty are dropped.
  await saveSshHost({ paths: patchPaths, originalHost: 'web', host: { host: 'web', hostname: 'web2.example.com', user: 'www', port: '443' } })
  patchText = await readFile(patchPaths.configPath, 'utf8')
  assert.match(patchText, /Host web\n  HostName web2\.example\.com\n  User www\n  Port 443\n/)
  await saveSshHost({ paths: patchPaths, originalHost: 'web', host: { host: 'web', hostname: 'web3.example.com' } })
  patchText = await readFile(patchPaths.configPath, 'utf8')
  assert.doesNotMatch(patchText, /^  User www$/m)
  assert.doesNotMatch(patchText, /^  Port 443$/m)
  assert.match(patchText, /^  HostName web3\.example\.com$/m)

  // (2) rename the primary alias: the extra alias and unmanaged lines are retained.
  await saveSshHost({ paths: patchPaths, originalHost: 'db', host: { host: 'database', hostname: 'db2.example.com', user: 'admin2', port: '2201' } })
  patchText = await readFile(patchPaths.configPath, 'utf8')
  assert.match(patchText, /^Host database db-old$/m)
  assert.doesNotMatch(patchText, /^Host db db-old$/m)
  assert.match(patchText, /^  # keep this comment$/m)
  assert.match(patchText, /^  ServerAliveInterval 60$/m)
  assert.match(patchText, /^  LocalForward 8080 localhost:80$/m)
  assert.match(patchText, /^Match host db\n  User matchuser$/m)

  // (3) a following Match section survives delete untouched.
  const patchedDelete = await deleteSshHost({ paths: patchPaths, host: 'database' })
  assert.equal(patchedDelete.removed, true)
  patchText = await readFile(patchPaths.configPath, 'utf8')
  assert.match(patchText, /^Match host db\n  User matchuser$/m)
  assert.match(patchText, /^Host web$/m)
  assert.doesNotMatch(patchText, /Host database/)

  // (4) appending a new host still uses the canonical block format.
  await saveSshHost({ paths: patchPaths, host: { host: 'fresh', hostname: 'fresh.example.com', user: 'root', port: '22', identityFile: '~/.ssh/id_ed25519', forwardAgent: true } })
  patchText = await readFile(patchPaths.configPath, 'utf8')
  assert.match(patchText, /Host fresh\n  HostName fresh\.example\.com\n  User root\n  Port 22\n  IdentityFile ~\/\.ssh\/id_ed25519\n  ForwardAgent yes\n$/)
  assert.match(patchText, /^Match host db\n  User matchuser$/m)

  // (5) multiple IdentityFile fallback keys: only the first is managed, the rest stay verbatim.
  const multiSource = `${patchText.trimEnd()}\n\nHost multi\n  HostName multi.example.com\n  IdentityFile ~/.ssh/id_first\n  IdentityFile ~/.ssh/id_second\n`
  await writeFile(patchPaths.configPath, multiSource, 'utf8')
  await saveSshHost({ paths: patchPaths, originalHost: 'multi', host: { host: 'multi', hostname: 'multi2.example.com', user: 'multi', identityFile: '~/.ssh/id_first_v2' } })
  patchText = await readFile(patchPaths.configPath, 'utf8')
  assert.match(patchText, /HostName multi2\.example\.com/)
  assert.match(patchText, /\n  IdentityFile ~\/\.ssh\/id_first_v2\n  IdentityFile ~\/\.ssh\/id_second\n/)
  assert.equal((patchText.match(/IdentityFile/g) || []).length, 3)
  console.log('ok - SSH config edits preserve aliases/unmanaged lines and do not touch Match sections')

  assert.ok(indexTest.MAX_BODY_BYTES >= 14 * 1024 * 1024)
  assert.equal(indexTest.MAX_BODY_BYTES, 16 * 1024 * 1024)
  assert.equal(resolveSshPaths({ HOME: '/home/demo' }).stateDir, path.join('/home/demo', '.dsh', '.ssh-manager'))
  const dshHomePaths = resolveSshPaths({ HOME: '/home/demo', DSH_HOME: '/opt/dsh' })
  assert.equal(dshHomePaths.stateDir, path.join('/opt/dsh', '.ssh-manager'))
  assert.equal(dshHomePaths.backupDir, path.join('/opt/dsh', '.ssh-manager', 'backups'))
  assert.equal(dshHomePaths.configPath, path.join('/home/demo', '.ssh', 'config'))
  assert.equal(resolveSshPaths({ HOME: '/home/demo', DSH_HOME: '/opt/dsh', DSH_SSH_MANAGER_HOME: '/custom/ssh-manager' }).stateDir, '/custom/ssh-manager')
  console.log('ok - action body cap is 16 MiB and the state dir honors DSH_HOME')

  // known_hosts verification (plain, bracket, wildcard, hashed, revoked, mismatch, config).
  const hostKeyDir = path.join(temp, 'known-hosts')
  await mkdir(hostKeyDir, { recursive: true })
  const hostKeyFile = path.join(hostKeyDir, 'known_hosts')
  const hostKeyBlob = Buffer.from('dsh-ssh-manage-test-host-key-01')
  const hostKeyBlobB64 = hostKeyBlob.toString('base64')
  const otherHostKeyB64 = Buffer.from('dsh-ssh-manage-test-host-key-02').toString('base64')
  const knownHostsEnv = { SSH_KNOWN_HOSTS: hostKeyFile }
  assert.equal(knownHostsPath({ HOME: '/home/demo' }), path.join('/home/demo', '.ssh', 'known_hosts'))
  assert.equal(knownHostsPath({ HOME: '/home/demo', SSH_KNOWN_HOSTS: '/custom/known_hosts' }), '/custom/known_hosts')
  await writeFile(hostKeyFile, `example.com ssh-ed25519 ${hostKeyBlobB64}\n`, 'utf8')
  const verified = verifyHostKey({ host: 'example.com', hostname: 'example.com', port: '22' }, hostKeyBlob, knownHostsEnv)
  assert.equal(verified.ok, true)
  assert.match(verified.fingerprint, /^SHA256:/)
  assert.doesNotMatch(verified.fingerprint, /=/)
  const mismatched = verifyHostKey({ host: 'example.com', hostname: 'example.com', port: '22' }, Buffer.from('other-key'), knownHostsEnv)
  assert.equal(mismatched.ok, false)
  assert.match(mismatched.reason, /mismatch/)
  assert.equal(mismatched.fingerprint, keyFingerprint(Buffer.from('other-key')))
  assert.match(mismatched.expected, /^SHA256:/)
  const missingFile = verifyHostKey({ host: 'example.com', hostname: 'example.com' }, hostKeyBlob, { SSH_KNOWN_HOSTS: path.join(hostKeyDir, 'missing') })
  assert.equal(missingFile.ok, false)
  assert.match(missingFile.reason, /missing/)
  await writeFile(hostKeyFile, `[example.com]:2222,example.com ssh-ed25519 ${hostKeyBlobB64}\n`, 'utf8')
  assert.equal(verifyHostKey({ host: 'example.com', hostname: 'example.com', port: '2222' }, hostKeyBlob, knownHostsEnv).ok, true)
  assert.equal(verifyHostKey({ host: 'example.com', hostname: 'example.com', port: '2200' }, hostKeyBlob, knownHostsEnv).ok, false)
  await writeFile(hostKeyFile, `*.example.com ssh-ed25519 ${hostKeyBlobB64}\n`, 'utf8')
  assert.equal(verifyHostKey({ host: 'api.example.com', hostname: 'api.example.com' }, hostKeyBlob, knownHostsEnv).ok, true)
  assert.equal(verifyHostKey({ host: 'example.org', hostname: 'example.org' }, hostKeyBlob, knownHostsEnv).ok, false)
  const hashedTarget = '[example.com]:2222'
  const hashSalt = Buffer.from('0123456789abcdef0123')
  const hashDigest = createHmac('sha1', hashSalt).update(hashedTarget).digest()
  await writeFile(hostKeyFile, `|1|${hashSalt.toString('base64')}|${hashDigest.toString('base64')} ssh-ed25519 ${hostKeyBlobB64}\n`, 'utf8')
  assert.equal(verifyHostKey({ host: 'example.com', hostname: 'example.com', port: '2222' }, hostKeyBlob, knownHostsEnv).ok, true)
  await writeFile(hostKeyFile, `@revoked example.com ssh-ed25519 ${hostKeyBlobB64}\n`, 'utf8')
  const revoked = verifyHostKey({ host: 'example.com', hostname: 'example.com' }, hostKeyBlob, knownHostsEnv)
  assert.equal(revoked.ok, false)
  assert.match(revoked.reason, /revoked/)
  await writeFile(hostKeyFile, `@cert-authority example.com ssh-ed25519 ${otherHostKeyB64}\n`, 'utf8')
  const certAuthority = verifyHostKey({ host: 'example.com', hostname: 'example.com' }, hostKeyBlob, knownHostsEnv)
  assert.equal(certAuthority.ok, false)
  assert.match(certAuthority.reason, /not in known_hosts/)
  const parsedKnownHosts = parseKnownHosts(`# comment\n@revoked example.com ssh-ed25519 ${otherHostKeyB64}\n[example.com]:2222,example.com ssh-rsa AAAA\n`)
  assert.equal(parsedKnownHosts.length, 2)
  assert.equal(parsedKnownHosts[0].marker, '@revoked')
  assert.deepEqual(parsedKnownHosts[1].patterns, ['[example.com]:2222', 'example.com'])
  const knownHostsConfig = sshTest.connectionConfig({ host: 'example.com', hostname: 'example.com', port: '22', user: 'demo' }, 'secret')
  assert.equal(knownHostsConfig.keepaliveInterval, 15_000)
  assert.equal(knownHostsConfig.keepaliveCountMax, 3)
  assert.equal(typeof knownHostsConfig.hostVerifier, 'function')
  const savedKnownHostsEnv = process.env.SSH_KNOWN_HOSTS
  const savedInsecureHostKeyEnv = process.env.DSH_SSH_MANAGER_INSECURE_HOSTKEY
  try {
    delete process.env.DSH_SSH_MANAGER_INSECURE_HOSTKEY
    process.env.SSH_KNOWN_HOSTS = hostKeyFile
    await writeFile(hostKeyFile, `example.com ssh-ed25519 ${hostKeyBlobB64}\n`, 'utf8')
    assert.equal(knownHostsConfig.hostVerifier(hostKeyBlob), true)
    assert.equal(knownHostsConfig.hostVerifier(Buffer.from('unknown-host-key')), false)
    process.env.DSH_SSH_MANAGER_INSECURE_HOSTKEY = '1'
    assert.equal(knownHostsConfig.hostVerifier(Buffer.from('unknown-host-key')), true)
  } finally {
    if (savedKnownHostsEnv === undefined) delete process.env.SSH_KNOWN_HOSTS
    else process.env.SSH_KNOWN_HOSTS = savedKnownHostsEnv
    if (savedInsecureHostKeyEnv === undefined) delete process.env.DSH_SSH_MANAGER_INSECURE_HOSTKEY
    else process.env.DSH_SSH_MANAGER_INSECURE_HOSTKEY = savedInsecureHostKeyEnv
  }
  console.log('ok - known_hosts parsing/matching, mismatch/revoked rejection, keepalive and insecure escape')

  const securePaths = { stateDir: path.join(temp, '.dsh', '.ssh-manager') }
  await setPassword(securePaths, 'local', 'correct horse battery staple')
  assert.equal(await getPassword(securePaths, 'local'), 'correct horse battery staple')
  assert.equal(await hasPassword(securePaths, 'local'), true)
  const vaultText = await readFile(path.join(securePaths.stateDir, 'vault.json'), 'utf8')
  assert.doesNotMatch(vaultText, /correct horse battery staple/)
  await updateMetadata(securePaths, 'local', { group: 'dev', tags: ['lab', 'lab'], favorite: true })
  const metadata = await loadMetadata(securePaths)
  assert.deepEqual(metadata.entries.local.tags, ['lab'])
  assert.equal(metadata.entries.local.favorite, true)
  await removePassword(securePaths, 'local')
  assert.equal(await getPassword(securePaths, 'local'), null)
  console.log('ok - encrypted password vault and host metadata')

  // Concurrency: key creation and every store mutation must be serialized.
  for (let round = 0; round < 12; round += 1) {
    const concurrentPaths = { stateDir: path.join(temp, '.concurrent', 'vault', String(round)) }
    await Promise.all([
      listPasswordAliases(concurrentPaths),
      setPassword(concurrentPaths, 'alpha', 'pw-alpha'),
      setPassword(concurrentPaths, 'beta', 'pw-beta'),
    ])
    assert.equal(await getPassword(concurrentPaths, 'alpha'), 'pw-alpha')
    assert.equal(await getPassword(concurrentPaths, 'beta'), 'pw-beta')
    assert.deepEqual((await listPasswordAliases(concurrentPaths)).sort(), ['alpha', 'beta'])
  }
  for (let round = 0; round < 12; round += 1) {
    const concurrentPaths = { stateDir: path.join(temp, '.concurrent', 'metadata', String(round)) }
    await Promise.all([
      updateMetadata(concurrentPaths, 'alpha', { group: 'alpha' }),
      updateMetadata(concurrentPaths, 'beta', { group: 'beta' }),
    ])
    const concurrentMetadata = await loadMetadata(concurrentPaths)
    assert.equal(concurrentMetadata.entries.alpha.group, 'alpha')
    assert.equal(concurrentMetadata.entries.beta.group, 'beta')
  }
  for (let round = 0; round < 12; round += 1) {
    const concurrentConfigPaths = {
      configPath: path.join(temp, '.concurrent', 'config', String(round), 'config'),
      backupDir: path.join(temp, '.concurrent', 'config', String(round), 'backups'),
    }
    await mkdir(path.dirname(concurrentConfigPaths.configPath), { recursive: true })
    await Promise.all([
      saveSshHost({ paths: concurrentConfigPaths, host: { host: 'host-a', hostname: 'a.example.com' } }),
      saveSshHost({ paths: concurrentConfigPaths, host: { host: 'host-b', hostname: 'b.example.com' } }),
    ])
    const concurrentHosts = await listSshHosts(concurrentConfigPaths)
    assert.deepEqual(concurrentHosts.hosts.map((host) => host.host).sort(), ['host-a', 'host-b'])
  }
  console.log('ok - store serialization keeps concurrent vault, metadata and config writes')

  // originalHost must be an existing, non-wildcard host: never rewrite "Host *".
  const wildcardPaths = {
    configPath: path.join(temp, '.wildcard', 'config'),
    backupDir: path.join(temp, '.wildcard', 'backups'),
  }
  const wildcardSource = '# keep\nHost *\n  AddKeysToAgent yes\n\nHost real\n  HostName real.example.com\n'
  await mkdir(path.dirname(wildcardPaths.configPath), { recursive: true })
  await writeFile(wildcardPaths.configPath, wildcardSource, 'utf8')
  await assert.rejects(
    () => saveSshHost({ paths: wildcardPaths, originalHost: '*', host: { host: 'evil', hostname: 'evil.example.com' } }),
    /Invalid SSH host alias/,
  )
  assert.equal(await readFile(wildcardPaths.configPath, 'utf8'), wildcardSource)
  await assert.rejects(
    () => saveSshHost({ paths: wildcardPaths, originalHost: 'prod-old', host: { host: 'evil', hostname: 'evil.example.com' } }),
    /was not found/,
  )
  assert.equal(await readFile(wildcardPaths.configPath, 'utf8'), wildcardSource)
  await saveSshHost({ paths: wildcardPaths, originalHost: 'real', host: { host: 'renamed', hostname: 'real.example.com' } })
  const wildcardAfter = await readFile(wildcardPaths.configPath, 'utf8')
  assert.match(wildcardAfter, /^Host renamed$/m)
  assert.match(wildcardAfter, /^Host \*\n  AddKeysToAgent yes$/m)
  console.log('ok - originalHost validation rejects wildcards and missing blocks without touching the config')

  // A corrupt secondary store degrades the state response instead of breaking it.
  const degradedPaths = {
    configPath: path.join(temp, '.degraded', 'config'),
    stateDir: path.join(temp, '.degraded', 'state'),
    backupDir: path.join(temp, '.degraded', 'backups'),
  }
  await mkdir(path.dirname(degradedPaths.configPath), { recursive: true })
  await writeFile(degradedPaths.configPath, 'Host stable\n  HostName stable.example.com\n', 'utf8')
  await updateMetadata(degradedPaths, 'stable', { group: 'ops' })
  await writeFile(path.join(degradedPaths.stateDir, 'vault.json'), '{ this is not json', 'utf8')
  const degraded = await runAction(degradedPaths, 'state/refresh')
  assert.equal(degraded.state.hosts.length, 1)
  assert.equal(degraded.state.hosts[0].host, 'stable')
  assert.equal(degraded.state.hosts[0].group, 'ops')
  assert.equal(degraded.state.hosts[0].passwordConfigured, false)
  assert.ok(Array.isArray(degraded.state.warnings))
  assert.ok(degraded.state.warnings.some((warning) => warning.store === 'vault'))
  await writeFile(path.join(degradedPaths.stateDir, 'hosts.json'), 'not json either', 'utf8')
  const degradedMetadata = await runAction(degradedPaths, 'state/refresh')
  assert.equal(degradedMetadata.state.hosts.length, 1)
  assert.ok(degradedMetadata.state.warnings.some((warning) => warning.store === 'metadata'))
  console.log('ok - state degrades gracefully when the vault or metadata store is corrupt')

  const rich = normalizeEntry('demo', {
    group: ' ops ',
    tags: ['a', 'a'],
    favorite: true,
    label: 'Demo',
    note: 'n'.repeat(300),
    system: 's'.repeat(100),
    cpuCores: '8',
    memoryGB: '2.6',
    diskGB: 100.5,
    latencyMs: '12.4',
    checkedAt: '2026-01-01T00:00:00.000Z',
    unknown: 'dropped',
  })
  assert.equal(rich.group, 'ops')
  assert.deepEqual(rich.tags, ['a'])
  assert.equal(rich.favorite, true)
  assert.equal(rich.label, 'Demo')
  assert.equal(rich.note.length, 240)
  assert.equal(rich.system.length, 80)
  assert.equal(rich.cpuCores, 8)
  assert.equal(rich.memoryGB, 3)
  assert.equal(rich.diskGB, 101)
  assert.equal(rich.latencyMs, 12)
  assert.equal(rich.checkedAt, '2026-01-01T00:00:00.000Z')
  assert.equal('unknown' in rich, false)
  assert.deepEqual(Object.keys(rich).sort(), ['checkedAt', 'cpuCores', 'diskGB', 'favorite', 'group', 'label', 'latencyMs', 'memoryGB', 'note', 'system', 'tags'])

  const clamped = normalizeEntry('demo', { cpuCores: 9999, memoryGB: 2_000_000, diskGB: '2000000', latencyMs: 700_000 })
  assert.equal(clamped.cpuCores, 4096)
  assert.equal(clamped.memoryGB, 1048576)
  assert.equal(clamped.diskGB, 1048576)
  assert.equal(clamped.latencyMs, 600000)

  const defaults = normalizeEntry('demo', {})
  assert.equal(defaults.note, '')
  assert.equal(defaults.system, '')
  assert.equal(defaults.cpuCores, 0)
  assert.equal(defaults.memoryGB, 0)
  assert.equal(defaults.diskGB, 0)
  assert.equal(defaults.latencyMs, 0)
  assert.equal(defaults.checkedAt, '')
  assert.equal(normalizeEntry('demo', { cpuCores: -4, memoryGB: '-1' }).cpuCores, 0)
  assert.equal(normalizeEntry('demo', { cpuCores: -4, memoryGB: '-1' }).memoryGB, 0)
  assert.equal(normalizeEntry('demo', { cpuCores: 'not-a-number' }).cpuCores, 0)
  // SFTP destructive operations reject root/empty paths and no-op renames before connecting.
await assert.rejects(() => deleteRemotePath({ host: 'missing' }, '', '/'), /Refusing to delete/)
await assert.rejects(() => deleteRemotePath({ host: 'missing' }, '', '..'), /Refusing to delete/)
await assert.rejects(() => deleteRemotePath({ host: 'missing' }, '', '///'), /Refusing to delete/)
await assert.rejects(() => deleteRemotePath({ host: 'missing' }, '', '/.'), /Refusing to delete/)
await assert.rejects(() => deleteRemotePath({ host: 'missing' }, '', '../..'), /Refusing to delete/)
await assert.rejects(() => deleteRemotePath({ host: 'missing' }, '', 'C:'), /Refusing to delete/)
await assert.rejects(() => deleteRemotePath({ host: 'missing' }, '', 'C:.'), /Refusing to delete/)
await assert.rejects(() => renameRemotePath({ host: 'missing' }, '', '/srv/a', '/srv/a'), /same/)
await assert.rejects(() => renameRemotePath({ host: 'missing' }, '', '/srv/a', '/srv/a/'), /same/)
await assert.rejects(() => makeRemoteDirectory({ host: 'missing' }, '', ''), /Remote path is required/)
console.log('ok - SFTP mkdir/rename/delete guard root and empty paths before connecting')

console.log('ok - host metadata normalizes info fields, caps and drops unknown keys')

  const passwordlessPaths = {
    configPath: path.join(temp, '.passwordless', 'config'),
    stateDir: path.join(temp, '.passwordless', 'state'),
    backupDir: path.join(temp, '.passwordless', 'backups'),
  }
  await mkdir(path.dirname(passwordlessPaths.configPath), { recursive: true })
  await writeFile(passwordlessPaths.configPath, 'Host nopass\n  HostName 192.0.2.1\n  IdentityFile ~/.ssh/id_ed25519\n', 'utf8')
  const testStarted = Date.now()
  await assert.rejects(() => runAction(passwordlessPaths, 'ssh/test', { host: 'nopass' }), /Password is not configured for SSH host "nopass"/)
  await assert.rejects(() => runAction(passwordlessPaths, 'ssh/exec', { host: 'nopass', command: 'true' }), /Password is not configured for SSH host "nopass"/)
  await assert.rejects(() => execCommand({ host: 'nopass', hostname: '192.0.2.1' }, null, 'true'), /Password is required/)
  await assert.rejects(() => execCommand({ host: 'nopass', hostname: '192.0.2.1' }, '', 'true'), /Password is required/)
  assert.ok(Date.now() - testStarted < 5_000)
  console.log('ok - password-only transport rejects a host without a stored password before connecting')

  assert.deepEqual(parseProbeOutput('SYS=Linux\nOS=Ubuntu 22.04.3 LTS\nCORES=8\nMEM_MB=16384\nDISK_MB=51200\n'), { system: 'Ubuntu 22.04.3 LTS', cpuCores: 8, memoryGB: 16, diskGB: 50 })
  assert.deepEqual(parseProbeOutput('SYS=Darwin\n'), { system: 'Darwin', cpuCores: 0, memoryGB: 0, diskGB: 0 })
  assert.deepEqual(parseProbeOutput(''), { system: '', cpuCores: 0, memoryGB: 0, diskGB: 0 })
  assert.equal(parseProbeOutput('OS=Debian GNU/Linux 12\nMEM_MB=15999\nDISK_MB=51201').memoryGB, 16)
  assert.equal(parseProbeOutput('OS=Debian GNU/Linux 12\nMEM_MB=15999\nDISK_MB=51201').diskGB, 50)
  assert.equal(parseProbeOutput('OS="Rocky Linux 9.3"').system, 'Rocky Linux 9.3')
  console.log('ok - probe output parsing handles full and missing fields')

  const routePaths = {
    configPath: path.join(temp, '.routes', 'config'),
    stateDir: path.join(temp, '.routes', 'state'),
    backupDir: path.join(temp, '.routes', 'backups'),
  }
  await mkdir(path.dirname(routePaths.configPath), { recursive: true })
  await writeFile(routePaths.configPath, 'Host old\n  HostName old.example.com\n', 'utf8')
  await setPassword(routePaths, 'old', 'rename-secret')
  await updateMetadata(routePaths, 'old', { group: 'ops', note: 'keep me' })
  const renamed = await runAction(routePaths, 'host/save', { originalHost: 'old', host: { host: 'renamed', hostname: 'renamed.example.com' } })
  assert.equal(renamed.saved, true)
  assert.equal(renamed.state.stateDir, routePaths.stateDir)
  assert.equal(renamed.state.backupDir, routePaths.backupDir)
  assert.equal(renamed.state.hosts.length, 1)
  assert.equal(renamed.state.hosts[0].host, 'renamed')
  assert.equal(renamed.state.hosts[0].group, 'ops')
  assert.equal(renamed.state.hosts[0].note, 'keep me')
  assert.equal(renamed.state.hosts[0].passwordConfigured, true)
  const renamedMetadata = await loadMetadata(routePaths)
  assert.equal(renamedMetadata.entries.old, undefined)
  assert.equal(renamedMetadata.entries.renamed.group, 'ops')
  assert.equal(await getPassword(routePaths, 'renamed'), 'rename-secret')
  assert.equal(await getPassword(routePaths, 'old'), null)

  const revealed = await runAction(routePaths, 'credential/reveal', { host: 'renamed' })
  assert.equal(revealed.password, 'rename-secret')
  await assert.rejects(() => runAction(routePaths, 'credential/reveal', { host: 'no-such-host' }), /not found|missing/i)
  // Encrypted export/import: hosts, metadata and passwords round-trip, and
  // the plaintext password never appears in the exported JSON.
  const transferA = {
    configPath: path.join(temp, '.transfer-a', 'config'),
    stateDir: path.join(temp, '.transfer-a', 'state'),
    backupDir: path.join(temp, '.transfer-a', 'backups'),
  }
  const transferB = {
    configPath: path.join(temp, '.transfer-b', 'config'),
    stateDir: path.join(temp, '.transfer-b', 'state'),
    backupDir: path.join(temp, '.transfer-b', 'backups'),
  }
  await mkdir(path.dirname(transferA.configPath), { recursive: true })
  await mkdir(path.dirname(transferB.configPath), { recursive: true })
  await saveSshHost({ paths: transferA, host: { host: 'alpha', aliases: ['a'], hostname: 'alpha.example.com', user: 'root', port: '2222' } })
  await updateMetadata(transferA, 'alpha', { group: 'ops', note: 'transfer me', favorite: true })
  await setPassword(transferA, 'alpha', 'plain-transfer-secret')
  const exported = await createExport(transferA, 'correct horse battery')
  assert.equal(exported.format, 'dsh-ssh-manage-export')
  assert.equal(JSON.stringify(exported).includes('plain-transfer-secret'), false)
  const restored = await importExport(transferB, exported, 'correct horse battery')
  assert.equal(restored.created, 1)
  assert.equal(restored.metadata, 1)
  assert.equal(restored.passwords, 1)
  const hostsB = await listSshHosts(transferB)
  assert.equal(hostsB.hosts.length, 1)
  assert.equal(hostsB.hosts[0].host, 'alpha')
  assert.equal(hostsB.hosts[0].hostname, 'alpha.example.com')
  assert.equal(hostsB.hosts[0].port, '2222')
  assert.deepEqual((await loadMetadata(transferB)).entries.alpha.tags, [])
  assert.equal((await loadMetadata(transferB)).entries.alpha.note, 'transfer me')
  assert.equal(await getPassword(transferB, 'alpha'), 'plain-transfer-secret')
  await assert.rejects(() => importExport(transferB, exported, 'wrong passphrase'), /Cannot decrypt/)
  const merged = await importExport(transferB, exported, 'correct horse battery')
  assert.equal(merged.created, 0)
  assert.equal(merged.updated, 1)
  console.log('ok - encrypted export/import round-trips hosts, metadata and passwords')

  const tool = indexTest.managerTool(routePaths)
  assert.deepEqual(tool.parameters.properties.host.oneOf, [{ type: 'string' }, { type: 'object' }])
  assert.ok(tool.parameters.properties.action.enum.includes('sftp_mkdir'))
  assert.ok(tool.parameters.properties.action.enum.includes('sftp_rename'))
  assert.ok(tool.parameters.properties.action.enum.includes('sftp_delete'))
  assert.equal(tool.parameters.properties.newPath.type, 'string')
  assert.equal(tool.parameters.properties.overwrite.type, 'boolean')
  await indexTest.refreshSshHostCatalog(routePaths)
  const catalog = indexTest.getSshHostCatalog()
  assert.match(catalog, /alias=renamed/)
  assert.match(catalog, /group=ops/)
  assert.match(catalog, /password=stored/)
  assert.doesNotMatch(catalog, /rename-secret/)
  const metadataViaObject = await tool.execute({ action: 'set_metadata', host: { host: 'renamed' }, metadata: { note: 'from tool' } })
  assert.equal(metadataViaObject.metadata.note, 'from tool')
  assert.equal(metadataViaObject.state.hosts[0].note, 'from tool')
  const metadataViaString = await tool.execute({ action: 'set_metadata', host: 'renamed', metadata: { label: 'Renamed' } })
  assert.equal(metadataViaString.metadata.label, 'Renamed')
  assert.equal((await tool.execute({ action: 'overview' })).hostCount, 1)
  await assert.rejects(() => runAction(routePaths, 'ssh/exec', {}), /"host" is required/)
  await assert.rejects(() => tool.execute({ action: 'exec', host: { hostname: 'no-alias' }, command: 'true' }), /"host" is required/)
  console.log('ok - host rename migrates metadata and the stored password')
  console.log('ok - agent tool accepts string/object host, normalizes aliases and reports missing host')
} finally {
  await rm(temp, { recursive: true, force: true })
}
