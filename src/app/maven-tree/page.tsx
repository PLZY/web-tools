"use client";

import MavenTree from "@/components/tools/MavenTree";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";
import { GitBranch } from "lucide-react";

export default function MavenTreePage() {
  const { t } = useTranslation();

  const faqs = [
    { q: t('faq.maven.q1'), a: t('faq.maven.a1') },
    { q: t('faq.maven.q2'), a: t('faq.maven.a2') },
    { q: t('faq.maven.q3'), a: t('faq.maven.a3') },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('maven.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('maven.desc')}
        </p>
      </div>

      <MavenTree />

      <ToolFAQ faqs={faqs} />

      <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl py-8 px-6">
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <GitBranch className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            {t('seo.maven.what')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.maven.what.body')}</p>
        </div>
      </section>
    </div>
  );
}
