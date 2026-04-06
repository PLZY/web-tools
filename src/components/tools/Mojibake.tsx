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

/** Parse hex string (supports spaces, colons, dashes, and 0x prefixes) into bytes */
function parseHexInput(s: string): Uint8Array | null {
  // Strip 0x/0X and \x prefixes (e.g. "0xE4 0xBD 0xA0" or "\xE4\xBD\xA0" → "E4BDA0")
  const hex = s.replace(/0x/gi, "").replace(/\\x/gi, "").replace(/[\s:,\-]/g, "").toLowerCase();
  if (!hex || !/^[0-9a-f]+$/.test(hex) || hex.length % 2 !== 0) return null;
  const buf = new Uint8Array(hex.length / 2);
  for (let i = 0; i < buf.length; i++) {
    buf[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return buf;
}

// ─── Matrix config ──────────────────────────────────────────────────────────

type SrcRow = { id: string; label: string; tip: string; tipZh: string; encode: (s: string) => Uint8Array | null };
type TgtCol = { id: string; label: string; enc: string };

const SOURCES: SrcRow[] = [
  { id: "win1252", label: "Win-1252 / Latin-1", tip: "Western single-byte", tipZh: "西欧单字节编码", encode: s => encodeViaTable(s, "windows-1252") },
  { id: "gbk",     label: "GBK",               tip: "Simplified Chinese",   tipZh: "简体中文双字节编码", encode: s => encodeViaTable(s, "gbk") },
  { id: "big5",    label: "Big5",              tip: "Traditional Chinese",  tipZh: "繁体中文双字节编码", encode: s => encodeViaTable(s, "big5") },
  { id: "sjis",    label: "Shift-JIS",         tip: "Japanese",             tipZh: "日文编码", encode: s => encodeViaTable(s, "shift_jis") },
  { id: "euckr",   label: "EUC-KR",            tip: "Korean",               tipZh: "韩文编码", encode: s => encodeViaTable(s, "euc-kr") },
  { id: "utf8",    label: "UTF-8",             tip: "Multi-byte → bytes",   tipZh: "多字节→字节（双重编码修复）", encode: asUtf8 },
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

type Cell = { text: string; hit: boolean; empty: boolean; srcLabel: string; tgtLabel: string; normalized?: boolean };
type HexCell = { text: string; hit: boolean; empty: boolean; tgtLabel: string };

// ─── Component ──────────────────────────────────────────────────────────────

export default function Mojibake() {
  const { t, lang } = useTranslation();
  const [input, setInput] = useState("");
  const [hexMode, setHexMode] = useState(false);
  const [matrix, setMatrix] = useState<Cell[][] | null>(null);
  const [hexResults, setHexResults] = useState<HexCell[] | null>(null);
  const [hexError, setHexError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!input.trim()) {
      setMatrix(null);
      setHexResults(null);
      setHexError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      if (hexMode) {
        const bytes = parseHexInput(input);
        if (!bytes) {
          setHexError(lang === "en" ? "Invalid hex format. Enter bytes like: E4 BD A0 E5 A5 BD" : "无效的十六进制格式，请输入如 E4 BD A0 E5 A5 BD 的格式（每字节两���十六进制）");
          setHexResults(null);
          setLoading(false);
          return;
        }
        setHexError(null);
        const results: HexCell[] = TARGETS.map(tgt => {
          const text = tryDecode(bytes, tgt.enc);
          if (!text) return { text: "⚠", hit: false, empty: true, tgtLabel: tgt.label };
          const hit = CJK_RE.test(text);
          return { text, hit, empty: false, tgtLabel: tgt.label };
        });
        setHexResults(results);
        setMatrix(null);
      } else {
        const mat: Cell[][] = SOURCES.map(src =>
          TARGETS.map(tgt => {
            if (src.id === tgt.id) return { text: "—", hit: false, empty: true, srcLabel: src.label, tgtLabel: tgt.label };
            const bytes = src.encode(input);
            if (!bytes) return { text: "—", hit: false, empty: true, srcLabel: src.label, tgtLabel: tgt.label };
            let decoded = tryDecode(bytes, tgt.enc);
            let normalized = false;

            // NBSP fallback: when clipboard normalizes 0xA0 bytes to regular space 0x20,
            // the byte stream becomes corrupted. Retry with spaces → U+00A0 substitution.
            // Example: "ä½ å¥½" with regular space → "ä½\u00A0å¥½" → correctly recovers "你好".
            if (!decoded && input.includes(" ")) {
              const nbspInput = input.replace(/ /g, "\u00A0");
              const nbspBytes = src.encode(nbspInput);
              if (nbspBytes) {
                const nbspDecoded = tryDecode(nbspBytes, tgt.enc);
                if (nbspDecoded) {
                  decoded = nbspDecoded;
                  normalized = true;
                }
              }
            }

            if (!decoded) return { text: "⚠", hit: false, empty: true, srcLabel: src.label, tgtLabel: tgt.label };
            const hit = CJK_RE.test(decoded);
            return { text: decoded, hit, empty: false, srcLabel: src.label, tgtLabel: tgt.label, normalized };
          })
        );
        setMatrix(mat);
        setHexResults(null);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [input, hexMode]);

  const hits = useMemo(() => {
    if (hexMode) {
      if (!hexResults) return [];
      return hexResults
        .filter(r => r.hit)
        .map(r => ({ text: r.text, srcLabel: "HEX 原始字节", tgtLabel: r.tgtLabel, normalized: false }));
    }
    if (!matrix) return [];
    const found: Array<{ text: string; srcLabel: string; tgtLabel: string; normalized?: boolean }> = [];
    matrix.forEach(row => row.forEach(cell => { if (cell.hit) found.push(cell); }));
    return found;
  }, [matrix, hexResults, hexMode]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(t('sqlStitcher.copied')));
  };

  const handleModeSwitch = (toHex: boolean) => {
    setHexMode(toHex);
    setInput("");
    setMatrix(null);
    setHexResults(null);
    setHexError(null);
  };

  return (
    <div className="space-y-5">
      {/* Explanation */}
      <div className="rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-sm space-y-2">
        <p className="font-semibold text-foreground">🔬 {t('mojibake.howItWorks')}</p>
        <p className="text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: t('mojibake.howItWorks.body').replace('{rows}', String(SOURCES.length)).replace('{cols}', String(TARGETS.length)) }}
        />
      </div>

      {/* Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-muted-foreground">
              {hexMode ? t('mojibake.hexInputLabel') : t('mojibake.inputLabel')}
            </label>
            <div className="flex rounded-md border border-border overflow-hidden text-xs">
              <button
                onClick={() => handleModeSwitch(false)}
                className={cn(
                  "px-2.5 py-1 transition-colors",
                  !hexMode ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {t('mojibake.mode.text')}
              </button>
              <button
                onClick={() => handleModeSwitch(true)}
                className={cn(
                  "px-2.5 py-1 transition-colors border-l border-border",
                  hexMode ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted"
                )}
              >
                HEX
              </button>
            </div>
          </div>
          {input && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setInput("")}>{t('mojibake.clear')}</Button>
          )}
        </div>
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={hexMode
            ? t('mojibake.hexPlaceholder')
            : t('mojibake.inputPlaceholder')
          }
          className="h-24 font-mono text-sm resize-none"
        />
        {!input && (
          <p className="text-xs text-muted-foreground/60">
            {hexMode ? t('mojibake.hexHint') : t('mojibake.textHint')}
          </p>
        )}
        {hexError && (
          <p className="text-xs text-destructive">{hexError}</p>
        )}
      </div>

      {loading && <div className="text-center py-4 text-sm text-muted-foreground">{t('mojibake.loading')}</div>}

      {/* Hit Results Banner */}
      {hits.length > 0 && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3 space-y-2">
          <p className="text-sm font-semibold text-green-500">✓ {t('mojibake.hitsFound').replace('{count}', String(hits.length))}</p>
          {hits.map((cell, i) => (
            <div key={i} className="flex items-start gap-3 bg-green-500/5 rounded-lg px-3 py-2">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground mb-1">
                  {t('mojibake.hitDesc.src')} <span className="font-semibold text-primary">{cell.srcLabel}</span> →
                  {t('mojibake.hitDesc.tgt')} <span className="font-semibold text-primary">{cell.tgtLabel}</span>
                  {cell.normalized && (
                    <span className="ml-1.5 text-amber-500 font-semibold">{t('mojibake.normalized')}</span>
                  )}
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

      {/* HEX mode: flat results list */}
      {hexMode && hexResults && !loading && (
        <details className="group" open={hits.length === 0}>
          <summary className="cursor-pointer text-sm font-semibold text-muted-foreground hover:text-foreground select-none mb-2">
            {hits.length > 0 ? t('mojibake.viewAllHex') : t('mojibake.allHexResults')}
          </summary>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-3 py-2 text-left font-semibold text-foreground">{t('mojibake.targetEncoding')}</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">{t('mojibake.decodeResult')}</th>
                </tr>
              </thead>
              <tbody>
                {hexResults.map((r, i) => (
                  <tr key={i} className={cn("border-b last:border-b-0 border-border/40", r.hit && "bg-green-500/10")}>
                    <td className="px-3 py-2 font-semibold text-foreground/70 whitespace-nowrap">{r.tgtLabel}</td>
                    <td className={cn("px-3 py-2 font-mono break-all", r.hit ? "text-green-400 font-semibold" : r.empty ? "text-muted-foreground/30" : "text-muted-foreground/50")}>
                      {r.text}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

      {/* Full Matrix (text mode) */}
      {!hexMode && matrix && !loading && (
        <details className="group" open={hits.length === 0}>
          <summary className="cursor-pointer text-sm font-semibold text-muted-foreground hover:text-foreground select-none mb-2">
            {hits.length > 0 ? t('mojibake.viewMatrix') : t('mojibake.fullMatrix')}
          </summary>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="border-r border-border px-3 py-3 text-left min-w-[140px]">
                    <div className="text-[10px] leading-tight space-y-0.5">
                      <div className="text-primary font-bold text-xs">↓ {t('mojibake.matrixRowHeader')}</div>
                      <div className="text-muted-foreground/50">{t('mojibake.matrixRowSub')}</div>
                    </div>
                  </th>
                  {TARGETS.map(tgt => (
                    <th key={tgt.id} className="border-r last:border-r-0 border-border/60 px-2 py-3 font-semibold text-center whitespace-nowrap text-foreground text-xs">
                      {tgt.label}
                      <div className="text-[9px] text-muted-foreground/50 font-normal mt-0.5">→ {t('mojibake.matrixColSub')}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((src, ri) => (
                  <tr key={src.id} className="border-b last:border-b-0 border-border/40 hover:bg-muted/10">
                    <td className="border-r border-border px-3 py-2 bg-muted/20">
                      <div className="font-semibold text-foreground/80 text-xs">{src.label}</div>
                      <div className="text-muted-foreground/50 text-[10px] mt-0.5 leading-tight">{lang === "en" ? src.tip : src.tipZh}</div>
                    </td>
                    {matrix[ri].map((cell, ci) => (
                      <td key={ci} className={cn(
                        "border-r last:border-r-0 border-border/40 px-2 py-2 text-center align-middle",
                        cell.hit && "bg-green-500/15 border-green-500/30"
                      )}>
                        {cell.hit ? (
                          <div className="space-y-0.5">
                            <div className="font-mono text-green-400 dark:text-green-300 text-xs font-semibold max-w-[120px] truncate mx-auto cursor-pointer"
                              title={cell.text} onClick={() => handleCopy(cell.text)}>
                              {cell.text}
                            </div>
                            {cell.normalized && (
                              <div className="text-[9px] text-amber-500/80">{t('mojibake.normalized')}</div>
                            )}
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

      {!matrix && !hexResults && !loading && !input.trim() && (
        <div className="rounded-xl border border-border/50 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
          {t('mojibake.empty')}
        </div>
      )}

      {!hexMode && matrix && !loading && hits.length === 0 && (
        <div className="rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm text-muted-foreground">
          {t('mojibake.noHits')}
        </div>
      )}

      {hexMode && hexResults && !loading && hits.length === 0 && !hexError && (
        <div className="rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm text-muted-foreground">
          {t('mojibake.noHitsHex')}
        </div>
      )}
    </div>
  );
}
