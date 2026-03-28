"use client";

import MavenTree from "@/components/tools/MavenTree";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";

export default function MavenTreePage() {
  const { t, lang } = useTranslation();

  const faqs = [
    { q: t('faq.maven.q1'), a: t('faq.maven.a1') },
    { q: t('faq.maven.q2'), a: t('faq.maven.a2') },
    { q: t('faq.maven.q3'), a: t('faq.maven.a3') },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('maven.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('maven.desc')}
        </p>
      </div>

      <MavenTree />

      <ToolFAQ faqs={faqs} />

      <div className="flex justify-center pb-4">
        <Link href="/guides/maven-dependency-conflict-resolution" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">
          {lang === 'zh' ? '阅读 Maven 依赖冲突排查指南 →' : 'Read Maven Conflict Resolution Guide →'}
        </Link>
      </div>
    </div>
  );
}
