import { Metadata } from 'next';
import HourlyWagePageContent from './_content';

export const metadata: Metadata = {
  title: 'Hourly Wage Calculator | 时薪计算器 - DogUp DevTools',
  description: 'Calculate your real hourly wage including overtime, commute time, and hidden costs. Understand the true value of your working time. 计算真实时薪，包含加班、通勤时间和隐性成本，了解你工作时间的真正价值。',
  keywords: ['Hourly Wage Calculator', '时薪计算器', 'Real Hourly Wage', '真实时薪', 'Salary Calculator', '工资计算器', 'Overtime Calculator', '加班费计算', 'Income Calculator', '收入计算'],
  openGraph: {
    title: 'Hourly Wage Calculator | 时薪计算器',
    description: 'Calculate your real hourly wage including overtime, commute, and hidden costs.',
    url: 'https://dogupup.com/hourly-wage',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Hourly Wage Calculator",
  "url": "https://dogupup.com/hourly-wage",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function HourlyWagePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HourlyWagePageContent />
    </>
  );
}
