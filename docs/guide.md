# Overview

Tealina 需要一些基本的配置, 使用 create-tealina 快速开始.

## 创建脚手架项目

::: tip Node 版本
Tealina 确保你的 [Node.js](https://nodejs.org/en/) 版本是 18+. 20+.
:::

::: code-group

```bash [PNPM]
$ pnpm create tealina

```

```bash [NPM]
$ npm create tealina@latest
```

```bash [Yarn]
$ yarn create tealina
```

<!-- ```bash [Bun]
$ bunx create-vite
``` -->
:::

跟随提示,创建成功后,查看 server/README.md

其他服务端框架的模版暂时未提供,欢迎贡献.

前端项目由内部直接调用 [`create-vite`](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) 创建
