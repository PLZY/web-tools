"use client";

import JsonLab from "@/components/tools/JsonLab";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";
import { Braces } from "lucide-react";

export default function JsonLabPageContent() {
  const { t } = useTranslation();

  const faqs = [
    { q: t('faq.json.q1'), a: t('faq.json.a1') },
    { q: t('faq.json.q2'), a: t('faq.json.a2') },
    { q: t('faq.json.q3'), a: t('faq.json.a3') },
    { q: t('faq.json.q4'), a: t('faq.json.a4') },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('jsonLab.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('home.jsonLab.desc')}
        </p>
      </div>

      <div className="h-[calc(100vh-120px)] min-h-[500px]">
        <JsonLab />
      </div>

      <ToolFAQ faqs={faqs} />

      <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl py-8 px-6 space-y-6">
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Braces className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            {t('seo.json.what')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.json.what.body')}</p>
        </div>
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4">{t('seo.json.howto')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.json.howto.body')}</p>
        </div>
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4">{t('seo.json.usecases')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.json.usecases.body')}</p>
        </div>
      </section>
    </div>
  );
}
