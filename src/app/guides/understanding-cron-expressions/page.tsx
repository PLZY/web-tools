"use client";

import { useTranslation } from "@/lib/i18n";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { CodeExample } from "@/components/ui/CodeExample";
import { InfoCard, FeatureGrid } from "@/components/ui/InfoCard";
import { Clock, Calendar, Settings } from "lucide-react";

export default function CronArticlePage() {
  const { lang } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const relatedTools = [
    {
      name: lang === 'zh' ? 'Cron 翻译官' : 'Cron Translator',
      url: '/cron',
      icon: <Clock className="w-4 h-4 text-blue-500" />
    },
    {
      name: lang === 'zh' ? 'JVM 调优' : 'JVM Tuning',
      url: '/jvm-tuning',
      icon: <Settings className="w-4 h-4 text-blue-500" />
    }
  ];

  return (
    <ArticleLayout
      title={mounted && lang === 'zh' ? "彻底搞懂 Cron 表达式：从 Linux 到 Spring 定时任务" : "Understanding Cron Expressions: From Linux to Spring Scheduling"}
      description={mounted && lang === 'zh' ?
        "Cron 表达式是一个强大但晦涩的工具。一旦你掌握了它的语法规则，无论是服务器的例行备份，还是 Spring Boot 的业务调度，都能轻松应对。" :
        "Cron expressions are powerful but can be notoriously difficult to read. Once you master the syntax, handling server backups or Spring Boot business scheduling becomes a breeze."
      }
      readTime={mounted && lang === 'zh' ? "8 分钟" : "8 min"}
      category={mounted && lang === 'zh' ? "定时任务" : "Task Scheduling"}
      backLabel={mounted ? (lang === 'zh' ? '返回技术专栏' : 'Back to Guides') : 'Back to Guides'}
      relatedTools={relatedTools}
      lang={lang}
    >
        {(!mounted || lang === 'zh') && (
          <div lang="zh" className={!mounted ? "hidden" : undefined}>
            <h2>什么是 Cron？</h2>
            <p>
              Cron 起源于 Unix/Linux 系统，是一个用于定期执行任务的守护进程。配置它运行时间格式的规则，就是 <strong>Cron 表达式</strong>。
            </p>

            <InfoCard title="版本差异" variant="info">
              <p>不同的系统和框架对 Cron 进行了扩展：</p>
              <ul className="mt-2 space-y-1">
                <li>• 标准 Linux Cron：<strong>5 个字段</strong></li>
                <li>• Java (Spring/Quartz)：<strong>6 个字段</strong></li>
                <li>• 某些调度器：支持可选的第 7 位（年）</li>
              </ul>
            </InfoCard>

            <h2>标准结构解析</h2>
            <p>一个 Spring 兼容的 6 位 Cron 表达式结构如下：</p>
            <div className="bg-slate-900 text-slate-50 p-6 rounded-xl overflow-x-auto my-6">
              <code className="text-lg">秒 (0-59) | 分 (0-59) | 时 (0-23) | 日 (1-31) | 月 (1-12) | 星期 (1-7)</code>
            </div>

            <InfoCard title="重要提示" variant="warning">
              星期字段中，1 表示星期日，2 表示星期一，以此类推（取决于具体实现，有时 0 和 7 都代表周日）。
            </InfoCard>

            <h2>特殊字符的魔力</h2>
            <p>Cron 之所以强大，完全归功于它的特殊字符：</p>

            <FeatureGrid
              items={[
                {
                  symbol: "*",
                  name: "通配符",
                  description: "意味着'每一个'。例如在'月'字段写 * 就是每个月。",
                  example: "* * * * * ? → 每秒执行"
                },
                {
                  symbol: "?",
                  name: "忽略",
                  description: "仅能在'日'和'星期'字段使用，避免冲突。指定了'日'，'星期'就必须是 ?",
                  example: "0 0 12 15 * ? → 每月15号中午"
                },
                {
                  symbol: "-",
                  name: "范围",
                  description: "表示时间范围。",
                  example: "0 0 10-12 * * ? → 10到12点整点执行"
                },
                {
                  symbol: ",",
                  name: "列表",
                  description: "指定多个值。",
                  example: "0 0 9,12,18 * * ? → 9点、12点、18点执行"
                },
                {
                  symbol: "/",
                  name: "步长",
                  description: "表示间隔执行。",
                  example: "0 0/15 * * * ? → 每15分钟执行一次"
                },
                {
                  symbol: "L",
                  name: "最后",
                  description: "在'日'字段表示当月最后一天，在'星期'字段表示月末最后一个指定星期。",
                  example: "0 0 12 L * ? → 每月最后一天中午"
                },
                {
                  symbol: "W",
                  name: "工作日",
                  description: "表示离指定日期最近的工作日（周一至周五）。",
                  example: "0 0 12 15W * ? → 离15号最近的工作日中午"
                }
              ]}
            />

            <h2>经典实战用例</h2>
            <div className="space-y-4">
              <CodeExample
                code="0 0 12 * * ?"
                explanation="每天中午 12 点准时触发。（日是 *，所以星期必须是 ?）"
                variant="success"
              />

              <CodeExample
                code="0 15 10 ? * 6L"
                explanation="每个月的最后一个星期五的早上 10:15 触发。"
                variant="info"
              />

              <CodeExample
                code="0 0/5 14,18 * * ?"
                explanation="每天的 14:00 到 14:55，以及 18:00 到 18:55，每隔 5 分钟触发一次。"
                variant="warning"
              />
            </div>

            <InfoCard title="实践建议" variant="tip">
              <p>还在头疼写错？你可以直接使用我们的 <Link href="/cron" className="text-blue-500 hover:underline font-medium">Cron 翻译官与预测工具</Link>。</p>
              <p className="mt-2">只需输入您的 Cron 表达式，我们会将其翻译为标准的人类语言，并推算并展示未来 7 次的精确触发时间，让您在部署到生产环境前做到心中有数。</p>
            </InfoCard>
          </div>
        )}

        {(!mounted || lang === 'en') && (
          <div lang="en" className={!mounted ? "hidden" : undefined}>
            <h2>What is Cron?</h2>
            <p>
              Originating from Unix/Linux systems, Cron is a time-based job scheduler daemon. The rule format used to configure its execution times is called a <strong>Cron expression</strong>.
            </p>

            <InfoCard title="Version Differences" variant="info">
              <p>Different systems and frameworks have extended Cron:</p>
              <ul className="mt-2 space-y-1">
                <li>• Standard Linux Cron: <strong>5 fields</strong></li>
                <li>• Java (Spring/Quartz): <strong>6 fields</strong></li>
                <li>• Some schedulers: Optional 7th field (Year)</li>
              </ul>
            </InfoCard>

            <h2>Structure Breakdown</h2>
            <p>A Spring-compatible 6-field Cron expression looks like this:</p>
            <div className="bg-slate-900 text-slate-50 p-6 rounded-xl overflow-x-auto my-6">
              <code className="text-lg">Second (0-59) | Minute (0-59) | Hour (0-23) | Day of Month (1-31) | Month (1-12) | Day of Week (1-7)</code>
            </div>

            <InfoCard title="Important Note" variant="warning">
              For the Day of Week, 1 usually means Sunday, 2 means Monday, etc. (implementations may vary - sometimes 0 and 7 both represent Sunday).
            </InfoCard>

            <h2>The Magic of Special Characters</h2>
            <p>The true power of Cron lies in its special characters:</p>

            <FeatureGrid
              items={[
                {
                  symbol: "*",
                  name: "Wildcard",
                  description: "Means 'every'. e.g., an asterisk in the Month field means every month.",
                  example: "* * * * * ? → Execute every second"
                },
                {
                  symbol: "?",
                  name: "Ignore",
                  description: "Only used in Day of Month and Day of Week fields to avoid conflicts.",
                  example: "0 0 12 15 * ? → 15th of every month at noon"
                },
                {
                  symbol: "-",
                  name: "Range",
                  description: "Specifies a range of values.",
                  example: "0 0 10-12 * * ? → Execute at 10, 11, 12 o'clock"
                },
                {
                  symbol: ",",
                  name: "List",
                  description: "Specifies multiple values.",
                  example: "0 0 9,12,18 * * ? → Execute at 9, 12, 18 o'clock"
                },
                {
                  symbol: "/",
                  name: "Step",
                  description: "Specifies interval execution.",
                  example: "0 0/15 * * * ? → Execute every 15 minutes"
                },
                {
                  symbol: "L",
                  name: "Last",
                  description: "In Day field: last day of month. In Weekday field: last specified weekday of month.",
                  example: "0 0 12 L * ? → Last day of month at noon"
                },
                {
                  symbol: "W",
                  name: "Workday",
                  description: "Nearest workday (Monday-Friday) to the specified date.",
                  example: "0 0 12 15W * ? → Nearest workday to the 15th at noon"
                }
              ]}
            />

            <h2>Classic Use Cases</h2>
            <div className="space-y-4">
              <CodeExample
                code="0 0 12 * * ?"
                explanation="Fire at 12:00 PM (noon) every day. (Since Day of Month is *, Day of Week must be ?)"
                variant="success"
              />

              <CodeExample
                code="0 15 10 ? * 6L"
                explanation="Fire at 10:15 AM on the last Friday of every month."
                variant="info"
              />

              <CodeExample
                code="0 0/5 14,18 * * ?"
                explanation="Fire every 5 minutes from 2:00 PM to 2:55 PM, and from 6:00 PM to 6:55 PM, every day."
                variant="warning"
              />
            </div>

            <InfoCard title="Practical Advice" variant="tip">
              <p>Still confused? Stop guessing and use our <Link href="/cron" className="text-blue-500 hover:underline font-medium">Cron Translator & Predictor</Link>.</p>
              <p className="mt-2">Simply paste your expression, and we will translate it into plain human language and calculate the next 7 exact execution timestamps. Validate before you deploy to production!</p>
            </InfoCard>
          </div>
        )}
    </ArticleLayout>
  );
}
