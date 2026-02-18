"use client";

import CronTranslator from "@/components/tools/CronTranslator";
import { useTranslation } from "@/lib/i18n";

export default function CronPage() {
  const { t, lang } = useTranslation();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('cron.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('cron.desc')}
        </p>
      </div>

      <CronTranslator />

      <article className="prose dark:prose-invert max-w-none mt-12 border-t border-border pt-8 text-slate-900 dark:text-slate-200">
        <h2 className="text-2xl font-black mb-4">{t('cron.help.title')}</h2>
        
        <h3 className="text-xl font-bold mt-8 mb-4">{lang === 'zh' ? '标准字段含义' : 'Standard Field Meaning'}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border border rounded-lg">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left text-xs font-black uppercase">{lang === 'zh' ? '位置' : 'Pos'}</th>
                <th className="px-4 py-2 text-left text-xs font-black uppercase">{lang === 'zh' ? '字段' : 'Field'}</th>
                <th className="px-4 py-2 text-left text-xs font-black uppercase">{lang === 'zh' ? '允许值' : 'Values'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-sm">
              <tr><td className="px-4 py-2">1</td><td className="px-4 py-2">Minute</td><td className="px-4 py-2">0-59</td></tr>
              <tr><td className="px-4 py-2">2</td><td className="px-4 py-2">Hour</td><td className="px-4 py-2">0-23</td></tr>
              <tr><td className="px-4 py-2">3</td><td className="px-4 py-2">Day</td><td className="px-4 py-2">1-31</td></tr>
              <tr><td className="px-4 py-2">4</td><td className="px-4 py-2">Month</td><td className="px-4 py-2">1-12</td></tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
