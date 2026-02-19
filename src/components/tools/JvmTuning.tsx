"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Copy, RefreshCw, BookOpen, Terminal, Settings2, Cpu, HardDrive, Database, Activity, ArrowUp, ShieldCheck, Gauge, Eye, RotateCcw, GripVertical } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type JdkVersion = "8" | "11" | "17" | "21";
type AppType = "web" | "batch" | "microservice";
type GcCollector = "Auto" | "G1" | "ZGC" | "Parallel";

interface JvmConfig {
  jdkVersion: JdkVersion;
  memorySize: number; // in GB
  appType: AppType;
  cpuCores: number;
  diskPath: string;
  metaspaceSize: number;
  enableDirectMemory: boolean;
  directMemorySize: number;
  gcCollector: GcCollector;
  logFileCount: number;
  logFileSize: number;
}

const DEFAULT_JAVA_OPTS_HEIGHT = 250; // 默认的 JAVA_OPTS_BUILDER 高度

const INITIAL_CONFIG: JvmConfig = {
  jdkVersion: "17",
  memorySize: 4,
  appType: "web",
  cpuCores: 4,
  diskPath: "/tmp/logs",
  metaspaceSize: 256,
  enableDirectMemory: false,
  directMemorySize: 512,
  gcCollector: "Auto",
  logFileCount: 10,
  logFileSize: 10,
};

interface GeneratedArg {
  name: string;
  value: string;
  anchorId: string;
  desc: string;
  isSpecial?: boolean;
  catId: string;
}

