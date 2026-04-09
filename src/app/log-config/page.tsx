import { Metadata } from 'next';
import LogConfigPageContent from './_content';

export const metadata: Metadata = {
  title: '日志配置生成器 - Logback & Log4j2 | Log Config Generator - DogUp DevTools',
  description: '一键生成Logback/Log4j2 XML配置，自定义Appender、滚动策略、日志级别和异步日志。Generate production-ready Logback and Log4j2 XML configurations with interactive form.',
  keywords: ['Logback Config', 'Logback配置', 'Log4j2 Config', 'Log4j2配置', 'Log Config Generator', '日志配置生成器', 'Logback XML', 'Log4j2 XML', 'Rolling Policy', 'Appender', 'Java Logging', 'SLF4J'],
  alternates: {
    canonical: 'https://dogupup.com/log-config',
    languages: {
      'zh-CN': 'https://dogupup.com/log-config',
      'en': 'https://dogupup.com/log-config',
    },
  },
  openGraph: {
    title: '日志配置生成器 | Log Config Generator - Logback & Log4j2',
    description: '一键生成Logback/Log4j2 XML配置，自定义Appender、滚动策略和异步日志。',
    url: 'https://dogupup.com/log-config',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Log Config Generator - Logback & Log4j2",
      "url": "https://dogupup.com/log-config",
      "description": "Generate production-ready Logback and Log4j2 XML configurations with interactive form. Customize appenders, rolling policies, log levels, and async logging.",
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
          "name": "Can I use the generated config directly in production?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. The generated XML config includes production-grade best practices: log rotation (by day + by size), total size cap, async logging, and more. You only need to adjust the actual file path and project name." }
        },
        {
          "@type": "Question",
          "name": "Should I choose Logback or Log4j2?",
          "acceptedAnswer": { "@type": "Answer", "text": "Spring Boot uses Logback by default, which is good enough for most scenarios. If you need extreme logging throughput (tens of thousands of log entries per second), switch to Log4j2 — it uses the LMAX Disruptor lock-free queue and can be up to 10x faster than Logback." }
        },
        {
          "@type": "Question",
          "name": "Is my configuration data uploaded?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. All config generation happens entirely in the browser. Your project name, paths, and other details are never sent to any server." }
        }
      ]
    }
  ]
};

export default function LogConfigPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LogConfigPageContent />
    </>
  );
}
