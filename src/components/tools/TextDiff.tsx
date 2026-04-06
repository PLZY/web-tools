"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Trash2, Pencil, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type CharOp = { type: "equal" | "delete" | "insert"; text: string };
type LineResult = {
  type: "equal" | "delete" | "insert" | "replace";
  leftText?: string;
  rightText?: string;
  leftNo?: number;
  rightNo?: number;
  leftParts?: CharOp[];
  rightParts?: CharOp[];
};

// ─── LCS for lines ────────────────────────────────────────────────────────────

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i+1][j+1] + 1 : Math.max(dp[i+1][j], dp[i][j+1]);
  return dp;
}

// ─── String similarity (prefix+suffix ratio) ─────────────────────────────────

function strSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const la = a.trim(), lb = b.trim();
  if (!la && !lb) return 1;
  if (!la || !lb) return 0;
  let pi = 0;
  while (pi < la.length && pi < lb.length && la[pi] === lb[pi]) pi++;
  let si = 0;
  while (si < la.length - pi && si < lb.length - pi && la[la.length-1-si] === lb[lb.length-1-si]) si++;
  return (pi + si) * 2 / (la.length + lb.length);
}

// ─── Char diff: prefix/suffix approach ───────────────────────────────────────

function diffChars(a: string, b: string): { leftParts: CharOp[]; rightParts: CharOp[] } {
  if (a === b) {
    return { leftParts: [{ type: "equal", text: a }], rightParts: [{ type: "equal", text: b }] };
  }
  let pi = 0;
  while (pi < a.length && pi < b.length && a[pi] === b[pi]) pi++;
  let si = 0;
  while (si < a.length - pi && si < b.length - pi && a[a.length-1-si] === b[b.length-1-si]) si++;
  const prefix = a.slice(0, pi);
  const leftMid = a.slice(pi, si > 0 ? a.length - si : undefined);
  const rightMid = b.slice(pi, si > 0 ? b.length - si : undefined);
  const suffix = si > 0 ? a.slice(a.length - si) : "";
  const left: CharOp[] = [];
  const right: CharOp[] = [];
  if (prefix) { left.push({ type: "equal", text: prefix }); right.push({ type: "equal", text: prefix }); }
  if (leftMid) left.push({ type: "delete", text: leftMid });
  if (rightMid) right.push({ type: "insert", text: rightMid });
  if (suffix) { left.push({ type: "equal", text: suffix }); right.push({ type: "equal", text: suffix }); }
  return { leftParts: left, rightParts: right };
}

// ─── Smart pairing: match a run of deletes+inserts by similarity ──────────────

function pairAndEmit(
  a: string[],
  b: string[],
  delLines: number[],
  insLines: number[],
  result: LineResult[]
) {
  if (delLines.length === 0 && insLines.length === 0) return;

  if (delLines.length === 0) {
    for (const ri of insLines)
      result.push({ type: "insert", rightText: b[ri], rightNo: ri + 1 });
    return;
  }
  if (insLines.length === 0) {
    for (const li of delLines)
      result.push({ type: "delete", leftText: a[li], leftNo: li + 1 });
    return;
  }

  const THRESHOLD = 0.25;
  // Build all (score, di, ii) pairs above threshold
  const scores: [number, number, number][] = [];
  for (let di = 0; di < delLines.length; di++) {
    for (let ii = 0; ii < insLines.length; ii++) {
      const s = strSimilarity(a[delLines[di]], b[insLines[ii]]);
      if (s >= THRESHOLD) scores.push([s, di, ii]);
    }
  }
  scores.sort((x, y) => y[0] - x[0]);

  const matchedDel = new Map<number, number>(); // di → ii
  const usedDel = new Set<number>();
  const usedIns = new Set<number>();
  for (const [, di, ii] of scores) {
    if (!usedDel.has(di) && !usedIns.has(ii)) {
      matchedDel.set(di, ii);
      usedDel.add(di);
      usedIns.add(ii);
    }
  }

  // Emit: for each delete, either replace (if matched) or pure delete
  for (let di = 0; di < delLines.length; di++) {
    const li = delLines[di];
    if (matchedDel.has(di)) {
      const ii = matchedDel.get(di)!;
      const ri = insLines[ii];
      const { leftParts, rightParts } = diffChars(a[li], b[ri]);
      result.push({ type: "replace", leftText: a[li], rightText: b[ri], leftNo: li + 1, rightNo: ri + 1, leftParts, rightParts });
    } else {
      result.push({ type: "delete", leftText: a[li], leftNo: li + 1 });
    }
  }
  // Emit unmatched inserts
  for (let ii = 0; ii < insLines.length; ii++) {
    if (!usedIns.has(ii)) {
      const ri = insLines[ii];
      result.push({ type: "insert", rightText: b[ri], rightNo: ri + 1 });
    }
  }
}

