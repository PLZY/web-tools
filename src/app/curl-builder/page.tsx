"use client";

import CurlBuilder from "@/components/tools/CurlBuilder";
import { useTranslation } from "@/lib/i18n";

export default function CurlBuilderPage() {
  const { t } = useTranslation();

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
    </div>
  );
}
