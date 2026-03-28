"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    <div className="border border-border bg-card rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-muted-foreground" />
        {t('faq.title')}
      </h3>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
