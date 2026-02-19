"use client";

import LogConfigGenerator from "@/components/tools/LogConfigGenerator";
import { useTranslation } from "@/lib/i18n";

export default function LogConfigPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('logback.help.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('logback.help.content')}
        </p>
      </div>

      {/* Main Tool */}
      <LogConfigGenerator />

      {/* Ecosystem Comparison */}
      <article className="space-y-8">
        <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50 flex items-center gap-2">
          <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
          {t('logback.compare.title')}
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-bold">{t('logback.compare.feature')}</th>
                <th className="px-6 py-4 font-bold">{t('logback.compare.logback')}</th>
                <th className="px-6 py-4 font-bold">{t('logback.compare.log4j2')}</th>
                <th className="px-6 py-4 font-bold">{t('logback.compare.slf4j')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{t('logback.compare.status')}</td>
                <td className="px-6 py-4">{t('logback.compare.status.logback')}</td>
                <td className="px-6 py-4">{t('logback.compare.status.log4j2')}</td>
                <td className="px-6 py-4">{t('logback.compare.status.slf4j')}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{t('logback.compare.async')}</td>
                <td className="px-6 py-4">{t('logback.compare.async.logback')}</td>
                <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">{t('logback.compare.async.log4j2')}</td>
                <td className="px-6 py-4">{t('logback.compare.async.slf4j')}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{t('logback.compare.flex')}</td>
                <td className="px-6 py-4">{t('logback.compare.flex.logback')}</td>
                <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">{t('logback.compare.flex.log4j2')}</td>
                <td className="px-6 py-4">{t('logback.compare.flex.slf4j')}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{t('logback.compare.reload')}</td>
                <td className="px-6 py-4">{t('logback.compare.reload.logback')}</td>
                <td className="px-6 py-4">{t('logback.compare.reload.log4j2')}</td>
                <td className="px-6 py-4">{t('logback.compare.reload.slf4j')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      {/* Encyclopedia Section */}
      <article className="space-y-8">
        <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50 flex items-center gap-2">
          <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
          {t('logback.guide.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-950 border-l-4 border-l-blue-500 border border-slate-200 dark:border-slate-800 p-6 rounded-r-2xl shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              {t('logback.guide.m1.t')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('logback.guide.m1.d')}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-950 border-l-4 border-l-indigo-500 border border-slate-200 dark:border-slate-800 p-6 rounded-r-2xl shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              {t('logback.guide.m2.t')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('logback.guide.m2.d')}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-950 border-l-4 border-l-emerald-500 border border-slate-200 dark:border-slate-800 p-6 rounded-r-2xl shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              {t('logback.guide.m3.t')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('logback.guide.m3.d')}
            </p>
          </div>
        </div>
      </article>

      {/* Production Considerations */}
      <article className="space-y-8">
        <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50 flex items-center gap-2">
          <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
          {t('logback.best.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">{t('logback.best.a.t')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
              {t('logback.best.a.d')}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">{t('logback.best.b.t')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
              {t('logback.best.b.d')}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">{t('logback.best.c.t')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
              {t('logback.best.c.d')}
            </p>
          </div>
        </div>
      </article>

      {/* Hardcore Parameter Comparison Table */}
      <article className="space-y-8">
        <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50 flex items-center gap-2">
          <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
          {t('logback.compare.table.title')}
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-bold">{t('logback.compare.table.param')}</th>
                <th className="px-6 py-4 font-bold">{t('logback.compare.table.logback')}</th>
                <th className="px-6 py-4 font-bold">{t('logback.compare.table.log4j2')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium">
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{t('logback.compare.table.p1')}</td>
                <td className="px-6 py-4">{t('logback.compare.table.p1.v1')}</td>
                <td className="px-6 py-4 text-orange-600 dark:text-orange-400">{t('logback.compare.table.p1.v2')}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{t('logback.compare.table.p2')}</td>
                <td className="px-6 py-4">{t('logback.compare.table.p2.v1')}</td>
                <td className="px-6 py-4">{t('logback.compare.table.p2.v2')}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{t('logback.compare.table.p3')}</td>
                <td className="px-6 py-4">{t('logback.compare.table.p3.v1')}</td>
                <td className="px-6 py-4">{t('logback.compare.table.p3.v2')}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{t('logback.compare.table.p4')}</td>
                <td className="px-6 py-4">{t('logback.compare.table.p4.v1')}</td>
                <td className="px-6 py-4">{t('logback.compare.table.p4.v2')}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{t('logback.compare.table.p5')}</td>
                <td className="px-6 py-4">{t('logback.compare.table.p5.v1')}</td>
                <td className="px-6 py-4">{t('logback.compare.table.p5.v2')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <footer className="text-center text-sm text-slate-400 italic pt-8 pb-4">
        "Keep it simple, keep it fast, and make it upward (dogupup)."
      </footer>
    </div>
  );
}
