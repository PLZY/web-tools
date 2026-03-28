"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Copy, WrapText, AlignLeft, Trash2 } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Param = { value: string; type: string };
type SqlBlock = { format: string; sql: string; params: Param[]; rawSql: string; warning?: string };

// ─── Type Wrapping ───────────────────────────────────────────────────────────

const STRING_TYPES = new Set([
  "string", "varchar", "varchar2", "char", "nvarchar", "text", "clob", "nclob",
  "timestamp", "date", "datetime", "time", "localdatetime", "localdate",
  "offsetdatetime", "zoneddatetime", "instant", "uuid",
]);
const NUM_TYPES = new Set([
  "integer", "int", "long", "double", "float", "decimal", "bigdecimal",
  "biginteger", "short", "byte", "boolean", "bit", "numeric",
]);

function wrapValue(value: string, type: string): string {
  if (value === "null" || value === "NULL" || value === "") return "NULL";
  const t = type.toLowerCase();
  if (t === "null") return "NULL";
  if (t === "boolean") return value.toLowerCase() === "true" ? "1" : "0";
  // Strip surrounding single quotes that some MyBatis/logger versions add for display
  // e.g. '["A","B"]'(String) → the quotes are logging decoration, not part of the value
  let v = value;
  if (v.length >= 2 && v.startsWith("'") && v.endsWith("'")) {
    v = v.slice(1, -1);
  }
  if (STRING_TYPES.has(t)) return `'${v.replace(/'/g, "''")}'`;
  if (NUM_TYPES.has(t)) return v;
  if (/^-?\d+(\.\d+)?$/.test(v)) return v;
  return `'${v.replace(/'/g, "''")}'`;
}

function stitchSql(sql: string, params: Param[]): string {
  let idx = 0;
  return sql.replace(/\?/g, () => {
    if (idx >= params.length) return "?";
    return wrapValue(params[idx].value, params[idx++].type);
  });
}

// ─── MyBatis Parameter Parser (handles commas/parens inside values) ─────────

function parseMyBatisParams(raw: string): Param[] {
  if (!raw || !raw.trim()) return [];

  // Pre-process: standalone "null" (no type) → null(null)
  let s = raw.replace(/\bnull\b(?=\s*,|\s*$)/g, "null(null)");

  const params: Param[] = [];
  // \w+ only matches ASCII word chars, so Chinese parens like (组长) won't trigger
  const typeRe = /\((\w+)\)(?:,\s*|$)/g;
  let lastEnd = 0;
  let m: RegExpExecArray | null;

  while ((m = typeRe.exec(s)) !== null) {
    const valuePart = s.slice(lastEnd, m.index);
    // Balance check: only accept as type suffix if braces/brackets are balanced
    let braces = 0, brackets = 0;
    for (const ch of valuePart) {
      if (ch === "{") braces++;
      else if (ch === "}") braces--;
      else if (ch === "[") brackets++;
      else if (ch === "]") brackets--;
    }
    if (braces === 0 && brackets === 0) {
      const val = valuePart.replace(/^,\s*/, "").trim();
      params.push({ value: val === "null" ? "null" : val, type: m[1] });
      lastEnd = typeRe.lastIndex;
    }
    // If unbalanced, this (Word) is inside a value — skip, regex continues
  }

  return params;
}

// ─── Block Parsers ───────────────────────────────────────────────────────────

type ParseResult = { block: SqlBlock; nextLine: number } | null;

/** MyBatis / MyBatis-Plus: ==>  Preparing: ... + ==> Parameters: ... */
function tryMyBatis(lines: string[], start: number): ParseResult {
  const line = lines[start];
  const prepMatch = line.match(/=+>\s*Preparing:\s*([\s\S]*)/);
  if (!prepMatch) return null;

  let sql = prepMatch[1].trim();
  let i = start + 1;

  // Collect multi-line SQL until Parameters line
  while (i < lines.length) {
    const l = lines[i].trim();
    if (/=+>\s*Parameters:/.test(l)) break;
    if (/^(=+>|<==)/.test(l) || /^\d{4}-\d{2}-\d{2}/.test(l)) break;
    if (l) sql += " " + l;
    i++;
  }

  // Parse parameters
  const paramLine = lines[i]?.trim() ?? "";
  const paramMatch = paramLine.match(/=+>\s*Parameters:\s*([\s\S]*)/);
  const params = paramMatch ? parseMyBatisParams(paramMatch[1].trim()) : [];

  // Skip <== lines
  let next = i + 1;
  while (next < lines.length && /^\s*<==/.test(lines[next])) next++;

  sql = sql.trim();
  const qCount = (sql.match(/\?/g) || []).length;
  const warning = params.length > 0 && qCount !== params.length
    ? `占位符(${qCount}) ≠ 参数(${params.length})` : undefined;

  return { block: { format: "MyBatis", sql, params, rawSql: stitchSql(sql, params), warning }, nextLine: next };
}

