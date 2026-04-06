"use client";

import FakeUpdate from "@/components/tools/FakeUpdate";
import { useTranslation } from "@/lib/i18n";

export default function FakeUpdatePage() {
  const { t } = useTranslation();

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
    </div>
  );
}