export default function JvmTuning() {
  const { lang, t } = useTranslation();
  const isZh = lang === "zh";
  const [config, setConfig] = useState<JvmConfig>(INITIAL_CONFIG);

  const [generatedArgs, setGeneratedArgs] = useState<GeneratedArg[]>([]);
  const [copied, setCopied] = useState(false);
  const [highlightedAnchor, setHighlightedAnchor] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [activeParam, setActiveParam] = useState<string | null>(null);
  const [javaOptsHeight, setJavaOptsHeight] = useState(DEFAULT_JAVA_OPTS_HEIGHT); 
  
  const directoryRef = useRef<HTMLDivElement>(null);
  const resizableRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const currentHeightRef = useRef(DEFAULT_JAVA_OPTS_HEIGHT); // For requestAnimationFrame
  let animationFrameId: number | null = null;

  // Handle mouse move for resizing (optimized with requestAnimationFrame)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || !resizableRef.current) return;

    const updateHeight = () => {
      const newHeight = e.clientY - resizableRef.current!.getBoundingClientRect().top;
      const clampedHeight = Math.max(160, Math.min(700, newHeight));
      currentHeightRef.current = clampedHeight; // Update ref directly
      if (resizableRef.current) {
        resizableRef.current.style.height = `${clampedHeight}px`;
      }
      animationFrameId = requestAnimationFrame(updateHeight);
    };

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(updateHeight);
  }, []);

  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    setJavaOptsHeight(currentHeightRef.current); // Update state once after resizing
  }, [handleMouseMove]);

  // Handle mouse down on resize handle
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  // 触发命令框更新动画
  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 500);
    return () => clearTimeout(timer);
  }, [config.appType, config.gcCollector, config.jdkVersion]);

  // 滚动监听：控制吸顶导航与 Scroll-Spy
  useEffect(() => {
    const handleScroll = () => {
      if (directoryRef.current) {
        const rect = directoryRef.current.getBoundingClientRect();
        setShowSticky(rect.bottom < 0);
      }

      const ids = encyclopedia.map(item => item.id);
      let currentActive = null;
      for (const id of ids) {
        const el = document.getElementById(`row-${id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            currentActive = id;
            break;
          }
        }
      }
      setActiveParam(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [generatedArgs]);

  // 页面加载或配置变化时，重置高度
  useEffect(() => {
    setJavaOptsHeight(DEFAULT_JAVA_OPTS_HEIGHT);
    currentHeightRef.current = DEFAULT_JAVA_OPTS_HEIGHT;
  }, [config, lang]); // 重置配置或语言时，恢复默认高度

  useEffect(() => {
    generateArgs();
  }, [config, lang]);

  const handleResetConfig = () => {
    setConfig(INITIAL_CONFIG);
    setJavaOptsHeight(DEFAULT_JAVA_OPTS_HEIGHT);
    currentHeightRef.current = DEFAULT_JAVA_OPTS_HEIGHT;
  };

  const handleResetJavaOptsHeight = () => {
    setJavaOptsHeight(DEFAULT_JAVA_OPTS_HEIGHT);
    currentHeightRef.current = DEFAULT_JAVA_OPTS_HEIGHT;
  };

  const generateArgs = () => {
    const { 
      jdkVersion, memorySize, appType, cpuCores, diskPath, 
      metaspaceSize, enableDirectMemory, directMemorySize,
      gcCollector, logFileCount, logFileSize
    } = config;
    
    const memoryMb = memorySize * 1024;
    let args: GeneratedArg[] = [];
    
    const addArg = (catId: string, name: string, value: string, desc: string, anchorId: string, isSpecial = false) => {
      args.push({ name, value, anchorId, desc, catId, isSpecial });
    };

    // 1. Memory Allocation
    let heapPercentage = 0.75;
    let isHeapSpecial = false;
    if (appType === "batch") {
      heapPercentage = 0.85;
      isHeapSpecial = true;
    }
    
    const heapSize = Math.floor(memoryMb * heapPercentage);
    addArg("memory", "-Xms", `${heapSize}m`, "Initial heap size", "xms-xmx", isHeapSpecial);
    addArg("memory", "-Xmx", `${heapSize}m`, "Maximum heap size", "xms-xmx", isHeapSpecial);
    
    addArg("memory", "-XX:MetaspaceSize=", `${metaspaceSize}m`, "Initial Metaspace size", "metaspacesize");
    addArg("memory", "-XX:MaxMetaspaceSize=", `${metaspaceSize}m`, "Maximum Metaspace size", "metaspacesize");
    if (enableDirectMemory) addArg("memory", "-XX:MaxDirectMemorySize=", `${directMemorySize}m`, "Max direct memory size", "maxdirectmemorysize");
    if (memorySize >= 8) addArg("memory", "-XX:ReservedCodeCacheSize=", "256m", "Reserved code cache size", "reservedcodecachesize");

    // 2. GC Strategy
    let effectiveGc = gcCollector;
    let isGcSpecial = false;
    if (effectiveGc === "Auto") {
      isGcSpecial = true;
      if (appType === "microservice" && (jdkVersion === "17" || jdkVersion === "21")) effectiveGc = "ZGC";
      else if (appType === "batch") effectiveGc = "Parallel";
      else effectiveGc = "G1";
    }

    if (effectiveGc === "ZGC") {
      addArg("gc", "-XX:+", "UseZGC", "Enable ZGC", "usezgc", isGcSpecial);
      if (jdkVersion === "21") addArg("gc", "-XX:+", "ZGenerational", "Enable Generational ZGC", "zgenerational", isGcSpecial);
    } else if (effectiveGc === "Parallel") {
      addArg("gc", "-XX:+", "UseParallelGC", "Enable Parallel GC", "useparallelgc", isGcSpecial);
    } else {
      addArg("gc", "-XX:+", "UseG1GC", "Enable G1 GC", "useg1gc", isGcSpecial);
      let pauseTime = 200;
      let isPauseSpecial = false;
      if (appType === "microservice") {
        pauseTime = 50;
        isPauseSpecial = true;
        addArg("gc", "-XX:", "G1HeapRegionSize=16m", "Reduce G1 fragmentation", "g1heapregionsize", true);
      }
      addArg("gc", "-XX:", `MaxGCPauseMillis=${pauseTime}`, "Set target GC pause", "maxgcpausemillis", isPauseSpecial);
      addArg("gc", "-XX:", "InitiatingHeapOccupancyPercent=45", "G1 IHOP threshold", "ihop");
    }
    
    const parallelThreads = Math.max(2, cpuCores);
    addArg("gc", "-XX:ParallelGCThreads=", `${parallelThreads}`, "Parallel GC threads", "parallelgcthreads");
    addArg("gc", "-XX:ConcGCThreads=", `${Math.max(1, Math.floor(parallelThreads / 4))}`, "Concurrent GC threads", "concgcthreads");

    // 3. Performance
    if (appType !== "batch") addArg("perf", "-XX:+", "AlwaysPreTouch", "Pre-touch memory pages", "alwayspretouch");
    if (jdkVersion === "8" || jdkVersion === "11") addArg("perf", "-XX:-", "UseBiasedLocking", "Disable biased locking", "usebiasedlocking");
    addArg("perf", "-XX:+", "TieredCompilation", "Enable tiered compilation", "tieredcompilation");
    if (memorySize >= 4) addArg("perf", "-XX:+", "UseStringDeduplication", "Enable string deduplication", "usestringdeduplication");

    // 4. Stability
    addArg("stability", "-XX:+", "ExitOnOutOfMemoryError", "Exit immediately on OOM", "exitonoutofmemoryerror");
    addArg("stability", "-XX:+", "DisableExplicitGC", "Disable manual System.gc()", "disableexplicitgc");
    addArg("stability", "-XX:", "SoftRefLRUPolicyMSPerMB=1000", "Soft reference LRU policy", "softreflrupolicy");
    addArg("stability", "-XX:-", "OmitStackTraceInFastThrow", "Disable stack trace omission", "omitstacktraceinfastthrow");

    // 5. Observability
    addArg("observability", "-XX:+", "HeapDumpOnOutOfMemoryError", "Auto heap dump on OOM", "heapdumponoutofmemoryerror");
    addArg("observability", "-XX:HeapDumpPath=", `${diskPath}/heapdump.hprof`, "Path for heap dump", "heapdumppath");
    if (jdkVersion === "8") addArg("observability", "-Xloggc:", `${diskPath}/gc.log`, "Path for GC logs", "xloggc");
    else addArg("observability", "-Xlog:", `gc*:file=${diskPath}/gc.log:time,tags:filecount=${logFileCount},filesize=${logFileSize}M`, "Unified logging", "xloggc");
    addArg("observability", "-XX:+", "PrintCommandLineFlags", "Print flags at startup", "printcommandlineflags");
    addArg("observability", "-XX:+", "UseContainerSupport", "Enable container awareness", "usecontainersupport");

    setGeneratedArgs(args);
  };

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(`row-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedAnchor(id);
      setTimeout(() => setHighlightedAnchor(null), 2500);
    }
  };

  const scrollToDirectory = () => {
    const topOffset = directoryRef.current ? directoryRef.current.offsetTop - 120 : 0;
    window.scrollTo({ top: topOffset, behavior: "smooth" });
    setHighlightedAnchor("directory-root");
    setTimeout(() => setHighlightedAnchor(null), 1500);
  };

  const copyToClipboard = () => {
    const fullCommand = `java ${generatedArgs.map(a => a.name + a.value).join(" ")} -jar app.jar`;
    navigator.clipboard.writeText(fullCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanLabel = (name: string, value: string) => {
    const cleanedName = name.replace(/^-XX:(\+|-)?|^-(Xms|Xmx|Xmn)/, (match) => {
        if (match.startsWith("-Xm")) return match.substring(1);
        return "";
    });
    if (name.startsWith("-Xm")) return `${cleanedName}: ${value}`;
    return `${cleanedName}${value}`;
  };

  const getCatColor = (catId: string) => {
    switch (catId) {
      case "memory": return "bg-blue-500";
      case "gc": return "bg-green-500";
      case "perf": return "bg-amber-500";
      case "stability": return "bg-rose-500";
      default: return "bg-indigo-500";
    }
  };

  const encyclopedia = [
    { catId: "memory", id: "xms-xmx", name: "-Xms / -Xmx", desc: isZh ? "堆内存初始值与最大值相等" : "Set initial heap equal to max heap", note: isZh ? "生产必备：防止堆动态扩容导致的频繁 GC 停顿与性能抖动。" : "Prevents GC overhead from heap resizing.", ver: "All" },
    { catId: "memory", id: "xmn", name: "-Xmn", desc: isZh ? "明确设置新生代 (Young Gen) 的大小" : "Set exact size of the young generation", note: isZh ? "调优技巧：在吞吐量优先场景下，较大的新生代可显著减少 Full GC 频率。" : "Helps reduce Full GC frequency in throughput-heavy apps.", ver: "All" },
    { catId: "memory", id: "metaspacesize", name: "-XX:MaxMetaspaceSize", desc: isZh ? "限制非堆区元空间 (Metaspace) 上限" : "Cap the maximum Metaspace size", note: isZh ? "安全防线：JDK 8+ 默认无上限，设置此值可防止类加载异常导致的物理内存耗尽。" : "Prevents native memory exhaustion by class loaders.", ver: "JDK 8+" },
    { catId: "memory", id: "maxdirectmemorysize", name: "-XX:MaxDirectMemorySize", desc: isZh ? "限制堆外直接内存 (Off-heap) 大小" : "Limit direct (off-heap) memory usage", note: isZh ? "NIO 必选：针对 Netty 等框架，防止直接内存泄露引发的宿主机 OOM。" : "Essential for NIO/Netty to prevent memory leaks.", ver: "All" },
    { catId: "memory", id: "maxrampercentage", name: "-XX:MaxRAMPercentage", desc: isZh ? "依据物理/容器内存百分比设置堆大小" : "Set heap based on memory percentage", note: isZh ? "容器化首选：在 K8s 环境下能动态感知容器 Limit，比设置固定值更具弹性。" : "Best practice for containerized apps.", ver: "JDK 8u191+" },
    
    { catId: "gc", id: "useg1gc", name: "-XX:+UseG1GC", desc: isZh ? "启用分代式 G1 垃圾收集器" : "Enable G1 garbage collector", note: isZh ? "主流平衡：大多数企业级微服务的默认推荐方案，兼顾吞吐量与停顿。" : "Balanced choice for most modern applications.", ver: "JDK 8u40+" },
    { catId: "gc", id: "usezgc", name: "-XX:+UseZGC", desc: isZh ? "启用可伸缩的低延迟 ZGC 收集器" : "Enable low-latency ZGC", note: isZh ? "极致响应：在 TB 级内存下仍能保持 <1ms 停顿，适合超大型应用。" : "Sub-millisecond pause times for large heaps.", ver: "JDK 11+" },
    { catId: "gc", id: "maxgcpausemillis", name: "-XX:MaxGCPauseMillis", desc: isZh ? "设置 GC 目标最大停顿时间" : "Set maximum GC pause time target", note: isZh ? "调优杠杆：G1 会尽力满足此时间，设得过低会导致 CPU 回收开销增加。" : "G1 will adjust its parameters to meet this target.", ver: "All" },
    { catId: "gc", id: "parallelgcthreads", name: "-XX:ParallelGCThreads", desc: isZh ? "设置 STW 阶段的并行回收线程数" : "Set parallel GC threads count", note: isZh ? "核心匹配：通常与机器核心数一致。线程过多会导致锁竞争，过少则 STW 过长。" : "Matching thread count to CPU cores is key.", ver: "All" },
    { catId: "gc", id: "concgcthreads", name: "-XX:ConcGCThreads", desc: isZh ? "设置并发标记阶段的 GC 线程数" : "Set concurrent GC threads count", note: isZh ? "吞吐优化：影响 GC 线程与应用线程并发执行时的资源竞争，通常为 ParallelGCThreads 的 1/4。" : "Usually 1/4 of ParallelGCThreads.", ver: "All" },
    { catId: "gc", id: "ihop", name: "-XX:InitiatingHeapOccupancyPercent", desc: isZh ? "G1 触发并发回收周期的阈值" : "G1 IHOP threshold", note: isZh ? "防患未然：默认 45%，若老年代增长极快建议调低，提前触发回收防 OOM。" : "Adjust this if the old gen fills up too quickly.", ver: "All" },
    { catId: "gc", id: "g1heapregionsize", name: "-XX:G1HeapRegionSize", desc: isZh ? "G1 堆分区大小" : "G1 region size", note: isZh ? "精细控制：对于大内存应用，增加 Region 大小可减少分区数量，降低管理开销。" : "G1 efficiency", ver: "All" },
    
    { catId: "perf", id: "alwayspretouch", name: "-XX:+AlwaysPreTouch", desc: isZh ? "启动时物理预分配并清零内存页" : "Pre-touch and zero memory pages at startup", note: isZh ? "冷启动加速：将内存缺页中断转移到启动阶段，避免运行时首次分配导致的毛刺。" : "Moves page faults to startup time.", ver: "All" },
    { catId: "perf", id: "tieredcompilation", name: "-XX:+TieredCompilation", desc: isZh ? "开启分层编译 (C1/C2 混合)" : "Enable tiered compilation (C1/C2)", note: isZh ? "编译平衡：综合应用启动速度与长期运行的最佳峰值性能，建议开启。" : "Balances fast startup and peak throughput.", ver: "All" },
    { catId: "perf", id: "usestringdeduplication", name: "-XX:+UseStringDeduplication", desc: isZh ? "开启堆内字符串去重" : "Enable string deduplication in heap", note: isZh ? "内存神技：利用 GC 扫描剔除重复字符串对象，可节省高达 15% 以上的堆空间。" : "Saves heap memory by de-duplicating strings.", ver: "JDK 8u20+" },
    { catId: "perf", id: "disableexplicitgc", name: "-XX:+DisableExplicitGC", desc: isZh ? "禁用手动 System.gc() 调用" : "Disable manual System.gc() calls", note: isZh ? "防御代码：防止某些三方库频繁触发 Full GC，确保 GC 完全由 JVM 托管。" : "Prevents third-party code from triggering Full GCs.", ver: "All" },
    
    { catId: "stability", id: "exitonoutofmemoryerror", name: "-XX:+ExitOnOutOfMemoryError", desc: isZh ? "发生 OOM 异常时强制 JVM 直接退出" : "Force JVM to exit upon OOM", note: isZh ? "云原生救命：OOM 后 JVM 往往处于不可控状态，退出可让 K8s 立即重启 Pod。" : "Essential for reliable container orchestration.", ver: "All" },
    { catId: "stability", id: "heapdumponoutofmemoryerror", name: "-XX:+HeapDumpOnOutOfMemoryError", desc: isZh ? "OOM 时自动导出堆快照 (.hprof)" : "Auto dump heap on OOM", note: isZh ? "排障必备：生产环境 OOM 是偶发且昂贵的，快照是事后分析的唯一铁证。" : "Capture the \"crime scene\" for post-mortem analysis.", ver: "All" },
    { catId: "stability", id: "heapdumppath", name: "-XX:HeapDumpPath", desc: isZh ? "指定堆快照文件的存储路径" : "Specify path for heap dump files", note: isZh ? "存储规范：务必指向挂载的磁盘路径，防止 Dump 文件撑爆容器根分区。" : "Ensures dumps are saved to persistent storage.", ver: "All" },
    { catId: "stability", id: "omitstacktraceinfastthrow", name: "-XX:-OmitStackTraceInFastThrow", desc: isZh ? "禁用 JVM 对高频异常堆栈的隐藏优化" : "Disable stack trace omission for frequent exceptions", note: isZh ? "排障利器：高频异常发生时 JVM 默认会隐藏堆栈，设置此项可永久保留堆栈。" : "Ensures full stack traces for repeated exceptions.", ver: "All" },
    
    { catId: "observability", id: "xloggc", name: "-Xlog:gc", desc: isZh ? "配置 JDK 9+ 的统一日志管理框架" : "Configure unified logging in JDK 9+", note: isZh ? "监控标准：通过日志滚动、时间戳及标签详细记录 GC 轨迹。" : "Standard way to log GC activities in modern JDKs.", ver: "JDK 9+" },
    { catId: "observability", id: "printcommandlineflags", name: "-XX:+PrintCommandLineFlags", desc: isZh ? "启动时打印最终生效的 JVM 参数" : "Print effective JVM flags at startup", note: isZh ? "配置对齐：在日志首行记录实际生效参数，用于核对自动化脚本是否生效。" : "Verify the configuration actually applied.", ver: "All" },
    { catId: "observability", id: "usecontainersupport", name: "-XX:+UseContainerSupport", desc: isZh ? "自动感知 Docker/K8s 容器资源限制" : "Auto-detect Docker/K8s resource limits", note: isZh ? "云原生基石：确保 JVM 正确识别容器分配的内存和核数，而非物理机全量。" : "Critical for correct resource utilization in clouds.", ver: "JDK 8u191+" },
    { catId: "observability", id: "ipv4", name: "-Djava.net.preferIPv4Stack=true", desc: isZh ? "强制优先使用 IPv4" : "Prefer IPv4 stack", note: isZh ? "规避抖动：部分网络环境下 IPv6 寻址会导致莫名其妙的请求超时或性能下降。" : "Networking fixes.", ver: "All" },
  ];

  const cats = [
    { id: "memory", title: isZh ? "内存分配" : "Memory", icon: <Database className="w-3 h-3" /> },
    { id: "gc", title: isZh ? "GC 策略" : "GC", icon: <Activity className="w-3 h-3" /> },
    { id: "perf", title: isZh ? "性能优化" : "Perf", icon: <Gauge className="w-3 h-3" /> },
    { id: "stability", title: isZh ? "安全稳定性" : "Stability", icon: <ShieldCheck className="w-3 h-3" /> },
    { id: "observability", title: isZh ? "观测与排障" : "Observability", icon: <Eye className="w-3 h-3" /> },
  ];

  return (
    <div className="space-y-12 pb-20 relative">
      {/* Sticky Quick Nav Bar */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform",
        showSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}>
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xl px-4 py-2 flex items-center gap-4 overflow-hidden">
           <div className="shrink-0 flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg font-black text-[10px] uppercase tracking-wider">
             <Terminal className="w-3 h-3" /> COMMAND HQ
           </div>
           <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1">
             {generatedArgs.map((arg, idx) => (
               <button 
                 key={idx}
                 onClick={() => scrollToAnchor(arg.anchorId)}
                 className={cn(
                   "shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all border",
                   activeParam === arg.anchorId 
                    ? "bg-blue-600 border-blue-600 text-white scale-105 shadow-lg shadow-blue-500/30" 
                    : "bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400 hover:border-blue-500/50"
                 )}
               >
                 {cleanLabel(arg.name, arg.value)}
               </button>
             ))}
           </div>
           <Button variant="ghost" size="icon" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="shrink-0">
             <ArrowUp className="w-4 h-4" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cockpit Controls - Shorter height, adaptive */}
        <Card className="lg:col-span-4 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b py-3 px-5 flex flex-row items-center justify-between">
            <CardTitle className="text-slate-950 dark:text-slate-50 flex items-center gap-2 text-base font-black tracking-tight">
              <Settings2 className="w-4 h-4 text-blue-600" />
              {isZh ? "驾驶舱配置" : "Cockpit Config"}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleResetConfig} className="h-7 gap-1.5 text-[10px] font-black uppercase tracking-wider border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-all">
              <RotateCcw className="w-3 h-3" /> {isZh ? "重置" : "Reset"}
            </Button>
          </CardHeader>
          <CardContent className="p-5 space-y-5 overflow-auto custom-scrollbar max-h-[700px]">
            <div className="space-y-5">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] uppercase font-black text-slate-400">JDK Version</Label>
                    <Select value={config.jdkVersion} onValueChange={(val: JdkVersion) => setConfig({ ...config, jdkVersion: val })}>
                      <SelectTrigger className="h-8 font-mono text-[11px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">JDK 8 (LTS)</SelectItem>
                        <SelectItem value="11">JDK 11 (LTS)</SelectItem>
                        <SelectItem value="17">JDK 17 (LTS)</SelectItem>
                        <SelectItem value="21">JDK 21 (LTS)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] uppercase font-black text-slate-400">CPU Cores</Label>
                    <Input type="number" value={config.cpuCores} onChange={(e) => setConfig({ ...config, cpuCores: parseInt(e.target.value) || 1 })} className="h-8 font-mono text-[11px]" />
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-center text-slate-950 dark:text-slate-200">
                    <Label className="font-bold text-[13px]">{t("jvm.config.mem")}</Label>
                    <span className="font-mono text-[11px] font-black bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded">{config.memorySize} GB</span>
                  </div>
                  <Slider value={[config.memorySize]} min={1} max={64} step={1} onValueChange={(vals) => setConfig({ ...config, memorySize: vals[0] })} />
               </div>

               <div className="space-y-2">
                 <Label className="text-[9px] uppercase font-black text-slate-400">{isZh ? "应用场景模式" : "App Scenario"}</Label>
                 <RadioGroup value={config.appType} onValueChange={(val: AppType) => setConfig({ ...config, appType: val })} className="grid grid-cols-1 gap-1.5">
                    {[
                      { id: "web", label: t("jvm.type.web") },
                      { id: "batch", label: t("jvm.type.batch") },
                      { id: "microservice", label: isZh ? "低延迟微服务 (Microservice)" : "Microservice" },
                    ].map(type => (
                      <div 
                        key={type.id} 
                        onClick={() => setConfig({ ...config, appType: type.id as AppType })}
                        className={cn(
                          "flex items-center space-x-2 rounded-lg border-2 p-2 transition-all cursor-pointer group",
                          config.appType === type.id ? "border-blue-600 bg-blue-50/20 dark:bg-blue-900/10" : "border-transparent bg-slate-50 dark:bg-slate-900/50 hover:border-slate-200 dark:hover:border-slate-800"
                        )}
                      >
                        <RadioGroupItem value={type.id} id={`cockpit-${type.id}`} className="pointer-events-none w-3.5 h-3.5" />
                        <Label htmlFor={`cockpit-${type.id}`} className="text-[12px] font-bold cursor-pointer flex-1">{type.label}</Label>
                      </div>
                    ))}
                 </RadioGroup>
               </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

            <div className="space-y-5">
               <div className="space-y-3">
                  <Label className="text-[9px] uppercase font-black text-slate-400">{isZh ? "GC 收集器选择" : "GC Collector"}</Label>
                  <RadioGroup value={config.gcCollector} onValueChange={(val: GcCollector) => setConfig({ ...config, gcCollector: val })} className="grid grid-cols-2 gap-1.5">
                    {[ "Auto", "G1", "ZGC", "Parallel" ].map(gc => {
                      const isZgcUnsupported = gc === "ZGC" && (config.jdkVersion === "8" || config.jdkVersion === "11");
                      return (
                        <div 
                          key={gc} 
                          onClick={() => !isZgcUnsupported && setConfig({ ...config, gcCollector: gc as GcCollector })}
                          className={cn(
                            "flex items-center space-x-2 rounded-lg border-2 p-2 transition-all",
                            isZgcUnsupported ? "opacity-20 grayscale cursor-not-allowed border-transparent bg-slate-100 dark:bg-slate-800" : 
                            config.gcCollector === gc ? "border-blue-600 bg-blue-50/20 dark:bg-blue-900/10" : "border-transparent bg-slate-50 dark:bg-slate-900/50 hover:border-slate-200 dark:hover:border-slate-800 cursor-pointer"
                          )}
                        >
                          <RadioGroupItem value={gc} id={`gc-${gc}`} disabled={isZgcUnsupported} className="pointer-events-none w-3.5 h-3.5" />
                          <Label htmlFor={`gc-${gc}`} className={cn("text-[11px] font-bold flex-1", isZgcUnsupported ? "cursor-not-allowed" : "cursor-pointer")}>{gc}</Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  {(config.jdkVersion === "8" || config.jdkVersion === "11") && <p className="text-[10px] text-amber-600 font-medium px-1">{isZh ? "⚠️ 当前 JDK 版本不支持 ZGC，建议升级至 JDK 17+" : "⚠️ ZGC not supported on current JDK. JDK 17+ recommended."}</p>}
               </div>

               <div className="space-y-1.5">
                 <Label className="text-[9px] uppercase font-black text-slate-400">Log/Dump Root Path</Label>
                 <Input value={config.diskPath} onChange={(e) => setConfig({ ...config, diskPath: e.target.value })} className="h-8 font-mono text-[11px]" />
               </div>

               <div className="space-y-3">
                 <div onClick={() => setConfig({ ...config, enableDirectMemory: !config.enableDirectMemory })} className="flex items-center space-x-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all cursor-pointer group">
                    <Checkbox id="direct-mem" checked={config.enableDirectMemory} className="pointer-events-none w-3.5 h-3.5" />
                    <Label htmlFor="direct-mem" className="text-[11px] font-black cursor-pointer flex-1">{isZh ? "限制堆外直接内存 (MaxDirectMemorySize)" : "Limit Off-heap Memory"}</Label>
                 </div>
                 {config.enableDirectMemory && (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                      <Label className="text-[9px] uppercase font-black text-slate-400 mb-1 block pl-1">Size (MB)</Label>
                      <Input 
                        type="number" 
                        value={config.directMemorySize} 
                        onChange={(e) => setConfig({ ...config, directMemorySize: parseInt(e.target.value) || 512 })}
                        className="h-8 font-mono text-[11px]"
                      />
                    </div>
                 )}
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Output Section with 3:2 Ratio */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
          {/* Result Command Box - VERTICALLY RESIZABLE */}
          <div 
            ref={resizableRef}
            style={{ height: javaOptsHeight, minHeight: "160px", maxHeight: "700px" }}
            className={cn(
              "rounded-xl overflow-hidden border-2 shadow-xl flex flex-col bg-[#010816] transition-all duration-500 relative",
              isUpdating ? "border-blue-500 ring-4 ring-blue-500/20 scale-[1.005]" : "border-slate-900 dark:border-slate-800"
            )}
          >
            <div className="bg-slate-900/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 flex justify-between items-center border-b border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="h-3.5 w-px bg-slate-700" />
                <div className="flex items-center gap-2 text-slate-500">
                  <Terminal className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em]">JAVA_OPTS_BUILDER</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" size="sm" onClick={handleResetJavaOptsHeight}
                  className="h-7 gap-1.5 text-[10px] font-black text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-all rounded-md px-3"
                  title={isZh ? "重置高度" : "Reset height"}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" size="sm" onClick={copyToClipboard}
                  className="h-7 gap-1.5 text-[10px] font-black text-slate-400 hover:text-white hover:bg-white/5 transition-all rounded-md px-3"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? t("common.copied") : t("jvm.result.copy")}
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-6 font-mono text-[13px] leading-[1.6] overflow-auto custom-scrollbar selection:bg-blue-500/40 relative">
              <div className="flex gap-5 h-full">
                <div className="flex flex-col text-slate-800 select-none text-right min-w-[1rem] font-bold">
                  <span>1</span>
                </div>
                <div className="flex-1 text-slate-300">
                  <span className="text-purple-400 font-black italic">java</span>{" "}
                  {generatedArgs.map((arg, idx) => (
                    <span key={idx}>
                      <span 
                        onClick={() => scrollToAnchor(arg.anchorId)}
                        title={arg.desc}
                        className="cursor-pointer hover:bg-blue-500/20 hover:text-blue-200 transition-all rounded px-0.5 border-b border-transparent hover:border-blue-500/50 group/arg"
                      >
                        <span className="text-blue-400 font-bold">{arg.name}</span>
                        <span className="text-amber-300 group-hover/arg:text-amber-200 transition-colors">{arg.value}</span>
                      </span>
                      {" "}
                    </span>
                  ))}
                  <span className="text-emerald-400 font-bold">-jar</span> <span className="text-slate-500 font-medium tracking-tight">app.jar</span>
                </div>
              </div>
            </div>
            {/* Resize Handle */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-4 bg-transparent cursor-ns-resize flex items-center justify-center group-hover:bg-slate-800/50 transition-colors z-10"
              onMouseDown={handleMouseDown}
              title={isZh ? "拖动调整高度" : "Drag to resize height"}
            >
              <GripVertical className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>

          {/* Directory Pills */}
          <div ref={directoryRef} className={cn(
            "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex-1 flex flex-col min-h-[150px] transition-all duration-700 relative", // Added min-h-[150px]
            highlightedAnchor === "directory-root" ? "ring-4 ring-blue-500/20 border-blue-500 shadow-2xl scale-[1.005]" : ""
          )}
          style={{ overflowY: "auto" }}>
             <div className="flex items-center justify-between mb-5 shrink-0">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <RefreshCw className="w-3 h-3" />
                 {isZh ? "生成参数目录" : "Parameter Pills"}
               </h4>
               <span className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-500 font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{generatedArgs.length} Items</span>
             </div>
             
             <div className="flex-1 overflow-auto space-y-6 pr-2 custom-scrollbar">
                {cats.map(cat => {
                   const items = generatedArgs.filter(a => a.catId === cat.id);
                   if (items.length === 0) return null;
                   return (
                     <div key={cat.id} className="space-y-2.5">
                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">
                           <div className={cn("p-0.5 rounded-sm text-white", getCatColor(cat.id))}>{cat.icon}</div>
                           {cat.title}
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {items.map((arg, idx) => (
                             <div 
                               key={idx}
                               onClick={() => scrollToAnchor(arg.anchorId)}
                               className={cn(
                                 "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all cursor-pointer group",
                                 arg.isSpecial && "border-blue-400/50 ring-2 ring-blue-500/5 relative"
                               )}
                             >
                               {arg.isSpecial && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-slate-950 animate-pulse" />}
                               <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors whitespace-nowrap overflow-hidden max-w-[220px] text-ellipsis">
                                 {cleanLabel(arg.name, arg.value)}
                               </span>
                             </div>
                           ))}
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>
        </div>
      </div>

      {/* Authority Guide Section */}
      <div className="space-y-10 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col space-y-3">
          <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50 flex items-center gap-4 tracking-tight">
            <div className="p-1.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20"><BookOpen className="w-6 h-6" /></div>
            {isZh ? "JVM 核心参数权威指南" : "JVM Core Parameters Authority Guide"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-base max-w-2xl leading-relaxed">
            {isZh ? "深度解析生产环境中的配置痛点，点击参数名称即可快速返回顶部。" : "In-depth analysis of configuration pain points. Click parameter name to return."
            }
          </p>
        </div>

        <div className="space-y-16">
          {cats.map(cat => {
            const items = encyclopedia.filter(item => item.catId === cat.id);
            if (items.length === 0) return null;
            const catColor = getCatColor(cat.id);
            
            return (
              <div key={cat.id} className="bg-white dark:bg-slate-950 rounded-3xl border-2 border-slate-100 dark:border-slate-900 shadow-xl overflow-hidden group/cat transition-all duration-500 hover:shadow-2xl">
                <div className="flex">
                  <div className={`w-1.5 ${catColor} shrink-0 transition-all duration-500 group-hover/cat:w-3`}></div>
                  <div className="flex-1">
                    <div className="bg-slate-50/50 dark:bg-slate-900/50 px-8 py-5 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center">
                      <h3 className="font-black text-slate-900 dark:text-slate-50 flex items-center gap-3 text-lg uppercase tracking-widest">
                        {cat.icon} {cat.title}
                      </h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{items.length} PARAMETERS</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-50 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/30">
                            <th className="px-8 py-4 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] w-1/4">{isZh ? "核心参数名称" : "PARAMETER NAME"}</th>
                            <th className="px-8 py-4 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] w-3/4">{isZh ? "核心作用与生产建议" : "CORE ACTION & RECOMMENDATION"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                          {items.map((item, i) => (
                            <tr 
                              key={i} id={`row-${item.id}`}
                              className={cn(
                                "transition-all duration-700 group/row relative",
                                highlightedAnchor === item.id 
                                  ? "bg-blue-600/[0.08] dark:bg-blue-600/[0.12] z-10 animate-pulse-light shadow-[inset_0_0_20px_rgba(37,99,235,0.1)]" 
                                  : "hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                              )}
                            >
                              <td className="px-8 py-7 align-top">
                                <div className="space-y-3">
                                  <div 
                                    onClick={scrollToDirectory}
                                    className="font-mono font-black text-blue-600 dark:text-blue-400 text-[15px] cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-2 group/name transition-colors"
                                    title={isZh ? "点击返回目录" : "Click to go back to directory"}
                                  >
                                    {item.name}
                                    <ArrowUp className="w-4 h-4 opacity-0 -translate-y-2 group-hover/name:opacity-100 group-hover/name:translate-y-0 transition-all duration-300" />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 uppercase">{item.ver}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-7 align-top">
                                <div className="space-y-4">
                                  <div className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug">{item.desc}</div>
                                  <div className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-black/20 p-4 rounded-xl border-2 border-dashed border-slate-100 dark:border-slate-800/50 shadow-inner group-hover/row:border-blue-500/20 transition-colors">
                                    <p className="font-medium">{item.note}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-light {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; background-color: rgba(37, 99, 235, 0.15); transform: scale(1.002); }
        }
        .animate-pulse-light {
          animation: pulse-light 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.4);
        }
      `}</style>
    </div>
  );
}
