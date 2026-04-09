"use client";

import Mojibake from "@/components/tools/Mojibake";
import { useTranslation } from "@/lib/i18n";
import { FlaskConical } from "lucide-react";

export default function MojibakePageContent() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t('mojibake.title')}</h1>
        <p className="text-muted-foreground text-lg font-medium">{t('mojibake.desc')}</p>
      </div>
      <Mojibake />

      <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl py-8 px-6 space-y-6">
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FlaskConical className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            {t('seo.mojibake.what')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.mojibake.what.body')}</p>
        </div>
        <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
          <h2 className="text-xl font-bold mb-4">{t('seo.mojibake.howto')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('seo.mojibake.howto.body')}</p>
        </div>
      </section>
    </div>
  );
}
