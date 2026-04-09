import { Metadata } from 'next';
import MojibakePageContent from './_content';

export const metadata: Metadata = {
  title: 'Mojibake Fixer - Encoding Repair Tool | 乱码修复工具 - DogUp DevTools',
  description: 'Fix garbled text (mojibake) by detecting and converting character encodings. Supports UTF-8, GBK, GB2312, ISO-8859-1, Shift_JIS, EUC-KR and more. 修复乱码文本，自动检测并转换字符编码，支持UTF-8/GBK/GB2312/ISO-8859-1/Shift_JIS等。',
  keywords: ['Mojibake', '乱码修复', 'Encoding Fix', '字符编码', 'Garbled Text', 'UTF-8', 'GBK', 'GB2312', 'Character Encoding', '编码转换', 'Mojibake Fixer', 'Text Encoding Repair', '乱码恢复'],
  openGraph: {
    title: 'Mojibake Fixer - Encoding Repair Tool | 乱码修复工具',
    description: 'Fix garbled text by detecting and converting character encodings automatically.',
    url: 'https://dogupup.com/mojibake',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Mojibake Fixer - Encoding Repair Tool",
  "url": "https://dogupup.com/mojibake",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function MojibakePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MojibakePageContent />
    </>
  );
}
