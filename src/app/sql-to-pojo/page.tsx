"use client";

import SqlToPojo from "@/components/tools/SqlToPojo";
import { useTranslation } from "@/lib/i18n";

export default function SqlToPojoPage() {
  const { t, lang } = useTranslation();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('sql.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('sql.desc')}
        </p>
      </div>

      <SqlToPojo />

      <article className="prose dark:prose-invert max-w-none mt-12 border-t border-border pt-8 text-slate-900 dark:text-slate-200">
        <h2 className="text-2xl font-black mb-4">{t('sql.help.title')}</h2>
        <p className="font-medium">
          {t('sql.help.content')}
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4">{t('sql.feature.title')}</h3>
        <ul className="list-disc pl-6 space-y-2 font-medium">
          <li>{t('sql.feature.multiDb')}</li>
          <li>{t('sql.feature.mapping')}</li>
          <li>{t('sql.feature.lombok')}</li>
        </ul>

        <h3 className="text-xl font-bold mt-8 mb-4">{t('sql.table.title')}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border border rounded-lg">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left text-xs font-black uppercase tracking-wider">SQL Type</th>
                <th className="px-4 py-2 text-left text-xs font-black uppercase tracking-wider">Java Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-sm">
              <tr><td className="px-4 py-2">VARCHAR, CHAR, TEXT</td><td className="px-4 py-2">String</td></tr>
              <tr><td className="px-4 py-2">INT, INTEGER</td><td className="px-4 py-2">Integer</td></tr>
              <tr><td className="px-4 py-2">BIGINT</td><td className="px-4 py-2">Long</td></tr>
              <tr><td className="px-4 py-2">DATETIME, TIMESTAMP</td><td className="px-4 py-2">LocalDateTime</td></tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
