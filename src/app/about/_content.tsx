"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AboutPageContent() {
  const { lang } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl prose prose-neutral dark:prose-invert">
      <h1 className="text-3xl font-bold mb-6">
        {lang === "zh" ? "关于 DogUpUp DevTools" : "About DogUpUp DevTools"}
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "我们的使命" : "Our Mission"}
        </h2>
        {lang === "zh" ? (
          <>
            <p>
              DogUpUp DevTools (dogupup.com) 诞生于一个简单的痛点：现有的在线开发者工具往往速度缓慢、充斥着各种追踪脚本和弹窗，并且会强迫你把敏感的代码和日志上传到未知的后端数据库中。
            </p>
            <p>
              我们致力于构建一个<strong>极简、硬核的在线工具箱</strong>，专为软件工程师量身定制。我们的核心理念非常简单：
            </p>
          </>
        ) : (
          <>
            <p>
              DogUpUp DevTools (dogupup.com) was born out of a simple frustration: online developer tools are often slow, bloated with tracking scripts, cluttered with intrusive pop-ups, and force your sensitive data into unknown backend databases.
            </p>
            <p>
              We are building an <strong>ultra-lean, hardcore online toolkit</strong> tailored specifically for software engineers. Our core philosophy is simple:
            </p>
          </>
        )}
        <blockquote className="border-l-4 pl-4 italic border-primary my-4">
          "Keep it simple, keep it fast, and make it upward."
        </blockquote>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "为什么选择我们？" : "Why Choose Us?"}
        </h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {lang === "zh" ? (
            <>
              <li>
                <strong>隐私优先 & 无状态：</strong>我们不会在任何数据库中存储您的 JSON 字符串、日志配置或 Maven 依赖。我们的大多数工具完全在客户端（您的浏览器中）或无状态的内存中运行，以保证最大的隐私。
              </li>
              <li>
                <strong>极速体验：</strong>基于轻量级基础设施，我们的工具使用 Next.js 14 服务端组件和边缘计算构建，消除了加载等待时间，确保即时反馈。
              </li>
              <li>
                <strong>拒绝臃肿：</strong>我们采用极简的 UI 设计，并原生支持暗黑模式。这里没有烦人的模态弹窗或激进的新闻通讯注册。只有开箱即用的工具。
              </li>
            </>
          ) : (
            <>
              <li>
                <strong>Privacy-First & Stateless:</strong> We do not store your JSON strings, log configurations, or Maven dependencies in any database. Most of our tools run entirely client-side (in your browser) or statelessly in memory to guarantee maximum privacy.
              </li>
              <li>
                <strong>Speed & Efficiency:</strong> Hosted on lightweight infrastructure, our tools are engineered using Next.js 14 Server Components and Edge processing to eliminate loading screens and ensure instant feedback.
              </li>
              <li>
                <strong>No Clutter:</strong> We embrace a minimalist UI design with native dark mode support. You won't find annoying modals or aggressive newsletter pop-ups here. Just the tool, ready to use.
              </li>
            </>
          )}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "开源与社区" : "Open Source"}
        </h2>
        {lang === "zh" ? (
          <p>
            我们相信社区和透明度。我们核心工具和 UI 的源代码已经在 GitHub 上开源。无论您是想审计我们的数据处理方式、报告错误，还是贡献新功能，我们都随时欢迎。
          </p>
        ) : (
          <p>
            We believe in community and transparency. The source code for our core tools and UI is open-sourced on GitHub. Whether you want to audit our data practices, report a bug, or contribute a new feature, you are always welcome.
          </p>
        )}
        <p>
          <a href="https://github.com/PLZY/web-tools" target="_blank" rel="noreferrer" className="text-primary underline">
            {lang === "zh" ? "在 GitHub 上查看源码 →" : "View Source on GitHub →"}
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "联系方式" : "Contact"}
        </h2>
        {lang === "zh" ? (
          <p>
            有建议、发现 Bug 或只是想打个招呼？联系我们的最佳方式是在我们的 GitHub 仓库中提交 Issue。
          </p>
        ) : (
          <p>
            Have a suggestion, found a bug, or just want to say hi? The best way to reach us is by opening an issue on our GitHub repository.
          </p>
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
