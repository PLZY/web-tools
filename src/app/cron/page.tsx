import { Metadata } from 'next';
import CronPageContent from './_content';

export const metadata: Metadata = {
  title: 'Cron表达式解析器 | Cron Expression Parser & Translator - DogUp DevTools',
  description: '免费在线Cron表达式解析器，支持Spring/Quartz/Linux格式，可视化执行时间线与自然语言翻译。Free online Cron expression parser supporting Spring, Quartz, and Linux crontab formats.',
  keywords: ['Cron Expression', 'Cron Parser', 'Cron Translator', 'Cron表达式', 'Cron解析器', 'Cron翻译', 'Spring Cron', 'Quartz Cron', 'Linux Crontab', 'Cron Generator', 'Cron生成器', 'Crontab'],
  alternates: {
    canonical: 'https://dogupup.com/cron',
    languages: {
      'zh-CN': 'https://dogupup.com/cron',
      'en': 'https://dogupup.com/cron',
    },
  },
  openGraph: {
    title: 'Cron表达式解析器 | Cron Expression Parser & Translator',
    description: '解析、验证和翻译Cron表达式，可视化执行时间线，支持Spring/Quartz/Linux格式。',
    url: 'https://dogupup.com/cron',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Cron Expression Parser & Translator",
      "url": "https://dogupup.com/cron",
      "description": "Free online Cron expression parser supporting Spring, Quartz, and Linux crontab formats. Visualize execution timeline with natural language translation.",
      "applicationCategory": "DeveloperApplication",
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
          "name": "What's the difference between Linux Cron and Java/Spring Cron?",
          "acceptedAnswer": { "@type": "Answer", "text": "Linux Cron uses 5 fields (minute, hour, day, month, weekday) with minute-level precision. Java/Spring/Quartz Cron uses 6 fields (second, minute, hour, day, month, weekday) with second-level precision and introduces special characters like ? and L." }
        },
        {
          "@type": "Question",
          "name": "Why does my Cron expression throw an error in Spring?",
          "acceptedAnswer": { "@type": "Answer", "text": "The most common cause is a conflict between the \"day\" and \"weekday\" fields. In Spring/Quartz, when you specify a value for the \"day\" field, the \"weekday\" field must be ? (ignored), and vice versa." }
        },
        {
          "@type": "Question",
          "name": "Which Cron variants does this tool support?",
          "acceptedAnswer": { "@type": "Answer", "text": "We support 4 major ecosystems: Linux/Python/Go/PHP (standard 5-field), Java/Spring/Quartz/XXL-JOB (6-field), .NET/Hangfire (6-field), and Node.js/Jenkins (5-6 field)." }
        },
        {
          "@type": "Question",
          "name": "Is my data uploaded anywhere?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. Cron expression parsing runs entirely in your browser with zero network requests." }
        }
      ]
    }
  ]
};

export default function CronPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CronPageContent />
    </>
  );
}
