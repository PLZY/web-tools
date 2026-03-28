"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  Copy, Check, Plus, Trash2, ArrowRight, RotateCcw,
  Minimize2, Maximize2, ChevronDown, ChevronUp, Upload,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type Platform = "unix" | "cmd" | "powershell";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
type BodyType = "none" | "json" | "form" | "multipart" | "raw";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];
const BODY_METHODS: HttpMethod[] = ["POST", "PUT", "PATCH"];

// ── Common HTTP Headers ─────────────────────────────────────────────────────

const COMMON_HEADERS = [
  "Accept", "Accept-Charset", "Accept-Encoding", "Accept-Language",
  "Authorization", "Cache-Control", "Connection", "Content-Disposition",
  "Content-Encoding", "Content-Language", "Content-Length", "Content-Type",
  "Cookie", "Date", "ETag", "Expect", "Forwarded", "From", "Host",
  "If-Match", "If-Modified-Since", "If-None-Match", "If-Range",
  "If-Unmodified-Since", "Keep-Alive", "Origin", "Pragma",
  "Proxy-Authorization", "Range", "Referer", "TE", "Trailer",
  "Transfer-Encoding", "Upgrade", "User-Agent", "Via", "Warning",
  "X-Forwarded-For", "X-Forwarded-Host", "X-Forwarded-Proto",
  "X-Real-IP", "X-Request-ID", "X-Requested-With",
];

const COMMON_HEADER_VALUES: Record<string, string[]> = {
  "Accept": ["application/json", "application/xml", "text/html", "text/plain", "*/*"],
  "Accept-Encoding": ["gzip", "deflate", "br", "gzip, deflate, br"],
  "Accept-Language": ["en-US", "zh-CN", "zh-CN,zh;q=0.9,en;q=0.8"],
  "Cache-Control": ["no-cache", "no-store", "max-age=0", "must-revalidate"],
  "Connection": ["keep-alive", "close"],
  "Content-Type": [
    "application/json", "application/x-www-form-urlencoded",
    "multipart/form-data", "text/plain", "text/html",
    "application/xml", "application/octet-stream",
  ],
  "X-Requested-With": ["XMLHttpRequest"],
};

// ── Escape helpers ───────────────────────────────────────────────────────────

