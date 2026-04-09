import { Metadata } from 'next';
import DiffPageContent from './_content';

export const metadata: Metadata = {
  title: '文本对比差异工具 | Text Diff Comparison Tool - DogUp DevTools',
  description: '在线文本对比工具，支持并排和内联差异显示，数据完全不离开浏览器。Compare two texts side by side and highlight differences instantly.',
  keywords: ['Text Diff', '文本对比', 'Diff Tool', '差异对比', 'Text Compare', 'Code Diff', '代码对比', 'File Diff', 'Online Diff', '在线对比工具', 'Side by Side Diff'],
  alternates: {
    canonical: 'https://dogupup.com/diff',
    languages: {
      'zh-CN': 'https://dogupup.com/diff',
      'en': 'https://dogupup.com/diff',
    },
  },
  openGraph: {
    title: '文本对比差异工具 | Text Diff Comparison Tool',
    description: '在线对比两段文本的差异，高亮显示增删改内容，数据完全在浏览器中处理。',
    url: 'https://dogupup.com/diff',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Text Diff Comparison Tool",
      "url": "https://dogupup.com/diff",
      "description": "Compare two texts side by side and highlight differences instantly. Supports inline and side-by-side diff views.",
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
          "name": "When should I use text diff?",
          "acceptedAnswer": { "@type": "Answer", "text": "Text diff is useful for quickly spotting differences between two blocks of text. Common scenarios: comparing config file changes before a release, checking how API responses changed after a code update, reviewing edits to SQL scripts or documentation." }
        },
        {
          "@type": "Question",
          "name": "Is my data uploaded to any server?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. All comparisons run locally in your browser, making it safe to use with content containing passwords, connection strings, or API keys." }
        }
      ]
    }
  ]
};

export default function DiffPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DiffPageContent />
    </>
  );
}
