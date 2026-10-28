<div align="center">

<img src="icon.svg" width="96" height="96" alt="SSH Manager icon" />

# dsh-ssh-manage

**Manage SSH hosts from the DSH sidebar and open a real interactive terminal.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](package.json)
[![npm](https://img.shields.io/npm/v/dsh-ssh-manage.svg)](https://www.npmjs.com/package/dsh-ssh-manage)
[![DSH](https://img.shields.io/badge/DeepSeek%20Harness-plugin-4E7CF6)](https://github.com/deepseek-ai/deepseek-harness)
[![GitHub](https://img.shields.io/badge/github-sunChargedd%2Fdsh--plugins-181717?logo=github)](https://github.com/sunChargedd/dsh-plugins)

[中文](README.md) | **English**

</div>

---

## What it is

`dsh-ssh-manage` is a Web plugin for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness). It turns the hosts in `~/.ssh/config` into manageable objects in the DSH sidebar:

- **Host management** — scan the config, groups, tags, favorites, notes, latency and host inspection;
- **Interactive terminal** — ssh2 allocates a PTY, xterm.js renders it, with colors, arrow keys, full-screen programs such as `vim`/`top`, and window resizing;
- **Day-to-day operations** — batch commands, SFTP browse/upload/download, connection tests;
- **Credentials** — one AES-256-GCM encrypted password per host, never written to `~/.ssh/config` and never returned to the browser;
- **Agent tool** — `ssh_manager` exposes the same capabilities to the model.

No more jumping between a terminal and DSH, and no need to remember where each host lives in the config file.

## Features

### Host management

- Group tree on the left, host table on the right: search, filter by group, favorite, tags, notes, connection state and latency. Drag the divider to resize the group sidebar (double-click resets; the width is remembered).
- Create, edit, rename and delete hosts; renaming migrates group, tags, favorites, notes, inspection data and the saved password.
- Configurable table columns (info / notes / compact rows), responsive on narrow screens.
- Host details drawer: address, user, port, group, tags, notes, distro, CPU, memory, disk, latency, plus "Test connection" and "Inspect".
- Every write is backed up first, then written via a temp file and atomic rename; parse failures refuse the write instead of overwriting the config.
- Only managed fields are updated (`Host`, `HostName`, `User`, `Port`); `IdentityFile`, `ProxyJump`, `ForwardAgent`, `Include`, `LocalForward`, comments, blank lines and extra aliases are preserved.

### Interactive terminal

- Click "Connect" to open a real PTY shell, not a one-command-at-a-time console.
- Multiple hosts stay as tabs: switching to another DSH session and coming back re-attaches to the existing shell and replays roughly the last 256 KB of output; only closing the tab ends the session.
- xterm.js 6.0.0 rendering with 256 colors, cursor, scrollback, selection copy, paste and resize.
- Terminal theme follows the DSH light/dark theme; the session bar has quick actions for address, password status, test, files, details, clear and close.
- Output is streamed over a same-origin HTTP/SSE connection; input, resize and close use same-origin HTTP POST. A tested WebSocket channel is kept as a fallback.
- Clear status and a "Reconnect" button when the backend is unavailable — no silent hang.

### Batch commands and files

- **Batch commands** — select hosts and run one command across them, with per-host stdout/stderr/exit code.
- **SFTP** — browse remote directories, upload and download from the host drawer, starting at the current user's home directory.
- **Connection test** — measures latency and writes it back to host metadata.
- **Host inspection** — distro, CPU cores, memory and disk capacity.

### Credentials and data

- Passwords are AES-256-GCM encrypted in the plugin state directory and unlocked automatically at startup; no master password, no system Keychain.
- Passwords are only used for SSH password authentication (also compatible with hosts that only offer keyboard-interactive). They are never written to `~/.ssh/config`, command arguments, logs or responses.
- Ciphertext and key live in the same user directory, so this mainly protects against accidental file reads, not against malicious processes running as the same user.
- Groups, tags, favorites, notes and inspection data live in `hosts.json`; passwords live in `vault.json`; configuration changes are snapshotted to the backup directory.

> **Host key verification:** the transport does not verify `known_hosts` host keys (ssh2 accepts the server-provided key, same as the previous one-shot command path). **Use the interactive terminal only on trusted networks** and do not type sudo passwords on untrusted networks.

### Agent tool

`ssh_manager` exposes: `overview`, `list_hosts`, `save_host`, `delete_host`, `set_metadata`, `save_password`, `delete_password`, `test_connection`, `inspect_host`, `exec`, `batch_exec`, `sftp_list`, `sftp_upload`, `sftp_download`.

The password parameter is write-only; no response contains a plaintext password.

### Misc

- Light/dark themes, narrow layouts, all using DSH theme tokens.
- Reads non-wildcard `Host` entries from `~/.ssh/config`; `Include` and other directives are preserved verbatim (hosts defined inside `Include` are not expanded).
- Every Host, PTY and static-asset route is gated by DSH `connection.requestRejection`; unauthenticated requests get 401.
- No host or terminal data is sent to third-party services.

## Usage

Sidebar → "SSH Hosts":

| Tab | Purpose |
| --- | --- |
| **Hosts** | Group tree and host table; "Connect" opens a terminal, clicking a row opens the details/files drawer. |
| **Sessions** | Open terminal tabs; switch, clear, reconnect, close. |
| **Batch** | Select hosts, run one command and review aggregated output. |
| **Settings** | Config path, backup directory, state directory, vault count, column preferences, compact rows. |

Creating a host requires alias, hostname and password. The password is not written to `~/.ssh/config`.

## Installation

### From npm (recommended)

npm package: [`dsh-ssh-manage`](https://www.npmjs.com/package/dsh-ssh-manage) (current version `0.2.1`).

```text
plugin_manager action=install_bundle target=dsh-ssh-manage@0.2.1
```

Or with the DSH CLI:

```bash
dsh plugin add dsh-ssh-manage@0.2.1
```

After installation, refresh the Web page; the sidebar shows an "SSH Hosts" entry with id `dsh-ssh-manage`.

> Migrating from the old name `dsh-ssh-manager`: package name, plugin id and route prefix are now `dsh-ssh-manage`, but the state directory remains `~/.dsh/.ssh-manager/`, so saved hosts, passwords and metadata are preserved.

### Local development

Link the repository directory into the DSH profile; code changes apply immediately (Host-side changes still need a DSH restart):

```text
plugin_manager action=install_bundle target=<repository>/dsh-ssh-manage
```

### Manual

Add to the profile's `cordis.patch.yml`:

```yaml
- insert:
    - id: dsh-ssh-manage
      name: 'dsh-ssh-manage'
      config: {}
```

and make sure the package is resolvable by the profile (for example `link:` to the local directory).

## Compatibility

| | Requirement |
| --- | --- |
| **DSH** | **`>=0.2.1-rc.3 <0.3.0`** (validated on DSH Desktop `0.2.1-rc.3`) |
| **Node.js** | `>=20` (follows the DSH runtime) |
| **Platform** | Validated on macOS; the test suite only uses Node built-ins and runs cross-platform |
| **Network** | Reachable SSH port (22 by default, or the configured port) |

- `package.json` declares `engines.dsh`; DSH checks compatibility before loading and refuses an incompatible version.
- DSH extension points used: `sidebar.panellist` / `main` slots, `ctx.locale`, `ctx.webServer.register`, `ctx.webServer.registerUpgrade`, `ctx.webServer.tapIndex`, `ctx.tools.register`, `connection.requestRejection`.
- The Host half checks that `webServer.register` exists and throws a clear error otherwise.
- After installing or updating the plugin, the Host-side terminal routes (HTTP/SSE and the WebSocket fallback) and static-asset routes need a DSH restart; refreshing the page only updates browser code.

## Architecture

```
┌───────────────────────── Browser ──────────────────────────┐
│  client.js                                                │
│  sidebar.panellist entry + main panel (hosts/sessions/    │
│  batch/settings), xterm.js terminal, React, ctx.slots      │
└─────────▲──────────────────────────────┬───────────────────┘
          │ GET /dsh-ssh-manage/state    │ POST /dsh-ssh-manage/action
          │ GET /dsh-ssh-manage/pty/events │ POST /pty/open|input|resize|close
          │ (SSE output)                 │ (input / resize / close)
┌─────────┴──────────────────────────────▼───────────────────┐
│  index.js (Host plugin)                                    │
│  routes · action dispatch · PTY sessions · assets · tool   │
└───────┬──────────────────────┬──────────────────────┬──────┘
        │                      │                      │
┌───────▼────────┐   ┌─────────▼────────┐   ┌─────────▼─────────┐
│ lib/ssh-client │   │ lib/ssh-config   │   │ lib/storage       │
│ ssh2: PTY,     │   │ parse / patch /  │   │ state / metadata /│
│ exec, SFTP     │   │ backup / atomic  │   │ vault / backups   │
└───────┬────────┘   └─────────┬────────┘   └─────────┬─────────┘
        │                      │                      │
   ~/.ssh/config         ~/.ssh/config         ~/.dsh/.ssh-manager/
```

| File | Responsibility |
| --- | --- |
| `index.js` | Host plugin: HTTP/SSE/WS routes, action dispatch, PTY sessions, `ssh_manager` tool. |
| `client.js` | Browser plugin: sidebar entry, management page, xterm terminal; only `require('react')`. |
| `lib/ssh-client.js` | ssh2 password auth, PTY, exec, SFTP, inspection. |
| `lib/ssh-config.js` | `~/.ssh/config` parsing, in-place editing, backups, atomic saves. |
| `lib/storage.js` / `lib/vault.js` / `lib/metadata.js` | State directory, AES-256-GCM vault, host metadata. |
| `lib/ws.js` | Dependency-free RFC6455 WebSocket server (fallback PTY channel). |
| `assets/` | Vendored xterm.js 6.0.0, @xterm/addon-fit 0.11.0 and MIT licenses. |
| `scripts/test*.mjs` | Config/state/vault, WebSocket, PTY and SSE tests. |

## Data and security

- Reads and writes only `~/.ssh/config`, the plugin state directory (default `~/.dsh/.ssh-manager/`, override with `DSH_SSH_MANAGER_HOME`) and the backup directory.
- Configuration writes are backed up first and use a temp file + atomic rename; only managed fields change, other content is preserved.
- `vault.json` uses AES-256-GCM with a key in the current user directory; `hosts.json` holds groups/tags/notes and other non-secret metadata.
- All Host / PTY / static-asset routes require an authenticated DSH browser session; unauthenticated requests return 401.
- Terminal traffic only flows between your browser and the target SSH host; no third-party service is involved.
- `known_hosts` host-key verification is not implemented; only use it on trusted networks for sensitive input.

## Development

Node.js >= 20. The only runtime dependency is `ssh2`; there is no build step.

```bash
cd dsh-ssh-manage
npm install
npm test
```

| Command | Description |
| --- | --- |
| `npm run check` | Syntax checks + client model/i18n static guard |
| `node scripts/test.mjs` | SSH config parse/write, backups, vault, metadata, tool arguments |
| `node scripts/test-ws.mjs` | WebSocket handshake/framing/limits/strictness, PTY and asset routes |
| `node scripts/test-pty.mjs` | WebSocket PTY end-to-end against a real ssh2 mock server |
| `node scripts/test-sse.mjs` | HTTP/SSE PTY end-to-end against a real ssh2 mock server + 401 auth |
| `npm test` | All of the above |

The terminal uses vendored xterm.js 6.0.0 (MIT, see `assets/LICENSE.xterm`) and @xterm/addon-fit 0.11.0 (MIT, see `assets/LICENSE.addon-fit`).

## Known limitations

- **Host key verification** is not implemented; ssh2 accepts the server-provided key. Use trusted networks only.
- **Session lifetime**: sessions are kept on the Host; switching to another DSH session, temporarily leaving the panel, or refreshing the page re-attaches to the existing shell and replays roughly the last 256 KB of output. Only closing the tab or exiting the Host process ends them; orphaned sessions are reaped after 6 hours of inactivity (max 16 sessions).
- **Password auth only**: IdentityFile / SSH agent / ProxyJump are not used for transport; those config fields are preserved but ignored. ProxyJump hosts fail with a clear error.
- **Config editing scope**: the editor only changes `Host`, `HostName`, `User`, `Port` and plugin metadata; maintain other SSH directives in `~/.ssh/config`.
- **Batch commands** run one command; they are not an interactive terminal. Per-host output is capped at 1 MB and marked `truncated` when exceeded.
- **File size**: SFTP files are capped at 10 MB.
- **xterm assets**: the first terminal open loads about 500 KB of xterm.js from the same origin (no CDN).

## Contributing

Issues and PRs are welcome, especially compatibility feedback for different SSH distributions and auth methods. Run `npm test` before submitting.

If this plugin helps you, a ⭐ Star is the best support.

## License

[MIT](LICENSE) © 2026 Sun
