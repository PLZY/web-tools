import { Metadata } from 'next';
import HourlyWagePageContent from './_content';

export const metadata: Metadata = {
  title: '时薪计算器 | Hourly Wage Calculator - DogUp DevTools',
  description: '计算真实时薪，包含加班、通勤时间和隐性成本，了解你工作时间的真正价值。Calculate your real hourly wage including overtime, commute time, and hidden costs.',
  keywords: ['Hourly Wage Calculator', '时薪计算器', 'Real Hourly Wage', '真实时薪', 'Salary Calculator', '工资计算器', 'Overtime Calculator', '加班费计算', 'Income Calculator', '收入计算'],
  alternates: {
    canonical: 'https://dogupup.com/hourly-wage',
    languages: {
      'zh-CN': 'https://dogupup.com/hourly-wage',
      'en': 'https://dogupup.com/hourly-wage',
    },
  },
  openGraph: {
    title: '时薪计算器 | Hourly Wage Calculator',
    description: '计算真实时薪，包含加班、通勤时间和隐性成本，了解你的时间真正值多少。',
    url: 'https://dogupup.com/hourly-wage',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Hourly Wage Calculator",
      "url": "https://dogupup.com/hourly-wage",
      "description": "Calculate your real hourly wage including overtime, commute time, and hidden costs. Understand the true value of your working time.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any (Web Browser)",
      "author": { "@type": "Organization", "name": "DogUp DevTools", "url": "https://dogupup.com" },
      "datePublished": "2025-01-01",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is real hourly wage?",
          "acceptedAnswer": { "@type": "Answer", "text": "Your pre-tax monthly salary divided by monthly hours is just a surface number. Real hourly wage accounts for income tax, social insurance, rent, commuting costs, and all extra spending that only exists because of your job — then divides by total hours away from home." }
        },
        {
          "@type": "Question",
          "name": "Why should I calculate real hourly wage?",
          "acceptedAnswer": { "@type": "Answer", "text": "When evaluating a job offer, considering a career change, or making purchase decisions, real hourly wage is a more honest metric than monthly salary. Knowing that a bubble tea costs you 45 minutes of real labor gives you a much clearer sense of value." }
        },
        {
          "@type": "Question",
          "name": "Is my salary data uploaded anywhere?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. All calculations happen in your browser — no data is uploaded to any server. Your financial information stays completely private." }
        }
      ]
    }
  ]
};

export default function HourlyWagePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HourlyWagePageContent />
    </>
  );
}
