'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import { Check, Copy, Info, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/lib/i18n';

type LogFramework = 'logback' | 'log4j2';
type LogLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'TRACE';
type LogLayout = 'text' | 'json';

interface LogConfigState {
  appName: string;
  basePath: string;
  rootLevel: LogLevel;
  packageName: string;
  packageLevel: LogLevel;
  maxHistory: number; // days
  maxFileSize: string; // e.g., 10MB
  totalSizeCap: string; // e.g., 2GB
  useAsync: boolean;
  framework: LogFramework;
  layout: LogLayout;
  useColor: boolean;
  useMasking: boolean;
  useSpringProfile: boolean; // Logback specific
  separateError: boolean;
  useShutdownHook: boolean;
  useGzip: boolean;
  useTraceId: boolean;
}

const DEFAULT_CONFIG: LogConfigState = {
  appName: 'my-app',
  basePath: '/var/logs/my-app',
  rootLevel: 'INFO',
  packageName: 'com.example',
  packageLevel: 'DEBUG',
  maxHistory: 30,
  maxFileSize: '10MB',
  totalSizeCap: '2GB',
  useAsync: true,
  framework: 'logback',
  layout: 'text',
  useColor: true,
  useMasking: false,
  useSpringProfile: true,
  separateError: true,
  useShutdownHook: true,
  useGzip: true,
  useTraceId: true,
};

// --- Simple XML Syntax Highlighter ---
function XmlHighlighter({ code }: { code: string }) {
    const highlighted = useMemo(() => {
        // 使用 Prism 进行工业级标准的 XML 高亮
        const html = Prism.highlight(code, Prism.languages.markup, 'markup');
        
        // 额外处理变量 ${...}，在不破坏现有 HTML 标签的情况下进行高亮
        return html.replace(/(\$\{.*?\})/g, '<span class="token variable">$1</span>');
    }, [code]);

    return (
        <pre
            className="font-mono text-[11px] leading-relaxed overflow-auto h-full w-full p-4 whitespace-pre-wrap break-all text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900/40"
            dangerouslySetInnerHTML={{ __html: highlighted }}
        />
    );
}

