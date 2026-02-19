"use client";

import CronTranslator from "@/components/tools/CronTranslator";
import { useTranslation } from "@/lib/i18n";

export default function CronPage() {
  const { t } = useTranslation();

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

      <article className="mt-12 space-y-8">
        <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50 flex items-center gap-2">
          <div className="w-2 h-8 bg-red-500 rounded-full"></div>
          {t('cron.article.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">{t('cron.article.h1')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('cron.article.p2')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">{t('cron.article.h2')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('cron.article.p3')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">{t('cron.article.h3')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('cron.article.p4')}
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 italic pt-4">
          {t('cron.article.footer')}
        </p>
      </article>
    </div>
  );
}
