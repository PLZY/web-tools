"use client";

import LogConfigGenerator from "@/components/tools/LogConfigGenerator";
import { useTranslation } from "@/lib/i18n";

export default function LogConfigPage() {
  const { t, lang } = useTranslation();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('logback.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('logback.desc')}
        </p>
      </div>

      <LogConfigGenerator />

      <article className="prose dark:prose-invert max-w-none mt-12 border-t border-border pt-8 text-slate-900 dark:text-slate-200">
        <h2 className="text-2xl font-black mb-4">{t('logback.help.title')}</h2>
        <p className="font-medium leading-relaxed">
          {t('logback.help.content')}
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4">{lang === 'zh' ? '关键特性' : 'Key Features'}</h3>
        <ul className="list-disc pl-6 space-y-2 font-medium">
          <li><strong>{lang === 'zh' ? '异步日志' : 'Async Logging'}:</strong> AsyncAppender.</li>
          <li><strong>{lang === 'zh' ? '滚动策略' : 'Rolling Policy'}:</strong> SizeAndTimeBased.</li>
          <li><strong>{lang === 'zh' ? '彩色控制台' : 'Colorful Console'}:</strong> ANSI highlights.</li>
        </ul>
      </article>
    </div>
  );
}
