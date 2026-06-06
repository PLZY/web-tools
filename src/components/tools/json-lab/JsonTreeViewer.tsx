"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Check, ChevronRight, Copy, Trash2 } from "lucide-react";

type JsonObject = Record<string, unknown>;
type ExpandMode = "expandAll" | "collapseAll";

interface JsonTreeViewerProps {
  json: unknown;
  filterText: string;
  initialExpandMode: ExpandMode;
  onPathHover: (path: string) => void;
  onPathLeave: () => void;
  onPathClick: (path: string) => void;
  onDeletePath: (path: Array<string | number>) => void;
}

type NodeKind = "object" | "array" | "primitive";

function isRecord(value: unknown): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getKind(value: unknown): NodeKind {
  if (Array.isArray(value)) return "array";
  if (isRecord(value)) return "object";
  return "primitive";
}

function getKeys(value: unknown) {
  if (Array.isArray(value)) return value.map((_, index) => String(index));
  if (isRecord(value)) return Object.keys(value);
  return [];
}

function getChild(value: unknown, key: string) {
  if (Array.isArray(value)) return value[Number(key)];
  if (isRecord(value)) return value[key];
  return undefined;
}

function isExpandable(value: unknown) {
  return getKind(value) !== "primitive" && getKeys(value).length > 0;
}

function childPath(path: string, key: string, parentIsArray: boolean) {
  if (parentIsArray) return `${path}[${key}]`;
  return /^[A-Za-z_$][\w$]*$/.test(key)
    ? `${path}.${key}`
    : `${path}[${JSON.stringify(key)}]`;
}

function collectExpandablePaths(value: unknown, path = "$", out = new Set<string>()) {
  if (!isExpandable(value)) return out;
  out.add(path);
  const parentIsArray = Array.isArray(value);
  getKeys(value).forEach((key) => {
    collectExpandablePaths(getChild(value, key), childPath(path, key, parentIsArray), out);
  });
  return out;
}

function collectDescendantPaths(value: unknown, path: string, out = new Set<string>()) {
  if (!isExpandable(value)) return out;
  const parentIsArray = Array.isArray(value);
  getKeys(value).forEach((key) => {
    const nextPath = childPath(path, key, parentIsArray);
    const child = getChild(value, key);
    if (isExpandable(child)) {
      out.add(nextPath);
      collectDescendantPaths(child, nextPath, out);
    }
  });
  return out;
}

function collectSearchExpansion(value: unknown, query: string) {
  const lower = query.trim().toLowerCase();
  const expanded = new Set<string>();
  const matched = new Set<string>();
  if (!lower) return { expanded, matched };

  const walk = (node: unknown, path: string, ancestors: string[], keyName?: string) => {
    const kind = getKind(node);
    const keyMatches = keyName !== undefined && keyName.toLowerCase().includes(lower);
    const valueMatches =
      kind === "primitive" && String(node).toLowerCase().includes(lower);
    const pathMatches = path.toLowerCase().includes(lower);
    const nodeMatches = keyMatches || valueMatches || pathMatches;

    if (nodeMatches) {
      ancestors.forEach((ancestor) => expanded.add(ancestor));
      if (isExpandable(node)) expanded.add(path);
      matched.add(path);
    }

    if (kind === "primitive") return nodeMatches;

    let childMatched = false;
    const parentIsArray = Array.isArray(node);
    getKeys(node).forEach((key) => {
      const nextPath = childPath(path, key, parentIsArray);
      const found = walk(getChild(node, key), nextPath, [...ancestors, path], key);
      childMatched = childMatched || found;
    });

    if (childMatched) expanded.add(path);
    return nodeMatches || childMatched;
  };

  walk(value, "$", []);
  return { expanded, matched };
}

function formatPrimitive(value: unknown) {
  if (Array.isArray(value)) return "[]";
  if (isRecord(value)) return "{}";
  if (typeof value === "string") return `"${value}"`;
  if (value === null) return "null";
  return String(value);
}

function preview(value: unknown) {
  if (Array.isArray(value)) {
    return `[${value.length} ${value.length === 1 ? "item" : "items"}...]`;
  }
  if (isRecord(value)) {
    const size = Object.keys(value).length;
    return `{${size} ${size === 1 ? "key" : "keys"}...}`;
  }
  return formatPrimitive(value);
}

