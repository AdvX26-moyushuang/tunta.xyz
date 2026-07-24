# Tunta Expo

**让积灰的收藏重新可用。**

Tunta 项目的官方展示站点，用于向外部访客介绍 Tunta 的产品理念、架构设计与项目进度。

> 本仓库是展示页面，**不是** Tunta 桌面应用本身。  
> Tunta 产品源码与合同规范见主仓库。

---

## 技术栈

| 层级 | 选型 |
| --- | --- |
| 构建工具 | [Vite](https://vite.dev/) |
| 框架 | [Vue 3](https://vuejs.org/)（Composition API + `<script setup>`） |
| 语言 | [TypeScript](https://www.typescriptlang.org/)（strict 模式） |
| 动画 | [anime.js v4](https://animejs.com/) |
| 包管理 | [pnpm](https://pnpm.io/) |

## 快速开始

### 前置要求

- Node.js >= 18
- pnpm >= 9

### 安装与开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器（热更新）
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 类型检查
pnpm type-check
```

## 项目结构

```
src/
├── assets/          # 静态资源（图片、字体、SVG）
├── components/      # 可复用 UI 组件
├── composables/     # Vue composables（含动画逻辑）
├── sections/        # 页面区块级组件（Hero、Architecture、Timeline 等）
├── styles/          # 全局样式与主题变量
├── types/           # 全局 TypeScript 类型定义
└── main.ts          # 应用入口
```

## 关于 Tunta

Tunta 是一个 local-first 桌面产品，帮助人们将散落在各平台的收藏内容转化为可回看、可检索、可复用的材料。

三条核心工作流：

- **收藏** — 从桌面或浏览器保存 URL，并记录收藏原因
- **回看** — 将收藏内容重新呈现为简短卡片，每张卡都能返回原始证据
- **调用** — 使用关键词或自然语言检索本地收藏库，获得带来源引用的回答

详见 [tunta-README.md](./tunta-README.md)。

## Agent 规则

本仓库包含 [AGENTS.md](./AGENTS.md)，所有 coding agent 在进入项目前必须先阅读并遵守其中的约定，包括：

- 统一使用 pnpm
- 代码风格与目录约定
- 自动化脚本失败处理流程

## 许可证

待确定。
