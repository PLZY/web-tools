import { Metadata } from 'next';
import MojibakePageContent from './_content';

export const metadata: Metadata = {
  title: '乱码修复工具 | Mojibake Fixer - Encoding Repair Tool - DogUp DevTools',
  description: '修复乱码文本，自动检测并转换字符编码，支持UTF-8/GBK/GB2312/ISO-8859-1/Shift_JIS等。Fix garbled text (mojibake) by detecting and converting character encodings.',
  keywords: ['Mojibake', '乱码修复', 'Encoding Fix', '字符编码', 'Garbled Text', 'UTF-8', 'GBK', 'GB2312', 'Character Encoding', '编码转换', 'Mojibake Fixer', 'Text Encoding Repair', '乱码恢复'],
  alternates: {
    canonical: 'https://dogupup.com/mojibake',
    languages: {
      'zh-CN': 'https://dogupup.com/mojibake',
      'en': 'https://dogupup.com/mojibake',
    },
  },
  openGraph: {
    title: '乱码修复工具 | Mojibake Fixer',
    description: '自动检测并转换字符编码，修复乱码文本，支持多种编码格式。',
    url: 'https://dogupup.com/mojibake',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Mojibake Fixer - Encoding Repair Tool",
      "url": "https://dogupup.com/mojibake",
      "description": "Fix garbled text (mojibake) by detecting and converting character encodings. Supports UTF-8, GBK, GB2312, ISO-8859-1, Shift_JIS, EUC-KR and more.",
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
          "name": "How does garbled text (mojibake) happen?",
          "acceptedAnswer": { "@type": "Answer", "text": "Mojibake occurs when the correct byte sequence is interpreted with the wrong character set. Common causes: text from a GBK/GB18030 system decoded as UTF-8, a MySQL connection charset that doesn't match the storage charset, or incorrect Content-Type headers in HTTP responses." }
        },
        {
          "@type": "Question",
          "name": "Which encoding combinations does this tool try?",
          "acceptedAnswer": { "@type": "Answer", "text": "The tool exhaustively tries multiple encoding combinations (e.g., GBK→UTF-8, ISO-8859-1→UTF-8) and builds a full decoding matrix. Results containing recognizable Chinese/Japanese/Korean characters are highlighted in green." }
        },
        {
          "@type": "Question",
          "name": "Is my data uploaded anywhere?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. All encoding detection and conversion runs locally in your browser. Your text never leaves your machine." }
        }
      ]
    }
  ]
};

export default function MojibakePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MojibakePageContent />
    </>
  );
}
