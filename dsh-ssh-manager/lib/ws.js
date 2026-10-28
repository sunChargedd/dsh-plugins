import { createHash } from 'node:crypto'

const WEBSOCKET_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
export const MAX_MESSAGE_BYTES = 2 * 1024 * 1024

const OPCODE = {
  continuation: 0x0,
  text: 0x1,
  binary: 0x2,
  close: 0x8,
  ping: 0x9,
  pong: 0xa,
}

/** Whether a request is a WebSocket upgrade request. */
export function isWebSocketUpgrade(req) {
  const headers = req?.headers ?? {}
  const upgrade = headers.upgrade
  const key = headers['sec-websocket-key']
  return String(Array.isArray(upgrade) ? upgrade[0] : upgrade ?? '').toLowerCase() === 'websocket' && typeof key === 'string' && key.length > 0
}

/** Compute the RFC 6455 accept value for a client key. */
export function websocketAccept(key) {
  return createHash('sha1').update(`${String(key)}${WEBSOCKET_GUID}`).digest('base64')
}

/** Encode one unmasked server-to-client frame. */
export function encodeFrame(opcode, payload = Buffer.alloc(0)) {
  const body = Buffer.isBuffer(payload) ? payload : Buffer.from(payload)
  const length = body.length
  let header
  if (length < 126) {
    header = Buffer.alloc(2)
    header[1] = length
  } else if (length <= 0xffff) {
    header = Buffer.alloc(4)
    header[1] = 126
    header.writeUInt16BE(length, 2)
  } else {
    header = Buffer.alloc(10)
    header[1] = 127
    header.writeBigUInt64BE(BigInt(length), 2)
  }
  header[0] = 0x80 | (opcode & 0x0f)
  return Buffer.concat([header, body])
}

/**
 * Decode one masked client frame from the front of `buffer`.
 * Returns null when more bytes are needed, or a diagnostic for a bad/large frame.
 */
export function parseClientFrame(buffer) {
  if (!buffer || buffer.length < 2) return null
  const first = buffer[0]
  const second = buffer[1]
  if ((first & 0x70) !== 0) return { protocolError: 'Reserved bits must be clear' }
  const fin = (first & 0x80) !== 0
  const opcode = first & 0x0f
  if (opcode >= 0x8 && (!fin || (second & 0x7f) > 125)) return { protocolError: 'Invalid control frame' }
  const masked = (second & 0x80) !== 0
  let length = second & 0x7f
  let offset = 2
  if (length === 126) {
    if (buffer.length < 4) return null
    length = buffer.readUInt16BE(2)
    offset = 4
  } else if (length === 127) {
    if (buffer.length < 10) return null
    const big = buffer.readBigUInt64BE(2)
    if (big > BigInt(MAX_MESSAGE_BYTES)) return { tooLarge: true }
    length = Number(big)
    offset = 10
  }
  if (length > MAX_MESSAGE_BYTES) return { tooLarge: true }
  if (!masked) return { protocolError: 'Client frames must be masked' }
  if (buffer.length < offset + 4 + length) return null
  const mask = buffer.subarray(offset, offset + 4)
  offset += 4
  const payload = Buffer.allocUnsafe(length)
  for (let index = 0; index < length; index += 1) payload[index] = buffer[offset + index] ^ mask[index & 3]
  return {
    frame: { fin, opcode, payload },
    rest: buffer.subarray(offset + length),
  }
}

/**
 * Minimal RFC 6455 server connection: handshake, masked client frame parsing,
 * text/binary messages, fragmentation, close and ping/pong. No extensions.
 */
export class WebSocketConnection {
  constructor(socket, head) {
    this.socket = socket
    this.buffer = head && head.length > 0 ? Buffer.from(head) : Buffer.alloc(0)
    this.listeners = { message: [], close: [] }
    this.fragmented = []
    this.fragmentedOpcode = 0
    this.fragmentedBytes = 0
    this.closed = false
    this.closeEmitted = false
    socket.on('data', (chunk) => this.feed(chunk))
    socket.on('close', () => this.finish())
    socket.on('error', () => this.finish())
    if (this.buffer.length > 0) this.drain()
  }

  on(event, listener) {
    if (!this.listeners[event]) throw new Error(`Unknown websocket event: ${event}`)
    this.listeners[event].push(listener)
    return () => {
      const list = this.listeners[event]
      const index = list.indexOf(listener)
      if (index >= 0) list.splice(index, 1)
    }
  }

