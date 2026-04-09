import { Metadata } from 'next';
import TextFormatPageContent from './_content';

export const metadata: Metadata = {
  title: 'Text Formatter & Converter | 文本格式化转换工具 - DogUp DevTools',
  description: 'Transform text with case conversion, Base64/URL encoding, sorting, deduplication, and more. All processing runs entirely in your browser with zero data upload. 文本大小写转换、Base64/URL编码解码、排序去重等多功能文本处理工具，完全在浏览器中运行。',
  keywords: ['Text Formatter', '文本格式化', 'Text Converter', '文本转换', 'Case Converter', '大小写转换', 'Base64 Encode', 'Base64编码', 'URL Encode', 'URL编码', 'Text Sort', '文本排序', 'Text Deduplicate', '文本去重'],
  openGraph: {
    title: 'Text Formatter & Converter | 文本格式化转换工具',
    description: 'Case conversion, encoding/decoding, sorting, deduplication and more. All in browser.',
    url: 'https://dogupup.com/text-format',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Text Formatter & Converter",
  "url": "https://dogupup.com/text-format",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function TextFormatPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TextFormatPageContent />
    </>
  );
}
