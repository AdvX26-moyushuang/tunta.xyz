
# Tunta 屯獭

English version: [Jump to English](#english)

**让积灰的收藏重新可用。**

Tunta 面向那些收藏了大量视频、文章和链接，却很少能再次找到并使用它们的人。它想把散落在不同平台的收藏，转成可回看、可检索、可复用，而且始终能回到原始证据的材料。

我们做 Tunta，基于一个很简单的判断：收藏并不难，难的是以后能否在正确的时机找回正确的内容，同时保留足够的上下文去判断它是否可信、是否能用。桌面萌宠让收藏入口与处理状态可见，但产品价值真正发生在从来源、证据到再次调用的闭环里。

AI 在这里不替代人的判断。它负责把原始材料转成可检索的单元和卡片，同时保留回到原文、时间戳与原始 URL 的路径。

> **项目状态：** Tunta 当前处于产品定义与接口合同阶段，App 尚不可安装。

## Tunta 是什么

Tunta 是一个 local-first 桌面产品，包含三条相连的工作流：

- **收藏：** 从桌面或浏览器保存 URL，并记录为什么要收藏。
- **回看：** 把收藏内容重新呈现为简短卡片，每张卡都能返回原始证据。
- **调用：** 使用关键词或自然语言检索本地收藏库，获得带来源引用的回答。

桌面萌宠只是收藏入口和处理状态界面，不是产品核心。

## MVP 目标

第一版可用产品计划包含：

- 桌面端与浏览器端的主动 URL 收藏入口。
- B 站字幕提取与普通网页解析。
- 视频无字幕时可选本地 Whisper 转写，下载媒体前必须获得用户确认。
- 在本地保存原文、转写稿、索引和收藏状态。
- 关键词与语义检索，结果必须带原始来源。
- 支持打开原文、跳过和归档的轻量回看流程。
- 可见的 `idle`、`fetching`、`parsing`、`done`、`failed` 状态。

## 当前仓库状态

当前仓库包含产品需求、开发边界、跨模块合同、fixtures 和合同校验工具，尚未包含可运行的 frontend、backend 或桌面 App。

两道 versioned handoff 是：

- `contracts/parser-output/0.1.0/`：Parser → Intelligence
- `contracts/intelligence-output/0.1.0/`：Intelligence → App

内部 RAG 模型可以独立演进，但每张生成卡片都必须能追溯到 Parser block、locator 和原始 URL。

## 校验合同

依赖：

- Python 3.10 或更高版本
- [uv](https://docs.astral.sh/uv/)

运行：

```bash
uv run --with "jsonschema[format]>=4.20,<5" python contracts/validate.py
```

校验器会检查两份 schema、全部 fixtures、ID 唯一性、时间戳范围、Graph 引用和卡片到原始证据的引用链。合同无效时会以非零状态退出。

## 架构

```text
URL
  -> Parser
  -> Parser Output
  -> Intelligence Adapter
  -> RAG / 领域与项目双链 / Cards
  -> Intelligence Output
  -> Backend
  -> Frontend
```

Parser、Intelligence 与 App 不读取彼此的内部表，versioned JSON contract 是唯一集成边界。

## 仓库结构

| 路径 | 用途 |
| --- | --- |
| `apps/` | Frontend 与 backend 产品入口 |
| `modules/parser/` | URL 抓取与原始内容解析 |
| `modules/intelligence/` | RAG、轻量知识关联与卡片生成 |
| `contracts/` | Versioned schema、fixtures 与语义校验 |
| `docs/` | 产品需求与开发边界 |
| `AGENTS.md` | 团队共享的 coding agent 规则 |

产品范围见 [docs/DEV.md](docs/DEV.md)，Owner 与集成规则见 [docs/development-boundaries.md](docs/development-boundaries.md)。

## 数据与隐私边界

- 原文、转写稿、索引和收藏状态默认 local-first。
- 浏览器插件只在用户主动收藏时读取当前页面。
- Tunta 不扫描浏览历史，也不保存小红书 Cookie、账号信息或私有收藏夹。
- 本地 Whisper 下载媒体前必须征得用户确认，并说明预计耗时与磁盘占用。
- 失败时保留来源、阶段和错误类型，不生成看似合理的空结果。

## 当前限制

- App 尚不可运行。
- 第一批来源只考虑 B 站与普通网页。
- 登录态抓取、自动导入完整收藏历史、电商适配和宠物养成不在 MVP。
- 知识图谱可视化不在 MVP；当前合同只表达轻量的领域与项目关联。
- Contract 仍处于 `0.x` 协商期，进入 `1.0.0` 前可能出现 breaking change。

---

<a id="english"></a >

# Tunta

**Make dusty bookmarks useful again.**

Tunta is for people who save useful videos, articles, and links but rarely find them again. It turns scattered bookmarks into source-grounded material that can be reviewed, searched, and reused.

We are building Tunta around a simple observation: capturing is not the hard part. The hard part is recovering the right idea later, with enough context to trust and use it. A small desktop pet makes capture and processing status visible, but the product value lives in the loop from source to evidence to recall.

AI does not replace judgment here. It helps transform raw source material into searchable units and cards while preserving the path back to the original text, timestamp, and URL.

> **Project status:** Tunta is currently in the product-definition and interface-contract stage. The application is not installable yet.

## What Tunta Is

Tunta is a local-first desktop product with three connected workflows:

- **Capture:** Save a URL from the desktop or browser and record why it matters.
- **Review:** Resurface saved content as concise cards that always link back to evidence.
- **Recall:** Search the local library with keywords or natural language and receive source-cited answers.

The desktop pet is an entry point and a processing-status surface. It is not the core product.

## MVP Target

The first usable release is planned to include:

- Desktop and browser entry points for explicit URL capture.
- Bilibili subtitle extraction and ordinary web-page parsing.
- Optional local Whisper transcription when subtitles are unavailable, with user confirmation before media download.
- Local storage for source text, transcripts, indexes, and bookmark state.
- Keyword and semantic retrieval with original-source citations.
- A lightweight review flow for opening, skipping, and archiving saved material.
- Visible `idle`, `fetching`, `parsing`, `done`, and `failed` states.

## Current Repository Status

This repository currently contains the product specification, development boundaries, cross-module contracts, fixtures, and contract validation tooling. It does not yet contain a runnable frontend, backend, or desktop application.

The two versioned handoffs are:

- `contracts/parser-output/0.1.0/`: Parser → Intelligence
- `contracts/intelligence-output/0.1.0/`: Intelligence → App

Internal RAG models may evolve independently, but every generated card must remain traceable to parser blocks, locators, and the original URL.

## Validate the Contracts

Requirements:

- Python 3.10 or newer
- [uv](https://docs.astral.sh/uv/)

Run:

```bash
uv run --with "jsonschema[format]>=4.20,<5" python contracts/validate.py
```

The validator checks both schemas, all fixtures, ID uniqueness, timestamp ranges, graph references, and card-to-source evidence links. It exits with a non-zero status when a contract is invalid.

## Architecture

```text
URL
  -> Parser
  -> Parser Output
  -> Intelligence Adapter
  -> RAG / Domain & Project Links / Cards
  -> Intelligence Output
  -> Backend
  -> Frontend
```

Parser, Intelligence, and App code do not read one another's internal tables. Versioned JSON contracts are the integration boundary.

## Repository Structure

| Path | Purpose |
| --- | --- |
| `apps/` | Frontend and backend product surfaces |
| `modules/parser/` | URL fetching and source extraction |
| `modules/intelligence/` | RAG, lightweight knowledge links, and card generation |
| `contracts/` | Versioned schemas, fixtures, and semantic validation |
| `docs/` | Product specification and development boundaries |
| `AGENTS.md` | Shared repository rules for coding agents |

See [docs/DEV.md](docs/DEV.md) for the product scope and [docs/development-boundaries.md](docs/development-boundaries.md) for ownership and integration rules.

## Data and Privacy Boundaries

- Source text, transcripts, indexes, and bookmark state are local-first by default.
- The browser extension only reads a page after an explicit capture action.
- Tunta does not scan browser history or store Xiaohongshu cookies, account data, or private collections.
- Local Whisper must ask for confirmation before downloading media and explain expected time and disk cost.
- Failures preserve the source, stage, and error type instead of generating a plausible-looking empty result.

## Limitations

- The application is not runnable yet.
- The initial source targets are Bilibili and ordinary web pages.
- Logged-in scraping, automatic import of complete bookmark histories, e-commerce adapters, and pet progression are outside the MVP.
- Knowledge-graph visualization is outside the MVP; the current contract only models lightweight domain and project links.
- Contracts are in the `0.x` negotiation stage and may introduce breaking changes before `1.0.0`.
