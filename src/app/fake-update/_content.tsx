"use client";

import FakeUpdate from "@/components/tools/FakeUpdate";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";
import { Monitor } from "lucide-react";

export default function FakeUpdatePageContent() {
  const { t } = useTranslation();

  const faqs = [
    { q: t('faq.fakeUpdate.q1'), a: t('faq.fakeUpdate.a1') },
    { q: t('faq.fakeUpdate.q2'), a: t('faq.fakeUpdate.a2') },
    { q: t('faq.fakeUpdate.q3'), a: t('faq.fakeUpdate.a3') },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {t("fakeUpdate.page.title")}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t("fakeUpdate.page.desc")}
        </p>
      </div>

      <FakeUpdate />

      <ToolFAQ faqs={faqs} />

      <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl py-8 px-6">
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Monitor className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            {t('seo.fakeUpdate.what')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.fakeUpdate.what.body')}</p>
        </div>
      </section>
    </div>
  );
}
