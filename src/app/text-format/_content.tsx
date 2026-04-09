"use client";

import TextFormatter from "@/components/tools/TextFormatter";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";
import { Type } from "lucide-react";

export default function TextFormatPageContent() {
  const { t } = useTranslation();

  const faqs = [
    { q: t('faq.textformat.q1'), a: t('faq.textformat.a1') },
    { q: t('faq.textformat.q2'), a: t('faq.textformat.a2') },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('textFormat.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('textFormat.desc')}
        </p>
      </div>

      <TextFormatter />

      <ToolFAQ faqs={faqs} />

      <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl py-8 px-6">
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Type className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            {t('seo.textformat.what')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.textformat.what.body')}</p>
        </div>
      </section>
    </div>
  );
}
