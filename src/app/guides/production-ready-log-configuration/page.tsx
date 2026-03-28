"use client";

import { useTranslation } from "@/lib/i18n";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { CodeExample } from "@/components/ui/CodeExample";
import { InfoCard, FeatureGrid } from "@/components/ui/InfoCard";
import { FileText, Settings } from "lucide-react";

export default function LogbackArticlePage() {
  const { lang } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const relatedTools = [
    {
      name: lang === 'zh' ? 'Logback/Log4j2 配置生成器' : 'Log Config Generator',
      url: '/log-config',
      icon: <FileText className="w-4 h-4 text-blue-500" />
    },
    {
      name: lang === 'zh' ? 'JVM 调优' : 'JVM Tuning',
      url: '/jvm-tuning',
      icon: <Settings className="w-4 h-4 text-blue-500" />
    }
  ];

  return (
    <ArticleLayout
      title={mounted && lang === 'zh'
        ? "Logback 与 Log4j2 生产级配置最佳实践：防爆盘与性能优化"
        : "Production-Ready Logback & Log4j2 Configurations: Prevent Disk Full and Optimize Performance"}
      description={mounted && lang === 'zh'
        ? "如果你还在使用框架默认的日志配置，你的服务器离「磁盘写满宕机」可能只有几天的距离。本文将探讨如何在 Java 生产环境中配置安全、高性能的日志框架。"
        : "If you are still using the framework's default logging configuration, your server might be just days away from a \"Disk Full\" crash. This article explores how to configure safe and high-performance logging frameworks in Java production environments."}
      readTime={mounted && lang === 'zh' ? "6 分钟" : "6 min"}
      category={mounted && lang === 'zh' ? "日志配置" : "Logging"}
      backLabel={mounted ? (lang === 'zh' ? '返回技术专栏' : 'Back to Guides') : 'Back to Guides'}
      relatedTools={relatedTools}
      lang={lang}
    >
      {(!mounted || lang === 'zh') && (
        <div lang="zh" className={!mounted ? "hidden" : undefined}>
          <h2>为什么需要自定义日志配置？</h2>
          <p>
            Spring Boot 等现代框架默认会将日志输出到控制台 (Console)。但在生产环境中，我们需要将日志持久化到文件中以便后续排查（例如输出到 <code>/var/log/myapp/app.log</code>）。
          </p>
          <p>
            如果只是简单地写入一个文件，随着时间的推移，这个文件会变得无限大，最终耗尽服务器的磁盘空间，导致操作系统崩溃。因此，<strong>日志轮转 (Log Rolling)</strong> 是生产环境不可或缺的配置。
          </p>

          <InfoCard title="磁盘写满风险" variant="warning">
            <p>如果你还在依赖框架默认的日志配置（仅输出到控制台或单一文件），你的生产服务器随时面临磁盘写满宕机的风险。一个日志量大的服务，可能几天内就能产生数十 GB 的日志文件，导致整个操作系统不可用。</p>
          </InfoCard>

          <h2>核心防御策略：SizeAndTimeBasedRollingPolicy</h2>
          <p>
            在 Logback 中，最推荐的滚动策略是 <code>SizeAndTimeBasedRollingPolicy</code>。它结合了时间和文件大小两个维度来切割日志。你需要配置三个核心参数：
          </p>

          <FeatureGrid
            items={[
              {
                symbol: "MFS",
                name: "MaxFileSize (单文件上限)",
                description: "当 app.log 达到设定大小时，框架会自动将其重命名（加上日期戳和序列号，并压缩为 .gz 格式），然后创建一个新的空 app.log 继续写入。使日志文件非常易于使用 grep 等命令搜索。",
                example: "100MB"
              },
              {
                symbol: "MH",
                name: "MaxHistory (保留天数)",
                description: "框架会自动删除超过设定天数的归档日志文件，保证磁盘空间不会被无限期的历史日志填满。",
                example: "15"
              },
              {
                symbol: "TSC",
                name: "TotalSizeCap (总容量上限)",
                description: "这是最后一道防线。即使日志还没有到过期时间，但如果所有日志文件加起来超过设定总量，最早的日志文件也会被强制删除。",
                example: "10GB"
              }
            ]}
          />

          <CodeExample
            title="Logback 滚动策略配置示例"
            code={`<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
  <file>/var/log/myapp/app.log</file>
  <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
    <fileNamePattern>/var/log/myapp/app.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
    <maxFileSize>100MB</maxFileSize>
    <maxHistory>15</maxHistory>
    <totalSizeCap>10GB</totalSizeCap>
  </rollingPolicy>
  <encoder>
    <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
  </encoder>
</appender>`}
            explanation="该配置将日志写入 /var/log/myapp/app.log，单文件最大 100MB，按日期和序号轮转并压缩为 .gz，最多保留 15 天，总容量上限 10GB。"
            variant="info"
          />

          <h2>性能进阶：异步日志 (AsyncAppender)</h2>
          <p>
            默认情况下，日志是<strong>同步写入</strong>的。这意味着业务线程在调用 <code>log.info()</code> 时，必须等待磁盘 I/O 完成。在超高并发场景下，磁盘 I/O 往往是最大的性能瓶颈。
          </p>
          <p>
            解决方案是引入<strong>异步日志</strong>。
          </p>
          <h3>Logback 的 AsyncAppender</h3>
          <p>
            Logback 提供了一个原生的 <code>AsyncAppender</code>。它会在内存中维护一个阻塞队列 (BlockingQueue)。业务线程只负责把日志事件放入队列即可返回，由后台专门的 Worker 线程负责将队列中的日志写入磁盘。
          </p>

          <InfoCard title="discardingThreshold 陷阱" variant="tip">
            <p>默认情况下，当队列剩余容量不足 20% 时，Logback 会直接<strong>丢弃</strong> TRACE、DEBUG 和 INFO 级别的日志以保全业务线程不被阻塞。如果你不能容忍 INFO 日志丢失，必须将 <code>discardingThreshold</code> 设置为 <code>0</code>。</p>
          </InfoCard>

          <h3>Log4j2：异步性能王者</h3>
          <p>
            如果你对性能有极致要求，推荐将 Spring Boot 默认的 Logback 替换为 <strong>Log4j2</strong>。Log4j2 引入了著名的无锁高并发框架 <strong>LMAX Disruptor</strong> 来实现异步日志。
          </p>

          <InfoCard title="Log4j2 + LMAX Disruptor 性能优势" variant="info">
            <p>在多线程并发写入测试中，Log4j2 的吞吐量可以达到 Logback 的 <strong>10 倍以上</strong>，且延迟极低。LMAX Disruptor 采用无锁环形缓冲区 (Ring Buffer) 设计，避免了传统 BlockingQueue 的锁竞争开销，是超高并发场景下的首选方案。</p>
          </InfoCard>

          <h2>一键生成生产级配置</h2>
          <p>
            手写冗长且容易出错的 XML 配置文件是一件痛苦的事情。我们强烈建议您使用本站的 <Link href="/log-config" className="text-primary hover:underline">Logback/Log4j2 配置生成器</Link>。只需在表单中填入您的项目名称、日志路径和保留策略，即可一键生成开箱即用、经过生产环境验证的 XML 配置文件！
          </p>
        </div>
      )}

      {(!mounted || lang === 'en') && (
        <div lang="en" className={!mounted ? "hidden" : undefined}>
          <h2>Why Do You Need Custom Log Configurations?</h2>
          <p>
            Modern frameworks like Spring Boot default to logging to the Console. However, in production, we need to persist logs to files for troubleshooting (e.g., outputting to <code>/var/log/myapp/app.log</code>).
          </p>
          <p>
            If you simply append to a single file, it will grow infinitely over time, eventually exhausting your server&apos;s disk space and crashing the OS. Therefore, <strong>Log Rolling (Log Rotation)</strong> is an indispensable configuration for production.
          </p>

          <InfoCard title="Disk Full Risk" variant="warning">
            <p>If you are still relying on the framework&apos;s default logging configuration (console-only or a single file), your production server is at constant risk of a disk-full crash. A high-traffic service can easily generate tens of gigabytes of log files within just a few days, rendering the entire operating system unusable.</p>
          </InfoCard>

          <h2>The Core Defense: SizeAndTimeBasedRollingPolicy</h2>
          <p>
            In Logback, the most recommended rolling strategy is the <code>SizeAndTimeBasedRollingPolicy</code>. It combines both time and file size dimensions to rotate logs. You need to configure three core parameters:
          </p>

          <FeatureGrid
            items={[
              {
                symbol: "MFS",
                name: "MaxFileSize",
                description: "When app.log reaches the configured size, the framework automatically renames it (adding a timestamp and sequence number, compressing to .gz), then creates a new empty app.log. This makes log files much easier to search with tools like grep.",
                example: "100MB"
              },
              {
                symbol: "MH",
                name: "MaxHistory",
                description: "The framework automatically deletes archived log files older than the configured number of days, ensuring the disk is not filled with indefinite historical logs.",
                example: "15"
              },
              {
                symbol: "TSC",
                name: "TotalSizeCap",
                description: "The ultimate fallback defense. Even if logs have not reached the expiration age, if the total size of all log files exceeds this limit, the oldest files are forcibly deleted.",
                example: "10GB"
              }
            ]}
          />

          <CodeExample
            title="Logback Rolling Policy Configuration Example"
            code={`<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
  <file>/var/log/myapp/app.log</file>
  <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
    <fileNamePattern>/var/log/myapp/app.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
    <maxFileSize>100MB</maxFileSize>
    <maxHistory>15</maxHistory>
    <totalSizeCap>10GB</totalSizeCap>
  </rollingPolicy>
  <encoder>
    <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
  </encoder>
</appender>`}
            explanation="This config writes logs to /var/log/myapp/app.log, with a max file size of 100MB, rolling by date and index with .gz compression, retaining up to 15 days, and a total size cap of 10GB."
            variant="info"
          />

          <h2>Performance Leap: Asynchronous Logging</h2>
          <p>
            By default, logging is <strong>synchronous</strong>. This means when a business thread calls <code>log.info()</code>, it must block and wait for the disk I/O to complete. Under ultra-high concurrency, disk I/O is often the biggest performance bottleneck.
          </p>
          <p>
            The solution is to introduce <strong>Asynchronous Logging</strong>.
          </p>
          <h3>Logback&apos;s AsyncAppender</h3>
          <p>
            Logback provides a native <code>AsyncAppender</code>. It maintains a BlockingQueue in memory. The business thread only needs to put the log event into the queue and return immediately, while a dedicated background Worker thread writes the queued logs to disk.
          </p>

          <InfoCard title="The discardingThreshold Trap" variant="tip">
            <p>By default, when the queue&apos;s remaining capacity drops below 20%, Logback will silently <strong>drop</strong> TRACE, DEBUG, and INFO level logs to prevent blocking the business thread. If you cannot tolerate losing INFO logs, you must set <code>discardingThreshold</code> to <code>0</code>.</p>
          </InfoCard>

          <h3>Log4j2: The King of Async Performance</h3>
          <p>
            If you demand extreme performance, it&apos;s highly recommended to replace Spring Boot&apos;s default Logback with <strong>Log4j2</strong>. Log4j2 utilizes the famous lock-free, high-concurrency framework <strong>LMAX Disruptor</strong> for its asynchronous logging.
          </p>

          <InfoCard title="Log4j2 + LMAX Disruptor Performance" variant="info">
            <p>In multi-threaded concurrent write tests, Log4j2&apos;s throughput can be over <strong>10 times higher</strong> than Logback&apos;s, with significantly lower latency. LMAX Disruptor uses a lock-free Ring Buffer design that eliminates the lock contention overhead of traditional BlockingQueues, making it the top choice for ultra-high concurrency scenarios.</p>
          </InfoCard>

          <h2>Generate Production-Ready Configs with One Click</h2>
          <p>
            Hand-writing lengthy and error-prone XML configuration files is painful. We strongly recommend using our <Link href="/log-config" className="text-primary hover:underline">Logback/Log4j2 Config Generator</Link>. Simply fill in your project name, log path, and retention policies in the form, and you can generate an out-of-the-box, production-tested XML configuration file with a single click!
          </p>
        </div>
      )}
    </ArticleLayout>
  );
}