  bufferedAmount() {
    return typeof this.socket.writableLength === 'number' ? this.socket.writableLength : 0
  }

  feed(chunk) {
    if (this.closed) return
    this.buffer = this.buffer.length > 0 ? Buffer.concat([this.buffer, chunk]) : Buffer.from(chunk)
    this.drain()
  }

  drain() {
    while (!this.closed) {
      const parsed = parseClientFrame(this.buffer)
      if (parsed === null) return
      if (parsed.tooLarge) {
        this.close(1009, 'Message too large')
        return
      }
      if (parsed.protocolError) {
        this.close(1002, parsed.protocolError)
        return
      }
      this.buffer = parsed.rest
      this.handleFrame(parsed.frame)
    }
  }

  handleFrame(frame) {
    const { fin, opcode, payload } = frame
    if (opcode === OPCODE.continuation) {
      if (this.fragmentedOpcode === 0) {
        this.close(1002, 'Unexpected continuation frame')
        return
      }
      this.fragmentedBytes += payload.length
      if (this.fragmentedBytes > MAX_MESSAGE_BYTES) {
        this.close(1009, 'Message too large')
        return
      }
      this.fragmented.push(payload)
      if (fin) {
        const data = Buffer.concat(this.fragmented, this.fragmentedBytes)
        const type = this.fragmentedOpcode
        this.fragmented = []
        this.fragmentedOpcode = 0
        this.fragmentedBytes = 0
        this.emitMessage(type, data)
      }
      return
    }
    if (opcode === OPCODE.text || opcode === OPCODE.binary) {
      if (this.fragmentedOpcode !== 0) {
        this.close(1002, 'Interleaved data frame')
        return
      }
      if (!fin) {
        this.fragmentedOpcode = opcode
        this.fragmented = [payload]
        this.fragmentedBytes = payload.length
        return
      }
      this.emitMessage(opcode, payload)
      return
    }
    if (opcode === OPCODE.close) {
      this.close(1000, '')
      return
    }
    if (opcode === OPCODE.ping) {
      this.sendFrame(OPCODE.pong, payload)
      return
    }
    if (opcode === OPCODE.pong) return
    this.close(1002, 'Unsupported opcode')
  }

  emitMessage(opcode, data) {
    for (const listener of [...this.listeners.message]) {
      try {
        listener({ binary: opcode === OPCODE.binary, data })
      } catch {
        // A listener error must not tear down framing.
      }
    }
  }

  sendFrame(opcode, payload) {
    if (this.closed || !this.socket.writable) return
    try {
      this.socket.write(encodeFrame(opcode, payload))
    } catch {
      this.finish()
    }
  }

  sendText(text) {
    this.sendFrame(OPCODE.text, Buffer.from(String(text), 'utf8'))
  }

  sendBinary(data) {
    this.sendFrame(OPCODE.binary, Buffer.isBuffer(data) ? data : Buffer.from(data))
  }

  ping() {
    this.sendFrame(OPCODE.ping, Buffer.alloc(0))
  }

  close(code = 1000, reason = '') {
    if (this.closeEmitted) return
    const text = Buffer.from(String(reason), 'utf8').subarray(0, 120)
    const body = Buffer.alloc(2 + text.length)
    body.writeUInt16BE(Number.isInteger(code) ? code : 1000, 0)
    text.copy(body, 2)
    this.sendFrame(OPCODE.close, body)
    this.closed = true
    try {
      this.socket.end()
    } catch {
      // The peer may already be gone.
    }
    this.finish()
  }

  finish() {
    if (this.closeEmitted) return
    this.closeEmitted = true
    this.closed = true
    for (const listener of [...this.listeners.close]) {
      try {
        listener()
      } catch {
        // Cleanup errors are already surfaced by the session owner.
      }
    }
  }
}

/** Complete the upgrade handshake and return the server connection. */
export function acceptWebSocket(req, socket, head) {
  if (!isWebSocketUpgrade(req)) {
    socket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nContent-Length: 0\r\n\r\n')
    socket.destroy()
    return undefined
  }
  if (String(req.headers['sec-websocket-version'] ?? '') !== '13') {
    socket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nContent-Length: 0\r\n\r\n')
    socket.destroy()
    return undefined
  }
  const key = String(req.headers['sec-websocket-key'])
  const accept = websocketAccept(key)
  socket.write(
    [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${accept}`,
      '',
      '',
    ].join('\r\n'),
  )
  return new WebSocketConnection(socket, head)
}

export const __test = { OPCODE, encodeFrame, parseClientFrame, websocketAccept }
