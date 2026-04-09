import { Metadata } from 'next';
import JvmTuningPageContent from './_content';

export const metadata: Metadata = {
  title: 'JVM Tuning Parameter Generator | JVM调优参数生成器 - DogUp DevTools',
  description: 'Generate optimized JVM startup parameters based on your hardware specs. Get GC recommendations (G1GC, ZGC, Shenandoah), memory settings, and production-ready flags. 根据硬件配置生成JVM调优参数，包括GC推荐、内存设置和生产级启动参数。',
  keywords: ['JVM Tuning', 'JVM调优', 'JVM Parameters', 'JVM参数', 'GC Tuning', 'GC调优', 'Java Memory', 'JVM Heap Size', 'G1GC', 'ZGC', 'Shenandoah', 'Java Performance', 'JVM启动参数'],
  openGraph: {
    title: 'JVM Tuning Parameter Generator | JVM调优参数生成器',
    description: 'Generate optimized JVM parameters with GC recommendations based on your hardware.',
    url: 'https://dogupup.com/jvm-tuning',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "JVM Tuning Parameter Generator",
  "url": "https://dogupup.com/jvm-tuning",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function JvmTuningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JvmTuningPageContent />
    </>
  );
}
