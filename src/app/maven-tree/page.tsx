import { Metadata } from 'next';
import MavenTreePageContent from './_content';

export const metadata: Metadata = {
  title: 'Maven依赖树可视化分析 | Maven Dependency Tree Analyzer - DogUp DevTools',
  description: '可视化Maven依赖树，检测版本冲突，快速定位Jar Hell问题。粘贴mvn dependency:tree输出即可生成交互式图表。Visualize Maven dependency tree output, detect version conflicts and resolve Jar Hell.',
  keywords: ['Maven Dependency Tree', 'Maven依赖分析', 'Maven Dependency Conflict', 'Jar Hell', 'Maven依赖冲突', 'mvn dependency:tree', 'Maven依赖树可视化', 'Maven Dependency Visualization', 'Maven版本冲突'],
  alternates: {
    canonical: 'https://dogupup.com/maven-tree',
    languages: {
      'zh-CN': 'https://dogupup.com/maven-tree',
      'en': 'https://dogupup.com/maven-tree',
    },
  },
  openGraph: {
    title: 'Maven依赖树可视化分析 | Maven Dependency Tree Analyzer',
    description: '可视化Maven依赖树，检测版本冲突，快速定位Jar Hell问题。',
    url: 'https://dogupup.com/maven-tree',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Maven Dependency Tree Analyzer",
      "url": "https://dogupup.com/maven-tree",
      "description": "Visualize Maven dependency tree output, detect version conflicts and resolve Jar Hell. Paste mvn dependency:tree output for instant visual analysis.",
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
          "name": "How do I get the mvn dependency:tree output?",
          "acceptedAnswer": { "@type": "Answer", "text": "Run `mvn dependency:tree` in your project root, copy the full console output, and paste it into the input area. Adding `-Dverbose` is recommended to show conflict details." }
        },
        {
          "@type": "Question",
          "name": "Can the tool automatically detect dependency conflicts?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. The tool identifies dependencies marked with \"(omitted for conflict)\" or \"(managed from)\" in Maven's output and highlights conflicting nodes in red on the visualization chart." }
        },
        {
          "@type": "Question",
          "name": "Is my pasted data uploaded to a server?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. All dependency tree parsing and visualization rendering happen locally in your browser. Your project dependency information never leaves your machine." }
        }
      ]
    }
  ]
};

export default function MavenTreePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MavenTreePageContent />
    </>
  );
}
