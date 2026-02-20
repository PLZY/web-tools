"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy, XCircle, Zap, ArrowLeftRight,
  Minimize2, ChevronRight, Terminal, Check, Expand,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "next-themes";
import {
  formatJson, autoRepairJson, getErrorLocation,
  generateJavaPojo, generateTsInterface,
  jsonToYaml, jsonToXml, minifyJson,
  snakeToCamelKeys, camelToSnakeKeys,
  generateGoStruct, generateProtobuf,
  parseCurl, generateCurl, CurlParseResult,
} from "@/components/tools/json-lab/json-utils";
import Editor from "@monaco-editor/react";
import dynamic from "next/dynamic";
import { debounce } from "lodash";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

// 动态加载 JsonTreeViewer，禁用 SSR
const JsonTreeViewer = dynamic(
  () => import("@/components/tools/json-lab/JsonTreeViewer"),
  { ssr: false }
);

// 输入模式：JSON 或 cURL
type InputMode = "json" | "curl";

// 转换目标类型
type TransformTarget = "java" | "typescript" | "yaml" | "xml" | "go" | "protobuf";

// 右侧 Tab
type RightTab = "tree" | "transform";

// ─────────────────────────────────────────────────────────────────────────────

export default function JsonLab() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const parsedRef = useRef<any>(null);

  // 主题：动态获取
  const monacoTheme = theme === "dark" ? "vs-dark" : "light";

  // 输入模式：JSON 或 cURL（默认 JSON 无内容，cURL 有示例）
  const [inputMode, setInputMode] = useState<InputMode>("json");

  // JSON 输入（默认空）
  const [jsonInput, setJsonInput] = useState<string>("");

  // cURL 输入（有示例数据）
  const [curlInput, setCurlInput] = useState<string>(
    `curl -X POST 'https://api.example.com/users' \\\n  -H 'Content-Type: application/json' \\\n  -H 'Authorization: Bearer token123' \\\n  -d '{"name":"Alice","age":30}'`
  );

  // cURL 解析结果
  const [curlParsed, setCurlParsed] = useState<CurlParseResult | null>(null);
  const [curlError, setCurlError] = useState<string | null>(null);

  // 解析结果
  const [formattedJson, setFormattedJson] = useState<string>("");
  const [jsonError, setJsonError] = useState<{
    line: number; column: number; message: string;
  } | null>(null);
  const [isRepaired, setIsRepaired] = useState<boolean>(false);

  // 压缩/展开状态
  const [isMinified, setIsMinified] = useState<boolean>(false);
  const isMinifiedRef = useRef(isMinified);

  useEffect(() => {
    isMinifiedRef.current = isMinified;
  }, [isMinified]);

  // 树搜索 & 路径
  const [filterText, setFilterText] = useState<string>("");
  const [jsonPath, setJsonPath] = useState<string>("$");

  // 转换
  const [transformTarget, setTransformTarget] = useState<TransformTarget>("typescript");

  // 右侧 Tab
  const [activeTab, setActiveTab] = useState<RightTab>("tree");



  // 按钮交互状态
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // ── 解析 JSON（防抖 300ms）────────────────────────────────────────────────

  const debouncedParseJson = useCallback(
    debounce((value: string) => {
      if (!value.trim()) {
        parsedRef.current = null;
        setFormattedJson("");
        setJsonError(null);
        setIsRepaired(false);
        return;
      }

      let processedInput = value;
      let repairAttempted = false;

      if (value.startsWith('"') && value.endsWith('"')) {
        try {
          const unescaped = JSON.parse(value);
          if (typeof unescaped === "string") processedInput = unescaped;
        } catch { /* 保持原样 */ }
      }

      try {
        const parsed = JSON.parse(processedInput);
        parsedRef.current = parsed;
        setFormattedJson(isMinifiedRef.current ? JSON.stringify(parsed) : formatJson(parsed));
        setJsonError(null);
        setIsRepaired(false);
      } catch {
        try {
          const repaired = autoRepairJson(processedInput);
          if (repaired !== processedInput) repairAttempted = true;
          const parsed = JSON.parse(repaired);
          parsedRef.current = parsed;
          setFormattedJson(isMinifiedRef.current ? JSON.stringify(parsed) : formatJson(parsed));
          setJsonError(null);
          setIsRepaired(repairAttempted);
        } catch (repairError: any) {
          const loc = getErrorLocation(processedInput, repairError.message);
          parsedRef.current = null;
          setFormattedJson(isMinifiedRef.current ? minifyJson(processedInput) : processedInput);
          setJsonError(loc);
          setIsRepaired(false);
        }
      }
    }, 300),
    []
  );

  // ── 解析 cURL（自动触发）────────────────────────────────────────────────

  const debouncedParseCurl = useCallback(
    debounce((value: string) => {
      if (!value.trim()) {
        setCurlParsed(null);
        setCurlError(null);
        return;
      }
      try {
        const result = parseCurl(value);
        setCurlParsed(result);
        setCurlError(null);
      } catch (e: any) {
        setCurlError(e.message);
        setCurlParsed(null);
      }
    }, 500),
    []
  );

  // 当输入内容变化时，根据模式自动解析
  useEffect(() => {
    if (inputMode === "json") {
      debouncedParseJson(jsonInput);
    } else {
      debouncedParseCurl(curlInput);
    }
  }, [jsonInput, curlInput, inputMode, debouncedParseJson, debouncedParseCurl]);

  // 当 cURL 解析成功后，自动将 body 转为 JSON 展示在可视化区
  useEffect(() => {
    if (inputMode === "curl" && curlParsed && curlParsed.body) {
      try {
        const bodyJson = typeof curlParsed.body === "string" 
          ? JSON.parse(curlParsed.body) 
          : curlParsed.body;
        parsedRef.current = bodyJson;
        setFormattedJson(formatJson(bodyJson));
        setJsonError(null);
        setIsRepaired(false);
      } catch {
        // body 不是有效 JSON，保持原样
      }
    }
  }, [curlParsed, inputMode]);

  // ── 生成 cURL ────────────────────────────────────────────────────────────

  const handleGenerateCurlFromJson = useCallback(() => {
    if (!parsedRef.current) return;
    const cmd = generateCurl("POST", "https://api.example.com/endpoint", {
      "Content-Type": "application/json",
    }, parsedRef.current);
    navigator.clipboard.writeText(cmd);
    setCopiedTab("curl-gen");
    setTimeout(() => setCopiedTab(null), 1500);
  }, []);

  // ── 压缩/展开 ───────────────────────────────────────────────────────────

  const handleMinify = useCallback(() => {
    if (isMinified) {
      // 展开：恢复到格式化状态
      if (parsedRef.current) {
        const expanded = formatJson(parsedRef.current);
        setJsonInput(expanded);
        setFormattedJson(expanded);
      }
      setIsMinified(false);
    } else {
      // 压缩：左侧和右侧同时压缩
      const minified = minifyJson(jsonInput);
      setJsonInput(minified);
      setFormattedJson(minified);
      setIsMinified(true);
    }
  }, [jsonInput, isMinified]);

  // ── 驼峰 ↔ 下划线 自动转换 ─────────────────────────────────────────────

  const hasSnakeCase = useCallback((obj: any): boolean => {
    if (typeof obj === "string") return obj.includes("_") && /^[a-z]+_[a-z]+$/.test(obj);
    if (Array.isArray(obj)) return obj.some(hasSnakeCase);
    if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj).some(k => /^[a-z]+_[a-z]+$/.test(k)) || Object.values(obj).some(hasSnakeCase);
    }
    return false;
  }, []);

  const hasCamelCase = useCallback((obj: any): boolean => {
    if (typeof obj === "string") return /[a-z][A-Z]/.test(obj);
    if (Array.isArray(obj)) return obj.some(hasCamelCase);
    if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj).some(k => /[a-z][A-Z]/.test(k)) || Object.values(obj).some(hasCamelCase);
    }
    return false;
  }, []);

  const handleToggleCase = useCallback(() => {
    if (!parsedRef.current) return;
    const isSnake = hasSnakeCase(parsedRef.current);
    const isCamel = hasCamelCase(parsedRef.current);
    
    let converted: any;
    if (isSnake) {
      converted = snakeToCamelKeys(parsedRef.current);
    } else if (isCamel) {
      converted = camelToSnakeKeys(parsedRef.current);
    } else {
      return;
    }
    setJsonInput(formatJson(converted));
  }, [hasSnakeCase, hasCamelCase]);

  // ── 复制 ────────────────────────────────────────────────────────────────

  const copyToClipboard = useCallback((text: string, tabName?: string) => {
    navigator.clipboard.writeText(text);
    if (tabName) {
      setCopiedTab(tabName);
      setTimeout(() => setCopiedTab(null), 1500);
    }
  }, []);

  // ── 清空 ────────────────────────────────────────────────────────────────

  const handleClear = useCallback(() => {
    setJsonInput("");
    setCurlInput("");
    setFormattedJson("");
    setJsonError(null);
    setCurlParsed(null);
    setCurlError(null);
    parsedRef.current = null;
    setFilterText("");
    setJsonPath("$");
    setIsRepaired(false);
    setIsMinified(false);
  }, []);

  // ── 过滤树 ────────────────────────────────────────────────────────────

  const filteredJson = useMemo(() => {
    if (!filterText || !parsedRef.current) return parsedRef.current;
    const lower = filterText.toLowerCase();
    const filter = (data: any): any => {
      if (Array.isArray(data)) {
        const r = data.map(filter).filter((x) => x !== undefined);
        return r.length > 0 ? r : undefined;
      }
      if (typeof data === "object" && data !== null) {
        const r: Record<string, any> = {};
        for (const key in data) {
          if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
          if (key.toLowerCase().includes(lower)) { r[key] = data[key]; continue; }
          const child = filter(data[key]);
          if (child !== undefined) r[key] = child;
        }
        return Object.keys(r).length > 0 ? r : undefined;
      }
      if (typeof data === "string" && data.toLowerCase().includes(lower)) return data;
      return undefined;
    };
    return filter(parsedRef.current);
  }, [filterText, parsedRef.current]);

  // ── 转换结果 ──────────────────────────────────────────────────────────

  const transformedOutput = useMemo(() => {
    if (!parsedRef.current) return "";
    switch (transformTarget) {
      case "java":       return generateJavaPojo(parsedRef.current);
      case "typescript": return generateTsInterface(parsedRef.current);
      case "yaml":       return jsonToYaml(parsedRef.current);
      case "xml":        return jsonToXml(parsedRef.current);
      case "go":         return generateGoStruct(parsedRef.current);
      case "protobuf":   return generateProtobuf(parsedRef.current);
      default:           return "";
    }
  }, [parsedRef.current, transformTarget]);

  const transformLang = useMemo(() => {
    switch (transformTarget) {
      case "java":       return "java";
      case "typescript": return "typescript";
      case "yaml":       return "yaml";
      case "xml":        return "xml";
      case "go":         return "go";
      case "protobuf":   return "protobuf";
      default:           return "plaintext";
    }
  }, [transformTarget]);

  // ─────────────────────────────────────────────────────────────────────
  // 渲染
  // ─────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-row h-full w-full gap-4">

      {/* ══ 左侧 45%：输入区 ══════════════════════════════════════════════ */}
      <div className="flex flex-col w-[45%] h-full min-h-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">

        {/* 错误提示 - 移到左侧面板顶部 */}
        {inputMode === "json" && jsonError && (
          <div className="flex items-start gap-2 px-3 py-2 border-b border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/60 shrink-0">
            <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <span className="text-xs text-red-600 dark:text-red-400 font-mono">
              [{jsonError.line}:{jsonError.column}] {jsonError.message}
            </span>
          </div>
        )}

        {/* 左侧 Tab 切换：JSON / cURL - 靠左对齐小 Tab 风格 */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setInputMode("json")}
            className={`
              px-3 py-1.5 text-xs font-medium rounded-md transition-all
              ${inputMode === "json" 
                ? "bg-blue-500 text-white" 
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}
            `}
          >
            JSON
          </button>
          <button
            onClick={() => setInputMode("curl")}
            className={`
              px-3 py-1.5 text-xs font-medium rounded-md transition-all
              ${inputMode === "curl" 
                ? "bg-blue-500 text-white" 
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}
            `}
          >
            cURL
          </button>
          
          {/* 右侧操作按钮 */}
          <div className="ml-auto flex items-center gap-1">
            {isRepaired && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px]">
                <Zap className="h-2.5 w-2.5" />
                {t("jsonLab.cockpit.autoRepaired")}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" 
              onClick={handleClear}
            >
              {t("jsonLab.cockpit.clear")}
            </Button>
          </div>
        </div>

        {/* Monaco 编辑器 */}
        <div className="relative flex-1 min-h-0">
          {inputMode === "json" ? (
            <Editor
              height="100%"
              language="json"
              theme={monacoTheme}
              value={jsonInput}
              onChange={(v) => setJsonInput(v || "")}
              options={{
                automaticLayout: true,
                minimap: { enabled: false },
                wordWrap: "on",
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineHeight: 20,
                padding: { top: 12, bottom: 12 },
                renderLineHighlight: "none",
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                scrollbar: { vertical: "auto", horizontal: "hidden" },
                formatOnPaste: false,
              }}
            />
          ) : (
            <Editor
              height="100%"
              language="shell"
              theme={monacoTheme}
              value={curlInput}
              onChange={(v) => setCurlInput(v || "")}
              options={{
                automaticLayout: true,
                minimap: { enabled: false },
                wordWrap: "on",
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineHeight: 20,
                padding: { top: 12, bottom: 12 },
                renderLineHighlight: "none",
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                scrollbar: { vertical: "auto", horizontal: "hidden" },
              }}
            />
          )}

          {/* cURL 错误提示 - 保留在左侧底部 */}
          {inputMode === "curl" && curlError && (
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/60 px-3 py-2 shadow-lg">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <span className="text-xs text-red-600 dark:text-red-400">{curlError}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ 右侧 55%：加工中心 ══════════════════════════════════════════════ */}
      <div className="flex flex-col w-[55%] h-full min-h-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">

        {/* 右侧 Tab 栏 */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900/50">

          {/* 小 Tab 风格切换 */}
          <div className="flex items-center gap-1 px-2 py-1.5">
            {(
              [
                { value: "tree",      label: t("jsonLab.output.visualize") },
                { value: "transform", label: t("jsonLab.output.transform") },
              ] as { value: string; label: string }[]
            ).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value as RightTab)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-md transition-all
                  ${activeTab === value 
                    ? "bg-blue-500 text-white" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 右侧操作按钮组 */}
          <div className="flex items-center gap-1 mr-2">
            {/* 压缩/展开 */}
            {inputMode === "json" && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" 
                onClick={handleMinify}
              >
                {isMinified ? <Expand className="h-3 w-3 mr-1" /> : <Minimize2 className="h-3 w-3 mr-1" />}
                {isMinified ? "展开" : t("jsonLab.minify.label")}
              </Button>
            )}

            {/* 驼峰 ↔ 下划线 */}
            {inputMode === "json" && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" 
                onClick={handleToggleCase}
              >
                <ArrowLeftRight className="h-3 w-3 mr-1" />
                {t("jsonLab.convert.toggle")}
              </Button>
            )}

            {/* cURL → JSON */}
            {inputMode === "curl" && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" 
                onClick={handleGenerateCurlFromJson}
                disabled={!parsedRef.current}
              >
                {copiedTab === "curl-gen" ? <Check className="h-3 w-3 mr-1 text-green-500" /> : <Terminal className="h-3 w-3 mr-1" />}
                {copiedTab === "curl-gen" ? "OK" : t("jsonLab.curl.generate")}
              </Button>
            )}

            {/* 复制 - 带动画反馈 */}
            <Button 
              variant="ghost" 
              size="sm" 
              className={`
                h-6 text-xs transition-all duration-200
                ${copiedTab === activeTab 
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}
              `} 
              onClick={() => {
                const text =
                  activeTab === "tree" ? formattedJson :
                  transformedOutput;
                if (text) copyToClipboard(text, activeTab);
              }}
            >
              {copiedTab === activeTab ? (
                <Check className="h-3 w-3 mr-1" />
              ) : (
                <Copy className="h-3 w-3 mr-1" />
              )}
              {copiedTab === activeTab ? "OK" : t("common.copy")}
            </Button>
          </div>
        </div>

        {/* ── Tab: 可视化 (Tree) ─────────────────────────────────────────── */}
        {activeTab === "tree" && (
          <div className="flex flex-col flex-1 min-h-0 p-3 overflow-hidden">
            {/* 搜索 + 路径面包屑 */}
            <div className="flex items-center gap-2 mb-2 shrink-0">
              <Input
                placeholder={t("jsonLab.editor.filterPlaceholder")}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="flex-1 h-8 text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
              {filterText && (
                <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setFilterText("")}>
                  <XCircle className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {/* JSONPath 面包屑 */}
            <div
              className="flex items-center gap-1 shrink-0 mb-2 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded transition-colors"
              onClick={() => copyToClipboard(jsonPath)}
            >
              <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-600" />
              <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">{t("jsonLab.editor.currentPath")}:</span>
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors break-all">
                {jsonPath}
              </span>
            </div>

            {/* 树视图 */}
            <div className="flex-1 min-h-0 overflow-auto rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2">
              {isMinified ? (
                <Textarea
                  className="font-mono text-sm h-full w-full border-none focus-visible:ring-0 resize-none bg-transparent"
                  readOnly
                  value={formattedJson}
                />
              ) : parsedRef.current ? (
                <JsonTreeViewer
                  json={filteredJson || {}}
                  filterText={filterText}
                  onPathHover={setJsonPath}
                  onPathLeave={() => setJsonPath("$")}
                  onPathClick={setJsonPath}
                />
              ) : inputMode === "curl" && curlParsed ? (
                <div className="text-sm text-green-600 dark:text-green-400 p-2">
                  ✓ {t("jsonLab.curl.parsed")} - {curlParsed.body ? "Body JSON 已解析" : "无 Body"}
                </div>
              ) : (
                <Textarea
                  className="font-mono text-sm h-full w-full border-none focus-visible:ring-0 resize-none bg-transparent"
                  readOnly
                  value={formattedJson || (jsonError ? t("jsonLab.tree.empty") : t("jsonLab.input.placeholder"))}
                />
              )}
            </div>
          </div>
        )}

        {/* ── Tab: 数据转换 (Transform) ─────────────────────────────────── */}
        {activeTab === "transform" && (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <Select
                value={transformTarget}
                onValueChange={(v) => setTransformTarget(v as TransformTarget)}
              >
                <SelectTrigger className="w-[200px] h-8 text-sm bg-white dark:bg-slate-950">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="java">Java POJO (Lombok)</SelectItem>
                  <SelectItem value="typescript">TypeScript Interface</SelectItem>
                  <SelectItem value="yaml">YAML</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                  <SelectItem value="go">Go Struct</SelectItem>
                  <SelectItem value="protobuf">Protobuf</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={transformLang}
                theme={monacoTheme}
                value={transformedOutput}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  lineHeight: 20,
                  padding: { top: 12, bottom: 12 },
                  renderLineHighlight: "none",
                  overviewRulerLanes: 0,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
