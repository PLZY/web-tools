"use client";

import { useState, useMemo } from "react";
import { Search, X, Keyboard } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface ShortcutItem {
  action: string;
  actionEn: string;
  eclipse: string;
  idea: string;
  vscode: string;
}

interface Category {
  id: string;
  name: string;
  nameEn: string;
  items: ShortcutItem[];
}

const DATA: Category[] = [
  {
    id: "search",
    name: "查找 & 替换",
    nameEn: "Search & Replace",
    items: [
      { action: "全局文件查找", actionEn: "Find File by Name", eclipse: "Ctrl+Shift+R", idea: "Double Shift", vscode: "Ctrl+P" },
      { action: "全局文本搜索", actionEn: "Find in Files", eclipse: "Ctrl+H", idea: "Ctrl+Shift+F", vscode: "Ctrl+Shift+F" },
      { action: "当前文件查找", actionEn: "Find in File", eclipse: "Ctrl+F", idea: "Ctrl+F", vscode: "Ctrl+F" },
      { action: "当前文件替换", actionEn: "Replace in File", eclipse: "Ctrl+H", idea: "Ctrl+R", vscode: "Ctrl+H" },
      { action: "全局文本替换", actionEn: "Replace in Files", eclipse: "Ctrl+H", idea: "Ctrl+Shift+R", vscode: "Ctrl+Shift+H" },
      { action: "查找下一个", actionEn: "Find Next", eclipse: "Ctrl+K", idea: "F3", vscode: "F3" },
      { action: "查找上一个", actionEn: "Find Previous", eclipse: "Ctrl+Shift+K", idea: "Shift+F3", vscode: "Shift+F3" },
      { action: "查找类 / 类型", actionEn: "Find Class / Type", eclipse: "Ctrl+Shift+T", idea: "Ctrl+N", vscode: "Ctrl+T" },
      { action: "查找符号 / 方法", actionEn: "Find Symbol", eclipse: "Ctrl+O", idea: "Ctrl+Alt+Shift+N", vscode: "Ctrl+Shift+O" },
      { action: "查找 Action / 命令", actionEn: "Find Action / Command", eclipse: "Ctrl+3", idea: "Ctrl+Shift+A", vscode: "Ctrl+Shift+P" },
      { action: "选中下一个相同词", actionEn: "Select Next Occurrence", eclipse: "—", idea: "Alt+J", vscode: "Ctrl+D" },
      { action: "选中所有相同词", actionEn: "Select All Occurrences", eclipse: "—", idea: "Ctrl+Alt+Shift+J", vscode: "Ctrl+Shift+L" },
    ],
  },
  {
    id: "navigate",
    name: "导航",
    nameEn: "Navigation",
    items: [
      { action: "跳转到行", actionEn: "Go to Line", eclipse: "Ctrl+L", idea: "Ctrl+G", vscode: "Ctrl+G" },
      { action: "跳转到定义", actionEn: "Go to Definition", eclipse: "F3", idea: "Ctrl+B", vscode: "F12" },
      { action: "跳转到实现", actionEn: "Go to Implementation", eclipse: "Ctrl+T", idea: "Ctrl+Alt+B", vscode: "Ctrl+F12" },
      { action: "跳转到类型声明", actionEn: "Go to Type Declaration", eclipse: "F3", idea: "Ctrl+Shift+B", vscode: "F12" },
      { action: "查找所有引用", actionEn: "Find All References", eclipse: "Ctrl+Shift+G", idea: "Alt+F7", vscode: "Shift+F12" },
      { action: "查看类继承层次", actionEn: "Class Hierarchy", eclipse: "Ctrl+T", idea: "Ctrl+H", vscode: "—" },
      { action: "查看调用层次", actionEn: "Call Hierarchy", eclipse: "Ctrl+Alt+H", idea: "Ctrl+Alt+H", vscode: "—" },
      { action: "后退", actionEn: "Navigate Back", eclipse: "Alt+Left", idea: "Ctrl+Alt+Left", vscode: "Alt+Left" },
      { action: "前进", actionEn: "Navigate Forward", eclipse: "Alt+Right", idea: "Ctrl+Alt+Right", vscode: "Alt+Right" },
      { action: "最近打开的文件", actionEn: "Recent Files", eclipse: "Ctrl+E", idea: "Ctrl+E", vscode: "Ctrl+Tab" },
      { action: "在文件树中定位当前文件", actionEn: "Reveal in Explorer", eclipse: "—", idea: "Alt+F1", vscode: "Ctrl+Shift+E" },
      { action: "跳转到下一个错误", actionEn: "Go to Next Error", eclipse: "Ctrl+.", idea: "F2", vscode: "F8" },
      { action: "跳转到上一个错误", actionEn: "Go to Previous Error", eclipse: "Ctrl+,", idea: "Shift+F2", vscode: "Shift+F8" },
      { action: "展开代码折叠", actionEn: "Expand Fold", eclipse: "Ctrl+NumPad+", idea: "Ctrl+=", vscode: "Ctrl+Shift+]" },
      { action: "折叠代码", actionEn: "Collapse Fold", eclipse: "Ctrl+NumPad-", idea: "Ctrl+-", vscode: "Ctrl+Shift+[" },
      { action: "展开全部", actionEn: "Expand All", eclipse: "Ctrl+Shift+NumPad+", idea: "Ctrl+Shift+=", vscode: "Ctrl+K Ctrl+J" },
      { action: "折叠全部", actionEn: "Collapse All", eclipse: "Ctrl+Shift+NumPad-", idea: "Ctrl+Shift+-", vscode: "Ctrl+K Ctrl+0" },
    ],
  },
  {
    id: "edit",
    name: "编辑",
    nameEn: "Editing",
    items: [
      { action: "代码补全", actionEn: "Code Completion", eclipse: "Ctrl+Space", idea: "Ctrl+Space", vscode: "Ctrl+Space" },
      { action: "快速修复 / 建议", actionEn: "Quick Fix / Suggestions", eclipse: "Ctrl+1", idea: "Alt+Enter", vscode: "Ctrl+." },
      { action: "格式化代码", actionEn: "Format Code", eclipse: "Ctrl+Shift+F", idea: "Ctrl+Alt+L", vscode: "Shift+Alt+F" },
      { action: "整理导入", actionEn: "Optimize Imports", eclipse: "Ctrl+Shift+O", idea: "Ctrl+Alt+O", vscode: "—" },
      { action: "注释 / 取消注释（行）", actionEn: "Toggle Line Comment", eclipse: "Ctrl+/", idea: "Ctrl+/", vscode: "Ctrl+/" },
      { action: "注释 / 取消注释（块）", actionEn: "Toggle Block Comment", eclipse: "Ctrl+Shift+/", idea: "Ctrl+Shift+/", vscode: "Shift+Alt+A" },
      { action: "删除行", actionEn: "Delete Line", eclipse: "Ctrl+D", idea: "Ctrl+Y", vscode: "Ctrl+Shift+K" },
      { action: "复制行（向下）", actionEn: "Duplicate Line Down", eclipse: "Ctrl+Alt+Down", idea: "Ctrl+D", vscode: "Shift+Alt+Down" },
      { action: "复制行（向上）", actionEn: "Duplicate Line Up", eclipse: "Ctrl+Alt+Up", idea: "—", vscode: "Shift+Alt+Up" },
      { action: "移动行（向上）", actionEn: "Move Line Up", eclipse: "Alt+Up", idea: "Shift+Alt+Up", vscode: "Alt+Up" },
      { action: "移动行（向下）", actionEn: "Move Line Down", eclipse: "Alt+Down", idea: "Shift+Alt+Down", vscode: "Alt+Down" },
      { action: "选中当前行", actionEn: "Select Line", eclipse: "—", idea: "Ctrl+W (逐步扩展)", vscode: "Ctrl+L" },
      { action: "逐步扩大选区", actionEn: "Expand Selection", eclipse: "Shift+Alt+Up", idea: "Ctrl+W", vscode: "Shift+Alt+Right" },
      { action: "逐步缩小选区", actionEn: "Shrink Selection", eclipse: "Shift+Alt+Down", idea: "Ctrl+Shift+W", vscode: "Shift+Alt+Left" },
      { action: "多光标（点击）", actionEn: "Add Cursor (click)", eclipse: "Alt+Click", idea: "Alt+Click", vscode: "Alt+Click" },
      { action: "在所有选中行末添加光标", actionEn: "Add Cursor to Line Ends", eclipse: "—", idea: "Alt+Shift+G", vscode: "Shift+Alt+I" },
      { action: "撤销", actionEn: "Undo", eclipse: "Ctrl+Z", idea: "Ctrl+Z", vscode: "Ctrl+Z" },
      { action: "重做", actionEn: "Redo", eclipse: "Ctrl+Y", idea: "Ctrl+Shift+Z", vscode: "Ctrl+Y" },
      { action: "大小写转换（切换）", actionEn: "Toggle Case", eclipse: "—", idea: "Ctrl+Shift+U", vscode: "—" },
      { action: "合并行", actionEn: "Join Lines", eclipse: "—", idea: "Ctrl+Shift+J", vscode: "—" },
      { action: "包围代码（try/if等）", actionEn: "Surround With", eclipse: "Ctrl+Alt+Z", idea: "Ctrl+Alt+T", vscode: "—" },
    ],
  },
  {
    id: "refactor",
    name: "重构",
    nameEn: "Refactor",
    items: [
      { action: "重命名", actionEn: "Rename", eclipse: "Alt+Shift+R", idea: "Shift+F6", vscode: "F2" },
      { action: "提取方法", actionEn: "Extract Method", eclipse: "Alt+Shift+M", idea: "Ctrl+Alt+M", vscode: "—" },
      { action: "提取变量", actionEn: "Extract Variable", eclipse: "Alt+Shift+L", idea: "Ctrl+Alt+V", vscode: "—" },
      { action: "提取常量", actionEn: "Extract Constant", eclipse: "Alt+Shift+K", idea: "Ctrl+Alt+C", vscode: "—" },
      { action: "提取字段", actionEn: "Extract Field", eclipse: "—", idea: "Ctrl+Alt+F", vscode: "—" },
      { action: "提取参数", actionEn: "Extract Parameter", eclipse: "—", idea: "Ctrl+Alt+P", vscode: "—" },
      { action: "内联", actionEn: "Inline", eclipse: "Alt+Shift+I", idea: "Ctrl+Alt+N", vscode: "—" },
      { action: "移动", actionEn: "Move", eclipse: "Alt+Shift+V", idea: "F6", vscode: "—" },
      { action: "安全删除", actionEn: "Safe Delete", eclipse: "—", idea: "Alt+Delete", vscode: "—" },
      { action: "更改方法签名", actionEn: "Change Signature", eclipse: "Alt+Shift+C", idea: "Ctrl+F6", vscode: "—" },
      { action: "打开重构菜单", actionEn: "Refactor This", eclipse: "Alt+Shift+T", idea: "Ctrl+Alt+Shift+T", vscode: "Ctrl+Shift+R" },
    ],
  },
  {
    id: "generate",
    name: "代码生成",
    nameEn: "Code Generation",
    items: [
      { action: "打开生成菜单", actionEn: "Generate Menu", eclipse: "Alt+Shift+S", idea: "Alt+Insert", vscode: "—" },
      { action: "实现接口方法", actionEn: "Implement Methods", eclipse: "Alt+Shift+S → i", idea: "Ctrl+I", vscode: "—" },
      { action: "Override 父类方法", actionEn: "Override Methods", eclipse: "Alt+Shift+S → v", idea: "Ctrl+O", vscode: "—" },
      { action: "生成 Getter/Setter", actionEn: "Generate Getter/Setter", eclipse: "Alt+Shift+S → r", idea: "Alt+Insert", vscode: "—" },
      { action: "生成构造方法", actionEn: "Generate Constructor", eclipse: "Alt+Shift+S → c", idea: "Alt+Insert → Constructor", vscode: "—" },
      { action: "补全当前语句", actionEn: "Complete Statement", eclipse: "—", idea: "Ctrl+Shift+Enter", vscode: "—" },
      { action: "Live Template / Snippet", actionEn: "Live Template / Snippet", eclipse: "Ctrl+Space", idea: "Ctrl+J", vscode: "Ctrl+Space" },
      { action: "Postfix 补全", actionEn: "Postfix Completion", eclipse: "—", idea: ".for / .if + Tab", vscode: ".for + Tab" },
    ],
  },
  {
    id: "debug",
    name: "调试",
    nameEn: "Debug",
    items: [
      { action: "切换断点", actionEn: "Toggle Breakpoint", eclipse: "Ctrl+Shift+B", idea: "Ctrl+F8", vscode: "F9" },
      { action: "开始调试", actionEn: "Start Debug", eclipse: "F11", idea: "Shift+F9", vscode: "F5" },
      { action: "步过 (Step Over)", actionEn: "Step Over", eclipse: "F6", idea: "F8", vscode: "F10" },
      { action: "步入 (Step Into)", actionEn: "Step Into", eclipse: "F5", idea: "F7", vscode: "F11" },
      { action: "强制步入", actionEn: "Force Step Into", eclipse: "—", idea: "Alt+Shift+F7", vscode: "—" },
      { action: "步出 (Step Out)", actionEn: "Step Out", eclipse: "F7", idea: "Shift+F8", vscode: "Shift+F11" },
      { action: "继续执行", actionEn: "Resume", eclipse: "F8", idea: "F9", vscode: "F5" },
      { action: "运行到光标处", actionEn: "Run to Cursor", eclipse: "Ctrl+R", idea: "Alt+F9", vscode: "—" },
      { action: "条件断点", actionEn: "Conditional Breakpoint", eclipse: "右键断点", idea: "Ctrl+Shift+F8", vscode: "右键断点" },
      { action: "计算表达式", actionEn: "Evaluate Expression", eclipse: "Ctrl+Shift+I", idea: "Alt+F8", vscode: "悬停查看" },
      { action: "停止调试", actionEn: "Stop Debug", eclipse: "Ctrl+F2", idea: "Ctrl+F2", vscode: "Shift+F5" },
      { action: "查看所有断点", actionEn: "View Breakpoints", eclipse: "—", idea: "Ctrl+Shift+F8", vscode: "Ctrl+Shift+F5" },
    ],
  },
  {
    id: "run",
    name: "运行",
    nameEn: "Run",
    items: [
      { action: "运行", actionEn: "Run", eclipse: "Ctrl+F11", idea: "Shift+F10", vscode: "F5" },
      { action: "运行当前文件/上下文", actionEn: "Run Current Context", eclipse: "Ctrl+F11", idea: "Ctrl+Shift+F10", vscode: "Ctrl+F5" },
      { action: "停止", actionEn: "Stop", eclipse: "Ctrl+F2", idea: "Ctrl+F2", vscode: "Shift+F5" },
      { action: "重新运行", actionEn: "Rerun", eclipse: "—", idea: "Ctrl+F5", vscode: "Ctrl+Shift+F5" },
    ],
  },
  {
    id: "view",
    name: "视图 & 界面",
    nameEn: "View & Layout",
    items: [
      { action: "打开终端", actionEn: "Open Terminal", eclipse: "—", idea: "Alt+F12", vscode: "Ctrl+`" },
      { action: "打开/关闭侧边栏", actionEn: "Toggle Sidebar", eclipse: "Ctrl+3", idea: "Alt+1 (项目)", vscode: "Ctrl+B" },
      { action: "最大化编辑器", actionEn: "Maximize Editor", eclipse: "Ctrl+M", idea: "Ctrl+Shift+F12", vscode: "Ctrl+K Z" },
      { action: "显示文件结构/大纲", actionEn: "File Structure / Outline", eclipse: "Ctrl+O", idea: "Ctrl+F12", vscode: "Ctrl+Shift+O" },
      { action: "显示错误列表", actionEn: "Problems Panel", eclipse: "—", idea: "—", vscode: "Ctrl+Shift+M" },
      { action: "分屏", actionEn: "Split Editor", eclipse: "—", idea: "—", vscode: "Ctrl+\\" },
      { action: "关闭当前标签页", actionEn: "Close Tab", eclipse: "Ctrl+W", idea: "Ctrl+F4", vscode: "Ctrl+W" },
      { action: "关闭所有标签页", actionEn: "Close All Tabs", eclipse: "Ctrl+Shift+W", idea: "Ctrl+Shift+F4", vscode: "Ctrl+K W" },
      { action: "切换标签页", actionEn: "Switch Tab", eclipse: "Ctrl+F6", idea: "Ctrl+Tab", vscode: "Ctrl+Tab" },
      { action: "放大字体", actionEn: "Zoom In", eclipse: "Ctrl++", idea: "Ctrl++ / 滚轮", vscode: "Ctrl+=" },
      { action: "缩小字体", actionEn: "Zoom Out", eclipse: "Ctrl+-", idea: "Ctrl+- / 滚轮", vscode: "Ctrl+-" },
    ],
  },
  {
    id: "vcs",
    name: "版本控制",
    nameEn: "Version Control",
    items: [
      { action: "提交", actionEn: "Commit", eclipse: "—", idea: "Ctrl+K", vscode: "Ctrl+Enter (SCM)" },
      { action: "拉取 (Pull/Update)", actionEn: "Pull / Update", eclipse: "—", idea: "Ctrl+T", vscode: "—" },
      { action: "推送 (Push)", actionEn: "Push", eclipse: "—", idea: "Ctrl+Shift+K", vscode: "—" },
      { action: "查看 Diff", actionEn: "Show Diff", eclipse: "—", idea: "Ctrl+D", vscode: "—" },
      { action: "还原文件更改", actionEn: "Revert Changes", eclipse: "—", idea: "Ctrl+Alt+Z", vscode: "—" },
      { action: "显示 Git 历史", actionEn: "Show History / Log", eclipse: "—", idea: "Alt+` → 4", vscode: "—" },
      { action: "打开 VCS 菜单", actionEn: "VCS Operations Menu", eclipse: "—", idea: "Alt+`", vscode: "—" },
    ],
  },
];