/** Hibernate: SQL + binding parameter lines */
function tryHibernate(lines: string[], start: number): ParseResult {
  const line = lines[start].trim();
  const hibMatch = line.match(/^Hibernate:\s*([\s\S]*)/i);
  if (!hibMatch) return null;

  let sql = hibMatch[1].trim();
  let i = start + 1;

  // Collect multi-line SQL
  while (i < lines.length) {
    const l = lines[i].trim();
    if (/binding parameter/i.test(l) || /binding parameter/i.test(lines[i])) break;
    if (!l) { i++; continue; }
    if (/^\d{4}-\d{2}-\d{2}/.test(lines[i]) && /binding parameter/i.test(lines[i])) break;
    if (/^\d{4}-\d{2}-\d{2}/.test(lines[i]) && !/binding parameter/i.test(lines[i])) break;
    sql += " " + l;
    i++;
  }

  // Collect binding parameters
  const params: Param[] = [];
  const bindRe = /binding parameter [\[(](\d+)[\])] as [\[]([^\]]+)[\]] - [\[]([\s\S]*?)[\]]\s*$/i;

  while (i < lines.length) {
    const raw = lines[i];
    const m = raw.match(bindRe);
    if (m) {
      const idx = parseInt(m[1], 10) - 1;
      while (params.length <= idx) params.push({ value: "null", type: "null" });
      params[idx] = { value: m[3] === "null" ? "null" : m[3], type: m[2] };
      i++;
    } else break;
  }

  if (params.length === 0) return null;
  sql = sql.replace(/\s+/g, " ").trim();
  return { block: { format: "Hibernate", sql, params, rawSql: stitchSql(sql, params) }, nextLine: i };
}

/** Spring JDBC Named Params: Executing prepared SQL statement [...] + Setting SQL statement parameter */
function trySpringJdbc(lines: string[], start: number): ParseResult {
  const line = lines[start];
  if (!/Executing prepared SQL statement/i.test(line)) return null;

  // Extract SQL from [...] possibly spanning multiple lines
  let buf = line;
  let i = start + 1;
  while (i < lines.length && !buf.includes("]")) {
    buf += " " + lines[i]; i++;
  }
  const sqlMatch = buf.match(/\[([\s\S]+?)\]/);
  if (!sqlMatch) return null;
  let sql = sqlMatch[1].replace(/\s+/g, " ").trim();

  // Collect Setting SQL statement parameter lines
  const params: Param[] = [];
  const paramRe = /column index (\d+), parameter value \[(.*?)\], value class \[([^\]]*)\]/i;
  while (i < lines.length) {
    const m = lines[i].match(paramRe);
    if (m) {
      const idx = parseInt(m[1], 10) - 1;
      while (params.length <= idx) params.push({ value: "null", type: "null" });
      const cls = m[3];
      let type = "String";
      if (/Integer/i.test(cls)) type = "Integer";
      else if (/Long/i.test(cls)) type = "Long";
      else if (/Double/i.test(cls)) type = "Double";
      else if (/BigDecimal/i.test(cls)) type = "BigDecimal";
      else if (/LocalDateTime|Timestamp/i.test(cls)) type = "Timestamp";
      else if (/Boolean/i.test(cls)) type = "Boolean";
      params[idx] = { value: m[2], type };
      i++;
    } else break;
  }

  // Replace :namedParams with ? in order, then stitch
  const positionalParams: Param[] = [];
  let pIdx = 0;
  const positionalSql = sql.replace(/:(\w+)/g, () => {
    if (pIdx < params.length) positionalParams.push(params[pIdx++]);
    return "?";
  });

  return { block: { format: "Spring JDBC", sql, params: positionalParams, rawSql: stitchSql(positionalSql, positionalParams) }, nextLine: i };
}

