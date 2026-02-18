"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

type JdkVersion = "8" | "11" | "17" | "21";
type AppType = "web" | "batch" | "low_latency";

interface JvmConfig {
  jdkVersion: JdkVersion;
  memorySize: number; // in GB
  appType: AppType;
}

export default function JvmTuning() {
  const { lang, t } = useTranslation();
  const isZh = lang === 'zh';
  const [config, setConfig] = useState<JvmConfig>({
    jdkVersion: "17",
    memorySize: 4,
    appType: "web",
  });

  const [generatedArgs, setGeneratedArgs] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateArgs();
  }, [config, lang]);

  const generateArgs = () => {
    const { jdkVersion, memorySize, appType } = config;
    const memoryMb = memorySize * 1024;
    let args: string[] = [];
    let expl: string[] = [];

    const isZh = lang === 'zh';

    // 1. Memory Settings
    const heapSize = Math.floor(memoryMb * 0.75); 
    args.push(`-Xms${heapSize}m`);
    args.push(`-Xmx${heapSize}m`);
    expl.push(isZh ? `**内存设置**: 将堆内存设置为 ${heapSize}MB (占总内存 75%)，且初始堆(-Xms)与最大堆(-Xmx)相等，防止运行时堆大小动态调整带来的性能抖动。` : `**Memory**: Set heap to ${heapSize}MB (75% of total), with Xms = Xmx to avoid runtime resizing overhead.`);

    const metaspaceSize = 256;
    args.push(`-XX:MetaspaceSize=${metaspaceSize}m`);
    args.push(`-XX:MaxMetaspaceSize=${metaspaceSize}m`);
    expl.push(isZh ? `**元空间**: 限制元空间为 ${metaspaceSize}MB，防止因类加载过多导致原生内存溢出(OOM: Metaspace)。` : `**Metaspace**: Cap Metaspace at ${metaspaceSize}MB to prevent native memory OOM.`);

    // 2. GC Strategy
    if (appType === "low_latency" && (jdkVersion === "17" || jdkVersion === "21")) {
      if (jdkVersion === "21") {
        args.push("-XX:+UseZGC");
        args.push("-XX:+ZGenerational");
        expl.push(isZh ? `**GC 策略**: 启用 **Generational ZGC** (JDK 21+)。停顿时间通常 <1ms。` : `**GC Strategy**: Enable **Generational ZGC** (JDK 21+). Pause times typically <1ms.`);
      } else {
        args.push("-XX:+UseZGC");
        expl.push(isZh ? `**GC 策略**: 启用 **ZGC**。适用于大内存低延迟场景。` : `**GC Strategy**: Enable **ZGC** for low-latency workloads.`);
      }
    } else if (appType === "batch") {
      args.push("-XX:+UseParallelGC");
      expl.push(isZh ? `**GC 策略**: 启用 **Parallel GC**。专注于整体吞吐量。` : `**GC Strategy**: Enable **Parallel GC** for maximum throughput.`);
    } else {
      args.push("-XX:+UseG1GC");
      expl.push(isZh ? `**GC 策略**: 启用 **G1 GC**。现代 JDK 的通用推荐收集器。` : `**GC Strategy**: Enable **G1 GC**, the balanced choice for modern JDKs.`);
      
      if (memorySize >= 6) {
         args.push("-XX:MaxGCPauseMillis=200");
         expl.push(isZh ? `**G1 参数**: 设定目标停顿时间为 200ms。` : `**G1 Tuning**: Set target pause time to 200ms.`);
      }
    }

    // 3. OOM Handling
    args.push("-XX:+HeapDumpOnOutOfMemoryError");
    args.push("-XX:HeapDumpPath=/tmp/heapdump.hprof");
    expl.push(isZh ? `**故障排查**: 发生 OOM 时自动生成堆转储文件。` : `**Diagnostic**: Generate Heap Dump on OOM for post-mortem analysis.`);

    // 4. Logging
    if (jdkVersion === "8") {
      args.push("-XX:+PrintGCDetails");
      args.push("-XX:+PrintGCDateStamps");
      args.push("-Xloggc:/tmp/gc.log");
      expl.push(isZh ? `**GC 日志**: 开启详细 GC 日志 (JDK 8 格式)。` : `**GC Logging**: Enable detailed GC logs (Legacy JDK 8 format).`);
    } else {
      args.push("-Xlog:gc*:file=/tmp/gc.log:time,tags:filecount=10,filesize=10M");
      expl.push(isZh ? `**GC 日志**: 使用 Unified Logging (JDK 9+) 记录日志。` : `**GC Logging**: Use Unified Logging (JDK 9+) with file rotation.`);
    }

    // 5. Container Support
    args.push("-XX:+UseContainerSupport");
    if (jdkVersion !== "17" && jdkVersion !== "21") {
       args.push("-XX:MaxRAMPercentage=75.0"); 
    }
    expl.push(isZh ? `**容器化**: 启用容器感知，确保 JVM 正确识别 Docker/K8s 限制。` : `**Container**: Enable container awareness for correct resource detection.`);

    setGeneratedArgs(`java ${args.join(" ")} -jar app.jar`);
    setExplanation(expl.map(line => `- ${line}`).join("\n"));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedArgs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 h-fit bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-950 dark:text-slate-50">{t('jvm.config.server')}</CardTitle>
          <CardDescription className="font-medium">{isZh ? '设置环境参数' : 'Set your environment'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-950 dark:text-slate-200 font-bold">JDK Version</Label>
            <Select 
              value={config.jdkVersion} 
              onValueChange={(val: JdkVersion) => setConfig({ ...config, jdkVersion: val })}
            >
              <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50">
                <SelectValue placeholder="Select JDK Version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">JDK 8 (LTS)</SelectItem>
                <SelectItem value="11">JDK 11 (LTS)</SelectItem>
                <SelectItem value="17">JDK 17 (LTS)</SelectItem>
                <SelectItem value="21">JDK 21 (LTS)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-slate-950 dark:text-slate-200">
              <Label className="font-bold">{t('jvm.config.mem')}</Label>
              <span className="text-sm font-mono font-black bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {config.memorySize} GB
              </span>
            </div>
            <Slider
              value={[config.memorySize]}
              min={1}
              max={64}
              step={1}
              onValueChange={(vals) => setConfig({ ...config, memorySize: vals[0] })}
              className="py-4"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-slate-950 dark:text-slate-200 font-bold">{t('jvm.config.type')}</Label>
            <RadioGroup 
              value={config.appType} 
              onValueChange={(val: AppType) => setConfig({ ...config, appType: val })}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="web" id="web" />
                <Label htmlFor="web" className="font-medium cursor-pointer text-slate-950 dark:text-slate-300">
                  {t('jvm.type.web')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="batch" id="batch" />
                <Label htmlFor="batch" className="font-medium cursor-pointer text-slate-950 dark:text-slate-300">
                  {t('jvm.type.batch')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low_latency" id="low_latency" />
                <Label htmlFor="low_latency" className="font-medium cursor-pointer text-slate-950 dark:text-slate-300">
                  {t('jvm.type.micro')}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card className="border-2 border-slate-300 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-950">
          <CardHeader className="bg-slate-50 dark:bg-slate-900 pb-4 border-b">
            <CardTitle className="flex justify-between items-center text-slate-950 dark:text-slate-50">
              <span className="flex items-center gap-2">🚀 {t('jvm.result.title')}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                className="ml-auto gap-2 font-bold border-slate-300 dark:border-slate-700"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t('common.copy') : t('jvm.result.copy')}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm break-all shadow-inner leading-relaxed border border-slate-800">
              {generatedArgs}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-md">
          <CardHeader className="border-b">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-950 dark:text-slate-50 font-bold">
              <RefreshCw className="h-5 w-5 text-slate-500" />
              {isZh ? '参数深度解析' : 'Deep Analysis'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert text-sm max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, "<br/>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
