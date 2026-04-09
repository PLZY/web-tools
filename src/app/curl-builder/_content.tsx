"use client";

import CurlBuilder from "@/components/tools/CurlBuilder";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";
import { Terminal } from "lucide-react";

export default function CurlBuilderPageContent() {
  const { t } = useTranslation();

  const faqs = [
    { q: t('faq.curl.q1'), a: t('faq.curl.a1') },
    { q: t('faq.curl.q2'), a: t('faq.curl.a2') },
    { q: t('faq.curl.q3'), a: t('faq.curl.a3') },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {t('curl.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('curl.desc')}
        </p>
      </div>

      <CurlBuilder />

      <ToolFAQ faqs={faqs} />

      <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl py-8 px-6 space-y-6">
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Terminal className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            {t('seo.curl.what')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.curl.what.body')}</p>
        </div>
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4">{t('seo.curl.howto')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.curl.howto.body')}</p>
        </div>
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4">{t('seo.curl.usecases')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.curl.usecases.body')}</p>
        </div>
      </section>
    </div>
  );
}
