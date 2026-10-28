<div align="center">

# dsh-plugins

**DeepSeek Harness (DSH) Web 插件集合。**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

</div>

---

本仓库是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的插件 monorepo。每个插件都是独立可安装的 npm 包，放在仓库根目录的独立子目录中。

## 插件

### [dsh-mcp-skill-manage](dsh-mcp-skill-manage/README.md)

在 DSH 侧边栏统一管理 agent 工具的 **Skills** 与 **MCP Servers**：跨 DSH、Claude Code、Codex、Cursor 等工具增删改查、共享、导入导出、备份恢复。当前版本 `0.5.5`。

### [dsh-ssh-manage](dsh-ssh-manage/README.md)

在 DSH 侧边栏管理 SSH 主机，支持密码登录、主机分组、批量命令、文件传输和**真正的交互式 PTY 终端**（xterm.js，标签页会话）。当前版本 `0.1.0`。

## 安装

- `dsh-mcp-skill-manage` 已发布到 npm，可在 DSH 的「插件」/「插件市场」中搜索安装。
- `dsh-ssh-manage` 尚未发布 npm，从本仓库对应子目录本地安装/链接；npm 包名 `dsh-ssh-manage` 目前未被占用，后续可发布。

要求：

- Node.js >= 20
- DSH >= 0.2.1-rc.3 且 < 0.3.0
- 安装或更新插件后，Host 侧新增路由需要重启 DSH 才会生效（详见各插件 README）

## 开发

```bash
# SSH 管理插件
cd dsh-ssh-manage
npm install
npm test

# MCP & Skill 管理插件
cd ../dsh-mcp-skill-manage
npm test
```

两个插件都没有构建步骤：`index.js` 是 Host 端入口，`client.js` 是浏览器端入口。

## 目录结构

```
dsh-plugins/
├── dsh-mcp-skill-manage/   # MCP & Skill Manager
├── dsh-ssh-manage/         # SSH Manager
└── LICENSE
```

## License

[MIT](LICENSE) © 2026 Sun
