import { Metadata } from 'next';
import DiffPageContent from './_content';

export const metadata: Metadata = {
  title: 'Text Diff Comparison Tool | 文本对比差异工具 - DogUp DevTools',
  description: 'Compare two texts side by side and highlight differences instantly. Supports inline and side-by-side diff views. All data stays in your browser — nothing is uploaded. 在线文本对比工具，支持并排和内联差异显示，数据完全不离开浏览器。',
  keywords: ['Text Diff', '文本对比', 'Diff Tool', '差异对比', 'Text Compare', 'Code Diff', '代码对比', 'File Diff', 'Online Diff', '在线对比工具', 'Side by Side Diff'],
  openGraph: {
    title: 'Text Diff Comparison Tool | 文本对比差异工具',
    description: 'Compare texts side by side with highlighted differences. Private and browser-only.',
    url: 'https://dogupup.com/diff',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Text Diff Comparison Tool",
  "url": "https://dogupup.com/diff",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function DiffPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DiffPageContent />
    </>
  );
}
