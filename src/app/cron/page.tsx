import { Metadata } from 'next';
import CronPageContent from './_content';

export const metadata: Metadata = {
  title: 'Cron Expression Parser & Translator | Cron表达式解析器 - DogUp DevTools',
  description: 'Free online Cron expression parser supporting Spring, Quartz, and Linux crontab formats. Visualize execution timeline with natural language translation. 免费在线Cron表达式解析器，支持Spring/Quartz/Linux格式，可视化执行时间线与自然语言翻译。',
  keywords: ['Cron Expression', 'Cron Parser', 'Cron Translator', 'Cron表达式', 'Cron解析器', 'Cron翻译', 'Spring Cron', 'Quartz Cron', 'Linux Crontab', 'Cron Generator', 'Cron生成器', 'Crontab'],
  openGraph: {
    title: 'Cron Expression Parser & Translator | Cron表达式解析器',
    description: 'Parse, validate and translate Cron expressions with visual timeline. Supports Spring, Quartz, and Linux formats.',
    url: 'https://dogupup.com/cron',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Cron Expression Parser & Translator",
  "url": "https://dogupup.com/cron",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function CronPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CronPageContent />
    </>
  );
}
