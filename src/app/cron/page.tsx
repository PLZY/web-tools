"use client";

import CronTranslator from "@/components/tools/CronTranslator";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";

export default function CronPage() {
  const { t, lang } = useTranslation();

  const faqs = [
    { q: t('faq.cron.q1'), a: t('faq.cron.a1') },
    { q: t('faq.cron.q2'), a: t('faq.cron.a2') },
    { q: t('faq.cron.q3'), a: t('faq.cron.a3') },
    { q: t('faq.cron.q4'), a: t('faq.cron.a4') },
  ];

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

      <ToolFAQ faqs={faqs} />

      <div className="flex justify-center pb-4">
        <Link href="/guides/understanding-cron-expressions" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">
          {lang === 'zh' ? '阅读彻底搞懂 Cron 表达式指南 →' : 'Read Understanding Cron Expressions Guide →'}
        </Link>
      </div>
    </div>
  );
}
