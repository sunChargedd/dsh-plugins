window.__ModuleLoader__.load({
  id: 'dsh-ssh-manage',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'dsh-ssh-manage'
    const PANEL_ID = 'dsh-ssh-manage'
    const STATE_ROUTE = '/dsh-ssh-manage/state'
    const ACTION_ROUTE = '/dsh-ssh-manage/action'

    // ---------------------------------------------------------------------
    // Copy (zh/en pairs, registered through the Client locale service)
    // ---------------------------------------------------------------------

    const TEXT = {
      panel: ['SSH 主机', 'SSH Hosts'],
      'tabs.hosts': ['主机', 'Hosts'],
      'tabs.sessions': ['会话', 'Sessions'],
      'session.restoring': ['正在恢复终端会话…', 'Restoring terminal sessions…'],
      'session.tooMany': ['最多同时打开 16 个终端会话，请先关闭一个。', 'At most 16 terminal sessions can be open. Close one first.'],
      'session.attention': ['有会话已结束或出错', 'A session exited or failed'],
      'session.state.loading': ['加载中', 'Loading'],
      'session.state.connecting': ['连接中', 'Connecting'],
      'session.state.ready': ['运行中', 'Running'],
      'session.state.closed': ['已结束', 'Exited'],
      'session.state.error': ['错误', 'Error'],
      'tabs.batch': ['批量命令', 'Batch'],
      'tabs.settings': ['设置', 'Settings'],
      'session.new': ['新建连接', 'New connection'],
      'session.close': ['关闭会话', 'Close session'],
      'session.clear': ['清空输出', 'Clear output'],
      'session.files': ['文件管理', 'Files'],
      'session.details': ['主机详情', 'Details'],
      'app.configFile': ['配置文件', 'Config file'],
      'app.copyConfig': ['复制配置路径', 'Copy config path'],
      'toolbar.collapse': ['收起', 'Collapse'],
      'toolbar.resize': ['拖动调整分组栏宽度，双击恢复默认', 'Drag to resize the group sidebar; double-click to reset'],
      'toolbar.expand': ['展开', 'Expand'],
      'toolbar.refresh': ['刷新', 'Refresh'],
      'toolbar.checkAll': ['测试全部', 'Test all'],
      'latency.offline': ['离线', 'Offline'],
      'state.healthChecked': ['健康检查完成：在线 {online}，离线 {offline}', 'Health check complete: {online} online, {offline} offline'],
      'toolbar.groups': ['分组', 'Groups'],
      'toolbar.new': ['新建主机', 'New host'],
      'toolbar.newShort': ['SSH', 'SSH'],
      'toolbar.filter': ['只看收藏', 'Favorites only'],
      'toolbar.info': ['信息', 'Info'],
      'toolbar.settings': ['显示设置', 'View options'],
      'toolbar.local': ['本地配置', 'Local config'],
      'toolbar.backups': ['备份', 'Backups'],
      'search.placeholder': ['搜索主机、地址或标签', 'Search hosts, addresses, tags'],
      'tree.all': ['全部', 'All'],
      'tree.ungrouped': ['未分组', 'Ungrouped'],
      'tree.collapse': ['折叠分组', 'Collapse group'],
      'tree.expand': ['展开分组', 'Expand group'],
      'table.system': ['系统', 'System'],
      'table.latency': ['延迟', 'Latency'],
      'table.name': ['名称', 'Name'],
      'table.address': ['地址', 'Address'],
      'table.info': ['信息', 'Info'],
      'table.notes': ['备注', 'Notes'],
      'table.actions': ['操作', 'Actions'],
      'table.selectAll': ['全选主机', 'Select all hosts'],
      'table.select': ['选择主机', 'Select host'],
      'table.unknownOs': ['未知系统', 'Unknown'],
      'table.noData': ['—', '—'],
      'table.inspectHint': ['尚未巡检；打开主机详情点“巡检”获取系统、CPU、内存和磁盘信息。', 'Not inspected yet; open host details and click Inspect to collect OS, CPU, memory and disk facts.'],
      'table.test': ['测试连接', 'Test connection'],
      'table.copyAddress': ['复制地址', 'Copy address'],
      'table.open': ['打开终端会话', 'Open terminal session'],
      'table.selected': ['已选 {count} 台主机', '{count} selected'],
      'table.clearSelection': ['取消选择', 'Clear'],
      'table.batch': ['批量命令', 'Batch command'],
      'table.favoriteSelected': ['收藏', 'Favorite'],
      'table.sortBy': ['按 {column} 排序', 'Sort by {column}'],
      'row.connect': ['连接', 'Connect'],
      'row.edit': ['编辑', 'Edit'],
      'row.more': ['更多', 'More'],
      'row.favorite': ['收藏', 'Favorite'],
      'row.unfavorite': ['取消收藏', 'Unfavorite'],
      'row.inspect': ['检测系统信息', 'Detect system info'],
      'row.test': ['测试连接', 'Test connection'],
      'row.delete': ['删除主机', 'Delete host'],
      'latency.testing': ['测试中…', 'Testing…'],
      'latency.unknown': ['未测试', 'Not tested'],
      'credential.password': ['密码', 'Password'],
      'credential.none': ['未配置', 'Not set'],
      'credential.key': ['SSH 密钥', 'SSH key'],
      'empty.title': ['还没有 SSH 主机', 'No SSH hosts yet'],
      'empty.body': ['从 ~/.ssh/config 读取主机，或直接在这里新建一个。', 'Hosts come from ~/.ssh/config, or create one here.'],
      'empty.new': ['新建主机', 'New host'],
      'empty.filteredTitle': ['没有匹配的主机', 'No matching hosts'],
      'empty.filteredBody': ['换个关键词，或清除搜索与筛选。', 'Try another keyword, or clear the filters.'],
      'empty.clearFilters': ['清除筛选', 'Clear filters'],
      'state.error': ['操作失败：{message}', 'Operation failed: {message}'],
      'state.loadError': ['无法读取 SSH 配置：{message}', 'Could not read SSH config: {message}'],
      'state.loading': ['加载中…', 'Loading…'],
      'state.fileTooLarge': ['文件超过 10MB 上限。', 'File exceeds the 10 MB limit.'],
      'state.uiError': ['界面渲染失败：{message}', 'Interface failed to render: {message}'],
      'state.retry': ['重试', 'Retry'],
      'state.saved': ['主机配置已保存。', 'Host saved.'],
      'state.deleted': ['主机已删除。', 'Host deleted.'],
      'state.passwordSaved': ['密码已加密保存。', 'Password saved (encrypted).'],
      'state.passwordRemoved': ['密码已清除。', 'Password removed.'],
      'state.tested': ['连接成功，延迟 {ms} ms。', 'Connected in {ms} ms.'],
      'state.inspected': ['系统信息已更新。', 'System info updated.'],
      'state.favorited': ['已加入收藏。', 'Added to favorites.'],
      'state.unfavorited': ['已取消收藏。', 'Removed from favorites.'],
      'state.copied': ['已复制到剪贴板。', 'Copied to clipboard.'],
      'state.copyFailed': ['复制失败。', 'Copy failed.'],
      'state.groupsSaved': ['分组已更新。', 'Groups updated.'],
      'state.uploaded': ['上传完成。', 'Upload complete.'],
      'state.downloaded': ['下载已开始。', 'Download started.'],
      'state.hostMissing': ['主机已被删除。', 'This host was removed.'],
      'confirm.deleteTitle': ['删除 SSH 主机', 'Delete SSH host'],
      'confirm.deleteBody': ['确定删除主机“{name}”吗？', 'Delete the host “{name}”?'],
      'confirm.deleteHint': ['这会从 ~/.ssh/config 中移除该主机，并删除本地保存的密码。', 'This removes the host from ~/.ssh/config and deletes the locally stored password.'],
      'confirm.deleteGroupTitle': ['删除分组', 'Delete group'],
      'confirm.deleteGroupBody': ['删除分组“{name}”后，组内主机会变为未分组。', 'Hosts in “{name}” become ungrouped.'],
      'common.cancel': ['取消', 'Cancel'],
      'common.delete': ['删除', 'Delete'],
      'common.save': ['保存', 'Save'],
      'common.saving': ['保存中…', 'Saving…'],
      'common.close': ['关闭', 'Close'],
      'common.copy': ['复制', 'Copy'],
      'common.upload': ['上传', 'Upload'],
      'common.download': ['下载', 'Download'],
      'common.read': ['读取', 'Open'],
      'common.refresh': ['刷新', 'Refresh'],
      'editor.newTitle': ['新建 SSH 主机', 'New SSH host'],
      'editor.editTitle': ['编辑 SSH 主机', 'Edit SSH host'],
      'editor.alias': ['别名', 'Alias'],
      'editor.aliasPlaceholder': ['prod', 'prod'],
      'editor.aliasHint': ['~/.ssh/config 中的 Host 别名，必须全局唯一；不同分组要显示同名，请使用“显示名称”。', 'The Host alias in ~/.ssh/config must be globally unique. To show the same name in different groups, use Display name.'],
      'editor.hostname': ['服务器地址', 'Hostname'],
      'editor.hostnamePlaceholder': ['203.0.113.10 或 example.com', '203.0.113.10 or example.com'],
      'editor.user': ['用户', 'User'],
      'editor.userPlaceholder': ['root', 'root'],
      'editor.port': ['端口', 'Port'],
      'editor.group': ['分组', 'Group'],
      'editor.groupPlaceholder': ['例如 production', 'e.g. production'],
      'editor.groupChoose': ['选择已有分组', 'Choose an existing group'],
      'editor.groupNone': ['无分组', 'No group'],
      'editor.groupNoOptions': ['还没有已有分组，直接输入新名称即可。', 'No groups yet; type a new name.'],
      'editor.tags': ['标签', 'Tags'],
      'editor.tagsPlaceholder': ['web, critical（逗号分隔）', 'web, critical (comma separated)'],
      'editor.label': ['显示名称', 'Display name'],
      'editor.labelPlaceholder': ['例如 生产 API', 'e.g. Production API'],
      'editor.labelHint': ['显示名称可以重复，列表和终端标签优先显示它；SSH 别名仍需唯一。', 'Display names may repeat; lists and terminal tabs prefer it. The SSH alias must still be unique.'],
      'editor.aliasExists': ['SSH 别名“{alias}”已被主机“{host}”使用（分组：{group}）。SSH 要求别名全局唯一；如果只是想在另一个分组显示同名，请改用建议别名，并把“显示名称”设为 {alias}。', 'SSH alias "{alias}" is already used by "{host}" (group: {group}). SSH aliases must be globally unique. To show the same name in another group, use the suggested alias and set Display name to {alias}.'],
      'editor.useSuggestedAlias': ['使用建议别名 {alias}', 'Use suggested alias {alias}'],
      'editor.note': ['备注', 'Notes'],
      'editor.notePlaceholder': ['给这台主机的说明，会显示在列表里', 'A short note shown in the list'],
      'editor.passwordSection': ['服务器密码', 'Server password'],
      'editor.passwordRequired': ['服务器密码（必填）', 'Server password (required)'],
      'editor.passwordOptional': ['服务器密码（留空保持不变）', 'Server password (leave blank to keep)'],
      'editor.passwordRequiredError': ['请填写服务器密码。', 'Server password is required.'],
      'editor.passwordRequiredHint': ['密码使用 AES-256-GCM 加密保存在插件自己的目录，不会写入 ~/.ssh/config。', 'Encrypted with AES-256-GCM in the plugin state directory; never written to ~/.ssh/config.'],
      'editor.identityFile': ['私钥文件', 'Identity file'],
      'editor.identityFileHint': ['可选，例如 ~/.ssh/id_ed25519；留空则尝试 ssh-agent 和已保存密码。', 'Optional, e.g. ~/.ssh/id_ed25519; leave empty to try ssh-agent and the saved password.'],
      'editor.proxyJump': ['跳板机 / ProxyJump', 'ProxyJump'],
      'editor.proxyJumpHint': ['可选，填已有主机别名（凭据用该主机的保存密码）或 user@host:port；暂不支持多跳。', 'Optional: an existing host alias (uses that host’s saved credentials) or user@host:port. Multi-hop is not supported yet.'],
      'editor.passwordAuthOptional': ['密码（可选，仅作为密钥/agent 失败时的备用）', 'Password (optional; fallback when key/agent auth fails)'],
      'editor.passwordExisting': ['已保存密码，填写新密码可替换；留空则保持不变。', 'A password is stored; type a new one to replace it, or leave blank.'],
      'editor.required': ['请填写别名和服务器地址。', 'Alias and hostname are required.'],
      'editor.invalidAlias': ['别名只能包含字母、数字、点、下划线、@ 和短横线。', 'Alias may only contain letters, digits, dot, underscore, @ and dash.'],
      'editor.delete': ['删除这台主机', 'Delete this host'],
      'editor.discardChanges': ['有未保存的修改，确定放弃？', 'Discard unsaved changes?'],
      'drawer.files': ['文件', 'Files'],
      'drawer.details': ['详情', 'Details'],
      'terminal.loading': ['正在加载终端…', 'Loading terminal…'],
      'terminal.connecting': ['正在连接…', 'Connecting…'],
      'terminal.failed': ['终端连接失败', 'Terminal connection failed'],
      'terminal.disconnected': ['连接已断开', 'Connection closed'],
      'terminal.exited': ['远程会话已结束', 'Remote session ended'],
      'terminal.reconnect': ['重新连接', 'Reconnect'],
      'terminal.openDetails': ['打开主机详情', 'Open details'],
      'terminal.assetsError': ['终端组件加载失败：{message}。如果刚更新插件，请重启 DSH 后重试。', 'Could not load the terminal component: {message}. If the plugin was just updated, restart DSH and retry.'],
      'terminal.resyncFailed': ['终端输出曾中断，已尝试重新同步；如仍异常请重连。', 'Terminal output was interrupted; attempted a resync. Reconnect if problems persist.'],
      'terminal.trustHostKey': ['信任主机密钥并重连', 'Trust host key and reconnect'],
      'terminal.hostKeyHint': ['请先通过服务器控制台或服务商核对上方 SHA256 指纹；确认一致后再点击“信任主机密钥”。', 'Verify the SHA256 fingerprint above against the server console or provider first, then click Trust host key.'],
      'terminal.trustHostKeyConfirm': ['确认已通过服务器控制台或服务商核对上方 SHA256 指纹？确认后会将该密钥写入 known_hosts。', 'Have you verified the SHA256 fingerprint above against the server console or provider? Confirming adds this key to known_hosts.'],
      'terminal.hostKeyTrusted': ['已写入 known_hosts，正在重连。', 'Added to known_hosts; reconnecting.'],
      'terminal.hostKeyTrustFailed': ['无法信任主机密钥：{message}', 'Could not trust the host key: {message}'],
      'terminal.search': ['搜索终端', 'Search terminal'],
      'terminal.searchNext': ['下一个', 'Next match'],
      'terminal.searchPrevious': ['上一个', 'Previous match'],
      'terminal.searchCase': ['区分大小写', 'Match case'],
      'terminal.searchClose': ['关闭搜索', 'Close search'],
      'terminal.fontSmaller': ['缩小字号', 'Smaller terminal font'],
      'terminal.fontLarger': ['放大字号', 'Larger terminal font'],
      'terminal.menu.copy': ['复制', 'Copy'],
      'terminal.menu.paste': ['粘贴', 'Paste'],
      'terminal.menu.selectAll': ['全选', 'Select all'],
      'terminal.menu.clear': ['清屏', 'Clear'],
      'terminal.menu.title': ['终端菜单', 'Terminal menu'],
      'terminal.searchUnavailable': ['终端搜索加载失败，请重启 DSH 后重试。', 'Terminal search failed to load; restart DSH and retry.'],
      'terminal.copyFailed': ['复制失败，请检查浏览器剪贴板权限。', 'Copy failed; check browser clipboard permissions.'],
      'terminal.pasteFailed': ['粘贴失败，请检查浏览器剪贴板权限。', 'Paste failed; check browser clipboard permissions.'],
      'terminal.backendHint': ['无法连接到插件后端。如果刚更新插件，请重启 DSH 后重试。', 'Cannot reach the plugin backend. If the plugin was just updated, restart DSH and retry.'],
      'terminal.passwordMissing': ['该主机没有可用的密码或密钥认证，请打开「主机详情」配置密码或私钥。', 'No usable password or key auth for this host. Open Details to configure a password or identity file.'],
      'drawer.exit': ['退出码 {code}', 'exit {code}'],
      'drawer.files.path': ['远程路径', 'Remote path'],
      'drawer.files.up': ['上级目录', 'Parent directory'],
      'drawer.files.empty': ['目录暂无内容。', 'This directory is empty.'],
      'drawer.files.mkdir': ['新建文件夹', 'New folder'],
      'drawer.files.mkdirTitle': ['新建文件夹', 'New folder'],
      'drawer.files.rename': ['重命名', 'Rename'],
      'drawer.files.renameTitle': ['重命名', 'Rename'],
      'drawer.files.delete': ['删除', 'Delete'],
      'drawer.files.deleteTitle': ['删除', 'Delete'],
      'drawer.files.deleteConfirm': ['确定删除“{name}”？删除目录时要求目录为空。', 'Delete "{name}"? Directories must be empty.'],
      'drawer.files.name': ['名称', 'Name'],
      'drawer.files.invalidName': ['名称不能为空，也不能包含 / 或 \\。', 'Name must be non-empty and cannot contain / or \\.'],
      'drawer.files.created': ['文件夹已创建', 'Folder created'],
      'drawer.files.renamed': ['已重命名', 'Renamed'],
      'drawer.files.deleted': ['已删除', 'Deleted'],
      'drawer.files.edit': ['编辑远程文件', 'Edit remote file'],
      'drawer.files.editHint': ['直接编辑远程文本文件并保存；最大 1 MB。保存会覆盖远程文件。', 'Edit a remote text file and save it back; up to 1 MB. Saving overwrites the remote file.'],
      'drawer.files.editDiscard': ['有未保存的修改，确定放弃？', 'Discard unsaved changes?'],
      'drawer.files.editBinary': ['该文件看起来是二进制，不能作为文本编辑。', 'This file looks binary and cannot be edited as text.'],
      'drawer.files.edited': ['远程文件已保存', 'Remote file saved'],
      'drawer.files.overwrite': ['远程已存在“{name}”，确定覆盖？', 'Remote "{name}" already exists. Overwrite?'],
      'drawer.files.transferRunning': ['传输中', 'Running'],
      'drawer.files.transferDone': ['完成', 'Done'],
      'common.create': ['新建', 'Create'],
      'drawer.files.dir': ['目录', 'dir'],
      'drawer.files.uploading': ['上传中…', 'Uploading…'],
      'drawer.details.connection': ['连接信息', 'Connection'],
      'drawer.details.alias': ['别名', 'Alias'],
      'drawer.details.address': ['地址', 'Address'],
      'drawer.details.user': ['用户', 'User'],
      'drawer.details.port': ['端口', 'Port'],
      'drawer.details.credentials': ['凭据', 'Credentials'],
      'drawer.details.password': ['密码', 'Password'],
      'drawer.details.savePassword': ['保存密码', 'Save password'],
      'drawer.details.clearPassword': ['清除密码', 'Clear password'],
      'drawer.details.passwordHint': ['密码使用 AES-256-GCM 加密保存在本机；点击“显示密码”可在当前页面临时明文查看，30 秒后自动隐藏。', 'Passwords are AES-256-GCM encrypted at rest; use Show password to reveal one temporarily on this page (auto-hides after 30 seconds).'],
      'drawer.details.reveal': ['显示密码', 'Show password'],
      'drawer.details.hide': ['隐藏密码', 'Hide password'],
      'drawer.details.copyPassword': ['复制密码', 'Copy password'],
      'drawer.details.passwordCopied': ['密码已复制', 'Password copied'],
      'drawer.details.revealWarning': ['密码已明文显示；注意旁人、录屏和截图，30 秒后自动隐藏。', 'The password is visible in plain text; watch for onlookers, screen recording and screenshots. It hides after 30 seconds.'],
      'drawer.details.revealFailed': ['无法显示密码：{message}', 'Could not reveal the password: {message}'],
      'drawer.snippets.title': ['快捷命令', 'Quick commands'],
      'drawer.snippets.hint': ['保存这台主机常用的只读/运维命令，一键执行并查看输出。', 'Save common commands for this host, run one click and inspect the output.'],
      'drawer.snippets.name': ['命令名称', 'Command name'],
      'drawer.snippets.command': ['命令内容', 'Command'],
      'drawer.snippets.add': ['保存', 'Save'],
      'drawer.snippets.run': ['执行快捷命令', 'Run quick command'],
      'drawer.tunnels.title': ['端口转发', 'Port forwarding'],
      'drawer.tunnels.count': ['{count} 个活动隧道', '{count} active'],
      'drawer.tunnels.hint': ['本地监听 127.0.0.1，转发到目标机再访问的远程地址；本地端口留空自动分配。', 'Listens on 127.0.0.1 locally and forwards through the SSH host to the remote address. Leave the local port empty for an automatic port.'],
      'drawer.tunnels.local': ['本地转发', 'Local'],
      'drawer.tunnels.socks': ['SOCKS5 代理', 'SOCKS5'],
      'drawer.tunnels.remote': ['远程转发', 'Remote'],
      'drawer.tunnels.localHost': ['本地目标', 'Local target'],
      'drawer.tunnels.localPort': ['本地端口', 'Local port'],
      'drawer.tunnels.remoteHost': ['远程主机', 'Remote host'],
      'drawer.tunnels.remotePort': ['远程端口', 'Remote port'],
      'drawer.tunnels.start': ['启动', 'Start'],
      'drawer.tunnels.stop': ['停止隧道', 'Stop tunnel'],
      'drawer.tunnels.started': ['隧道已启动', 'Tunnel started'],
      'drawer.tunnels.stopped': ['隧道已停止', 'Tunnel stopped'],
      'drawer.details.system': ['主机信息', 'System'],
      'drawer.details.detect': ['检测信息', 'Detect'],
      'drawer.details.detecting': ['检测中…', 'Detecting…'],
      'drawer.details.systemLabel': ['系统', 'OS'],
      'drawer.details.cores': ['CPU', 'CPU'],
      'drawer.details.memory': ['内存', 'Memory'],
      'drawer.details.disk': ['磁盘', 'Disk'],
      'drawer.details.latency': ['延迟', 'Latency'],
      'drawer.details.checkedAt': ['最近检测', 'Last checked'],
      'drawer.details.noInfo': ['还没有检测过。点击“检测信息”通过 SSH 获取系统、CPU、内存和磁盘信息。', 'No data yet. Detect over SSH to fetch OS, CPU, memory and disk.'],
      'drawer.details.group': ['分组', 'Group'],
      'drawer.details.tags': ['标签', 'Tags'],
      'drawer.details.note': ['备注', 'Notes'],
      'drawer.details.edit': ['编辑主机', 'Edit host'],
      'drawer.details.delete': ['删除主机', 'Delete host'],
      'drawer.details.test': ['测试连接', 'Test connection'],
      'drawer.details.testing': ['测试中…', 'Testing…'],
      'units.cores': ['{n} 核', '{n} cores'],
      'units.memory': ['{n}G 内存', '{n}G RAM'],
      'units.disk': ['{n}G 硬盘', '{n}G disk'],
      'batch.title': ['批量命令', 'Batch commands'],
      'batch.subtitle': ['在选中的主机上并发执行同一条远程命令。', 'Run one remote command across selected hosts.'],
      'batch.command': ['命令', 'Command'],
      'batch.commandPlaceholder': ['例如：uptime && df -h /', 'e.g. uptime && df -h /'],
      'batch.targets': ['目标主机', 'Targets'],
      'batch.selectAll': ['全选', 'Select all'],
      'batch.clear': ['清空选择', 'Clear'],
      'batch.selected': ['已选 {count} 台', '{count} selected'],
      'batch.run': ['执行命令', 'Run command'],
      'batch.running': ['执行中…', 'Running…'],
      'batch.emptyHosts': ['还没有主机。先添加一个主机再来执行批量命令。', 'No hosts yet. Add one before running batch commands.'],
      'batch.needCommand': ['请先输入命令并选择至少一台主机。', 'Enter a command and select at least one host.'],
      'batch.results': ['执行结果', 'Results'],
      'batch.noResults': ['尚未执行。', 'Nothing has run yet.'],
      'batch.ok': ['成功', 'OK'],
      'batch.failed': ['失败', 'Failed'],
      'batch.noOutput': ['（无输出）', '(no output)'],
      'batch.duration': ['耗时 {ms} ms', '{ms} ms'],
      'settings.title': ['设置', 'Settings'],
      'settings.config': ['配置文件', 'Config file'],
      'settings.configPath': ['路径', 'Path'],
      'settings.backupDir': ['备份目录', 'Backup directory'],
      'settings.stateDir': ['状态目录', 'State directory'],
      'settings.vault': ['凭据仓库', 'Credential vault'],
      'settings.vaultDesc': ['密码使用 AES-256-GCM 加密保存在本机状态目录，插件启动时自动解锁，不需要主密码。', 'Passwords are AES-256-GCM encrypted in the local state directory and unlocked automatically; no master password.'],
      'settings.transfer': ['备份与迁移', 'Backup and migration'],
      'settings.transferBadge': ['加密导出', 'Encrypted export'],
      'settings.transferDesc': ['导出主机、分组、标签、备注、收藏和密码，密码用你设置的口令二次加密；导入时按别名合并，不会删除现有主机。', 'Export hosts, groups, tags, notes, favorites and passwords. Passwords are encrypted again with a passphrase you choose; import merges by alias and never deletes existing hosts.'],
      'settings.export': ['导出', 'Export'],
      'settings.import': ['导入', 'Import'],
      'transfer.exportTitle': ['导出主机数据', 'Export host data'],
      'transfer.importTitle': ['导入主机数据', 'Import host data'],
      'transfer.exportDesc': ['将导出 {count} 台主机及其分组、标签、备注、收藏和全部密码。密码部分会用口令再次加密。', 'Exports {count} host(s) with groups, tags, notes, favorites and all passwords. Password data is encrypted again with a passphrase.'],
      'transfer.importDesc': ['选择由 dsh-ssh-manage 导出的 JSON 文件，输入导出时设置的口令。按主机别名合并：相同别名更新，新别名创建，不删除现有主机。', 'Choose a JSON file exported by dsh-ssh-manage and enter its passphrase. Hosts merge by alias: existing aliases update, new ones are created, nothing is deleted.'],
      'transfer.passphrase': ['导出/导入口令（至少 8 位）', 'Export/import passphrase (at least 8 characters)'],
      'transfer.confirmPassphrase': ['再次输入口令', 'Repeat the passphrase'],
      'transfer.passphraseHint': ['口令只用于加密导出文件，不会保存。忘记口令将无法恢复导出的密码。', 'The passphrase only encrypts the export file and is not stored. A lost passphrase cannot be recovered.'],
      'transfer.chooseFile': ['选择导出 JSON 文件', 'Choose export JSON file'],
      'transfer.fileReady': ['已选择：{count} 台主机', 'Selected: {count} host(s)'],
      'transfer.fileTooLarge': ['文件超过 8 MB，拒绝读取。', 'File is larger than 8 MB and was rejected.'],
      'transfer.invalidFile': ['不是有效的 dsh-ssh-manage 导出文件。', 'Not a valid dsh-ssh-manage export file.'],
      'transfer.chooseFileFirst': ['请先选择导出文件。', 'Choose an export file first.'],
      'transfer.passphraseShort': ['口令至少需要 8 位。', 'Passphrase must be at least 8 characters.'],
      'transfer.passphraseMismatch': ['两次输入的口令不一致。', 'The passphrases do not match.'],
      'transfer.exportWarning': ['导出文件包含加密后的密码，请妥善保管文件与口令，不要上传到公共位置。', 'The export contains encrypted passwords; keep both the file and passphrase safe and do not upload them publicly.'],
      'transfer.importMergeNote': ['导入采用合并模式，不会删除现有主机或密码。', 'Import uses merge mode and never deletes existing hosts or passwords.'],
      'transfer.doExport': ['加密导出', 'Export encrypted'],
      'transfer.doImport': ['导入并合并', 'Import and merge'],
      'transfer.exported': ['已导出 {count} 台主机', 'Exported {count} host(s)'],
      'transfer.imported': ['导入完成：新建 {created}，更新 {updated}，恢复密码 {passwords}', 'Import complete: {created} created, {updated} updated, {passwords} password(s) restored'],
      'transfer.importWarnings': ['{count} 条记录未能导入，请查看提示。', '{count} record(s) could not be imported.'],
      'settings.vaultCount': ['{count} 台主机已保存密码', '{count} hosts have a stored password'],
      'settings.vaultNone': ['还没有保存任何密码', 'No passwords stored yet'],
      'settings.agentSecurity': ['Agent 安全', 'Agent security'],
      'settings.readonly': ['只读模式（阻止 Agent 执行命令、写入和删除）', 'Read-only mode (block Agent exec, writes and deletes)'],
      'settings.approvalAudit': ['只审计', 'Audit only'],
      'settings.approvalAsk': ['执行前询问', 'Ask before executing'],
      'settings.approvalHint': ['“执行前询问”会通过 DSH 审批弹窗确认 exec、批量命令和破坏性 SFTP 操作。', 'Ask before executing uses the DSH approval prompt for exec, batch commands and destructive SFTP.'],
      'settings.audit': ['最近审计', 'Recent audit'],
      'settings.auditEmpty': ['暂无 Agent 操作记录。', 'No Agent operations recorded yet.'],
      'settings.appearance': ['外观', 'Appearance'],
      'settings.infoColumn': ['显示信息列', 'Show info column'],
      'settings.notesColumn': ['显示备注列', 'Show notes column'],
      'settings.compact': ['紧凑行高', 'Compact rows'],
      'settings.about': ['关于', 'About'],
      'settings.aboutDesc': ['DSH 侧边栏插件，管理 ~/.ssh/config 主机、凭据、远程命令和 SFTP 文件。', 'DSH sidebar plugin for hosts in ~/.ssh/config, credentials, remote commands and SFTP.'],
      'settings.aboutTag': ['DSH 侧边栏插件', 'DSH sidebar plugin'],
      'groups.title': ['管理分组', 'Manage groups'],
      'groups.subtitle': ['重命名或删除分组，组内主机会同步更新。', 'Rename or delete groups; their hosts are updated.'],
      'groups.empty': ['还没有分组。在主机编辑里填写“分组”即可创建。', 'No groups yet. Set “Group” in a host editor to create one.'],
      'groups.count': ['{count} 台主机', '{count} hosts'],
      'groups.rename': ['重命名', 'Rename'],
      'groups.delete': ['删除', 'Delete'],
      'groups.renamePlaceholder': ['输入新的分组名称', 'New group name'],
      'columns.title': ['显示设置', 'View options'],
      'columns.info': ['信息列', 'Info column'],
      'columns.notes': ['备注列', 'Notes column'],
      'columns.compact': ['紧凑模式', 'Compact mode'],
      'columns.reset': ['恢复默认', 'Reset'],
      'backups.title': ['自动备份', 'Automatic backups'],
      'backups.desc': ['每次修改 ~/.ssh/config 前都会写入备份目录。', 'Every write to ~/.ssh/config is preceded by a backup.'],
      'config.title': ['本地配置', 'Local config'],
      'config.exists': ['已读取', 'Loaded'],
      'config.missing': ['尚未创建', 'Not created yet'],
    }

    const ZH = {}
    const EN = {}
    for (const [key, pair] of Object.entries(TEXT)) {
      ZH[key] = pair[0]
      EN[key] = pair[1]
    }

    // ---------------------------------------------------------------------
    // Utilities
    // ---------------------------------------------------------------------

    function cx(...parts) {
      return parts.filter(Boolean).join(' ')
    }

    function errorMessage(error) {
      return error instanceof Error ? error.message : String(error)
    }

    function parseTags(text) {
      return String(text ?? '')
        .split(/[,，]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 20)
    }

    function hostName(host) {
      return host.label || host.host
    }

    function hostAddress(host) {
      const target = host.hostname || host.host
      const port = host.port ? `:${host.port}` : ''
      const user = host.user ? `${host.user}@` : ''
      return `${user}${target}${port}`
    }

    // Table / session chrome shows only the hostname (the name column already
    // carries the alias); the full user@host:port stays in titles and copy.
    function hostTarget(host) {
      return host.hostname || host.host
    }

    function hostGroupKey(host) {
      return host.group || ''
    }

    function shortSystem(system) {
      const value = String(system ?? '').trim()
      if (value === '') return ''
      return value.split(/\s+/)[0].slice(0, 24)
    }

    function hostSearchText(host) {
      return [
        host.host,
        host.label,
        host.hostname,
        host.user,
        host.group,
        host.note,
        host.system,
        ...(Array.isArray(host.tags) ? host.tags : []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
    }

    function matchesText(host, needle) {
      return needle === '' || hostSearchText(host).includes(needle)
    }

    function credentialInfo(host, t) {
      if (host.passwordConfigured) return { key: 'password', label: t('credential.password'), tone: 'ok' }
      if (host.identityFile) return { key: 'key', label: t('credential.key'), tone: 'ok' }
      return { key: 'none', label: t('credential.none'), tone: 'muted' }
    }

    function formatBytes(value) {
      const size = Number(value)
      if (!Number.isFinite(size) || size < 0) return '—'
      if (size < 1024) return `${size} B`
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
      if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
    }

    function formatDateTime(value, localeId) {
      if (!value) return '—'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return '—'
      try {
        return new Intl.DateTimeFormat(localeId === 'zh' ? 'zh-CN' : 'en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(date)
      } catch {
        return date.toLocaleString()
      }
    }

    function remoteJoin(base, name) {
      const raw = String(base || '.').trim()
      const clean = raw.replace(/\/+$/, '')
      if (clean === '' && raw.startsWith('/')) return `/${name}`
      if (clean === '' || clean === '.') return `./${name}`
      return `${clean}/${name}`
    }

    function parentPath(base) {
      const clean = String(base || '.').replace(/\/+$/, '')
      if (clean === '' || clean === '.') return '.'
      const index = clean.lastIndexOf('/')
      if (index <= 0) return clean.startsWith('/') ? '/' : '.'
      return clean.slice(0, index) || '/'
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max)
    }

    function anchorFrom(event, width, height) {
      const rect = event.currentTarget.getBoundingClientRect()
      const viewportWidth = typeof window === 'undefined' ? 1280 : window.innerWidth
      const viewportHeight = typeof window === 'undefined' ? 800 : window.innerHeight
      const left = clamp(rect.right - width, 8, Math.max(8, viewportWidth - width - 8))
      const below = rect.bottom + 6
      const openUp = below + height > viewportHeight - 8
      return { top: openUp ? rect.top - 6 : below, left, openUp }
    }

    async function requestJson(url, init) {
      let response
      try {
        response = await fetch(url, init)
      } catch (error) {
        throw new Error(errorMessage(error))
      }
      let payload
      try {
        payload = await response.json()
      } catch {
        payload = undefined
      }
      if (!response.ok || !payload || payload.ok !== true) {
        throw new Error(payload?.error?.message ?? `HTTP ${response.status}`)
      }
      return payload.value
    }

    function fetchState() {
      return requestJson(STATE_ROUTE, { headers: { accept: 'application/json' } }).then((value) => value.state)
    }

    function callAction(action, params) {
      return requestJson(ACTION_ROUTE, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, ...(params ?? {}) }),
      })
    }

    async function copyText(text) {
      const value = String(text ?? '')
      if (value === '') return false
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          await navigator.clipboard.writeText(value)
          return true
        }
      } catch {
        return false
      }
      return false
    }

    function downloadBase64(name, base64) {
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
      const blob = new Blob([bytes], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = name || 'download'
      anchor.click()
      setTimeout(() => URL.revokeObjectURL(url), 1500)
    }

    function downloadTextFile(name, text, type = 'application/json') {
      const blob = new Blob([text], { type })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = name || 'dsh-ssh-manage-export.json'
      anchor.click()
      setTimeout(() => URL.revokeObjectURL(url), 1500)
    }

    function readFileBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = String(reader.result ?? '')
          resolve(result.slice(result.indexOf(',') + 1))
        }
        reader.onerror = () => reject(reader.error ?? new Error('Cannot read file'))
        reader.readAsDataURL(file)
      })
    }

    function blankHostDraft() {
      return {
        host: '',
        hostname: '',
        user: '',
        port: '',
        identityFile: '',
        proxyJump: '',
        forwardAgent: false,
        group: '',
        tags: '',
        label: '',
        note: '',
        favorite: false,
      }
    }

    function draftFromHost(host) {
      return {
        host: host.host ?? '',
        hostname: host.hostname ?? '',
        user: host.user ?? '',
        port: host.port ?? '',
        identityFile: host.identityFile ?? '',
        proxyJump: host.proxyJump ?? '',
        forwardAgent: host.forwardAgent === true,
        group: host.group ?? '',
        tags: Array.isArray(host.tags) ? host.tags.join(', ') : '',
        label: host.label ?? '',
        note: host.note ?? '',
        favorite: host.favorite === true,
      }
    }

    const ALIAS_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_.@-]{0,63}$/

    // ---------------------------------------------------------------------
    // Hooks
    // ---------------------------------------------------------------------

    function useT(ctx) {
      const [, force] = React.useReducer((value) => value + 1, 0)
      React.useEffect(() => ctx.locale.subscribe(() => force()), [ctx])
      return ctx.locale.bind(NS)
    }

    function useLocaleId(ctx) {
      const [, force] = React.useReducer((value) => value + 1, 0)
      React.useEffect(() => ctx.locale.subscribe(() => force()), [ctx])
      return ctx.locale.getSnapshot().active
    }

    // ---------------------------------------------------------------------
    // Icons (currentColor; artwork only)
    // ---------------------------------------------------------------------

    function Svg({ size = 16, children }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          'aria-hidden': true,
          focusable: 'false',
        },
        children,
      )
    }

    function P({ d, width = 1.6, fill }) {
      return h('path', {
        d,
        fill: fill ?? 'none',
        stroke: fill ? 'none' : 'currentColor',
        strokeWidth: fill ? undefined : width,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      })
    }

    function IconTerminal({ size = 16 }) {
      return h(
        Svg,
        { size },
        h('rect', { x: 3, y: 4.5, width: 18, height: 15, rx: 2.5, stroke: 'currentColor', strokeWidth: 1.6 }),
        h(P, { d: 'm7 9 3 2.6-3 2.6' }),
        h(P, { d: 'M13 15h4' }),
      )
    }

    function IconChevronDown({ size = 14 }) {
      return h(Svg, { size }, h(P, { d: 'm6 9 6 6 6-6' }))
    }

    function IconChevronRight({ size = 14 }) {
      return h(Svg, { size }, h(P, { d: 'm9 6 6 6-6 6' }))
    }

    function IconChevronLeft({ size = 14 }) {
      return h(Svg, { size }, h(P, { d: 'm14 6-6 6 6 6' }))
    }

    function IconRefresh({ size = 16 }) {
      return h(Svg, { size }, h(P, { d: 'M20 12a8 8 0 1 1-2.34-5.66' }), h(P, { d: 'M20 3.5V8h-4.5' }))
    }

    function IconSearch({ size = 15 }) {
      return h(
        Svg,
        { size },
        h('circle', { cx: 11, cy: 11, r: 6.5, stroke: 'currentColor', strokeWidth: 1.6 }),
        h(P, { d: 'm16 16 4 4' }),
      )
    }

    function IconPlus({ size = 16 }) {
      return h(Svg, { size }, h(P, { d: 'M12 5v14' }), h(P, { d: 'M5 12h14' }))
    }

    function IconFolder({ size = 15 }) {
      return h(
        Svg,
        { size },
        h(P, {
          d: 'M3.6 7.4A2 2 0 0 1 5.6 5.4h3.6l2 2h6.2a2 2 0 0 1 2 2v7.2a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2z',
        }),
      )
    }

    function IconStar({ size = 14, filled }) {
      return h(
        Svg,
        { size },
        h('path', {
          d: 'M12 4.6l2.25 4.56 5.03.73-3.64 3.55.86 5.01L12 16.08l-4.5 2.37.86-5.01-3.64-3.55 5.03-.73z',
          fill: filled ? 'currentColor' : 'none',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinejoin: 'round',
        }),
      )
    }

    function IconCheck({ size = 12 }) {
      return h(Svg, { size }, h(P, { d: 'm5 12.5 4.4 4.4L19 7' }))
    }

    function IconCheckCircle({ size = 14 }) {
      return h(
        Svg,
        { size },
        h('circle', { cx: 12, cy: 12, r: 8.5, stroke: 'currentColor', strokeWidth: 1.5 }),
        h(P, { d: 'm8.3 12.2 2.5 2.5 4.9-5.2' }),
      )
    }

    function IconAlert({ size = 14 }) {
      return h(
        Svg,
        { size },
        h('circle', { cx: 12, cy: 12, r: 8.5, stroke: 'currentColor', strokeWidth: 1.5 }),
        h(P, { d: 'M12 7.6v5.2' }),
        h('circle', { cx: 12, cy: 16.3, r: 0.9, fill: 'currentColor', stroke: 'none' }),
      )
    }

    function IconClose({ size = 15 }) {
      return h(Svg, { size }, h(P, { d: 'm6 6 12 12' }), h(P, { d: 'm18 6-12 12' }))
    }

    function IconCopy({ size = 14 }) {
      return h(
        Svg,
        { size },
        h('rect', { x: 9, y: 9, width: 11, height: 11, rx: 2, stroke: 'currentColor', strokeWidth: 1.5 }),
        h(P, { d: 'M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1' }),
      )
    }

    function IconEdit({ size = 14 }) {
      return h(Svg, { size }, h(P, { d: 'M4.5 19.5h4L19 9l-4-4L4.5 15.5z' }), h(P, { d: 'M13.4 5.6l4 4' }))
    }

    function IconMore({ size = 16 }) {
      return h(
        Svg,
        { size },
        h('circle', { cx: 12, cy: 5.5, r: 1.25, fill: 'currentColor', stroke: 'none' }),
        h('circle', { cx: 12, cy: 12, r: 1.25, fill: 'currentColor', stroke: 'none' }),
        h('circle', { cx: 12, cy: 18.5, r: 1.25, fill: 'currentColor', stroke: 'none' }),
      )
    }

    function IconUpload({ size = 15 }) {
      return h(Svg, { size }, h(P, { d: 'M12 16V4' }), h(P, { d: 'm7 9 5-5 5 5' }), h(P, { d: 'M5 19h14' }))
    }

    function IconDownload({ size = 15 }) {
      return h(Svg, { size }, h(P, { d: 'M12 4v12' }), h(P, { d: 'm7 11 5 5 5-5' }), h(P, { d: 'M5 20h14' }))
    }

    function IconFile({ size = 15 }) {
      return h(
        Svg,
        { size },
        h(P, { d: 'M7 3.6h7l4 4V20a.9.9 0 0 1-.9.9H7.9A.9.9 0 0 1 7 20z' }),
        h(P, { d: 'M14 3.6V8h4.4' }),
      )
    }

    function IconSliders({ size = 16 }) {
      return h(
        Svg,
        { size },
        h(P, { d: 'M4 7h9' }),
        h('circle', { cx: 16, cy: 7, r: 2, stroke: 'currentColor', strokeWidth: 1.6 }),
        h(P, { d: 'M20 7h.5' }),
        h(P, { d: 'M4 12h2' }),
        h('circle', { cx: 9, cy: 12, r: 2, stroke: 'currentColor', strokeWidth: 1.6 }),
        h(P, { d: 'M13 12h7' }),
        h(P, { d: 'M4 17h10' }),
        h('circle', { cx: 17, cy: 17, r: 2, stroke: 'currentColor', strokeWidth: 1.6 }),
        h(P, { d: 'M20 17h.5' }),
      )
    }

    function IconPanelLeft({ size = 16 }) {
      return h(
        Svg,
        { size },
        h('rect', { x: 3.5, y: 4.5, width: 17, height: 15, rx: 2.4, stroke: 'currentColor', strokeWidth: 1.6 }),
        h(P, { d: 'M9.5 4.5v15' }),
      )
    }

    function IconPlay({ size = 14 }) {
      return h(Svg, { size }, h(P, { d: 'M8 5.2 18.5 12 8 18.8z', fill: 'currentColor' }))
    }

    function IconKey({ size = 14 }) {
      return h(
        Svg,
        { size },
        h('circle', { cx: 8, cy: 15.5, r: 3.6, stroke: 'currentColor', strokeWidth: 1.5 }),
        h(P, { d: 'm10.7 13 7.3-7.3' }),
        h(P, { d: 'm15.6 5.4 3 3' }),
        h(P, { d: 'm13 8 2.4 2.4' }),
      )
    }

    function IconTrash({ size = 14 }) {
      return h(
        Svg,
        { size },
        h(P, { d: 'M4.5 6.5h15' }),
        h(P, { d: 'M9.5 6.5V4.9c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.6' }),
        h(P, { d: 'M6.5 6.5 7.3 19c.05.9.8 1.5 1.7 1.5h6c.9 0 1.65-.6 1.7-1.5l.8-12.5' }),
      )
    }

    function IconUser({ size = 14 }) {
      return h(
        Svg,
        { size },
        h('circle', { cx: 12, cy: 8, r: 3.4, stroke: 'currentColor', strokeWidth: 1.5 }),
        h(P, { d: 'M5.2 20c0-3.5 3-6 6.8-6s6.8 2.5 6.8 6' }),
      )
    }

    function IconServer({ size = 15 }) {
      return h(
        Svg,
        { size },
        h('rect', { x: 3.5, y: 4.6, width: 17, height: 5.4, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.5 }),
        h('rect', { x: 3.5, y: 14, width: 17, height: 5.4, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.5 }),
        h('circle', { cx: 7, cy: 7.3, r: 0.85, fill: 'currentColor', stroke: 'none' }),
        h('circle', { cx: 7, cy: 16.7, r: 0.85, fill: 'currentColor', stroke: 'none' }),
        h(P, { d: 'M11 7.3h6' }),
        h(P, { d: 'M11 16.7h6' }),
      )
    }

    function IconFilter({ size = 15 }) {
      return h(Svg, { size }, h(P, { d: 'M4 5.2h16l-6.3 7.3v6.3l-3.4-1.7v-4.6z' }))
    }

    function IconLock({ size = 14 }) {
      return h(
        Svg,
        { size },
        h('rect', { x: 5, y: 10.2, width: 14, height: 9.6, rx: 2, stroke: 'currentColor', strokeWidth: 1.5 }),
        h(P, { d: 'M8.2 10.2V7.4a3.8 3.8 0 0 1 7.6 0v2.8' }),
        h('circle', { cx: 12, cy: 15, r: 1.1, fill: 'currentColor', stroke: 'none' }),
      )
    }

    function IconEye({ size = 14 }) {
      return h(
        Svg,
        { size },
        h(P, { d: 'M2.5 12s3.6-6.2 9.5-6.2S21.5 12 21.5 12s-3.6 6.2-9.5 6.2S2.5 12 2.5 12Z' }),
        h('circle', { cx: 12, cy: 12, r: 3, stroke: 'currentColor', strokeWidth: 1.5 }),
      )
    }

    function IconEyeOff({ size = 14 }) {
      return h(
        Svg,
        { size },
        h(P, { d: 'M3 3l18 18' }),
        h(P, { d: 'M10.6 6.1A10.7 10.7 0 0 1 12 6c5.9 0 9.5 6 9.5 6a17 17 0 0 1-3.1 3.6M6.4 6.8C3.9 8.7 2.5 12 2.5 12s3.6 6 9.5 6a10.9 10.9 0 0 0 4.5-1' }),
        h(P, { d: 'M9.9 9.9a3 3 0 0 0 4.2 4.2' }),
      )
    }

    function IconEraser({ size = 15 }) {
      return h(
        Svg,
        { size },
        h(P, { d: 'M4 20h16' }),
        h(P, { d: 'M7.5 16.5 15 9a2.12 2.12 0 0 1 3 3l-7.5 7.5H7.5z' }),
        h(P, { d: 'M11.2 9.8l3 3' }),
      )
    }

    function IconArrowUp({ size = 15 }) {
      return h(Svg, { size }, h(P, { d: 'M12 19V5' }), h(P, { d: 'm6 11 6-6 6 6' }))
    }

    function IconSort({ size = 11, dir }) {
      return h(Svg, { size }, h(P, { d: dir === 'desc' ? 'm7 10 5 5 5-5' : 'm7 14 5-5 5 5' }))
    }

    // ---------------------------------------------------------------------
    // Primitives
    // ---------------------------------------------------------------------

    function Spinner({ size = 14 }) {
      return h('span', { className: 'ssh-spinner', style: { width: size, height: size } })
    }

    function Button({ children, variant, size, onClick, disabled, title, type = 'button', className, ariaPressed, autoFocus }) {
      return h(
        'button',
        {
          type,
          className: cx('ssh-btn', variant, size, className),
          onClick,
          disabled,
          title,
          'aria-pressed': ariaPressed,
          autoFocus,
        },
        children,
      )
    }

    function IconButton({ title, onClick, children, tone, disabled, active, className, ariaPressed }) {
      return h(
        'button',
        {
          type: 'button',
          className: cx('ssh-iconBtn', tone, active && 'active', className),
          title,
          'aria-label': title,
          'aria-pressed': ariaPressed,
          disabled,
          onClick,
        },
        children,
      )
    }

    function Field({ label, hint, children, wide }) {
      return h(
        'label',
        { className: cx('ssh-field', wide && 'wide') },
        label ? h('span', { className: 'ssh-label' }, label) : null,
        children,
        hint ? h('span', { className: 'ssh-hint' }, hint) : null,
      )
    }

    function TextInput({ value, onChange, placeholder, type = 'text', mono, disabled, autoFocus, onKeyDown, spellCheck }) {
      return h('input', {
        className: cx('ssh-input', mono && 'mono'),
        type,
        value: value ?? '',
        placeholder,
        disabled,
        autoFocus,
        spellCheck: spellCheck === true,
        onKeyDown,
        onChange: (event) => onChange(event.target.value),
      })
    }

    function TextArea({ value, onChange, placeholder, rows, mono, spellCheck, readOnly }) {
      return h('textarea', {
        className: cx('ssh-textarea', mono && 'mono'),
        value: value ?? '',
        placeholder,
        rows: rows ?? 4,
        spellCheck: spellCheck === true,
        readOnly: readOnly === true,
        onChange: (event) => onChange(event.target.value),
      })
    }

    function Switch({ checked, onChange, label }) {
      return h(
        'span',
        { className: 'ssh-switchWrap' },
        h(
          'button',
          {
            type: 'button',
            role: 'switch',
            'aria-checked': checked === true,
            className: 'ssh-switch',
            onClick: (event) => {
              event.stopPropagation()
              onChange(!checked)
            },
          },
          h('span', { className: 'ssh-switchKnob' }),
        ),
        label ? h('span', { className: 'ssh-switchLabel' }, label) : null,
      )
    }

    function Checkbox({ checked, indeterminate, onChange, label, onSurface }) {
      const mixed = checked !== true && indeterminate === true
      return h(
        'button',
        {
          type: 'button',
          role: 'checkbox',
          'aria-checked': mixed ? 'mixed' : checked === true,
          'aria-label': label,
          className: cx('ssh-check', (checked === true || mixed) && 'on'),
          onClick: (event) => {
            if (!onSurface) event.stopPropagation()
            onChange(checked !== true)
          },
        },
        checked === true ? h(IconCheck, { size: 11 }) : mixed ? h('span', { className: 'ssh-checkDash' }) : null,
      )
    }

    function Badge({ children, tone, title }) {
      return h('span', { className: cx('ssh-badge', tone), title }, children)
    }

    function Chip({ children, title }) {
      return h('span', { className: 'ssh-chip', title }, children)
    }

    function Empty({ icon, title, body, actions, compact }) {
      return h(
        'div',
        { className: cx('ssh-empty', compact && 'compact') },
        h('span', { className: 'ssh-emptyIcon' }, icon ?? h(IconTerminal, { size: 24 })),
        title ? h('span', { className: 'ssh-emptyTitle' }, title) : null,
        body ? h('span', { className: 'ssh-emptyBody' }, body) : null,
        actions ? h('div', { className: 'ssh-emptyActions' }, actions) : null,
      )
    }

    function Toast({ state }) {
      if (!state) return null
      return h(
        'div',
        { className: cx('ssh-toast', state.tone), role: 'status', 'aria-live': 'polite' },
        h('span', { className: 'ssh-toastDot' }),
        h('span', null, state.message),
      )
    }

    function trapTab(event) {
      if (event.key !== 'Tab') return
      const root = event.currentTarget
      const items = Array.from(
        root.querySelectorAll(
          'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',
        ),
      )
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    function Modal({ title, subtitle, icon, onClose, children, footer, width, closeLabel }) {
      const ref = React.useRef(null)
      React.useEffect(() => {
        const node = ref.current
        if (!node) return undefined
        const previous = document.activeElement
        const field = node.querySelector('input:not([type="hidden"]),textarea,select')
        if (field) field.focus()
        else node.focus()
        return () => {
          if (previous && typeof previous.focus === 'function') previous.focus()
        }
      }, [])
      return h(
        'div',
        {
          className: 'ssh-modalMask',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) onClose()
          },
        },
        h(
          'div',
          {
            ref,
            className: 'ssh-modal',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-label': title,
            tabIndex: -1,
            style: { maxWidth: width ?? 560 },
            onKeyDown: trapTab,
          },
          h(
            'div',
            { className: 'ssh-modalHead' },
            icon ? h('span', { className: 'ssh-modalIcon' }, icon) : null,
            h(
              'div',
              { className: 'ssh-modalTitles' },
              h('div', { className: 'ssh-modalTitle' }, title),
              subtitle ? h('div', { className: 'ssh-modalSubtitle' }, subtitle) : null,
            ),
            h(IconButton, { title: closeLabel ?? 'Close', onClick: onClose }, h(IconClose)),
          ),
          h('div', { className: 'ssh-modalBody' }, children),
          footer ? h('div', { className: 'ssh-modalFoot' }, footer) : null,
        ),
      )
    }

    function ConfirmDialog({ t, state, onCancel }) {
      const [busy, setBusy] = React.useState(false)
      async function confirm() {
        if (busy) return
        setBusy(true)
        try {
          await state.onConfirm()
        } finally {
          setBusy(false)
          onCancel()
        }
      }
      return h(
        Modal,
        {
          title: state.title,
          subtitle: state.hint,
          width: 430,
          icon: h(IconAlert),
          closeLabel: t('common.close'),
          onClose: busy ? () => {} : onCancel,
          footer: [
            h(Button, { key: 'cancel', onClick: onCancel, disabled: busy }, t('common.cancel')),
            h(
              Button,
              {
                key: 'ok',
                variant: state.danger === false ? 'primary' : 'dangerSolid',
                onClick: () => void confirm(),
                disabled: busy,
              },
              state.confirmLabel ?? t('common.delete'),
            ),
          ],
        },
        h('div', { className: 'ssh-confirmBody' }, state.body),
      )
    }

    // ---------------------------------------------------------------------
    // Derived helpers
    // ---------------------------------------------------------------------

    function buildGroups(hosts, t) {
      const map = new Map()
      for (const host of hosts) {
        const key = hostGroupKey(host)
        if (!map.has(key)) map.set(key, [])
        map.get(key).push(host)
      }
      const groups = [...map.entries()].map(([key, list]) => ({
        key,
        label: key === '' ? t('tree.ungrouped') : key,
        hosts: list,
      }))
      groups.sort((a, b) => {
        if (a.key === '') return 1
        if (b.key === '') return -1
        return a.key.localeCompare(b.key, undefined, { numeric: true, sensitivity: 'base' })
      })
      return groups
    }

    function sortHosts(list, sort) {
      const factor = sort.dir === 'desc' ? -1 : 1
      const copy = [...list]
      copy.sort((a, b) => {
        if (sort.key === 'latency') {
          const av = Number(a.latencyMs) || 0
          const bv = Number(b.latencyMs) || 0
          if (!av && !bv) return a.host.localeCompare(b.host)
          if (!av) return 1
          if (!bv) return -1
          const diff = (av - bv) * factor
          return diff === 0 ? a.host.localeCompare(b.host) : diff
        }
        let result = 0
        if (sort.key === 'system') result = String(a.system ?? '').localeCompare(String(b.system ?? ''))
        else if (sort.key === 'address') result = hostTarget(a).localeCompare(hostTarget(b))
        else if (sort.key === 'notes') result = String(a.note ?? '').localeCompare(String(b.note ?? ''))
        else result = hostName(a).localeCompare(hostName(b), undefined, { numeric: true, sensitivity: 'base' })
        if (result === 0) result = a.host.localeCompare(b.host)
        return result * factor
      })
      return copy
    }

    function infoChips(host, t) {
      const chips = []
      if (host.system) chips.push(shortSystem(host.system))
      if (host.cpuCores) chips.push(t('units.cores', { n: host.cpuCores }))
      if (host.memoryGB) chips.push(t('units.memory', { n: host.memoryGB }))
      if (host.diskGB) chips.push(t('units.disk', { n: host.diskGB }))
      if (chips.length === 0 && Array.isArray(host.tags)) chips.push(...host.tags.slice(0, 4))
      return chips.slice(0, 4)
    }

    function tableTracks(prefs) {
      const tracks = ['32px', '96px', '80px', 'minmax(90px,1fr)', 'minmax(150px,1.25fr)']
      if (prefs.info) tracks.push('minmax(210px,1.4fr)')
      if (prefs.notes) tracks.push('minmax(120px,0.8fr)')
      tracks.push('150px', '28px')
      return tracks.join(' ')
    }

    function MenuItem({ children, icon, onClick, danger, disabled }) {
      return h(
        'button',
        {
          type: 'button',
          className: cx('ssh-menuItem', danger && 'danger'),
          onClick,
          disabled,
          role: 'menuitem',
        },
        icon ? h('span', { className: 'ssh-menuIcon' }, icon) : null,
        h('span', { className: 'ssh-menuText' }, children),
      )
    }

    // ---------------------------------------------------------------------
    // App
    // ---------------------------------------------------------------------

    // Survives the plugin panel unmounting when the user switches to another
    // DSH session (and a client-module reload). Host-side PTYs stay alive;
    // mounting again attaches to them and replays recent output.
    const PANEL_STATE_KEY = 'dsh-ssh-manage:panel-state'
    const TREE_WIDTH_KEY = 'dsh-ssh-manage:tree-width'

    function readPanelState() {
      try {
        const parsed = JSON.parse(String(window.sessionStorage.getItem(PANEL_STATE_KEY) ?? 'null'))
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.sessions)) {
          return { sessions: [], activeSessionId: null, tab: 'hosts' }
        }
        const sessions = parsed.sessions
          .filter((session) => session && typeof session.id === 'string' && typeof session.hostAlias === 'string')
          .map((session) => ({ id: session.id, hostAlias: session.hostAlias }))
        const tab = ['hosts', 'sessions', 'batch', 'settings'].includes(parsed.tab) ? parsed.tab : 'hosts'
        const activeSessionId = typeof parsed.activeSessionId === 'string' ? parsed.activeSessionId : null
        return { sessions, activeSessionId, tab }
      } catch {
        return { sessions: [], activeSessionId: null, tab: 'hosts' }
      }
    }

    const persistentPanelState = readPanelState()
    const TREE_MIN_WIDTH = 220
    const TREE_MAX_WIDTH = 560

    function clampTreeWidth(value) {
      const numeric = Number(value)
      if (!Number.isFinite(numeric)) return 300
      return Math.min(TREE_MAX_WIDTH, Math.max(TREE_MIN_WIDTH, Math.round(numeric)))
    }

    function readTreeWidth() {
      try {
        const stored = window.localStorage.getItem(TREE_WIDTH_KEY)
        return stored === null ? 300 : clampTreeWidth(stored)
      } catch {
        return 300
      }
    }

    const TERMINAL_FONT_KEY = 'dsh-ssh-manage:terminal-font-size'
    const TERMINAL_FONT_MIN = 10
    const TERMINAL_FONT_MAX = 20

    function clampTerminalFontSize(value) {
      const numeric = Number(value)
      if (!Number.isFinite(numeric)) return 13
      return Math.min(TERMINAL_FONT_MAX, Math.max(TERMINAL_FONT_MIN, Math.round(numeric)))
    }

    function readTerminalFontSize() {
      try {
        const stored = window.localStorage.getItem(TERMINAL_FONT_KEY)
        return stored === null ? 13 : clampTerminalFontSize(stored)
      } catch {
        return 13
      }
    }

    function App({ ctx }) {
      const t = useT(ctx)
      const localeId = useLocaleId(ctx)
      const [snapshot, setSnapshot] = React.useState(null)
      const [loading, setLoading] = React.useState(true)
      const [refreshing, setRefreshing] = React.useState(false)
      const [error, setError] = React.useState('')
      const [tab, setTab] = React.useState(() => {
        const saved = persistentPanelState.tab
        if (saved === 'sessions' && persistentPanelState.sessions.length === 0) return 'hosts'
        return ['hosts', 'sessions', 'batch', 'settings'].includes(saved) ? saved : 'hosts'
      })
      const [filter, setFilter] = React.useState('')
      const [favoriteOnly, setFavoriteOnly] = React.useState(false)
      const [groupFilter, setGroupFilter] = React.useState(null)
      const [collapsedGroups, setCollapsedGroups] = React.useState({})
      const [sidebarOpen, setSidebarOpen] = React.useState(() =>
        typeof window === 'undefined' ? true : window.innerWidth > 900,
      )
      const [selected, setSelected] = React.useState([])
      const [activeAlias, setActiveAlias] = React.useState(null)
      const [drawer, setDrawer] = React.useState(null)
      const [editor, setEditor] = React.useState(null)
      const [groupsOpen, setGroupsOpen] = React.useState(false)
      const [confirmState, setConfirmState] = React.useState(null)
      const [floating, setFloating] = React.useState(null)
      const [toastState, setToastState] = React.useState(null)
      const [pending, setPending] = React.useState({})
      const [sort, setSort] = React.useState({ key: 'name', dir: 'asc' })
      const [columns, setColumns] = React.useState({ info: false, notes: true, compact: false })
      const [sessions, setSessions] = React.useState(() =>
        persistentPanelState.sessions.map((session) => ({ id: session.id, hostAlias: session.hostAlias })),
      )
      const [activeSessionId, setActiveSessionId] = React.useState(() => persistentPanelState.activeSessionId)
      const [treeWidth, setTreeWidth] = React.useState(readTreeWidth)
      const [terminalFontSize, setTerminalFontSize] = React.useState(readTerminalFontSize)
      const [clearSignals, setClearSignals] = React.useState({})
      const [sessionStates, setSessionStates] = React.useState({})
      const toastTimer = React.useRef(null)
      const floatingRef = React.useRef(null)
      const editorCloseGuard = React.useRef(null)
      const groupsCloseGuard = React.useRef(null)

      const setSessionState = React.useCallback((id, status) => {
        setSessionStates((prev) => (prev[id] === status ? prev : { ...prev, [id]: status }))
      }, [])

      const notify = React.useCallback((message, tone = 'info') => {
        if (toastTimer.current) clearTimeout(toastTimer.current)
        setToastState({ message, tone })
        toastTimer.current = setTimeout(() => setToastState(null), 4200)
      }, [])

      React.useEffect(
        () => () => {
          if (toastTimer.current) clearTimeout(toastTimer.current)
        },
        [],
      )

      React.useEffect(() => {
        persistentPanelState.sessions = sessions.map((session) => ({ id: session.id, hostAlias: session.hostAlias }))
        persistentPanelState.activeSessionId = activeSessionId
        persistentPanelState.tab = tab
        try {
          window.sessionStorage.setItem(PANEL_STATE_KEY, JSON.stringify(persistentPanelState))
        } catch {}
      }, [sessions, activeSessionId, tab])

      React.useEffect(() => {
        try {
          window.localStorage.setItem(TREE_WIDTH_KEY, String(treeWidth))
        } catch {}
      }, [treeWidth])

      React.useEffect(() => {
        try {
          window.localStorage.setItem(TERMINAL_FONT_KEY, String(terminalFontSize))
        } catch {}
      }, [terminalFontSize])

      React.useEffect(() => {
        for (const session of sessions) ptyActiveIds.add(session.id)
      }, [sessions])

      const applySnapshot = React.useCallback((next) => {
        if (!next) return
        const aliases = new Set((next.hosts ?? []).map((host) => host.host))
        setSnapshot(next)
        setSelected((prev) => prev.filter((alias) => aliases.has(alias)))
        setActiveAlias((prev) => (prev && aliases.has(prev) ? prev : null))
        setDrawer((prev) => (prev && aliases.has(prev.alias) ? prev : null))
        setEditor((prev) => (prev && prev.original && !aliases.has(prev.original) ? null : prev))
        setFloating((prev) => (prev && prev.host && !aliases.has(prev.host) ? null : prev))
      }, [])

      const load = React.useCallback(
        async (options = {}) => {
          const quiet = options.quiet === true
          if (quiet) setRefreshing(true)
          else setLoading(true)
          setError('')
          try {
            const next = await fetchState()
            applySnapshot(next)
          } catch (failure) {
            setError(errorMessage(failure))
          } finally {
            setLoading(false)
            setRefreshing(false)
          }
        },
        [applySnapshot],
      )

      React.useEffect(() => {
        void load()
      }, [load])

      const withPending = React.useCallback(
        async (key, work) => {
          setPending((prev) => ({ ...prev, [key]: true }))
          try {
            return await work()
          } catch (failure) {
            notify(t('state.error', { message: errorMessage(failure) }), 'error')
            return undefined
          } finally {
            setPending((prev) => {
              const next = { ...prev }
              delete next[key]
              return next
            })
          }
        },
        [notify, t],
      )

      const hosts = React.useMemo(() => {
        const seen = new Set()
        const rows = []
        for (const host of snapshot?.hosts ?? []) {
          if (!host || typeof host.host !== 'string' || seen.has(host.host)) continue
          seen.add(host.host)
          rows.push(host)
        }
        return rows
      }, [snapshot])
      const needle = filter.trim().toLowerCase()
      const filtered = hosts.filter((host) => matchesText(host, needle) && (!favoriteOnly || host.favorite === true))
      const groups = buildGroups(filtered, t)
      const visibleBase = groupFilter === null ? filtered : filtered.filter((host) => hostGroupKey(host) === groupFilter)
      const visible = sortHosts(visibleBase, sort)
      const activeHost = activeAlias ? hosts.find((host) => host.host === activeAlias) ?? null : null
      const drawerHost = drawer ? hosts.find((host) => host.host === drawer.alias) ?? null : null
      const selectedHosts = hosts.filter((host) => selected.includes(host.host))
      const effectiveTab = tab === 'sessions' && sessions.length === 0 ? 'hosts' : tab

      // Close sessions whose host disappeared from the config.
      React.useEffect(() => {
        if (!snapshot) return
        const aliases = new Set(hosts.map((host) => host.host))
        setSessions((prev) => {
          const removed = prev.filter((session) => !aliases.has(session.hostAlias))
          const next = prev.filter((session) => aliases.has(session.hostAlias))
          if (removed.length === 0) return prev
          for (const session of removed) closePtySession(session.id)
          return next
        })
      }, [hosts, snapshot])

      // Drop clear-signal bookkeeping for sessions that no longer exist.
      React.useEffect(() => {
        const ids = new Set(sessions.map((session) => session.id))
        setClearSignals((prev) => {
          const keys = Object.keys(prev)
          if (keys.every((key) => ids.has(key))) return prev
          const next = {}
          for (const key of keys) if (ids.has(key)) next[key] = prev[key]
          return next
        })
        setSessionStates((prev) => {
          const keys = Object.keys(prev)
          if (keys.every((key) => ids.has(key))) return prev
          const next = {}
          for (const key of keys) if (ids.has(key)) next[key] = prev[key]
          return next
        })
      }, [sessions])

      // Keep one valid active session, and leave the sessions tab when it becomes empty.
      React.useEffect(() => {
        if (sessions.length === 0) {
          if (tab === 'sessions') setTab('hosts')
          if (activeSessionId !== null) setActiveSessionId(null)
          return
        }
        if (!activeSessionId || !sessions.some((session) => session.id === activeSessionId)) {
          setActiveSessionId(sessions[sessions.length - 1].id)
        }
      }, [sessions, activeSessionId, tab])

      function isPending(key) {
        return pending[key] === true
      }

      function toggleGroup(key) {
        setCollapsedGroups((prev) => ({ ...prev, [key]: !prev[key] }))
      }

      function resetFilters() {
        setFilter('')
        setFavoriteOnly(false)
        setGroupFilter(null)
      }

      function toggleSelected(alias) {
        setSelected((prev) => (prev.includes(alias) ? prev.filter((entry) => entry !== alias) : [...prev, alias]))
      }

      function toggleAllVisible() {
        const aliases = visible.map((host) => host.host)
        const every = aliases.length > 0 && aliases.every((alias) => selected.includes(alias))
        setSelected((prev) => {
          if (every) return prev.filter((alias) => !aliases.includes(alias))
          const next = new Set(prev)
          for (const alias of aliases) next.add(alias)
          return [...next]
        })
      }

      function openEditor(host) {
        setFloating(null)
        setEditor({
          original: host ? host.host : null,
          draft: host ? draftFromHost(host) : blankHostDraft(),
        })
      }

      function openDrawer(host, initialTab) {
        setFloating(null)
        setActiveAlias(host.host)
        const requested = initialTab === 'terminal' ? 'details' : initialTab
        setDrawer({ alias: host.host, tab: requested ?? 'details' })
      }

      function openSession(host) {
        setFloating(null)
        setDrawer(null)
        setActiveAlias(host.host)
        const existing = sessions.find((session) => session.hostAlias === host.host)
        if (existing) {
          setActiveSessionId(existing.id)
        } else {
          if (sessions.length >= MAX_TERMINAL_SESSIONS) {
            notify(t('session.tooMany'), 'error')
            return
          }
          const id = newPtySessionId()
          ptyActiveIds.add(id)
          setSessions((prev) => [...prev, { id, hostAlias: host.host }])
          setActiveSessionId(id)
        }
        setTab('sessions')
      }

      function closeSession(id) {
        const index = sessions.findIndex((session) => session.id === id)
        if (index < 0) return
        closePtySession(id)
        const next = sessions.filter((session) => session.id !== id)
        setSessions(next)
        setClearSignals((prev) => {
          if (!(id in prev)) return prev
          const copy = { ...prev }
          delete copy[id]
          return copy
        })
        if (activeSessionId !== id) return
        const candidate = next[Math.min(index, next.length - 1)] ?? null
        setActiveSessionId(candidate ? candidate.id : null)
        if (!candidate) setTab('hosts')
      }

      function clearSession(id) {
        clearPtySession(id)
        setClearSignals((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
      }

      function openFloating(event, kind, extra, width, height) {
        const anchor = anchorFrom(event, width, height)
        setFloating({ kind, ...extra, width, ...anchor })
      }

      function openRowMenu(event, host) {
        event.stopPropagation()
        setActiveAlias(host.host)
        openFloating(event, 'hostMenu', { host: host.host }, 208, 300)
      }

      function openColumns(event) {
        openFloating(event, 'columns', {}, 252, 230)
      }

      function openLocalConfig(event) {
        openFloating(event, 'config', {}, 320, 210)
      }

      function openBackups(event) {
        openFloating(event, 'backups', {}, 320, 190)
      }

      async function copyValue(value) {
        const ok = await copyText(value)
        notify(ok ? t('state.copied') : t('state.copyFailed'), ok ? 'success' : 'error')
      }

      async function testHost(host) {
        const value = await withPending(`test:${host.host}`, () => callAction('ssh/test', { host: host.host }))
        if (!value) return
        if (value.state) applySnapshot(value.state)
        notify(t('state.tested', { ms: value.latencyMs ?? 0 }), 'success')
      }

      async function checkAllHosts() {
        const value = await withPending('health:all', () => callAction('health/check-all', {}))
        if (!value) return
        if (value.state) applySnapshot(value.state)
        notify(t('state.healthChecked', { online: value.online ?? 0, offline: value.offline ?? 0 }), value.offline ? 'error' : 'success')
      }

      async function inspectHost(host) {
        const value = await withPending(`inspect:${host.host}`, () => callAction('ssh/inspect', { host: host.host }))
        if (!value) return
        if (value.state) applySnapshot(value.state)
        notify(t('state.inspected'), 'success')
      }

      async function toggleFavorite(host, next) {
        const wanted = next === undefined ? host.favorite !== true : next
        const value = await withPending(`meta:${host.host}`, () =>
          callAction('host/metadata', { host: host.host, metadata: { favorite: wanted } }),
        )
        if (!value) return
        if (value.state) applySnapshot(value.state)
        notify(wanted ? t('state.favorited') : t('state.unfavorited'), 'success')
      }

      async function savePassword(host, password) {
        if (!password) return false
        const value = await withPending(`pwd:${host.host}`, async () => {
          await callAction('credential/save', { host: host.host, password })
          return await fetchState()
        })
        if (!value) return false
        applySnapshot(value)
        notify(t('state.passwordSaved'), 'success')
        return true
      }

      async function removePassword(host) {
        const value = await withPending(`pwd:${host.host}`, async () => {
          await callAction('credential/delete', { host: host.host })
          return await fetchState()
        })
        if (!value) return false
        applySnapshot(value)
        notify(t('state.passwordRemoved'), 'success')
        return true
      }

      async function saveEditor(payload) {
        const value = await withPending('editor', async () => {
          const saved = await callAction('host/save', {
            host: payload.host,
            originalHost: payload.original || undefined,
          })
          const alias = saved.host.host
          await callAction('host/metadata', { host: alias, metadata: payload.metadata })
          if (payload.password) await callAction('credential/save', { host: alias, password: payload.password })
          return await fetchState()
        })
        if (!value) return false
        applySnapshot(value)
        if (payload.original && payload.original !== payload.host.host) {
          setSessions((prev) =>
            prev.map((session) =>
              session.hostAlias === payload.original ? { ...session, hostAlias: payload.host.host } : session,
            ),
          )
        }
        setEditor(null)
        setActiveAlias(payload.host.host)
        notify(t('state.saved'), 'success')
        return true
      }

      async function favoriteSelected() {
        const targets = selectedHosts.filter((host) => host.favorite !== true)
        if (targets.length === 0) return
        const value = await withPending('batchFavorite', async () => {
          for (const host of targets) await callAction('host/metadata', { host: host.host, metadata: { favorite: true } })
          return await fetchState()
        })
        if (!value) return
        applySnapshot(value)
        notify(t('state.favorited'), 'success')
      }

      function requestDelete(host) {
        setFloating(null)
        setConfirmState({
          title: t('confirm.deleteTitle'),
          body: t('confirm.deleteBody', { name: hostName(host) }),
          hint: t('confirm.deleteHint'),
          confirmLabel: t('common.delete'),
          onConfirm: async () => {
            const value = await withPending(`delete:${host.host}`, async () => {
              const result = await callAction('host/delete', { host: host.host })
              return result.state
            })
            if (!value) return
            applySnapshot(value)
            notify(t('state.deleted'), 'success')
          },
        })
      }

      function requestDeleteGroup(name) {
        setGroupsOpen(false)
        setConfirmState({
          title: t('confirm.deleteGroupTitle'),
          body: t('confirm.deleteGroupBody', { name }),
          confirmLabel: t('common.delete'),
          danger: false,
          onConfirm: async () => {
            const targets = hosts.filter((host) => hostGroupKey(host) === name)
            const value = await withPending('groups', async () => {
              for (const host of targets) await callAction('host/metadata', { host: host.host, metadata: { group: '' } })
              return await fetchState()
            })
            if (!value) return
            applySnapshot(value)
            if (groupFilter === name) setGroupFilter(null)
            notify(t('state.groupsSaved'), 'success')
          },
        })
      }

      async function renameGroup(name, nextName) {
        const targets = hosts.filter((host) => hostGroupKey(host) === name)
        const value = await withPending('groups', async () => {
          for (const host of targets) await callAction('host/metadata', { host: host.host, metadata: { group: nextName } })
          return await fetchState()
        })
        if (!value) return false
        applySnapshot(value)
        if (groupFilter === name) setGroupFilter(nextName)
        notify(t('state.groupsSaved'), 'success')
        return true
      }

      // Escape closes the top-most surface, one layer at a time.
      React.useEffect(() => {
        function onKey(event) {
          if (event.key !== 'Escape') return
          if (floating) {
            setFloating(null)
            return
          }
          if (confirmState) {
            setConfirmState(null)
            return
          }
          if (editor) {
            const guard = editorCloseGuard.current
            if (typeof guard === 'function') guard()
            else setEditor(null)
            return
          }
          if (groupsOpen) {
            const guard = groupsCloseGuard.current
            if (typeof guard === 'function') guard()
            else setGroupsOpen(false)
            return
          }
          if (drawer) setDrawer(null)
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
      }, [floating, confirmState, editor, groupsOpen, drawer])

      // Dismiss floating panels on outside press, scroll or resize.
      React.useEffect(() => {
        if (!floating) return undefined
        function onDown(event) {
          if (floatingRef.current && !floatingRef.current.contains(event.target)) setFloating(null)
        }
        function onViewportChange() {
          setFloating(null)
        }
        document.addEventListener('mousedown', onDown)
        window.addEventListener('scroll', onViewportChange, true)
        window.addEventListener('resize', onViewportChange)
        return () => {
          document.removeEventListener('mousedown', onDown)
          window.removeEventListener('scroll', onViewportChange, true)
          window.removeEventListener('resize', onViewportChange)
        }
      }, [floating])

      const model = {
        t,
        localeId,
        snapshot,
        hosts,
        groups,
        allGroups: buildGroups(hosts, t),
        visible,
        filtered,
        visibleBase,
        loading,
        refreshing,
        error,
        load,
        notify,
        withPending,
        isPending,
        pending,
        tab,
        setTab,
        filter,
        setFilter,
        favoriteOnly,
        setFavoriteOnly,
        resetFilters,
        groupFilter,
        setGroupFilter,
        collapsedGroups,
        toggleGroup,
        sidebarOpen,
        setSidebarOpen,
        selected,
        setSelected,
        selectedHosts,
        toggleSelected,
        toggleAllVisible,
        activeAlias,
        setActiveAlias,
        sort,
        setSort,
        columns,
        setColumns,
        openEditor,
        openDrawer,
        openRowMenu,
        openColumns,
        openLocalConfig,
        openBackups,
        copyValue,
        testHost,
        checkAllHosts,
        inspectHost,
        toggleFavorite,
        savePassword,
        removePassword,
        saveEditor,
        requestDelete,
        requestDeleteGroup,
        renameGroup,
        favoriteSelected,
        setGroupsOpen,
        setConfirmState,
        setFloating,
        setEditor,
        setDrawer,
        editorCloseGuard,
        groupsCloseGuard,
        treeWidth,
        setTreeWidth,
        terminalFontSize,
        setTerminalFontSize,
        sessions,
        activeSessionId,
        sessionStates,
        setSessionState,
        setActiveSessionId,
        clearSignals,
        openSession,
        closeSession,
        clearSession,
      }

      function renderFloating() {
        if (!floating) return null
        if (floating.kind === 'columns') {
          return h(
            'div',
            { className: 'ssh-popover' },
            h('div', { className: 'ssh-popTitle' }, t('columns.title')),
            h(
              'div',
              { className: 'ssh-popRow' },
              h(Switch, {
                checked: columns.info,
                onChange: (value) => setColumns((prev) => ({ ...prev, info: value })),
                label: t('columns.info'),
              }),
            ),
            h(
              'div',
              { className: 'ssh-popRow' },
              h(Switch, {
                checked: columns.notes,
                onChange: (value) => setColumns((prev) => ({ ...prev, notes: value })),
                label: t('columns.notes'),
              }),
            ),
            h(
              'div',
              { className: 'ssh-popRow' },
              h(Switch, {
                checked: columns.compact,
                onChange: (value) => setColumns((prev) => ({ ...prev, compact: value })),
                label: t('columns.compact'),
              }),
            ),
            h(
              'div',
              { className: 'ssh-popFoot' },
              h(
                Button,
                {
                  size: 'sm',
                  variant: 'ghost',
                  onClick: () => setColumns({ info: true, notes: true, compact: false }),
                },
                t('columns.reset'),
              ),
            ),
          )
        }
        if (floating.kind === 'config' || floating.kind === 'backups') {
          const isConfig = floating.kind === 'config'
          const path = isConfig ? snapshot?.configPath : snapshot?.backupDir
          return h(
            'div',
            { className: 'ssh-popover' },
            h('div', { className: 'ssh-popTitle' }, isConfig ? t('config.title') : t('backups.title')),
            h('div', { className: 'ssh-popPath mono' }, path || '—'),
            h('div', { className: 'ssh-popMeta' }, isConfig ? t('config.exists') : t('backups.desc')),
            h(
              'div',
              { className: 'ssh-popFoot' },
              h(
                Button,
                { size: 'sm', onClick: () => void copyValue(path || '') },
                h(IconCopy, { size: 12 }),
                t('common.copy'),
              ),
            ),
          )
        }
        const host = hosts.find((entry) => entry.host === floating.host)
        if (!host) return null
        const close = () => setFloating(null)
        return [
          h(
            MenuItem,
            {
              key: 'test',
              icon: h(IconCheckCircle, { size: 14 }),
              disabled: isPending(`test:${host.host}`),
              onClick: () => {
                close()
                void testHost(host)
              },
            },
            t('row.test'),
          ),
          h(
            MenuItem,
            {
              key: 'inspect',
              icon: h(IconServer, { size: 14 }),
              disabled: isPending(`inspect:${host.host}`),
              onClick: () => {
                close()
                void inspectHost(host)
              },
            },
            t('row.inspect'),
          ),
          h(
            MenuItem,
            {
              key: 'copy',
              icon: h(IconCopy, { size: 14 }),
              onClick: () => {
                close()
                void copyValue(hostAddress(host))
              },
            },
            t('table.copyAddress'),
          ),
          h(
            MenuItem,
            {
              key: 'favorite',
              icon: h(IconStar, { size: 14, filled: host.favorite === true }),
              onClick: () => {
                close()
                void toggleFavorite(host)
              },
            },
            host.favorite === true ? t('row.unfavorite') : t('row.favorite'),
          ),
          h(
            MenuItem,
            {
              key: 'files',
              icon: h(IconFolder, { size: 14 }),
              onClick: () => {
                close()
                openDrawer(host, 'files')
              },
            },
            t('session.files'),
          ),
          h(
            MenuItem,
            {
              key: 'details',
              icon: h(IconServer, { size: 14 }),
              onClick: () => {
                close()
                openDrawer(host, 'details')
              },
            },
            t('session.details'),
          ),
          h('div', { key: 'divider', className: 'ssh-menuDivider' }),
          h(
            MenuItem,
            {
              key: 'edit',
              icon: h(IconEdit, { size: 14 }),
              onClick: () => {
                close()
                openEditor(host)
              },
            },
            t('row.edit'),
          ),
          h(
            MenuItem,
            {
              key: 'delete',
              icon: h(IconTrash, { size: 14 }),
              danger: true,
              onClick: () => {
                close()
                requestDelete(host)
              },
            },
            t('row.delete'),
          ),
        ]
      }

      const sessionAttention = sessions.some((session) => {
        const state = sessionStates[session.id]
        return state === 'error' || state === 'closed'
      })
      const tabItems = [
        ['hosts', t('tabs.hosts')],
        ...(sessions.length > 0
          ? [['sessions', h('span', { className: 'ssh-tabLabel' }, t('tabs.sessions'), sessionAttention ? h('span', { className: 'ssh-tabAlert', title: t('session.attention') }) : null)]]
          : []),
        ['batch', t('tabs.batch')],
        ['settings', t('tabs.settings')],
      ]

      return h(
        'div',
        { className: 'ssh-root' },
        h('style', null, CSS),
        h(
          'header',
          { className: 'ssh-top' },
          h(
            'nav',
            { className: 'ssh-tabs', role: 'tablist' },
            tabItems.map(([id, label]) =>
              h(
                'button',
                {
                  key: id,
                  type: 'button',
                  role: 'tab',
                  'aria-selected': effectiveTab === id,
                  className: cx('ssh-tab', effectiveTab === id && 'active'),
                  onClick: () => {
                    setTab(id)
                    setFloating(null)
                  },
                },
                label,
              ),
            ),
          ),
          h(
            'div',
            { className: 'ssh-topRight' },
            h(
              'button',
              {
                type: 'button',
                className: 'ssh-configBtn',
                title: t('app.copyConfig'),
                onClick: () => void copyValue(snapshot?.configPath || ''),
              },
              h(IconFile, { size: 14 }),
              h('span', null, t('app.configFile')),
              h('span', { className: 'ssh-configPath' }, snapshot?.configPath ?? ''),
            ),
          ),
        ),
        error && snapshot
          ? h(
              'div',
              { className: 'ssh-errorBar' },
              h(IconAlert, { size: 14 }),
              h('span', { className: 'ssh-errorText' }, t('state.loadError', { message: error })),
              h(Button, { size: 'sm', variant: 'ghost', onClick: () => void load({ quiet: true }) }, t('state.retry')),
            )
          : null,
        loading && !snapshot
          ? h(
              'div',
              { className: 'ssh-loadingPage' },
              h(Spinner, { size: 22 }),
              h('span', null, sessions.length > 0 ? t('session.restoring') : t('state.loading')),
            )
          : !snapshot && error
            ? h(
                'div',
                { className: 'ssh-loadingPage' },
                h(IconAlert, { size: 22 }),
                h('span', null, t('state.loadError', { message: error })),
                h(Button, { onClick: () => void load() }, t('state.retry')),
              )
            : effectiveTab === 'sessions'
              ? null
              : effectiveTab === 'hosts'
                ? h(HostsTab, { model })
                : effectiveTab === 'batch'
                  ? h(BatchTab, { model })
                  : h(SettingsTab, { model }),
        snapshot && sessions.length > 0
          ? h(
              'div',
              { className: 'ssh-sessionLayer', style: { display: effectiveTab === 'sessions' ? 'flex' : 'none' } },
              h(SessionView, { model, visible: effectiveTab === 'sessions' }),
            )
          : null,
        drawerHost ? h(Drawer, { key: drawerHost.host, model, state: drawer }) : null,
        editor ? h(EditorDialog, { key: editor.original || 'new', model, state: editor }) : null,
        groupsOpen ? h(GroupsDialog, { model }) : null,
        confirmState ? h(ConfirmDialog, { t, state: confirmState, onCancel: () => setConfirmState(null) }) : null,
        floating
          ? h(
              'div',
              {
                ref: floatingRef,
                className: 'ssh-floating',
                style: {
                  top: floating.top,
                  left: floating.left,
                  width: floating.width,
                  transform: floating.openUp ? 'translateY(-100%)' : undefined,
                },
              },
              renderFloating(),
            )
          : null,
        h(Toast, { state: toastState }),
      )
    }

    // ---------------------------------------------------------------------
    // Hosts tab: sidebar + table
    // ---------------------------------------------------------------------

    function Sidebar({ model }) {
      const {
        t,
        hosts,
        groups,
        groupFilter,
        setGroupFilter,
        collapsedGroups,
        toggleGroup,
        sidebarOpen,
        activeAlias,
        setActiveAlias,
        openDrawer,
        openSession,
        setSidebarOpen,
        openEditor,
        load,
        refreshing,
        setGroupsOpen,
      } = model
      const allActive = groupFilter === null
      return h(
        'aside',
        { className: cx('ssh-sidebar', sidebarOpen && 'open'), 'aria-label': t('tabs.hosts') },
        h(
          'div',
          { className: 'ssh-sideTop' },
          h(
            'button',
            {
              type: 'button',
              className: 'ssh-sideAction',
              title: t('toolbar.collapse'),
              onClick: () => setSidebarOpen(false),
            },
            h(IconPanelLeft, { size: 15 }),
            h('span', null, t('toolbar.collapse')),
          ),
          h(
            IconButton,
            { title: t('toolbar.refresh'), onClick: () => void load({ quiet: true }), disabled: refreshing },
            refreshing ? h(Spinner, { size: 13 }) : h(IconRefresh, { size: 15 }),
          ),
          h(
            Button,
            {
              size: 'sm',
              className: 'ssh-sideBtn',
              onClick: () => setGroupsOpen(true),
              title: t('toolbar.groups'),
            },
            h(IconFolder, { size: 13 }),
            h('span', null, t('toolbar.groups')),
          ),
          h(
            Button,
            {
              size: 'sm',
              variant: 'outlineStrong',
              className: 'ssh-sideBtn',
              onClick: () => openEditor(null),
              title: t('toolbar.new'),
            },
            h(IconPlus, { size: 13 }),
            h('span', null, t('toolbar.newShort')),
          ),
        ),
        h(
          'div',
          { className: 'ssh-tree', role: 'tree' },
          h(
            'div',
            {
              className: cx('ssh-treeRow', 'ssh-treeAll', allActive && 'selected'),
              role: 'treeitem',
              tabIndex: 0,
              'aria-selected': allActive,
              onClick: () => setGroupFilter(null),
              onKeyDown: (event) => {
                if (event.target !== event.currentTarget) return
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setGroupFilter(null)
                }
              },
            },
            h('span', { className: 'ssh-treeIcon' }, h(IconTerminal, { size: 14 })),
            h('span', { className: 'ssh-treeLabel' }, t('tree.all')),
            h('span', { className: 'ssh-treeCount' }, String(hosts.length)),
          ),
          groups.length === 0
            ? h('div', { className: 'ssh-treeEmpty' }, hosts.length === 0 ? t('empty.body') : t('empty.filteredBody'))
            : groups.map((group) => {
                const collapsed = collapsedGroups[group.key] === true
                return h(
                  'div',
                  { key: `group:${group.key}` },
                  h(
                    'div',
                    {
                      className: cx('ssh-treeRow', 'ssh-treeGroup', groupFilter === group.key && 'selected'),
                      role: 'treeitem',
                      tabIndex: 0,
                      'aria-selected': groupFilter === group.key,
                      'aria-expanded': !collapsed,
                      onClick: () => setGroupFilter(groupFilter === group.key ? null : group.key),
                      onKeyDown: (event) => {
                        if (event.target !== event.currentTarget) return
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setGroupFilter(groupFilter === group.key ? null : group.key)
                        }
                      },
                    },
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'ssh-treeCaret',
                        title: collapsed ? t('tree.expand') : t('tree.collapse'),
                        'aria-label': collapsed ? t('tree.expand') : t('tree.collapse'),
                        onClick: (event) => {
                          event.stopPropagation()
                          toggleGroup(group.key)
                        },
                      },
                      h(collapsed ? IconChevronRight : IconChevronDown, { size: 12 }),
                    ),
                    h('span', { className: 'ssh-treeIcon' }, h(IconFolder, { size: 14 })),
                    h('span', { className: 'ssh-treeLabel', title: group.label }, group.label),
                    h('span', { className: 'ssh-treeCount' }, String(group.hosts.length)),
                  ),
                  collapsed
                    ? null
                    : h(
                        'div',
                        { className: 'ssh-treeHosts', role: 'group' },
                        group.hosts.map((host) =>
                          h(
                            'button',
                            {
                              key: host.host,
                              type: 'button',
                              className: cx('ssh-treeRow', 'ssh-treeHost', activeAlias === host.host && 'active'),
                              title: hostAddress(host),
                              onClick: () => setActiveAlias(host.host),
                              onDoubleClick: () => openSession(host),
                            },
                            h('span', { className: 'ssh-treeHostName' }, hostName(host)),
                            host.favorite === true
                              ? h('span', { className: 'ssh-treeStar' }, h(IconStar, { size: 11, filled: true }))
                              : null,
                          ),
                        ),
                      ),
                )
              }),
        ),
      )
    }

    function SortHeader({ model, column, label }) {
      const { sort, setSort, t } = model
      const active = sort.key === column
      return h(
        'button',
        {
          type: 'button',
          className: cx('ssh-headBtn', active && 'active'),
          title: t('table.sortBy', { column: label }),
          onClick: () => setSort(active ? { key: column, dir: sort.dir === 'asc' ? 'desc' : 'asc' } : { key: column, dir: 'asc' }),
        },
        h('span', null, label),
        h('span', { className: cx('ssh-sortMark', active && 'on') }, h(IconSort, { size: 10, dir: active ? sort.dir : 'asc' })),
      )
    }

    function HostsToolbar({ model }) {
      const {
        t,
        snapshot,
        allGroups,
        groupFilter,
        visible,
        filter,
        setFilter,
        favoriteOnly,
        setFavoriteOnly,
        resetFilters,
        load,
        refreshing,
        sidebarOpen,
        setSidebarOpen,
        columns,
        setColumns,
        openColumns,
        openLocalConfig,
        openBackups,
        checkAllHosts,
        isPending,
      } = model
      const group = groupFilter === null ? null : allGroups.find((entry) => entry.key === groupFilter)
      const contextLabel = groupFilter === null ? t('tree.all') : group ? group.label : t('tree.ungrouped')
      return h(
        'div',
        { className: 'ssh-mainTop' },
        !sidebarOpen
          ? h(
              IconButton,
              { title: t('toolbar.expand'), onClick: () => setSidebarOpen(true) },
              h(IconPanelLeft, { size: 16 }),
            )
          : null,
        h(
          'div',
          { className: 'ssh-context' },
          h('span', { className: 'ssh-contextName', title: contextLabel }, contextLabel),
          h('span', { className: 'ssh-contextCount' }, String(visible.length)),
        ),
        h(
          'span',
          { className: 'ssh-search' },
          h(IconSearch, { size: 15 }),
          h(TextInput, {
            value: filter,
            onChange: setFilter,
            placeholder: t('search.placeholder'),
            spellCheck: false,
          }),
        ),
        filter !== '' || favoriteOnly || groupFilter !== null
          ? h(IconButton, { title: t('empty.clearFilters'), onClick: resetFilters }, h(IconClose, { size: 12 }))
          : null,
        h(
          IconButton,
          {
            title: t('toolbar.filter'),
            onClick: () => setFavoriteOnly((value) => !value),
            active: favoriteOnly,
            ariaPressed: favoriteOnly,
          },
          h(IconFilter, { size: 15 }),
        ),
        h('span', { className: 'ssh-toolSpacer' }),
        h(
          Button,
          { size: 'sm', variant: 'ghost', onClick: () => void checkAllHosts(), disabled: isPending('health:all') },
          isPending('health:all') ? h(Spinner, { size: 12 }) : h(IconCheckCircle, { size: 13 }),
          t('toolbar.checkAll'),
        ),
        h(
          IconButton,
          { title: t('toolbar.refresh'), onClick: () => void load({ quiet: true }), disabled: refreshing },
          refreshing ? h(Spinner, { size: 13 }) : h(IconRefresh, { size: 15 }),
        ),
        h(
          'span',
          { className: 'ssh-infoToggle' },
          h(Switch, {
            checked: columns.info,
            onChange: (value) => setColumns((prev) => ({ ...prev, info: value })),
            label: t('toolbar.info'),
          }),
        ),
        h(IconButton, { title: t('toolbar.settings'), onClick: openColumns }, h(IconSliders, { size: 16 })),
        h('span', { className: 'ssh-toolDivider' }),
        h(
          Button,
          {
            size: 'sm',
            variant: 'ghost',
            className: 'ssh-pathBtn',
            title: snapshot?.configPath ?? t('toolbar.local'),
            onClick: openLocalConfig,
          },
          h(IconFile, { size: 13 }),
          h('span', { className: 'ssh-btnLabel' }, t('toolbar.local')),
        ),
        h(
          Button,
          {
            size: 'sm',
            variant: 'ghost',
            className: 'ssh-pathBtn',
            title: snapshot?.backupDir ?? t('toolbar.backups'),
            onClick: openBackups,
          },
          h(IconFolder, { size: 13 }),
          h('span', { className: 'ssh-btnLabel' }, t('toolbar.backups')),
        ),
      )
    }

    function BatchBar({ model }) {
      const { t, selected, setSelected, setTab, favoriteSelected, isPending } = model
      return h(
        'div',
        { className: 'ssh-batchBar' },
        h('span', { className: 'ssh-batchCount' }, t('table.selected', { count: selected.length })),
        h(
          Button,
          { size: 'sm', variant: 'ghost', onClick: () => setTab('batch') },
          h(IconPlay, { size: 12 }),
          t('table.batch'),
        ),
        h(
          Button,
          {
            size: 'sm',
            variant: 'ghost',
            onClick: () => void favoriteSelected(),
            disabled: isPending('batchFavorite'),
          },
          h(IconStar, { size: 12, filled: true }),
          t('table.favoriteSelected'),
        ),
        h(Button, { size: 'sm', variant: 'ghost', onClick: () => setSelected([]) }, t('table.clearSelection')),
      )
    }

    function HostRow({ model, host, style, columns }) {
      const {
        t,
        activeAlias,
        setActiveAlias,
        selected,
        toggleSelected,
        openDrawer,
        openSession,
        openEditor,
        openRowMenu,
        testHost,
        copyValue,
        isPending,
      } = model
      const chips = infoChips(host, t)
      const credential = credentialInfo(host, t)
      const testing = isPending(`test:${host.host}`)
      return h(
        'div',
        {
          className: cx('ssh-grid', 'ssh-row', activeAlias === host.host && 'selected'),
          style,
          role: 'row',
          tabIndex: 0,
          'aria-selected': activeAlias === host.host,
          onClick: () => setActiveAlias(host.host),
          onDoubleClick: (event) => {
            if (event.target !== event.currentTarget) return
            openSession(host)
          },
          onKeyDown: (event) => {
            if (event.target !== event.currentTarget) return
            if (event.key === 'Enter') {
              event.preventDefault()
              openSession(host)
            } else if (event.key === ' ') {
              event.preventDefault()
              toggleSelected(host.host)
            }
          },
        },
        h(
          'div',
          { className: 'ssh-cell ssh-colCheck' },
          h(Checkbox, {
            checked: selected.includes(host.host),
            onChange: () => toggleSelected(host.host),
            label: t('table.select'),
          }),
        ),
        h(
          'div',
          { className: 'ssh-cell ssh-colSystem' },
          h(
            'span',
            { className: cx('ssh-osBadge', !host.system && 'muted') },
            h(IconServer, { size: 14 }),
          ),
          h(
            'span',
            { className: cx('ssh-osName', !host.system && 'muted'), title: host.system || t('table.unknownOs') },
            host.system ? shortSystem(host.system) : t('table.unknownOs'),
          ),
        ),
        h(
          'div',
          { className: 'ssh-cell ssh-colLatency' },
          h(
            'button',
            {
              type: 'button',
              className: cx('ssh-latency', host.health === 'offline' ? 'error' : host.latencyMs ? 'ok' : 'muted'),
              title: t('table.test'),
              disabled: testing,
              onClick: (event) => {
                event.stopPropagation()
                void testHost(host)
              },
            },
            testing
              ? h(Spinner, { size: 12 })
              : host.latencyMs
                ? h('span', { className: 'ssh-latencyIcon' }, h(IconCheckCircle, { size: 13 }))
                : h('span', { className: 'ssh-latencyDot' }),
            h('span', null, testing ? t('latency.testing') : host.health === 'offline' ? t('latency.offline') : host.latencyMs ? `${host.latencyMs} ms` : t('latency.unknown')),
          ),
        ),
        h(
          'div',
          { className: 'ssh-cell ssh-colName' },
          h(
            'span',
            { className: 'ssh-nameMain', title: hostName(host) },
            host.favorite === true ? h('span', { className: 'ssh-favMark' }, h(IconStar, { size: 10, filled: true })) : null,
            h('span', null, hostName(host)),
          ),
          host.label && host.label !== host.host ? h('span', { className: 'ssh-nameSub' }, host.host) : null,
        ),
        h(
          'div',
          { className: 'ssh-cell ssh-colAddress' },
          h('span', { className: 'ssh-address', title: hostAddress(host) }, hostTarget(host)),
          h(
            'span',
            { className: 'ssh-inlineActions' },
            h(
              'button',
              {
                type: 'button',
                className: 'ssh-miniBtn',
                title: t('table.copyAddress'),
                onClick: (event) => {
                  event.stopPropagation()
                  void copyValue(hostAddress(host))
                },
              },
              h(IconCopy, { size: 12 }),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'ssh-miniBtn',
                title: t('table.open'),
                onClick: (event) => {
                  event.stopPropagation()
                  openSession(host)
                },
              },
              h(IconTerminal, { size: 12 }),
            ),
          ),
        ),
        columns.info
          ? h(
              'div',
              { className: 'ssh-cell ssh-colInfo' },
              chips.length
                ? chips.map((chip, index) => h(Chip, { key: `${index}-${chip}`, title: chip }, chip))
                : h('span', { className: 'ssh-mutedText', title: t('table.inspectHint') }, t('table.noData')),
            )
          : null,
        columns.notes
          ? h(
              'div',
              { className: 'ssh-cell ssh-colNotes' },
              h(
                'span',
                { className: cx('ssh-noteText', !host.note && 'muted'), title: host.note || '' },
                host.note || t('table.noData'),
              ),
            )
          : null,
        h(
          'div',
          { className: 'ssh-cell ssh-colActions' },
          h(
            Button,
            {
              variant: 'success',
              size: 'sm',
              onClick: (event) => {
                event.stopPropagation()
                openSession(host)
              },
            },
            t('row.connect'),
          ),
          h(
            Button,
            {
              variant: 'ghost',
              size: 'sm',
              onClick: (event) => {
                event.stopPropagation()
                openEditor(host)
              },
            },
            t('row.edit'),
          ),
          h(
            IconButton,
            {
              title: t('row.more'),
              onClick: (event) => {
                event.stopPropagation()
                openRowMenu(event, host)
              },
            },
            h(IconMore, { size: 16 }),
          ),
        ),
        h('div', { className: 'ssh-cell ssh-colGear' }),
        h('span', { className: 'ssh-srOnly' }, credential.label),
      )
    }

    function HostTable({ model }) {
      const { t, hosts, visible, selected, loading, columns, toggleAllVisible, activeAlias } = model
      const scrollRef = React.useRef(null)
      const [tableWidth, setTableWidth] = React.useState(1180)
      React.useEffect(() => {
        const node = scrollRef.current
        if (!node || typeof ResizeObserver === 'undefined') return undefined
        const observer = new ResizeObserver((entries) => {
          for (const entry of entries) setTableWidth(Math.round(entry.contentRect.width))
        })
        observer.observe(node)
        return () => observer.disconnect()
      }, [])
      const hasNotes = visible.some((host) => Boolean(host.note))
      const effective = {
        // The switch must be meaningful even before any host was inspected:
        // show the column with per-row hints instead of silently hiding it.
        info: columns.info,
        notes: columns.notes && hasNotes && tableWidth >= 1100,
      }
      const style = { gridTemplateColumns: tableTracks(effective) }
      const visibleAliases = visible.map((host) => host.host)
      const allChecked = visibleAliases.length > 0 && visibleAliases.every((alias) => selected.includes(alias))
      const someChecked = visibleAliases.some((alias) => selected.includes(alias))
      return h(
        'div',
        { className: cx('ssh-table', columns.compact && 'compact'), role: 'table' },
        h(
          'div',
          { className: 'ssh-tableScroll', ref: scrollRef, role: 'rowgroup' },
          h(
            'div',
            { className: 'ssh-grid ssh-head', style, role: 'row' },
            h(
              'div',
              { className: 'ssh-cell ssh-colCheck', role: 'columnheader' },
              h(Checkbox, {
                checked: allChecked,
                indeterminate: someChecked,
                onChange: () => toggleAllVisible(),
                label: t('table.selectAll'),
              }),
            ),
            h('div', { className: 'ssh-cell ssh-colSystem', role: 'columnheader' }, h(SortHeader, { model, column: 'system', label: t('table.system') })),
            h('div', { className: 'ssh-cell ssh-colLatency', role: 'columnheader' }, h(SortHeader, { model, column: 'latency', label: t('table.latency') })),
            h('div', { className: 'ssh-cell ssh-colName', role: 'columnheader' }, h(SortHeader, { model, column: 'name', label: t('table.name') })),
            h('div', { className: 'ssh-cell ssh-colAddress', role: 'columnheader' }, h(SortHeader, { model, column: 'address', label: t('table.address') })),
            effective.info ? h('div', { className: 'ssh-cell ssh-colInfo', role: 'columnheader' }, h('span', { className: 'ssh-headLabel' }, t('table.info'))) : null,
            effective.notes ? h('div', { className: 'ssh-cell ssh-colNotes', role: 'columnheader' }, h(SortHeader, { model, column: 'notes', label: t('table.notes') })) : null,
            h('div', { className: 'ssh-cell ssh-colActions', role: 'columnheader' }, h('span', { className: 'ssh-headLabel' }, t('table.actions'))),
            h(
              'div',
              { className: 'ssh-cell ssh-colGear', role: 'columnheader' },
              h(IconButton, { title: t('toolbar.settings'), onClick: model.openColumns }, h(IconSliders, { size: 15 })),
            ),
          ),
          visible.length > 0
            ? visible.map((host) => h(HostRow, { key: host.host, model, host, style, columns: effective }))
            : hosts.length === 0
              ? h(Empty, {
                  icon: h(IconTerminal, { size: 24 }),
                  title: t('empty.title'),
                  body: t('empty.body'),
                  compact: false,
                  actions: [
                    h(Button, { key: 'new', variant: 'primary', onClick: () => model.openEditor(null) }, h(IconPlus, { size: 14 }), t('empty.new')),
                    h(Button, { key: 'refresh', variant: 'ghost', onClick: () => void model.load({ quiet: true }) }, h(IconRefresh, { size: 14 }), t('toolbar.refresh')),
                  ],
                })
              : h(Empty, {
                  icon: h(IconSearch, { size: 22 }),
                  title: t('empty.filteredTitle'),
                  body: t('empty.filteredBody'),
                  compact: true,
                  actions: [
                    h(Button, { key: 'clear', variant: 'ghost', onClick: model.resetFilters }, t('empty.clearFilters')),
                  ],
                }),
        ),
        h('span', { className: 'ssh-srOnly' }, activeAlias ?? ''),
        loading ? h('span', { className: 'ssh-srOnly' }, t('state.loading')) : null,
      )
    }

    function HostsTab({ model }) {
      const { t } = model
      const beginResize = (event) => {
        if (!model.sidebarOpen || event.button !== 0) return
        event.preventDefault()
        event.stopPropagation()
        const startX = event.clientX
        const startWidth = model.treeWidth
        document.body.classList.add('ssh-col-resizing')
        const onMove = (moveEvent) => {
          model.setTreeWidth(clampTreeWidth(startWidth + moveEvent.clientX - startX))
        }
        const onUp = () => {
          document.body.classList.remove('ssh-col-resizing')
          window.removeEventListener('pointermove', onMove)
          window.removeEventListener('pointerup', onUp)
          window.removeEventListener('pointercancel', onUp)
        }
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
        window.addEventListener('pointercancel', onUp)
      }
      const nudgeWidth = (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        event.preventDefault()
        model.setTreeWidth(clampTreeWidth(model.treeWidth + (event.key === 'ArrowLeft' ? -20 : 20)))
      }
      return h(
        'div',
        {
          className: cx('ssh-body', !model.sidebarOpen && 'collapsed'),
          style: { '--ssh-tree-width': `${model.treeWidth}px` },
        },
        h(Sidebar, { model }),
        model.sidebarOpen
          ? h('div', {
              className: 'ssh-treeResizer',
              role: 'separator',
              tabIndex: 0,
              'aria-orientation': 'vertical',
              'aria-label': t('toolbar.resize'),
              'aria-valuemin': TREE_MIN_WIDTH,
              'aria-valuemax': TREE_MAX_WIDTH,
              'aria-valuenow': model.treeWidth,
              title: t('toolbar.resize'),
              onPointerDown: beginResize,
              onKeyDown: nudgeWidth,
              onDoubleClick: () => model.setTreeWidth(300),
            })
          : null,
        model.sidebarOpen ? h('div', { className: 'ssh-sideScrim', onClick: () => model.setSidebarOpen(false) }) : null,
        h(
          'main',
          { className: 'ssh-main' },
          h(HostsToolbar, { model }),
          model.selected.length > 0 ? h(BatchBar, { model }) : null,
          h(HostTable, { model }),
        ),
      )
    }

    // ---------------------------------------------------------------------
    // Connection drawer
    // ---------------------------------------------------------------------

    // ---------------------------------------------------------------------
    // Terminal sessions (tabs)
    // ---------------------------------------------------------------------

    function SessionView({ model, visible }) {
      const {
        t,
        hosts,
        sessions,
        sessionStates,
        activeSessionId,
        setActiveSessionId,
        setActiveAlias,
        clearSignals,
        closeSession,
        clearSession,
        setTab,
        openDrawer,
        testHost,
        isPending,
      } = model
      if (sessions.length === 0) return null
      const hostOf = (session) => hosts.find((host) => host.host === session.hostAlias) ?? null
      const activateSession = (session) => {
        setActiveSessionId(session.id)
        const host = hostOf(session)
        if (host) setActiveAlias(host.host)
      }
      const activeSession = sessions.find((session) => session.id === activeSessionId) ?? sessions[0]
      const activeHost = hostOf(activeSession)
      const activeCredential = activeHost ? credentialInfo(activeHost, t) : null
      const testing = activeHost ? isPending(`test:${activeHost.host}`) : false
      const isVisible = visible === true
      return h(
        'div',
        { className: 'ssh-sessions' },
        h(
          'div',
          { className: 'ssh-sessionBar' },
          h(
            'div',
            { className: 'ssh-sessionTabs', role: 'tablist' },
            sessions.map((session) => {
              const host = hostOf(session)
              const isActive = session.id === activeSession.id
              const credential = host ? credentialInfo(host, t) : null
              return h(
                'div',
                {
                  key: session.id,
                  role: 'tab',
                  tabIndex: 0,
                  'aria-selected': isActive,
                  className: cx('ssh-sessionTab', isActive && 'active'),
                  title: host ? hostAddress(host) : session.hostAlias,
                  onClick: () => activateSession(session),
                  onAuxClick: (event) => {
                    if (event.button === 1) {
                      event.preventDefault()
                      closeSession(session.id)
                    }
                  },
                  onKeyDown: (event) => {
                    if (event.target !== event.currentTarget) return
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      activateSession(session)
                    }
                  },
                },
                h('span', {
                  className: cx('ssh-sessionDot', credential ? (credential.key === 'password' || credential.key === 'key' ? 'ok' : 'warn') : 'warn'),
                }),
                h('span', {
                  className: cx('ssh-sessionState', sessionStates[session.id] ?? 'loading'),
                  title: t(`session.state.${sessionStates[session.id] ?? 'loading'}`),
                }),
                h('span', { className: 'ssh-sessionTabTitle' }, host ? hostName(host) : session.hostAlias),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'ssh-sessionTabClose',
                    title: t('session.close'),
                    'aria-label': t('session.close'),
                    onClick: (event) => {
                      event.stopPropagation()
                      closeSession(session.id)
                    },
                  },
                  h(IconClose, { size: 11 }),
                ),
              )
            }),
            h(
              'button',
              {
                type: 'button',
                className: 'ssh-sessionNew',
                title: t('session.new'),
                'aria-label': t('session.new'),
                onClick: () => setTab('hosts'),
              },
              h(IconPlus, { size: 13 }),
            ),
          ),
          h(
            'div',
            { className: 'ssh-sessionActions' },
            activeHost
              ? h('span', { className: 'ssh-sessionAddress', title: hostAddress(activeHost) }, hostTarget(activeHost))
              : null,
            activeCredential ? h(Badge, { tone: activeCredential.tone }, activeCredential.label) : null,
            h(
              IconButton,
              {
                title: t('drawer.details.test'),
                disabled: !activeHost || testing,
                onClick: () => {
                  if (activeHost) void testHost(activeHost)
                },
              },
              testing ? h(Spinner, { size: 13 }) : h(IconCheckCircle, { size: 15 }),
            ),
            h(
              IconButton,
              {
                title: t('session.files'),
                disabled: !activeHost,
                onClick: () => {
                  if (activeHost) openDrawer(activeHost, 'files')
                },
              },
              h(IconFolder, { size: 15 }),
            ),
            h(
              IconButton,
              {
                title: t('session.details'),
                disabled: !activeHost,
                onClick: () => {
                  if (activeHost) openDrawer(activeHost, 'details')
                },
              },
              h(IconServer, { size: 15 }),
            ),
            h(
              IconButton,
              {
                title: t('terminal.fontSmaller'),
                disabled: model.terminalFontSize <= TERMINAL_FONT_MIN,
                onClick: () => model.setTerminalFontSize((value) => Math.max(TERMINAL_FONT_MIN, value - 1)),
              },
              h('span', { className: 'ssh-fontGlyph' }, 'A−'),
            ),
            h(
              IconButton,
              {
                title: t('terminal.fontLarger'),
                disabled: model.terminalFontSize >= TERMINAL_FONT_MAX,
                onClick: () => model.setTerminalFontSize((value) => Math.min(TERMINAL_FONT_MAX, value + 1)),
              },
              h('span', { className: 'ssh-fontGlyph' }, 'A+'),
            ),
            h(
              IconButton,
              {
                title: t('session.clear'),
                disabled: !activeSession,
                onClick: () => clearSession(activeSession.id),
              },
              h(IconEraser, { size: 15 }),
            ),
            h(
              IconButton,
              {
                title: t('session.close'),
                disabled: !activeSession,
                onClick: () => closeSession(activeSession.id),
              },
              h(IconClose, { size: 15 }),
            ),
          ),
        ),
        h(
          'div',
          { className: 'ssh-sessionPanes' },
          sessions.map((session) => {
            const host = hostOf(session)
            return h(
              'div',
              {
                key: session.id,
                className: cx('ssh-sessionPane', session.id === activeSession.id && 'active'),
              },
              host
                ? h(TerminalPane, {
                    model,
                    host,
                    sessionId: session.id,
                    fontSize: model.terminalFontSize,
                    clearSignal: clearSignals[session.id] ?? 0,
                    active: isVisible && session.id === activeSession.id,
                  })
                : h(Empty, {
                    icon: h(IconAlert, { size: 22 }),
                    title: t('state.hostMissing'),
                    body: session.hostAlias,
                  }),
            )
          }),
        ),
      )
    }

    function Drawer({ model, state }) {
      const { t, hosts, isPending, testHost, toggleFavorite, openEditor, requestDelete } = model
      const host = hosts.find((entry) => entry.host === state.alias) ?? null
      const tab = state.tab === 'files' ? 'files' : 'details'
      if (!host) return null
      const credential = credentialInfo(host, t)
      const tabs = [
        ['files', t('drawer.files')],
        ['details', t('drawer.details')],
      ]
      const testing = isPending(`test:${host.host}`)
      return h(
        'div',
        { className: 'ssh-drawer', role: 'dialog', 'aria-modal': 'true', 'aria-label': hostName(host) },
        h('div', { className: 'ssh-drawerScrim', onClick: () => model.setDrawer(null) }),
        h(
          'div',
          { className: 'ssh-drawerPanel' },
          h(
            'div',
            { className: 'ssh-drawerHead' },
            h('span', { className: 'ssh-osBadge' }, h(IconServer, { size: 15 })),
            h(
              'div',
              { className: 'ssh-drawerTitles' },
              h('div', { className: 'ssh-drawerTitle', title: hostName(host) }, hostName(host)),
              h('div', { className: 'ssh-drawerSub' }, hostTarget(host)),
            ),
            h(
              Badge,
              { tone: credential.tone },
              credential.key === 'password' ? h(IconLock, { size: 11 }) : null,
              credential.label,
            ),
            h(
              IconButton,
              { title: t('drawer.details.test'), onClick: () => void testHost(host), disabled: testing },
              testing ? h(Spinner, { size: 13 }) : h(IconCheckCircle, { size: 16 }),
            ),
            h(
              IconButton,
              {
                title: host.favorite ? t('row.unfavorite') : t('row.favorite'),
                onClick: () => void toggleFavorite(host),
              },
              h(IconStar, { size: 16, filled: host.favorite === true }),
            ),
            h(IconButton, { title: t('common.close'), onClick: () => model.setDrawer(null) }, h(IconClose)),
          ),
          h(
            'div',
            { className: 'ssh-drawerTabs', role: 'tablist' },
            tabs.map(([id, label]) =>
              h(
                'button',
                {
                  key: id,
                  type: 'button',
                  role: 'tab',
                  'aria-selected': tab === id,
                  className: cx('ssh-drawerTab', tab === id && 'active'),
                  onClick: () => model.setDrawer({ alias: host.host, tab: id }),
                },
                label,
              ),
            ),
          ),
          h(
            'div',
            { className: 'ssh-drawerBody' },
            tab === 'files'
              ? h(FilesView, { model, host })
              : h(DetailsView, { model, host, onEdit: () => openEditor(host), onDelete: () => requestDelete(host) }),
          ),
        ),
      )
    }

    // ---------------------------------------------------------------------
    // Interactive terminal (xterm.js + PTY WebSocket)
    // ---------------------------------------------------------------------

    const TERMINAL_ASSET_IDS = {
      css: 'dsh-ssh-manage-xterm-css',
      script: 'dsh-ssh-manage-xterm-script',
      fit: 'dsh-ssh-manage-xterm-fit',
      search: 'dsh-ssh-manage-xterm-search',
    }

    function terminalAssetReady(id) {
      if (id === TERMINAL_ASSET_IDS.script) return Boolean(window.Terminal)
      if (id === TERMINAL_ASSET_IDS.fit) return Boolean(window.FitAddon && window.FitAddon.FitAddon)
      if (id === TERMINAL_ASSET_IDS.search) return Boolean(window.SearchAddon && window.SearchAddon.SearchAddon)
      return false
    }
    let terminalAssetsPromise = null

    function loadScriptAsset(id, src) {
      return new Promise((resolve, reject) => {
        const existing = document.getElementById(id)
        if (existing) {
          const ready = terminalAssetReady(id)
          if (ready) {
            resolve()
            return
          }
          existing.remove()
        }
        const script = document.createElement('script')
        script.id = id
        script.src = src
        script.async = true
        script.addEventListener('load', () => {
          script.dataset.loaded = 'true'
          resolve()
        }, { once: true })
        script.addEventListener('error', () => {
          script.remove()
          reject(new Error(`Cannot load ${src}`))
        }, { once: true })
        document.head.appendChild(script)
      })
    }

    function loadTerminalAssets() {
      if (window.Terminal && window.FitAddon && window.FitAddon.FitAddon && window.SearchAddon?.SearchAddon) {
        return Promise.resolve({
          Terminal: window.Terminal,
          FitAddon: window.FitAddon.FitAddon,
          SearchAddon: window.SearchAddon.SearchAddon,
        })
      }
      if (terminalAssetsPromise) return terminalAssetsPromise
      if (!document.getElementById(TERMINAL_ASSET_IDS.css)) {
        const link = document.createElement('link')
        link.id = TERMINAL_ASSET_IDS.css
        link.rel = 'stylesheet'
        link.href = '/dsh-ssh-manage/assets/xterm.css'
        document.head.appendChild(link)
      }
      terminalAssetsPromise = loadScriptAsset(TERMINAL_ASSET_IDS.script, '/dsh-ssh-manage/assets/xterm.js')
        .then(() => loadScriptAsset(TERMINAL_ASSET_IDS.fit, '/dsh-ssh-manage/assets/addon-fit.js'))
        // Search is optional: a missing/blocked addon must not break the terminal.
        .then(() => loadScriptAsset(TERMINAL_ASSET_IDS.search, '/dsh-ssh-manage/assets/addon-search.js').catch(() => null))
        .then(() => {
          if (!window.Terminal || !window.FitAddon || !window.FitAddon.FitAddon) {
            throw new Error('Terminal assets did not initialize')
          }
          return {
            Terminal: window.Terminal,
            FitAddon: window.FitAddon.FitAddon,
            SearchAddon: window.SearchAddon?.SearchAddon ?? null,
          }
        })
        .catch((error) => {
          terminalAssetsPromise = null
          throw error
        })
      return terminalAssetsPromise
    }

    function isDarkColor(value) {
      const match = String(value ?? '').match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i)
      if (!match) return true
      const luminance = 0.2126 * Number(match[1]) + 0.7152 * Number(match[2]) + 0.0722 * Number(match[3])
      return luminance < 140
    }

    function terminalThemeFor(element) {
      const root = (element && element.closest && element.closest('.ssh-root')) || document.documentElement
      const computed = getComputedStyle(root)
      const background = computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)' ? computed.backgroundColor : '#0f1116'
      const foreground = computed.color || '#e6edf3'
      const dark = isDarkColor(background)
      const palette = dark
        ? {
            black: '#1f2328',
            red: '#ff7b72',
            green: '#7ee787',
            yellow: '#e3b341',
            blue: '#79c0ff',
            magenta: '#d2a8ff',
            cyan: '#76e3ea',
            white: '#c9d1d9',
            brightBlack: '#6e7681',
            brightRed: '#ffa198',
            brightGreen: '#acf2bd',
            brightYellow: '#eac55f',
            brightBlue: '#a5d6ff',
            brightMagenta: '#e2c5ff',
            brightCyan: '#b3f0ff',
            brightWhite: '#f0f6fc',
          }
        : {
            black: '#24292f',
            red: '#cf222e',
            green: '#116329',
            yellow: '#7d4e00',
            blue: '#0550ae',
            magenta: '#8250df',
            cyan: '#096b72',
            white: '#6e7781',
            brightBlack: '#57606a',
            brightRed: '#a40e26',
            brightGreen: '#1a7f37',
            brightYellow: '#633c01',
            brightBlue: '#0969da',
            brightMagenta: '#6639ba',
            brightCyan: '#1b7c83',
            brightWhite: '#8c959f',
          }
      return {
        background,
        foreground,
        cursor: foreground,
        cursorAccent: background,
        selectionBackground: dark ? 'rgba(255, 255, 255, 0.24)' : 'rgba(9, 105, 218, 0.24)',
        ...palette,
      }
    }

    const terminalThemeListeners = new Set()
    let terminalThemeObserver = null
    let terminalThemeMedia = null
    let terminalThemeScheduled = false

    function emitTerminalTheme() {
      for (const listener of [...terminalThemeListeners]) {
        try { listener() } catch {}
      }
    }

    function scheduleTerminalTheme() {
      if (terminalThemeScheduled) return
      terminalThemeScheduled = true
      const run = () => {
        terminalThemeScheduled = false
        emitTerminalTheme()
      }
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run)
      else setTimeout(run, 16)
    }

    function ensureTerminalThemeWatcher() {
      if (typeof MutationObserver !== 'undefined' && !terminalThemeObserver) {
        terminalThemeObserver = new MutationObserver(scheduleTerminalTheme)
        const options = {
          attributes: true,
          attributeFilter: ['class', 'style', 'data-theme', 'data-color-mode', 'data-ds-dark-theme', 'data-ds-theme-source'],
        }
        terminalThemeObserver.observe(document.documentElement, options)
        if (document.body) terminalThemeObserver.observe(document.body, options)
      }
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function' && !terminalThemeMedia) {
        terminalThemeMedia = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = () => scheduleTerminalTheme()
        if (typeof terminalThemeMedia.addEventListener === 'function') terminalThemeMedia.addEventListener('change', onChange)
        else if (typeof terminalThemeMedia.addListener === 'function') terminalThemeMedia.addListener(onChange)
        terminalThemeMedia.__sshThemeChange = onChange
      }
    }

    function subscribeTerminalTheme(listener) {
      terminalThemeListeners.add(listener)
      ensureTerminalThemeWatcher()
      return () => {
        terminalThemeListeners.delete(listener)
        if (terminalThemeListeners.size > 0) return
        if (terminalThemeObserver) {
          terminalThemeObserver.disconnect()
          terminalThemeObserver = null
        }
        if (terminalThemeMedia) {
          const onChange = terminalThemeMedia.__sshThemeChange
          if (typeof terminalThemeMedia.removeEventListener === 'function') terminalThemeMedia.removeEventListener('change', onChange)
          else if (typeof terminalThemeMedia.removeListener === 'function') terminalThemeMedia.removeListener(onChange)
          terminalThemeMedia = null
        }
      }
    }

    const PTY_EVENTS_ROUTE = '/dsh-ssh-manage/pty/events'
    const PTY_ATTACH_ROUTE = '/dsh-ssh-manage/pty/attach'
    const PTY_CLEAR_ROUTE = '/dsh-ssh-manage/pty/clear'
    const PTY_TOUCH_ROUTE = '/dsh-ssh-manage/pty/touch'
    const ptyStream = { source: null, ready: false, promise: null, listeners: new Map() }
    const ptyActiveIds = new Set()
    const ptyClosedIds = new Set()
    const MAX_TERMINAL_SESSIONS = 16
    const ptyStreamLostHandlers = new Set()

    if (typeof window !== 'undefined') {
      const heartbeat = setInterval(() => {
        if (ptyActiveIds.size === 0) return
        try {
          void fetch(PTY_TOUCH_ROUTE, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ ids: [...ptyActiveIds] }),
            keepalive: true,
          }).catch(() => {})
        } catch {}
      }, 60_000)
      heartbeat.unref?.()
    }

    function closePtySession(id) {
      if (!id) return
      ptyClosedIds.add(id)
      ptyActiveIds.delete(id)
      try {
        void fetch('/dsh-ssh-manage/pty/close', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id }),
          keepalive: true,
        })
      } catch {}
    }

    function onPtyStreamLost(handler) {
      ptyStreamLostHandlers.add(handler)
      return () => ptyStreamLostHandlers.delete(handler)
    }

    function resetPtyStream(reason = new Error('Terminal event stream closed')) {
      const wasReady = ptyStream.ready === true
      const rejectPending = ptyStream.reject
      ptyStream.reject = null
      if (ptyStream.source) {
        try { ptyStream.source.close() } catch {}
      }
      ptyStream.source = null
      ptyStream.ready = false
      ptyStream.promise = null
      if (rejectPending) {
        try { rejectPending(reason) } catch {}
      }
      // A stream that never finished connecting is not a lost terminal yet;
      // its waiting panes get the rejected ensure promise and keep their
      // normal connecting/error overlay.
      if (!wasReady) return
      for (const handler of [...ptyStreamLostHandlers]) {
        try { handler() } catch {}
      }
    }

    function subscribePty(id, listener) {
      ptyStream.listeners.set(id, listener)
      return () => {
        if (ptyStream.listeners.get(id) === listener) ptyStream.listeners.delete(id)
      }
    }

    function ensurePtyStream() {
      if (ptyStream.source) {
        const state = ptyStream.source.readyState
        if (state === 1 && ptyStream.ready) return Promise.resolve()
        // CONNECTING: all callers must share the one in-flight promise; never
        // tear it down. This is the multi-tab restore / rapid-second-connect
        // race that used to leave N-1 panes in a permanent error overlay.
        if (state === 0) {
          if (ptyStream.promise) return ptyStream.promise
          try { ptyStream.source.close() } catch {}
          ptyStream.source = null
        } else if (state === 2) resetPtyStream()
      }
      if (ptyStream.promise) return ptyStream.promise
      ptyStream.promise = new Promise((resolve, reject) => {
        let settled = false
        let timer = null
        const source = new EventSource(PTY_EVENTS_ROUTE)
        const fail = (error) => {
          if (settled) return
          settled = true
          if (timer) clearTimeout(timer)
          try { source.close() } catch {}
          ptyStream.source = null
          ptyStream.ready = false
          ptyStream.promise = null
          ptyStream.reject = null
          reject(error)
        }
        ptyStream.source = source
        ptyStream.reject = reject
        timer = setTimeout(() => fail(new Error('Terminal event stream timed out')), 10_000)
        source.addEventListener('open', () => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          ptyStream.reject = null
          ptyStream.ready = true
          resolve()
        })
        source.addEventListener('error', () => {
          if (!settled) {
            fail(new Error('Terminal event stream failed'))
            return
          }
          if (source.readyState === 2) resetPtyStream()
        })
        source.onmessage = (event) => {
          if (!event.data) return
          let payload
          try { payload = JSON.parse(event.data) } catch { return }
          if (!payload || typeof payload.id !== 'string') return
          const listener = ptyStream.listeners.get(payload.id)
          if (!listener) return
          try { listener(payload) } catch {}
        }
      })
      return ptyStream.promise
    }

    function newPtySessionId() {
      try {
        if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
          return `pty-${globalThis.crypto.randomUUID()}`
        }
      } catch {}
      return `pty-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
    }

    async function ptyPost(route, body, timeout = 30_000) {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
      const timer = controller ? setTimeout(() => controller.abort(), timeout) : null
      try {
        const response = await fetch(route, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body ?? {}),
          signal: controller ? controller.signal : undefined,
        })
        let payload
        try { payload = await response.json() } catch {}
        if (!response.ok || !payload || payload.ok !== true) {
          throw new Error(payload?.error?.message ?? `HTTP ${response.status}`)
        }
        return payload.value
      } finally {
        if (timer) clearTimeout(timer)
      }
    }

    function clearPtySession(id) {
      if (!id) return
      void ptyPost(PTY_CLEAR_ROUTE, { id }, 15_000).catch(() => {})
    }

    async function copyTextToClipboard(text) {
      if (!text) return false
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
          return true
        }
      } catch {}
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        const copied = document.execCommand('copy')
        textarea.remove()
        return copied
      } catch {
        return false
      }
    }

    function decodeBase64(text) {
      const binary = atob(String(text ?? ''))
      const bytes = new Uint8Array(binary.length)
      for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
      return bytes
    }

    function decodeTextBase64(text) {
      return new TextDecoder().decode(decodeBase64(text))
    }

    function encodeTextBase64(text) {
      const bytes = new TextEncoder().encode(String(text ?? ''))
      let binary = ''
      for (let index = 0; index < bytes.length; index += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
      }
      return btoa(binary)
    }

    function TerminalPane({ model, host, sessionId, active, clearSignal, fontSize }) {
      const { t } = model
      const hostRef = React.useRef(host)
      hostRef.current = host
      const containerRef = React.useRef(null)
      const termRef = React.useRef(null)
      const fitRef = React.useRef(null)
      const searchAddonRef = React.useRef(null)
      const searchInputRef = React.useRef(null)
      const menuRef = React.useRef(null)
      const fontSizeRef = React.useRef(fontSize)
      fontSizeRef.current = fontSize
      const activeRef = React.useRef(active === true)
      const [status, setStatus] = React.useState('loading')
      const [searchOpen, setSearchOpen] = React.useState(false)
      const searchOpenRef = React.useRef(false)
      const [searchText, setSearchText] = React.useState('')
      const [searchCase, setSearchCase] = React.useState(false)
      const [trustingHostKey, setTrustingHostKey] = React.useState(false)
      const [menu, setMenu] = React.useState(null)
      const [message, setMessage] = React.useState('')
      const [retryToken, setRetryToken] = React.useState(0)
      const clearRequested = React.useRef(false)
      const reportStatus = model.setSessionState

      React.useEffect(() => {
        reportStatus?.(sessionId, status)
      }, [reportStatus, sessionId, status])
      const syncedRef = React.useRef(false)
      const clearEpochRef = React.useRef(0)

      React.useEffect(() => {
        activeRef.current = active === true
        if (!active || !termRef.current) return
        requestAnimationFrame(() => {
          if (!activeRef.current || !termRef.current) return
          try {
            fitRef.current?.fit()
            termRef.current.options.theme = terminalThemeFor(containerRef.current)
            termRef.current.focus()
          } catch {}
        })
      }, [active])

      React.useEffect(() => {
        if (!clearSignal) return
        clearEpochRef.current += 1
        // Only a clear issued before attach needs to survive into the attach
        // replay. A clear on a live, synced terminal is handled by the server
        // route directly and must not truncate the next attach replay.
        clearRequested.current = syncedRef.current !== true
        if (!termRef.current) return
        try {
          termRef.current.clear()
          termRef.current.write('\x1b[H\x1b[2J')
          termRef.current.focus()
        } catch {}
      }, [clearSignal])

      React.useEffect(() => {
        const term = termRef.current
        if (!term) return
        try {
          if (term.options.fontSize !== fontSize) {
            term.options.fontSize = fontSize
            fitRef.current?.fit()
          }
        } catch {}
      }, [fontSize])

      const openSearch = () => {
        if (!searchAddonRef.current) {
          try { model.notify?.(t('terminal.searchUnavailable'), 'error') } catch {}
          return
        }
        searchOpenRef.current = true
        setSearchOpen(true)
        requestAnimationFrame(() => searchInputRef.current?.focus())
      }

      const closeSearch = () => {
        searchOpenRef.current = false
        setSearchOpen(false)
        try { searchAddonRef.current?.clearDecorations?.() } catch {}
        try { termRef.current?.focus() } catch {}
      }

      const findInTerminal = (direction, caseSensitive = searchCase) => {
        const addon = searchAddonRef.current
        const text = searchText.trim()
        if (!addon) return
        try {
          if (text === '') addon.clearDecorations?.()
          else if (direction < 0) addon.findPrevious(text, { caseSensitive })
          else addon.findNext(text, { caseSensitive })
        } catch {}
      }

      const updateSearchText = (value) => {
        setSearchText(value)
        const addon = searchAddonRef.current
        if (!addon) return
        try {
          if (value.trim() === '') addon.clearDecorations?.()
          else addon.findNext(value.trim(), { caseSensitive: searchCase })
        } catch {}
      }

      const terminalMenuAction = (action) => {
        const term = termRef.current
        setMenu(null)
        if (!term) return
        const refocus = () => {
          requestAnimationFrame(() => {
            try { termRef.current?.focus() } catch {}
          })
        }
        if (action === 'selectAll') {
          try { term.selectAll() } catch {}
          refocus()
          return
        }
        if (action === 'clear') {
          // Route through App so clearRequested/clearEpoch and the host buffer
          // stay in sync with the session-bar clear button.
          if (typeof model.clearSession === 'function') model.clearSession(sessionId)
          else clearPtySession(sessionId)
          try { term.clear(); term.write('\x1b[H\x1b[2J') } catch {}
          refocus()
          return
        }
        if (action === 'copy') {
          const text = term.getSelection()
          void copyTextToClipboard(text).then((ok) => {
            if (!ok) {
              try { model.notify?.(t('terminal.copyFailed'), 'error') } catch {}
            }
            refocus()
          })
          return
        }
        if (action === 'paste') {
          if (!navigator.clipboard?.readText) {
            try { model.notify?.(t('terminal.pasteFailed'), 'error') } catch {}
            refocus()
            return
          }
          navigator.clipboard.readText().then((text) => {
            if (text) {
              try { term.paste(text) } catch {}
            }
            refocus()
          }).catch(() => {
            try { model.notify?.(t('terminal.pasteFailed'), 'error') } catch {}
            refocus()
          })
        }
      }

      React.useEffect(() => {
        if (!menu) return undefined
        const close = () => setMenu(null)
        const onKey = (event) => {
          if (event.key !== 'Escape') return
          event.preventDefault()
          event.stopPropagation()
          setMenu(null)
          try { termRef.current?.focus() } catch {}
        }
        const onDown = (event) => {
          if (menuRef.current && menuRef.current.contains(event.target)) return
          setMenu(null)
        }
        document.addEventListener('mousedown', onDown)
        document.addEventListener('keydown', onKey, true)
        requestAnimationFrame(() => {
          menuRef.current?.querySelector('button')?.focus()
        })
        return () => {
          document.removeEventListener('mousedown', onDown)
          document.removeEventListener('keydown', onKey, true)
        }
      }, [menu])

      React.useEffect(() => {
        const container = containerRef.current
        if (!container) return undefined
        let removed = false
        let term = null
        let fit = null
        let resizeObserver = null
        let sessionKey = null
        let unsubscribe = null
        let resizeTimer = null
        let finished = false
        let stopped = false
        let opened = false
        let inputChain = Promise.resolve()
        let streamLost = null
        let themeUnsub = null
        syncedRef.current = false
        setStatus('loading')
        setMessage('')

        const teardown = () => {
          stopped = true
          if (resizeTimer) {
            clearTimeout(resizeTimer)
            resizeTimer = null
          }
          if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
          }
          sessionKey = null
        }

        const failSession = (error) => {
          if (removed) return
          setStatus('error')
          setMessage(errorMessage(error))
          teardown()
        }

        const sendResize = () => {
          if (!sessionKey) return
          void ptyPost('/dsh-ssh-manage/pty/resize', {
            id: sessionKey,
            cols: term?.cols ?? 80,
            rows: term?.rows ?? 24,
          }, 15_000).catch(() => {})
        }

        streamLost = onPtyStreamLost(() => {
          if (removed) return
          setStatus('error')
          setMessage(t('terminal.backendHint'))
          teardown()
        })

        const start = async () => {
          const assets = await loadTerminalAssets()
          if (removed) return
          const Terminal = assets.Terminal
          const FitAddon = assets.FitAddon
          term = new Terminal({
            cursorBlink: true,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontSize: fontSizeRef.current ?? 13,
            lineHeight: 1.2,
            scrollback: 5000,
            allowProposedApi: true,
            rightClickSelectsWord: true,
            macOptionIsMeta: true,
            theme: terminalThemeFor(container),
          })
          fit = new FitAddon()
          term.loadAddon(fit)
          if (assets.SearchAddon) {
            const searchAddon = new assets.SearchAddon()
            term.loadAddon(searchAddon)
            searchAddonRef.current = searchAddon
          }
          term.open(container)
          termRef.current = term
          fitRef.current = fit
          term.attachCustomKeyEventHandler((event) => {
            if (event.type !== 'keydown') return true
            const meta = event.metaKey || event.ctrlKey
            if (meta && event.key.toLowerCase() === 'f') {
              event.preventDefault()
              openSearch()
              return false
            }
            if (meta && (event.key === '=' || event.key === '+')) {
              event.preventDefault()
              model.setTerminalFontSize((value) => Math.min(TERMINAL_FONT_MAX, value + 1))
              return false
            }
            if (meta && (event.key === '-' || event.key === '_')) {
              event.preventDefault()
              model.setTerminalFontSize((value) => Math.max(TERMINAL_FONT_MIN, value - 1))
              return false
            }
            if (event.key === 'Escape' && searchOpenRef.current) {
              event.preventDefault()
              closeSearch()
              return false
            }
            return true
          })
          try { fit.fit() } catch {}
          themeUnsub = subscribeTerminalTheme(() => {
            if (removed || !term) return
            try { term.options.theme = terminalThemeFor(container) } catch {}
          })
          term.onData((data) => {
            const id = sessionKey
            if (!id || !data || !opened) return
            for (let index = 0; index < data.length; index += 32_768) {
              let end = Math.min(index + 32_768, data.length)
              if (end < data.length) {
                const head = data.charCodeAt(end - 1)
                const tail = data.charCodeAt(end)
                if (head >= 0xd800 && head <= 0xdbff && tail >= 0xdc00 && tail <= 0xdfff) end -= 1
              }
              const chunk = data.slice(index, end)
              index = end - 32_768
              inputChain = inputChain
                .then(() => ptyPost('/dsh-ssh-manage/pty/input', { id, data: chunk }, 15_000))
                .catch((error) => {
                  if (!removed && !stopped && !finished && /not found/i.test(errorMessage(error))) failSession(error)
                })
            }
          })
          term.onResize(() => {
            if (resizeTimer) clearTimeout(resizeTimer)
            resizeTimer = setTimeout(sendResize, 120)
          })
          if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => {
              if (!activeRef.current) return
              const rect = container.getBoundingClientRect()
              if (rect.width < 20 || rect.height < 20) return
              try { fit.fit() } catch {}
            })
            resizeObserver.observe(container)
          }
          setStatus('connecting')
          try {
            await ensurePtyStream()
          } catch {
            if (!removed) {
              setStatus('error')
              setMessage(t('terminal.backendHint'))
            }
            return
          }
          if (removed) return
          sessionKey = sessionId
          const id = sessionKey
          let synced = false
          const pendingEvents = []

          const clearTerminal = () => {
            if (!term) return
            try {
              term.clear()
              term.write('\x1b[H\x1b[2J')
            } catch {}
          }

          let resyncing = false
          let resyncFailedAt = 0
          let resyncAttempts = 0
          let resyncGraceUntil = 0
          const resyncQueue = []
          let lastSeq = 0

          const applyOutput = (event) => {
            const seq = Number(event.seq)
            if (Number.isFinite(seq)) {
              if (seq <= lastSeq) return
              if (lastSeq > 0 && seq > lastSeq + 1) {
                if (Date.now() < resyncGraceUntil) {
                  lastSeq = seq
                } else {
                  resyncAttempts += 1
                  if (resyncAttempts > 3) {
                    resyncAttempts = 0
                    resyncGraceUntil = Date.now() + 5_000
                    lastSeq = seq
                  } else {
                    resyncQueue.push(event)
                    void resync()
                    return
                  }
                }
              } else {
                lastSeq = seq
                resyncAttempts = 0
              }
            }
            try { term.write(decodeBase64(event.data)) } catch {}
          }

          const resync = async () => {
            if (resyncing || stopped || finished || !sessionKey) return
            const clearEpoch = clearEpochRef.current
            resyncing = true
            try {
              const value = await ptyPost(PTY_ATTACH_ROUTE, {
                id: sessionKey,
                cols: term?.cols ?? 80,
                rows: term?.rows ?? 24,
              }, 15_000)
              if (removed || stopped || finished) {
                resyncing = false
                return
              }
              if (clearEpochRef.current !== clearEpoch) {
                clearRequested.current = false
                clearTerminal()
              } else if (value && value.output) {
                try {
                  term.reset()
                  term.write(decodeBase64(value.output))
                } catch {}
              }
              const seq = Number(value?.seq)
              if (Number.isFinite(seq)) lastSeq = seq
              resyncing = false
              for (const event of resyncQueue.splice(0)) {
                if (finished || stopped) break
                handleEvent(event)
              }
            } catch {
              resyncing = false
              resyncFailedAt = Date.now()
              resyncGraceUntil = Date.now() + 5_000
              try { model.notify?.(t('terminal.resyncFailed'), 'error') } catch {}
              for (const event of resyncQueue.splice(0)) {
                if (finished || stopped) break
                handleEvent(event)
              }
            }
          }

          const handleEvent = (event) => {
            if (resyncing) {
              resyncQueue.push(event)
              return
            }
            if (event.kind === 'output') {
              if (!synced) pendingEvents.push(event)
              else applyOutput(event)
            } else if (event.kind === 'clear') {
              if (!synced) pendingEvents.push(event)
              else clearTerminal()
            } else if (event.kind === 'exit') {
              if (!synced) {
                pendingEvents.push(event)
                return
              }
              finished = true
              setStatus('closed')
              setMessage(t('terminal.exited'))
              teardown()
            } else if (event.kind === 'error') {
              if (!synced) {
                pendingEvents.push(event)
                return
              }
              finished = true
              setStatus('error')
              setMessage(String(event.message ?? t('terminal.failed')))
              teardown()
            }
          }

          unsubscribe = subscribePty(id, (event) => {
            if (removed) return
            handleEvent(event)
          })
          let dims = { cols: 80, rows: 24 }
          try {
            const proposed = fit?.proposeDimensions?.()
            if (proposed && proposed.cols > 0 && proposed.rows > 0) dims = proposed
          } catch {}
          try {
            let value
            try {
              value = await ptyPost(PTY_ATTACH_ROUTE, { id, cols: dims.cols, rows: dims.rows }, 15_000)
            } catch {
              value = await ptyPost('/dsh-ssh-manage/pty/open', {
                id,
                host: hostRef.current.host,
                cols: dims.cols,
                rows: dims.rows,
              }, 40_000)
            }
            if (ptyClosedIds.has(id)) {
              closePtySession(id)
              return
            }
            if (removed || stopped || finished) return
            if (clearRequested.current) {
              clearRequested.current = false
              clearTerminal()
              clearPtySession(id)
            } else if (value && value.output) {
              try { term.write(decodeBase64(value.output)) } catch {}
            }
            const seq = Number(value?.seq)
            if (Number.isFinite(seq)) lastSeq = seq
            synced = true
            for (const event of pendingEvents.splice(0)) {
              if (finished || stopped) break
              handleEvent(event)
            }
            if (finished || stopped || removed) return
            syncedRef.current = true
            opened = true
            setStatus('ready')
            setMessage('')
            requestAnimationFrame(() => {
              if (!activeRef.current || !term) return
              try {
                fit.fit()
                term.focus()
              } catch {}
            })
          } catch (error) {
            if (!removed && !finished) failSession(error)
          }
        }

        start().catch((error) => {
          if (removed) return
          setStatus('error')
          setMessage(t('terminal.assetsError', { message: errorMessage(error) }))
          teardown()
        })

        return () => {
          removed = true
          if (themeUnsub) themeUnsub()
          if (streamLost) streamLost()
          if (resizeObserver) resizeObserver.disconnect()
          teardown()
          if (term) {
            try { term.dispose() } catch {}
          }
          termRef.current = null
          fitRef.current = null
          searchAddonRef.current = null
        }
      }, [sessionId, retryToken])

      const retry = () => setRetryToken((value) => value + 1)
      const hostKeyError = status === 'error' && message.includes(`Host key verification failed for "${host.host}"`) && /host key is not in known_hosts/i.test(message)
      const trustHostKey = async () => {
        if (trustingHostKey) return
        let confirmed = true
        try {
          confirmed = typeof window.confirm !== 'function' || window.confirm(t('terminal.trustHostKeyConfirm'))
        } catch {}
        if (!confirmed) return
        setTrustingHostKey(true)
        try {
          await callAction('host-key/trust', { host: host.host })
          try { model.notify?.(t('terminal.hostKeyTrusted'), 'success') } catch {}
          retry()
        } catch (failure) {
          try { model.notify?.(t('terminal.hostKeyTrustFailed', { message: errorMessage(failure) }), 'error') } catch {}
        } finally {
          setTrustingHostKey(false)
        }
      }
      const showOverlay = status !== 'ready'
      return h(
        'div',
        {
          className: 'ssh-terminalPane',
          onContextMenu: (event) => {
            if (!termRef.current || status !== 'ready') return
            if (event.target?.closest?.('.ssh-terminalSearch')) return
            event.preventDefault()
            const rect = event.currentTarget.getBoundingClientRect()
            setMenu({
              x: Math.max(0, Math.min(event.clientX - rect.left, rect.width - 170)),
              y: Math.max(0, Math.min(event.clientY - rect.top, rect.height - 150)),
            })
          },
          onMouseDown: () => setMenu(null),
        },
        h('div', { className: 'ssh-terminalHost', ref: containerRef }),
        searchOpen
          ? h(
              'div',
              {
                className: 'ssh-terminalSearch',
                onMouseDown: (event) => event.stopPropagation(),
              },
              h(IconSearch, { size: 13 }),
              h('input', {
                ref: searchInputRef,
                className: 'ssh-terminalSearchInput',
                value: searchText,
                placeholder: t('terminal.search'),
                'aria-label': t('terminal.search'),
                onChange: (event) => updateSearchText(event.target.value),
                onKeyDown: (event) => {
                  event.stopPropagation()
                  if (event.key === 'Escape') closeSearch()
                  else if (event.key === 'Enter') findInTerminal(event.shiftKey ? -1 : 1)
                },
              }),
              h('button', {
                type: 'button',
                className: cx('ssh-terminalSearchBtn', searchCase && 'on'),
                title: t('terminal.searchCase'),
                'aria-pressed': searchCase,
                onMouseDown: (event) => event.preventDefault(),
                onClick: () => {
                  const next = !searchCase
                  setSearchCase(next)
                  if (searchText.trim()) findInTerminal(1, next)
                },
              }, 'Aa'),
              h('button', { type: 'button', className: 'ssh-terminalSearchBtn', title: t('terminal.searchPrevious'), 'aria-label': t('terminal.searchPrevious'), onMouseDown: (event) => event.preventDefault(), onClick: () => findInTerminal(-1) }, h(IconChevronLeft, { size: 12 })),
              h('button', { type: 'button', className: 'ssh-terminalSearchBtn', title: t('terminal.searchNext'), 'aria-label': t('terminal.searchNext'), onMouseDown: (event) => event.preventDefault(), onClick: () => findInTerminal(1) }, h(IconChevronRight, { size: 12 })),
              h('button', { type: 'button', className: 'ssh-terminalSearchBtn', title: t('terminal.searchClose'), 'aria-label': t('terminal.searchClose'), onClick: closeSearch }, h(IconClose, { size: 12 })),
            )
          : null,
        menu
          ? h(
              'div',
              {
                ref: menuRef,
                className: 'ssh-terminalMenu',
                role: 'menu',
                'aria-label': t('terminal.menu.title'),
                style: { left: menu.x, top: menu.y },
                onMouseDown: (event) => event.stopPropagation(),
              },
              ['copy', 'paste', 'selectAll', 'clear'].map((action) =>
                h('button', {
                  key: action,
                  type: 'button',
                  role: 'menuitem',
                  className: 'ssh-terminalMenuItem',
                  onClick: () => terminalMenuAction(action),
                }, t(`terminal.menu.${action}`)),
              ),
            )
          : null,
        showOverlay
          ? h(
              'div',
              { className: 'ssh-terminalOverlay', role: 'status' },
              h(
                'div',
                { className: 'ssh-terminalOverlayIcon' },
                status === 'loading' || status === 'connecting'
                  ? h(Spinner, { size: 16 })
                  : h(IconAlert, { size: 16 }),
              ),
              h(
                'div',
                { className: 'ssh-terminalOverlayTitle' },
                status === 'loading'
                  ? t('terminal.loading')
                  : status === 'connecting'
                    ? t('terminal.connecting')
                    : status === 'error'
                      ? t('terminal.failed')
                      : t('terminal.disconnected'),
              ),
              message ? h('div', { className: 'ssh-terminalOverlayBody' }, message) : null,
              hostKeyError ? h('div', { className: 'ssh-terminalOverlayBody' }, t('terminal.hostKeyHint')) : null,
              status === 'error' && host.passwordConfigured !== true && !host.identityFile && model.snapshot?.agentAvailable !== true
                ? h('div', { className: 'ssh-terminalOverlayBody' }, t('terminal.passwordMissing'))
                : null,
              status === 'error' || status === 'closed'
                ? h(
                    'div',
                    { className: 'ssh-terminalOverlayActions' },
                    hostKeyError
                      ? h(
                          Button,
                          { size: 'sm', variant: 'primary', onClick: () => void trustHostKey(), disabled: trustingHostKey },
                          trustingHostKey ? h(Spinner, { size: 12 }) : h(IconLock, { size: 13 }),
                          t('terminal.trustHostKey'),
                        )
                      : null,
                    h(Button, { size: 'sm', variant: hostKeyError ? 'ghost' : 'primary', onClick: retry }, t('terminal.reconnect')),
                    h(
                      Button,
                      {
                        size: 'sm',
                        variant: 'ghost',
                        onClick: () => model.openDrawer(host, 'details'),
                      },
                      t('terminal.openDetails'),
                    ),
                  )
                : null,
            )
          : null,
      )
    }

    const SFTP_PATH_PREFIX = 'dsh-ssh-manage:sftp-path:'

    function readSftpPath(alias) {
      try {
        const stored = window.localStorage.getItem(SFTP_PATH_PREFIX + alias)
        return stored && stored.trim() ? stored : '.'
      } catch {
        return '.'
      }
    }

    function saveSftpPath(alias, target) {
      try {
        window.localStorage.setItem(SFTP_PATH_PREFIX + alias, target)
      } catch {}
    }

    function FilesView({ model, host }) {
      const { t, notify } = model
      const [path, setPath] = React.useState(() => readSftpPath(host.host))
      const [entries, setEntries] = React.useState([])
      const [loading, setLoading] = React.useState(true)
      const [error, setError] = React.useState('')
      const [uploading, setUploading] = React.useState(false)
      const [dialog, setDialog] = React.useState(null)
      const [dialogValue, setDialogValue] = React.useState('')
      const [dialogBusy, setDialogBusy] = React.useState(false)
      const [editor, setEditor] = React.useState(null)
      const [editorBusy, setEditorBusy] = React.useState(false)
      const [transfers, setTransfers] = React.useState([])
      const dialogBusyRef = React.useRef(false)
      const fileRef = React.useRef(null)

      const loadDirectory = React.useCallback(
        async (target, options = {}) => {
          const normalized = String(target ?? '').trim() || '.'
          setLoading(true)
          setError('')
          try {
            const value = await callAction('sftp/list', { host: host.host, path: normalized })
            setEntries(value.entries ?? [])
            setPath(normalized)
            if (options.remember !== false) saveSftpPath(host.host, normalized)
            return true
          } catch (failure) {
            setError(errorMessage(failure))
            return false
          } finally {
            setLoading(false)
          }
        },
        [host.host],
      )

      React.useEffect(() => {
        let cancelled = false
        void (async () => {
          const initial = readSftpPath(host.host)
          const ok = await loadDirectory(initial)
          if (!ok && initial !== '.' && !cancelled) await loadDirectory('.', { remember: false })
        })()
        return () => { cancelled = true }
      }, [host.host, loadDirectory])

      React.useEffect(() => {
        if (!dialog) return undefined
        const onKey = (event) => {
          if (event.key === 'Escape' && !dialogBusy) {
            event.preventDefault()
            event.stopPropagation()
            setDialog(null)
          }
        }
        document.addEventListener('keydown', onKey, true)
        return () => document.removeEventListener('keydown', onKey, true)
      }, [dialog, dialogBusy])

      React.useEffect(() => {
        if (!editor) return undefined
        const onKey = (event) => {
          if (event.key === 'Escape' && !editorBusy) {
            event.preventDefault()
            event.stopPropagation()
            closeEditor()
          }
        }
        document.addEventListener('keydown', onKey, true)
        return () => document.removeEventListener('keydown', onKey, true)
      }, [editor, editorBusy])

      const openDialog = (mode, entry = null) => {
        setDialog({ mode, entry })
        setDialogValue(mode === 'rename' && entry ? entry.name : '')
      }

      async function submitDialog() {
        if (!dialog || dialogBusyRef.current) return
        dialogBusyRef.current = true
        const name = dialogValue.trim()
        if (dialog.mode !== 'delete') {
          if (!name || name.includes('/') || name.includes('\\') || name === '.' || name === '..') {
            notify(t('drawer.files.invalidName'), 'error')
            return
          }
        }
        setDialogBusy(true)
        try {
          if (dialog.mode === 'mkdir') {
            await callAction('sftp/mkdir', { host: host.host, path: remoteJoin(path, name) })
            notify(t('drawer.files.created'), 'success')
          } else if (dialog.mode === 'rename') {
            if (name === dialog.entry.name) {
              setDialog(null)
              return
            }
            await callAction('sftp/rename', {
              host: host.host,
              path: remoteJoin(path, dialog.entry.name),
              newPath: remoteJoin(path, name),
            })
            notify(t('drawer.files.renamed'), 'success')
          } else if (dialog.mode === 'delete') {
            await callAction('sftp/delete', { host: host.host, path: remoteJoin(path, dialog.entry.name) })
            notify(t('drawer.files.deleted'), 'success')
          }
          setDialog(null)
          await loadDirectory(path)
        } catch (failure) {
          notify(t('state.error', { message: errorMessage(failure) }), 'error')
        } finally {
          dialogBusyRef.current = false
          setDialogBusy(false)
        }
      }

      const queueTransfer = (name, kind) => {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
        setTransfers((prev) => [...prev.slice(-4), { id, name, kind, status: 'running', error: '' }])
        return id
      }
      const finishTransfer = (id, error = '') => {
        setTransfers((prev) => prev.map((item) => item.id === id ? { ...item, status: error ? 'error' : 'done', error } : item))
      }

      async function openRemoteEditor(entry) {
        const remote = remoteJoin(path, entry.name)
        const id = queueTransfer(entry.name, 'read')
        try {
          const value = await callAction('sftp/download', { host: host.host, path: remote })
          const content = decodeTextBase64(value.contentBase64)
          if (content.includes('\u0000')) {
            notify(t('drawer.files.editBinary'), 'error')
            finishTransfer(id, 'binary')
            return
          }
          setEditor({ entry, path: remote, content, original: content })
          finishTransfer(id)
        } catch (failure) {
          finishTransfer(id, errorMessage(failure))
          notify(t('state.error', { message: errorMessage(failure) }), 'error')
        }
      }

      const closeEditor = () => {
        if (editorBusy) return
        if (editor && editor.content !== editor.original) {
          let discard = false
          try { discard = typeof window.confirm !== 'function' || window.confirm(t('drawer.files.editDiscard')) } catch {}
          if (!discard) return
        }
        setEditor(null)
      }

      async function saveEditor() {
        if (!editor || editorBusy) return
        setEditorBusy(true)
        try {
          await callAction('sftp/upload', {
            host: host.host,
            path: editor.path,
            contentBase64: encodeTextBase64(editor.content),
          })
          notify(t('drawer.files.edited'), 'success')
          setEditor(null)
          await loadDirectory(path)
        } catch (failure) {
          notify(t('state.error', { message: errorMessage(failure) }), 'error')
        } finally {
          setEditorBusy(false)
        }
      }

      async function downloadEntry(entry) {
        const remote = remoteJoin(path, entry.name)
        const id = queueTransfer(entry.name, 'download')
        try {
          const value = await withPending(`download:${remote}`, () =>
            callAction('sftp/download', { host: host.host, path: remote }),
          )
          if (!value) {
            finishTransfer(id, 'cancelled')
            return
          }
          downloadBase64(entry.name, value.contentBase64)
          notify(t('state.downloaded'), 'success')
          finishTransfer(id)
        } catch (failure) {
          finishTransfer(id, errorMessage(failure))
          notify(t('state.error', { message: errorMessage(failure) }), 'error')
        }
      }

      async function onPick(event) {
        const files = [...(event.target.files ?? [])]
        event.target.value = ''
        if (files.length === 0) return
        setUploading(true)
        try {
          for (const file of files) {
            if (file.size > 10 * 1024 * 1024) {
              notify(t('state.fileTooLarge'), 'error')
              continue
            }
            if (entries.some((entry) => entry.name === file.name)) {
              let overwrite = false
              try { overwrite = typeof window.confirm !== 'function' || window.confirm(t('drawer.files.overwrite', { name: file.name })) } catch {}
              if (!overwrite) continue
            }
            const id = queueTransfer(file.name, 'upload')
            try {
              const contentBase64 = await readFileBase64(file)
              await callAction('sftp/upload', {
                host: host.host,
                path: remoteJoin(path, file.name),
                contentBase64,
              })
              notify(t('state.uploaded'), 'success')
              finishTransfer(id)
            } catch (failure) {
              finishTransfer(id, errorMessage(failure))
              notify(t('state.error', { message: errorMessage(failure) }), 'error')
            }
          }
          await loadDirectory(path)
        } finally {
          setUploading(false)
        }
      }

      return h(
        'div',
        { className: 'ssh-files' },
        h(
          'div',
          { className: 'ssh-filesBar' },
          h(
            IconButton,
            { title: t('drawer.files.up'), onClick: () => void loadDirectory(parentPath(path)), disabled: loading },
            h(IconArrowUp, { size: 15 }),
          ),
          h(
            'span',
            { className: 'ssh-filesPath' },
            h(TextInput, {
              mono: true,
              value: path,
              onChange: setPath,
              placeholder: t('drawer.files.path'),
              onKeyDown: (event) => {
                if (event.key === 'Enter') void loadDirectory(path)
              },
            }),
          ),
          h(Button, { size: 'sm', onClick: () => void loadDirectory(path), disabled: loading }, t('common.read')),
          h(
            IconButton,
            { title: t('common.refresh'), onClick: () => void loadDirectory(path), disabled: loading },
            loading ? h(Spinner, { size: 13 }) : h(IconRefresh, { size: 15 }),
          ),
          h(
            Button,
            { size: 'sm', variant: 'ghost', onClick: () => openDialog('mkdir'), disabled: loading || uploading },
            h(IconPlus, { size: 13 }),
            t('drawer.files.mkdir'),
          ),
          h(
            Button,
            { size: 'sm', onClick: () => fileRef.current && fileRef.current.click(), disabled: uploading },
            uploading ? h(Spinner, { size: 12 }) : h(IconUpload, { size: 13 }),
            uploading ? t('drawer.files.uploading') : t('common.upload'),
          ),
          h('input', { ref: fileRef, type: 'file', multiple: true, className: 'ssh-srOnly', onChange: (event) => void onPick(event) }),
        ),
        transfers.length
          ? h(
              'div',
              { className: 'ssh-transferList' },
              transfers.slice(-5).map((item) =>
                h(
                  'div',
                  { key: item.id, className: cx('ssh-transferRow', item.status) },
                  h('span', { className: 'ssh-transferName', title: item.name }, item.name),
                  h('span', { className: 'ssh-transferKind' }, item.kind),
                  h('span', { className: 'ssh-transferStatus' }, item.status === 'running' ? t('drawer.files.transferRunning') : item.status === 'done' ? t('drawer.files.transferDone') : item.status),
                ),
              ),
            )
          : null,
        error
          ? h('div', { className: 'ssh-fileError' }, h(IconAlert, { size: 13 }), h('span', null, error))
          : null,
        editor
          ? h(
              'div',
              {
                className: 'ssh-fileDialogScrim',
                onMouseDown: () => closeEditor(),
              },
              h(
                'div',
                {
                  className: 'ssh-fileDialog ssh-remoteEditor',
                  role: 'dialog',
                  'aria-modal': 'true',
                  'aria-label': editor.path,
                  onMouseDown: (event) => event.stopPropagation(),
                },
                h('div', { className: 'ssh-fileDialogTitle' }, editor.path),
                h(TextArea, {
                  value: editor.content,
                  onChange: (value) => setEditor((prev) => prev ? { ...prev, content: value } : prev),
                  rows: 18,
                  mono: true,
                  spellCheck: false,
                }),
                h('div', { className: 'ssh-sectionHint' }, t('drawer.files.editHint')),
                h(
                  'div',
                  { className: 'ssh-fileDialogActions' },
                  h(Button, { variant: 'ghost', size: 'sm', onClick: closeEditor, disabled: editorBusy }, t('common.cancel')),
                  h(
                    Button,
                    { variant: 'primary', size: 'sm', onClick: () => void saveEditor(), disabled: editorBusy || editor.content === editor.original },
                    editorBusy ? h(Spinner, { size: 12 }) : null,
                    t('common.save'),
                  ),
                ),
              ),
            )
          : null,
        dialog
          ? h(
              'div',
              {
                className: 'ssh-fileDialogScrim',
                onMouseDown: () => {
                  if (!dialogBusy) setDialog(null)
                },
              },
              h(
                'div',
                {
                  className: 'ssh-fileDialog',
                  role: 'dialog',
                  'aria-modal': 'true',
                  'aria-label': dialog.mode === 'mkdir'
                    ? t('drawer.files.mkdirTitle')
                    : dialog.mode === 'rename'
                      ? t('drawer.files.renameTitle')
                      : t('drawer.files.deleteTitle'),
                  onMouseDown: (event) => event.stopPropagation(),
                },
                h(
                  'div',
                  { className: 'ssh-fileDialogTitle' },
                  dialog.mode === 'mkdir'
                    ? t('drawer.files.mkdirTitle')
                    : dialog.mode === 'rename'
                      ? t('drawer.files.renameTitle')
                      : t('drawer.files.deleteTitle'),
                ),
                dialog.mode === 'delete'
                  ? h('div', { className: 'ssh-fileDialogBody' }, t('drawer.files.deleteConfirm', { name: dialog.entry?.name ?? '' }))
                  : h(TextInput, {
                      value: dialogValue,
                      autoFocus: true,
                      placeholder: t('drawer.files.name'),
                      onChange: setDialogValue,
                      onKeyDown: (event) => {
                        if (event.key === 'Enter') void submitDialog()
                        else if (event.key === 'Escape' && !dialogBusy) setDialog(null)
                      },
                    }),
                h(
                  'div',
                  { className: 'ssh-fileDialogActions' },
                  h(Button, { variant: 'ghost', size: 'sm', onClick: () => setDialog(null), disabled: dialogBusy }, t('common.cancel')),
                  h(
                    Button,
                    {
                      variant: dialog.mode === 'delete' ? 'dangerSolid' : 'primary',
                      size: 'sm',
                      autoFocus: dialog.mode === 'delete',
                      onClick: () => void submitDialog(),
                      disabled: dialogBusy,
                    },
                    dialogBusy ? h(Spinner, { size: 12 }) : null,
                    dialog.mode === 'delete' ? t('common.delete') : t('common.create'),
                  ),
                ),
              ),
            )
          : null,
        h(
          'div',
          { className: 'ssh-fileList' },
          loading && entries.length === 0
            ? h('div', { className: 'ssh-fileEmpty' }, t('state.loading'))
            : entries.length === 0
              ? h('div', { className: 'ssh-fileEmpty' }, t('drawer.files.empty'))
              : entries.map((entry) =>
                  h(
                    'div',
                    { key: entry.name, className: 'ssh-fileRow' },
                    h('span', { className: 'ssh-fileIcon' }, entry.directory ? h(IconFolder, { size: 14 }) : h(IconFile, { size: 14 })),
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'ssh-fileName',
                        title: entry.name,
                        disabled: !entry.directory,
                        onClick: () => {
                          if (entry.directory) void loadDirectory(remoteJoin(path, entry.name))
                        },
                      },
                      entry.name,
                    ),
                    h('span', { className: 'ssh-fileSize' }, entry.directory ? t('drawer.files.dir') : formatBytes(entry.size)),
                    h(
                      'div',
                      { className: 'ssh-fileActions' },
                      entry.directory
                        ? null
                        : h(
                            IconButton,
                            { title: t('common.download'), onClick: () => void downloadEntry(entry) },
                            h(IconDownload, { size: 14 }),
                          ),
                      entry.directory || entry.size > 1024 * 1024
                        ? null
                        : h(
                            IconButton,
                            { title: t('drawer.files.edit'), onClick: () => void openRemoteEditor(entry) },
                            h(IconFile, { size: 14 }),
                          ),
                      h(
                        IconButton,
                        { title: t('drawer.files.rename'), onClick: () => openDialog('rename', entry) },
                        h(IconEdit, { size: 14 }),
                      ),
                      h(
                        IconButton,
                        { title: t('drawer.files.delete'), onClick: () => openDialog('delete', entry) },
                        h(IconTrash, { size: 14 }),
                      ),
                    ),
                  ),
                ),
        ),
      )
    }

    function KV({ label, value, mono, children }) {
      return h(
        'div',
        { className: 'ssh-kv' },
        h('span', { className: 'ssh-kvLabel' }, label),
        h('span', { className: cx('ssh-kvValue', mono && 'mono') }, children ?? value ?? '—'),
      )
    }

    function DetailsView({ model, host, onEdit, onDelete }) {
      const { t, notify, localeId, isPending, testHost, inspectHost, savePassword, removePassword } = model
      const [password, setPassword] = React.useState('')
      const [saving, setSaving] = React.useState(false)
      const [tunnelType, setTunnelType] = React.useState('local')
      const [localPort, setLocalPort] = React.useState('')
      const [localHost, setLocalHost] = React.useState('127.0.0.1')
      const [remoteHost, setRemoteHost] = React.useState('127.0.0.1')
      const [remotePort, setRemotePort] = React.useState('')
      const [startingTunnel, setStartingTunnel] = React.useState(false)
      const [snippetName, setSnippetName] = React.useState('')
      const [snippetCommand, setSnippetCommand] = React.useState('')
      const [snippetOutput, setSnippetOutput] = React.useState(null)
      const [runningSnippet, setRunningSnippet] = React.useState('')
      const [revealedPassword, setRevealedPassword] = React.useState('')
      const [revealing, setRevealing] = React.useState(false)
      const revealTimer = React.useRef(null)
      const credential = credentialInfo(host, t)
      const testing = isPending(`test:${host.host}`)
      const inspecting = isPending(`inspect:${host.host}`)
      const hasSystem = Boolean(host.system || host.cpuCores || host.memoryGB || host.diskGB || host.latencyMs)

      const hideRevealed = () => {
        if (revealTimer.current) {
          clearTimeout(revealTimer.current)
          revealTimer.current = null
        }
        setRevealedPassword('')
      }

      React.useEffect(() => {
        hideRevealed()
        return () => {
          if (revealTimer.current) clearTimeout(revealTimer.current)
        }
      }, [host.host])

      async function toggleReveal() {
        if (revealedPassword) {
          hideRevealed()
          return
        }
        if (revealing || host.passwordConfigured !== true) return
        setRevealing(true)
        try {
          const value = await callAction('credential/reveal', { host: host.host })
          const revealed = String(value?.password ?? '')
          if (!revealed) return
          setRevealedPassword(revealed)
          if (revealTimer.current) clearTimeout(revealTimer.current)
          revealTimer.current = setTimeout(() => {
            revealTimer.current = null
            setRevealedPassword('')
          }, 30_000)
        } catch (failure) {
          notify(t('drawer.details.revealFailed', { message: errorMessage(failure) }), 'error')
        } finally {
          setRevealing(false)
        }
      }

      async function copyRevealed() {
        if (!revealedPassword) return
        const copied = await copyTextToClipboard(revealedPassword)
        notify(copied ? t('drawer.details.passwordCopied') : t('drawer.details.revealFailed', { message: t('terminal.copyFailed') }), copied ? 'success' : 'error')
      }

      async function submitPassword() {
        if (!password || saving) return
        setSaving(true)
        const ok = await savePassword(host, password)
        setSaving(false)
        if (ok) {
          setPassword('')
          hideRevealed()
        }
      }

      const activeTunnels = (model.snapshot?.tunnels ?? []).filter((tunnel) => tunnel.host === host.host)
      const snippets = (model.snapshot?.snippets ?? []).filter((snippet) => !snippet.host || snippet.host === host.host)

      async function saveSnippet() {
        if (!snippetName.trim() || !snippetCommand.trim()) return
        try {
          await callAction('snippet/save', { snippet: { name: snippetName.trim(), command: snippetCommand.trim(), host: host.host } })
          setSnippetName('')
          setSnippetCommand('')
          await model.load({ quiet: true })
        } catch (failure) { notify(t('state.error', { message: errorMessage(failure) }), 'error') }
      }

      async function runSnippet(snippet) {
        if (runningSnippet) return
        setRunningSnippet(snippet.id)
        try {
          const value = await callAction('snippet/run', { id: snippet.id, host: host.host })
          setSnippetOutput({ name: snippet.name, text: [value.stdout, value.stderr].filter(Boolean).join('\n') || `exit ${value.code}`, code: value.code })
        } catch (failure) { notify(t('state.error', { message: errorMessage(failure) }), 'error') }
        finally { setRunningSnippet('') }
      }

      async function startForward() {
        if (startingTunnel) return
        setStartingTunnel(true)
        try {
          await callAction('tunnel/start', {
            host: host.host,
            type: tunnelType,
            localPort: localPort.trim() || '0',
            ...(tunnelType === 'local'
              ? { remoteHost: remoteHost.trim() || '127.0.0.1', remotePort: remotePort.trim() }
              : tunnelType === 'remote'
                ? { localHost: localHost.trim() || '127.0.0.1', remotePort: remotePort.trim() }
                : {}),
          })
          notify(t('drawer.tunnels.started'), 'success')
          await model.load({ quiet: true })
        } catch (failure) {
          notify(t('state.error', { message: errorMessage(failure) }), 'error')
        } finally {
          setStartingTunnel(false)
        }
      }

      async function stopForward(id) {
        try {
          await callAction('tunnel/stop', { id })
          notify(t('drawer.tunnels.stopped'), 'success')
          await model.load({ quiet: true })
        } catch (failure) {
          notify(t('state.error', { message: errorMessage(failure) }), 'error')
        }
      }

      return h(
        'div',
        { className: 'ssh-details' },
        h(
          'section',
          { className: 'ssh-section' },
          h(
            'div',
            { className: 'ssh-sectionHead' },
            h('h3', { className: 'ssh-sectionTitle' }, t('drawer.details.connection')),
            h(
              'div',
              { className: 'ssh-sectionActions' },
              h(
                Button,
                { size: 'sm', variant: 'ghost', onClick: () => void testHost(host), disabled: testing },
                testing ? h(Spinner, { size: 12 }) : h(IconCheckCircle, { size: 13 }),
                testing ? t('drawer.details.testing') : t('drawer.details.test'),
              ),
            ),
          ),
          h(
            'div',
            { className: 'ssh-kvGrid' },
            h(KV, { label: t('drawer.details.alias'), value: host.host, mono: true }),
            h(KV, { label: t('drawer.details.address'), value: host.hostname || '—', mono: true }),
            h(KV, { label: t('drawer.details.user'), value: host.user || '—', mono: true }),
            h(KV, { label: t('drawer.details.port'), value: host.port || '22', mono: true }),
            host.proxyJump ? h(KV, { label: t('editor.proxyJump'), value: host.proxyJump, mono: true }) : null,
          ),
        ),
        h(
          'section',
          { className: 'ssh-section' },
          h(
            'div',
            { className: 'ssh-sectionHead' },
            h('h3', { className: 'ssh-sectionTitle' }, t('drawer.details.credentials')),
            h(Badge, { tone: credential.tone }, credential.label),
          ),
          h(
            'div',
            { className: 'ssh-credentialReveal' },
            h(
              Button,
              {
                size: 'sm',
                variant: 'ghost',
                onClick: () => void toggleReveal(),
                disabled: revealing || (!host.passwordConfigured && !revealedPassword),
              },
              revealing ? h(Spinner, { size: 12 }) : revealedPassword ? h(IconEyeOff, { size: 13 }) : h(IconEye, { size: 13 }),
              revealedPassword ? t('drawer.details.hide') : t('drawer.details.reveal'),
            ),
            revealedPassword
              ? h('code', { className: 'ssh-revealValue' }, revealedPassword)
              : null,
            revealedPassword
              ? h(IconButton, { title: t('drawer.details.copyPassword'), onClick: () => void copyRevealed() }, h(IconCopy, { size: 14 }))
              : null,
          ),
          revealedPassword
            ? h('div', { className: 'ssh-sectionHint ssh-revealWarning' }, h(IconEye, { size: 12 }), h('span', null, t('drawer.details.revealWarning')))
            : null,
          h(
            'div',
            { className: 'ssh-credentialRow' },
            h(TextInput, {
              type: 'password',
              value: password,
              onChange: setPassword,
              placeholder: t('drawer.details.password'),
              onKeyDown: (event) => {
                if (event.key === 'Enter') void submitPassword()
              },
            }),
            h(
              Button,
              { size: 'sm', variant: 'primary', onClick: () => void submitPassword(), disabled: saving || !password },
              saving ? h(Spinner, { size: 12 }) : null,
              t('drawer.details.savePassword'),
            ),
            host.passwordConfigured
              ? h(
                  Button,
                  { size: 'sm', variant: 'dangerGhost', onClick: () => { hideRevealed(); void removePassword(host) } },
                  t('drawer.details.clearPassword'),
                )
              : null,
          ),
          h('div', { className: 'ssh-sectionHint' }, t('drawer.details.passwordHint')),
        ),
        h(
          'section',
          { className: 'ssh-section' },
          h(
            'div',
            { className: 'ssh-sectionHead' },
            h('h3', { className: 'ssh-sectionTitle' }, t('drawer.snippets.title')),
            h(Badge, { tone: snippets.length ? 'ok' : 'muted' }, String(snippets.length)),
          ),
          h('p', { className: 'ssh-sectionHint' }, t('drawer.snippets.hint')),
          snippets.length
            ? h('div', { className: 'ssh-snippetList' }, snippets.map((snippet) =>
                h('div', { key: snippet.id, className: 'ssh-snippetRow' },
                  h('span', { className: 'ssh-snippetName', title: snippet.command }, snippet.name),
                  h('code', { className: 'ssh-snippetCommand' }, snippet.command),
                  h(IconButton, { title: t('drawer.snippets.run'), onClick: () => void runSnippet(snippet), disabled: Boolean(runningSnippet) },
                    runningSnippet === snippet.id ? h(Spinner, { size: 12 }) : h(IconPlay, { size: 13 })),
                  h(IconButton, { title: t('common.delete'), onClick: async () => { try { await callAction('snippet/delete', { id: snippet.id }); await model.load({ quiet: true }) } catch (failure) { notify(t('state.error', { message: errorMessage(failure) }), 'error') } } }, h(IconTrash, { size: 13 })),
                ),
              ))
            : null,
          h('div', { className: 'ssh-snippetForm' },
            h(TextInput, { value: snippetName, onChange: setSnippetName, placeholder: t('drawer.snippets.name') }),
            h(TextInput, { value: snippetCommand, onChange: setSnippetCommand, placeholder: t('drawer.snippets.command'), mono: true }),
            h(Button, { size: 'sm', variant: 'ghost', onClick: () => void saveSnippet(), disabled: !snippetName.trim() || !snippetCommand.trim() }, h(IconPlus, { size: 12 }), t('drawer.snippets.add')),
          ),
          snippetOutput
            ? h('div', { className: 'ssh-snippetOutput' },
                h('div', { className: 'ssh-snippetOutputHead' }, h('span', null, snippetOutput.name), h(IconButton, { title: t('common.close'), onClick: () => setSnippetOutput(null) }, h(IconClose, { size: 12 }))),
                h('pre', null, snippetOutput.text),
              )
            : null,
        ),
        h(
          'section',
          { className: 'ssh-section' },
          h(
            'div',
            { className: 'ssh-sectionHead' },
            h('h3', { className: 'ssh-sectionTitle' }, t('drawer.tunnels.title')),
            h(Badge, { tone: activeTunnels.length ? 'ok' : 'muted' }, t('drawer.tunnels.count', { count: activeTunnels.length })),
          ),
          h(
            'div',
            { className: 'ssh-tunnelTypes', role: 'tablist' },
            h('button', { type: 'button', className: cx('ssh-tunnelType', tunnelType === 'local' && 'active'), onClick: () => setTunnelType('local') }, t('drawer.tunnels.local')),
            h('button', { type: 'button', className: cx('ssh-tunnelType', tunnelType === 'socks' && 'active'), onClick: () => setTunnelType('socks') }, t('drawer.tunnels.socks')),
            h('button', { type: 'button', className: cx('ssh-tunnelType', tunnelType === 'remote' && 'active'), onClick: () => setTunnelType('remote') }, t('drawer.tunnels.remote')),
          ),
          h(
            'div',
            { className: 'ssh-tunnelForm' },
            h(TextInput, { value: localPort, onChange: setLocalPort, placeholder: t('drawer.tunnels.localPort'), mono: true }),
            tunnelType === 'local'
              ? [
                  h('span', { key: 'arrow', className: 'ssh-tunnelArrow' }, '→'),
                  h(TextInput, { key: 'host', value: remoteHost, onChange: setRemoteHost, placeholder: t('drawer.tunnels.remoteHost'), mono: true }),
                  h(TextInput, { key: 'port', value: remotePort, onChange: setRemotePort, placeholder: t('drawer.tunnels.remotePort'), mono: true }),
                ]
              : tunnelType === 'remote'
                ? [
                    h(TextInput, { key: 'rport', value: remotePort, onChange: setRemotePort, placeholder: t('drawer.tunnels.remotePort'), mono: true }),
                    h('span', { key: 'arrow', className: 'ssh-tunnelArrow' }, '→'),
                    h(TextInput, { key: 'lhost', value: localHost, onChange: setLocalHost, placeholder: t('drawer.tunnels.localHost'), mono: true }),
                    h(TextInput, { key: 'lport', value: localPort, onChange: setLocalPort, placeholder: t('drawer.tunnels.localPort'), mono: true }),
                  ]
                : null,
            h(
              Button,
              {
                size: 'sm',
                variant: 'primary',
                onClick: () => void startForward(),
                disabled: startingTunnel || (tunnelType !== 'socks' && !remotePort.trim()) || (tunnelType === 'remote' && !localPort.trim()),
              },
              startingTunnel ? h(Spinner, { size: 12 }) : h(IconPlay, { size: 12 }),
              t('drawer.tunnels.start'),
            ),
          ),
          activeTunnels.length
            ? h(
                'div',
                { className: 'ssh-tunnelList' },
                activeTunnels.map((tunnel) =>
                  h(
                    'div',
                    { key: tunnel.id, className: 'ssh-tunnelRow' },
                    h('code', null, tunnel.type === 'socks'
                      ? `SOCKS5 127.0.0.1:${tunnel.localPort}`
                      : tunnel.type === 'remote'
                        ? `远程 :${tunnel.remotePort} → ${tunnel.localHost}:${tunnel.localPort}`
                        : `127.0.0.1:${tunnel.localPort} → ${tunnel.remoteHost}:${tunnel.remotePort}`),
                    h(IconButton, { title: t('drawer.tunnels.stop'), onClick: () => void stopForward(tunnel.id) }, h(IconClose, { size: 13 })),
                  ),
                ),
              )
            : null,
        ),
        h(
          'section',
          { className: 'ssh-section' },
          h(
            'div',
            { className: 'ssh-sectionHead' },
            h('h3', { className: 'ssh-sectionTitle' }, t('drawer.details.system')),
            h(
              'div',
              { className: 'ssh-sectionActions' },
              h(
                Button,
                { size: 'sm', variant: 'ghost', onClick: () => void inspectHost(host), disabled: inspecting },
                inspecting ? h(Spinner, { size: 12 }) : h(IconServer, { size: 13 }),
                inspecting ? t('drawer.details.detecting') : t('drawer.details.detect'),
              ),
            ),
          ),
          hasSystem
            ? h(
                'div',
                { className: 'ssh-kvGrid' },
                h(KV, { label: t('drawer.details.systemLabel'), value: host.system || '—' }),
                h(KV, { label: t('drawer.details.cores'), value: host.cpuCores ? String(host.cpuCores) : '—' }),
                h(KV, { label: t('drawer.details.memory'), value: host.memoryGB ? `${host.memoryGB} GB` : '—' }),
                h(KV, { label: t('drawer.details.disk'), value: host.diskGB ? `${host.diskGB} GB` : '—' }),
                h(KV, { label: t('drawer.details.latency'), value: host.latencyMs ? `${host.latencyMs} ms` : '—' }),
                h(KV, { label: t('drawer.details.checkedAt'), value: formatDateTime(host.checkedAt, localeId) }),
              )
            : h('div', { className: 'ssh-sectionHint' }, t('drawer.details.noInfo')),
        ),
        h(
          'section',
          { className: 'ssh-section' },
          h(
            'div',
            { className: 'ssh-sectionHead' },
            h('h3', { className: 'ssh-sectionTitle' }, t('editor.group')),
            h(
              'div',
              { className: 'ssh-sectionActions' },
              h(Button, { size: 'sm', variant: 'ghost', onClick: onEdit }, h(IconEdit, { size: 13 }), t('drawer.details.edit')),
            ),
          ),
          h(KV, { label: t('drawer.details.group'), value: host.group || t('tree.ungrouped') }),
          h(
            'div',
            { className: 'ssh-kv' },
            h('span', { className: 'ssh-kvLabel' }, t('drawer.details.tags')),
            h(
              'span',
              { className: 'ssh-kvValue ssh-tags' },
              Array.isArray(host.tags) && host.tags.length
                ? host.tags.map((tag) => h(Chip, { key: tag }, tag))
                : '—',
            ),
          ),
          h(KV, { label: t('drawer.details.note'), value: host.note || '—' }),
        ),
        h(
          'div',
          { className: 'ssh-detailsActions' },
          h(Button, { variant: 'dangerGhost', onClick: onDelete }, h(IconTrash, { size: 14 }), t('drawer.details.delete')),
        ),
      )
    }

    // ---------------------------------------------------------------------
    // Host editor
    // ---------------------------------------------------------------------

    function EditorDialog({ model, state }) {
      const { t, hosts, saveEditor, requestDelete, isPending } = model
      const original = state.original ? hosts.find((host) => host.host === state.original) ?? null : null
      const [draft, setDraft] = React.useState(state.draft)
      const [password, setPassword] = React.useState('')
      const [passwordError, setPasswordError] = React.useState('')
      const [formError, setFormError] = React.useState('')
      const [aliasSuggestion, setAliasSuggestion] = React.useState('')
      const [groupMenuOpen, setGroupMenuOpen] = React.useState(false)
      const groupMenuRef = React.useRef(null)
      const groupOptions = (model.allGroups ?? []).filter((group) => group.key !== '').map((group) => group.key)
      const busy = isPending('editor')
      const agentAvailable = model.snapshot?.agentAvailable === true
      const passwordRequired = (!original || original.passwordConfigured !== true) && !draft.identityFile.trim() && !agentAvailable

      function update(field, value) {
        setDraft((prev) => ({ ...prev, [field]: value }))
      }

      const dirty = password !== '' || JSON.stringify(draft) !== JSON.stringify(state.draft)
      const requestClose = () => {
        if (busy) return
        if (!dirty) {
          model.setEditor(null)
          return
        }
        let discard = true
        try {
          discard = typeof window.confirm !== 'function' || window.confirm(t('editor.discardChanges'))
        } catch {}
        if (discard) model.setEditor(null)
      }

      React.useEffect(() => {
        const guard = () => requestClose()
        model.editorCloseGuard.current = guard
        return () => {
          if (model.editorCloseGuard.current === guard) model.editorCloseGuard.current = null
        }
      })

      React.useEffect(() => {
        if (!groupMenuOpen) return undefined
        const close = (event) => {
          if (groupMenuRef.current && groupMenuRef.current.contains(event.target)) return
          setGroupMenuOpen(false)
        }
        const onKey = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            setGroupMenuOpen(false)
          }
        }
        document.addEventListener('mousedown', close)
        document.addEventListener('keydown', onKey, true)
        return () => {
          document.removeEventListener('mousedown', close)
          document.removeEventListener('keydown', onKey, true)
        }
      }, [groupMenuOpen])

      async function submit() {
        const alias = draft.host.trim()
        const hostname = draft.hostname.trim()
        if (!alias || !hostname) {
          setFormError(t('editor.required'))
          return
        }
        if (!ALIAS_PATTERN.test(alias)) {
          setFormError(t('editor.invalidAlias'))
          return
        }
        if (passwordRequired && password.trim() === '') {
          setPasswordError(t('editor.passwordRequiredError'))
          setFormError('')
          return
        }
        const collision = hosts.find((host) =>
          host.host !== state.original
          && (host.host === alias || (Array.isArray(host.aliases) && host.aliases.includes(alias))),
        )
        if (collision) {
          const groupPart = draft.group.trim().replace(/[^A-Za-z0-9_.@-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 20)
          let suggested = groupPart ? `${alias}-${groupPart}` : `${alias}-2`
          let counter = 2
          while (hosts.some((host) => host.host === suggested || (Array.isArray(host.aliases) && host.aliases.includes(suggested)))) {
            suggested = `${alias}-${counter}`
            counter += 1
          }
          suggested = suggested.slice(0, 64)
          setAliasSuggestion(suggested)
          setFormError(t('editor.aliasExists', {
            alias,
            host: hostName(collision),
            group: collision.group || t('tree.ungrouped'),
          }))
          return
        }
        setAliasSuggestion('')
        setPasswordError('')
        setFormError('')
        const saved = await saveEditor({
          original: state.original,
          host: {
            host: alias,
            hostname,
            user: draft.user.trim(),
            port: draft.port.trim(),
            identityFile: draft.identityFile.trim(),
            proxyJump: draft.proxyJump.trim(),
            forwardAgent: draft.forwardAgent === true,
          },
          metadata: {
            group: draft.group.trim(),
            label: draft.label.trim(),
            note: draft.note.trim(),
            tags: parseTags(draft.tags),
            favorite: draft.favorite === true,
          },
          password: password.trim() !== '' ? password : '',
        })
        if (!saved) return
      }

      const footer = [
        original
          ? h(
              Button,
              {
                key: 'delete',
                variant: 'dangerGhost',
                onClick: () => requestDelete(original),
                disabled: busy,
              },
              h(IconTrash, { size: 14 }),
              t('editor.delete'),
            )
          : h('span', { key: 'spacer', className: 'ssh-toolSpacer' }),
        h(Button, { key: 'cancel', onClick: requestClose, disabled: busy }, t('common.cancel')),
        h(
          Button,
          { key: 'save', variant: 'primary', onClick: () => void submit(), disabled: busy },
          busy ? h(Spinner, { size: 12 }) : null,
          busy ? t('common.saving') : t('common.save'),
        ),
      ]

      return h(
        Modal,
        {
          title: original ? t('editor.editTitle') : t('editor.newTitle'),
          subtitle: t('editor.aliasHint'),
          width: 700,
          icon: h(IconTerminal, { size: 16 }),
          closeLabel: t('common.close'),
          onClose: requestClose,
          footer,
        },
        h(
          'div',
          { className: 'ssh-formSection' },
          formError
            ? h(
                'div',
                { className: 'ssh-formError' },
                h(IconAlert, { size: 13 }),
                h('span', null, formError),
                aliasSuggestion
                  ? h(
                      Button,
                      {
                        size: 'sm',
                        variant: 'ghost',
                        onClick: () => {
                          if (!draft.label.trim()) update('label', alias)
                          update('host', aliasSuggestion)
                          setAliasSuggestion('')
                          setFormError('')
                        },
                      },
                      t('editor.useSuggestedAlias', { alias: aliasSuggestion }),
                    )
                  : null,
              )
            : null,
          h(
            'div',
            { className: 'ssh-formGrid' },
            h(
              Field,
              { label: t('editor.alias'), hint: t('editor.aliasHint') },
              h(TextInput, {
                value: draft.host,
                onChange: (value) => update('host', value),
                placeholder: t('editor.aliasPlaceholder'),
                autoFocus: true,
                mono: true,
              }),
            ),
            h(
              Field,
              { label: t('editor.hostname') },
              h(TextInput, {
                value: draft.hostname,
                onChange: (value) => update('hostname', value),
                placeholder: t('editor.hostnamePlaceholder'),
                mono: true,
              }),
            ),
            h(
              Field,
              { label: t('editor.user') },
              h(TextInput, {
                value: draft.user,
                onChange: (value) => update('user', value),
                placeholder: t('editor.userPlaceholder'),
                mono: true,
              }),
            ),
            h(
              Field,
              { label: t('editor.port') },
              h(TextInput, {
                value: draft.port,
                onChange: (value) => update('port', value),
                placeholder: '22',
                mono: true,
              }),
            ),
            h(
              Field,
              { label: t('editor.identityFile'), hint: t('editor.identityFileHint') },
              h(TextInput, {
                value: draft.identityFile,
                onChange: (value) => update('identityFile', value),
                placeholder: '~/.ssh/id_ed25519',
                mono: true,
              }),
            ),
            h(
              Field,
              { label: t('editor.proxyJump'), hint: t('editor.proxyJumpHint') },
              h(TextInput, {
                value: draft.proxyJump,
                onChange: (value) => update('proxyJump', value),
                placeholder: 'bastion 或 user@host:port',
                mono: true,
              }),
            ),
            h(
              Field,
              { label: t('editor.group') },
              h(
                'div',
                { className: 'ssh-groupCombo', ref: groupMenuRef },
                h(TextInput, {
                  value: draft.group,
                  onChange: (value) => update('group', value),
                  placeholder: t('editor.groupPlaceholder'),
                }),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'ssh-groupToggle',
                    title: t('editor.groupChoose'),
                    'aria-label': t('editor.groupChoose'),
                    'aria-haspopup': 'listbox',
                    'aria-expanded': groupMenuOpen,
                    onClick: () => setGroupMenuOpen((value) => !value),
                  },
                  h(IconChevronDown, { size: 13 }),
                ),
                groupMenuOpen
                  ? h(
                      'div',
                      { className: 'ssh-groupMenu', role: 'listbox' },
                      h('button', {
                        type: 'button',
                        role: 'option',
                        'aria-selected': draft.group.trim() === '',
                        className: cx('ssh-groupOption', draft.group.trim() === '' && 'active'),
                        onClick: () => {
                          update('group', '')
                          setGroupMenuOpen(false)
                        },
                      }, t('editor.groupNone')),
                      groupOptions.length === 0
                        ? h('div', { className: 'ssh-groupEmpty' }, t('editor.groupNoOptions'))
                        : groupOptions.map((option) =>
                            h('button', {
                              key: option,
                              type: 'button',
                              role: 'option',
                              'aria-selected': draft.group.trim() === option,
                              className: cx('ssh-groupOption', draft.group.trim() === option && 'active'),
                              onClick: () => {
                                update('group', option)
                                setGroupMenuOpen(false)
                              },
                            }, option),
                          ),
                    )
                  : null,
              ),
            ),
            h(
              Field,
              { label: t('editor.label'), hint: t('editor.labelHint') },
              h(TextInput, {
                value: draft.label,
                onChange: (value) => update('label', value),
                placeholder: t('editor.labelPlaceholder'),
              }),
            ),
            h(
              Field,
              { label: t('editor.tags') },
              h(TextInput, {
                value: draft.tags,
                onChange: (value) => update('tags', value),
                placeholder: t('editor.tagsPlaceholder'),
              }),
            ),
            h(
              Field,
              { label: t('editor.note') },
              h(TextInput, {
                value: draft.note,
                onChange: (value) => update('note', value),
                placeholder: t('editor.notePlaceholder'),
              }),
            ),
          ),
        ),
        h(
          'div',
          { className: 'ssh-formSection' },
          h('div', { className: 'ssh-formHead' }, t('editor.passwordSection')),
          h(
            Field,
            {
              label: passwordRequired
                ? t('editor.passwordRequired')
                : original && original.passwordConfigured
                  ? t('editor.passwordOptional')
                  : t('editor.passwordAuthOptional'),
              hint: passwordRequired
                ? t('editor.passwordRequiredHint')
                : original && original.passwordConfigured
                  ? t('editor.passwordExisting')
                  : t('editor.passwordRequiredHint'),
            },
            h(TextInput, {
              type: 'password',
              value: password,
              onChange: (value) => {
                setPassword(value)
                setPasswordError('')
              },
              placeholder: '••••••••',
            }),
            passwordError ? h('div', { className: 'ssh-formError' }, h(IconAlert, { size: 13 }), h('span', null, passwordError)) : null,
          ),
        ),
      )
    }

    // ---------------------------------------------------------------------
    // Groups
    // ---------------------------------------------------------------------

    function GroupsDialog({ model }) {
      const { t, hosts, renameGroup, requestDeleteGroup, isPending } = model
      const groups = buildGroups(hosts, t).filter((group) => group.key !== '')
      const [drafts, setDrafts] = React.useState(() => Object.fromEntries(groups.map((group) => [group.key, group.key])))
      const busy = isPending('groups')
      const requestClose = () => {
        if (!busy) model.setGroupsOpen(false)
      }

      React.useEffect(() => {
        const guard = () => requestClose()
        model.groupsCloseGuard.current = guard
        return () => {
          if (model.groupsCloseGuard.current === guard) model.groupsCloseGuard.current = null
        }
      })

      async function commit(name) {
        const next = String(drafts[name] ?? '').trim()
        if (next === '' || next === name) return
        const ok = await renameGroup(name, next)
        if (ok) setDrafts((prev) => ({ ...prev, [name]: next }))
      }

      return h(
        Modal,
        {
          title: t('groups.title'),
          subtitle: t('groups.subtitle'),
          width: 560,
          icon: h(IconFolder, { size: 16 }),
          closeLabel: t('common.close'),
          onClose: requestClose,
          footer: [h(Button, { key: 'close', onClick: requestClose }, t('common.close'))],
        },
        groups.length === 0
          ? h('div', { className: 'ssh-sectionHint' }, t('groups.empty'))
          : h(
              'div',
              { className: 'ssh-groupList' },
              groups.map((group) =>
                h(
                  'div',
                  { key: group.key, className: 'ssh-groupRow' },
                  h(
                    'div',
                    { className: 'ssh-groupMain' },
                    h('div', { className: 'ssh-groupTitle' }, group.label),
                    h('div', { className: 'ssh-groupMeta' }, t('groups.count', { count: group.hosts.length })),
                  ),
                  h(
                        'div',
                        { className: 'ssh-groupActions' },
                        h('input', {
                          className: 'ssh-input',
                          value: drafts[group.key] ?? group.key,
                          placeholder: t('groups.renamePlaceholder'),
                          onChange: (event) => setDrafts((prev) => ({ ...prev, [group.key]: event.target.value })),
                          onKeyDown: (event) => {
                            if (event.key === 'Enter') void commit(group.key)
                          },
                        }),
                        h(
                          Button,
                          {
                            size: 'sm',
                            onClick: () => void commit(group.key),
                            disabled:
                              busy ||
                              String(drafts[group.key] ?? '').trim() === '' ||
                              String(drafts[group.key] ?? '').trim() === group.key,
                          },
                          t('groups.rename'),
                        ),
                        h(
                          Button,
                          { size: 'sm', variant: 'dangerGhost', onClick: () => requestDeleteGroup(group.key), disabled: busy },
                          t('groups.delete'),
                        ),
                      ),
                ),
              ),
            ),
      )
    }

    // ---------------------------------------------------------------------
    // Batch commands
    // ---------------------------------------------------------------------

    function BatchTab({ model }) {
      const { t, hosts, selected, setSelected, isPending, withPending, notify } = model
      const [command, setCommand] = React.useState('')
      const [results, setResults] = React.useState(null)
      const [elapsed, setElapsed] = React.useState(0)
      const [filter, setFilter] = React.useState('')
      const busy = isPending('batch')
      const ordered = sortHosts(hosts, { key: 'name', dir: 'asc' })
      const needle = filter.trim().toLowerCase()
      const visibleTargets = ordered.filter((host) => matchesText(host, needle))

      function toggle(alias) {
        setSelected((prev) => (prev.includes(alias) ? prev.filter((entry) => entry !== alias) : [...prev, alias]))
      }

      async function run() {
        const text = command.trim()
        if (text === '' || selected.length === 0) {
          notify(t('batch.needCommand'), 'error')
          return
        }
        const started = Date.now()
        const value = await withPending('batch', () => callAction('ssh/batch-exec', { hosts: selected, command: text }))
        setElapsed(Date.now() - started)
        if (value) setResults(value.results ?? [])
      }

      const okCount = results ? results.filter((item) => item.ok).length : 0
      const failCount = results ? results.length - okCount : 0

      if (hosts.length === 0) {
        return h(
          'div',
          { className: 'ssh-page' },
          h(
            'div',
            { className: 'ssh-pageInner' },
            h(Empty, {
              icon: h(IconTerminal, { size: 24 }),
              title: t('batch.title'),
              body: t('batch.emptyHosts'),
              actions: [h(Button, { key: 'new', variant: 'primary', onClick: () => model.openEditor(null) }, t('empty.new'))],
            }),
          ),
        )
      }

      return h(
        'div',
        { className: 'ssh-page' },
        h(
          'div',
          { className: 'ssh-pageInner' },
          h(
            'div',
            { className: 'ssh-pageHead' },
            h('h2', { className: 'ssh-pageTitle' }, t('batch.title')),
            h('span', { className: 'ssh-resultsStats' }, t('batch.selected', { count: selected.length })),
          ),
          h('p', { className: 'ssh-cardDesc' }, t('batch.subtitle')),
          h(
            'section',
            { className: 'ssh-card' },
            h(
              'div',
              { className: 'ssh-cardHead' },
              h('h3', null, t('batch.command')),
              h(
                'div',
                { className: 'ssh-cardActions' },
                h(
                  Button,
                  { size: 'sm', variant: 'ghost', onClick: () => setSelected(ordered.map((host) => host.host)) },
                  t('batch.selectAll'),
                ),
                h(Button, { size: 'sm', variant: 'ghost', onClick: () => setSelected([]) }, t('batch.clear')),
              ),
            ),
            h(TextArea, {
              mono: true,
              rows: 3,
              value: command,
              onChange: setCommand,
              placeholder: t('batch.commandPlaceholder'),
              spellCheck: false,
            }),
            h(
              'div',
              { className: 'ssh-batchRow' },
              h('span', { className: 'ssh-sectionHint' }, t('batch.targets')),
              h(
                Button,
                { variant: 'primary', onClick: () => void run(), disabled: busy || selected.length === 0 || command.trim() === '' },
                busy ? h(Spinner, { size: 12 }) : h(IconPlay, { size: 13 }),
                busy ? t('batch.running') : t('batch.run'),
              ),
            ),
            h(
              'div',
              { className: 'ssh-batchRow' },
              h('span', { className: 'ssh-targetSearch' }, h(IconSearch, { size: 14 }), h(TextInput, {
                value: filter,
                onChange: setFilter,
                placeholder: t('search.placeholder'),
              })),
              h('span', { className: 'ssh-resultsStats' }, t('batch.selected', { count: selected.length })),
            ),
            h(
              'div',
              { className: 'ssh-targetList' },
              visibleTargets.map((host) => {
                const credential = credentialInfo(host, t)
                return h(
                  'div',
                  {
                    key: host.host,
                    className: cx('ssh-targetRow', selected.includes(host.host) && 'on'),
                    role: 'button',
                    tabIndex: 0,
                    onClick: () => toggle(host.host),
                    onKeyDown: (event) => {
                      if (event.target !== event.currentTarget) return
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        toggle(host.host)
                      }
                    },
                  },
                  h(Checkbox, {
                    checked: selected.includes(host.host),
                    onChange: () => toggle(host.host),
                    label: t('table.select'),
                  }),
                  h('span', { className: 'ssh-targetName' }, hostName(host)),
                  h('span', { className: 'ssh-targetAddr' }, hostTarget(host)),
                  h('span', { className: 'ssh-targetCred' }, h(Badge, { tone: credential.tone }, credential.label)),
                )
              }),
            ),
          ),
          h(
            'section',
            { className: 'ssh-card' },
            h(
              'div',
              { className: 'ssh-cardHead' },
              h('h3', null, t('batch.results')),
              results
                ? h(
                    'span',
                    { className: 'ssh-resultsStats' },
                    t('batch.duration', { ms: elapsed }),
                    ' · ',
                    t('batch.ok'),
                    ` ${okCount}`,
                    ' · ',
                    t('batch.failed'),
                    ` ${failCount}`,
                  )
                : null,
            ),
            results === null
              ? h('div', { className: 'ssh-sectionHint' }, t('batch.noResults'))
              : h(
                  'div',
                  { className: 'ssh-results' },
                  results.map((item) =>
                    h(
                      'div',
                      { key: item.host, className: 'ssh-result' },
                      h(
                        'div',
                        { className: 'ssh-resultHead' },
                        h('span', { className: cx('ssh-resultDot', item.ok ? 'ok' : 'fail') }),
                        h('span', { className: 'ssh-resultHost' }, item.host),
                        item.ok ? h(Badge, { tone: 'ok' }, t('batch.ok')) : h(Badge, { tone: 'error' }, t('batch.failed')),
                        item.ok
                          ? h('span', { className: 'ssh-resultMeta' }, t('drawer.exit', { code: item.result?.code ?? 0 }))
                          : null,
                      ),
                      item.ok
                        ? h(
                            'pre',
                            { className: 'ssh-resultOutput' },
                            [item.result?.stdout, item.result?.stderr].filter(Boolean).join('\n') || t('batch.noOutput'),
                          )
                        : h('div', { className: 'ssh-resultError' }, item.error || t('batch.failed')),
                    ),
                  ),
                ),
          ),
        ),
      )
    }

    // ---------------------------------------------------------------------
    // Settings
    // ---------------------------------------------------------------------

    function PathRow({ label, value, onCopy, t }) {
      return h(
        'div',
        { className: 'ssh-settingRow' },
        h('span', { className: 'ssh-settingLabel' }, label),
        h('span', { className: 'ssh-settingValue mono', title: value || '' }, value || '—'),
        h(
          IconButton,
          { title: t('common.copy'), onClick: () => onCopy(value || '') },
          h(IconCopy, { size: 14 }),
        ),
      )
    }

    function TransferDialog({ model, mode, onClose }) {
      const { t, notify, load, hosts } = model
      const [passphrase, setPassphrase] = React.useState('')
      const [confirmation, setConfirmation] = React.useState('')
      const [file, setFile] = React.useState(null)
      const [reading, setReading] = React.useState(false)
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState('')
      const busyRef = React.useRef(false)
      const fileRef = React.useRef(null)

      React.useEffect(() => {
        const onKey = (event) => {
          if (event.key !== 'Escape' || busyRef.current) return
          event.preventDefault()
          event.stopPropagation()
          onClose()
        }
        document.addEventListener('keydown', onKey, true)
        return () => document.removeEventListener('keydown', onKey, true)
      }, [onClose])

      async function pickFile(event) {
        const picked = event.target.files?.[0]
        event.target.value = ''
        if (!picked) return
        if (picked.size > 8 * 1024 * 1024) {
          setError(t('transfer.fileTooLarge'))
          setFile(null)
          return
        }
        setReading(true)
        setError('')
        try {
          const text = typeof picked.text === 'function'
            ? await picked.text()
            : await new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(String(reader.result ?? ''))
                reader.onerror = () => reject(reader.error ?? new Error('Cannot read file'))
                reader.readAsText(picked)
              })
          const parsed = JSON.parse(text)
          if (!parsed || parsed.format !== 'dsh-ssh-manage-export' || !Array.isArray(parsed.hosts)) {
            throw new Error(t('transfer.invalidFile'))
          }
          setFile({ name: picked.name, data: parsed })
        } catch (failure) {
          setFile(null)
          setError(errorMessage(failure))
        } finally {
          setReading(false)
        }
      }

      async function submit() {
        if (busyRef.current) return
        if (passphrase.length < 8) {
          setError(t('transfer.passphraseShort'))
          return
        }
        if (mode === 'export' && passphrase !== confirmation) {
          setError(t('transfer.passphraseMismatch'))
          return
        }
        if (mode === 'import' && !file) {
          setError(t('transfer.chooseFileFirst'))
          return
        }
        busyRef.current = true
        setBusy(true)
        setError('')
        try {
          if (mode === 'export') {
            const value = await callAction('data/export', { passphrase })
            const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)
            downloadTextFile(`dsh-ssh-manage-export-${stamp}.json`, JSON.stringify(value, null, 2))
            notify(t('transfer.exported', { count: value?.hosts?.length ?? hosts.length }), 'success')
          } else {
            const value = await callAction('data/import', { export: file.data, passphrase })
            const summary = t('transfer.imported', {
              created: value?.created ?? 0,
              updated: value?.updated ?? 0,
              passwords: value?.passwords ?? 0,
            })
            if (Array.isArray(value?.errors) && value.errors.length > 0) {
              notify(`${summary}；${t('transfer.importWarnings', { count: value.errors.length })}`, 'error')
            } else {
              notify(summary, 'success')
            }
            await load({ quiet: true })
          }
          onClose()
        } catch (failure) {
          setError(errorMessage(failure))
        } finally {
          busyRef.current = false
          setBusy(false)
        }
      }

      return h(
        'div',
        {
          className: 'ssh-fileDialogScrim',
          onMouseDown: () => {
            if (!busyRef.current) onClose()
          },
        },
        h(
          'div',
          {
            className: 'ssh-fileDialog ssh-transferDialog',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-label': mode === 'export' ? t('transfer.exportTitle') : t('transfer.importTitle'),
            onMouseDown: (event) => event.stopPropagation(),
          },
          h('div', { className: 'ssh-fileDialogTitle' }, mode === 'export' ? t('transfer.exportTitle') : t('transfer.importTitle')),
          h(
            'div',
            { className: 'ssh-fileDialogBody' },
            mode === 'export'
              ? t('transfer.exportDesc', { count: hosts.length })
              : t('transfer.importDesc'),
          ),
          mode === 'import'
            ? h(
                'div',
                { className: 'ssh-transferFile' },
                h('input', {
                  ref: fileRef,
                  type: 'file',
                  accept: '.json,application/json',
                  className: 'ssh-srOnly',
                  onChange: (event) => void pickFile(event),
                }),
                h(
                  Button,
                  { size: 'sm', variant: 'ghost', onClick: () => fileRef.current?.click(), disabled: reading || busy },
                  reading ? h(Spinner, { size: 12 }) : h(IconUpload, { size: 13 }),
                  file ? file.name : t('transfer.chooseFile'),
                ),
                file ? h(Badge, { tone: 'ok' }, t('transfer.fileReady', { count: file.data.hosts.length })) : null,
              )
            : null,
          h(TextInput, {
            type: 'password',
            value: passphrase,
            onChange: setPassphrase,
            placeholder: t('transfer.passphrase'),
            autoFocus: true,
            disabled: busy,
            onKeyDown: (event) => {
              if (event.key === 'Enter') void submit()
            },
          }),
          mode === 'export'
            ? h(TextInput, {
                type: 'password',
                value: confirmation,
                onChange: setConfirmation,
                placeholder: t('transfer.confirmPassphrase'),
                disabled: busy,
                onKeyDown: (event) => {
                  if (event.key === 'Enter') void submit()
                },
              })
            : null,
          h('div', { className: 'ssh-sectionHint' }, t('transfer.passphraseHint')),
          error ? h('div', { className: 'ssh-formError' }, h(IconAlert, { size: 13 }), h('span', null, error)) : null,
          h(
            'div',
            { className: 'ssh-sectionHint ssh-revealWarning' },
            h(IconAlert, { size: 12 }),
            h('span', null, mode === 'export' ? t('transfer.exportWarning') : t('transfer.importMergeNote')),
          ),
          h(
            'div',
            { className: 'ssh-fileDialogActions' },
            h(Button, { variant: 'ghost', size: 'sm', onClick: onClose, disabled: busy }, t('common.cancel')),
            h(
              Button,
              { variant: 'primary', size: 'sm', onClick: () => void submit(), disabled: busy || reading },
              busy ? h(Spinner, { size: 12 }) : null,
              mode === 'export' ? t('transfer.doExport') : t('transfer.doImport'),
            ),
          ),
        ),
      )
    }

    function SettingsTab({ model }) {
      const { t, snapshot, hosts, columns, setColumns, copyValue, load, refreshing, notify } = model
      const [transferMode, setTransferMode] = React.useState(null)
      const agentSettings = snapshot?.agentSettings ?? { approval: 'audit', readonly: false }
      const audit = snapshot?.audit ?? []
      const updateAgentSettings = async (patch) => {
        try {
          await callAction('agent/settings', { settings: { ...agentSettings, ...patch } })
          await load({ quiet: true })
        } catch (failure) {
          notify(t('state.error', { message: errorMessage(failure) }), 'error')
        }
      }
      const passwordCount = hosts.filter((host) => host.passwordConfigured).length
      const exists = snapshot?.exists === true
      return h(
        'div',
        { className: 'ssh-page' },
        h(
          'div',
          { className: 'ssh-pageInner' },
          h('div', { className: 'ssh-pageHead' }, h('h2', { className: 'ssh-pageTitle' }, t('settings.title'))),
          h(
            'section',
            { className: 'ssh-card' },
            h(
              'div',
              { className: 'ssh-cardHead' },
              h('h3', null, t('settings.config')),
              h(Badge, { tone: exists ? 'ok' : 'muted' }, exists ? t('config.exists') : t('config.missing')),
            ),
            h(PathRow, {
              label: t('settings.configPath'),
              value: snapshot?.configPath ?? '',
              onCopy: (value) => void copyValue(value),
              t,
            }),
            h(PathRow, {
              label: t('settings.backupDir'),
              value: snapshot?.backupDir ?? '',
              onCopy: (value) => void copyValue(value),
              t,
            }),
            h(PathRow, {
              label: t('settings.stateDir'),
              value: snapshot?.stateDir ?? '',
              onCopy: (value) => void copyValue(value),
              t,
            }),
            h(
              'div',
              { className: 'ssh-cardActions' },
              h(
                Button,
                { size: 'sm', variant: 'ghost', onClick: () => void load({ quiet: true }), disabled: refreshing },
                refreshing ? h(Spinner, { size: 12 }) : h(IconRefresh, { size: 13 }),
                t('common.refresh'),
              ),
            ),
          ),
          h(
            'section',
            { className: 'ssh-card' },
            h(
              'div',
              { className: 'ssh-cardHead' },
              h('h3', null, t('settings.vault')),
              h(
                Badge,
                { tone: passwordCount > 0 ? 'ok' : 'muted' },
                passwordCount > 0 ? t('settings.vaultCount', { count: passwordCount }) : t('settings.vaultNone'),
              ),
            ),
            h('p', { className: 'ssh-cardDesc' }, t('settings.vaultDesc')),
            h(
              'div',
              { className: 'ssh-vaultMeta' },
              h(IconLock, { size: 14 }),
              h('span', null, 'AES-256-GCM'),
              h('span', { className: 'ssh-dot' }),
              h('span', null, `${passwordCount} / ${hosts.length}`),
            ),
          ),
          h(
            'section',
            { className: 'ssh-card' },
            h(
              'div',
              { className: 'ssh-cardHead' },
              h('h3', null, t('settings.transfer')),
              h(Badge, { tone: 'muted' }, t('settings.transferBadge')),
            ),
            h('p', { className: 'ssh-cardDesc' }, t('settings.transferDesc')),
            h(
              'div',
              { className: 'ssh-cardActions' },
              h(
                Button,
                { size: 'sm', variant: 'ghost', onClick: () => setTransferMode('export') },
                h(IconDownload, { size: 13 }),
                t('settings.export'),
              ),
              h(
                Button,
                { size: 'sm', variant: 'ghost', onClick: () => setTransferMode('import') },
                h(IconUpload, { size: 13 }),
                t('settings.import'),
              ),
            ),
          ),
          h(
            'section',
            { className: 'ssh-card' },
            h(
              'div',
              { className: 'ssh-cardHead' },
              h('h3', null, t('settings.agentSecurity')),
              h(Badge, { tone: agentSettings.readonly ? 'warn' : 'ok' }, agentSettings.readonly ? t('settings.readonly') : t('settings.approvalAudit')),
            ),
            h(
              'div',
              { className: 'ssh-switchList' },
              h(
                'div',
                { className: 'ssh-settingRow' },
                h(Switch, {
                  checked: agentSettings.readonly,
                  onChange: (value) => void updateAgentSettings({ readonly: value }),
                  label: t('settings.readonly'),
                }),
              ),
              h(
                'div',
                { className: 'ssh-settingRow' },
                h(
                  'div',
                  { className: 'ssh-approvalChoice' },
                  h(Button, { size: 'sm', variant: agentSettings.approval === 'audit' ? 'primary' : 'ghost', onClick: () => void updateAgentSettings({ approval: 'audit' }) }, t('settings.approvalAudit')),
                  h(Button, { size: 'sm', variant: agentSettings.approval === 'ask' ? 'primary' : 'ghost', onClick: () => void updateAgentSettings({ approval: 'ask' }) }, t('settings.approvalAsk')),
                ),
              ),
            ),
            h('p', { className: 'ssh-cardDesc' }, t('settings.approvalHint')),
            h('div', { className: 'ssh-auditList' },
              audit.length === 0
                ? h('div', { className: 'ssh-sectionHint' }, t('settings.auditEmpty'))
                : audit.slice(0, 10).map((entry, index) =>
                    h(
                      'div',
                      { key: `${entry.time}-${index}`, className: 'ssh-auditRow', title: entry.error || entry.detail },
                      h('span', { className: cx('ssh-auditDot', entry.ok ? 'ok' : 'error') }),
                      h('code', null, entry.action),
                      h('span', { className: 'ssh-auditHost' }, entry.host || '—'),
                      h('span', { className: 'ssh-auditDetail' }, entry.detail || entry.error || '—'),
                      h('time', null, formatDateTime(entry.time, model.localeId)),
                    ),
                  ),
            ),
          ),
          h(
            'section',
            { className: 'ssh-card' },
            h('div', { className: 'ssh-cardHead' }, h('h3', null, t('settings.appearance'))),
            h(
              'div',
              { className: 'ssh-switchList' },
              h(
                'div',
                { className: 'ssh-settingRow' },
                h(Switch, {
                  checked: columns.info,
                  onChange: (value) => setColumns((prev) => ({ ...prev, info: value })),
                  label: t('settings.infoColumn'),
                }),
              ),
              h(
                'div',
                { className: 'ssh-settingRow' },
                h(Switch, {
                  checked: columns.notes,
                  onChange: (value) => setColumns((prev) => ({ ...prev, notes: value })),
                  label: t('settings.notesColumn'),
                }),
              ),
              h(
                'div',
                { className: 'ssh-settingRow' },
                h(Switch, {
                  checked: columns.compact,
                  onChange: (value) => setColumns((prev) => ({ ...prev, compact: value })),
                  label: t('settings.compact'),
                }),
              ),
            ),
          ),
          h(
            'section',
            { className: 'ssh-card' },
            h('div', { className: 'ssh-cardHead' }, h('h3', null, t('settings.about'))),
            h('p', { className: 'ssh-cardDesc' }, t('settings.aboutDesc')),
            h(
              'div',
              { className: 'ssh-vaultMeta' },
              h('span', null, 'dsh-ssh-manage'),
              h('span', { className: 'ssh-dot' }),
              h('span', null, t('settings.aboutTag')),
            ),
          ),
          transferMode
            ? h(TransferDialog, {
                model,
                mode: transferMode,
                onClose: () => setTransferMode(null),
              })
            : null,
        ),
      )
    }

    // ---------------------------------------------------------------------
    // Styles (host tokens only; no literal chrome colors)
    // ---------------------------------------------------------------------

    const CSS = `
