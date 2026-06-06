"use client";

import { useState, useCallback, useEffect, useRef, useMemo, type UIEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy, XCircle, Zap, ArrowLeftRight,
  Minimize2, ChevronRight, Terminal, Check, Expand, AlignLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n";
import {
  formatJson, getErrorLocation,
  generateJavaPojo, generateTsInterface,
  jsonToYaml, jsonToXml,
  snakeToCamelKeys, camelToSnakeKeys,
  generateGoStruct, generateProtobuf,
  parseCurl, generateCurl, CurlParseResult,
} from "@/components/tools/json-lab/json-utils";
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
type TreeCommand = { id: number; type: "expandAll" | "collapseAll" } | null;

function normalizeJsonInput(value: string) {
  let processedInput = value.trim();
  if (processedInput.startsWith('"') && processedInput.endsWith('"')) {
    try {
      const unescaped = JSON.parse(processedInput);
      if (typeof unescaped === "string") processedInput = unescaped;
    } catch { /* 保持原样 */ }
  }
  return processedInput;
}

function parseJsonStrict(value: string) {
  const processedInput = normalizeJsonInput(value);
  return JSON.parse(processedInput);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deleteJsonPath(value: unknown, path: Array<string | number>): unknown {
  if (path.length === 0) return value;

  const [head, ...rest] = path;
  if (Array.isArray(value)) {
    const index = Number(head);
    if (!Number.isInteger(index) || index < 0 || index >= value.length) return value;
    const next = [...value];
    if (rest.length === 0) {
      next.splice(index, 1);
    } else {
      next[index] = deleteJsonPath(next[index], rest);
    }
    return next;
  }

  if (isJsonObject(value)) {
    const key = String(head);
    if (!Object.prototype.hasOwnProperty.call(value, key)) return value;
    const next = { ...value };
    if (rest.length === 0) {
      delete next[key];
    } else {
      next[key] = deleteJsonPath(next[key], rest);
    }
    return next;
  }

  return value;
}

function NumberedTextarea({
  value,
  onChange,
  placeholder,
  errorLine,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  errorLine?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const lineCount = useMemo(() => Math.max(1, value.split("\n").length), [value]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-transparent">
      <div className="absolute inset-y-0 left-0 z-10 w-12 select-none overflow-hidden border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="pt-3" style={{ transform: `translateY(-${scrollTop}px)` }}>
          {Array.from({ length: lineCount }, (_, index) => {
            const line = index + 1;
            const isError = errorLine === line;
            return (
              <div
                key={line}
                  className={`h-6 pr-2 text-right font-mono text-[12px] leading-6 ${
                  isError
                    ? "bg-red-100 font-semibold text-red-600 dark:bg-red-950/70 dark:text-red-300"
                    : "text-slate-400 dark:text-slate-600"
                }`}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onScroll={(event: UIEvent<HTMLTextAreaElement>) => setScrollTop(event.currentTarget.scrollTop)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        className="h-full w-full resize-none bg-transparent py-3 pl-16 pr-3 font-mono text-[14px] leading-6 text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-600"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function JsonLab() {
  const { t } = useTranslation();
  const parsedRef = useRef<unknown | null>(null);
  const skipNextJsonParseRef = useRef(false);

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

  // Parsed data version counter — bumped every time parsedRef.current changes,
  // so useMemo hooks that depend on the parsed object re-compute correctly.
  const [parsedVersion, setParsedVersion] = useState(0);

  // 树搜索 & 路径
  const [filterText, setFilterText] = useState<string>("");
  const [jsonPath, setJsonPath] = useState<string>("$");
  const [treeCommand, setTreeCommand] = useState<TreeCommand>(null);
  const [treeResetId, setTreeResetId] = useState(0);

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
        setParsedVersion(v => v + 1);
        setFormattedJson("");
        setJsonError(null);
        setIsRepaired(false);
        setTreeCommand(null);
        return;
      }

      let processedInput = value;

      processedInput = normalizeJsonInput(value);

      try {
        const parsed = JSON.parse(processedInput);
        parsedRef.current = parsed;
        setParsedVersion(v => v + 1);
        setTreeResetId(v => v + 1);
        setFormattedJson(isMinifiedRef.current ? JSON.stringify(parsed) : formatJson(parsed));
        setJsonError(null);
        setIsRepaired(false);
        setTreeCommand(null);
      } catch (parseError: unknown) {
        const loc = getErrorLocation(processedInput, getErrorMessage(parseError));
        parsedRef.current = null;
        setParsedVersion(v => v + 1);
        setFormattedJson("");
        setJsonError(loc);
        setIsRepaired(false);
        setTreeCommand(null);
      }
    }, 120),
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
      } catch (error: unknown) {
        setCurlError(getErrorMessage(error));
        setCurlParsed(null);
      }
    }, 500),
    []
  );

  // 当输入内容变化时，根据模式自动解析
  useEffect(() => {
    if (inputMode === "json") {
      if (skipNextJsonParseRef.current) {
        skipNextJsonParseRef.current = false;
        return;
      }
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
        setParsedVersion(v => v + 1);
        setTreeResetId(v => v + 1);
        setFormattedJson(formatJson(bodyJson));
        setJsonError(null);
        setIsRepaired(false);
        setTreeCommand(null);
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

  // ── 格式化 / 压缩 ──────────────────────────────────────────────────────

  const handleFormatInput = useCallback(() => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = parseJsonStrict(jsonInput);
      const formatted = formatJson(parsed);
      parsedRef.current = parsed;
      skipNextJsonParseRef.current = true;
      setJsonInput(formatted);
      setFormattedJson(formatted);
      setJsonError(null);
      setIsRepaired(false);
      setIsMinified(false);
    } catch (error: unknown) {
      parsedRef.current = null;
      setParsedVersion(v => v + 1);
      setFormattedJson("");
      setJsonError(getErrorLocation(jsonInput, getErrorMessage(error)));
    }
  }, [jsonInput]);

  const handleMinifyInput = useCallback(() => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = parseJsonStrict(jsonInput);
      const minified = JSON.stringify(parsed);
      parsedRef.current = parsed;
      skipNextJsonParseRef.current = true;
      setJsonInput(minified);
      setFormattedJson(minified);
      setJsonError(null);
      setIsRepaired(false);
      setIsMinified(true);
    } catch (error: unknown) {
      parsedRef.current = null;
      setParsedVersion(v => v + 1);
      setFormattedJson("");
      setJsonError(getErrorLocation(jsonInput, getErrorMessage(error)));
    }
  }, [jsonInput]);

  // ── 驼峰 ↔ 下划线 自动转换 ─────────────────────────────────────────────

  const hasSnakeCase = useCallback((obj: unknown): boolean => {
    if (typeof obj === "string") return obj.includes("_") && /^[a-z][a-z0-9]*_[a-z0-9]+/.test(obj);
    if (Array.isArray(obj)) return obj.some(hasSnakeCase);
    if (isJsonObject(obj)) {
      return Object.keys(obj).some(k => /^[a-z][a-z0-9]*_[a-z0-9]+/.test(k)) || Object.values(obj).some(hasSnakeCase);
    }
    return false;
  }, []);

  const hasCamelCase = useCallback((obj: unknown): boolean => {
    if (typeof obj === "string") return /[a-z][A-Z]/.test(obj);
    if (Array.isArray(obj)) return obj.some(hasCamelCase);
    if (isJsonObject(obj)) {
      return Object.keys(obj).some(k => /[a-z][A-Z]/.test(k)) || Object.values(obj).some(hasCamelCase);
    }
    return false;
  }, []);

  const handleToggleCase = useCallback(() => {
    if (!parsedRef.current) return;
    const isSnake = hasSnakeCase(parsedRef.current);
    const isCamel = hasCamelCase(parsedRef.current);
    
    let converted: unknown;
    if (isCamel) {
      converted = camelToSnakeKeys(parsedRef.current);
    } else if (isSnake) {
      converted = snakeToCamelKeys(parsedRef.current);
    } else {
      return;
    }
    parsedRef.current = converted; // sync update — don't wait for 300ms debounce
    setParsedVersion(v => v + 1);
    setTreeResetId(v => v + 1);
    const nextJson = isMinifiedRef.current ? JSON.stringify(converted) : formatJson(converted);
    setJsonInput(nextJson);
    setFormattedJson(nextJson);
    setTreeCommand(null);
  }, [hasSnakeCase, hasCamelCase]);

  // ── 复制 ────────────────────────────────────────────────────────────────

  const copyToClipboard = useCallback((text: string, tabName?: string) => {
    navigator.clipboard.writeText(text);
    if (tabName) {
      setCopiedTab(tabName);
      setTimeout(() => setCopiedTab(null), 1500);
    }
  }, []);

  const handleDeleteJsonPath = useCallback((path: Array<string | number>) => {
    if (parsedRef.current === null) return;
    const nextJson = deleteJsonPath(parsedRef.current, path);
    const nextText = isMinifiedRef.current ? JSON.stringify(nextJson) : formatJson(nextJson);
    parsedRef.current = nextJson;
    skipNextJsonParseRef.current = true;
    setParsedVersion(v => v + 1);
    setJsonInput(nextText);
    setFormattedJson(nextText);
    setJsonError(null);
    setFilterText("");
    setJsonPath("$");
    setTreeCommand(null);
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
    setParsedVersion(v => v + 1);
    setFilterText("");
    setJsonPath("$");
    setIsRepaired(false);
    setIsMinified(false);
    setTreeCommand(null);
  }, []);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedVersion, transformTarget]);

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
            {inputMode === "json" && (
              <>
                <Button
                  variant={isMinified ? "ghost" : "secondary"}
                  size="sm"
                  className="h-6 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={handleFormatInput}
                >
                  <AlignLeft className="h-3 w-3 mr-1" />
                  {t("jsonLab.format.label")}
                </Button>
                <Button
                  variant={isMinified ? "secondary" : "ghost"}
                  size="sm"
                  className="h-6 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={handleMinifyInput}
                >
                  <Minimize2 className="h-3 w-3 mr-1" />
                  {t("jsonLab.minify.label")}
                </Button>
              </>
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

        {/* 输入编辑器 */}
        <div className="relative flex-1 min-h-0">
          {inputMode === "json" ? (
            <NumberedTextarea
              value={jsonInput}
              onChange={setJsonInput}
              placeholder={t("jsonLab.input.placeholder")}
              errorLine={jsonError?.line}
            />
          ) : (
            <NumberedTextarea
              value={curlInput}
              onChange={setCurlInput}
              placeholder="curl https://api.example.com ..."
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
              {parsedRef.current !== null && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setTreeCommand({ id: Date.now(), type: "expandAll" })}
                  >
                    <Expand className="h-3.5 w-3.5 mr-1" />
                    {t("jsonLab.tree.expandAll")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setTreeCommand({ id: Date.now(), type: "collapseAll" })}
                  >
                    <Minimize2 className="h-3.5 w-3.5 mr-1" />
                    {t("jsonLab.tree.collapseAll")}
                  </Button>
                </>
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
              {parsedRef.current !== null ? (
                <JsonTreeViewer
                  key={`${treeResetId}-${treeCommand?.id ?? 0}`}
                  json={parsedRef.current}
                  filterText={filterText}
                  initialExpandMode={treeCommand?.type ?? "expandAll"}
                  onPathHover={setJsonPath}
                  onPathLeave={() => setJsonPath("$")}
                  onPathClick={setJsonPath}
                  onDeletePath={handleDeleteJsonPath}
                />
              ) : inputMode === "curl" && curlParsed ? (
                <div className="text-sm text-green-600 dark:text-green-400 p-2">
                  ✓ {t("jsonLab.curl.parsed")} - {curlParsed.body ? "Body JSON 已解析" : "无 Body"}
                </div>
              ) : jsonError ? (
                <div className="flex h-full items-center justify-center p-6 text-center">
                  <div className="max-w-md rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                    <div className="font-medium">{t("jsonLab.error.parse")}</div>
                    <div className="mt-1 font-mono text-xs">
                      line {jsonError.line}, column {jsonError.column}: {jsonError.message}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full w-full" />
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
            <div className="flex-1 min-h-0 overflow-auto">
              {transformedOutput ? (
                <pre className="h-full font-mono text-[13px] leading-5 p-3 text-slate-800 dark:text-slate-200 whitespace-pre overflow-auto">
                  {transformedOutput}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-slate-400">
                  {t("jsonLab.input.placeholder")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
