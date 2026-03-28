"use client";

import { useTranslation } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { CodeExample } from "@/components/ui/CodeExample";
import { InfoCard, FeatureGrid } from "@/components/ui/InfoCard";
import { Terminal, Database } from "lucide-react";

export default function CurlCrossPlatformGuide() {
  const { lang } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const relatedTools = [
    {
      name: lang === "zh" ? "cURL 翻译官" : "cURL Builder",
      url: "/curl-builder",
      icon: <Terminal className="w-4 h-4 text-blue-500" />,
    },
    {
      name: lang === "zh" ? "JSON 实验室" : "JSON Lab",
      url: "/json-lab",
      icon: <Database className="w-4 h-4 text-blue-500" />,
    },
  ];

  return (
    <ArticleLayout
      title={
        mounted && lang === "zh"
          ? "cURL 跨平台踩坑指南：macOS、CMD、PowerShell 的引号地狱"
          : "cURL Cross-Platform Guide: Escaping Hell on macOS, CMD & PowerShell"
      }
      description={
        mounted && lang === "zh"
          ? "同一条 cURL 换个系统就报错？这篇帮你搞清楚三大平台的引号和转义差异。"
          : "Same cURL command fails on a different OS? This guide breaks down the quoting and escaping differences across platforms."
      }
      readTime={mounted && lang === "zh" ? "10 分钟" : "10 min"}
      category={mounted && lang === "zh" ? "命令行工具" : "CLI Tools"}
      backLabel={
        mounted
          ? lang === "zh"
            ? "返回技术专栏"
            : "Back to Guides"
          : "Back to Guides"
      }
      relatedTools={relatedTools}
      lang={lang}
    >
      {/* ── Chinese ──────────────────────────────────────────────────────── */}
      {(!mounted || lang === "zh") && (
        <div lang="zh" className={!mounted ? "hidden" : undefined}>
          <h2>问题的根源：Shell 怎么解析引号</h2>
          <p>
            cURL 本身是跨平台的，但它运行在 shell 里，而不同操作系统的 shell
            对引号的处理方式完全不同。你写的引号不是给 cURL 看的，是给 shell 看的。
            shell 先把引号"吃掉"，把里面的内容作为参数传给 cURL。
          </p>
          <p>
            这就是为什么同一条命令在 macOS 终端能跑，复制到 Windows CMD 就报错——不是
            cURL 的问题，是 shell 的问题。
          </p>

          <InfoCard title="核心概念" variant="info">
            <p>
              cURL 收到的参数已经被 shell 处理过了。你看到的引号、反斜杠，cURL
              一个都看不到——它们在到达 cURL 之前就被 shell 消费掉了。
            </p>
          </InfoCard>

          <h2>macOS / Linux（Bash / Zsh）</h2>
          <p>
            Unix shell 用<strong>单引号</strong>包裹内容，单引号里的一切都是字面量，不会做任何解析。
            这是最安全的方式，也是为什么大多数 cURL 教程都用单引号。
          </p>

          <FeatureGrid
            items={[
              {
                symbol: "'...'",
                name: "单引号",
                description:
                  "内容原样传递，不解析变量、不解析转义。唯一的问题：没法在单引号里放单引号。",
                example: "curl -H 'Content-Type: application/json'",
              },
              {
                symbol: "\\",
                name: "续行符",
                description:
                  "反斜杠 + 换行，表示命令还没写完。纯粹为了可读性，不影响实际执行。",
                example: "curl -X POST \\\n  'https://api.example.com'",
              },
              {
                symbol: "'\\''",
                name: "单引号转义",
                description:
                  "想在单引号字符串里放一个单引号？先关闭单引号，加一个转义的单引号，再开一个新的单引号。",
                example: "curl -d 'it'\\''s a test'",
              },
            ]}
          />

          <CodeExample
            title="macOS/Linux 示例：调用大模型 API"
            language="bash"
            explanation="使用单引号包裹 URL、Header 和 JSON Body，反斜杠续行。"
            code={`curl -X POST 'https://api.openai.com/v1/chat/completions' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer $OPENAI_API_KEY' \\
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "hello"}],
    "stream": true
  }'`}
          />

          <InfoCard title="注意" variant="warning">
            <p>
              单引号里的 <code>$OPENAI_API_KEY</code>{" "}
              不会被展开为环境变量！如果你需要引用变量，得用双引号，但双引号里的引号又需要转义。
              这就是"引号地狱"的来源。
            </p>
          </InfoCard>

          <h2>Windows CMD</h2>
          <p>
            CMD 完全不认识单引号。它只认<strong>双引号</strong>。在 CMD
            里写单引号就像写了个普通字符，不会起到任何包裹作用。
          </p>

          <FeatureGrid
            items={[
              {
                symbol: '"..."',
                name: "双引号",
                description:
                  "CMD 唯一的字符串包裹方式。内部的双引号用反斜杠转义。",
                example: 'curl -H "Content-Type: application/json"',
              },
              {
                symbol: "^",
                name: "续行符",
                description:
                  "CMD 用脱字符 ^ 换行，不是反斜杠。这是新手最容易搞混的地方。",
                example: "curl -X POST ^\n  \"https://api.example.com\"",
              },
              {
                symbol: '\\"',
                name: "双引号转义",
                description:
                  "JSON 里的双引号必须用反斜杠转义，否则 CMD 会认为字符串到此结束。",
                example: 'curl -d "{\\"key\\": \\"value\\"}"',
              },
            ]}
          />

          <CodeExample
            title="Windows CMD 示例"
            language="cmd"
            explanation="CMD 只能用双引号，JSON 内部的双引号要用 \\ 转义，续行用 ^。"
            code={`curl -X POST "https://api.openai.com/v1/chat/completions" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %OPENAI_API_KEY%" ^
  -d "{\\"model\\": \\"gpt-4\\", \\"messages\\": [{\\"role\\": \\"user\\", \\"content\\": \\"hello\\"}]}"` }
          />

          <InfoCard title="环境变量" variant="tip">
            <p>
              CMD 用 <code>%VAR_NAME%</code> 引用环境变量，不是 <code>$VAR_NAME</code>。
              而且在双引号内部也能展开，这点比 Bash 的单引号方便。
            </p>
          </InfoCard>

          <h2>PowerShell</h2>
          <p>
            PowerShell 是最特殊的。它同时支持单引号和双引号，但语义和 Bash
            不一样。而且 PowerShell 里的 <code>curl</code> 默认是{" "}
            <code>Invoke-WebRequest</code> 的别名，不是真正的 cURL！
          </p>

          <FeatureGrid
            items={[
              {
                symbol: "'...'",
                name: "单引号",
                description:
                  "字面量字符串，不解析变量。单引号里的单引号用两个单引号 '' 转义。",
                example: "curl.exe -H 'Content-Type: application/json'",
              },
              {
                symbol: "`",
                name: "续行符",
                description:
                  "PowerShell 用反引号 ` 续行。注意反引号后面不能有空格，必须紧跟换行。",
                example: "curl.exe -X POST `\n  'https://api.example.com'",
              },
              {
                symbol: "curl.exe",
                name: "真正的 cURL",
                description:
                  "必须写 curl.exe 而不是 curl，否则调用的是 PowerShell 的 Invoke-WebRequest，参数完全不兼容。",
                example: "curl.exe --version",
              },
            ]}
          />

          <CodeExample
            title="PowerShell 示例"
            language="powershell"
            explanation="必须用 curl.exe 避免调用 Invoke-WebRequest，反引号续行。"
            code={`curl.exe -X POST 'https://api.openai.com/v1/chat/completions' \`
  -H 'Content-Type: application/json' \`
  -H 'Authorization: Bearer $env:OPENAI_API_KEY' \`
  -d '{"model": "gpt-4", "messages": [{"role": "user", "content": "hello"}]}'`}
          />

          <InfoCard title="PowerShell 的坑" variant="warning">
            <p>
              PowerShell 的环境变量是 <code>$env:VAR_NAME</code>。在单引号里不会展开，在双引号里才会。
              如果你需要引用变量，用双引号，但 JSON 内部的双引号需要用反引号 <code>`&quot;</code> 转义。
            </p>
          </InfoCard>

          <h2>三平台对比速查表</h2>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-3 font-semibold"></th>
                  <th className="text-left py-2 px-3 font-semibold">Bash/Zsh</th>
                  <th className="text-left py-2 px-3 font-semibold">CMD</th>
                  <th className="text-left py-2 px-3 font-semibold">PowerShell</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 px-3 font-medium">推荐引号</td>
                  <td className="py-2 px-3 font-mono">单引号 &apos;...&apos;</td>
                  <td className="py-2 px-3 font-mono">双引号 &quot;...&quot;</td>
                  <td className="py-2 px-3 font-mono">单引号 &apos;...&apos;</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 px-3 font-medium">续行符</td>
                  <td className="py-2 px-3 font-mono">\</td>
                  <td className="py-2 px-3 font-mono">^</td>
                  <td className="py-2 px-3 font-mono">`</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 px-3 font-medium">环境变量</td>
                  <td className="py-2 px-3 font-mono">$VAR</td>
                  <td className="py-2 px-3 font-mono">%VAR%</td>
                  <td className="py-2 px-3 font-mono">$env:VAR</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 px-3 font-medium">curl 命令</td>
                  <td className="py-2 px-3 font-mono">curl</td>
                  <td className="py-2 px-3 font-mono">curl</td>
                  <td className="py-2 px-3 font-mono">curl.exe</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>流式响应 (SSE)</h2>
          <p>
            调用大模型 API（OpenAI、Claude、通义千问等）时经常需要流式输出。cURL
            默认会缓冲输出，加上 <code>-N</code>（<code>--no-buffer</code>）参数可以禁用缓冲，让响应实时打印。
          </p>

          <CodeExample
            title="流式调用示例（macOS/Linux）"
            language="bash"
            explanation="-N 参数禁用缓冲，让 SSE 事件实时输出到终端。"
            code={`curl -N -X POST 'https://api.openai.com/v1/chat/completions' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer $OPENAI_API_KEY' \\
  -d '{"model": "gpt-4", "stream": true, "messages": [{"role": "user", "content": "hello"}]}'`}
          />

          <h2>文件上传</h2>
          <p>
            使用 <code>-F</code> 参数上传文件，文件路径前加 <code>@</code>。路径规则在不同系统上也不一样：
          </p>
          <ul>
            <li>macOS/Linux：<code>-F &apos;file=@/home/user/photo.jpg&apos;</code></li>
            <li>Windows CMD：<code>-F &quot;file=@C:\Users\user\photo.jpg&quot;</code></li>
            <li>PowerShell：<code>-F &apos;file=@C:\Users\user\photo.jpg&apos;</code></li>
          </ul>

          <h2>总结</h2>
          <p>
            cURL 跨平台问题的本质是 shell 引号解析的差异，不是 cURL 本身的差异。
            记住三条规则就够了：Bash 用单引号，CMD 用双引号，PowerShell 用 curl.exe + 单引号。
            实在记不住？用我们的 cURL 翻译官工具，填个表单自动生成三个平台的命令。
          </p>
        </div>
      )}

      {/* ── English ──────────────────────────────────────────────────────── */}
      {mounted && lang === "en" && (
        <div lang="en">
          <h2>The Root Cause: How Shells Parse Quotes</h2>
          <p>
            cURL itself is cross-platform, but it runs inside a shell, and
            different operating systems have completely different shells with
            different quoting rules. The quotes you write aren&apos;t for cURL —
            they&apos;re for the shell. The shell &quot;consumes&quot; the quotes and
            passes the contents as arguments to cURL.
          </p>
          <p>
            That&apos;s why the same command works in macOS Terminal but fails
            when pasted into Windows CMD — it&apos;s not a cURL problem, it&apos;s a
            shell problem.
          </p>

          <InfoCard title="Key Concept" variant="info">
            <p>
              cURL receives arguments that have already been processed by the
              shell. The quotes and backslashes you see? cURL never sees them —
              they&apos;re consumed by the shell before reaching cURL.
            </p>
          </InfoCard>

          <h2>macOS / Linux (Bash / Zsh)</h2>
          <p>
            Unix shells use <strong>single quotes</strong> to wrap content.
            Everything inside single quotes is treated as a literal — no
            variable expansion, no escape processing. This is the safest
            approach and why most cURL tutorials use single quotes.
          </p>

          <FeatureGrid
            items={[
              {
                symbol: "'...'",
                name: "Single Quotes",
                description:
                  "Content passed as-is. No variable expansion, no escaping. Only limitation: you can't put a single quote inside.",
                example: "curl -H 'Content-Type: application/json'",
              },
              {
                symbol: "\\",
                name: "Line Continuation",
                description:
                  "Backslash + newline means the command continues. Purely for readability.",
                example: "curl -X POST \\\n  'https://api.example.com'",
              },
              {
                symbol: "'\\''",
                name: "Escaping Single Quotes",
                description:
                  "To put a single quote inside a single-quoted string: close the quote, add an escaped quote, open a new quote.",
                example: "curl -d 'it'\\''s a test'",
              },
            ]}
          />

          <CodeExample
            title="macOS/Linux Example: Calling an LLM API"
            language="bash"
            explanation="Single quotes wrap URL, headers, and JSON body. Backslash for line continuation."
            code={`curl -X POST 'https://api.openai.com/v1/chat/completions' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer $OPENAI_API_KEY' \\
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "hello"}],
    "stream": true
  }'`}
          />

          <InfoCard title="Watch Out" variant="warning">
            <p>
              <code>$OPENAI_API_KEY</code> inside single quotes is NOT expanded
              as an environment variable! If you need variable expansion, use
              double quotes — but then you need to escape the inner quotes. This
              is where the &quot;quoting hell&quot; begins.
            </p>
          </InfoCard>

          <h2>Windows CMD</h2>
          <p>
            CMD does not recognize single quotes at all. It only uses{" "}
            <strong>double quotes</strong>. A single quote in CMD is just a
            regular character with no special meaning.
          </p>

          <FeatureGrid
            items={[
              {
                symbol: '"..."',
                name: "Double Quotes",
                description:
                  "The only string wrapping in CMD. Inner double quotes are escaped with backslash.",
                example: 'curl -H "Content-Type: application/json"',
              },
              {
                symbol: "^",
                name: "Line Continuation",
                description:
                  "CMD uses caret ^ for line continuation, not backslash. This catches many newcomers.",
                example: "curl -X POST ^\n  \"https://api.example.com\"",
              },
              {
                symbol: '\\"',
                name: "Escaping Double Quotes",
                description:
                  "Double quotes inside JSON must be backslash-escaped, or CMD thinks the string ended.",
                example: 'curl -d "{\\"key\\": \\"value\\"}"',
              },
            ]}
          />

          <CodeExample
            title="Windows CMD Example"
            language="cmd"
            explanation="CMD only supports double quotes. Inner JSON quotes need backslash escaping. Caret ^ for line continuation."
            code={`curl -X POST "https://api.openai.com/v1/chat/completions" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %OPENAI_API_KEY%" ^
  -d "{\\"model\\": \\"gpt-4\\", \\"messages\\": [{\\"role\\": \\"user\\", \\"content\\": \\"hello\\"}]}"` }
          />

          <InfoCard title="Environment Variables" variant="tip">
            <p>
              CMD uses <code>%VAR_NAME%</code> for environment variables, not{" "}
              <code>$VAR_NAME</code>. Variables expand inside double quotes too,
              which is actually more convenient than Bash&apos;s single quotes.
            </p>
          </InfoCard>

          <h2>PowerShell</h2>
          <p>
            PowerShell is the trickiest. It supports both single and double
            quotes but with different semantics than Bash. And the{" "}
            <code>curl</code> command in PowerShell is an alias for{" "}
            <code>Invoke-WebRequest</code> by default — it&apos;s not real
            cURL!
          </p>

          <FeatureGrid
            items={[
              {
                symbol: "'...'",
                name: "Single Quotes",
                description:
                  "Literal strings, no variable expansion. Single quotes inside are escaped by doubling them: ''.",
                example: "curl.exe -H 'Content-Type: application/json'",
              },
              {
                symbol: "`",
                name: "Line Continuation",
                description:
                  "PowerShell uses backtick ` for line continuation. No space allowed after the backtick — it must be immediately followed by a newline.",
                example: "curl.exe -X POST `\n  'https://api.example.com'",
              },
              {
                symbol: "curl.exe",
                name: "The Real cURL",
                description:
                  "You must write curl.exe, not curl. Otherwise PowerShell calls Invoke-WebRequest, which has completely different parameters.",
                example: "curl.exe --version",
              },
            ]}
          />

          <CodeExample
            title="PowerShell Example"
            language="powershell"
            explanation="Must use curl.exe to avoid Invoke-WebRequest alias. Backtick for line continuation."
            code={`curl.exe -X POST 'https://api.openai.com/v1/chat/completions' \`
  -H 'Content-Type: application/json' \`
  -H 'Authorization: Bearer $env:OPENAI_API_KEY' \`
  -d '{"model": "gpt-4", "messages": [{"role": "user", "content": "hello"}]}'`}
          />

          <InfoCard title="PowerShell Gotcha" variant="warning">
            <p>
              Environment variables in PowerShell are{" "}
              <code>$env:VAR_NAME</code>. They don&apos;t expand inside single
              quotes (use double quotes for that). JSON double quotes inside
              double-quoted strings need backtick escaping: <code>`&quot;</code>.
            </p>
          </InfoCard>

          <h2>Cross-Platform Quick Reference</h2>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-3 font-semibold"></th>
                  <th className="text-left py-2 px-3 font-semibold">Bash/Zsh</th>
                  <th className="text-left py-2 px-3 font-semibold">CMD</th>
                  <th className="text-left py-2 px-3 font-semibold">PowerShell</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 px-3 font-medium">Preferred Quotes</td>
                  <td className="py-2 px-3 font-mono">Single &apos;...&apos;</td>
                  <td className="py-2 px-3 font-mono">Double &quot;...&quot;</td>
                  <td className="py-2 px-3 font-mono">Single &apos;...&apos;</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 px-3 font-medium">Line Continuation</td>
                  <td className="py-2 px-3 font-mono">\</td>
                  <td className="py-2 px-3 font-mono">^</td>
                  <td className="py-2 px-3 font-mono">`</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 px-3 font-medium">Env Variables</td>
                  <td className="py-2 px-3 font-mono">$VAR</td>
                  <td className="py-2 px-3 font-mono">%VAR%</td>
                  <td className="py-2 px-3 font-mono">$env:VAR</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 px-3 font-medium">cURL Command</td>
                  <td className="py-2 px-3 font-mono">curl</td>
                  <td className="py-2 px-3 font-mono">curl</td>
                  <td className="py-2 px-3 font-mono">curl.exe</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Streaming Responses (SSE)</h2>
          <p>
            When calling LLM APIs (OpenAI, Claude, Qwen, etc.), you often want
            streaming output. cURL buffers output by default — add{" "}
            <code>-N</code> (<code>--no-buffer</code>) to disable buffering and
            print responses in real time.
          </p>

          <CodeExample
            title="Streaming Example (macOS/Linux)"
            language="bash"
            explanation="-N disables buffering so SSE events print to terminal in real time."
            code={`curl -N -X POST 'https://api.openai.com/v1/chat/completions' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer $OPENAI_API_KEY' \\
  -d '{"model": "gpt-4", "stream": true, "messages": [{"role": "user", "content": "hello"}]}'`}
          />

          <h2>File Uploads</h2>
          <p>
            Use <code>-F</code> to upload files, with <code>@</code> prefix for
            file paths. Path syntax differs across systems:
          </p>
          <ul>
            <li>macOS/Linux: <code>-F &apos;file=@/home/user/photo.jpg&apos;</code></li>
            <li>Windows CMD: <code>-F &quot;file=@C:\Users\user\photo.jpg&quot;</code></li>
            <li>PowerShell: <code>-F &apos;file=@C:\Users\user\photo.jpg&apos;</code></li>
          </ul>

          <h2>Summary</h2>
          <p>
            Cross-platform cURL issues are fundamentally about shell quoting
            differences, not cURL itself. Remember three rules: Bash uses
            single quotes, CMD uses double quotes, PowerShell uses curl.exe +
            single quotes. Can&apos;t remember? Use our cURL Builder tool — fill in
            a form and get the correct command for all three platforms.
          </p>
        </div>
      )}
    </ArticleLayout>
  );
}
