# DogUpUp DevTools (dogupup.com)

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 🌐 语言 / Languages

*   [简体中文](#简体中文)
*   [English](#english)

---

<a name="简体中文"></a>
## 简体中文

**DogUpUp DevTools** 是一款专为程序员打造的极简、硬核在线工具箱。我们追求极致的性能与 SEO，致力于在有限的硬件资源（1C2G VPS）下提供最流畅的开发辅助体验。

---

### 🚀 核心功能清单

1.  **Maven 依赖排查器 (`/maven-tree`)**
    *   解析 `mvn dependency:tree` 文本输出。
    *   可视化依赖树，高亮显示版本冲突 `(conflicted with ...)`。
    *   基于 ECharts 的树状图展示。
2.  **Cron 翻译官 (`/cron`)**
    *   支持 Spring/Quartz 等 Cron 表达式解析。
    *   自然语言描述执行逻辑（中英文支持）。
    *   预测并展示未来 7 次执行时间轴。
3.  **Logback/Log4j2 生成器 (`/log-config`)**
    *   交互式生成 XML 配置，告警级别、日志路径一键配置。
4.  **JSON 实验室 (`/json-lab`)**
    *   交互式 JSON 结构解析、格式化与多语言代码生成，超越传统在线工具的深度体验。
5.  **JVM 调优配方 (`/jvm-tuning`)**
    *   根据服务器硬件配置，自动生成极致优化的 JVM 启动参数。

---

### 🛠 技术栈 (The Ultra-Lean Stack)

项目采用 **Next.js 单体全栈方案**，以实现最低的内存占用和最优的 SEO 表现。

*   **全栈框架**: Next.js 14+ (App Router)
*   **前端语言**: TypeScript
*   **样式处理**: Tailwind CSS + Shadcn UI (暗黑模式优先)
*   **状态管理**: React Context / URL Query String
*   **可视化**: ECharts / Framer Motion
*   **部署方式**: Docker (Node.js Standalone 模式)

---

### 📏 编码规范与设计原则

为了保持项目的轻量化与可维护性，我们遵循以下准则：

1.  **极简主义**: 严禁引入重型第三方库（如用 `date-fns` 替换 `Moment.js`，或优先使用原生 API）。
2.  **性能至上**: 
    *   简单逻辑（如正则解析、格式化）优先在 **Client-Side** 执行。
    *   SEO 内容（工具说明、技术背景）必须由 **Server-Side Rendering (SSR)** 提供。
3.  **内存约束**: 生产环境 Node.js 进程限制在 **256MB** 内存以内。
4.  **无状态设计**: 不使用本地数据库，所有处理均为无状态或利用外部 API。
5.  **SEO 友好**: 每个工具页面包含 500 字以上的技术背景 Markdown 内容。
6.  **原子化目录**: 一个工具页面一个独立目录，逻辑清晰，易于横向扩展。

---

### 📂 目录结构

```text
src/
├── app/               # 页面路由 (App Router)
│   ├── maven-tree/    # Maven 工具
│   ├── cron/          # Cron 工具
│   └── ...
├── components/        # UI 与业务组件
│   ├── ui/            # Shadcn UI 组件
│   └── tools/         # 各工具核心逻辑组件
├── lib/               # 通用工具函数、i18n 配置
└── styles/            # 全局样式
```

---

### 🛠 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产产物
npm run build
```

---

### 📄 开源协议
本项目采用 [MIT License](LICENSE) 协议。

---
"Keep it simple, keep it fast, and make it upward (dogupup)."

---

<a name="english"></a>
## English

**DogUpUp DevTools** is a minimalist, hardcore online toolbox designed for programmers to enhance development efficiency. We pursue ultimate performance and SEO, committed to providing the smoothest development assistance experience with limited hardware resources (1C2G VPS).

---

### 🚀 Core Features

1.  **Maven Dependency Analyzer (`/maven-tree`)**
    *   Parses `mvn dependency:tree` text output.
    *   Visualizes dependency tree, highlighting version conflicts `(conflicted with ...)`.
    *   Tree chart display based on ECharts.
2.  **Cron Translator (`/cron`)**
    *   Supports Cron expression parsing for Spring/Quartz, etc.
    *   Natural language description of execution logic (Chinese and English support).
    *   Predicts and displays a timeline for the next 7 executions.
3.  **Logback/Log4j2 Generator (`/log-config`)**
    *   Interactively generates XML configuration, with one-click configuration for alert levels and log paths.
4.  **JSON Lab (`/json-lab`)**
    *   Interactive JSON structure parsing, formatting, and multi-language code generation, a deeper experience beyond traditional online tools.
5.  **JVM Tuning Recipe (`/jvm-tuning`)**
    *   Automatically generates optimized JVM startup parameters based on server hardware configuration.

---

### 🛠 Tech Stack (The Ultra-Lean Stack)

The project adopts a **Next.js monolithic full-stack solution** to achieve the lowest memory footprint and optimal SEO performance.

*   **Full-stack Framework**: Next.js 14+ (App Router)
*   **Frontend Language**: TypeScript
*   **Styling**: Tailwind CSS + Shadcn UI (Dark mode preferred)
*   **State Management**: React Context / URL Query String
*   **Visualization**: ECharts / Framer Motion
*   **Deployment**: Docker (Node.js Standalone mode)

---

### 📏 Coding Standards & Design Principles

To keep the project lightweight and maintainable, we adhere to the following guidelines:

1.  **Minimalism**: Strictly prohibits introducing heavy third-party libraries (e.g., use `date-fns` instead of `Moment.js`, or prioritize native APIs).
2.  **Performance First**: 
    *   Simple logic (e.g., regex parsing, formatting) is prioritized for **Client-Side** execution.
    *   SEO content (tool descriptions, technical background) must be provided by **Server-Side Rendering (SSR)**.
3.  **Memory Constraint**: Production environment Node.js process is limited to **256MB** memory.
4.  **Stateless Design**: No local database is used; all processing is stateless or utilizes external APIs.
5.  **SEO Friendly**: Each tool page includes more than 500 words of technical background Markdown content.
6.  **Atomic Directories**: Each tool page has an independent directory, with clear logic and easy horizontal expansion.

---

### 📂 Directory Structure

```text
src/
├── app/               # Page Routes (App Router)
│   ├── maven-tree/    # Maven Tool
│   ├── cron/          # Cron Tool
│   └── ...
├── components/        # UI & Business Components
│   ├── ui/            # Shadcn UI Components
│   └── tools/         # Core logic components for each tool
├── lib/               # Common utility functions, i18n config
└── styles/            # Global styles
```

---

### 🛠 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production artifacts
npm run build
```

---

### 📄 License
This project is licensed under the [MIT License](LICENSE).

---
"Keep it simple, keep it fast, and make it upward (dogupup)."
