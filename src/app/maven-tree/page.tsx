"use client";

import MavenTree from "@/components/tools/MavenTree";
import { useTranslation } from "@/lib/i18n";

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

      {/* 硬核 SEO 与 知识科普区 */}
      <article className="prose dark:prose-invert max-w-none mt-12 border-t border-border pt-8 text-slate-900 dark:text-slate-200">
        <h2 className="text-2xl font-black mb-4">{t('maven.help.title')}</h2>
        <p className="font-medium">
          {t('maven.help.content')}
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4">{t('maven.how.title')}</h3>
        <p className="font-medium">
          {t('maven.how.content').split('\n\n')[0]}
        </p>
        <div className="relative group">
          <pre className="bg-slate-950 p-4 rounded-lg text-slate-300 border border-slate-800">
            <code>mvn dependency:tree</code>
          </pre>
        </div>
        <p className="mt-4 font-medium">
          {t('maven.how.content').split('\n\n')[1]?.split('\n')[0]}
        </p>
        <div className="relative group">
          <pre className="bg-slate-950 p-4 rounded-lg text-slate-300 border border-slate-800">
            <code>mvn dependency:tree -Dverbose</code>
          </pre>
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4">{t('maven.mechanism.title')}</h3>
        <p className="font-medium">
          {t('maven.mechanism.desc')}
        </p>
        <ol className="list-decimal pl-6 space-y-2 font-medium">
          <li>
            <strong>{t('maven.mechanism.nearest.title')}</strong>: {t('maven.mechanism.nearest.desc')}
          </li>
          <li>
            <strong>{t('maven.mechanism.first.title')}</strong>: {t('maven.mechanism.first.desc')}
          </li>
        </ol>

        <h3 className="text-xl font-bold mt-8 mb-4">{t('maven.resolve.title')}</h3>
        <p className="font-medium">
          {t('maven.resolve.desc')}
        </p>
        <ul className="list-disc pl-6 space-y-2 font-medium">
          <li>{t('maven.resolve.exclusion')}</li>
          <li>{t('maven.resolve.mgmt')}</li>
        </ul>
      </article>
    </div>
  );
}