/** MyBatis-Dynamic: Bound SQL: ... + Parameters: {key=val, ...} */
function tryMyBatisDynamic(lines: string[], start: number): ParseResult {
  const line = lines[start].trim();
  const sqlMatch = line.match(/Bound SQL:\s*([\s\S]*)/i);
  if (!sqlMatch) return null;

  let sql = sqlMatch[1].trim();
  let i = start + 1;

  while (i < lines.length) {
    const l = lines[i].trim();
    if (/^Parameters:/i.test(l)) break;
    if (!l || /^\d{4}-\d{2}-\d{2}/.test(l)) break;
    sql += " " + l;
    i++;
  }

  const paramLine = lines[i]?.trim() ?? "";
  const paramMatch = paramLine.match(/^Parameters:\s*([\s\S]*)/i);
  if (!paramMatch) return null;

  const paramStr = paramMatch[1].trim();
  const params: Param[] = [];

  if (paramStr.startsWith("{")) {
    // Parse {key=val, list=[A1,B2]} with bracket-aware splitting
    const inner = paramStr.slice(1, paramStr.lastIndexOf("}"));
    let pos = 0, depth = 0, keyStart = 0, eqPos = -1;
    const pairs: [string, string][] = [];

    while (pos <= inner.length) {
      const ch = inner[pos] ?? ","; // force flush at end
      if (ch === "[") depth++;
      else if (ch === "]") depth--;
      else if (ch === "=" && depth === 0 && eqPos === -1) eqPos = pos;
      else if ((ch === "," && depth === 0) || pos === inner.length) {
        if (eqPos >= 0) {
          pairs.push([inner.slice(keyStart, eqPos).trim(), inner.slice(eqPos + 1, pos).trim()]);
        }
        keyStart = pos + 1; eqPos = -1;
      }
      pos++;
    }

    for (const [, val] of pairs) {
      if (val.startsWith("[") && val.endsWith("]")) {
        val.slice(1, -1).split(",").forEach(item => {
          const v = item.trim();
          params.push({ value: v, type: /^-?\d+(\.\d+)?$/.test(v) ? "Integer" : "String" });
        });
      } else {
        params.push({ value: val, type: /^-?\d+(\.\d+)?$/.test(val) ? "Integer" : "String" });
      }
    }
  } else {
    params.push(...parseMyBatisParams(paramStr));
  }

  sql = sql.replace(/\s+/g, " ").trim();
  return { block: { format: "MyBatis-Dynamic", sql, params, rawSql: stitchSql(sql, params) }, nextLine: i + 1 };
}

// ─── Multi-block Log Parser ─────────────────────────────────────────────────

function parseLogBlocks(input: string): SqlBlock[] {
  const lines = input.split("\n");
  const blocks: SqlBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    // Try each parser in priority order
    const mybatis = /=+>\s*Preparing:/i.test(line) ? tryMyBatis(lines, i) : null;
    if (mybatis) { blocks.push(mybatis.block); i = mybatis.nextLine; continue; }

    const hibernate = /^(?:\s*Hibernate:|\s*\d{4}.*Hibernate:)/i.test(line) ? tryHibernate(lines, i) : null;
    if (hibernate) { blocks.push(hibernate.block); i = hibernate.nextLine; continue; }

    const spring = /Executing prepared SQL statement/i.test(line) ? trySpringJdbc(lines, i) : null;
    if (spring) { blocks.push(spring.block); i = spring.nextLine; continue; }

    const dynamic = /Bound SQL:/i.test(line) ? tryMyBatisDynamic(lines, i) : null;
    if (dynamic) { blocks.push(dynamic.block); i = dynamic.nextLine; continue; }

    i++;
  }
  return blocks;
}

// ─── SQL Formatter ──────────────────────────────────────────────────────────

function formatSql(sql: string): string {
  let s = sql.replace(/\s+/g, " ").trim();
  // Major keywords → new line
  const major = ["SELECT", "FROM", "WHERE", "SET", "VALUES", "INSERT INTO", "UPDATE", "DELETE FROM",
    "ORDER BY", "GROUP BY", "HAVING", "LIMIT", "OFFSET",
    "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "CROSS JOIN", "JOIN",
    "UNION ALL", "UNION", "INTERSECT", "EXCEPT"];
  for (const kw of major) {
    const re = new RegExp(`(?<=\\s|^)(${kw.replace(/ /g, "\\s+")})\\b`, "gi");
    s = s.replace(re, "\n$1");
  }
  // Indent AND / OR / ON
  s = s.replace(/(?<=\s)(AND|OR|ON)\b/gi, "\n    $1");
  return s.replace(/^\n+/, "").trim();
}

function compressSql(sql: string): string {
  return sql.replace(/\s+/g, " ").trim();
}

// ─── SQL Syntax Highlight ─────────────────────────────────────────────────────

