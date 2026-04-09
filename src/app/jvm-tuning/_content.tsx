"use client";

import JvmTuning from "@/components/tools/JvmTuning";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";
import { Cpu } from "lucide-react";

export default function JvmTuningPageContent() {
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

      <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl py-8 px-6 space-y-6">
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Cpu className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            {t('seo.jvm.what')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.jvm.what.body')}</p>
        </div>
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4">{t('seo.jvm.howto')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.jvm.howto.body')}</p>
        </div>
      </section>
    </div>
  );
}
