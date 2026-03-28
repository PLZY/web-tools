"use client";

import { useTranslation } from "@/lib/i18n";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { CodeExample } from "@/components/ui/CodeExample";
import { InfoCard, FeatureGrid } from "@/components/ui/InfoCard";
import { Braces, FileText } from "lucide-react";

export default function JsonArticlePage() {
  const { lang } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const relatedTools = [
    {
      name: lang === 'zh' ? 'JSON 实验室' : 'JSON Lab',
      url: '/json-lab',
      icon: <Braces className="w-4 h-4 text-blue-500" />
    },
    {
      name: lang === 'zh' ? '文本格式化' : 'Text Formatter',
      url: '/text-format',
      icon: <FileText className="w-4 h-4 text-blue-500" />
    }
  ];

  return (
    <ArticleLayout
      title={mounted && lang === 'zh'
        ? "JSON 的前世今生与大文件解析优化"
        : "JSON Deep Dive: Serialization and Optimizing Large File Parsing"}
      description={mounted && lang === 'zh'
        ? "作为 Web 开发中不可或缺的数据交换格式，JSON 看起来非常简单，但在处理巨大的 JSON 数组时，糟糕的解析策略可能会直接导致系统的 OutOfMemoryError (OOM)。"
        : "As the indispensable data exchange format in Web development, JSON looks deceivingly simple. However, when handling massive JSON arrays, a poor parsing strategy can lead directly to OutOfMemoryErrors (OOM) in your system."}
      readTime={mounted && lang === 'zh' ? "5 分钟" : "5 min"}
      category={mounted && lang === 'zh' ? "数据格式" : "Data Format"}
      backLabel={mounted ? (lang === 'zh' ? '返回技术专栏' : 'Back to Guides') : 'Back to Guides'}
      relatedTools={relatedTools}
      lang={lang}
    >
      {(!mounted || lang === 'zh') && (
        <div lang="zh" className={!mounted ? "hidden" : undefined}>
          <h2>什么是 JSON？</h2>
          <p>
            JSON (JavaScript Object Notation) 是一种轻量级的数据交换格式。它基于 JavaScript 语法的一个子集，但完全独立于语言，这使得它成为了现代前后端分离架构（RESTful API）和微服务之间通信的绝对统治者。
          </p>
          <p>
            与繁重且复杂的 XML 相比，JSON 更易于人类阅读和编写，同时也易于机器解析和生成。
          </p>

          <InfoCard title="JSON 相比 XML 的核心优势" variant="info">
            <ul className="space-y-1">
              <li>• <strong>更轻量</strong>：没有冗余的闭合标签，数据体积通常只有 XML 的 50%-70%</li>
              <li>• <strong>解析更快</strong>：原生 JavaScript 支持，浏览器端零依赖解析</li>
              <li>• <strong>可读性更强</strong>：键值对结构直观清晰，嵌套层次一目了然</li>
              <li>• <strong>生态更广</strong>：几乎所有现代 API（REST、GraphQL）都以 JSON 作为默认格式</li>
            </ul>
          </InfoCard>

          <h2>解析策略：DOM 模型 vs 流式解析 (Streaming)</h2>
          <p>
            当我们在后端（比如 Java 使用 Jackson 或 Gson）处理 JSON 时，通常有两种截然不同的处理模型：
          </p>

          <h3>1. DOM 模型 (数据绑定)</h3>
          <p>
            这是我们最常用的方式。像 <code>ObjectMapper.readValue()</code> 就是典型的 DOM 模型。解析器会将整个 JSON 字符串读入内存，并将其映射（反序列化）为内存中的一个完整 Java 对象树 (Object Tree)。
          </p>

          <CodeExample
            title="DOM 模型示例 (Jackson)"
            code={`ObjectMapper mapper = new ObjectMapper();\nList<User> users = mapper.readValue(\n  jsonFile, new TypeReference<List<User>>(){}\n);`}
            explanation="整个 JSON 文件被一次性读入内存并转换为 Java 对象列表。简单直观，但对于大文件可能导致 OOM。"
            variant="info"
          />

          <ul>
            <li><strong>优点</strong>：使用极其简单，直接拿到实体对象进行业务处理。</li>
            <li><strong>缺点</strong>：如果 JSON 文件很大（比如 500MB 的包含百万级记录的数据导出文件），将其完整载入内存可能会消耗数 GB 的堆内存，极易引发 OOM。</li>
          </ul>

          <h3>2. 流式解析模型 (Streaming API)</h3>
          <p>
            针对巨大的 JSON 文件，必须使用 Streaming API。解析器（如 Jackson 的 <code>JsonParser</code>）以类似于解析 XML 的 SAX 方式，从头到尾读取 JSON 字符串，每次只触发一个事件（比如"遇到对象开始"、"遇到字段名"、"遇到字符串值"）。
          </p>

          <CodeExample
            title="流式解析示例 (Jackson Streaming)"
            code={`JsonFactory factory = new JsonFactory();\nJsonParser parser = factory.createParser(hugeFile);\nwhile (parser.nextToken() != null) {\n  // 逐个 Token 处理，内存恒定\n}`}
            explanation="解析器逐个读取 Token，不会将整个文件加载到内存。适合处理 GB 级别的超大 JSON 文件。"
            variant="success"
          />

          <ul>
            <li><strong>优点</strong>：内存占用极低且恒定，无论解析多大的文件，都只会占用几兆内存。</li>
            <li><strong>缺点</strong>：编码复杂度高，需要开发者自己编写状态机来记录当前解析到了哪一层结构。</li>
          </ul>

          <FeatureGrid
            items={[
              {
                symbol: "DOM",
                name: "DOM 模型 (数据绑定)",
                description: "一次性加载全部数据到内存，使用简单但内存开销大。适合小于 100MB 的常规 JSON。",
                example: "ObjectMapper.readValue()"
              },
              {
                symbol: "SAX",
                name: "流式解析 (Streaming API)",
                description: "逐 Token 读取，内存恒定在几 MB。编码复杂但能处理任意大小的文件。",
                example: "JsonParser.nextToken()"
              },
              {
                symbol: "MIX",
                name: "混合模式 (推荐)",
                description: "用流式 API 遍历顶层数组，对每个元素用 DOM 模型反序列化。兼顾性能与易用性。",
                example: "parser + mapper.readValue(parser)"
              }
            ]}
          />

          <h2>为什么要使用我们的 JSON 实验室？</h2>
          <p>
            当您在开发或调试 API 时，经常会遇到结构极度复杂、嵌套极深的"黑盒" JSON 响应。将这些冗长且未经格式化的 JSON 字符串复制到编辑器中阅读是非常痛苦的。
          </p>
          <p>
            我们的 <Link href="/json-lab" className="text-primary hover:underline">JSON 实验室 (JSON Lab)</Link> 是一个完全在您浏览器本地（基于客户端 JavaScript）运行的超级工具：
          </p>
          <ul>
            <li><strong>极致安全</strong>：您的敏感业务数据（如 Token、用户信息）不会被发送到任何后端服务器，杜绝数据泄露风险。</li>
            <li><strong>智能格式化</strong>：一键实现压缩与美化。</li>
            <li><strong>多语言代码生成</strong>：只需粘贴 JSON，即可一键推导并生成对应的 Java (POJO), TypeScript (Interfaces), C# 或 Go 结构体代码，成倍提升开发效率。</li>
          </ul>

          <InfoCard title="隐私与安全保障" variant="tip">
            <p>
              与市面上大多数在线 JSON 工具不同，我们的 JSON 实验室完全在浏览器端运行。您的数据不会经过任何服务器，这意味着即使是包含敏感信息（如 API 密钥、JWT Token、用户 PII 数据）的 JSON，也可以放心粘贴分析，零泄露风险。
            </p>
          </InfoCard>
        </div>
      )}

      {(!mounted || lang === 'en') && (
        <div lang="en" className={!mounted ? "hidden" : undefined}>
          <h2>What is JSON?</h2>
          <p>
            JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is based on a subset of the JavaScript programming language, yet it is completely language-independent. This has made it the undisputed ruler of communication in modern decoupled architectures (RESTful APIs) and microservices.
          </p>
          <p>
            Compared to the verbose and complex XML, JSON is much easier for humans to read and write, and for machines to parse and generate.
          </p>

          <InfoCard title="Key Advantages of JSON over XML" variant="info">
            <ul className="space-y-1">
              <li>• <strong>Lighter weight</strong>: No redundant closing tags; data payloads are typically 50%-70% the size of XML</li>
              <li>• <strong>Faster parsing</strong>: Native JavaScript support means zero-dependency parsing in browsers</li>
              <li>• <strong>More readable</strong>: Key-value pair structure is intuitive and nesting levels are immediately clear</li>
              <li>• <strong>Broader ecosystem</strong>: Nearly all modern APIs (REST, GraphQL) use JSON as the default format</li>
            </ul>
          </InfoCard>

          <h2>Parsing Strategies: DOM vs. Streaming</h2>
          <p>
            When we process JSON on the backend (e.g., using Jackson or Gson in Java), there are generally two distinct processing models:
          </p>

          <h3>1. The DOM Model (Data Binding)</h3>
          <p>
            This is the approach we use 99% of the time. Functions like <code>ObjectMapper.readValue()</code> represent the DOM model. The parser reads the entire JSON string into memory and maps (deserializes) it into a complete Java Object Tree in the heap.
          </p>

          <CodeExample
            title="DOM Model Example (Jackson)"
            code={`ObjectMapper mapper = new ObjectMapper();\nList<User> users = mapper.readValue(\n  jsonFile, new TypeReference<List<User>>(){}\n);`}
            explanation="The entire JSON file is loaded into memory at once and converted to a Java object list. Simple and intuitive, but may cause OOM for large files."
            variant="info"
          />

          <ul>
            <li><strong>Pros</strong>: Extremely simple to use; you get a ready-to-use entity object for your business logic.</li>
            <li><strong>Cons</strong>: If the JSON file is huge (e.g., a 500MB data export containing millions of records), loading it entirely into memory might consume gigabytes of heap space, easily triggering an OOM.</li>
          </ul>

          <h3>2. The Streaming API Model</h3>
          <p>
            For gigantic JSON files, you must use a Streaming API. The parser (like Jackson&apos;s <code>JsonParser</code>) reads the JSON string sequentially from start to finish, triggering an event for each token (e.g., &quot;Start of Object&quot;, &quot;Field Name&quot;, &quot;String Value&quot;) much like SAX parsing for XML.
          </p>

          <CodeExample
            title="Streaming Example (Jackson Streaming)"
            code={`JsonFactory factory = new JsonFactory();\nJsonParser parser = factory.createParser(hugeFile);\nwhile (parser.nextToken() != null) {\n  // Process tokens one by one, constant memory\n}`}
            explanation="The parser reads tokens one at a time without loading the entire file into memory. Ideal for processing GB-scale JSON files."
            variant="success"
          />

          <ul>
            <li><strong>Pros</strong>: Extremely low and constant memory footprint. Whether the file is 1MB or 10GB, it only uses a few megabytes of RAM.</li>
            <li><strong>Cons</strong>: High coding complexity. Developers must write state machines to keep track of the current nested level and context.</li>
          </ul>

          <FeatureGrid
            items={[
              {
                symbol: "DOM",
                name: "DOM Model (Data Binding)",
                description: "Loads all data into memory at once. Simple to use but memory-intensive. Best for regular JSON under 100MB.",
                example: "ObjectMapper.readValue()"
              },
              {
                symbol: "SAX",
                name: "Streaming API",
                description: "Reads token by token with constant memory of a few MB. Complex to code but handles files of any size.",
                example: "JsonParser.nextToken()"
              },
              {
                symbol: "MIX",
                name: "Hybrid Approach (Recommended)",
                description: "Use streaming API to iterate the top-level array, then DOM-bind each element. Balances performance with usability.",
                example: "parser + mapper.readValue(parser)"
              }
            ]}
          />

          <h2>Why Use Our JSON Lab?</h2>
          <p>
            When developing or debugging APIs, you frequently encounter &quot;black box&quot; JSON responses with extremely complex, deeply nested structures. Trying to read these raw, unformatted JSON strings in a standard text editor is a nightmare.
          </p>
          <p>
            Our <Link href="/json-lab" className="text-primary hover:underline">JSON Lab</Link> is a supercharged tool running entirely locally in your browser (client-side JavaScript):
          </p>
          <ul>
            <li><strong>Ultimate Privacy</strong>: Your sensitive business data (like Tokens or User PII) is never sent to any backend server, eliminating the risk of data leaks.</li>
            <li><strong>Smart Formatting</strong>: Minify or beautify with a single click.</li>
            <li><strong>Multi-Language Code Generation</strong>: Simply paste your JSON, and instantly deduce and generate corresponding Java (POJO), TypeScript (Interfaces), C# or Go struct code, multiplying your development efficiency.</li>
          </ul>

          <InfoCard title="Privacy and Security Guarantee" variant="tip">
            <p>
              Unlike most online JSON tools, our JSON Lab runs entirely in your browser. Your data never passes through any server, which means even JSON containing sensitive information (API keys, JWT tokens, user PII) can be safely pasted and analyzed with zero risk of data leakage.
            </p>
          </InfoCard>
        </div>
      )}
    </ArticleLayout>
  );
}