function HighlightedSQL({ sql }: { sql: string }) {
  const tokenRe = /('(?:[^']|'')*')|(\b(?:SELECT|FROM|WHERE|AND|OR|NOT|IN|EXISTS|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|OFFSET|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|DISTINCT|AS|CASE|WHEN|THEN|ELSE|END|UNION|ALL|BETWEEN|LIKE|IS|NULL|TRUE|FALSE|COUNT|SUM|AVG|MAX|MIN|COALESCE)\b)|(-?\d+(?:\.\d+)?)/gi;
  const parts: { text: string; cls: string }[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(sql)) !== null) {
    if (m.index > lastIdx) parts.push({ text: sql.slice(lastIdx, m.index), cls: "" });
    if (m[1]) parts.push({ text: m[1], cls: "text-amber-400" });
    else if (m[2]) parts.push({ text: m[2], cls: "text-blue-400 font-bold" });
    else if (m[3]) parts.push({ text: m[3], cls: "text-green-400" });
    lastIdx = tokenRe.lastIndex;
  }
  if (lastIdx < sql.length) parts.push({ text: sql.slice(lastIdx), cls: "" });
  return <code>{parts.map((p, i) => p.cls ? <span key={i} className={p.cls}>{p.text}</span> : <span key={i}>{p.text}</span>)}</code>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SqlStitcher() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [blocks, setBlocks] = useState<SqlBlock[]>([]);
  const [formatted, setFormatted] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!input.trim()) { setBlocks([]); return; }
    debounceRef.current = setTimeout(() => {
      setBlocks(parseLogBlocks(input));
    }, 200);
    return () => clearTimeout(debounceRef.current);
  }, [input]);

  const handleCopy = (sql: string) => {
    navigator.clipboard.writeText(sql).then(() => toast.success(t("sqlStitcher.copied")));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: "calc(100vh - 250px)" }}>
      {/* Left: Input */}
      <div className="space-y-2 flex flex-col">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-muted-foreground">粘贴日志（支持混合多段）</label>
          {input && (
            <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => setInput("")}>
              <Trash2 className="w-3 h-3" />{t("sqlStitcher.clear")}
            </Button>
          )}
        </div>
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={"直接粘贴整段日志（MyBatis / Hibernate / Spring JDBC / MyBatis-Dynamic 均可自动识别）\n\n示例：\n==>  Preparing: SELECT * FROM user WHERE id = ?\n==> Parameters: 1(Integer)"}
          className="flex-1 min-h-[400px] font-mono text-xs resize-none"
        />
        {!input && (
          <p className="text-xs text-muted-foreground/60">支持一次性粘贴包含多条 SQL 的完整日志，自动逐条识别并缝合</p>
        )}
      </div>

      {/* Right: Results */}
      <div className="space-y-2 flex flex-col">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-muted-foreground">
            {t("sqlStitcher.outputLabel")}
            {blocks.length > 0 && <span className="text-primary ml-1.5">({blocks.length} 条)</span>}
          </label>
          {blocks.length > 0 && (
            <div className="flex items-center gap-1">
              <Button size="sm" variant={formatted ? "default" : "outline"} className="h-6 text-xs gap-1"
                onClick={() => setFormatted(true)}>
                <AlignLeft className="w-3 h-3" />格式化
              </Button>
              <Button size="sm" variant={!formatted ? "default" : "outline"} className="h-6 text-xs gap-1"
                onClick={() => setFormatted(false)}>
                <WrapText className="w-3 h-3" />压缩
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-[400px] overflow-y-auto space-y-3">
          {blocks.length === 0 && !input.trim() && (
            <div className="rounded-xl border border-border/50 bg-muted/20 h-full flex items-center justify-center text-sm text-muted-foreground">
              {t("sqlStitcher.outputPlaceholder")}
            </div>
          )}
          {blocks.length === 0 && input.trim() && (
            <div className="rounded-xl border border-border/50 bg-muted/20 h-full flex items-center justify-center text-sm text-muted-foreground">
              未能识别出 SQL 日志，请检查格式
            </div>
          )}

          {blocks.map((block, i) => {
            const displaySql = formatted ? formatSql(block.rawSql) : compressSql(block.rawSql);
            return (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                {/* Block header */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-muted/40 border-b border-border">
                  <span className="text-xs">
                    <span className="font-semibold text-primary">{block.format}</span>
                    <span className="text-muted-foreground/60 ml-2">#{i + 1}</span>
                  </span>
                  <Button size="sm" variant="ghost" className="h-6 text-xs gap-1"
                    onClick={() => handleCopy(displaySql)}>
                    <Copy className="w-3 h-3" />{t("sqlStitcher.copy")}
                  </Button>
                </div>

                {/* Warning */}
                {block.warning && (
                  <div className="px-3 py-1.5 text-xs text-orange-400 bg-orange-500/10 border-b border-border">
                    ⚠ {block.warning}
                  </div>
                )}

                {/* SQL body */}
                <pre className="px-3 py-2 text-xs font-mono leading-relaxed whitespace-pre-wrap break-all bg-card overflow-x-auto">
                  <HighlightedSQL sql={displaySql} />
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
