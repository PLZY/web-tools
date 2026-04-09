import { Metadata } from 'next';
import MavenTreePageContent from './_content';

export const metadata: Metadata = {
  title: 'Maven Dependency Tree Analyzer | Maven依赖树可视化分析 - DogUp DevTools',
  description: 'Visualize Maven dependency tree output, detect version conflicts and resolve Jar Hell. Paste mvn dependency:tree output for instant visual analysis. 可视化Maven依赖树，检测版本冲突，快速定位Jar Hell问题。',
  keywords: ['Maven Dependency Tree', 'Maven依赖分析', 'Maven Dependency Conflict', 'Jar Hell', 'Maven依赖冲突', 'mvn dependency:tree', 'Maven依赖树可视化', 'Maven Dependency Visualization', 'Maven版本冲突'],
  openGraph: {
    title: 'Maven Dependency Tree Analyzer | Maven依赖树可视化分析',
    description: 'Visualize mvn dependency:tree output, detect conflicts and resolve Jar Hell instantly.',
    url: 'https://dogupup.com/maven-tree',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Maven Dependency Tree Analyzer",
  "url": "https://dogupup.com/maven-tree",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function MavenTreePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MavenTreePageContent />
    </>
  );
}
