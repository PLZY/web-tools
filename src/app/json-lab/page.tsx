"use client";

import JsonLab from "@/components/tools/JsonLab";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { useTranslation } from "@/lib/i18n";

export default function JsonLabPage() {
  const { t } = useTranslation();

  const faqs = [
    { q: t('faq.json.q1'), a: t('faq.json.a1') },
    { q: t('faq.json.q2'), a: t('faq.json.a2') },
    { q: t('faq.json.q3'), a: t('faq.json.a3') },
    { q: t('faq.json.q4'), a: t('faq.json.a4') },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="h-[calc(100vh-120px)] min-h-[500px]">
        <JsonLab />
      </div>
      <ToolFAQ faqs={faqs} />
    </div>
  );
}
