"use client";

import HourlyWage from "@/components/tools/HourlyWage";
import { useTranslation } from "@/lib/i18n";

export default function HourlyWagePageContent() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {t("hourlyWage.page.title")}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t("hourlyWage.page.desc")}
        </p>
      </div>

      {/* Intro — what this calculates and why */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4 text-sm text-muted-foreground">
        <div>
          <h2 className="text-base font-bold text-foreground mb-1">{t("hourlyWage.seo.whatIs")}</h2>
          <p className="leading-relaxed">{t("hourlyWage.seo.whatIs.body")}</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground mb-1">{t("hourlyWage.seo.formula")}</h2>
          <p className="font-mono text-xs bg-muted/60 rounded-lg px-4 py-3 leading-relaxed">
            {t("hourlyWage.seo.formula.body")}
          </p>
        </div>
      </div>

      <HourlyWage />

      {/* SEO Content */}
      <div className="mt-16 space-y-6 text-sm text-muted-foreground border-t border-border pt-10">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-2">{t("hourlyWage.seo.why")}</h2>
          <p className="leading-relaxed">{t("hourlyWage.seo.why.body")}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground mb-2">{t("seo.hourlyWage.howto")}</h2>
          <p className="leading-relaxed">{t("seo.hourlyWage.howto.body")}</p>
        </div>
      </div>
    </div>
  );
}
