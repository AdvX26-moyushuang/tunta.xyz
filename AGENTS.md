# AGENTS.md — Tunta Expo

本文件为所有 coding agent（Copilot、Cursor、Qoder、Devin 等）提供仓库级规则。  
任何 agent 在进入本仓库前 **必须** 先阅读并遵守以下约定。

---

## 1. 包管理器

- **统一使用 pnpm**。任何 agent 都不得直接使用 npm 或 yarn。
- 安装依赖：`pnpm install`
- 添加依赖：`pnpm add <pkg>`（生产）/ `pnpm add -D <pkg>`（开发）
- 运行脚本：`pnpm run <script>`
- 如系统未安装 pnpm，通过 `corepack enable` 或 `npm i -g pnpm` 安装后继续。

## 2. 技术栈

| 层级 | 选型 |
| --- | --- |
| 构建工具 | Vite |
| 框架 | Vue 3（Composition API + `<script setup>`） |
| 语言 | TypeScript（strict 模式） |
| 动画 | anime.js v4 |
| 样式 | CSS Modules 或 UnoCSS（按需引入） |
| 包管理 | pnpm |

## 3. 项目定位

本仓库 `tunta-expo` 是 Tunta 项目的 **官方展示站点**，用于向外部访客介绍 Tunta 的产品理念、架构与进度。  
它 **不是** Tunta 桌面应用本身，而是一个独立的营销/信息展示页面。

## 4. 代码风格

- 使用 `<script setup lang="ts">` 语法，禁止 Options API。
- 组件命名使用 PascalCase，文件命名使用 PascalCase（如 `HeroSection.vue`）。
- 所有公共函数与组件 props 必须有 TypeScript 类型标注。
- 优先使用 Composition API 的组合式函数（composables）封装可复用逻辑。
- 动画逻辑统一通过 anime.js 封装在 composable 或独立模块中，不在组件模板中直接调用。

## 5. 目录约定

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

## 6. 提交规范

- 遵循 Conventional Commits（如 `feat: add hero section`、`fix: correct animation timing`）。
- 提交信息使用英文，时态为祈使句。
- 不得提交 `node_modules`、`dist` 或任何构建产物。

## 7. 国际化

- 展示站点需同时支持中文与英文内容。
- 文案内容集中在 `src/i18n/` 或 `src/content/` 管理，不在组件中硬编码。

## 8. 性能与可访问性

- 动画需尊重 `prefers-reduced-motion` 媒体查询。
- 图片使用懒加载，关键资源使用 preload。
- 确保语义化 HTML 与 ARIA 标签。

## 9. 自动化脚本失败处理

- 当 agent 执行自动化脚本（如 `pnpm create vite`、`pnpm install`、构建命令等）遇到交互式提示、权限问题、网络超时或任何非预期阻塞时，**必须立即停止尝试并请求用户介入处理**。
- 禁止 agent 反复重试失败的自动化命令超过 **两次**。
- 禁止 agent 使用 `--yes`、`--force`、`--overwrite` 等跳过确认的 flag 来绕过交互式提示，除非用户明确授权。
- 请求用户处理时，agent 应清晰说明：
  1. 正在执行什么操作
  2. 遇到了什么具体错误或提示
  3. 建议用户如何操作（如有）

## 10. 禁止事项

- 禁止引入 Vue 以外的 UI 框架（如 React、Svelte）。
- 禁止使用 `any` 类型，除非有明确注释说明原因。
- 禁止在组件中直接操作 DOM（使用 `ref` + anime.js）。
- 禁止绕过 pnpm 使用其他包管理器。
