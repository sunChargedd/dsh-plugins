# dsh-ssh-manager

DSH 侧边栏插件，用于管理 `~/.ssh/config` 中的 SSH 主机并执行日常运维操作。

当前版本提供：

- 扫描并展示非通配符 `Host` 条目；
- 左侧分组树浏览主机，主区域用主机表格展示状态，右侧抽屉查看文件与主机详情；
- 打开连接后以「会话」标签页常驻：可同时打开多台主机的终端并随时切换，切换页面标签不会丢失输出，关闭会话标签才会结束该连接；
- 新建、编辑、重命名、删除主机；重命名时同步迁移分组、标签等元数据与已保存的密码；
- 修改前自动备份，写入采用临时文件加原子重命名；
- 编辑主机时就地更新受管的 6 个选项（HostName、User、Port、IdentityFile、ProxyJump、ForwardAgent），保留注释、空行、Include、LocalForward 等未管理内容和额外别名；
- 在插件自己的状态目录（默认 `$DSH_HOME/.ssh-manager/`，即 `~/.dsh/.ssh-manager/`；可用 `DSH_SSH_MANAGER_HOME` 覆盖）保存主机分组、标签、收藏、备注和加密密码；
- 密码使用 AES-256-GCM 加密，插件启动时自动解锁，不要求每次输入主密码，也不使用系统 Keychain；
- 认证仅支持 SSH password authentication：面板要求并为每台主机保存加密密码，测试连接、主机巡检和远程执行都使用它；未保存密码时会明确提示 `Password is not configured`，不会尝试密钥或 SSH agent；
- 配置中的 `IdentityFile`、`ProxyJump` 等条目会被原样保留，但不会用于传输认证；配置了 `ProxyJump` 的主机在连接时仍会返回明确错误，暂不能通过跳板机连接；
- 测试连接并记录连接延迟（`latencyMs`）；
- 主机巡检：发行版、CPU 核心数、内存和磁盘容量，结果写入主机信息并在连接抽屉中展示；
- 交互式 SSH 终端：通过 ssh2 分配 PTY，经同源 HTTP/SSE 长连接实时流式传输到浏览器（xterm.js 渲染；另有 WebSocket 备用实现），支持彩色输出、vim/top 等全屏程序和窗口自适应；
- 批量命令和 SFTP 目录浏览、上传、下载；
- 通过 DSH Agent 工具 `ssh_manager` 读取和操作同一套数据。

密码认证走 SSH password authentication（同时兼容只提供 keyboard-interactive 的主机）；密码不会写入 `~/.ssh/config`、命令参数、日志或返回给浏览器。密码密文与本地密钥位于同一用户目录，因此它主要防止文件被直接误读，不能抵御同一用户下的恶意进程。

**主机密钥校验**：当前传输未接入 `known_hosts` 主机密钥校验（与之前的单条命令执行一致），ssh2 默认接受服务器提供的主机密钥。请在可信网络中使用交互式终端；不要在不可信网络中输入 sudo 密码等敏感信息。

会话目前保存在插件页面的内存中：离开 SSH 插件面板或页面热更新会重置会话。终端渲染使用随插件分发的 xterm.js 6.0.0（MIT License，见 `assets/LICENSE.xterm`）与 @xterm/addon-fit 0.11.0（MIT License，见 `assets/LICENSE.addon-fit`）；PTY 输出通过同源的 `/dsh-ssh-manager/pty/events` HTTP/SSE 长连接流式传输，输入、窗口尺寸和关闭经同源 HTTP POST；插件同时保留了已验证的 WebSocket 备用通道。两者都要求 DSH 浏览器会话认证，终端输出不会经过第三方服务。

安装或更新插件后，Host 侧的终端传输路由（HTTP/SSE 以及备用 WebSocket）和静态资源路由需要重启 DSH 才会生效；仅刷新页面只会更新浏览器端代码。

要求 Node.js >= 20、DSH >= 0.2.1-rc.3 且 < 0.3.0。

```text
plugin_manager action=install_bundle target=<仓库绝对路径>/dsh-ssh-manager
```

开发测试：

```bash
npm test
```
