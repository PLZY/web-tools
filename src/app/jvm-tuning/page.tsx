"use client";

import JvmTuning from "@/components/tools/JvmTuning";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";

export default function JvmTuningPage() {
  const { t } = useTranslation();

  const faqs = [
    { q: t('faq.jvm.q1'), a: t('faq.jvm.a1') },
    { q: t('faq.jvm.q2'), a: t('faq.jvm.a2') },
    { q: t('faq.jvm.q3'), a: t('faq.jvm.a3') },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('jvm.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('jvm.desc')}
        </p>
      </div>

      <JvmTuning />

      <ToolFAQ faqs={faqs} />
    </div>
  );
}
