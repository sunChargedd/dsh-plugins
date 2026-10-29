<div align="center">

<img src="icon.svg" width="96" height="96" alt="SSH Manager icon" />

# dsh-ssh-manage

**在 DSH 侧边栏管理 SSH 主机，并直接打开真正的交互式终端。**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](package.json)
[![npm](https://img.shields.io/npm/v/dsh-ssh-manage.svg)](https://www.npmjs.com/package/dsh-ssh-manage)
[![DSH](https://img.shields.io/badge/DeepSeek%20Harness-plugin-4E7CF6)](https://github.com/deepseek-ai/deepseek-harness)
[![GitHub](https://img.shields.io/badge/github-sunChargedd%2Fdsh--plugins-181717?logo=github)](https://github.com/sunChargedd/dsh-plugins)

**中文** | [English](README.en.md)

</div>

---

## 这是什么

`dsh-ssh-manage` 是 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 的 Web 插件。它把 `~/.ssh/config` 里的主机变成 DSH 侧边栏里可管理、可连接、可运维的对象：

- **主机管理**：扫描配置、分组、标签、收藏、备注、连接延迟、主机巡检；SSH 别名全局唯一，不同分组如需同名请使用可重复的“显示名称”；
- **DSH Agent 集成**：向 DSH 系统提示注入精简主机目录（别名/分组/显示名），地址等详情由 `list_hosts` 按需获取以控制 token；Agent 可直接用 `ssh_manager` 执行命令、批量命令、巡检和 SFTP 操作；支持 DSH 斜杠命令 `/ssh <alias> <command>` 直接执行、`/ssh` 列出主机；
- **Agent 安全**：设置页可开启只读模式；危险操作可选“执行前询问”走 DSH 审批；exec、批量命令、SFTP 写操作和主机变更会写入本地审计日志（自动脱敏命令中的密码/token）；
- **交互式终端**：ssh2 分配 PTY，xterm.js 渲染，支持彩色输出、方向键、`vim`/`top` 等全屏程序和窗口自适应；
- **备份迁移**：设置页可导出/导入主机、分组、标签、备注、收藏和密码；导出文件用自定义口令二次加密（scrypt + AES-256-GCM），导入按别名合并；
- **端口转发**：主机详情启动 `127.0.0.1:本地端口 → 远程主机:端口` 本地转发或本地 SOCKS5 代理，支持 ProxyJump/密钥，插件卸载时自动关闭；
- **日常运维**：批量命令、SFTP 目录浏览 / 新建 / 重命名 / 删除 / 上传 / 下载 / 远程文本编辑、传输队列与覆盖确认、测试连接；
- **凭据管理**：每台主机保存一份 AES-256-GCM 加密密码，不写进 `~/.ssh/config`；默认不返回浏览器，在主机详情点“显示密码”时才按需解密到当前页面，30 秒后自动隐藏；
- **Agent 工具**：`ssh_manager` 把同一套能力开放给模型。

不用再在终端和 DSH 之间来回切换，也不用记每个主机在配置文件里的位置。

## 特性

### 主机管理

- 左侧分组树 + 右侧主机表格：搜索、按分组筛选、收藏、标签、备注、连接状态与延迟一目了然；分组栏可拖拽调整宽度（双击恢复默认），宽度会记住。
- 新建、编辑、重命名、删除主机；重命名自动迁移分组、标签、收藏、备注、巡检信息和已保存密码。
- 表格列可配置（信息列 / 备注列 / 紧凑行高），窄屏自适应。
- 主机详情抽屉：地址、用户、端口、分组、标签、备注、发行版、CPU、内存、磁盘、延迟，以及「测试连接」「巡检」。
- 所有写操作先备份、再临时文件 + 原子重命名；解析失败时拒绝写入，不覆盖原配置。
- 只更新受管字段（`Host`、`HostName`、`User`、`Port`、`IdentityFile`、`ProxyJump`、`ForwardAgent`）；`Include`、`LocalForward`、注释、空行和其它别名原样保留。

### 交互式终端

- 点「连接」打开真正的 PTY shell，不是一条命令一条命令地执行。
- 多台主机以标签页常驻：切换到其它 DSH 会话再回来，终端会重新附着到原来的 shell，并回放最近约 256 KB 输出；关闭标签、Host 退出，或 30 分钟无输出/输入/心跳才会结束会话。
- xterm.js 6.0.0 渲染，支持 256 色、光标、滚动回看、选中复制、粘贴、窗口 resize、终端内搜索、字号调整和右键复制/粘贴菜单。
- 终端主题跟随 DSH 明暗主题；会话顶部有地址、密码状态、测试连接、文件、详情、清屏、关闭等快捷操作。
- 输出走同源 HTTP/SSE 长连接，输入 / 尺寸 / 关闭走同源 HTTP POST；插件同时保留经过测试的 WebSocket 备用通道。
- 断线或后端未加载时显示明确的状态与「重新连接」，不会静默卡死。

### 批量命令与文件

- **批量命令**：勾选多台主机，一次执行同一条命令，按主机汇总 stdout / stderr / 退出码。
- **SFTP**：在主机抽屉里浏览远程目录，新建文件夹、重命名、删除文件/空目录、上传（支持多选和覆盖确认）、下载、直接编辑远程文本文件并保存；会记住每台主机上次所在目录。
- **测试连接**：记录连接延迟，结果写回主机信息。
- **主机巡检**：读取发行版、CPU 核心数、内存、磁盘容量。

### 凭据与数据

- 密码使用 AES-256-GCM 加密保存在插件自己的状态目录，插件启动时自动解锁，不需要每次输入主密码，也不使用系统 Keychain。
- 密码只用于 SSH password authentication，同时兼容只提供 keyboard-interactive 的主机；不会写入 `~/.ssh/config`、命令参数或日志。默认不返回浏览器；仅在你主动点击“显示密码”时按需解密到当前页面，30 秒后自动隐藏，且不会通过 Agent 工具返回。
- 密码密文与本地密钥位于同一用户目录，主要防止文件被直接误读，不能抵御同一用户下的恶意进程。
- 主机分组、标签、收藏、备注、巡检结果保存在 `hosts.json`；密码保存在 `vault.json`；删除/修改配置前写入备份目录。

> **主机密钥校验**：连接会按 `known_hosts` 校验主机密钥（默认 `~/.ssh/known_hosts`，可用 `SSH_KNOWN_HOSTS` 指向其它文件）。首次连接或服务器密钥变更时会拒绝连接，错误信息包含服务器 `SHA256:` 指纹、期望指纹和 known_hosts 路径；请先通过可信渠道核对指纹；首次连接可直接在终端错误页点“信任主机密钥并重连”（会再次确认），也可手动写入 known_hosts。密钥变更不会被一键信任，需先核对并移除旧条目。`DSH_SSH_MANAGER_INSECURE_HOSTKEY=1` 会完全关闭校验，仅限紧急排障，不要长期使用。

### Agent 工具

`ssh_manager` 工具开放以下动作，和页面走同一套 Host 逻辑：

`overview`、`list_hosts`、`save_host`、`delete_host`、`set_metadata`、`save_password`、`delete_password`、`test_connection`、`inspect_host`、`exec`、`batch_exec`、`sftp_list`、`sftp_upload`、`sftp_download`、`sftp_mkdir`、`sftp_rename`、`sftp_delete`。

密码字段是 write-only，任何返回值都不包含密码明文。

### 其它

- 深色 / 浅色主题、窄屏布局，全部使用 DSH 主题 token。
- 读取 `~/.ssh/config` 中的非通配符 `Host` 条目；`Include` 及其它指令原样保留（不会展开 `Include` 内定义的主机）。
- 所有 Host 路由、PTY 路由、静态资源路由都经过 DSH 的 `connection.requestRejection` 鉴权，未认证请求返回 401。
- 不向第三方服务发送任何主机或终端数据。

## 使用

左侧栏 →「SSH 主机」：

| 标签页 | 用途 |
| --- | --- |
| **主机** | 分组树 + 主机表格；点「连接」进入终端，点行打开详情/文件抽屉。 |
| **会话** | 已打开的终端标签页；可切换、清屏、重连、关闭。 |
| **批量命令** | 勾选主机后执行同一条命令，查看汇总结果。 |
| **设置** | 配置文件、备份目录、状态目录、凭据数量、列显示、紧凑行高。 |

新建主机必填：别名、服务器地址、密码。密码不会写入 `~/.ssh/config`。

## 安装

### 从 npm 安装（推荐）

npm 包：[`dsh-ssh-manage`](https://www.npmjs.com/package/dsh-ssh-manage)（当前版本 `0.3.20`）。

```text
plugin_manager action=install_bundle target=dsh-ssh-manage@0.3.20
```

或使用 DSH CLI：

```bash
dsh plugin add dsh-ssh-manage@0.3.20
```

安装后刷新 Web 页面，左侧栏会出现「SSH 主机」入口，入口 id 为 `dsh-ssh-manage`。

> 从旧名 `dsh-ssh-manager` 迁移：包名、插件 id、路由前缀已改为 `dsh-ssh-manage`，但状态目录仍保留 `~/.dsh/.ssh-manager/`，已保存的主机、密码和元数据不会丢失。

### 本地开发安装

把仓库目录 link 进 DSH profile，改代码即时生效（Host 侧改动仍需重启 DSH）：

```text
plugin_manager action=install_bundle target=<仓库绝对路径>/dsh-ssh-manage
```

### 手动

在 profile 的 `cordis.patch.yml` 中加入：

```yaml
- insert:
    - id: dsh-ssh-manage
      name: 'dsh-ssh-manage'
      config: {}
```

并确保包可被 profile 解析（例如 `link:` 到本地目录）。

## 兼容性

| | 要求 |
| --- | --- |
| **DSH** | **`>=0.2.1-rc.3 <0.3.0`**（实机验证版本：DSH Desktop `0.2.1-rc.3`） |
| **Node.js** | `>=20`（跟随 DSH 内置运行时） |
| **平台** | 实机验证 macOS；测试套件只依赖 Node 内置模块，可跨平台运行 |
| **网络** | 需要能访问目标 SSH 主机的 22 端口（或配置的端口） |

- `package.json` 声明了 `engines.dsh`；DSH 在安装/启动前会做兼容性检查，不满足时阻止加载并提示。
- 用到的 DSH 扩展点：`sidebar.panellist` / `main` 槽位、`ctx.locale`、`ctx.webServer.register`、`ctx.webServer.registerUpgrade`、`ctx.webServer.tapIndex`、`ctx.tools.register`、`connection.requestRejection`。
- Host 侧在激活时会检查 `webServer.register` 是否存在，缺失时抛出明确错误。
- 安装或更新插件后，Host 侧的终端传输路由（HTTP/SSE 与备用 WebSocket）和静态资源路由需要重启 DSH 才会生效；仅刷新页面只会更新浏览器端代码。

## 架构

```
┌───────────────────────────── 浏览器 ─────────────────────────────┐
│  client.js                                                       │
│  sidebar.panellist 入口 + main 面板（主机/会话/批量/设置）         │
│  xterm.js 终端 · React（module table）· ctx.slots / ctx.locale    │
└───────────▲───────────────────────────────┬──────────────────────┘
            │ GET  /dsh-ssh-manage/state     │ POST /dsh-ssh-manage/action
            │ GET  /dsh-ssh-manage/pty/events │ POST /pty/open|input|resize|close
            │ （SSE 输出）                    │ （输入 / 尺寸 / 关闭）
┌───────────┴───────────────────────────────▼──────────────────────┐
│  index.js（Host 插件）                                            │
│  路由 · action 分发 · PTY 会话管理 · 静态资源 · ssh_manager 工具   │
└───────┬──────────────────────┬──────────────────────┬────────────┘
        │                      │                      │
┌───────▼────────┐   ┌─────────▼────────┐   ┌─────────▼─────────┐
│ lib/ssh-client │   │ lib/ssh-config   │   │ lib/storage       │
│ ssh2 连接/PTY/ │   │ 解析 / 局部写入  │   │ 状态 / 元数据 /   │
│ exec / SFTP    │   │ 备份 / 原子保存  │   │ vault / 备份      │
└───────┬────────┘   └─────────┬────────┘   └─────────┬─────────┘
        │                      │                      │
   ~/.ssh/config         ~/.ssh/config         ~/.dsh/.ssh-manager/
```

| 文件 | 职责 |
| --- | --- |
| `index.js` | Host 插件：HTTP/SSE/WS 路由、action 分发、PTY 会话、`ssh_manager` 工具。 |
| `client.js` | 浏览器插件：侧边栏入口、管理页、xterm 终端；只 `require('react')`。 |
| `lib/ssh-client.js` | ssh2 密码 / IdentityFile / ssh-agent 认证、PTY、exec、SFTP、巡检；known_hosts 校验与 keepalive。 |
| `lib/known-hosts.js` | `known_hosts` 解析与主机密钥校验（plain/bracket/wildcard/hashed/revoked，SHA256 指纹）。 |
| `lib/ssh-config.js` | `~/.ssh/config` 解析、局部写入、备份、原子保存。 |
| `lib/storage.js` / `lib/vault.js` / `lib/metadata.js` | 状态目录、AES-256-GCM 凭据仓库、主机元数据。 |
| `lib/ws.js` | 无依赖 RFC6455 WebSocket 服务端（备用 PTY 通道）。 |
| `assets/` | 随插件分发的 xterm.js 6.0.0、@xterm/addon-fit 0.11.0 与 MIT License。 |
| `scripts/test*.mjs` | 配置/状态/vault、WebSocket、PTY、SSE 的自动化测试。 |

## 数据与安全

- 只读写 `~/.ssh/config`、插件状态目录（默认 `~/.dsh/.ssh-manager/`，可用 `DSH_SSH_MANAGER_HOME` 覆盖）和备份目录。
- 写配置前备份，写入采用临时文件 + 原子重命名；只修改受管字段，其余内容尽量保持原样。
- 状态目录中的 `vault.json` 使用 AES-256-GCM 加密，密钥在当前用户目录；`hosts.json` 保存分组/标签/备注等非敏感元数据。
- 所有 Host / PTY / 静态资源路由都要求 DSH 浏览器会话认证，未认证请求返回 401。
- 终端输出仅在你自己的浏览器与目标 SSH 主机之间传输，不经过第三方服务。
- 连接按 OpenSSH `known_hosts` 校验主机密钥（默认 `~/.ssh/known_hosts`，可用 `SSH_KNOWN_HOSTS` 覆盖）；未知或变更的主机密钥会拒绝连接，并显示 `SHA256:` 指纹与 known_hosts 路径提示。`DSH_SSH_MANAGER_INSECURE_HOSTKEY=1` 仅限紧急排障时关闭校验。

## 开发

要求 Node.js >= 20。运行时依赖只有 `ssh2`，无构建步骤。

```bash
cd dsh-ssh-manage
npm install
npm test
```

| 命令 | 说明 |
| --- | --- |
| `npm run check` | 所有源文件语法检查 + client model/i18n 静态守卫 |
| `node scripts/test.mjs` | SSH config 解析/写入、备份、vault、元数据、工具参数 |
| `node scripts/test-ws.mjs` | WebSocket 握手/分帧/分片上限/严格校验、PTY 与静态资源路由 |
| `node scripts/test-pty.mjs` | 真实 ssh2 mock 服务器上的 WebSocket PTY 端到端 |
| `node scripts/test-sse.mjs` | 真实 ssh2 mock 服务器上的 HTTP/SSE PTY 端到端 + 401 鉴权 |
| `npm test` | 以上全部 |

终端组件使用随插件分发的 xterm.js 6.0.0（MIT，见 `assets/LICENSE.xterm`）、@xterm/addon-fit 0.11.0（MIT，见 `assets/LICENSE.addon-fit`）与 @xterm/addon-search 0.16.0（MIT，见 `assets/LICENSE.addon-search`）。

## 已知限制

- **主机密钥校验**：依赖本机 `known_hosts`；首次连接可在终端错误页核对 `SHA256:` 指纹后一键信任并写入；密钥变更不会自动信任，需先核对并移除旧条目。只读取 `~/.ssh/known_hosts` / `SSH_KNOWN_HOSTS`，不读取 ssh_config 的 `UserKnownHostsFile`/`GlobalKnownHostsFile`，也不支持 SSH CA 主机证书。紧急情况下可设置 `DSH_SSH_MANAGER_INSECURE_HOSTKEY=1` 临时关闭校验。
- **会话生命周期**：终端会话由 Host 保留，切换 DSH 会话/暂时离开插件面板/刷新页面后会重新附着并回放最近约 256 KB 输出；浏览器通过 `/pty/touch` 心跳续期，Host 侧超过 30 分钟无输出、输入或心跳的会话会作为孤儿清理（最大 16 个）。
- **认证方式**：支持已保存密码、`IdentityFile` 私钥和 `SSH_AUTH_SOCK` ssh-agent；私钥路径支持 `~`。带 passphrase 的加密私钥目前不弹口令，建议用 ssh-agent 加载。
- **ProxyJump**：支持单跳，填已有主机别名（复用该主机的密码/密钥）或 `user@host:port`（使用密钥/agent）；多跳暂不支持。跳板机主机密钥同样必须已在 known_hosts 中。
- **端口转发**：支持 LocalForward、RemoteForward（默认仅绑定跳板/目标服务器的 127.0.0.1）和本地 SOCKS5。隧道只存在于当前 Host 进程，插件卸载/DSH 退出后关闭。
- **Agent 审批**：需要 DSH 审批服务；审批不可用时危险操作会 fail closed（拒绝）。只读模式仍允许 list/test/inspect/下载。
- **配置编辑范围**：编辑器只修改 `Host`、`HostName`、`User`、`Port` 与插件元数据；其它 SSH 指令请在 `~/.ssh/config` 中维护。
- **批量命令**：一次执行一条命令，不等同于交互式终端；单台输出上限 1 MB，超出会标记 `truncated`。
- **文件大小**：SFTP 单文件上限 10 MB；远程文本编辑上限 1 MB。
- **SFTP 重命名/删除**：重命名默认拒绝覆盖已存在的目标（`sftp_rename` 工具可显式传 `overwrite: true`）；删除目录要求目录为空，根路径、`.`/`..` 和盘符根会被拒绝；符号链接按链接本身删除，不会跟随到目标。
- **xterm 资源**：首次打开会加载约 500 KB 的 xterm.js 基础资源；搜索组件按需加载，总计约 556 KiB（本地同源，不访问 CDN）。

## 参与贡献

欢迎 Issue、PR，以及不同 SSH 发行版 / 认证方式的兼容性反馈。提交前请先跑 `npm test`。

如果这个插件帮到了你，点个 ⭐ Star 是最好的支持。

## 许可证

[MIT](LICENSE) © 2026 Sun