function formatKey(e: React.KeyboardEvent<HTMLInputElement>): string {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push("Ctrl");
  if (e.shiftKey) parts.push("Shift");
  if (e.altKey) parts.push("Alt");
  if (e.metaKey) parts.push("⌘");  // Mac Command key

  let key = e.key;
  if (key === " ") key = "Space";
  else if (key.startsWith("Arrow")) key = key.replace("Arrow", "");
  else if (key === "Escape") key = "Esc";
  else if (key.length === 1) key = key.toUpperCase();

  parts.push(key);
  return parts.join("+");
}

export default function IdeShortcuts() {
  const { lang } = useTranslation();
  const zh = lang !== "en";

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isShortcutMode, setIsShortcutMode] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const MODIFIER_KEYS = ["Control", "Shift", "Alt", "Meta"];
    const isModifierOnly = MODIFIER_KEYS.includes(e.key);
    const hasModifier = e.ctrlKey || e.altKey || e.metaKey;

    if (hasModifier && !isModifierOnly) {
      e.preventDefault();
      setSearch(formatKey(e));
      setIsShortcutMode(true);
    } else if (!isModifierOnly) {
      // Regular typing — exit shortcut mode
      if (isShortcutMode) {
        setIsShortcutMode(false);
        // Let the key through normally, but clear the shortcut first
        setSearch("");
      }
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    // In shortcut mode, split into parts and match any IDE column containing all parts
    const parts = isShortcutMode ? q.split("+").filter(Boolean) : [];

    const matchesShortcut = (shortcut: string) => {
      if (shortcut === "—") return false;
      const segs = shortcut.toLowerCase().split("+").map(s => s.trim());
      return parts.every(p => {
        // Mac ⌘ (Command) maps to Ctrl in Windows-based shortcut data
        if (p === "⌘") return segs.includes("ctrl");
        return segs.includes(p);
      });
    };

    return DATA.map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        if (activeCategory !== "all" && cat.id !== activeCategory) return false;
        if (!q) return true;
        if (isShortcutMode) {
          return matchesShortcut(item.eclipse) || matchesShortcut(item.idea) || matchesShortcut(item.vscode);
        }
        return (
          item.action.toLowerCase().includes(q) ||
          item.actionEn.toLowerCase().includes(q) ||
          item.eclipse.toLowerCase().includes(q) ||
          item.idea.toLowerCase().includes(q) ||
          item.vscode.toLowerCase().includes(q)
        );
      }),
    })).filter(cat => cat.items.length > 0);
  }, [search, activeCategory, isShortcutMode]);

  const totalCount = filtered.reduce((s, c) => s + c.items.length, 0);

  const clearSearch = () => {
    setSearch("");
    setIsShortcutMode(false);
  };

  return (
    <div className="space-y-4">
      {/* Search + Category filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          {isShortcutMode
            ? <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            : <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          }
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setIsShortcutMode(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder={zh ? "输入描述搜索，或直接按快捷键…" : "Type to search, or press a shortcut…"}
            className={`w-full pl-9 pr-9 py-2 text-sm rounded-lg border bg-muted/30 focus:outline-none focus:ring-2 transition-colors ${
              isShortcutMode
                ? "border-blue-500/60 focus:ring-blue-500/30 font-mono text-blue-600 dark:text-blue-400"
                : "border-border focus:ring-blue-500/30 focus:border-blue-500/50"
            }`}
          />
          {search && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {isShortcutMode && (
        <p className="text-xs text-muted-foreground">
          {zh
            ? "⌘ 键自动匹配 Ctrl 快捷键。Ctrl+T / Ctrl+W 等浏览器级快捷键无法被捕获，请直接输入描述搜索。"
            : "⌘ is matched as Ctrl. Browser shortcuts like Ctrl+T / Ctrl+W can't be captured — type a description instead."}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-muted/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {zh ? "全部" : "All"}
          </button>
          {DATA.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? "all" : cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {zh ? cat.name : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground font-mono">
        {zh ? `共 ${totalCount} 条快捷键` : `${totalCount} shortcuts`}
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          {zh ? "没有找到匹配的快捷键" : "No shortcuts found"}
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map(cat => (
            <div key={cat.id}>
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-blue-500 inline-block" />
                {zh ? cat.name : cat.nameEn}
              </h3>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground w-[30%]">
                        {zh ? "操作" : "Action"}
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-orange-600 dark:text-orange-400 w-[23%]">Eclipse</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-blue-600 dark:text-blue-400 w-[23%]">IntelliJ IDEA</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-emerald-600 dark:text-emerald-400 w-[24%]">VS Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.items.map((item, i) => (
                      <tr key={i} className={`border-b border-border/50 last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                        <td className="px-4 py-2.5 text-foreground font-medium">
                          {zh ? item.action : item.actionEn}
                        </td>
                        <td className="px-4 py-2.5">
                          <ShortcutBadge value={item.eclipse} color="orange" />
                        </td>
                        <td className="px-4 py-2.5">
                          <ShortcutBadge value={item.idea} color="blue" />
                        </td>
                        <td className="px-4 py-2.5">
                          <ShortcutBadge value={item.vscode} color="emerald" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground pt-2">
        {zh
          ? "* 以上快捷键均为 Windows 默认键位。Mac 用户通常将 Ctrl 替换为 ⌘，Alt 替换为 ⌥。"
          : "* All shortcuts are Windows defaults. Mac users typically replace Ctrl with ⌘ and Alt with ⌥."}
      </p>
    </div>
  );
}

function ShortcutBadge({ value, color }: { value: string; color: "orange" | "blue" | "emerald" }) {
  if (value === "—") {
    return <span className="text-muted-foreground/40 text-xs">—</span>;
  }

  const colorMap = {
    orange: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
    blue:   "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    emerald:"bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  };

  return (
    <code className={`inline-block px-2 py-0.5 rounded-md border text-xs font-mono ${colorMap[color]}`}>
      {value}
    </code>
  );
}
