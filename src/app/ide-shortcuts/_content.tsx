"use client";

import IdeShortcuts from "@/components/tools/IdeShortcuts";
import { useTranslation } from "@/lib/i18n";
import { Keyboard } from "lucide-react";

export default function IdeShortcutsPageContent() {
  const { lang, t } = useTranslation();
  const zh = lang !== "en";

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {zh ? "IDE 快捷键对照" : "IDE Shortcuts Comparison"}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {zh
            ? "Eclipse / IntelliJ IDEA / VS Code 三大 IDE 快捷键横向对照，切换工具不再抓瞎。"
            : "Eclipse / IntelliJ IDEA / VS Code shortcuts side by side — switch IDEs without losing your muscle memory."}
        </p>
      </div>

      <IdeShortcuts />

      <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl py-8 px-6 space-y-6">
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Keyboard className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            {zh ? "为什么做这个工具？" : "Why this tool?"}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {zh
              ? "从 Eclipse 切换到 IntelliJ IDEA，或者从 IDEA 切换到 VS Code，最痛苦的不是学新功能，而是肌肉记忆中刻下的快捷键突然全部失效。重命名在 Eclipse 是 Alt+Shift+R，在 IDEA 是 Shift+F6，在 VS Code 是 F2；格式化在 Eclipse 是 Ctrl+Shift+F，在 IDEA 是 Ctrl+Alt+L，在 VS Code 是 Shift+Alt+F。这张对照表把三大主流 Java/前端 IDE 的核心快捷键并排列出，让你在切换工具时可以快速找到对应操作，而不是靠反复试错和查文档。所有数据均为 Windows 默认键位，Mac 用户将 Ctrl 替换为 ⌘、Alt 替换为 ⌥ 即可。"
              : "Switching from Eclipse to IntelliJ IDEA, or from IDEA to VS Code, the real pain isn't learning new features — it's your muscle memory suddenly becoming useless. Rename is Alt+Shift+R in Eclipse, Shift+F6 in IDEA, and F2 in VS Code. Format code is Ctrl+Shift+F in Eclipse, Ctrl+Alt+L in IDEA, and Shift+Alt+F in VS Code. This reference puts the core shortcuts for all three IDEs side by side, so you can find the equivalent action instantly when switching tools instead of trial-and-error. All shortcuts are Windows defaults; Mac users replace Ctrl with ⌘ and Alt with ⌥."}
          </p>
        </div>
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4">{t('seo.ideShortcuts.howto')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.ideShortcuts.howto.body')}</p>
        </div>
      </section>
    </div>
  );
}