// ─── Line diff ────────────────────────────────────────────────────────────────

function diffLines(left: string, right: string): LineResult[] {
  const a = left.split("\n");
  const b = right.split("\n");
  if (a.length === 0 && b.length === 0) return [];

  const dp = lcs(a, b);
  const ops: Array<{ type: "equal" | "delete" | "insert"; li?: number; ri?: number }> = [];
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      ops.push({ type: "equal", li: i, ri: j }); i++; j++;
    } else if (i < a.length && (j >= b.length || dp[i+1][j] >= dp[i][j+1])) {
      ops.push({ type: "delete", li: i }); i++;
    } else {
      ops.push({ type: "insert", ri: j }); j++;
    }
  }

  // Group consecutive non-equal ops and do smart pairing
  const result: LineResult[] = [];
  let k = 0;
  while (k < ops.length) {
    const cur = ops[k];
    if (cur.type === "equal") {
      result.push({ type: "equal", leftText: a[cur.li!], rightText: b[cur.ri!], leftNo: cur.li! + 1, rightNo: cur.ri! + 1 });
      k++;
      continue;
    }
    // Collect entire run of non-equal ops (may interleave del/ins)
    const delList: number[] = [];
    const insList: number[] = [];
    while (k < ops.length && ops[k].type !== "equal") {
      if (ops[k].type === "delete") delList.push(ops[k].li!);
      else insList.push(ops[k].ri!);
      k++;
    }
    pairAndEmit(a, b, delList, insList, result);
  }
  return result;
}

// ─── Stripe patterns ─────────────────────────────────────────────────────────

const STRIPE_GHOST = "repeating-linear-gradient(-45deg,transparent,transparent 4px,rgba(120,120,120,0.09) 4px,rgba(120,120,120,0.09) 8px)";
const STRIPE_DEL = STRIPE_GHOST;
const STRIPE_INS = STRIPE_GHOST;

// ─── Render helpers ───────────────────────────────────────────────────────────

function CharParts({ parts }: { parts: CharOp[] }) {
  return (
    <>
      {parts.map((op, i) => {
        if (op.type === "equal") return <span key={i}>{op.text}</span>;
        return <span key={i} style={{ color: "#ff1f3d" }} className="font-semibold">{op.text}</span>;
      })}
    </>
  );
}

