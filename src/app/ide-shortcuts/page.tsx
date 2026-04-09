import { Metadata } from 'next';
import IdeShortcutsPageContent from './_content';

export const metadata: Metadata = {
  title: 'IDE Shortcuts Comparison - Eclipse vs IntelliJ vs VS Code | IDE快捷键对照表 - DogUp DevTools',
  description: 'Compare keyboard shortcuts across Eclipse, IntelliJ IDEA, and VS Code side by side. Switch IDEs without losing muscle memory. Eclipse/IntelliJ IDEA/VS Code快捷键横向对比，切换IDE不再迷茫。',
  keywords: ['IDE Shortcuts', 'IDE快捷键', 'IntelliJ Shortcuts', 'IntelliJ快捷键', 'VS Code Shortcuts', 'VS Code快捷键', 'Eclipse Shortcuts', 'Eclipse快捷键', 'Keyboard Shortcuts Comparison', '快捷键对照表', 'IDE对比'],
  openGraph: {
    title: 'IDE Shortcuts Comparison | IDE快捷键对照表',
    description: 'Eclipse vs IntelliJ IDEA vs VS Code shortcuts side by side.',
    url: 'https://dogupup.com/ide-shortcuts',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "IDE Shortcuts Comparison",
  "url": "https://dogupup.com/ide-shortcuts",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function IdeShortcutsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <IdeShortcutsPageContent />
    </>
  );
}
