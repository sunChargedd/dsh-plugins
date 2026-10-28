import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MAX_MESSAGE_BYTES, WebSocketConnection, acceptWebSocket, encodeFrame, parseClientFrame, websocketAccept } from '../lib/ws.js'
import { __test as pluginTest } from '../index.js'

const packageDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

class FakeSocket extends EventEmitter {
  constructor() {
    super()
    this.writes = []
    this.writable = true
    this.writableLength = 0
    this.ended = false
    this.destroyed = false
  }
  write(chunk) {
    this.writes.push(Buffer.from(chunk))
    return true
  }
  end() {
    this.ended = true
    this.emit('close')
  }
  destroy() {
    this.destroyed = true
    this.emit('close')
  }
}

function clientFrame(opcode, payload, options = {}) {
  const body = Buffer.isBuffer(payload) ? payload : Buffer.from(payload)
  const fin = options.fin !== false
  const mask = Buffer.from([0x12, 0x34, 0x56, 0x78])
  let header
  if (body.length < 126) {
    header = Buffer.alloc(2)
    header[1] = 0x80 | body.length
  } else if (body.length <= 0xffff) {
    header = Buffer.alloc(4)
    header[1] = 0x80 | 126
    header.writeUInt16BE(body.length, 2)
  } else {
    header = Buffer.alloc(10)
    header[1] = 0x80 | 127
    header.writeBigUInt64BE(BigInt(body.length), 2)
  }
  header[0] = (fin ? 0x80 : 0x00) | opcode
  const masked = Buffer.allocUnsafe(body.length)
  for (let index = 0; index < body.length; index += 1) masked[index] = body[index] ^ mask[index & 3]
  return Buffer.concat([header, mask, masked])
}

function serverFrames(raw) {
  const boundary = raw.indexOf('\r\n\r\n')
  const buffer = boundary >= 0 ? raw.subarray(boundary + 4) : raw
  const frames = []
  let offset = 0
  while (offset + 2 <= buffer.length) {
    const first = buffer[offset]
    const second = buffer[offset + 1]
    const opcode = first & 0x0f
    let length = second & 0x7f
    let payloadOffset = offset + 2
    if (length === 126) {
      if (payloadOffset + 2 > buffer.length) break
      length = buffer.readUInt16BE(payloadOffset)
      payloadOffset += 2
    } else if (length === 127) {
      if (payloadOffset + 8 > buffer.length) break
      length = Number(buffer.readBigUInt64BE(payloadOffset))
      payloadOffset += 8
    }
    if (payloadOffset + length > buffer.length) break
    frames.push({ opcode, payload: buffer.subarray(payloadOffset, payloadOffset + length) })
    offset = payloadOffset + length
  }
  return frames
}

// RFC 6455 handshake example.
assert.equal(websocketAccept('dGhlIHNhbXBsZSBub25jZQ=='), 's3pPLMBiTxaQ9kYGzzhZRbK+xOo=')

// Unmasked server frames: header + payload.
assert.deepEqual(encodeFrame(0x1, Buffer.from('hi')), Buffer.from([0x81, 0x02, 0x68, 0x69]))
const medium = encodeFrame(0x2, Buffer.alloc(300))
assert.equal(medium[0], 0x82)
assert.equal(medium[1], 126)
assert.equal(medium.readUInt16BE(2), 300)
const large = encodeFrame(0x1, Buffer.alloc(70_000))
assert.equal(large[1], 127)
assert.equal(Number(large.readBigUInt64BE(2)), 70_000)

// Masked client frame parsing and the too-small-buffer path.
const masked = clientFrame(0x1, 'hello world')
assert.equal(parseClientFrame(masked.subarray(0, 5)), null)
const parsed = parseClientFrame(masked)
assert.equal(parsed.frame.fin, true)
assert.equal(parsed.frame.opcode, 0x1)
assert.equal(parsed.frame.payload.toString(), 'hello world')
assert.equal(parsed.rest.length, 0)
const oversizedHeader = Buffer.alloc(10)
oversizedHeader[1] = 127
oversizedHeader.writeBigUInt64BE(BigInt(MAX_MESSAGE_BYTES + 1), 2)
assert.equal(parseClientFrame(oversizedHeader).tooLarge, true)