function LineCell({
  no, children, className, style,
}: {
  no?: number; children?: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return (
    <div className={cn("flex min-h-[1.625rem]", className)} style={style}>
      <span className="w-11 shrink-0 text-right pr-2 text-muted-foreground/35 select-none text-xs leading-[1.625rem] tabular-nums font-mono">
        {no ?? ""}
      </span>
      <span className="flex-1 whitespace-pre-wrap break-all leading-[1.625rem] px-1 font-mono text-sm">
        {children}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TextDiff() {
  const { t } = useTranslation();
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [results, setResults] = useState<LineResult[]>([]);
  const [stats, setStats] = useState({ added: 0, deleted: 0, changed: 0 });
  const [diffNav, setDiffNav] = useState<number[]>([]);
  const [navIdx, setNavIdx] = useState(0);
  // "edit" = both panels show textareas, "diff" = both panels show diff view
  const [mode, setMode] = useState<"edit" | "diff">("edit");

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef(false);

  // Synchronized scrolling
  const handleScroll = useCallback((source: "left" | "right") => {
    if (scrollingRef.current) return;
    scrollingRef.current = true;
    const src = source === "left" ? leftScrollRef.current : rightScrollRef.current;
    const dst = source === "left" ? rightScrollRef.current : leftScrollRef.current;
    if (src && dst) dst.scrollTop = src.scrollTop;
    requestAnimationFrame(() => { scrollingRef.current = false; });
  }, []);

  // Navigation — directly sets both panels to the same scroll position
  const scrollToIdx = useCallback((ni: number) => {
    const rowIdx = diffNav[ni];
    if (rowIdx == null) return;
    const el = rowRefs.current[rowIdx];
    const container = leftScrollRef.current;
    if (!el || !container) return;
    const target = Math.max(0, el.offsetTop - container.clientHeight / 2 + el.offsetHeight / 2);
    scrollingRef.current = true;
    container.scrollTop = target;
    if (rightScrollRef.current) rightScrollRef.current.scrollTop = target;
    requestAnimationFrame(() => { scrollingRef.current = false; });
  }, [diffNav]);

  const goNext = useCallback(() => {
    if (diffNav.length === 0) return;
    const ni = (navIdx + 1) % diffNav.length;
    setNavIdx(ni); scrollToIdx(ni);
  }, [navIdx, diffNav, scrollToIdx]);

  const goPrev = useCallback(() => {
    if (diffNav.length === 0) return;
    const ni = (navIdx - 1 + diffNav.length) % diffNav.length;
    setNavIdx(ni); scrollToIdx(ni);
  }, [navIdx, diffNav, scrollToIdx]);

  const MAX_LINES = 5000;
  const handleCompare = () => {
    if (!leftText && !rightText) return;
    const leftLineCount = leftText.split("\n").length;
    const rightLineCount = rightText.split("\n").length;
    if (leftLineCount > MAX_LINES || rightLineCount > MAX_LINES) {
      // Prevent browser freeze on huge inputs
      alert(t('diff.tooLarge'));
      return;
    }
    const res = diffLines(leftText, rightText);
    let added = 0, deleted = 0, changed = 0;
    const nav: number[] = [];
    res.forEach((r, i) => {
      if (r.type === "insert") { added++; nav.push(i); }
      else if (r.type === "delete") { deleted++; nav.push(i); }
      else if (r.type === "replace") { changed++; nav.push(i); }
    });
    setResults(res); setStats({ added, deleted, changed }); setDiffNav(nav); setNavIdx(0);
    setMode("diff");
  };

  const handleClear = () => {
    setLeftText(""); setRightText("");
    setResults([]); setDiffNav([]); setStats({ added: 0, deleted: 0, changed: 0 });
    setMode("edit");
  };

  const hasContent = leftText.length > 0 || rightText.length > 0;
  const hasResults = results.length > 0;
  const isIdentical = hasResults && stats.added === 0 && stats.deleted === 0 && stats.changed === 0;
  const showDiff = hasResults && !isIdentical;

  const leftIsEditing = mode === "edit";
  const rightIsEditing = mode === "edit";

  // Build rendered lines for diff view
  const { leftLines, rightLines } = useMemo(() => {
    type RL = { no?: number; content: React.ReactNode; rowBg: string; stripe?: string; isEmpty?: boolean; resultIdx: number };
    const ll: RL[] = [], rl: RL[] = [];

    results.forEach((row, idx) => {
      if (row.type === "equal") {
        ll.push({ no: row.leftNo, content: row.leftText || "\u00A0", rowBg: "", resultIdx: idx });
        rl.push({ no: row.rightNo, content: row.rightText || "\u00A0", rowBg: "", resultIdx: idx });
      } else if (row.type === "replace") {
        ll.push({ no: row.leftNo, content: <CharParts parts={row.leftParts!} />, rowBg: "bg-red-50 dark:bg-red-500/5", resultIdx: idx });
        rl.push({ no: row.rightNo, content: <CharParts parts={row.rightParts!} />, rowBg: "bg-red-50 dark:bg-red-500/5", resultIdx: idx });
      } else if (row.type === "delete") {
        const delParts: CharOp[] = row.leftText ? [{ type: "delete", text: row.leftText }] : [];
        ll.push({ no: row.leftNo, content: delParts.length ? <CharParts parts={delParts} /> : "\u00A0", rowBg: "bg-red-50 dark:bg-red-500/5", resultIdx: idx });
        rl.push({ no: undefined, content: null, rowBg: "", stripe: STRIPE_DEL, isEmpty: true, resultIdx: idx });
      } else {
        const insParts: CharOp[] = row.rightText ? [{ type: "insert", text: row.rightText }] : [];
        ll.push({ no: undefined, content: null, rowBg: "", stripe: STRIPE_INS, isEmpty: true, resultIdx: idx });
        rl.push({ no: row.rightNo, content: insParts.length ? <CharParts parts={insParts} /> : "\u00A0", rowBg: "bg-red-50 dark:bg-red-500/5", resultIdx: idx });
      }
    });
    return { leftLines: ll, rightLines: rl };
  }, [results]);

  const PANEL_HEIGHT = "calc(70vh - 6rem)";

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="outline" size="sm" onClick={handleClear} className="h-7 text-xs gap-1.5">
          <Trash2 className="w-3 h-3" />{t('diff.clear')}
        </Button>

        {mode === "diff" && isIdentical && (
          <span className="text-sm text-green-600 dark:text-green-400 font-semibold">{t('diff.identical')}</span>
        )}

        {mode === "diff" && showDiff && (
          <>
            <span className="text-sm text-muted-foreground">
              <span className="text-green-600 dark:text-green-400 font-semibold">+{stats.added}</span>
              {" / "}
              <span className="text-red-500 dark:text-red-400 font-semibold">-{stats.deleted}</span>
              {" / "}
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold">~{stats.changed}</span>
            </span>
            {diffNav.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs tabular-nums text-muted-foreground mr-1">{navIdx + 1} / {diffNav.length}</span>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={goPrev}><ChevronUp className="w-3.5 h-3.5" /></Button>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={goNext}><ChevronDown className="w-3.5 h-3.5" /></Button>
              </div>
            )}
          </>
        )}

        <div className="ml-auto">
          {mode === "edit" ? (
            <Button size="sm" onClick={handleCompare} disabled={!hasContent} className="h-7 text-xs gap-1.5">
              <GitCompare className="w-3 h-3" />{t('diff.compare')}
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setMode("edit")} className="h-7 text-xs gap-1.5">
              <Pencil className="w-3 h-3" />{t('diff.edit')}
            </Button>
          )}
        </div>
      </div>

      {/* Main panels */}
      <div className="rounded-xl border border-border overflow-hidden">
        {/* Headers */}
        <div className="grid grid-cols-2 border-b border-border bg-muted/40">
          <div className="px-4 py-2 border-r border-border flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 dark:text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block shrink-0" />
              {t('diff.left')}
            </div>
            {mode === "diff" && (
              <button onClick={() => setMode("edit")} className="text-[10px] font-mono text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer">
                🔒 {t('diff.locked')}
              </button>
            )}
          </div>
          <div className="px-4 py-2 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 dark:text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block shrink-0" />
              {t('diff.right')}
            </div>
            {mode === "diff" && (
              <button onClick={() => setMode("edit")} className="text-[10px] font-mono text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer">
                🔒 {t('diff.locked')}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2" style={{ height: PANEL_HEIGHT, minHeight: "320px" }}>
          {/* Left */}
          <div className="border-r border-border overflow-hidden flex flex-col">
            {leftIsEditing ? (
              <textarea
                value={leftText}
                onChange={e => setLeftText(e.target.value)}
                placeholder={t('diff.leftPlaceholder')}
                className="w-full h-full p-3 font-mono text-sm resize-none bg-transparent outline-none placeholder:text-muted-foreground/40"
                spellCheck={false}
              />
            ) : (
              <div
                ref={leftScrollRef}
                className="flex-1 overflow-auto bg-muted/20"
                onScroll={() => handleScroll("left")}
              >
                {leftLines.map((line, i) => {
                  const isDiff = results[line.resultIdx]?.type !== "equal";
                  const isActive = diffNav[navIdx] === line.resultIdx;
                  return (
                    <div key={i} ref={el => { if (isDiff) rowRefs.current[line.resultIdx] = el; }}
                      className={cn(isActive && isDiff && "ring-1 ring-inset ring-primary/30")}>
                      {line.isEmpty
                        ? <div className="min-h-[1.625rem]" style={{ background: line.stripe }} />
                        : <LineCell no={line.no} className={line.rowBg}>{line.content}</LineCell>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="overflow-hidden flex flex-col">
            {rightIsEditing ? (
              <textarea
                value={rightText}
                onChange={e => setRightText(e.target.value)}
                placeholder={t('diff.rightPlaceholder')}
                className="w-full h-full p-3 font-mono text-sm resize-none bg-transparent outline-none placeholder:text-muted-foreground/40"
                spellCheck={false}
              />
            ) : (
              <div
                ref={rightScrollRef}
                className="flex-1 overflow-auto bg-muted/20"
                onScroll={() => handleScroll("right")}
              >
                {rightLines.map((line, i) => {
                  const isDiff = results[line.resultIdx]?.type !== "equal";
                  const isActive = diffNav[navIdx] === line.resultIdx;
                  return (
                    <div key={i} className={cn(isActive && isDiff && "ring-1 ring-inset ring-primary/30")}>
                      {line.isEmpty
                        ? <div className="min-h-[1.625rem]" style={{ background: line.stripe }} />
                        : <LineCell no={line.no} className={line.rowBg}>{line.content}</LineCell>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {isIdentical && (
          <div className="border-t border-border p-4 text-center text-sm text-green-600 dark:text-green-400 font-medium">
            {t('diff.identical')}
          </div>
        )}
        {!hasContent && (
          <div className="border-t border-border p-4 text-center text-sm text-muted-foreground/60">
            {t('diff.empty')}
          </div>
        )}
      </div>
    </div>
  );
}