// --- Simple Tooltip ---
function Tooltip({ content, children }: { content: string, children: React.ReactNode }) {
    const [visible, setVisible] = useState(false);
    return (
        <div
            className="relative inline-flex items-center"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 dark:bg-slate-800 text-white text-[11px] rounded-xl shadow-2xl z-50 pointer-events-none border border-slate-700 dark:border-slate-600"
                    >
                        {content}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function LogConfigGenerator() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<LogConfigState>(DEFAULT_CONFIG);
  const [generatedXml, setGeneratedXml] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDeps, setShowDeps] = useState(false);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setConfig((prev) => ({ ...prev, [name]: checked }));
  };
    
  const handleFrameworkChange = (value: LogFramework) => {
      setConfig((prev) => ({...prev, framework: value}));
  }

  // Generate XML logic
  useEffect(() => {
    if (config.framework === 'logback') {
      setGeneratedXml(generateLogback(config, t));
    } else {
      setGeneratedXml(generateLog4j2(config, t));
    }
  }, [config, t]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      <div className="flex flex-col">
        <Card className="flex-grow bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="text-slate-950 dark:text-slate-50">{t('logback.title')}</CardTitle>
                <CardDescription className="text-muted-foreground font-medium">{t('logback.config.basic')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {/* Framework Selection */}
                 <div className="space-y-2">
                    <Label className="text-slate-950 dark:text-slate-200 font-bold">{t('logback.config.framework')}</Label>
                    <RadioGroup 
                        defaultValue={config.framework} 
                        onValueChange={(v) => handleFrameworkChange(v as LogFramework)}
                        className="flex space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="logback" id="logback" />
                            <Label htmlFor="logback" className="text-slate-950 dark:text-slate-300">Logback (Spring Boot Default)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="log4j2" id="log4j2" />
                            <Label htmlFor="log4j2" className="text-slate-950 dark:text-slate-300">Log4j2</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="appName" className="text-slate-950 dark:text-slate-300">{t('logback.config.appName')}</Label>
                        <Input 
                            id="appName" 
                            name="appName" 
                            value={config.appName} 
                            onChange={handleInputChange} 
                            placeholder="e.g. order-service" 
                            className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="basePath" className="text-slate-950 dark:text-slate-300">{t('logback.config.logPath')}</Label>
                        <Input 
                            id="basePath" 
                            name="basePath" 
                            value={config.basePath} 
                            onChange={handleInputChange} 
                            placeholder="e.g. /var/logs/order" 
                            className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="rootLevel" className="text-slate-950 dark:text-slate-300">{t('logback.config.level')}</Label>
                        <Select value={config.rootLevel} onValueChange={(v) => handleSelectChange('rootLevel', v)}>
                            <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50">
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INFO">INFO</SelectItem>
                                <SelectItem value="DEBUG">DEBUG</SelectItem>
                                <SelectItem value="WARN">WARN</SelectItem>
                                <SelectItem value="ERROR">ERROR</SelectItem>
                                <SelectItem value="TRACE">TRACE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="maxHistory" className="text-slate-950 dark:text-slate-300">{t('logback.config.maxHistory')}</Label>
                        <Input 
                            id="maxHistory" 
                            name="maxHistory" 
                            type="number"
                            value={config.maxHistory} 
                            onChange={handleInputChange} 
                            className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                     <Label className="text-slate-950 dark:text-slate-300">{t('logback.config.packageLevel')}</Label>
                     <div className="flex space-x-2">
                        <Input 
                            name="packageName" 
                            value={config.packageName} 
                            onChange={handleInputChange} 
                            placeholder="Package (e.g. com.myapp)"
                            className="flex-grow bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
                        />
                        <Select value={config.packageLevel} onValueChange={(v) => handleSelectChange('packageLevel', v)}>
                            <SelectTrigger className="w-[100px] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50">
                                <SelectValue placeholder="Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INFO">INFO</SelectItem>
                                <SelectItem value="DEBUG">DEBUG</SelectItem>
                                <SelectItem value="WARN">WARN</SelectItem>
                                <SelectItem value="ERROR">ERROR</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="maxFileSize" className="text-slate-950 dark:text-slate-300">{t('logback.config.maxFileSize')}</Label>
                        <Input 
                            id="maxFileSize" 
                            name="maxFileSize" 
                            value={config.maxFileSize} 
                            onChange={handleInputChange} 
                            placeholder="10MB" 
                            className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="totalSizeCap" className="text-slate-950 dark:text-slate-300">{t('logback.config.totalCap')}</Label>
                        <Input 
                            id="totalSizeCap" 
                            name="totalSizeCap" 
                            value={config.totalSizeCap} 
                            onChange={handleInputChange} 
                            placeholder="2GB" 
                            className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-950 dark:text-slate-200 font-bold">{t('logback.config.layout')}</Label>
                    <RadioGroup
                        value={config.layout}
                        onValueChange={(v) => handleSelectChange('layout', v)}
                        className="flex space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="text" id="layout-text" />
                            <Label htmlFor="layout-text" className="text-slate-950 dark:text-slate-300">{t('logback.config.layout.text')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="json" id="layout-json" />
                            <Label htmlFor="layout-json" className="text-slate-950 dark:text-slate-300">{t('logback.config.layout.json')}</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-3 pt-2">
                    <Label className="text-slate-950 dark:text-slate-200 font-bold">{t('logback.config.advanced')}</Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                             <div className="flex items-center space-x-2 text-slate-950 dark:text-slate-300">
                                <Checkbox
                                    id="useAsync"
                                    checked={config.useAsync}
                                    onCheckedChange={(v) => handleCheckboxChange('useAsync', v as boolean)}
                                />
                                <Label htmlFor="useAsync" className="cursor-pointer font-medium text-xs flex items-center gap-1">
                                    {t('logback.config.async')}
                                    <Tooltip content={t('logback.config.tooltip.async')}>
                                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                    </Tooltip>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 text-slate-950 dark:text-slate-300">
                                <Checkbox
                                    id="useColor"
                                    checked={config.useColor}
                                    onCheckedChange={(v) => handleCheckboxChange('useColor', v as boolean)}
                                />
                                <Label htmlFor="useColor" className="cursor-pointer font-medium text-xs">
                                    {t('logback.config.color')}
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 text-slate-950 dark:text-slate-300">
                                <Checkbox
                                    id="separateError"
                                    checked={config.separateError}
                                    onCheckedChange={(v) => handleCheckboxChange('separateError', v as boolean)}
                                />
                                <Label htmlFor="separateError" className="cursor-pointer font-medium text-xs flex items-center gap-1">
                                    {t('logback.config.separateError')}
                                    <Tooltip content={t('logback.config.tooltip.error')}>
                                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                    </Tooltip>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 text-slate-950 dark:text-slate-300">
                                <Checkbox
                                    id="useGzip"
                                    checked={config.useGzip}
                                    onCheckedChange={(v) => handleCheckboxChange('useGzip', v as boolean)}
                                />
                                <Label htmlFor="useGzip" className="cursor-pointer font-medium text-xs flex items-center gap-1">
                                    {t('logback.config.gzip')}
                                    <Tooltip content={t('logback.config.tooltip.gzip')}>
                                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                    </Tooltip>
                                </Label>
                            </div>
                        </div>

                        <div className="space-y-3">
                             {config.framework === 'logback' && (
                                <div className="flex items-center space-x-2 text-slate-950 dark:text-slate-300">
                                    <Checkbox
                                        id="useSpringProfile"
                                        checked={config.useSpringProfile}
                                        onCheckedChange={(v) => handleCheckboxChange('useSpringProfile', v as boolean)}
                                    />
                                    <Label htmlFor="useSpringProfile" className="cursor-pointer font-medium text-xs">
                                        {t('logback.config.springProfile')}
                                    </Label>
                                </div>
                            )}

                             <div className="flex items-center space-x-2 text-slate-950 dark:text-slate-300">
                                <Checkbox
                                    id="useShutdownHook"
                                    checked={config.useShutdownHook}
                                    onCheckedChange={(v) => handleCheckboxChange('useShutdownHook', v as boolean)}
                                />
                                <Label htmlFor="useShutdownHook" className="cursor-pointer font-medium text-xs">
                                    {t('logback.config.shutdownHook')}
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 text-slate-950 dark:text-slate-300">
                                <Checkbox
                                    id="useMasking"
                                    checked={config.useMasking}
                                    onCheckedChange={(v) => handleCheckboxChange('useMasking', v as boolean)}
                                />
                                <Label htmlFor="useMasking" className="cursor-pointer font-medium text-xs flex items-center gap-1">
                                    {t('logback.config.masking')}
                                    <Tooltip content={t('logback.config.tooltip.masking')}>
                                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                    </Tooltip>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 text-slate-950 dark:text-slate-300">
                                <Checkbox
                                    id="useTraceId"
                                    checked={config.useTraceId}
                                    onCheckedChange={(v) => handleCheckboxChange('useTraceId', v as boolean)}
                                />
                                <Label htmlFor="useTraceId" className="cursor-pointer font-medium text-xs flex items-center gap-1">
                                    {t('logback.config.trace')}
                                    <Tooltip content={t('logback.config.tooltip.trace')}>
                                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                    </Tooltip>
                                </Label>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="flex flex-col space-y-4 min-h-0">
        {/* Dependency Guide Tip */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 transition-all">
            <button
                onClick={() => setShowDeps(!showDeps)}
                className="flex items-center justify-between w-full text-blue-800 dark:text-blue-300 font-bold text-sm"
            >
                <div className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    {t('logback.dep.tip')}
                </div>
                {showDeps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" /> }
            </button>
            
            {showDeps && (
                <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-400">
                            {config.framework === 'logback' ? 'Logstash Logback Encoder' : 'LMAX Disruptor'}
                        </p>
                        <Textarea
                            className="font-mono text-[10px] h-[120px] bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800"
                            readOnly
                            value={config.framework === 'logback'
                                ? `<dependency>\n  <groupId>net.logstash.logback</groupId>\n  <artifactId>logstash-logback-encoder</artifactId>\n  <version>7.4</version>\n</dependency>`
                                : `<dependency>\n  <groupId>com.lmax</groupId>\n  <artifactId>disruptor</artifactId>\n  <version>3.4.4</version>\n</dependency>`
                            }
                        />
                    </div>
                </div>
            )}
        </div>

        <Card className="flex-grow flex flex-col bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden min-h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
                <div className="flex flex-col space-y-1.5">
                    <CardTitle className="text-slate-950 dark:text-slate-50">{t('logback.preview.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground font-medium">
                        {config.framework === 'logback' ? 'logback-spring.xml' : 'log4j2.xml'}
                    </CardDescription>
                </div>
                <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className={`font-bold transition-all duration-300 ${
                        copied
                        ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20'
                        : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 mr-1.5" />
                            {t('common.copied')}
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4 mr-1.5" />
                            {t('common.copy')}
                        </>
                    )}
                </Button>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden flex flex-col min-h-0 relative">
                <div className="absolute inset-0 bg-slate-50 dark:bg-[#0d1117] overflow-hidden flex flex-col">
                    <XmlHighlighter code={generatedXml} />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>

    {/* Encyclopedia Sections */}
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" />
                        {t('logback.guide.m1.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('logback.guide.m1.content')}
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-orange-500" />
                        {t('logback.guide.m2.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('logback.guide.m2.item1.t')}</h4>
                        <p className="text-sm text-muted-foreground">{t('logback.guide.m2.item1.d')}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('logback.guide.m2.item2.t')}</h4>
                        <p className="text-sm text-muted-foreground">{t('logback.guide.m2.item2.d')}</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    {t('logback.guide.m3.title')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    {t('logback.guide.m3.content')}
                </p>
                <div className="bg-slate-950 rounded-xl p-4 overflow-hidden">
                    <pre className="text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto">
{`public class LogMaskingConverter extends MessageConverter<ILoggingEvent> {
    private static final Pattern PHONE_PATTERN = Pattern.compile("\\\\d{11}");

    @Override
    public String convert(ILoggingEvent event) {
        String message = event.getFormattedMessage();
        Matcher matcher = PHONE_PATTERN.matcher(message);
        if (matcher.find()) {
            return matcher.replaceAll("***********");
        }
        return message;
    }
}`}
                    </pre>
                </div>
            </CardContent>
        </Card>
    </div>
    </div>
  );
}

// --- Helper Functions for XML Generation ---

function generateLogback(config: LogConfigState, t: (k: string) => string): string {
    const traceId = config.useTraceId ? '%X{traceId:-} ' : '';
    const gzip = config.useGzip ? '.gz' : '';
    
    // 异步 Appender 定义
    const asyncAppender = config.useAsync ? `
    <!-- ${t('logback.xml.comment.async')} -->
    <appender name="ASYNC_FILE" class="ch.qos.logback.classic.AsyncAppender">
        <discardingThreshold>0</discardingThreshold> <!-- ${t('logback.xml.comment.async.no.drop')} -->
        <queueSize>512</queueSize>
        <neverBlock>false</neverBlock> <!-- ${t('logback.xml.comment.async.block')} -->
        <appender-ref ref="FILE"/>
    </appender>` : '';

    const errorAppender = config.separateError ? `
    <!-- ${t('logback.xml.comment.error')} -->
    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>\${LOG_PATH}/error.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>\${LOG_PATH}/error.%d{yyyy-MM-dd}.%i.log${gzip}</fileNamePattern>
            <maxFileSize>\${MAX_FILE_SIZE}</maxFileSize>
            <maxHistory>\${MAX_HISTORY}</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} %5p ${traceId}--- [%t] %-40.40logger{39} : %m%n</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>ERROR</level>
        </filter>
    </appender>` : '';

    const rootAppenderRefs = [
        '<appender-ref ref="CONSOLE" />',
        config.useAsync ? '<appender-ref ref="ASYNC_FILE" />' : '<appender-ref ref="FILE" />',
    ];
    if (config.separateError) rootAppenderRefs.push('<appender-ref ref="ERROR_FILE" />');

    const consolePattern = config.useColor
        ? `%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){faint} %clr(%5p) %clr(${traceId})\${PID:- } %clr(---){faint} %clr([%15.15t]){faint} %clr(%-40.40logger{39}){cyan} %clr(:){faint} %m%n%wEx`
        : `%d{yyyy-MM-dd HH:mm:ss.SSS} %5p ${traceId}\${PID:- } --- [%t] %-40.40logger{39} : %m%n%wEx`;

    const filePattern = `%d{yyyy-MM-dd HH:mm:ss.SSS} %5p ${traceId}\${PID:- } --- [%t] %-40.40logger{39} : %m%n%wEx`;

    const encoder = config.layout === 'json' ? `
        <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
            <providers>
                <timestamp><timeZone>UTC</timeZone></timestamp>
                <pattern>
                    <pattern>
                        {
                            "timestamp": "@timestamp",
                            "severity": "%level",
                            "service": "${config.appName}",
                            "trace": "%X{traceId:-}",
                            "span": "%X{spanId:-}",
                            "pid": "\${PID:- }",
                            "thread": "%thread",
                            "class": "%logger{40}",
                            "message": "${config.useMasking ? '%mask(%message)' : '%message'}"
                        }
                    </pattern>
                </pattern>
            </providers>
        </encoder>` : `
        <encoder>
            <pattern>${config.useMasking ? filePattern.replace('%m', '%mask(%m)') : filePattern}</pattern>
            <charset>UTF-8</charset>
        </encoder>`;

    const properties = config.useSpringProfile ? `
    <!-- ${t('logback.xml.comment.spring.property')} -->
    <springProperty scope="context" name="APP_NAME" source="spring.application.name" defaultValue="${config.appName}"/>
    <springProperty scope="context" name="LOG_PATH" source="logging.file.path" defaultValue="${config.basePath}"/>` : `
    <property name="APP_NAME" value="${config.appName}" />
    <property name="LOG_PATH" value="${config.basePath}" />`;

    const profiles = config.useSpringProfile ? `
    <!-- ${t('logback.xml.comment.dev')} -->
    <springProfile name="dev">
        <root level="${config.rootLevel}">
            <appender-ref ref="CONSOLE" />
        </root>
    </springProfile>

    <!-- ${t('logback.xml.comment.prod')} -->
    <springProfile name="prod,test">
        <root level="${config.rootLevel}">
            ${rootAppenderRefs.join('\n            ')}
        </root>
    </springProfile>` : `
    <root level="${config.rootLevel}">
        ${rootAppenderRefs.join('\n        ')}
    </root>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="60 seconds">
    ${config.useShutdownHook ? '<shutdownHook class="ch.qos.logback.core.hook.DelayingShutdownHook"/>' : ''}
    ${config.useMasking ? `<!-- ${t('logback.xml.comment.masking')} -->\n    <conversionRule conversionWord="mask" class="com.example.util.LogMaskingConverter" />` : ''}

    ${properties}
    <property name="MAX_HISTORY" value="${config.maxHistory}" />
    <property name="MAX_FILE_SIZE" value="${config.maxFileSize}" />
    <property name="TOTAL_SIZE_CAP" value="${config.totalSizeCap}" />

    <property name="CONSOLE_LOG_PATTERN" value="${config.useMasking ? consolePattern.replace('%m', '%mask(%m)') : consolePattern}"/>

    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>\${CONSOLE_LOG_PATTERN}</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>\${LOG_PATH}/\${APP_NAME}.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>\${LOG_PATH}/\${APP_NAME}.%d{yyyy-MM-dd}.%i.log${gzip}</fileNamePattern>
            <maxHistory>\${MAX_HISTORY}</maxHistory>
            <maxFileSize>\${MAX_FILE_SIZE}</maxFileSize>
            <totalSizeCap>\${TOTAL_SIZE_CAP}</totalSizeCap>
        </rollingPolicy>
        ${encoder}
    </appender>

    ${asyncAppender}
    ${errorAppender}

    <logger name="${config.packageName}" level="${config.packageLevel}" additivity="false">
        <appender-ref ref="CONSOLE" />
        <appender-ref ref="${config.useAsync ? 'ASYNC_FILE' : 'FILE'}" />
    </logger>

    ${profiles}

</configuration>`;
}

function generateLog4j2(config: LogConfigState, t: (k: string) => string): string {
    const traceId = config.useTraceId ? '%X{traceId:-} ' : '';
    const gzip = config.useGzip ? '.gz' : '';
    
    // Log4j2 推荐使用全局异步或 AsyncLogger，而非 AsyncAppender
    const asyncConfig = config.useAsync
        ? `<!-- ${t('logback.xml.comment.log4j2.async')} -->`
        : '';

    const consolePattern = config.useColor
        ? `%style{%d{yyyy-MM-dd HH:mm:ss.SSS}}{dim} %highlight{%5p} %style{${traceId}}{magenta} %style{\${sys:PID}}{magenta} %style{---}{dim} %style{[%15.15t]}{dim} %style{%-40.40c{1.}}{cyan} %style{:}{dim} %m%n%xwEx`
        : `%d{yyyy-MM-dd HH:mm:ss.SSS} %5p ${traceId}\${sys:PID} --- [%15.15t] %-40.40c{1.} : %m%n%xwEx`;

    // 生产环境推荐使用 JsonTemplateLayout (Log4j2 2.14+)
    const layout = config.layout === 'json' ? `
            <JsonTemplateLayout eventTemplateUri="classpath:LogstashJsonEventLayout.json">
                <EventTemplateAdditionalField key="service" value="${config.appName}"/>
                ${config.useTraceId ? '<EventTemplateAdditionalField key="traceId" value="${ctx:traceId}"/>' : ''}
            </JsonTemplateLayout>` : `
            <PatternLayout pattern="${config.useMasking ? '%d{yyyy-MM-dd HH:mm:ss.SSS} %5p ' + traceId + '${sys:PID} --- [%t] %-40.40c{1.} : %replace{%m}{\\d{11}}{***********}%n%xwEx' : '%d{yyyy-MM-dd HH:mm:ss.SSS} %5p ' + traceId + '${sys:PID} --- [%t] %-40.40c{1.} : %m%n%xwEx'}" charset="UTF-8"/>`;

    const errorAppender = config.separateError ? `
        <!-- ${t('logback.xml.comment.error')} -->
        <RollingFile name="ErrorFile" fileName="\${LOG_PATH}/error.log"
                     filePattern="\${LOG_PATH}/error-%d{yyyy-MM-dd}-%i.log${gzip}">
            <ThresholdFilter level="ERROR" onMatch="ACCEPT" onMismatch="DENY"/>
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} %5p ${traceId}--- [%t] %-40.40c{1.} : %m%n" charset="UTF-8"/>
            <Policies>
                <TimeBasedTriggeringPolicy />
                <SizeBasedTriggeringPolicy size="100MB" />
            </Policies>
        </RollingFile>` : '';

    const appenderRefs = ['<AppenderRef ref="Console"/>', '<AppenderRef ref="RollingFile"/>'];
    if (config.separateError) appenderRefs.push('<AppenderRef ref="ErrorFile"/>');

    const dateLookup = '$' + '{date:yyyy-MM}';
    const filePattern = `\${LOG_PATH}/${dateLookup}/\${APP_NAME}-%d{yyyy-MM-dd}-%i.log${gzip}`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN" monitorInterval="60" shutdownHook="${config.useShutdownHook ? 'enable' : 'disable'}">
    ${asyncConfig}
    <Properties>
        <Property name="APP_NAME">${config.appName}</Property>
        <Property name="LOG_PATH">${config.basePath}</Property>
        <Property name="CONSOLE_PATTERN">${config.useMasking ? consolePattern.replace('%m', '%replace{%m}{\\d{11}}{***********}') : consolePattern}</Property>
    </Properties>

    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="\${CONSOLE_PATTERN}" charset="UTF-8"/>
        </Console>

        <RollingFile name="RollingFile" fileName="\${LOG_PATH}/\${APP_NAME}.log"
                     filePattern="${filePattern}">
            ${layout}
            <Policies>
                <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
                <SizeBasedTriggeringPolicy size="${config.maxFileSize}"/>
            </Policies>
            <DefaultRolloverStrategy max="${config.maxHistory}">
                <Delete basePath="\${LOG_PATH}" maxDepth="2">
                    <IfFileName glob="*/\${APP_NAME}-*.log.gz" />
                    <IfLastModified age="${config.maxHistory}d" />
                </Delete>
            </DefaultRolloverStrategy>
        </RollingFile>

        ${errorAppender}
    </Appenders>

    <Loggers>
        <Logger name="${config.packageName}" level="${config.packageLevel}" additivity="false">
            ${appenderRefs.join('\n            ')}
        </Logger>

        <Root level="${config.rootLevel}">
            ${appenderRefs.join('\n            ')}
        </Root>
    </Loggers>

</Configuration>`;
}
