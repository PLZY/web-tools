"use client";

import TextDiff from "@/components/tools/TextDiff";
import { useTranslation } from "@/lib/i18n";

export default function DiffPage() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t('diff.title')}</h1>
        <p className="text-muted-foreground text-lg font-medium">{t('diff.desc')}</p>
      </div>
      <TextDiff />
    </div>
  );
}
