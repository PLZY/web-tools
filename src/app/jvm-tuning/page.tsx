"use client";

import JvmTuning from "@/components/tools/JvmTuning";
import { useTranslation } from "@/lib/i18n";

export default function JvmTuningPage() {
  const { t, lang } = useTranslation();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('jvm.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('jvm.desc')}
        </p>
      </div>

      <JvmTuning />

      <article className="prose dark:prose-invert max-w-none mt-12 border-t border-border pt-8 text-slate-900 dark:text-slate-200">
        <h2 className="text-2xl font-black mb-4">{t('jvm.help.title')}</h2>
        <p className="font-medium leading-relaxed">
          {t('jvm.help.content')}
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4">{t('jvm.feature.title')}</h3>
        <ul className="list-disc pl-6 space-y-2 font-medium">
          <li><strong>{t('jvm.feature.memory')}:</strong> -Xms = -Xmx.</li>
          <li><strong>{t('jvm.feature.gc')}:</strong> G1, ZGC, Parallel.</li>
          <li><strong>{t('jvm.feature.metaspace')}:</strong> MaxMetaspaceSize.</li>
        </ul>
      </article>
    </div>
  );
}
