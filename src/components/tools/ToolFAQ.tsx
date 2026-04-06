"use client";

import { HelpCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface FAQItem {
  q: string;
  a: string;
}

interface ToolFAQProps {
  faqs: FAQItem[];
}

export function ToolFAQ({ faqs }: ToolFAQProps) {
  const { t } = useTranslation();

  if (faqs.length === 0) return null;

  return (
    <section className="bg-muted/50 dark:bg-muted/20 rounded-2xl py-8 px-6">
      <h2 className="text-xl font-bold mb-6">{t('faq.title')}</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
            <h3 className="text-base font-bold mb-3 flex items-center">
              <HelpCircle className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              {faq.q}
            </h3>
            <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
