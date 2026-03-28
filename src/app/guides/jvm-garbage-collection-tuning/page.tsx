"use client";

import { useTranslation } from "@/lib/i18n";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { CodeExample } from "@/components/ui/CodeExample";
import { InfoCard, FeatureGrid } from "@/components/ui/InfoCard";
import { Settings, Cpu } from "lucide-react";

export default function JvmArticlePage() {
  const { lang } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const relatedTools = [
    {
      name: lang === 'zh' ? 'JVM 调优配方生成器' : 'JVM Tuning Generator',
      url: '/jvm-tuning',
      icon: <Settings className="w-4 h-4 text-blue-500" />
    },
    {
      name: lang === 'zh' ? 'Logback/Log4j2 配置' : 'Log Config Generator',
      url: '/log-config',
      icon: <Cpu className="w-4 h-4 text-blue-500" />
    }
  ];

  return (
    <ArticleLayout
      title={mounted && lang === 'zh'
        ? "JVM 内存模型与 GC 调优：基于硬件的参数配置配方"
        : "JVM Memory Model and GC Tuning: Hardware-Based Parameter Recipes"}
      description={mounted && lang === 'zh'
        ? "不要再盲目复制网上的 JVM 参数了。服务器配置不同，业务场景不同，最佳的垃圾回收策略完全不同。本文带你走出 JVM 调优的玄学误区。"
        : "Stop blindly copying JVM arguments from old forums. Different servers and business scenarios demand entirely different garbage collection strategies. This guide demystifies the black art of JVM tuning."}
      readTime={mounted && lang === 'zh' ? "7 分钟" : "7 min"}
      category={mounted && lang === 'zh' ? "性能优化" : "Performance"}
      backLabel={mounted ? (lang === 'zh' ? '返回技术专栏' : 'Back to Guides') : 'Back to Guides'}
      relatedTools={relatedTools}
      lang={lang}
    >
      {(!mounted || lang === 'zh') && (
        <div lang="zh" className={!mounted ? "hidden" : undefined}>
          <h2>为什么需要 JVM 调优？</h2>
          <p>
            Java 虚拟机 (JVM) 虽然拥有自动的垃圾回收机制 (Garbage Collection, GC)，但默认的配置往往是为了兼顾"大多数"中小型应用的通用策略。
          </p>
          <p>
            如果你的应用属于高并发（如秒杀系统）、大内存（如大数据计算）或对延迟极其敏感（如量化交易），默认的 JVM 参数不仅无法发挥硬件的全部性能，还可能引发频繁的 Full GC（导致世界暂停 STW，Stop The World），让你的 API 响应时间像过山车一样剧烈波动。
          </p>

          <InfoCard title="警告：默认参数的隐患" variant="warning">
            <p>对于高并发系统，使用 JVM 默认参数是非常危险的。默认的堆大小通常只有 256MB，垃圾回收器也未针对你的硬件和业务场景优化。这意味着在流量高峰时，你的应用可能频繁触发 Full GC，每次暂停数百毫秒甚至数秒，直接导致请求超时和用户体验崩溃。</p>
          </InfoCard>

          <h2>内存模型快速扫盲</h2>
          <p>在调优之前，必须了解堆内存 (Heap) 的基本结构（以经典的 JDK 8 为例）：</p>

          <FeatureGrid items={[
            {
              symbol: "Y",
              name: "年轻代 (Young Generation)",
              description: "包含 Eden 区和两个 Survivor 区。新创建的对象绝大多数都在这里分配。年轻代的垃圾回收称为 Minor GC，极其频繁但速度很快。",
              example: "-Xmn1g"
            },
            {
              symbol: "O",
              name: "老年代 (Old Generation)",
              description: "熬过多次 Minor GC 的对象会被晋升到这里（比如缓存、Spring 的单例 Bean）。老年代的空间通常比年轻代大，这里的垃圾回收称为 Major GC / Full GC，耗时较长。",
              example: "-XX:NewRatio=2"
            },
            {
              symbol: "M",
              name: "元空间 (Metaspace)",
              description: "存储类的元数据。它使用的是本地内存 (Native Memory)，而不是 JVM 堆内存。在 JDK 8 之前称为永久代 (PermGen)。",
              example: "-XX:MaxMetaspaceSize=256m"
            }
          ]} />

          <h2>三大垃圾回收器 (Garbage Collectors) 对比</h2>
          <p>选择正确的 GC 是调优的第一步：</p>

          <FeatureGrid items={[
            {
              symbol: "P",
              name: "Parallel GC (吞吐量优先)",
              description: "JDK 8 的默认收集器。它的目标是最大化单位时间内的处理任务数，适合后台批处理、数据报表生成等对延迟不敏感的场景。",
              example: "-XX:+UseParallelGC"
            },
            {
              symbol: "G1",
              name: "G1 GC (延迟优先 / 均衡王者)",
              description: "JDK 9+ 的默认收集器。它将堆内存划分为多个 Region，可以在指定的停顿时间内（如 200ms）尽可能多地回收垃圾。适合 4GB 到 32GB 内存范围的绝大多数 Web 应用程序。",
              example: "-XX:+UseG1GC -XX:MaxGCPauseMillis=200"
            },
            {
              symbol: "Z",
              name: "ZGC / Shenandoah (超低延迟)",
              description: "JDK 11/15 引入的下一代垃圾回收器。无论堆内存多大（可达 TB 级别），它都能保证 STW 停顿时间不超过 10ms 甚至 1ms。代价是会消耗一定的 CPU 吞吐量。适合金融交易、大型在线游戏等对延迟极度苛刻的系统。",
              example: "-XX:+UseZGC"
            }
          ]} />

          <h2>调优的黄金原则 (Rule of Thumb)</h2>
          <p>
            真正的调优其实只有几条核心原则：
          </p>

          <p><strong>堆大小必须锁定</strong>：永远将 <code>-Xms</code> (初始堆大小) 和 <code>-Xmx</code> (最大堆大小) 设置为相同的值。这可以防止 JVM 在运行期间动态扩展和收缩堆内存所带来的性能开销和抖动。</p>

          <CodeExample
            title="堆大小锁定示例"
            code="-Xms4g -Xmx4g"
            explanation="将初始堆和最大堆都设置为 4GB，避免 JVM 运行时动态调整堆大小带来的性能开销。这是生产环境的标准做法。"
            variant="success"
          />

          <p><strong>为操作系统留有余地</strong>：千万不要把服务器的全部物理内存都分配给 JVM。</p>

          <InfoCard title="切勿将 100% 内存分配给 JVM" variant="warning">
            <p>操作系统本身、JVM 元空间、直接内存 (Direct Memory) 以及容器的 Overhead 至少需要保留 25%-30% 的空间。如果你在 4GB 内存的 Docker 容器中设置 <code className="font-mono bg-amber-100 dark:bg-amber-800/30 px-1 rounded">-Xmx4g</code>，容器会因为 OOMKilled 被内核直接杀掉。</p>
            <p className="mt-2">推荐公式：<strong>JVM 堆大小 = 服务器总内存 × 70%</strong></p>
          </InfoCard>

          <h2>如何获得最佳配置？</h2>
          <p>
            JVM 调优的参数极其复杂，包含垃圾回收器选择、内存比例分配、逃逸分析控制等。
          </p>
          <p>
            您可以直接使用我们的 <Link href="/jvm-tuning" className="text-primary hover:underline">JVM 调优配方生成器</Link>。只需输入您的服务器内存大小、CPU 核心数、JDK 版本以及您的核心业务类型（偏向吞吐量还是低延迟），我们的算法就会自动为您生成一套符合最佳实践的 JVM 启动脚本，直接复制到生产环境即可。
          </p>

          <InfoCard title="试试 JVM 调优工具" variant="tip">
            <p>不想手动拼接复杂的 JVM 参数？我们的 <Link href="/jvm-tuning" className="text-primary hover:underline font-semibold">JVM 调优配方生成器</Link> 支持根据你的硬件配置（内存、CPU、JDK 版本）一键生成生产级启动脚本，包含 GC 日志、OOM dump 等最佳实践参数。</p>
          </InfoCard>
        </div>
      )}

      {(!mounted || lang === 'en') && (
        <div lang="en" className={!mounted ? "hidden" : undefined}>
          <h2>Why Do We Need JVM Tuning?</h2>
          <p>
            While the Java Virtual Machine (JVM) has automatic Garbage Collection (GC), the default configurations are generally a &quot;one-size-fits-all&quot; compromise aimed at small to medium applications.
          </p>
          <p>
            If your application handles high concurrency (like flash sales), massive memory footprints (big data computing), or is ultra-sensitive to latency (high-frequency trading), the default parameters will fail to exploit your hardware. Worse, they can trigger frequent Full GCs (causing Stop-The-World, STW pauses), making your API response times wildly unpredictable.
          </p>

          <InfoCard title="Warning: The Danger of Default Parameters" variant="warning">
            <p>For high-concurrency systems, relying on default JVM parameters is risky. The default heap size is often just 256MB, and the garbage collector is not optimized for your hardware or workload. During traffic spikes, your application may trigger frequent Full GCs, each pausing for hundreds of milliseconds or even seconds, causing request timeouts and degraded user experience.</p>
          </InfoCard>

          <h2>Memory Model Quick Primer</h2>
          <p>Before tuning, you must understand the basic structure of the Heap (using JDK 8 as a classic example):</p>

          <FeatureGrid items={[
            {
              symbol: "Y",
              name: "Young Generation",
              description: "Contains the Eden space and two Survivor spaces. Almost all new objects are allocated here. Garbage collection here is called Minor GC, which is very frequent but extremely fast.",
              example: "-Xmn1g"
            },
            {
              symbol: "O",
              name: "Old Generation",
              description: "Objects that survive multiple Minor GCs are promoted here (e.g., caches, Spring Singleton Beans). The Old Gen is usually larger. Garbage collection here is called Major GC / Full GC and takes significantly longer.",
              example: "-XX:NewRatio=2"
            },
            {
              symbol: "M",
              name: "Metaspace",
              description: "Stores class metadata. It uses native OS memory rather than the JVM heap. Before JDK 8, this was known as PermGen (Permanent Generation).",
              example: "-XX:MaxMetaspaceSize=256m"
            }
          ]} />

          <h2>The Three Major Garbage Collectors Compared</h2>
          <p>Choosing the right GC is step one of tuning:</p>

          <FeatureGrid items={[
            {
              symbol: "P",
              name: "Parallel GC (Throughput First)",
              description: "The default in JDK 8. Its goal is to maximize the number of tasks processed per unit of time. Best suited for background batch processing or data reporting where latency is not the primary concern.",
              example: "-XX:+UseParallelGC"
            },
            {
              symbol: "G1",
              name: "G1 GC (Latency First / The All-Rounder)",
              description: "The default from JDK 9 onwards. It divides the heap into Regions and attempts to collect as much garbage as possible within a user-specified pause time target (e.g., 200ms). Perfect for most Web applications with heaps ranging from 4GB to 32GB.",
              example: "-XX:+UseG1GC -XX:MaxGCPauseMillis=200"
            },
            {
              symbol: "Z",
              name: "ZGC / Shenandoah (Ultra-Low Latency)",
              description: "The next-generation collectors introduced in JDK 11/15. No matter how large the heap is (even Terabytes), they guarantee STW pauses will not exceed 10ms (or even 1ms). The trade-off is a slight reduction in overall CPU throughput. Ideal for financial trading platforms or large multiplayer games.",
              example: "-XX:+UseZGC"
            }
          ]} />

          <h2>The Golden Rules of Thumb</h2>
          <p>
            Real tuning boils down to a few core principles:
          </p>

          <p><strong>Lock the Heap Size</strong>: Always set <code>-Xms</code> (initial heap) and <code>-Xmx</code> (maximum heap) to the exact same value. This prevents the JVM from suffering the performance overhead and latency spikes caused by dynamically expanding or shrinking the heap during runtime.</p>

          <CodeExample
            title="Heap Size Locking Example"
            code="-Xms4g -Xmx4g"
            explanation="Set both the initial and maximum heap to 4GB to avoid the performance overhead of JVM dynamically resizing the heap at runtime. This is a standard practice for production environments."
            variant="success"
          />

          <p><strong>Leave Room for the OS</strong>: Never allocate 100% of your physical server RAM to the JVM.</p>

          <InfoCard title="Never Give 100% of RAM to the JVM" variant="warning">
            <p>The operating system, JVM Metaspace, Direct Memory, and Container overhead require at least 25%-30% of the total RAM. If you set <code className="font-mono bg-amber-100 dark:bg-amber-800/30 px-1 rounded">-Xmx4g</code> inside a 4GB Docker container, the Linux kernel will terminate it via OOMKiller.</p>
            <p className="mt-2">Recommended formula: <strong>JVM Heap Size = Total Server RAM x 70%</strong></p>
          </InfoCard>

          <h2>How to Get the Best Configuration?</h2>
          <p>
            JVM tuning involves complex parameters regarding collector selection, memory ratios, and escape analysis controls.
          </p>
          <p>
            Instead of guessing, use our <Link href="/jvm-tuning" className="text-primary hover:underline">JVM Tuning Recipe Generator</Link>. Simply input your server&apos;s RAM, CPU cores, JDK version, and your primary business requirement (Throughput vs. Latency). Our algorithm will instantly generate a production-tested JVM startup script tailored precisely for your environment.
          </p>

          <InfoCard title="Try the JVM Tuning Tool" variant="tip">
            <p>Don&apos;t want to manually piece together complex JVM arguments? Our <Link href="/jvm-tuning" className="text-primary hover:underline font-semibold">JVM Tuning Recipe Generator</Link> generates production-grade startup scripts based on your hardware configuration (RAM, CPU, JDK version), complete with GC logging, OOM heap dump, and other best-practice flags.</p>
          </InfoCard>
        </div>
      )}
    </ArticleLayout>
  );
}