// Handshake + message round-trip against a fake socket.
const socket = new FakeSocket()
const connection = acceptWebSocket(
  { headers: { upgrade: 'websocket', 'sec-websocket-key': 'dGhlIHNhbXBsZSBub25jZQ==', 'sec-websocket-version': '13' } },
  socket,
  Buffer.alloc(0),
)
assert.ok(connection)
assert.match(socket.writes[0].toString(), /^HTTP\/1\.1 101 Switching Protocols\r\n/)
assert.match(socket.writes[0].toString(), /Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK\+xOo=/)
const received = []
connection.on('message', (message) => received.push(message))
socket.emit('data', clientFrame(0x1, JSON.stringify({ type: 'input', data: 'ls\r' })))
assert.equal(received.length, 1)
assert.equal(JSON.parse(received[0].data.toString()).type, 'input')
// Ping receives a pong carrying the same payload.
socket.writes.length = 0
socket.emit('data', clientFrame(0x9, 'p'))
assert.deepEqual(socket.writes[0], Buffer.from([0x8a, 0x01, 0x70]))
// Server text and binary frames are unmasked.
socket.writes.length = 0
connection.sendText('ok')
assert.deepEqual(socket.writes[0], Buffer.from([0x81, 0x02, 0x6f, 0x6b]))
connection.sendBinary(Buffer.from([1, 2, 3]))
assert.deepEqual(socket.writes[1], Buffer.from([0x82, 0x03, 1, 2, 3]))
// Client close ends the socket and cleans up.
let closed = false
connection.on('close', () => { closed = true })
socket.emit('data', clientFrame(0x8, Buffer.from([0x03, 0xe8])))
assert.equal(closed, true)
assert.equal(socket.ended, true)
console.log('ok - WebSocket handshake, framing, masking and close handling')

// Strictness: RSV bits, unmasked frames and oversized control frames are rejected.
assert.equal(parseClientFrame(Buffer.from([0xc1, 0x02, 0x68, 0x69])).protocolError, 'Reserved bits must be clear')
const unmasked = Buffer.from([0x81, 0x02, 0x68, 0x69])
assert.equal(parseClientFrame(unmasked).protocolError, 'Client frames must be masked')
const oversizedPing = Buffer.alloc(4)
oversizedPing[0] = 0x89
oversizedPing[1] = 0xfe
oversizedPing.writeUInt16BE(200, 2)
assert.equal(parseClientFrame(oversizedPing).protocolError, 'Invalid control frame')

// Valid fragmentation is reassembled; an over-limit fragmented message closes with 1009.
const fragSocket = new FakeSocket()
const fragConnection = acceptWebSocket(
  { headers: { upgrade: 'websocket', 'sec-websocket-key': 'dGhlIHNhbXBsZSBub25jZQ==', 'sec-websocket-version': '13' } },
  fragSocket,
  Buffer.alloc(0),
)
const fragMessages = []
fragConnection.on('message', (message) => fragMessages.push(message))
fragSocket.emit('data', clientFrame(0x1, 'hello ', { fin: false }))
fragSocket.emit('data', clientFrame(0x0, 'world', { fin: true }))
assert.equal(fragMessages.length, 1)
assert.equal(fragMessages[0].data.toString(), 'hello world')
const bigSocket = new FakeSocket()
const bigConnection = acceptWebSocket(
  { headers: { upgrade: 'websocket', 'sec-websocket-key': 'dGhlIHNhbXBsZSBub25jZQ==', 'sec-websocket-version': '13' } },
  bigSocket,
  Buffer.alloc(0),
)
bigSocket.emit('data', clientFrame(0x1, Buffer.alloc(1024 * 1024), { fin: false }))
bigSocket.emit('data', clientFrame(0x0, Buffer.alloc(1024 * 1024), { fin: false }))
bigSocket.emit('data', clientFrame(0x0, Buffer.alloc(1024 * 1024), { fin: true }))
const closeFrames = serverFrames(Buffer.concat(bigSocket.writes)).filter((frame) => frame.opcode === 0x8)
assert.ok(closeFrames.length > 0)
assert.equal(closeFrames[0].payload.readUInt16BE(0), 1009)
assert.equal(bigSocket.ended, true)
console.log('ok - fragmented messages are capped and strict frame validation rejects malformed frames')