.ssh-root{--ssh-bg:var(--dsw-alias-bg-base);--ssh-layer-1:var(--dsw-alias-bg-layer-1);--ssh-layer-2:var(--dsw-alias-bg-layer-2,var(--dsw-alias-bg-layer-1));--ssh-layer-3:var(--dsw-alias-bg-layer-3,var(--dsw-alias-bg-layer-2,var(--dsw-alias-bg-layer-1)));--ssh-border:var(--dsw-alias-border-l1);--ssh-border-strong:var(--dsw-alias-border-l2,var(--dsw-alias-border-l1));--ssh-text:var(--dsw-alias-label-primary);--ssh-text-2:var(--dsw-alias-label-secondary);--ssh-text-3:var(--dsw-alias-label-tertiary,var(--dsw-alias-label-secondary));--ssh-dim:var(--dsw-alias-label-dimmed,var(--dsw-alias-state-idle-primary,var(--dsw-alias-label-secondary)));--ssh-brand:var(--dsw-alias-brand-primary);--ssh-success:var(--dsw-alias-state-success-primary);--ssh-danger:var(--dsw-alias-state-error-primary);--ssh-warn:var(--dsw-alias-state-warn-primary);--ssh-hover:var(--dsw-alias-interactive-bg-hover,color-mix(in srgb,var(--dsw-alias-bg-base) 92%,var(--dsw-alias-label-primary) 8%));--ssh-focus:var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary));--ssh-foreground:var(--dsw-alias-label-primary-foreground,var(--dsw-alias-bg-base));--ssh-radius-sm:var(--dsw-radius-sm,6px);--ssh-radius-md:var(--dsw-radius-md,8px);--ssh-radius-lg:var(--dsw-radius-lg,12px);--ssh-shadow:var(--dsw-shadow-lv3,0 12px 32px rgba(0,0,0,.24));display:flex;flex-direction:column;height:100%;min-height:0;background:var(--ssh-bg);color:var(--ssh-text);font-size:13px;line-height:1.55;overflow:hidden;position:relative}
.ssh-root *{box-sizing:border-box}
.ssh-root button{font-family:inherit}
.ssh-root ::selection{background:color-mix(in srgb,var(--ssh-brand) 26%,transparent)}
.ssh-top{flex:0 0 auto;display:flex;align-items:stretch;gap:16px;height:47px;padding:0 16px;border-bottom:.5px solid var(--ssh-border);background:var(--ssh-bg)}
.ssh-tabs{display:flex;gap:26px}
.ssh-tab{appearance:none;border:0;background:transparent;color:var(--ssh-text-3);font:inherit;font-size:13px;font-weight:500;padding:0;position:relative;cursor:pointer;transition:color .12s ease}
.ssh-tab:hover{color:var(--ssh-text)}
.ssh-tab.active{color:var(--ssh-text);font-weight:600}
.ssh-tab.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;border-radius:2px;background:var(--ssh-brand)}
.ssh-topRight{margin-left:auto;display:flex;align-items:center;min-width:0}
.ssh-configBtn{appearance:none;display:inline-flex;align-items:center;gap:7px;height:28px;max-width:440px;padding:0 12px;border:.5px solid var(--ssh-border-strong);border-radius:999px;background:transparent;color:var(--ssh-text-3);font:inherit;font-size:11.5px;cursor:pointer;transition:background .12s ease,color .12s ease}
.ssh-configBtn:hover{background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-configPath{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;color:var(--ssh-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-errorBar{flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:8px 16px;border-bottom:.5px solid var(--ssh-border);color:var(--ssh-danger);font-size:11.5px;background:color-mix(in srgb,var(--ssh-danger) 7%,var(--ssh-bg))}
.ssh-errorText{flex:1;min-width:0}
.ssh-loadingPage{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--ssh-text-3);font-size:12.5px;padding:40px}
.ssh-body{flex:1;min-height:0;display:grid;grid-template-columns:var(--ssh-tree-width,300px) minmax(0,1fr);position:relative;overflow:hidden}
.ssh-body.collapsed{grid-template-columns:0 minmax(0,1fr)}
.ssh-treeResizer{position:absolute;top:0;bottom:0;left:var(--ssh-tree-width,300px);width:10px;transform:translateX(-5px);z-index:26;cursor:col-resize;touch-action:none;outline:none}
.ssh-treeResizer::after{content:"";position:absolute;top:0;bottom:0;left:4px;width:1px;background:transparent;transition:background .12s ease}
.ssh-treeResizer:hover::after,.ssh-treeResizer:focus-visible::after{background:var(--ssh-brand);box-shadow:0 0 0 1px color-mix(in srgb,var(--ssh-brand) 35%,transparent)}
.ssh-body.collapsed .ssh-treeResizer{display:none}
body.ssh-col-resizing,body.ssh-col-resizing *{cursor:col-resize!important;user-select:none!important}
.ssh-sidebar{display:flex;flex-direction:column;min-height:0;border-right:.5px solid var(--ssh-border);background:var(--ssh-bg)}
.ssh-body.collapsed .ssh-sidebar{display:none}
.ssh-sideScrim{display:none}
.ssh-main{display:flex;flex-direction:column;min-width:0;min-height:0;background:var(--ssh-bg)}
.ssh-sideTop{flex:0 0 auto;display:flex;align-items:center;gap:3px;padding:10px 10px;min-height:56px;border-bottom:.5px solid var(--ssh-border)}
.ssh-sideAction{appearance:none;display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 7px;border:0;border-radius:var(--ssh-radius-sm);background:transparent;color:var(--ssh-text-3);font:inherit;font-size:11.5px;cursor:pointer;white-space:nowrap;flex:0 0 auto}
.ssh-sideAction:hover{background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-sideBtn{flex:0 0 auto;padding:0 8px}
.ssh-tree{flex:1;min-height:0;overflow:auto;padding:8px 8px 20px}
.ssh-treeRow{display:flex;align-items:center;gap:7px;height:32px;padding:0 8px;border-radius:var(--ssh-radius-sm);color:var(--ssh-text-2);cursor:pointer;user-select:none;font-size:12.5px;min-width:0;transition:background .1s ease,color .1s ease}
.ssh-treeRow:hover{background:var(--ssh-hover)}
.ssh-treeRow.selected{background:color-mix(in srgb,var(--ssh-brand) 13%,transparent);color:var(--ssh-text)}
.ssh-treeAll{margin-bottom:2px;font-weight:500}
.ssh-treeIcon{display:inline-flex;color:var(--ssh-text-3);flex:0 0 auto}
.ssh-treeRow.selected .ssh-treeIcon{color:var(--ssh-brand)}
.ssh-treeLabel{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-treeCount{font-size:10.5px;color:var(--ssh-dim);font-variant-numeric:tabular-nums;flex:0 0 auto}
.ssh-treeGroup{margin-top:2px;font-weight:500}
.ssh-treeCaret{appearance:none;display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;padding:0;border:0;border-radius:4px;background:transparent;color:var(--ssh-dim);cursor:pointer;flex:0 0 auto}
.ssh-treeCaret:hover{background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-treeHosts{position:relative;margin-left:14px;padding:1px 0 3px}
.ssh-treeHosts::before{content:"";position:absolute;left:0;top:2px;bottom:8px;border-left:1px solid var(--ssh-border)}
.ssh-treeHost{appearance:none;border:0;background:transparent;display:flex;align-items:center;gap:6px;height:30px;margin-left:10px;padding:0 8px 0 14px;border-radius:var(--ssh-radius-sm);width:calc(100% - 10px);text-align:left;font:inherit;font-size:12px;color:var(--ssh-text-2);cursor:pointer;position:relative}
.ssh-treeHost::before{content:"";position:absolute;left:0;top:50%;width:8px;border-top:1px solid var(--ssh-border)}
.ssh-treeHost:hover{background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-treeHost.active{background:color-mix(in srgb,var(--ssh-brand) 10%,transparent);color:var(--ssh-text)}
.ssh-treeHostName{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-treeStar{color:var(--ssh-warn);display:inline-flex;flex:0 0 auto}
.ssh-treeEmpty{padding:14px 10px;font-size:11.5px;color:var(--ssh-dim);line-height:1.6}
.ssh-mainTop{flex:0 0 auto;display:flex;align-items:center;flex-wrap:wrap;gap:8px;row-gap:6px;padding:10px 14px;border-bottom:.5px solid var(--ssh-border);min-height:56px}
.ssh-context{display:flex;align-items:baseline;gap:6px;min-width:0;max-width:180px;flex:0 0 auto}
.ssh-contextName{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-contextCount{font-size:11px;color:var(--ssh-text-2);font-variant-numeric:tabular-nums}
.ssh-search{position:relative;display:flex;align-items:center;flex:0 1 300px;min-width:120px}
.ssh-search > svg{position:absolute;left:10px;color:var(--ssh-dim);pointer-events:none;z-index:1}
.ssh-search .ssh-input{height:30px;padding-left:31px;border-radius:999px;background:var(--ssh-layer-1);font-size:12px}
.ssh-toolSpacer{flex:1;min-width:0}
.ssh-infoToggle{display:inline-flex;align-items:center;gap:6px;padding:0 2px}
.ssh-toolDivider{width:1px;height:16px;background:var(--ssh-border);margin:0 2px;flex:0 0 auto}
.ssh-pathBtn{padding:0 9px}
.ssh-btnLabel{font-size:11.5px}
.ssh-batchBar{flex:0 0 auto;display:flex;align-items:center;gap:4px;padding:7px 14px;border-bottom:.5px solid var(--ssh-border);background:color-mix(in srgb,var(--ssh-brand) 6%,var(--ssh-bg))}
.ssh-batchCount{font-size:12px;color:var(--ssh-text-2);margin-right:6px}
.ssh-table{flex:1;min-height:0;display:flex;flex-direction:column;min-width:0}
.ssh-tableScroll{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column}
.ssh-grid{display:grid;align-items:center;column-gap:8px;padding:0 12px;width:100%;min-width:0}
.ssh-head{flex:0 0 auto;height:38px;border-bottom:.5px solid var(--ssh-border);color:var(--ssh-text-2);font-size:11px;font-weight:500;background:var(--ssh-bg);position:sticky;top:0;z-index:3;min-width:640px}
.ssh-cell{min-width:0;display:flex;align-items:center;gap:6px;overflow:hidden}
.ssh-headBtn{appearance:none;display:inline-flex;align-items:center;gap:4px;padding:0;border:0;background:transparent;color:inherit;font:inherit;font-size:11px;font-weight:500;cursor:pointer;white-space:nowrap;min-width:0}
.ssh-headBtn:hover{color:var(--ssh-text)}
.ssh-headBtn.active{color:var(--ssh-text-2)}
.ssh-sortMark{display:inline-flex;opacity:0;color:var(--ssh-dim)}
.ssh-headBtn:hover .ssh-sortMark{opacity:.7}
.ssh-sortMark.on{opacity:1;color:var(--ssh-brand)}
.ssh-headLabel{font-size:11px;font-weight:500;color:var(--ssh-text-3);white-space:nowrap}
.ssh-row{flex:0 0 auto;min-height:56px;border-bottom:.5px solid var(--ssh-border);cursor:pointer;min-width:640px;transition:background .1s ease}
.ssh-row:hover{background:var(--ssh-hover)}
.ssh-row.selected{background:color-mix(in srgb,var(--ssh-brand) 7%,transparent)}
.ssh-row:focus-visible{outline:none;box-shadow:inset 0 0 0 1.5px var(--ssh-focus)}
.ssh-table.compact .ssh-row{min-height:44px}
.ssh-colCheck{justify-content:flex-start}
.ssh-colLatency{min-width:0}
.ssh-colSystem{min-width:0}
.ssh-osBadge{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:var(--ssh-layer-3);color:var(--ssh-brand)}
.ssh-osBadge.muted{color:var(--ssh-text-2)}
.ssh-osName{font-size:11.5px;color:var(--ssh-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-osName.muted{color:var(--ssh-text-2)}
.ssh-latency{appearance:none;display:inline-flex;align-items:center;gap:5px;height:24px;padding:0;border:0;border-radius:4px;background:transparent;color:var(--ssh-text-2);font:inherit;font-size:11.5px;white-space:nowrap;cursor:pointer}
.ssh-latency.ok{color:var(--ssh-success)}
.ssh-latency.muted{color:var(--ssh-text-2)}
.ssh-latency.error{color:var(--ssh-danger)}
.ssh-latency:hover:not(:disabled){color:var(--ssh-text)}
.ssh-latency:disabled{cursor:default}
.ssh-latencyDot{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.55}
.ssh-latencyIcon{display:inline-flex;color:var(--dsw-alias-state-success-label,var(--ssh-success))}
.ssh-colName{flex-direction:column;align-items:flex-start;gap:0}
.ssh-nameMain{display:flex;align-items:center;gap:5px;max-width:100%;font-size:12.5px;font-weight:500;color:var(--ssh-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-nameSub{max-width:100%;font-size:10.5px;color:var(--ssh-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-favMark{color:var(--ssh-warn);display:inline-flex;flex:0 0 auto}
.ssh-colAddress{gap:3px;min-width:0}
.ssh-address{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;color:var(--ssh-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.ssh-inlineActions{display:inline-flex;gap:1px;flex:0 0 auto;opacity:.45;transition:opacity .12s ease}
.ssh-row:hover .ssh-inlineActions{opacity:1}
.ssh-miniBtn{appearance:none;display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;padding:0;border:0;border-radius:4px;background:transparent;color:var(--ssh-text-3);cursor:pointer}
.ssh-miniBtn:hover{background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-colInfo{gap:4px;row-gap:3px;flex-wrap:wrap;align-content:center;overflow:visible}
.ssh-chip{display:inline-flex;flex:0 0 auto;align-items:center;height:21px;max-width:100%;padding:0 7px;border-radius:6px;border:.5px solid var(--ssh-border);background:var(--ssh-layer-3);font-size:10.5px;color:var(--ssh-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-mutedText{font-size:11.5px;color:var(--ssh-text-2)}
.ssh-colNotes{min-width:0}
.ssh-noteText{font-size:11.5px;color:var(--ssh-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-noteText.muted{color:var(--ssh-text-2)}
.ssh-colActions{gap:4px;justify-content:flex-start;overflow:visible}
.ssh-colGear{justify-content:flex-end}
.ssh-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:56px 24px;text-align:center;color:var(--ssh-text-3);font-size:12px;min-height:0}
.ssh-empty.compact{padding:40px 24px}
.ssh-emptyIcon{display:flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:14px;background:var(--ssh-layer-3);color:var(--ssh-dim);margin-bottom:2px}
.ssh-emptyTitle{font-size:14px;font-weight:600;color:var(--ssh-text)}
.ssh-emptyBody{max-width:380px;line-height:1.7}
.ssh-emptyActions{display:flex;gap:8px;margin-top:8px}
.ssh-spinner{display:inline-block;border-radius:50%;border:1.6px solid var(--ssh-border-strong);border-top-color:var(--ssh-brand);animation:sshSpin .8s linear infinite;flex:0 0 auto}
@keyframes sshSpin{to{transform:rotate(360deg)}}
.ssh-btn{appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:5px;height:30px;padding:0 13px;border:.5px solid var(--ssh-border-strong);border-radius:var(--ssh-radius-md);background:var(--ssh-layer-3);color:var(--ssh-text);font:inherit;font-size:12.5px;font-weight:500;line-height:1;white-space:nowrap;cursor:pointer;transition:background .12s ease,color .12s ease,border-color .12s ease,opacity .12s ease}
.ssh-btn:hover:not(:disabled){background:var(--ssh-hover)}
.ssh-btn:disabled{opacity:.45;cursor:not-allowed}
.ssh-btn.sm{height:26px;padding:0 10px;font-size:11.5px;border-radius:var(--ssh-radius-sm)}
.ssh-btn.primary{background:var(--ssh-brand);border-color:transparent;color:var(--ssh-foreground)}
.ssh-btn.primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover,var(--ssh-brand));filter:brightness(1.04)}
.ssh-btn.success{background:color-mix(in srgb,var(--ssh-success) 30%,var(--ssh-bg));border-color:color-mix(in srgb,var(--ssh-success) 65%,transparent);color:var(--ssh-text);font-weight:600}
.ssh-btn.success:hover:not(:disabled){background:color-mix(in srgb,var(--ssh-success) 40%,var(--ssh-bg))}
.ssh-btn.ghost{background:transparent;border-color:transparent;color:var(--ssh-text-2)}
.ssh-btn.ghost:hover:not(:disabled){background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-btn.outlineStrong{background:transparent;border-color:var(--ssh-border-strong)}
.ssh-btn.dangerSolid{background:var(--ssh-danger);border-color:transparent;color:var(--ssh-foreground)}
.ssh-btn.dangerGhost{background:transparent;border-color:transparent;color:var(--ssh-danger)}
.ssh-btn.dangerGhost:hover:not(:disabled){background:color-mix(in srgb,var(--ssh-danger) 12%,transparent)}
.ssh-iconBtn{appearance:none;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:var(--ssh-radius-sm);background:transparent;color:var(--ssh-text-3);cursor:pointer;flex:0 0 auto;transition:background .12s ease,color .12s ease}
.ssh-iconBtn:hover:not(:disabled){background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-iconBtn.active{color:var(--ssh-brand);background:color-mix(in srgb,var(--ssh-brand) 12%,transparent)}
.ssh-iconBtn:disabled{opacity:.45;cursor:not-allowed}
.ssh-btn:focus-visible,.ssh-iconBtn:focus-visible,.ssh-tab:focus-visible,.ssh-headBtn:focus-visible,.ssh-drawerTab:focus-visible,.ssh-menuItem:focus-visible,.ssh-miniBtn:focus-visible,.ssh-quickChip:focus-visible,.ssh-configBtn:focus-visible,.ssh-latency:focus-visible,.ssh-check:focus-visible,.ssh-switch:focus-visible{outline:none;box-shadow:0 0 0 2px var(--ssh-focus)}
.ssh-input,.ssh-textarea{width:100%;border:.5px solid var(--ssh-border-strong);border-radius:var(--ssh-radius-md);background:var(--ssh-layer-1);color:var(--ssh-text);font:inherit;font-size:12.5px;height:32px;padding:0 11px;outline:none;transition:border-color .12s ease}
.ssh-input:focus,.ssh-textarea:focus{border-color:var(--ssh-focus)}
.ssh-input::placeholder,.ssh-textarea::placeholder{color:var(--ssh-dim)}
.ssh-input.mono,.ssh-textarea.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px}
.ssh-textarea{height:auto;padding:9px 11px;line-height:1.65;resize:vertical;min-height:74px}
.ssh-field{display:flex;flex-direction:column;gap:5px;min-width:0}
.ssh-groupCombo{position:relative;display:flex;align-items:center;gap:4px}
.ssh-groupCombo .ssh-input{flex:1;min-width:0}
.ssh-groupToggle{appearance:none;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;padding:0;border:.5px solid var(--ssh-border-strong);border-radius:var(--ssh-radius-sm);background:var(--ssh-layer-2);color:var(--ssh-text-2);cursor:pointer;flex:0 0 auto}
.ssh-groupToggle:hover{background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-groupMenu{position:absolute;z-index:12;top:calc(100% + 5px);left:0;right:0;max-height:190px;overflow:auto;padding:4px;border:.5px solid var(--ssh-border-strong);border-radius:var(--ssh-radius-md);background:var(--ssh-layer-1);box-shadow:var(--ssh-shadow)}
.ssh-groupOption{appearance:none;display:block;width:100%;padding:6px 8px;border:0;border-radius:6px;background:transparent;color:var(--ssh-text);font:inherit;font-size:12px;text-align:left;cursor:pointer}
.ssh-groupOption:hover,.ssh-groupOption.active{background:var(--ssh-hover)}
.ssh-groupEmpty{padding:6px 8px;font-size:11.5px;color:var(--ssh-text-2)}
.ssh-field.wide{grid-column:1/-1}
.ssh-label{font-size:11.5px;font-weight:500;color:var(--ssh-text-2)}
.ssh-hint{font-size:10.5px;color:var(--ssh-text-3);line-height:1.55}
.ssh-check{appearance:none;display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;padding:0;border:1px solid var(--ssh-border-strong);border-radius:4px;background:transparent;color:var(--ssh-foreground);cursor:pointer;flex:0 0 auto}
.ssh-check.on{background:var(--ssh-brand);border-color:transparent}
.ssh-checkDash{width:7px;height:1.5px;border-radius:1px;background:currentColor}
.ssh-badge{display:inline-flex;align-items:center;gap:4px;height:20px;max-width:220px;padding:0 7px;border-radius:999px;background:var(--ssh-layer-3);font-size:10.5px;line-height:1;color:var(--ssh-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:0 0 auto}
.ssh-badge.ok{color:var(--dsw-alias-state-success-label,var(--ssh-text-2))}
.ssh-badge.brand{color:var(--ssh-brand)}
.ssh-badge.muted{color:var(--ssh-dim)}
.ssh-badge.error{color:var(--ssh-danger)}
.ssh-badge.warn{color:var(--dsw-alias-state-warn-label,var(--ssh-text-2))}
.ssh-switchWrap{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--ssh-text-2);min-width:0}
.ssh-switch{appearance:none;position:relative;display:inline-flex;align-items:center;width:34px;height:20px;padding:2px;border:0;border-radius:999px;background:var(--ssh-border-strong);cursor:pointer;flex:0 0 auto;transition:background .18s ease}
.ssh-switch[aria-checked=true]{background:var(--ssh-success)}
.ssh-switchKnob{display:block;width:16px;height:16px;border-radius:50%;background:var(--dsw-static-neutral-bluish-00,#fff);box-shadow:0 1px 2px var(--dsw-alias-bg-mask-1,rgba(0,0,0,.25));transition:transform .18s ease}
.ssh-switch[aria-checked=true] .ssh-switchKnob{transform:translateX(14px)}
.ssh-switchLabel{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-floating{position:fixed;z-index:80;max-height:70vh;overflow:auto;padding:5px;border:.5px solid var(--ssh-border-strong);border-radius:var(--ssh-radius-md);background:var(--ssh-layer-1);box-shadow:var(--ssh-shadow);animation:sshFade .12s ease}
@keyframes sshFade{from{opacity:0}to{opacity:1}}
.ssh-menuItem{appearance:none;display:flex;align-items:center;gap:8px;width:100%;height:30px;padding:0 9px;border:0;border-radius:6px;background:transparent;color:var(--ssh-text);font:inherit;font-size:12px;text-align:left;cursor:pointer;white-space:nowrap}
.ssh-menuItem:hover:not(:disabled){background:var(--ssh-hover)}
.ssh-menuItem.danger{color:var(--ssh-danger)}
.ssh-menuItem.danger:hover:not(:disabled){background:color-mix(in srgb,var(--ssh-danger) 12%,transparent)}
.ssh-menuItem:disabled{opacity:.4;cursor:not-allowed}
.ssh-menuIcon{display:inline-flex;color:var(--ssh-text-3);flex:0 0 auto}
.ssh-menuItem.danger .ssh-menuIcon{color:currentColor}
.ssh-menuText{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}
.ssh-menuDivider{height:1px;margin:4px 6px;background:var(--ssh-border)}
.ssh-popover{display:flex;flex-direction:column;padding:7px}
.ssh-popTitle{font-size:12px;font-weight:600;padding:2px 4px 7px}
.ssh-popPath{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;color:var(--ssh-text-2);word-break:break-all;padding:0 4px 6px;line-height:1.6}
.ssh-popMeta{font-size:11px;color:var(--ssh-text-3);padding:0 4px 6px;line-height:1.6}
.ssh-popRow{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 4px;font-size:12px}
.ssh-popFoot{display:flex;justify-content:flex-end;padding:7px 2px 2px;border-top:.5px solid var(--ssh-border);margin-top:5px}
.ssh-drawer{position:absolute;inset:0;z-index:40;display:flex;justify-content:flex-end}
.ssh-drawerScrim{position:absolute;inset:0;background:color-mix(in srgb,var(--ssh-bg) 52%,transparent)}
.ssh-drawerPanel{position:relative;display:flex;flex-direction:column;width:min(600px,94vw);height:100%;background:var(--ssh-layer-1);border-left:.5px solid var(--ssh-border-strong);box-shadow:var(--ssh-shadow);animation:sshSlide .18s ease}
@keyframes sshSlide{from{transform:translateX(14px);opacity:.5}to{transform:none;opacity:1}}
.ssh-drawerHead{flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:14px 14px 12px 16px;border-bottom:.5px solid var(--ssh-border)}
.ssh-drawerTitles{min-width:0;flex:1}
.ssh-drawerTitle{font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-drawerSub{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;color:var(--ssh-text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-drawerTabs{flex:0 0 auto;display:flex;gap:20px;padding:0 16px;border-bottom:.5px solid var(--ssh-border)}
.ssh-drawerTab{appearance:none;border:0;background:transparent;color:var(--ssh-text-3);font:inherit;font-size:12.5px;font-weight:500;padding:9px 0 10px;position:relative;cursor:pointer}
.ssh-drawerTab:hover{color:var(--ssh-text)}
.ssh-drawerTab.active{color:var(--ssh-text);font-weight:600}
.ssh-drawerTab.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--ssh-brand);border-radius:2px}
.ssh-drawerBody{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.ssh-terminal{flex:1;min-height:0;display:flex;flex-direction:column;padding:12px 14px 14px;gap:8px}
.ssh-terminalHint{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--ssh-text-3);line-height:1.5}
.ssh-note{display:flex;align-items:flex-start;gap:7px;font-size:11.5px;line-height:1.6;padding:8px 10px;border-radius:var(--ssh-radius-sm);background:var(--ssh-layer-3);color:var(--ssh-text-2)}
.ssh-note.warn{color:var(--dsw-alias-state-warn-label,var(--ssh-text-2))}
.ssh-terminalLog{flex:1;min-height:0;overflow:auto;border:.5px solid var(--ssh-border);border-radius:var(--ssh-radius-md);background:var(--ssh-bg);padding:10px 12px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:1.65}
.ssh-terminalEmpty{color:var(--ssh-dim);padding:4px 0}
.ssh-terminalRunning{display:flex;align-items:center;gap:6px;color:var(--ssh-text-3);font-family:inherit;font-size:11.5px;margin-top:4px}
.ssh-logLine{display:flex;align-items:flex-start;gap:7px;margin:2px 0;word-break:break-word;white-space:pre-wrap}
.ssh-logCommand{color:var(--ssh-text)}
.ssh-logPrompt{color:var(--dsw-alias-state-success-label,var(--ssh-text-2));flex:0 0 auto}
.ssh-logText{white-space:pre-wrap;word-break:break-word;min-width:0}
.ssh-logExit{color:var(--ssh-text-3)}
.ssh-logExitBadge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:16px;padding:0 4px;border-radius:4px;background:var(--ssh-layer-3);font-size:10px;color:var(--ssh-text-2);flex:0 0 auto}
.ssh-logExitBadge.ok{color:var(--dsw-alias-state-success-label,var(--ssh-text-2))}
.ssh-logExitBadge.fail{color:var(--ssh-danger)}
.ssh-logBlock{margin:2px 0 6px;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:1.65;color:var(--ssh-text-2)}
.ssh-logBlock.stderr,.ssh-logBlock.error{color:var(--ssh-danger)}
.ssh-quick{display:flex;gap:6px;flex-wrap:wrap}
.ssh-quickChip{appearance:none;height:22px;padding:0 8px;border:.5px solid var(--ssh-border);border-radius:999px;background:transparent;color:var(--ssh-text-3);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;cursor:pointer}
.ssh-quickChip:hover{background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-terminalBar{display:flex;align-items:center;gap:8px}
.ssh-terminalPrompt{color:var(--ssh-success);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;flex:0 0 auto}
.ssh-terminalInput{flex:1;min-width:0;height:34px;border:.5px solid var(--ssh-border-strong);border-radius:var(--ssh-radius-md);background:var(--ssh-layer-2);color:var(--ssh-text);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;padding:0 10px;outline:none}
.ssh-terminalInput:focus{border-color:var(--ssh-focus)}
.ssh-terminalPane{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;padding:8px 10px 10px;background:var(--ssh-bg)}
.ssh-terminalHost{flex:1;min-height:0;position:relative;overflow:hidden}
.ssh-terminalHost .xterm{height:100%;padding:2px}
.ssh-terminalHost .xterm:focus-within{outline:none}
.ssh-terminalHost .xterm-viewport{background:transparent!important}
.ssh-terminalOverlay{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:24px;text-align:center;background:color-mix(in srgb,var(--ssh-bg) 76%,transparent)}
.ssh-terminalOverlayIcon{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;background:var(--ssh-layer-3);color:var(--ssh-text-3)}
.ssh-terminalOverlayTitle{font-size:13px;font-weight:600;color:var(--ssh-text)}
.ssh-terminalOverlayBody{max-width:560px;font-size:11.5px;line-height:1.7;color:var(--ssh-text-3);word-break:break-word}
.ssh-terminalOverlayActions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.ssh-sessionLayer{flex:1;min-height:0;display:flex;flex-direction:column;background:var(--ssh-bg)}
.ssh-sessionState{width:6px;height:6px;border-radius:50%;background:var(--ssh-dim);flex:0 0 auto}
.ssh-fontGlyph{font-size:10.5px;font-weight:600;letter-spacing:-.4px}
.ssh-terminalSearch{position:absolute;top:8px;right:18px;z-index:5;max-width:calc(100% - 24px);display:flex;align-items:center;gap:5px;padding:5px 7px;border:.5px solid var(--ssh-border-strong);border-radius:10px;background:var(--ssh-layer-1);box-shadow:var(--ssh-shadow);color:var(--ssh-text-3)}
.ssh-terminalSearchInput{width:min(180px,42vw);max-width:100%;height:24px;padding:0 7px;border:.5px solid var(--ssh-border);border-radius:6px;background:var(--ssh-bg);color:var(--ssh-text);font:inherit;font-size:12px;outline:none}
.ssh-terminalSearchInput:focus{border-color:var(--ssh-brand)}
.ssh-terminalSearchBtn{appearance:none;display:inline-flex;align-items:center;justify-content:center;height:24px;min-width:24px;padding:0 5px;border:0;border-radius:6px;background:transparent;color:var(--ssh-text-2);font:inherit;font-size:11px;cursor:pointer}
.ssh-terminalSearchBtn:hover{background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-terminalSearchBtn.on{background:color-mix(in srgb,var(--ssh-brand) 15%,transparent);color:var(--ssh-brand)}
.ssh-terminalMenu{position:absolute;z-index:7;min-width:150px;padding:4px;border:.5px solid var(--ssh-border-strong);border-radius:9px;background:var(--ssh-layer-1);box-shadow:var(--ssh-shadow)}
.ssh-terminalMenuItem{appearance:none;display:flex;align-items:center;width:100%;height:28px;padding:0 9px;border:0;border-radius:6px;background:transparent;color:var(--ssh-text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}
.ssh-terminalMenuItem:hover{background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-sessionState.loading,.ssh-sessionState.connecting{background:var(--ssh-warn)}
.ssh-sessionState.ready{background:var(--ssh-success)}
.ssh-sessionState.error,.ssh-sessionState.closed{background:var(--ssh-danger)}
.ssh-tabLabel{display:inline-flex;align-items:center;gap:5px}
.ssh-tabAlert{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--ssh-danger);flex:0 0 auto}
.ssh-sessions{flex:1;min-height:0;display:flex;flex-direction:column}
.ssh-sessionBar{flex:0 0 auto;display:flex;align-items:center;gap:10px;padding:7px 12px;border-bottom:.5px solid var(--ssh-border);min-height:48px}
.ssh-sessionTabs{flex:1;min-width:0;display:flex;align-items:center;gap:4px;overflow-x:auto;overflow-y:hidden;padding-bottom:1px}
.ssh-sessionTab{display:flex;align-items:center;gap:6px;height:30px;min-width:120px;max-width:230px;padding:0 4px 0 9px;border:.5px solid transparent;border-radius:8px;color:var(--ssh-text-2);cursor:pointer;flex:0 0 auto;font-size:12px;user-select:none}
.ssh-sessionTab:hover{background:var(--ssh-hover)}
.ssh-sessionTab.active{background:var(--ssh-layer-3);border-color:var(--ssh-border-strong);color:var(--ssh-text);box-shadow:inset 0 -2px 0 var(--ssh-brand)}
.ssh-sessionTab:focus-visible{outline:none;box-shadow:0 0 0 2px var(--ssh-focus)}
.ssh-sessionDot{width:6px;height:6px;border-radius:50%;flex:0 0 auto;background:var(--ssh-dim)}
.ssh-sessionDot.ok{background:var(--ssh-success)}
.ssh-sessionDot.warn{background:var(--ssh-warn)}
.ssh-sessionTabTitle{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-sessionTabClose{appearance:none;display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;padding:0;border:0;border-radius:4px;background:transparent;color:var(--ssh-text-3);cursor:pointer;flex:0 0 auto}
.ssh-sessionTabClose:hover{background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-sessionNew{appearance:none;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;border:.5px solid var(--ssh-border);border-radius:7px;background:transparent;color:var(--ssh-text-3);cursor:pointer;flex:0 0 auto}
.ssh-sessionNew:hover{background:var(--ssh-hover);color:var(--ssh-text)}
.ssh-sessionActions{display:flex;align-items:center;gap:4px;flex:0 0 auto}
.ssh-sessionAddress{max-width:240px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;color:var(--ssh-text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-right:2px}
.ssh-sessionPanes{flex:1;min-height:0;display:flex;position:relative}
.ssh-sessionPane{flex:1;min-height:0;display:none;flex-direction:column}
.ssh-sessionPane.active{display:flex}
.ssh-sessionPane .ssh-terminalPane{flex:1}
.ssh-sessionTabs::-webkit-scrollbar{height:6px}
.ssh-sessionTabs::-webkit-scrollbar-thumb{background:var(--dsw-alias-scrollbar-bg-l1,var(--ssh-border));border-radius:999px}
.ssh-files{flex:1;min-height:0;display:flex;flex-direction:column;gap:8px;padding:12px 14px 14px}
.ssh-filesBar{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.ssh-filesPath{flex:1;min-width:140px}
.ssh-fileError{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--ssh-danger)}
.ssh-fileList{flex:1;min-height:0;overflow:auto;border:.5px solid var(--ssh-border);border-radius:var(--ssh-radius-md)}
.ssh-fileRow{display:grid;grid-template-columns:22px minmax(0,1fr) 90px auto;align-items:center;gap:8px;padding:0 10px;height:34px;border-bottom:.5px solid var(--ssh-border);font-size:12px}
.ssh-fileActions{display:flex;align-items:center;gap:2px}
.ssh-fileDialogScrim{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:20px;background:var(--dsw-alias-bg-mask-1,color-mix(in srgb,var(--ssh-text) 18%,transparent))}
.ssh-transferDialog{width:min(460px,100%)}
.ssh-transferFile{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.ssh-fileDialog{width:min(360px,100%);padding:14px;border:.5px solid var(--ssh-border-strong);border-radius:12px;background:var(--ssh-layer-1);box-shadow:var(--ssh-shadow);display:flex;flex-direction:column;gap:10px}
.ssh-fileDialogTitle{font-size:13px;font-weight:600;color:var(--ssh-text)}
.ssh-fileDialogBody{font-size:12px;line-height:1.5;color:var(--ssh-text-2)}
.ssh-fileDialogActions{display:flex;justify-content:flex-end;gap:8px}
.ssh-fileRow:last-child{border-bottom:none}
.ssh-fileRow:hover{background:var(--ssh-hover)}
.ssh-fileIcon{display:inline-flex;color:var(--ssh-text-3)}
.ssh-fileName{appearance:none;border:0;background:transparent;color:var(--ssh-text);font:inherit;font-size:12px;text-align:left;padding:0;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.ssh-fileName:disabled{cursor:default}
.ssh-fileSize{font-size:11px;color:var(--ssh-text-3);text-align:right;font-variant-numeric:tabular-nums}
.ssh-fileEmpty{padding:26px;text-align:center;color:var(--ssh-dim);font-size:12px}
.ssh-details{flex:1;min-height:0;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:18px}
.ssh-section{display:flex;flex-direction:column;gap:8px}
.ssh-sectionHead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:7px;border-bottom:.5px solid var(--ssh-border)}
.ssh-sectionTitle{margin:0;font-size:12.5px;font-weight:600}
.ssh-sectionActions{display:flex;align-items:center;gap:6px}
.ssh-kvGrid{display:grid;grid-template-columns:1fr;gap:0}
.ssh-kv{display:grid;grid-template-columns:110px minmax(0,1fr);gap:10px;align-items:baseline;padding:6px 0;font-size:12px}
.ssh-kvLabel{color:var(--ssh-text-3)}
.ssh-kvValue{color:var(--ssh-text-2);min-width:0;word-break:break-word}
.ssh-kvValue.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}
.ssh-sectionHint{font-size:11.5px;color:var(--ssh-text-3);line-height:1.65}
.ssh-tunnelTypes{display:flex;gap:4px;margin-bottom:8px}
.ssh-snippetList{display:flex;flex-direction:column;gap:4px;margin-bottom:8px}
.ssh-snippetRow{display:grid;grid-template-columns:110px minmax(0,1fr) 26px 26px;align-items:center;gap:6px;padding:4px 6px;border:.5px solid var(--ssh-border);border-radius:6px;font-size:11.5px}
.ssh-snippetName{font-weight:500;overflow:hidden;text-overflow:ellipsis}
.ssh-snippetCommand{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;color:var(--ssh-text-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ssh-snippetForm{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.ssh-snippetForm .ssh-input{width:150px}
.ssh-snippetForm .ssh-input:nth-of-type(2){flex:1;min-width:180px}
.ssh-snippetOutput{margin-top:8px;border:.5px solid var(--ssh-border);border-radius:6px;overflow:hidden}
.ssh-snippetOutputHead{display:flex;align-items:center;justify-content:space-between;padding:4px 8px;background:var(--ssh-layer-2);font-size:11px}
.ssh-snippetOutput pre{margin:0;padding:8px;max-height:220px;overflow:auto;font-size:11px;line-height:1.45;white-space:pre-wrap;background:var(--ssh-bg)}
.ssh-remoteEditor{width:min(760px,100%)}
.ssh-remoteEditor .ssh-textarea{min-height:340px;max-height:58vh;font-size:12px;line-height:1.5}
.ssh-transferList{display:flex;flex-direction:column;gap:3px;margin-bottom:6px}
.ssh-transferRow{display:grid;grid-template-columns:minmax(0,1fr) 60px 70px;gap:8px;align-items:center;padding:4px 8px;border-radius:6px;background:var(--ssh-layer-2);font-size:11px;color:var(--ssh-text-2)}
.ssh-transferRow.error{color:var(--ssh-danger)}
.ssh-transferName{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ssh-transferKind{font-size:10px;color:var(--ssh-text-3);text-transform:uppercase}
.ssh-transferStatus{text-align:right;font-size:10px}
.ssh-approvalChoice{display:flex;gap:6px}
.ssh-auditList{display:flex;flex-direction:column;gap:4px;margin-top:8px}
.ssh-auditRow{display:grid;grid-template-columns:8px 130px 100px minmax(0,1fr) auto;align-items:center;gap:8px;padding:5px 8px;border:.5px solid var(--ssh-border);border-radius:6px;background:var(--ssh-layer-2);font-size:11px}
.ssh-auditRow code{font-size:10.5px;color:var(--ssh-text-2);overflow:hidden;text-overflow:ellipsis}
.ssh-auditDot{width:6px;height:6px;border-radius:50%;background:var(--ssh-success)}
.ssh-auditDot.error{background:var(--ssh-danger)}
.ssh-auditHost{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--ssh-text-2);overflow:hidden;text-overflow:ellipsis}
.ssh-auditDetail{color:var(--ssh-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ssh-auditRow time{color:var(--ssh-text-3);white-space:nowrap}
.ssh-tunnelType{appearance:none;height:26px;padding:0 10px;border:.5px solid var(--ssh-border);border-radius:999px;background:transparent;color:var(--ssh-text-2);font:inherit;font-size:11.5px;cursor:pointer}
.ssh-tunnelType.active{background:color-mix(in srgb,var(--ssh-brand) 12%,transparent);border-color:var(--ssh-brand);color:var(--ssh-brand)}
.ssh-tunnelForm{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.ssh-tunnelForm .ssh-input{width:100px;min-width:0}
.ssh-tunnelForm .ssh-input:nth-of-type(2){width:150px}
.ssh-tunnelArrow{color:var(--ssh-text-2);font-size:12px}
.ssh-tunnelList{display:flex;flex-direction:column;gap:4px}
.ssh-tunnelRow{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 8px;border:.5px solid var(--ssh-border);border-radius:var(--ssh-radius-sm);background:var(--ssh-layer-2);font-size:11.5px}
.ssh-tunnelRow code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--ssh-text-2);overflow:hidden;text-overflow:ellipsis}
.ssh-credentialReveal{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:2px}
.ssh-revealValue{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;padding:5px 8px;border:.5px solid var(--ssh-border-strong);border-radius:6px;background:var(--ssh-layer-3);color:var(--ssh-text);word-break:break-all;user-select:all}
.ssh-revealWarning{display:flex;align-items:flex-start;gap:5px;color:var(--ssh-warn)}
.ssh-tags{display:flex;gap:5px;flex-wrap:wrap}
.ssh-detailsActions{display:flex;gap:8px;padding-top:2px}
.ssh-credentialRow{display:flex;align-items:center;gap:6px}
.ssh-credentialRow .ssh-input{flex:1;min-width:100px}
.ssh-formGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ssh-formSection{display:flex;flex-direction:column;gap:12px;padding-top:4px}
.ssh-formSection + .ssh-formSection{margin-top:16px;padding-top:14px;border-top:.5px solid var(--ssh-border)}
.ssh-formHead{font-size:12px;font-weight:600;color:var(--ssh-text-2)}
.ssh-formSwitch{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:2px 0}
.ssh-formError{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--ssh-danger)}
.ssh-modalMask{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:24px;background:color-mix(in srgb,var(--ssh-bg) 52%,transparent);backdrop-filter:blur(2px)}
.ssh-modal{width:100%;max-height:88vh;display:flex;flex-direction:column;border-radius:var(--ssh-radius-lg);border:.5px solid var(--ssh-border-strong);background:var(--ssh-layer-1);box-shadow:var(--ssh-shadow);outline:none;animation:sshModalIn .16s ease}
@keyframes sshModalIn{from{opacity:0;transform:translateY(6px) scale(.995)}to{opacity:1;transform:none}}
.ssh-modalHead{flex:0 0 auto;display:flex;align-items:flex-start;gap:10px;padding:16px 18px 12px}
.ssh-modalIcon{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;background:var(--ssh-layer-3);color:var(--ssh-brand)}
.ssh-modalTitles{flex:1;min-width:0}
.ssh-modalTitle{font-size:15px;font-weight:600;line-height:22px}
.ssh-modalSubtitle{font-size:11.5px;color:var(--ssh-text-3);line-height:1.55;margin-top:1px}
.ssh-modalBody{flex:1;min-height:0;overflow:auto;padding:4px 18px 16px}
.ssh-modalFoot{flex:0 0 auto;display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:12px 18px;border-top:.5px solid var(--ssh-border)}
.ssh-confirmBody{font-size:12.5px;color:var(--ssh-text-2);line-height:1.7}
.ssh-groupList{display:flex;flex-direction:column}
.ssh-groupRow{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:.5px solid var(--ssh-border);flex-wrap:wrap}
.ssh-groupRow:last-child{border-bottom:none}
.ssh-groupMain{flex:1;min-width:120px}
.ssh-groupTitle{font-size:12.5px;font-weight:500}
.ssh-groupMeta{font-size:11px;color:var(--ssh-text-3)}
.ssh-groupActions{display:flex;align-items:center;gap:6px;flex:1;justify-content:flex-end;min-width:260px}
.ssh-groupActions .ssh-input{height:28px;width:150px;flex:0 1 150px}
.ssh-page{flex:1;min-height:0;overflow:auto;padding:22px 24px 48px}
.ssh-pageInner{max-width:1040px;margin:0 auto;display:flex;flex-direction:column;gap:16px}
.ssh-pageHead{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.ssh-pageTitle{margin:0;font-size:18px;font-weight:600}
.ssh-card{border:.5px solid var(--ssh-border);border-radius:var(--ssh-radius-lg);background:var(--ssh-layer-1);padding:16px 18px;display:flex;flex-direction:column;gap:12px;min-width:0}
.ssh-cardHead{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.ssh-cardHead h3{margin:0;font-size:13px;font-weight:600}
.ssh-cardDesc{margin:0;font-size:11.5px;color:var(--ssh-text-3);line-height:1.7}
.ssh-cardActions{display:flex;align-items:center;gap:8px}
.ssh-settingRow{display:flex;align-items:center;gap:12px;padding:7px 0;border-top:.5px solid var(--ssh-border);min-width:0}
.ssh-settingRow:first-child{border-top:none}
.ssh-settingLabel{flex:0 0 auto;width:120px;font-size:11.5px;color:var(--ssh-text-3)}
.ssh-settingValue{flex:1;min-width:0;font-size:12px;word-break:break-all}
.ssh-settingValue.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;color:var(--ssh-text-2)}
.ssh-switchList{display:flex;flex-direction:column}
.ssh-vaultMeta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:11.5px;color:var(--ssh-text-3)}
.ssh-dot{width:3px;height:3px;border-radius:50%;background:var(--ssh-dim)}
.ssh-batchRow{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.ssh-targetSearch{position:relative;display:flex;align-items:center;flex:0 1 300px;min-width:160px}
.ssh-targetSearch > svg{position:absolute;left:10px;color:var(--ssh-dim);pointer-events:none;z-index:1}
.ssh-targetSearch .ssh-input{height:28px;padding-left:30px;border-radius:999px;font-size:11.5px}
.ssh-targetList{max-height:240px;overflow:auto;border:.5px solid var(--ssh-border);border-radius:var(--ssh-radius-md);padding:4px}
.ssh-targetRow{display:flex;align-items:center;gap:9px;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:12px;min-width:0}
.ssh-targetRow:hover{background:var(--ssh-hover)}
.ssh-targetRow.on{background:color-mix(in srgb,var(--ssh-brand) 7%,transparent)}
.ssh-targetName{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:0 1 auto;min-width:0}
.ssh-targetAddr{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;color:var(--ssh-text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-left:auto;max-width:45%}
.ssh-targetCred{flex:0 0 auto}
.ssh-results{display:flex;flex-direction:column;gap:10px}
.ssh-resultsStats{font-size:11.5px;color:var(--ssh-text-3);font-variant-numeric:tabular-nums}
.ssh-result{padding:10px 12px;border:.5px solid var(--ssh-border);border-radius:var(--ssh-radius-md);background:var(--ssh-bg)}
.ssh-resultHead{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ssh-resultDot{width:7px;height:7px;border-radius:50%;background:var(--ssh-dim);flex:0 0 auto}
.ssh-resultDot.ok{background:var(--ssh-success)}
.ssh-resultDot.fail{background:var(--ssh-danger)}
.ssh-resultHost{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;font-weight:500}
.ssh-resultMeta{font-size:11px;color:var(--ssh-text-3);margin-left:auto}
.ssh-resultOutput{margin:6px 0 0;padding:8px 10px;border-radius:var(--ssh-radius-sm);background:var(--ssh-layer-1);border:.5px solid var(--ssh-border);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:1.6;white-space:pre-wrap;word-break:break-word;max-height:200px;overflow:auto;color:var(--ssh-text-2)}
.ssh-resultError{font-size:11.5px;color:var(--ssh-danger);margin-top:6px;word-break:break-word}
.ssh-toast{position:fixed;right:24px;bottom:24px;z-index:120;display:flex;align-items:center;gap:8px;max-width:420px;padding:9px 14px;border-radius:10px;background:var(--dsw-alias-toast-bg,var(--ssh-layer-1));color:var(--dsw-alias-toast-label,var(--ssh-text));font-size:12px;line-height:1.5;box-shadow:var(--ssh-shadow);border:.5px solid var(--ssh-border-strong);animation:sshToastIn .16s ease}
@keyframes sshToastIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.ssh-toastDot{width:7px;height:7px;border-radius:50%;background:var(--ssh-brand);flex:0 0 auto}
.ssh-toast.success .ssh-toastDot{background:var(--ssh-success)}
.ssh-toast.error .ssh-toastDot{background:var(--ssh-danger)}
.ssh-srOnly{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.ssh-tree::-webkit-scrollbar,.ssh-tableScroll::-webkit-scrollbar,.ssh-details::-webkit-scrollbar,.ssh-terminalLog::-webkit-scrollbar,.ssh-fileList::-webkit-scrollbar,.ssh-page::-webkit-scrollbar,.ssh-modalBody::-webkit-scrollbar,.ssh-floating::-webkit-scrollbar,.ssh-targetList::-webkit-scrollbar{width:10px;height:10px}
.ssh-tree::-webkit-scrollbar-thumb,.ssh-tableScroll::-webkit-scrollbar-thumb,.ssh-details::-webkit-scrollbar-thumb,.ssh-terminalLog::-webkit-scrollbar-thumb,.ssh-fileList::-webkit-scrollbar-thumb,.ssh-page::-webkit-scrollbar-thumb,.ssh-modalBody::-webkit-scrollbar-thumb,.ssh-floating::-webkit-scrollbar-thumb,.ssh-targetList::-webkit-scrollbar-thumb{background:var(--dsw-alias-scrollbar-bg-l1,var(--ssh-border));border-radius:999px;border:2px solid transparent;background-clip:padding-box}
.ssh-tree::-webkit-scrollbar-thumb:hover,.ssh-tableScroll::-webkit-scrollbar-thumb:hover,.ssh-details::-webkit-scrollbar-thumb:hover,.ssh-terminalLog::-webkit-scrollbar-thumb:hover,.ssh-fileList::-webkit-scrollbar-thumb:hover,.ssh-page::-webkit-scrollbar-thumb:hover,.ssh-modalBody::-webkit-scrollbar-thumb:hover,.ssh-floating::-webkit-scrollbar-thumb:hover,.ssh-targetList::-webkit-scrollbar-thumb:hover{background:var(--dsw-alias-scrollbar-hover-l1,var(--ssh-border-strong));border:2px solid transparent;background-clip:padding-box}
@media (max-width: 900px){
.ssh-body{grid-template-columns:minmax(0,1fr)}
.ssh-treeResizer{display:none}
.ssh-sidebar{position:absolute;top:0;bottom:0;left:0;width:290px;z-index:25;display:none;box-shadow:var(--ssh-shadow)}
.ssh-sidebar.open{display:flex}
.ssh-body:not(.collapsed) .ssh-sideScrim{display:block;position:absolute;inset:0;z-index:20;background:color-mix(in srgb,var(--ssh-bg) 45%,transparent)}
.ssh-body.collapsed{grid-template-columns:minmax(0,1fr)}
.ssh-pathBtn .ssh-btnLabel{display:none}
.ssh-configPath{display:none}
.ssh-sessionAddress{display:none}
}
@media (max-width: 720px){
.ssh-top{padding:0 12px}
.ssh-mainTop{padding:8px 10px;flex-wrap:wrap;min-height:0}
.ssh-search{flex:1 1 160px}
.ssh-context{max-width:120px}
.ssh-mainTop .ssh-toolSpacer{display:none}
.ssh-toolDivider{display:none}
.ssh-infoToggle .ssh-switchLabel{display:none}
.ssh-grid{padding:0 8px;column-gap:6px}
.ssh-batchBar{padding:6px 10px;flex-wrap:wrap}
.ssh-page{padding:16px 14px 40px}
.ssh-modalMask{padding:12px}
.ssh-formGrid{grid-template-columns:1fr}
.ssh-field.wide{grid-column:auto}
.ssh-groupActions{min-width:0;justify-content:flex-start}
.ssh-sessionBar{padding:6px 8px;gap:6px}
.ssh-sessionTab{min-width:96px;max-width:160px}
}
`;

    // ---------------------------------------------------------------------
    // Plugin entry
    // ---------------------------------------------------------------------

    /** Last-resort boundary: a render bug shows a retry panel instead of blanking the slot. */
    class UiErrorBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
        this.retry = this.retry.bind(this)
      }

      static getDerivedStateFromError(error) {
        return { error }
      }

      componentDidCatch(error) {
        console.error('dsh-ssh-manage: interface error', error)
      }

      retry() {
        this.setState({ error: null })
      }

      render() {
        if (!this.state.error) return this.props.children
        const message = this.state.error?.message ?? String(this.state.error)
        return h(
          'div',
          { className: 'ssh-root' },
          h('style', null, CSS),
          h(
            'div',
            { className: 'ssh-loadingPage' },
            h(IconAlert, { size: 22 }),
            h('span', null, String(this.props.title ?? '{message}').replace('{message}', message)),
            h(Button, { onClick: this.retry }, this.props.retryLabel ?? 'Retry'),
          ),
        )
      }
    }

    /** Sidebar entry glyph, sized by the sidebar. */
    function PanelIcon({ size }) {
      return h(IconTerminal, { size: typeof size === 'number' && size > 0 ? size : 18 })
    }

    /**
     * Register the sidebar entry and the management page.
     * @param ctx - browser plugin context.
     */
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, 'zh', ZH), 'dsh-ssh-manage: zh dictionary')
      ctx.effect(() => ctx.locale.register(NS, 'en', EN), 'dsh-ssh-manage: en dictionary')
      const t = ctx.locale.bind(NS)
      const BoundPage = (props) =>
        h(
          UiErrorBoundary,
          { title: t('state.uiError'), retryLabel: t('state.retry') },
          h(App, { ...props, ctx }),
        )
      ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL_ID, locale: NS }, BoundPage))
      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register(
          {
            name: 'sidebar.panellist',
            id: PANEL_ID,
            order: 26,
            label: () => t('panel'),
            locale: NS,
          },
          PanelIcon,
        ),
      )
    }

    return { inject: ['slots', 'locale'], apply }
  },
})
