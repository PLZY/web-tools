# DogUpUp DevTools - 全栈开发与规范指南 (Roo Code 专用)

## 1. 项目背景与愿景
- **项目名称**：DogUpUp DevTools (dogupup.com)
- **核心定位**：极简、硬核的程序员在线工具箱。
- **生存环境**：部署于 1C2G 的海外 VPS (Ubuntu 22.04)，必须极度节省内存和 CPU。
- **SEO 策略**：不备案，走 Google 搜索，追求 Server-Side Rendering (SSR) 以实现极致收录。

## 2. 技术栈 (The Ultra-Lean Stack)
- **全栈框架**：Next.js 14+ (App Router) - 必须使用 TypeScript。
- **UI 组件**：Tailwind CSS + Shadcn UI (极简、响应式、暗黑模式优先)。
- **逻辑分布**：
  - **Client-Side Heavy**: 简单的文本处理、Cron 解析、格式化等逻辑优先放在客户端执行，减少服务器负载。
  - **Server-Side Rendering (SSR)**：工具说明、SEO 文章必须由服务端渲染。
- **状态管理**：React Context 或简单的 URL Query String (方便分享)，禁止使用 Redux 等重型库。
- **构建工具**：Vite (Next.js 内置)，部署使用 Docker。


## 3. 核心功能清单 (Feature List)
1. **Maven 依赖排查器**：解析 `mvn dependency:tree` 文本，识别并高亮 `(conflicted with ...)`。使用 Mermaid.js 或 Echarts 进行树状图可视化。
2. **Logback/Log4j2 生成器**：交互式表单生成 XML 配置。使用模板字符串实现，避免后端重量级解析库。
3. **Cron 翻译官**：解析 Cron 表达式 (支持 Spring/Quartz)，显示人类可读描述并绘制 7 天执行时间轴。
4. **SQL 转 Java/Lombok**：DDL 语句解析并转换为带注解的 Java POJO/DTO。
5. **JVM 调优配方**：根据输入的服务器配置，自动生成极致优化的 JVM 启动参数。

## 4. 环境与部署约束
- **开发环境**：Windows 10 + VS Code (Roo Code)。
- **生产环境**：Ubuntu 22.04。
- **内存限制**：后端 Node.js 进程必须限制在 256MB 内存以内。
- **存储约束**：20G 硬盘有限，严禁使用本地数据库 (MySQL/PostgreSQL)。所有数据应为无状态处理，或使用外部廉价 API。
- **流量优化**：开启静态资源压缩

## 5. 编码规范与准则 (Coding Standards)
- **所有的代码注释严格使用中文**
- **命名规范统一使用驼峰式命名**
- **原子性**：一个工具页面一个目录，逻辑清晰，易于横向扩展。
- **SEO 友好**：每个页面必须包含特定的 `<title>`、`<meta description>` 和 500 字以上的技术背景 Markdown 内容。
- **无状态设计**：API 路由必须是无状态的，尽量避免使用 Session。
- **类型安全**：所有 API 响应和组件 Props 必须有严格的 TypeScript 定义。
- **性能优先**：
  - 尽量使用浏览器原生 API (如 `Intl`, `URLSearchParam`)。
  - 避免在服务端运行大型正则，如果必须运行，需考虑超时控制。

## 6. Roo Code 协作指令
- **模式切换**：
  - 在设计阶段，使用 `Architect` 模式讨论组件拆分。
  - 在实现阶段，使用 `Code` 模式生成高性能、无冗余的代码。
- **审查准则**：
  - 检查代码中是否有不必要的重型第三方库引入 (如 Moment.js 应替换为 date-fns 或原生 API)。
  - 检查是否有不符合暗黑模式规范的颜色定义。
  - 检查生成的 HTML 是否包含 SEO 关键词。

---
"Keep it simple, keep it fast, and make it upward (dogupup)."