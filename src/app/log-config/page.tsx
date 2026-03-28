"use client";

import LogConfigGenerator from "@/components/tools/LogConfigGenerator";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";

export default function LogConfigPage() {
  const { t, lang } = useTranslation();

  const faqs = [
    { q: t('faq.logconfig.q1'), a: t('faq.logconfig.a1') },
    { q: t('faq.logconfig.q2'), a: t('faq.logconfig.a2') },
    { q: t('faq.logconfig.q3'), a: t('faq.logconfig.a3') },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('logback.help.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('logback.help.content')}
        </p>
      </div>

      <LogConfigGenerator />

      <ToolFAQ faqs={faqs} />

      <div className="flex justify-center pb-4">
        <Link href="/guides/production-ready-log-configuration" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">
          {lang === 'zh' ? '阅读 Logback/Log4j2 生产级最佳配置指南 →' : 'Read Production-Ready Logging Guide →'}
        </Link>
      </div>
    </div>
  );
}
