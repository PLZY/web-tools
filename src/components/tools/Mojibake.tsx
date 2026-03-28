"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "@/lib/i18n";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { toast } from "sonner";

// ─── Reverse encoding table builder ──────────────────────────────────────────
// TextEncoder only does UTF-8. To "encode" a JS string back to GBK/Big5/Shift-JIS
// bytes, we build reverse lookup tables by decoding all possible byte sequences
// with TextDecoder and storing the inverse mapping: codepoint → bytes.

function buildReverseTable(encoding: string): Map<number, Uint8Array> {
  const map = new Map<number, Uint8Array>();
  const decoder = new TextDecoder(encoding, { fatal: false });

  // Single bytes 0x00–0xFF
  for (let b = 0; b < 256; b++) {
    const bytes = new Uint8Array([b]);
    const ch = decoder.decode(bytes);
    if (ch.length === 1 && ch !== "\uFFFD" && !map.has(ch.charCodeAt(0))) {
      map.set(ch.charCodeAt(0), new Uint8Array([b]));
    }
  }

  // Double bytes (covers GBK, Big5, Shift-JIS, EUC-KR, EUC-JP, etc.)
  for (let hi = 0x81; hi <= 0xFE; hi++) {
    for (let lo = 0x40; lo <= 0xFE; lo++) {
      const bytes = new Uint8Array([hi, lo]);
      const ch = decoder.decode(bytes);
      if (ch.length === 1 && ch !== "\uFFFD" && !map.has(ch.charCodeAt(0))) {
        map.set(ch.charCodeAt(0), new Uint8Array([hi, lo]));
      }
    }
  }

  return map;
}

// Lazy singletons for reverse tables
const tableCache = new Map<string, Map<number, Uint8Array>>();
function getReverse(encoding: string): Map<number, Uint8Array> {
  if (!tableCache.has(encoding)) tableCache.set(encoding, buildReverseTable(encoding));
  return tableCache.get(encoding)!;
}

// ─── Encode helpers ──────────────────────────────────────────────────────────

/** Encode string as ISO-8859-1 (Latin-1) bytes: identity mapping for 0-255 */
function asLatin1(s: string): Uint8Array | null {
  const buf = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c > 255) return null;
    buf[i] = c;
  }
  return buf;
}

/** Encode string using a reverse table */
function encodeViaTable(s: string, encoding: string): Uint8Array | null {
  const table = getReverse(encoding);
  const parts: Uint8Array[] = [];
  let totalLen = 0;
  for (let i = 0; i < s.length; i++) {
    const cp = s.charCodeAt(i);
    const bytes = table.get(cp);
    if (!bytes) return null;
    parts.push(bytes);
    totalLen += bytes.length;
  }
  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const p of parts) { result.set(p, offset); offset += p.length; }
  return result;
}

/** Encode as UTF-8 */
function asUtf8(s: string): Uint8Array { return new TextEncoder().encode(s); }

/** Try decoding bytes with a given charset */
function tryDecode(bytes: Uint8Array, enc: string): string {
  try { return new TextDecoder(enc, { fatal: true }).decode(bytes); } catch { return ""; }
}

// ─── Matrix config ──────────────────────────────────────────────────────────

type SrcRow = { id: string; label: string; tip: string; encode: (s: string) => Uint8Array | null };
type TgtCol = { id: string; label: string; enc: string };

const SOURCES: SrcRow[] = [
  // Windows-1252 covers the full 0x00-0xFF byte range including the 0x80-0x9F zone
  // (€ • Š etc.) that browsers actually render when UTF-8 bytes are read as "Latin-1".
  // Strict ISO-8859-1 maps 0x80-0x9F to invisible C1 control chars, but browsers use
  // Windows-1252 for those bytes — so Win-1252 is the practical standard here.
  { id: "win1252", label: "Win-1252 / Latin-1", tip: "西欧单字节编码（含€•Š等），网页乱码最常见来源", encode: s => encodeViaTable(s, "windows-1252") },
  { id: "gbk",     label: "GBK",               tip: "简体中文双字节编码",                           encode: s => encodeViaTable(s, "gbk") },
  { id: "big5",    label: "Big5",              tip: "繁体中文双字节编码",                           encode: s => encodeViaTable(s, "big5") },
  { id: "sjis",    label: "Shift-JIS",         tip: "日文编码",                                    encode: s => encodeViaTable(s, "shift_jis") },
  { id: "euckr",   label: "EUC-KR",            tip: "韩文编码",                                    encode: s => encodeViaTable(s, "euc-kr") },
  { id: "utf8",    label: "UTF-8",             tip: "多字节→字节（双重编码修复）",                  encode: asUtf8 },
];