function escapeUnix(value: string): string {
  return "'" + value.replace(/'/g, "'\\''") + "'";
}
function escapeCmd(value: string): string {
  return '"' + value.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}
function escapePowerShell(value: string): string {
  return "'" + value.replace(/'/g, "''") + "'";
}

// ── cURL generation ──────────────────────────────────────────────────────────

interface CurlState {
  method: HttpMethod;
  url: string;
  headers: { key: string; value: string }[];
  bodyType: BodyType;
  bodyRaw: string;
  formFields: { key: string; value: string }[];
  multipartFields: { key: string; value: string; isFile: boolean; fileName: string }[];
  bearerToken: string;
  cookies: { key: string; value: string }[];
  streaming: boolean;
  followRedirect: boolean;
  insecure: boolean;
  verbose: boolean;
  silent: boolean;
  timeout: string;
}

function generateCurl(state: CurlState, platform: Platform, multiline: boolean): string {
  const escape = platform === "unix" ? escapeUnix : platform === "cmd" ? escapeCmd : escapePowerShell;
  const cont = platform === "unix" ? " \\" : platform === "cmd" ? " ^" : " `";
  const nl = multiline ? "\n  " : " ";
  const sep = multiline ? cont + nl : " ";

  const parts: string[] = ["curl"];

  // Flags
  if (state.streaming) parts.push("-N");
  if (state.followRedirect) parts.push("-L");
  if (state.insecure) parts.push("-k");
  if (state.verbose) parts.push("-v");
  if (state.silent) parts.push("-s");
  if (state.timeout.trim()) parts.push(`--max-time ${state.timeout.trim()}`);

  if (state.method !== "GET") {
    parts.push(`-X ${state.method}`);
  }

  parts.push(escape(state.url || "https://example.com"));

  // Bearer token
  if (state.bearerToken.trim()) {
    parts.push(`-H ${escape("Authorization: Bearer " + state.bearerToken.trim())}`);
  }

  // Headers
  const validHeaders = state.headers.filter((h) => h.key.trim() && h.value.trim());
  for (const h of validHeaders) {
    parts.push(`-H ${escape(h.key.trim() + ": " + h.value.trim())}`);
  }

  // Auto Content-Type header (if not manually set)
  const hasContentType = validHeaders.some((h) => h.key.trim().toLowerCase() === "content-type");
  if (BODY_METHODS.includes(state.method)) {
    if (state.bodyType === "json" && !hasContentType) {
      parts.push(`-H ${escape("Content-Type: application/json")}`);
    } else if (state.bodyType === "form" && !hasContentType) {
      parts.push(`-H ${escape("Content-Type: application/x-www-form-urlencoded")}`);
    }
  }

  // Cookies
  const validCookies = state.cookies.filter((c) => c.key.trim() && c.value.trim());
  if (validCookies.length > 0) {
    const cookieStr = validCookies.map((c) => `${c.key.trim()}=${c.value.trim()}`).join("; ");
    parts.push(`-b ${escape(cookieStr)}`);
  }

  // Body
  if (BODY_METHODS.includes(state.method)) {
    if (state.bodyType === "json" && state.bodyRaw.trim()) {
      let bodyStr = state.bodyRaw.trim();
      if (!multiline) {
        try { bodyStr = JSON.stringify(JSON.parse(bodyStr)); } catch { bodyStr = bodyStr.replace(/\s*\n\s*/g, " ").replace(/\s+/g, " "); }
      }
      parts.push(`-d ${escape(bodyStr)}`);
    } else if (state.bodyType === "raw" && state.bodyRaw.trim()) {
      let bodyStr = state.bodyRaw.trim();
      if (!multiline) { bodyStr = bodyStr.replace(/\s*\n\s*/g, " ").replace(/\s+/g, " "); }
      parts.push(`-d ${escape(bodyStr)}`);
    } else if (state.bodyType === "form") {
      const validFields = state.formFields.filter((f) => f.key.trim());
      if (validFields.length > 0) {
        const encoded = validFields.map((f) => `${encodeURIComponent(f.key.trim())}=${encodeURIComponent(f.value.trim())}`).join("&");
        parts.push(`-d ${escape(encoded)}`);
      }
    } else if (state.bodyType === "multipart") {
      const validFields = state.multipartFields.filter((f) => f.key.trim());
      for (const f of validFields) {
        if (f.isFile) {
          parts.push(`-F ${escape(f.key.trim() + "=@" + (f.fileName || "file.bin"))}`);
        } else {
          parts.push(`-F ${escape(f.key.trim() + "=" + f.value)}`);
        }
      }
    }
  }

  return parts.join(sep);
}

// ── cURL parser ──────────────────────────────────────────────────────────────

function parseCurlCommand(raw: string): Partial<CurlState> | null {
  let s = raw.trim();
  s = s.replace(/\s*\\\s*\n\s*/g, " ");
  s = s.replace(/\s*\^\s*\n\s*/g, " ");
  s = s.replace(/\s*`\s*\n\s*/g, " ");

  if (!s.startsWith("curl")) return null;

  // Tokenize
  const tokens: string[] = [];
  let i = 4;
  while (i < s.length) {
    while (i < s.length && /\s/.test(s[i])) i++;
    if (i >= s.length) break;
    let token = "";
    if (s[i] === "'" || s[i] === '"') {
      const quote = s[i]; i++;
      while (i < s.length && s[i] !== quote) {
        if (s[i] === "\\" && quote === '"' && i + 1 < s.length) { i++; token += s[i]; }
        else { token += s[i]; }
        i++;
      }
      i++;
    } else {
      while (i < s.length && !/\s/.test(s[i])) { token += s[i]; i++; }
    }
    tokens.push(token);
  }

  let method: HttpMethod = "GET";
  let url = "";
  let bodyRaw = "";
  let bodyType: BodyType = "none";
  let bearerToken = "";
  let streaming = false;
  let followRedirect = false;
  let insecure = false;
  let verbose = false;
  let silent = false;
  let timeout = "";
  const headers: { key: string; value: string }[] = [];
  const cookies: { key: string; value: string }[] = [];
  const formFields: { key: string; value: string }[] = [];
  const multipartFields: { key: string; value: string; isFile: boolean; fileName: string }[] = [];

  let idx = 0;
  while (idx < tokens.length) {
    const tok = tokens[idx];

    if (tok === "-X" || tok === "--request") {
      idx++;
      if (idx < tokens.length) {
        const m = tokens[idx].toUpperCase() as HttpMethod;
        if (METHODS.includes(m)) method = m;
      }
    } else if (tok === "-H" || tok === "--header") {
      idx++;
      if (idx < tokens.length) {
        const hStr = tokens[idx];
        const ci = hStr.indexOf(":");
        if (ci !== -1) {
          const key = hStr.substring(0, ci).trim();
          const value = hStr.substring(ci + 1).trim();
          if (key.toLowerCase() === "authorization" && value.toLowerCase().startsWith("bearer ")) {
            bearerToken = value.substring(7).trim();
          } else if (key.toLowerCase() === "content-type") {
            // Don't add to headers — we'll infer bodyType
            if (value.includes("application/json")) bodyType = "json";
            else if (value.includes("x-www-form-urlencoded")) bodyType = "form";
            else if (value.includes("multipart")) bodyType = "multipart";
            else headers.push({ key, value });
          } else {
            headers.push({ key, value });
          }
        }
      }
    } else if (tok === "-d" || tok === "--data" || tok === "--data-raw" || tok === "--data-binary") {
      idx++;
      if (idx < tokens.length) {
        bodyRaw = tokens[idx];
        try { bodyRaw = JSON.stringify(JSON.parse(bodyRaw), null, 2); } catch { /* keep */ }
        if (method === "GET") method = "POST";
        if (bodyType === "none") bodyType = "json"; // default guess
      }
    } else if (tok === "-F" || tok === "--form") {
      idx++;
      if (idx < tokens.length) {
        bodyType = "multipart";
        const fStr = tokens[idx];
        const eqIdx = fStr.indexOf("=");
        if (eqIdx !== -1) {
          const key = fStr.substring(0, eqIdx);
          const val = fStr.substring(eqIdx + 1);
          if (val.startsWith("@")) {
            multipartFields.push({ key, value: "", isFile: true, fileName: val.substring(1) });
          } else {
            multipartFields.push({ key, value: val, isFile: false, fileName: "" });
          }
        }
      }
    } else if (tok === "-b" || tok === "--cookie") {
      idx++;
      if (idx < tokens.length) {
        const cStr = tokens[idx];
        cStr.split(";").forEach((pair) => {
          const eqIdx = pair.indexOf("=");
          if (eqIdx !== -1) {
            cookies.push({ key: pair.substring(0, eqIdx).trim(), value: pair.substring(eqIdx + 1).trim() });
          }
        });
      }
    } else if (tok === "-N" || tok === "--no-buffer") {
      streaming = true;
    } else if (tok === "-L" || tok === "--location") {
      followRedirect = true;
    } else if (tok === "-k" || tok === "--insecure") {
      insecure = true;
    } else if (tok === "-v" || tok === "--verbose") {
      verbose = true;
    } else if (tok === "-s" || tok === "--silent") {
      silent = true;
    } else if (tok === "--max-time" || tok === "--connect-timeout") {
      idx++;
      if (idx < tokens.length) timeout = tokens[idx];
    } else if (tok.startsWith("-")) {
      if (idx + 1 < tokens.length && !tokens[idx + 1].startsWith("-") && !tokens[idx + 1].startsWith("http")) {
        idx++;
      }
    } else {
      if (!url && (tok.startsWith("http://") || tok.startsWith("https://") || !tok.startsWith("-"))) {
        url = tok;
      }
    }
    idx++;
  }

  // If form body type but bodyRaw looks like key=value pairs
  if (bodyType === "form" && bodyRaw) {
    bodyRaw.split("&").forEach((pair) => {
      const eqIdx = pair.indexOf("=");
      if (eqIdx !== -1) {
        formFields.push({
          key: decodeURIComponent(pair.substring(0, eqIdx)),
          value: decodeURIComponent(pair.substring(eqIdx + 1)),
        });
      }
    });
  }

  return {
    method, url, headers: headers.length > 0 ? headers : [{ key: "", value: "" }],
    bodyType, bodyRaw: bodyType === "form" ? "" : bodyRaw,
    formFields: formFields.length > 0 ? formFields : [{ key: "", value: "" }],
    multipartFields: multipartFields.length > 0 ? multipartFields : [{ key: "", value: "", isFile: false, fileName: "" }],
    bearerToken,
    cookies: cookies.length > 0 ? cookies : [{ key: "", value: "" }],
    streaming, followRedirect, insecure, verbose, silent, timeout,
  };
}

// ── Autocomplete Input ──────────────────────────────────────────────────────

function AutocompleteInput({
  value, onChange, suggestions, placeholder, className, mono,
}: {
  value: string;
  onChange: (val: string) => void;
  suggestions: string[];
  placeholder: string;
  className?: string;
  mono?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!value.trim()) return suggestions.slice(0, 10);
    const lower = value.toLowerCase();
    return suggestions.filter((s) => s.toLowerCase().includes(lower)).slice(0, 10);
  }, [value, suggestions]);

  useEffect(() => { setFocusIdx(-1); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (v: string) => { onChange(v); setOpen(false); inputRef.current?.blur(); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || filtered.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusIdx((p) => (p + 1) % filtered.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setFocusIdx((p) => (p - 1 + filtered.length) % filtered.length); }
    else if (e.key === "Enter" && focusIdx >= 0) { e.preventDefault(); select(filtered[focusIdx]); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <Input
        ref={inputRef}
        className={cn("text-sm w-full", mono && "font-mono")}
        placeholder={placeholder}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-[200px] overflow-auto rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg">
          {filtered.map((item, i) => (
            <button
              key={item}
              className={cn(
                "w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800",
                mono && "font-mono",
                i === focusIdx && "bg-slate-100 dark:bg-slate-800",
              )}
              onMouseDown={(e) => { e.preventDefault(); select(item); }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Collapsible Section ─────────────────────────────────────────────────────

function Section({ label, defaultOpen, children }: { label: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="space-y-2">
      <button
        className="flex items-center justify-between w-full text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        onClick={() => setOpen((p) => !p)}
      >
        {label}
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open && children}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function CurlBuilder() {
  const { t } = useTranslation();

  // Form state
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [bodyType, setBodyType] = useState<BodyType>("none");
  const [bodyRaw, setBodyRaw] = useState("");
  const [formFields, setFormFields] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [multipartFields, setMultipartFields] = useState<{ key: string; value: string; isFile: boolean; fileName: string }[]>([
    { key: "", value: "", isFile: false, fileName: "" },
  ]);
  const [bearerToken, setBearerToken] = useState("");
  const [cookies, setCookies] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);

  // Options
  const [streaming, setStreaming] = useState(false);
  const [followRedirect, setFollowRedirect] = useState(false);
  const [insecure, setInsecure] = useState(false);
  const [verbose, setVerbose] = useState(false);
  const [silent, setSilent] = useState(false);
  const [timeout, setTimeout_] = useState("");

  // Output state
  const [platform, setPlatform] = useState<Platform>("unix");
  const [multiline, setMultiline] = useState(true);
  const [copied, setCopied] = useState(false);
  const [pasteInput, setPasteInput] = useState("");

  // File refs for multipart
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // ── Handlers ───────────────────────────────────────────────────────────

  const addHeader = useCallback(() => setHeaders((p) => [...p, { key: "", value: "" }]), []);
  const removeHeader = useCallback((i: number) => setHeaders((p) => p.filter((_, idx) => idx !== i)), []);
  const updateHeader = useCallback((i: number, field: "key" | "value", val: string) => {
    setHeaders((p) => p.map((h, idx) => (idx === i ? { ...h, [field]: val } : h)));
  }, []);

  const addCookie = useCallback(() => setCookies((p) => [...p, { key: "", value: "" }]), []);
  const removeCookie = useCallback((i: number) => setCookies((p) => p.filter((_, idx) => idx !== i)), []);
  const updateCookie = useCallback((i: number, field: "key" | "value", val: string) => {
    setCookies((p) => p.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)));
  }, []);

  const addFormField = useCallback(() => setFormFields((p) => [...p, { key: "", value: "" }]), []);
  const removeFormField = useCallback((i: number) => setFormFields((p) => p.filter((_, idx) => idx !== i)), []);
  const updateFormField = useCallback((i: number, field: "key" | "value", val: string) => {
    setFormFields((p) => p.map((f, idx) => (idx === i ? { ...f, [field]: val } : f)));
  }, []);

  const addMultipartField = useCallback(() => {
    setMultipartFields((p) => [...p, { key: "", value: "", isFile: false, fileName: "" }]);
  }, []);
  const removeMultipartField = useCallback((i: number) => {
    setMultipartFields((p) => p.filter((_, idx) => idx !== i));
  }, []);
  const updateMultipartField = useCallback((i: number, updates: Partial<{ key: string; value: string; isFile: boolean; fileName: string }>) => {
    setMultipartFields((p) => p.map((f, idx) => (idx === i ? { ...f, ...updates } : f)));
  }, []);

  const handleParse = useCallback(() => {
    const result = parseCurlCommand(pasteInput);
    if (!result) return;
    if (result.method) setMethod(result.method);
    if (result.url !== undefined) setUrl(result.url);
    if (result.headers) setHeaders(result.headers);
    if (result.bodyType) setBodyType(result.bodyType);
    if (result.bodyRaw !== undefined) setBodyRaw(result.bodyRaw);
    if (result.formFields) setFormFields(result.formFields);
    if (result.multipartFields) setMultipartFields(result.multipartFields);
    if (result.bearerToken !== undefined) setBearerToken(result.bearerToken);
    if (result.cookies) setCookies(result.cookies);
    if (result.streaming !== undefined) setStreaming(result.streaming);
    if (result.followRedirect !== undefined) setFollowRedirect(result.followRedirect);
    if (result.insecure !== undefined) setInsecure(result.insecure);
    if (result.verbose !== undefined) setVerbose(result.verbose);
    if (result.silent !== undefined) setSilent(result.silent);
    if (result.timeout !== undefined) setTimeout_(result.timeout);
  }, [pasteInput]);

  const handleReset = useCallback(() => {
    setMethod("GET"); setUrl(""); setHeaders([{ key: "", value: "" }]);
    setBodyType("none"); setBodyRaw("");
    setFormFields([{ key: "", value: "" }]);
    setMultipartFields([{ key: "", value: "", isFile: false, fileName: "" }]);
    setBearerToken(""); setCookies([{ key: "", value: "" }]);
    setStreaming(false); setFollowRedirect(false); setInsecure(false);
    setVerbose(false); setSilent(false); setTimeout_("");
    setPasteInput("");
  }, []);

  const curlState: CurlState = useMemo(() => ({
    method, url, headers, bodyType, bodyRaw, formFields, multipartFields,
    bearerToken, cookies, streaming, followRedirect, insecure, verbose, silent, timeout,
  }), [method, url, headers, bodyType, bodyRaw, formFields, multipartFields, bearerToken, cookies, streaming, followRedirect, insecure, verbose, silent, timeout]);

  const curlOutput = useMemo(() => generateCurl(curlState, platform, multiline), [curlState, platform, multiline]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(curlOutput);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { /* */ }
  }, [curlOutput]);

  // When method changes, auto-set bodyType
  useEffect(() => {
    if (BODY_METHODS.includes(method) && bodyType === "none") {
      setBodyType("json");
    }
  }, [method, bodyType]);

  const showBody = BODY_METHODS.includes(method);

  // Get value suggestions for a header key
  const getValueSuggestions = useCallback((headerKey: string): string[] => {
    const match = Object.keys(COMMON_HEADER_VALUES).find((k) => k.toLowerCase() === headerKey.toLowerCase());
    return match ? COMMON_HEADER_VALUES[match] : [];
  }, []);

  return (
    <div className="space-y-4">
      {/* ── Paste & Parse ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("curl.paste.title")}
          </h3>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500 hover:text-red-500" onClick={handleReset}>
            <RotateCcw className="h-3 w-3 mr-1" />
            {t("curl.reset")}
          </Button>
        </div>
        <div className="flex gap-2">
          <Textarea
            className="flex-1 font-mono text-sm min-h-[60px]"
            placeholder={t("curl.paste.placeholder")}
            value={pasteInput}
            onChange={(e) => setPasteInput(e.target.value)}
          />
          <Button variant="outline" className="shrink-0 self-end" onClick={handleParse} disabled={!pasteInput.trim()}>
            <ArrowRight className="h-4 w-4 mr-1" />
            {t("curl.paste.parse")}
          </Button>
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-4">
        {/* ── Left: GUI Form ──────────────────────────────────────────────── */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-5 max-h-[85vh] overflow-y-auto">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("curl.input.title")}
          </h3>

          {/* Method + URL */}
          <div className="flex gap-2">
            <Select value={method} onValueChange={(v) => setMethod(v as HttpMethod)}>
              <SelectTrigger className="w-[130px] font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METHODS.map((m) => (
                  <SelectItem key={m} value={m} className="font-mono text-sm">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input className="flex-1 font-mono text-sm" placeholder={t("curl.urlPlaceholder")} value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>

          {/* Headers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("curl.headers")}</label>
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={addHeader}>
                <Plus className="h-3 w-3 mr-1" />{t("curl.addHeader")}
              </Button>
            </div>
            {headers.map((h, i) => (
              <div key={i} className="flex gap-2 items-center">
                <AutocompleteInput
                  className="flex-1"
                  value={h.key}
                  onChange={(val) => updateHeader(i, "key", val)}
                  suggestions={COMMON_HEADERS}
                  placeholder="Header"
                />
                <AutocompleteInput
                  className="flex-1"
                  value={h.value}
                  onChange={(val) => updateHeader(i, "value", val)}
                  suggestions={getValueSuggestions(h.key)}
                  placeholder="Value"
                  mono
                />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-500" onClick={() => removeHeader(i)} disabled={headers.length <= 1}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          {/* Auth */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("curl.auth")}</label>
            <Input className="text-sm font-mono" placeholder="Bearer token" value={bearerToken} onChange={(e) => setBearerToken(e.target.value)} />
          </div>

          {/* Cookies */}
          <Section label={t("curl.cookies")} defaultOpen={cookies.some((c) => c.key.trim())}>
            <div className="space-y-2">
              {cookies.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input className="flex-1 text-sm" placeholder={t("curl.cookieNamePlaceholder")} value={c.key} onChange={(e) => updateCookie(i, "key", e.target.value)} />
                  <Input className="flex-1 text-sm font-mono" placeholder={t("curl.cookieValuePlaceholder")} value={c.value} onChange={(e) => updateCookie(i, "value", e.target.value)} />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-500" onClick={() => removeCookie(i)} disabled={cookies.length <= 1}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={addCookie}>
                <Plus className="h-3 w-3 mr-1" />{t("curl.addCookie")}
              </Button>
            </div>
          </Section>

          {/* Body */}
          {showBody && (
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("curl.body")}</label>
              <div className="flex gap-1 flex-wrap">
                {(["none", "json", "form", "multipart", "raw"] as BodyType[]).map((bt) => (
                  <button
                    key={bt}
                    onClick={() => setBodyType(bt)}
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                      bodyType === bt
                        ? "bg-blue-500 text-white"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                    )}
                  >
                    {t(`curl.body.${bt}`)}
                  </button>
                ))}
              </div>

              {/* JSON / Raw body */}
              {(bodyType === "json" || bodyType === "raw") && (
                <Textarea
                  className="font-mono text-sm min-h-[120px]"
                  placeholder={bodyType === "json" ? '{"key": "value"}' : "raw body content..."}
                  value={bodyRaw}
                  onChange={(e) => setBodyRaw(e.target.value)}
                />
              )}

              {/* Form URL-Encoded fields */}
              {bodyType === "form" && (
                <div className="space-y-2">
                  {formFields.map((f, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input className="flex-1 text-sm" placeholder={t("curl.body.fieldName")} value={f.key} onChange={(e) => updateFormField(i, "key", e.target.value)} />
                      <Input className="flex-1 text-sm" placeholder={t("curl.body.fieldValue")} value={f.value} onChange={(e) => updateFormField(i, "value", e.target.value)} />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-500" onClick={() => removeFormField(i)} disabled={formFields.length <= 1}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={addFormField}>
                    <Plus className="h-3 w-3 mr-1" />{t("curl.body.addField")}
                  </Button>
                </div>
              )}

              {/* Multipart fields */}
              {bodyType === "multipart" && (
                <div className="space-y-2">
                  {multipartFields.map((f, i) => (
                    <div key={i} className="flex gap-2 items-center flex-wrap">
                      <Input className="w-[120px] text-sm" placeholder={t("curl.body.fieldName")} value={f.key} onChange={(e) => updateMultipartField(i, { key: e.target.value })} />
                      <button
                        className={cn(
                          "px-2 py-1 text-xs rounded border transition-all",
                          f.isFile
                            ? "bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                            : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400",
                        )}
                        onClick={() => updateMultipartField(i, { isFile: !f.isFile })}
                      >
                        {f.isFile ? t("curl.body.fieldType.file") : t("curl.body.fieldType.text")}
                      </button>
                      {f.isFile ? (
                        <div className="flex-1 flex gap-2 items-center">
                          <input
                            type="file"
                            ref={(el) => { fileInputRefs.current[i] = el; }}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) updateMultipartField(i, { fileName: file.name });
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => fileInputRefs.current[i]?.click()}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            {f.fileName || t("curl.body.chooseFile")}
                          </Button>
                        </div>
                      ) : (
                        <Input className="flex-1 text-sm" placeholder={t("curl.body.fieldValue")} value={f.value} onChange={(e) => updateMultipartField(i, { value: e.target.value })} />
                      )}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-500" onClick={() => removeMultipartField(i)} disabled={multipartFields.length <= 1}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={addMultipartField}>
                    <Plus className="h-3 w-3 mr-1" />{t("curl.body.addField")}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Options */}
          <Section label={t("curl.options")} defaultOpen={streaming || followRedirect || insecure || verbose || silent || !!timeout}>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={streaming} onChange={(e) => setStreaming(e.target.checked)} className="rounded border-slate-300" />
                <span>{t("curl.options.streaming")}</span>
              </label>
              {streaming && (
                <p className="text-xs text-blue-500 dark:text-blue-400 ml-6">{t("curl.options.streamingTip")}</p>
              )}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={followRedirect} onChange={(e) => setFollowRedirect(e.target.checked)} className="rounded border-slate-300" />
                <span>{t("curl.options.followRedirect")}</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={insecure} onChange={(e) => setInsecure(e.target.checked)} className="rounded border-slate-300" />
                <span>{t("curl.options.insecure")}</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={verbose} onChange={(e) => setVerbose(e.target.checked)} className="rounded border-slate-300" />
                <span>{t("curl.options.verbose")}</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={silent} onChange={(e) => setSilent(e.target.checked)} className="rounded border-slate-300" />
                <span>{t("curl.options.silent")}</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t("curl.options.timeout")}</span>
                <Input className="w-20 text-sm font-mono" placeholder="30" value={timeout} onChange={(e) => setTimeout_(e.target.value)} />
              </div>
            </div>
          </Section>
        </div>

        {/* ── Right: Generated Output ─────────────────────────────────────── */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t("curl.output.title")}
            </h3>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setMultiline((p) => !p)}>
                {multiline ? <Minimize2 className="h-3 w-3 mr-1" /> : <Maximize2 className="h-3 w-3 mr-1" />}
                {multiline ? t("curl.format.compress") : t("curl.format.expand")}
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleCopy}>
                {copied ? <Check className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? t("curl.output.copied") : t("curl.output.copy")}
              </Button>
            </div>
          </div>

          {/* Platform tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            {([
              { value: "unix" as Platform, label: t("curl.platform.unix") },
              { value: "cmd" as Platform, label: t("curl.platform.cmd") },
              { value: "powershell" as Platform, label: t("curl.platform.powershell") },
            ]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPlatform(value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  platform === value
                    ? "bg-blue-500 text-white"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Output */}
          <pre className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-mono whitespace-pre-wrap break-all overflow-auto max-h-[500px] text-slate-800 dark:text-slate-200">
            {curlOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
