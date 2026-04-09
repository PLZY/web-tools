import { Metadata } from 'next';
import TextFormatPageContent from './_content';

export const metadata: Metadata = {
  title: '文本格式化转换工具 | Text Formatter & Converter - DogUp DevTools',
  description: '文本大小写转换、Base64/URL编码解码、排序去重等多功能文本处理工具，完全在浏览器中运行。Transform text with case conversion, Base64/URL encoding, sorting, deduplication, and more.',
  keywords: ['Text Formatter', '文本格式化', 'Text Converter', '文本转换', 'Case Converter', '大小写转换', 'Base64 Encode', 'Base64编码', 'URL Encode', 'URL编码', 'Text Sort', '文本排序', 'Text Deduplicate', '文本去重'],
  alternates: {
    canonical: 'https://dogupup.com/text-format',
    languages: {
      'zh-CN': 'https://dogupup.com/text-format',
      'en': 'https://dogupup.com/text-format',
    },
  },
  openGraph: {
    title: '文本格式化转换工具 | Text Formatter & Converter',
    description: '大小写转换、编码解码、排序去重等多功能文本处理，完全在浏览器中运行。',
    url: 'https://dogupup.com/text-format',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Text Formatter & Converter",
      "url": "https://dogupup.com/text-format",
      "description": "Transform text with case conversion, Base64/URL encoding, sorting, deduplication, and more. All processing runs entirely in your browser.",
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
          "name": "What text formatting operations are supported?",
          "acceptedAnswer": { "@type": "Answer", "text": "Supports case conversion (UPPER, lower, Title Case), URL encode/decode, Base64 encode/decode, blank line removal, line sorting, line deduplication, and other common text processing operations." }
        },
        {
          "@type": "Question",
          "name": "Is my text data uploaded anywhere?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. All text processing runs locally in your browser. Your text content is never sent to any server, so you can safely process text containing sensitive information." }
        }
      ]
    }
  ]
};

export default function TextFormatPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TextFormatPageContent />
    </>
  );
}
