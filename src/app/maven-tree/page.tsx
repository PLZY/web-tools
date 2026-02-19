"use client";

import MavenTree from "@/components/tools/MavenTree";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function MavenTreePage() {
  const { t, lang } = useTranslation();

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* 头部标题区 */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('maven.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('maven.desc')}
        </p>
      </div>

      {/* 核心工具组件 */}
      <MavenTree />

      {/* 知识百科板块 - 1:1 还原 Cron 页风格 */}
      <article className="mt-12 space-y-12 pb-12">
        {/* 工具百科大模块 */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 space-y-12">
          <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50 flex items-center gap-2">
            <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
            {t('maven.card.guide.title')}
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* 子模块 A：状态名词百科 */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 px-1">
                <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                {t('maven.card.logic.title')}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: t('maven.card.logic.conflict.title'), tag: t('maven.stat.conflict'), content: t('maven.card.logic.conflict.content'), color: 'bg-red-500' },
                  { title: t('maven.card.logic.managed.title'), tag: t('maven.stat.managed'), content: t('maven.card.logic.managed.content'), color: 'bg-amber-500' },
                  { title: t('maven.card.logic.duplicate.title'), tag: t('maven.stat.duplicate'), content: t('maven.card.logic.duplicate.content'), color: 'bg-slate-400' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-sm transition-all group relative overflow-hidden flex flex-col gap-2">
                    <div className={cn("absolute left-0 top-0 bottom-0 w-1", item.color)}></div>
                    <div className="flex items-center gap-3">
                      <div className={cn("px-2 py-0.5 rounded text-[10px] font-black text-white uppercase tracking-wider", item.color)}>
                        {item.tag}
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.title}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pl-1">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 子模块 B：IDEA 执行引导 */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 px-1">
                <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                {t('maven.card.idea.title')}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { step: "STEP 1", title: t('maven.card.idea.step1'), sub: "IDEA Maven Sidebar" },
                  { step: "STEP 2", title: t('maven.card.idea.step2'), sub: "Execute Goal" },
                  { step: "STEP 3", title: t('maven.card.idea.step3'), sub: "mvn dependency:tree" },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-sm transition-all group relative overflow-hidden flex items-center gap-4">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/30"></div>
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-black text-xs">
                      {item.step}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 模块三：如何解决依赖冲突 */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50 flex items-center gap-2">
            <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
            {t('maven.strategy.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: t('maven.strategy.1.title'), content: t('maven.strategy.1.content') },
              { title: t('maven.strategy.2.title'), content: t('maven.strategy.2.content') },
              { title: t('maven.strategy.3.title'), content: t('maven.strategy.3.content') },
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 italic pt-4">
          "Keep your dependencies lean and your builds stable."
        </p>
      </article>
    </div>
  );
}
