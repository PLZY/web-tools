"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { useEffect, useState } from "react";

const articles = [
  {
    slug: "maven-dependency-conflict-resolution",
    date: "2024-03-01",
    tag: "Build Tools",
    titleZh: "Maven 依赖冲突与排查指南：告别 ClassNotFoundException",
    descZh: "深度解析 Maven 依赖调解原则，教你如何使用 mvn dependency:tree 命令排查和解决 Spring Boot 项目中的版本冲突问题。",
    titleEn: "Maven Dependency Conflict Resolution Guide: Say Goodbye to ClassNotFoundException",
    descEn: "A deep dive into Maven dependency mediation rules and how to use mvn dependency:tree to troubleshoot and resolve version conflicts in Spring Boot.",
  },
  {
    slug: "understanding-cron-expressions",
    date: "2024-03-02",
    tag: "Scheduling",
    titleZh: "彻底搞懂 Cron 表达式：从 Linux 到 Spring 定时任务",
    descZh: "Cron 表达式很难记？这篇文章带你全面图解 Cron 的语法、特殊字符（*, ?, L, W）以及在实际业务中编写复杂调度任务的最佳实践。",
    titleEn: "Understanding Cron Expressions: From Linux to Spring Scheduling",
    descEn: "Struggling with Cron syntax? This comprehensive guide explains the grammar, special characters (*, ?, L, W), and best practices for writing complex scheduled tasks.",
  },
  {
    slug: "production-ready-log-configuration",
    date: "2024-03-03",
    tag: "Logging",
    titleZh: "Logback 与 Log4j2 生产级配置最佳实践：防爆盘与性能优化",
    descZh: "你的服务器曾因为日志写满而宕机吗？本文分享在生产环境必须配置的 SizeAndTimeBasedRollingPolicy，以及如何开启异步日志提升吞吐量。",
    titleEn: "Production-Ready Logback & Log4j2 Configurations: Prevent Disk Full and Optimize Performance",
    descEn: "Has your server ever crashed due to full logs? We share why you must configure SizeAndTimeBasedRollingPolicy and how asynchronous logging boosts throughput.",
  },
  {
    slug: "json-serialization-deep-dive",
    date: "2024-03-04",
    tag: "Data Format",
    titleZh: "JSON 的前世今生与大文件解析优化",
    descZh: "作为 Web 数据交换的标准，JSON 在解析时可能带来严重的内存消耗。探讨 Jackson/Gson 原理，以及如何流式处理大型 JSON 结构。",
    titleEn: "JSON Deep Dive: Serialization and Optimizing Large File Parsing",
    descEn: "As the standard for Web data exchange, JSON parsing can consume significant memory. Explore Jackson/Gson internals and how to stream large JSON structures.",
  },
  {
    slug: "curl-cross-platform-guide",
    date: "2024-03-06",
    tag: "CLI Tools",
    titleZh: "cURL 跨平台踩坑指南：macOS、CMD、PowerShell 的引号地狱",
    descZh: "同一条 cURL 命令换个系统就报错？这篇文章帮你搞清楚三大平台的引号规则、转义差异和续行符，附带大模型流式调用实战。",
    titleEn: "cURL Cross-Platform Guide: Escaping Hell on macOS, CMD & PowerShell",
    descEn: "Same cURL command fails on a different OS? This guide breaks down quoting rules, escaping differences, and line continuation across platforms, with LLM streaming examples.",
  },
  {
    slug: "jvm-garbage-collection-tuning",
    date: "2024-03-05",
    tag: "Performance",
    titleZh: "JVM 内存模型与 GC 调优：基于硬件的参数配置配方",
    descZh: "不要再盲目复制网上的 JVM 参数了。本文教你如何根据服务器的 CPU 核心数和内存大小，科学地配置 G1/ZGC 垃圾回收器，压榨每一滴性能。",
    titleEn: "JVM Memory Model and GC Tuning: Hardware-Based Parameter Recipes",
    descEn: "Stop blindly copying JVM arguments. Learn how to scientifically configure G1/ZGC garbage collectors based on your server's CPU and memory to squeeze out every drop of performance.",
  }
];

export default function GuidesIndexPage() {
  const { lang, t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-4 mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {mounted ? (lang === 'zh' ? '开发者指南与技术专栏' : 'Developer Guides & Articles') : 'Developer Guides & Articles'}
        </h1>
        <p className="text-muted-foreground text-xl font-medium max-w-3xl">
          {mounted ? (lang === 'zh' ? '深入理解底层原理，掌握硬核的软件开发和排障技巧。' : 'Deep dive into the underlying principles and master hardcore software development and troubleshooting skills.') : 'Deep dive into the underlying principles and master hardcore software development and troubleshooting skills.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => {
          const title = (!mounted || lang === 'zh') ? article.titleZh : article.titleEn;
          const desc = (!mounted || lang === 'zh') ? article.descZh : article.descEn;

          return (
            <Link href={`/guides/${article.slug}`} key={article.slug} className="group flex flex-col justify-between bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                    {article.tag}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">{article.date}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {desc}
                </p>
              </div>
              <div className="pt-6 mt-auto flex items-center text-sm font-bold text-primary">
                {mounted ? (lang === 'zh' ? '阅读全文' : 'Read Article') : 'Read Article'}
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
