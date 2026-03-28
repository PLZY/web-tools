"use client";

import TextFormatter from "@/components/tools/TextFormatter";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";

export default function TextFormatPage() {
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
    </div>
  );
}