const TARGETS: TgtCol[] = [
  { id: "utf8",    label: "UTF-8",              enc: "utf-8" },
  { id: "gbk",     label: "GBK",               enc: "gbk" },
  { id: "gb18030", label: "GB18030",            enc: "gb18030" },
  { id: "big5",    label: "Big5",              enc: "big5" },
  { id: "sjis",    label: "Shift-JIS",         enc: "shift_jis" },
  { id: "eucjp",   label: "EUC-JP",            enc: "euc-jp" },
  { id: "euckr",   label: "EUC-KR",            enc: "euc-kr" },
  { id: "latin1",  label: "Win-1252 / Latin-1", enc: "windows-1252" },
];

const CJK_RE = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7a3\u3400-\u4dbf]{2,}/;

type Cell = { text: string; hit: boolean; empty: boolean; srcLabel: string; tgtLabel: string };

// ─── Component ──────────────────────────────────────────────────────────────

export default function Mojibake() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [matrix, setMatrix] = useState<Cell[][] | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!input.trim()) { setMatrix(null); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      const mat: Cell[][] = SOURCES.map(src =>
        TARGETS.map(tgt => {
          if (src.id === tgt.id) return { text: "(同编码，跳过)", hit: false, empty: true, srcLabel: src.label, tgtLabel: tgt.label };
          const bytes = src.encode(input);
          if (!bytes) return { text: "—", hit: false, empty: true, srcLabel: src.label, tgtLabel: tgt.label };
          const decoded = tryDecode(bytes, tgt.enc);
          if (!decoded) return { text: "⚠", hit: false, empty: true, srcLabel: src.label, tgtLabel: tgt.label };
          const hit = CJK_RE.test(decoded);
          return { text: decoded, hit, empty: false, srcLabel: src.label, tgtLabel: tgt.label };
        })
      );
      setMatrix(mat);
      setLoading(false);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [input]);

  const hits = useMemo(() => {
    if (!matrix) return [];
    const found: Cell[] = [];
    matrix.forEach(row => row.forEach(cell => { if (cell.hit) found.push(cell); }));
    return found;
  }, [matrix]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success("已复制"));
  };

  return (
    <div className="space-y-5">
      {/* Explanation */}
      <div className="rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-sm space-y-2">
        <p className="font-semibold text-foreground">🔬 工作原理</p>
        <p className="text-muted-foreground leading-relaxed">
          乱码 = <strong>正确的字节序列</strong>被用<strong>错误的编码</strong>来显示。
          本工具穷举「<span className="text-primary font-semibold">把乱码当成 A 编码的文字 → 还原成字节 → 再用 B 编码解读</span>」所有组合（{SOURCES.length}×{TARGETS.length} 矩阵），
          <span className="text-green-500 font-semibold">绿色高亮</span>的格子即为检测到有意义文字的结果。
        </p>
        <p className="text-muted-foreground/80 text-xs">
          例①（中文→GBK乱码）："你好"以 UTF-8 存储 → 被 GBK 打开变成"浣犲ソ" → 粘贴 → 表格"行=GBK, 列=UTF-8"显示"你好"<br />
          例②（网页西欧乱码）："你好"以 UTF-8 存储 → 被 Win-1252/Latin-1 读取变成"ä½ å¥½" → 粘贴 → 表格"行=Win-1252, 列=UTF-8"显示"你好"
        </p>
      </div>

      {/* Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-muted-foreground">{t('mojibake.inputLabel')}</label>
          {input && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setInput("")}>清空</Button>
          )}
        </div>
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t('mojibake.inputPlaceholder')}
          className="h-24 font-mono text-sm resize-none"
        />
        {!input && <p className="text-xs text-muted-foreground/60">粘贴乱码文本后自动开始穷举解码</p>}
      </div>

      {loading && <div className="text-center py-4 text-sm text-muted-foreground">正在构建编码表并穷举解码…</div>}

      {/* Hit Results Banner */}
      {hits.length > 0 && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3 space-y-2">
          <p className="text-sm font-semibold text-green-500">✓ 找到 {hits.length} 个候选结果</p>
          {hits.map((cell, i) => (
            <div key={i} className="flex items-start gap-3 bg-green-500/5 rounded-lg px-3 py-2">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground mb-1">
                  乱码以 <span className="font-semibold text-primary">{cell.srcLabel}</span> 读取字节 →
                  用 <span className="font-semibold text-primary">{cell.tgtLabel}</span> 重新解码
                </div>
                <div className="font-mono text-sm text-green-400 font-semibold break-all">{cell.text}</div>
              </div>
              <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => handleCopy(cell.text)}>
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Full Matrix */}
      {matrix && !loading && (
        <details className="group" open={hits.length === 0}>
          <summary className="cursor-pointer text-sm font-semibold text-muted-foreground hover:text-foreground select-none mb-2">
            {hits.length > 0 ? "查看完整矩阵 ▸" : "完整解码矩阵"}
          </summary>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="border-r border-border px-3 py-3 text-left min-w-[140px]">
                    <div className="text-[10px] leading-tight space-y-0.5">
                      <div className="text-primary font-bold text-xs">↓ 假设乱码是这种编码</div>
                      <div className="text-muted-foreground/50">（还原成字节）</div>
                    </div>
                  </th>
                  {TARGETS.map(tgt => (
                    <th key={tgt.id} className="border-r last:border-r-0 border-border/60 px-2 py-3 font-semibold text-center whitespace-nowrap text-foreground text-xs">
                      {tgt.label}
                      <div className="text-[9px] text-muted-foreground/50 font-normal mt-0.5">→ 按此解读</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((src, ri) => (
                  <tr key={src.id} className="border-b last:border-b-0 border-border/40 hover:bg-muted/10">
                    <td className="border-r border-border px-3 py-2 bg-muted/20">
                      <div className="font-semibold text-foreground/80 text-xs">{src.label}</div>
                      <div className="text-muted-foreground/50 text-[10px] mt-0.5 leading-tight">{src.tip}</div>
                    </td>
                    {matrix[ri].map((cell, ci) => (
                      <td key={ci} className={cn(
                        "border-r last:border-r-0 border-border/40 px-2 py-2 text-center align-middle",
                        cell.hit && "bg-green-500/15 border-green-500/30"
                      )}>
                        {cell.hit ? (
                          <div className="font-mono text-green-400 dark:text-green-300 text-xs font-semibold max-w-[120px] truncate mx-auto cursor-pointer"
                            title={`点击复制：${cell.text}`} onClick={() => handleCopy(cell.text)}>
                            {cell.text}
                          </div>
                        ) : cell.empty ? (
                          <span className="text-muted-foreground/25 text-[10px]">{cell.text}</span>
                        ) : (
                          <span className="font-mono text-muted-foreground/30 text-[10px] max-w-[120px] truncate block mx-auto" title={cell.text}>
                            {cell.text.length > 15 ? cell.text.slice(0, 15) + "…" : cell.text}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

      {!matrix && !loading && !input.trim() && (
        <div className="rounded-xl border border-border/50 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
          {t('mojibake.empty')}
        </div>
      )}

      {matrix && !loading && hits.length === 0 && (
        <div className="rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm text-muted-foreground">
          未在矩阵中检测到连续中/日/韩文字。可能原因：①文本非东亚语言 ②多次错误编码嵌套 ③编码不在当前矩阵范围内
        </div>
      )}
    </div>
  );
}