// Unauthenticated upgrade and asset requests are rejected before serving.
const deniedSocket = new FakeSocket()
await pluginTest.handlePtyUpgrade(
  { get: () => ({ requestRejection: () => 401 }) },
  {},
  { headers: { upgrade: 'websocket', 'sec-websocket-key': 'dGhlIHNhbXBsZSBub25jZQ==', 'sec-websocket-version': '13' } },
  deniedSocket,
  Buffer.alloc(0),
)
assert.match(deniedSocket.writes[0].toString(), /^HTTP\/1\.1 401 Unauthorized/)
assert.equal(deniedSocket.destroyed, true)

// Asset route registration and serving through the real plugin apply().
const { apply } = await import('../index.js')
const routes = []
const upgrades = []
const effects = []
const ctx = {
  effect: (callback, label) => {
    effects.push(label)
    const dispose = callback()
    return typeof dispose === 'function' ? dispose : () => {}
  },
  webServer: {
    register: (route) => {
      routes.push(route)
      return () => {}
    },
    registerUpgrade: (route) => {
      upgrades.push(route)
      return () => {}
    },
  },
  get: (key) => (key === 'connection' ? { requestRejection: () => undefined } : undefined),
  inject: (names, callback) => callback({ effect: (fn) => fn(), tools: { register: () => () => {} } }),
}
apply(ctx)
const assetPaths = ['/dsh-ssh-manage/assets/xterm.js', '/dsh-ssh-manage/assets/xterm.css', '/dsh-ssh-manage/assets/addon-fit.js', '/dsh-ssh-manage/assets/addon-search.js']
for (const assetPath of assetPaths) assert.ok(routes.some((route) => route.path === assetPath), `missing asset route ${assetPath}`)
assert.ok(routes.some((route) => route.path === '/dsh-ssh-manage/state'))
assert.ok(routes.some((route) => route.path === '/dsh-ssh-manage/action'))
assert.ok(upgrades.some((route) => route.path === '/dsh-ssh-manage/pty'))
assert.ok(readFileSync(path.join(packageDir, 'assets', 'xterm.js')).length > 100_000)
assert.ok(readFileSync(path.join(packageDir, 'assets', 'xterm.css')).length > 1000)

const cssRoute = routes.find((route) => route.path === '/dsh-ssh-manage/assets/xterm.css')
let status
let headers = {}
let body
const response = {
  set statusCode(value) { status = value },
  get statusCode() { return status },
  setHeader: (name, value) => { headers[name.toLowerCase()] = value },
  end: (value) => { body = value },
}
await cssRoute.handler({ method: 'GET', headers: {} }, response)
assert.equal(status, 200)
assert.match(headers['content-type'], /^text\/css/)
assert.ok(body.length > 1000)
const jsRoute = routes.find((route) => route.path === '/dsh-ssh-manage/assets/xterm.js')
status = undefined
body = undefined
await jsRoute.handler({ method: 'HEAD', headers: {} }, response)
assert.equal(status, 200)
assert.equal(body, undefined)

const untrustedRoutes = []
const untrustedCtx = {
  effect: (callback) => {
    const dispose = callback()
    return typeof dispose === 'function' ? dispose : () => {}
  },
  webServer: {
    register: (route) => {
      untrustedRoutes.push(route)
      return () => {}
    },
    registerUpgrade: () => () => {},
  },
  get: (key) => (key === 'connection' ? { requestRejection: () => 401 } : undefined),
  inject: (names, callback) => callback({ effect: (fn) => fn(), tools: { register: () => () => {} } }),
}
apply(untrustedCtx)
const deniedCss = untrustedRoutes.find((route) => route.path === '/dsh-ssh-manage/assets/xterm.css')
status = undefined
body = undefined
await deniedCss.handler({ method: 'GET', headers: {} }, response)
assert.equal(status, 401)
assert.equal(body, undefined)
console.log('ok - plugin registers PTY upgrade + xterm asset routes and serves the vendored terminal')