function highlight(text: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmed.toLowerCase();
  const pieces: React.ReactNode[] = [];
  let cursor = 0;
  let index = lowerText.indexOf(lowerQuery);

  while (index !== -1) {
    if (index > cursor) pieces.push(text.slice(cursor, index));
    pieces.push(
      <mark
        key={`${index}-${cursor}`}
        className="rounded bg-yellow-200 px-0.5 text-slate-950 dark:bg-yellow-400/80"
      >
        {text.slice(index, index + trimmed.length)}
      </mark>
    );
    cursor = index + trimmed.length;
    index = lowerText.indexOf(lowerQuery, cursor);
  }

  if (cursor < text.length) pieces.push(text.slice(cursor));
  return pieces;
}

const LINE_NUMBER_WIDTH = 48;
const FOLD_GUTTER_WIDTH = 28;
const TREE_GUTTER_WIDTH = LINE_NUMBER_WIDTH + FOLD_GUTTER_WIDTH;
const INDENT_WIDTH = 30;
const GUIDE_OFFSET = 14;

const JsonTreeViewer: React.FC<JsonTreeViewerProps> = ({
  json,
  filterText,
  initialExpandMode,
  onPathHover,
  onPathLeave,
  onPathClick,
  onDeletePath,
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() =>
    initialExpandMode === "expandAll" ? collectExpandablePaths(json) : new Set()
  );
  const [searchCollapsedPaths, setSearchCollapsedPaths] = useState<Set<string>>(new Set());
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [activeGuidePath, setActiveGuidePath] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const searchState = useMemo(
    () => collectSearchExpansion(json, filterText),
    [json, filterText]
  );
  const searchActive = Boolean(filterText.trim());
  const visibleExpandedPaths = useMemo(() => {
    const next = new Set(expandedPaths);
    if (searchActive) {
      searchState.expanded.forEach((path) => next.add(path));
      searchCollapsedPaths.forEach((path) => next.delete(path));
    }
    return next;
  }, [expandedPaths, searchActive, searchCollapsedPaths, searchState.expanded]);
  const lineNumbers = useMemo(() => {
    const rows: string[] = [];
    const walk = (node: unknown, path: string) => {
      const expandable = isExpandable(node);
      const expanded = visibleExpandedPaths.has(path);
      rows.push(expandable && expanded ? `${path}:open` : `${path}:row`);

      if (expandable && expanded) {
        const parentIsArray = Array.isArray(node);
        getKeys(node).forEach((key) => {
          walk(getChild(node, key), childPath(path, key, parentIsArray));
        });
        rows.push(`${path}:close`);
      }
    };

    walk(json, "$");
    return new Map(rows.map((row, index) => [row, index + 1]));
  }, [json, visibleExpandedPaths]);

  const toggleOneLevel = useCallback((path: string, value: unknown, currentlyExpanded: boolean) => {
    setExpandedPaths((current) => {
      const next = new Set(current);
      if (currentlyExpanded) {
        next.delete(path);
        collectDescendantPaths(value, path).forEach((descendant) => next.delete(descendant));
      } else {
        next.add(path);
      }
      return next;
    });

    setSearchCollapsedPaths((current) => {
      const next = new Set(current);
      if (currentlyExpanded) {
        if (searchActive) {
          next.add(path);
          collectDescendantPaths(value, path).forEach((descendant) => next.add(descendant));
        }
      } else {
        next.delete(path);
        collectDescendantPaths(value, path).forEach((descendant) => next.delete(descendant));
      }
      return next;
    });
  }, [searchActive]);

  const expandDeep = useCallback((path: string, value: unknown) => {
    setExpandedPaths((current) => {
      const next = new Set(current);
      next.add(path);
      collectDescendantPaths(value, path).forEach((descendant) => next.add(descendant));
      return next;
    });

    setSearchCollapsedPaths((current) => {
      const next = new Set(current);
      next.delete(path);
      collectDescendantPaths(value, path).forEach((descendant) => next.delete(descendant));
      return next;
    });
  }, []);

  const handleArrowClick = useCallback((event: React.MouseEvent, path: string, value: unknown, expanded: boolean) => {
    event.preventDefault();
    event.stopPropagation();
    toggleOneLevel(path, value, expanded);
  }, [toggleOneLevel]);

  const handlePreviewClick = useCallback((event: React.MouseEvent, path: string, value: unknown) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedPath(path);
    setActiveGuidePath(null);
    expandDeep(path, value);
  }, [expandDeep]);

  const copyLayer = useCallback((event: React.MouseEvent, path: string, value: unknown, keyName?: string, parentIsArray?: boolean) => {
    event.preventDefault();
    event.stopPropagation();
    const text = keyName !== undefined && !parentIsArray
      ? `${JSON.stringify(keyName)}: ${JSON.stringify(value, null, 2)}`
      : JSON.stringify(value, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedPath(path);
    window.setTimeout(() => {
      setCopiedPath((current) => current === path ? null : current);
    }, 900);
  }, []);

  const deleteLayer = useCallback((event: React.MouseEvent, pathParts: Array<string | number>) => {
    event.preventDefault();
    event.stopPropagation();
    onDeletePath(pathParts);
  }, [onDeletePath]);

  const renderActions = (
    value: unknown,
    path: string,
    pathParts: Array<string | number>,
    actionKeyName?: string,
    actionParentIsArray?: boolean
  ) => {
    const copied = copiedPath === path;
    return (
    <span className="ml-1 inline-flex translate-y-px items-center gap-0.5 opacity-0 transition-opacity group-hover/row:opacity-100">
      <button
        type="button"
        className={`flex h-5 w-5 items-center justify-center rounded transition-all ${
          copied
            ? "scale-110 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            : "text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        }`}
        title={copied ? "Copied" : "Copy this key/value"}
        onClick={(event) => copyLayer(event, path, value, actionKeyName, actionParentIsArray)}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      {pathParts.length > 0 && (
        <button
          type="button"
          className="flex h-5 w-5 items-center justify-center rounded text-rose-300 transition-colors hover:bg-rose-100 hover:text-rose-600 dark:text-rose-500/70 dark:hover:bg-rose-950 dark:hover:text-rose-300"
          title="Delete this key/value"
          onClick={(event) => deleteLayer(event, pathParts)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
    );
  };

  const primitiveClass = (primitive: unknown) => {
    if (typeof primitive === "string") return "text-emerald-700 dark:text-emerald-300";
    if (typeof primitive === "number") return "text-blue-600 dark:text-sky-300";
    if (typeof primitive === "boolean") return "text-violet-700 dark:text-violet-300";
    return "text-slate-500 dark:text-slate-400";
  };

  const renderNode = (
    value: unknown,
    path: string,
    keyName?: string,
    depth = 0,
    isLast = true,
    pathParts: Array<string | number> = []
  ): React.ReactNode => {
    const kind = getKind(value);
    const expandable = isExpandable(value);
    const expanded = visibleExpandedPaths.has(path);
    const matched = searchState.matched.has(path);
    const parentIsArray = Array.isArray(value);
    const entries = expandable ? getKeys(value) : [];
    const selected = selectedPath === path;

    const keyLabel = keyName === undefined
      ? "root"
      : Array.isArray(path.match(/\[\d+\]$/)) && /^\d+$/.test(keyName)
        ? keyName
        : `"${keyName}"`;

    const comma = keyName !== undefined && !isLast ? "," : "";

    const renderGutter = (line: number, showArrow = expandable) => (
      <span
        className="sticky left-0 z-30 flex h-7 shrink-0 select-none items-center border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
        style={{ width: TREE_GUTTER_WIDTH }}
      >
        <span
          className="flex h-7 items-center justify-end px-2 text-[12px] leading-7 text-slate-400 dark:text-slate-600"
          style={{ width: LINE_NUMBER_WIDTH }}
        >
          {line}
        </span>
        <span
          className="flex h-7 items-center justify-center"
          style={{ width: FOLD_GUTTER_WIDTH }}
        >
          {showArrow ? (
            <button
              type="button"
              aria-label={expanded ? "Collapse JSON node" : "Expand JSON node"}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-emerald-600 transition-colors hover:bg-emerald-100 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950"
              title={expanded ? "Collapse this node" : "Expand one level"}
              onClick={(event) => {
                setSelectedPath(path);
                setActiveGuidePath(null);
                handleArrowClick(event, path, value, expanded);
              }}
            >
              <ChevronRight
                className={`h-[18px] w-[18px] transition-transform ${expanded ? "rotate-90" : ""}`}
                strokeWidth={2.5}
              />
            </button>
          ) : (
            <span className="h-6 w-6 shrink-0" />
          )}
        </span>
      </span>
    );

    const rowClass = "group/row flex min-w-max items-start";
    const contentClass = `flex min-w-max items-start rounded-r px-1 transition-colors ${
      matched ? "bg-yellow-100/70 dark:bg-yellow-500/15" : selected ? "bg-emerald-50/80 dark:bg-emerald-950/30" : "hover:bg-slate-100 dark:hover:bg-slate-800/70"
    }`;

    const bracketClass = `select-text rounded px-0.5 transition-colors ${
      selected ? "bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-50" : "text-slate-950 dark:text-slate-100"
    }`;

    if (!expandable || !expanded) {
      const line = lineNumbers.get(`${path}:row`) ?? 0;
      return (
        <div key={path} className="font-mono text-[14px] leading-7">
          <div
            className={rowClass}
            onMouseEnter={() => onPathHover(path)}
            onClick={() => {
              setSelectedPath(path);
              setActiveGuidePath(null);
              onPathClick(path);
            }}
          >
            {renderGutter(line)}
            <div className={contentClass} style={{ paddingLeft: depth * INDENT_WIDTH }}>
              <span className="select-text whitespace-pre">
                <span className="text-fuchsia-700 dark:text-fuchsia-300">
                  {highlight(keyLabel, filterText)}
                </span>
                <span className="text-slate-400">: </span>
                {expandable ? (
                  <button
                    type="button"
                    className="cursor-pointer rounded bg-emerald-50 px-1 text-left text-slate-600 transition-colors hover:bg-emerald-100 hover:text-emerald-800 dark:bg-emerald-950/40 dark:text-slate-300 dark:hover:bg-emerald-900/60"
                    title="Expand all nested content"
                    onClick={(event) => handlePreviewClick(event, path, value)}
                  >
                    {highlight(preview(value), filterText)}
                  </button>
                ) : (
                  <span className={primitiveClass(value)}>
                    {highlight(formatPrimitive(value), filterText)}
                  </span>
                )}
                <span className="text-slate-400">{comma}</span>
                {renderActions(value, path, pathParts, keyName, parentIsArray)}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={path} className="group/node font-mono text-[14px] leading-7">
        {(() => {
          const line = lineNumbers.get(`${path}:open`) ?? 0;
          return (
        <div
          className={rowClass}
          onMouseEnter={() => onPathHover(path)}
          onClick={() => {
            setSelectedPath(path);
            setActiveGuidePath(null);
            onPathClick(path);
          }}
        >
          {renderGutter(line)}
          <div className={contentClass} style={{ paddingLeft: depth * INDENT_WIDTH }}>
            <span className="select-text whitespace-pre">
              <span className="text-fuchsia-700 dark:text-fuchsia-300">
                {highlight(keyLabel, filterText)}
              </span>
              <span className="text-slate-400">: </span>
              <span className={bracketClass}>
                {kind === "array" ? "[" : "{"}
              </span>
              {renderActions(value, path, pathParts, keyName, parentIsArray)}
            </span>
          </div>
        </div>
          );
        })()}

        <div className="relative">
          <button
            type="button"
            aria-label="Highlight JSON level guide"
            className={`absolute bottom-0 top-0 z-20 w-3 border-l transition-colors ${
              selected
                ? "border-emerald-500"
                : activeGuidePath === path
                  ? "border-slate-600 dark:border-slate-400"
                  : "border-slate-200 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-500"
            }`}
            style={{ left: TREE_GUTTER_WIDTH + depth * INDENT_WIDTH + GUIDE_OFFSET }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setActiveGuidePath(path);
              setSelectedPath(null);
            }}
          />
          <div>
            {entries.map((key, index) =>
              renderNode(
                getChild(value, key),
                childPath(path, key, parentIsArray),
                key,
                depth + 1,
                index === entries.length - 1,
                [...pathParts, parentIsArray ? Number(key) : key]
              )
            )}
          </div>
        </div>

        {(() => {
          const line = lineNumbers.get(`${path}:close`) ?? 0;
          return (
        <div
          className="flex min-w-max items-start font-mono text-[14px] leading-7"
          onClick={() => {
            setSelectedPath(path);
            setActiveGuidePath(null);
            onPathClick(path);
          }}
        >
          {renderGutter(line, false)}
          <div className={`min-w-max rounded-r px-1 transition-colors ${
            selected ? "bg-emerald-50/80 dark:bg-emerald-950/30" : "hover:bg-slate-100 dark:hover:bg-slate-800/70"
          }`} style={{ paddingLeft: depth * INDENT_WIDTH }}>
            <span className="select-text whitespace-pre">
              <span className={bracketClass}>{kind === "array" ? "]" : "}"}</span>
              <span className="text-slate-400">{comma}</span>
            </span>
          </div>
        </div>
          );
        })()}
      </div>
    );
  };

  return (
    <div onMouseLeave={onPathLeave} className="h-full w-full overflow-auto">
      {renderNode(json, "$")}
    </div>
  );
};

export default JsonTreeViewer;
