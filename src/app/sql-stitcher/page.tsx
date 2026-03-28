"use client";

import SqlStitcher from "@/components/tools/SqlStitcher";
import { useTranslation } from "@/lib/i18n";

export default function SqlStitcherPage() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t('sqlStitcher.title')}</h1>
        <p className="text-muted-foreground text-lg font-medium">{t('sqlStitcher.desc')}</p>
      </div>
      <SqlStitcher />
    </div>
  );
}
