"use client";

import TextDiff from "@/components/tools/TextDiff";
import { useTranslation } from "@/lib/i18n";
import { GitCompare } from "lucide-react";

export default function DiffPageContent() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t('diff.title')}</h1>
        <p className="text-muted-foreground text-lg font-medium">{t('diff.desc')}</p>
      </div>
      <TextDiff />

      <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl py-8 px-6">
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <GitCompare className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            {t('seo.diff.what')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.diff.what.body')}</p>
        </div>
      </section>
    </div>
  );
}
