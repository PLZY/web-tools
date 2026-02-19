"use client";

import JsonLab from "@/components/tools/JsonLab";
import { useTranslation } from "@/lib/i18n";

export default function JsonLabPage() {
  const { t, lang } = useTranslation();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t("jsonLab.title")}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t("jsonLab.desc")}
        </p>
      </div>

      <JsonLab />

    </div>
  );
}
