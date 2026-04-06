"use client";

import CronTranslator from "@/components/tools/CronTranslator";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";
import { Clock } from "lucide-react";

export default function CronPage() {
  const { t } = useTranslation();

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

      <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl py-8 px-6">
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            {t('seo.cron.what')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.cron.what.body')}</p>
        </div>
      </section>
    </div>
  );
}
