"use client";

import LogConfigGenerator from "@/components/tools/LogConfigGenerator";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";
import { FileText } from "lucide-react";

export default function LogConfigPageContent() {
  const { t } = useTranslation();

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

      <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl py-8 px-6">
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            {t('seo.logconfig.what')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.logconfig.what.body')}</p>
        </div>
      </section>
    </div>
  );
}
