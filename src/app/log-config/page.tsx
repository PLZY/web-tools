import { Metadata } from 'next';
import LogConfigPageContent from './_content';

export const metadata: Metadata = {
  title: 'Log Config Generator - Logback & Log4j2 | 日志配置生成器 - DogUp DevTools',
  description: 'Generate production-ready Logback and Log4j2 XML configurations with interactive form. Customize appenders, rolling policies, log levels, and async logging. 一键生成Logback/Log4j2 XML配置，自定义Appender、滚动策略、日志级别和异步日志。',
  keywords: ['Logback Config', 'Logback配置', 'Log4j2 Config', 'Log4j2配置', 'Log Config Generator', '日志配置生成器', 'Logback XML', 'Log4j2 XML', 'Rolling Policy', 'Appender', 'Java Logging', 'SLF4J'],
  openGraph: {
    title: 'Log Config Generator - Logback & Log4j2 | 日志配置生成器',
    description: 'Generate Logback and Log4j2 XML configurations with interactive form builder.',
    url: 'https://dogupup.com/log-config',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Log Config Generator - Logback & Log4j2",
  "url": "https://dogupup.com/log-config",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function LogConfigPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LogConfigPageContent />
    </>
  );
}
