"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";

export default function AboutPageContent() {
  const { lang } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl prose prose-neutral dark:prose-invert">
      <h1 className="text-3xl font-bold mb-6">
        {lang === "zh" ? "关于 DogUpUp DevTools" : "About DogUpUp DevTools"}
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "这个站是怎么来的" : "How This Site Started"}
        </h2>
        {lang === "zh" ? (
          <>
            <p>
              我是一个普通的后端程序员，日常写 Java、排查线上问题、偶尔碰碰前端。工作中总有些零碎的小需求反复出现：把日志里的 SQL 模板和参数拼成完整语句、格式化一段从接口抓下来的 JSON、看看 Maven 依赖有没有版本冲突。
            </p>
            <p>
              每次需要的时候去搜一下，第一个搜出来的总不是自己想要的那个，好不容易找到一个能用的，用完关掉又忘了收藏，下次还得重新找。后来想想，干脆自己写一个，把常用的工具集中到一个地方，打开浏览器就能用。
            </p>
            <p>
              这就是 DogUpUp DevTools 的由来。没有什么宏大的愿景，就是一个程序员下班后的小爱好，把自己和朋友们日常真正用得到的东西做出来，顺便做几个点缀生活的小玩具，给苦逼的打工生活加一抹彩色。
            </p>
          </>
        ) : (
          <>
            <p>
              I'm a backend developer who writes Java for a living — debugging production issues, wrangling dependencies, and occasionally touching frontend code. There are small tasks that come up over and over: stitching SQL logs into runnable queries, formatting JSON from API responses, checking Maven dependency trees for version conflicts.
            </p>
            <p>
              Every time I needed something, the first search result was never quite right. When I finally found a good tool and used it, I'd close the tab and forget to bookmark it — then start the whole search over next time. At some point I thought: why not just build my own and put everything in one place?
            </p>
            <p>
              That's how DogUpUp DevTools was born. No grand vision, just a developer's side project — building the tools I actually use, plus a few fun little toys to add some color to the daily grind.
            </p>
          </>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "设计原则" : "Design Principles"}
        </h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {lang === "zh" ? (
            <>
              <li>
                <strong>隐私优先：</strong>所有工具都在浏览器本地运行。你输入的 JSON、SQL、代码片段不会发送到任何服务器。这个站点没有后端数据库，不存储用户数据。
              </li>
              <li>
                <strong>开箱即用：</strong>不需要注册账号，不需要安装插件，打开网页就能用。移动端也做了适配，手机上临时查个东西也方便。
              </li>
              <li>
                <strong>实用至上：</strong>每个工具都来源于真实的工作场景，不做花哨但没人用的功能。做一个能用的工具，好过做十个半成品。
              </li>
            </>
          ) : (
            <>
              <li>
                <strong>Privacy first:</strong> Every tool runs locally in your browser. Your JSON, SQL, and code snippets are never sent to any server. There is no backend database. No user data is stored.
              </li>
              <li>
                <strong>Zero setup:</strong> No registration, no plugins. Open the page and start using it. Mobile-friendly too, so you can look things up on the go.
              </li>
              <li>
                <strong>Practical over flashy:</strong> Every tool comes from a real work scenario. One tool that works well beats ten half-finished ones.
              </li>
            </>
          )}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "目前提供的工具" : "What's Available"}
        </h2>
        {lang === "zh" ? (
          <>
            <p><strong>开发者工具：</strong></p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>JSON 格式化、验证与多语言代码生成</li>
              <li>文本对比差异高亮</li>
              <li>SQL 参数拼接（支持 MyBatis/Hibernate/JPA 日志格式）</li>
              <li>乱码修复（自动尝试多种编码组合）</li>
              <li>Maven 依赖树可视化与冲突检测</li>
              <li>cURL 命令可视化构建</li>
              <li>Eclipse / IntelliJ IDEA / VS Code 快捷键对照表</li>
              <li>Logback / Log4j2 日志配置生成器</li>
              <li>Cron 表达式翻译与执行时间预览（支持 Spring/Quartz/Linux 格式）</li>
              <li>JVM 启动参数调优生成器</li>
              <li>文本批量处理（大小写转换、Base64/URL 编解码、排序去重）</li>
            </ul>
            <p><strong>生活工具：</strong></p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>真实时薪计算器（计入社保、通勤、午餐等隐性成本）</li>
              <li>MBTI 人格测试</li>
              <li>假装系统更新画面</li>
            </ul>
          </>
        ) : (
          <>
            <p><strong>Developer Tools:</strong></p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>JSON formatter, validator, and multi-language code generator</li>
              <li>Text diff with highlighted differences</li>
              <li>SQL parameter stitcher (MyBatis/Hibernate/JPA log formats)</li>
              <li>Mojibake (garbled text) fixer with encoding matrix</li>
              <li>Maven dependency tree visualizer with conflict detection</li>
              <li>Visual cURL command builder</li>
              <li>Eclipse / IntelliJ IDEA / VS Code shortcut comparison</li>
              <li>Logback / Log4j2 config generator</li>
              <li>Cron expression translator with execution timeline (Spring/Quartz/Linux)</li>
              <li>JVM tuning parameter generator</li>
              <li>Text batch processor (case conversion, Base64/URL encode, sort, deduplicate)</li>
            </ul>
            <p><strong>Life Tools:</strong></p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Real hourly wage calculator (factoring in tax, commute, meals, and hidden costs)</li>
              <li>MBTI personality test</li>
              <li>Fake system update screen</li>
            </ul>
          </>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "开源" : "Open Source"}
        </h2>
        {lang === "zh" ? (
          <p>
            整个站点的代码开源在 GitHub 上。如果你发现了 Bug、有功能建议、或者单纯想看看代码是怎么写的，都欢迎过来看看。
          </p>
        ) : (
          <p>
            The entire site is open source on GitHub. Bug reports, feature suggestions, or just browsing the code — all welcome.
          </p>
        )}
        <p>
          <a href="https://github.com/PLZY/web-tools" target="_blank" rel="noreferrer" className="text-primary underline">
            {lang === "zh" ? "GitHub 仓库 →" : "GitHub Repository →"}
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "联系方式" : "Contact"}
        </h2>
        {lang === "zh" ? (
          <>
            <p>有建议、发现 Bug 或者想聊两句，可以通过以下方式联系：</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>邮箱：<a href="mailto:zhangdagou@gmail.com" className="text-primary underline">zhangdagou@gmail.com</a></li>
              <li>GitHub Issue：<a href="https://github.com/PLZY/web-tools/issues" target="_blank" rel="noreferrer" className="text-primary underline">提交 Issue</a></li>
            </ul>
          </>
        ) : (
          <>
            <p>Got a suggestion, found a bug, or just want to say hi? Reach out:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Email: <a href="mailto:zhangdagou@gmail.com" className="text-primary underline">zhangdagou@gmail.com</a></li>
              <li>GitHub: <a href="https://github.com/PLZY/web-tools/issues" target="_blank" rel="noreferrer" className="text-primary underline">Open an Issue</a></li>
            </ul>
          </>
        )}
        <div className="mt-4 flex gap-4">
          <Link href="/privacy" className="text-sm underline text-muted-foreground hover:text-foreground">
            {lang === "zh" ? "隐私政策" : "Privacy Policy"}
          </Link>
          <Link href="/terms" className="text-sm underline text-muted-foreground hover:text-foreground">
            {lang === "zh" ? "服务条款" : "Terms of Service"}
          </Link>
        </div>
      </section>
    </div>
  );
}
