# DogUpUp DevTools 架构设计文档

## 1. 项目概览
- **名称**: DogUpUp DevTools
- **定位**: 极简、硬核的程序员在线工具箱
- **核心约束**: 
  - 内存占用 < 256MB (Node.js)
  - 极致 SEO (SSR)
  - 无数据库 (No DB)

## 2. 技术栈选型 (The Ultra-Lean Stack)
基于 `Architect` 模式的决策，采用 **Next.js 单体全栈方案**。

| 维度 | 选型 | 理由 |
|---|---|---|
| **框架** | **Next.js 14+ (App Router)** | 单体架构最省内存，内置 SSR/SEO 支持，React 生态丰富 |
| **语言** | **TypeScript** | 类型安全，减少运行时错误 |
| **样式** | **Tailwind CSS** | 原子化 CSS，构建产物极小 |
| **UI 组件** | **Shadcn UI** | 基于 Radix UI 的无头组件，源码拷贝模式，无重型依赖 |
| **图标** | **Lucide React** | 轻量级 SVG 图标库 |
| **部署** | **Docker (Node Alpine)** | 配合 Output Standalone 模式，实现最小化镜像 |

## 3. 目录结构规划
遵循 Next.js App Router 标准，结合 "原子化工具" 的设计理念。

```
web-tool/
├── .roo/                  # Roo Code 规则配置
├── docs/                  # 项目文档
├── public/                # 静态资源 (robots.txt, favicon)
├── src/
│   ├── app/               # 路由与页面 (App Router)
│   │   ├── api/           # 后端 API 路由 (如需服务端处理)
│   │   ├── layout.tsx     # 全局布局 (Header, Footer, ThemeProvider)
│   │   ├── page.tsx       # 首页 (工具列表)
│   │   ├── maven-tree/    # [工具1] Maven 依赖排查器
│   │   │   ├── page.tsx   # 工具主页 (SSR: 说明文档)
│   │   │   └── client.tsx # 客户端交互逻辑 (CSR: 解析与渲染)
│   │   ├── cron/          # [工具2] Cron 翻译官
│   │   └── ...            # 其他工具目录
│   ├── components/        # 全局共享组件
│   │   ├── ui/            # Shadcn UI 组件 (Button, Input, etc.)
│   │   └── shared/        # 自定义共享组件 (Navbar, Footer)
│   ├── lib/               # 工具函数与库
│   │   ├── utils.ts       # Tailwind 合并工具
│   │   └── constants.ts   # 全局常量
│   └── styles/            # 全局样式
├── tailwind.config.ts     # Tailwind 配置
├── next.config.mjs        # Next.js 配置 (Standalone Mode)
└── package.json           # 项目依赖
```

## 4. 核心功能实现思路

### 4.1 Maven 依赖排查器
- **输入**: 用户粘贴 `mvn dependency:tree` 的文本输出。
- **处理 (Client-Side)**: 
  - 使用正则表达式在浏览器端解析文本，构建树形结构 JSON。
  - 识别 `conflicted` 关键字并标记节点状态。
- **渲染**: 使用 Mermaid.js 或 React Flow 渲染树状图。
- **SEO**: 页面底部包含 Maven 依赖冲突解决的通用教程 (SSR)。

### 4.2 Cron 翻译官
- **输入**: Cron 表达式 (如 `0 0 12 * * ?`)。
- **处理 (Client-Side)**: 使用 `cronstrue` (轻量库) 进行自然语言翻译。使用 `cron-parser` 计算未来 7 次运行时间。
- **可视化**: 绘制时间轴展示运行频率。

## 5. 下一步计划 (Code Mode)
1. **初始化项目**: 运行 `npx create-next-app@latest . --typescript --tailwind --eslint`。
2. **清理样板代码**: 删除默认的 Next.js 欢迎页。
3. **安装 Shadcn**: 初始化 Shadcn UI 并添加基础组件 (Button, Card, Textarea)。
4. **构建框架**: 实现基础 Layout (包含 Navbar 和 Footer)。
