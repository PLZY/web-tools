import { Metadata } from 'next';
import JvmTuningPageContent from './_content';

export const metadata: Metadata = {
  title: 'JVM调优参数生成器 | JVM Tuning Parameter Generator - DogUp DevTools',
  description: '根据硬件配置生成JVM调优参数，包括GC推荐(G1GC/ZGC/Shenandoah)、内存设置和生产级启动参数。Generate optimized JVM startup parameters based on your hardware specs.',
  keywords: ['JVM Tuning', 'JVM调优', 'JVM Parameters', 'JVM参数', 'GC Tuning', 'GC调优', 'Java Memory', 'JVM Heap Size', 'G1GC', 'ZGC', 'Shenandoah', 'Java Performance', 'JVM启动参数'],
  alternates: {
    canonical: 'https://dogupup.com/jvm-tuning',
    languages: {
      'zh-CN': 'https://dogupup.com/jvm-tuning',
      'en': 'https://dogupup.com/jvm-tuning',
    },
  },
  openGraph: {
    title: 'JVM调优参数生成器 | JVM Tuning Parameter Generator',
    description: '根据硬件配置生成JVM调优参数，包括GC推荐、内存设置和生产级启动参数。',
    url: 'https://dogupup.com/jvm-tuning',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "JVM Tuning Parameter Generator",
      "url": "https://dogupup.com/jvm-tuning",
      "description": "Generate optimized JVM startup parameters based on your hardware specs. Get GC recommendations (G1GC, ZGC, Shenandoah), memory settings, and production-ready flags.",
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
          "name": "Can I copy these JVM parameters directly to production?",
          "acceptedAnswer": { "@type": "Answer", "text": "The generated parameters are based on industry best practices and your hardware specs, making them an excellent starting point. We recommend running a stress test in a staging environment before deploying to production." }
        },
        {
          "@type": "Question",
          "name": "How do I choose between G1 and ZGC?",
          "acceptedAnswer": { "@type": "Answer", "text": "For JDK 8 with heaps under 32GB, go with G1. For JDK 17+ with ultra-low latency requirements (e.g., trading systems), choose ZGC. ZGC guarantees STW pauses under 10ms regardless of heap size." }
        },
        {
          "@type": "Question",
          "name": "Why should -Xms and -Xmx be set to the same value?",
          "acceptedAnswer": { "@type": "Answer", "text": "This prevents performance jitter caused by the JVM dynamically resizing the heap at runtime. With a locked heap size, GC behavior becomes more predictable and stable." }
        }
      ]
    }
  ]
};

export default function JvmTuningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JvmTuningPageContent />
    </>
  );
}
