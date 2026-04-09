import { Metadata } from 'next';
import IdeShortcutsPageContent from './_content';

export const metadata: Metadata = {
  title: 'IDE快捷键对照表 - Eclipse vs IntelliJ vs VS Code | IDE Shortcuts Comparison - DogUp DevTools',
  description: 'Eclipse/IntelliJ IDEA/VS Code快捷键横向对比，切换IDE不再迷茫。Compare keyboard shortcuts across Eclipse, IntelliJ IDEA, and VS Code side by side.',
  keywords: ['IDE Shortcuts', 'IDE快捷键', 'IntelliJ Shortcuts', 'IntelliJ快捷键', 'VS Code Shortcuts', 'VS Code快捷键', 'Eclipse Shortcuts', 'Eclipse快捷键', 'Keyboard Shortcuts Comparison', '快捷键对照表', 'IDE对比'],
  alternates: {
    canonical: 'https://dogupup.com/ide-shortcuts',
    languages: {
      'zh-CN': 'https://dogupup.com/ide-shortcuts',
      'en': 'https://dogupup.com/ide-shortcuts',
    },
  },
  openGraph: {
    title: 'IDE快捷键对照表 | IDE Shortcuts Comparison',
    description: 'Eclipse/IntelliJ IDEA/VS Code快捷键横向对比，切换IDE不再迷茫。',
    url: 'https://dogupup.com/ide-shortcuts',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "IDE Shortcuts Comparison",
      "url": "https://dogupup.com/ide-shortcuts",
      "description": "Compare keyboard shortcuts across Eclipse, IntelliJ IDEA, and VS Code side by side. Switch IDEs without losing muscle memory.",
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
          "name": "Which IDEs are compared?",
          "acceptedAnswer": { "@type": "Answer", "text": "This tool provides side-by-side comparison of keyboard shortcuts for three major IDEs: Eclipse, IntelliJ IDEA, and Visual Studio Code. Shortcuts are grouped by category (navigation, editing, refactoring, etc.) for easy reference." }
        },
        {
          "@type": "Question",
          "name": "Does this tool support macOS and Windows shortcuts?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. The comparison table covers both macOS and Windows/Linux key bindings for each IDE, so you can quickly find the equivalent shortcut on your platform." }
        }
      ]
    }
  ]
};

export default function IdeShortcutsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <IdeShortcutsPageContent />
    </>
  );
}
