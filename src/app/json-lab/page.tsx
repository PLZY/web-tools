import { Metadata } from 'next';
import JsonLabPageContent from './_content';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator | JSON格式化验证工具 - DogUp DevTools',
  description: 'Format, validate, and explore JSON structures online. Supports lenient parsing (JSON5, JSONC), multi-language code generation, path extraction, and tree view. 在线JSON格式化、验证、代码生成工具，支持容错解析(JSON5/JSONC)和多语言代码生成。',
  keywords: ['JSON Formatter', 'JSON Validator', 'JSON Parser', 'JSON格式化', 'JSON验证', 'JSON解析', 'JSON5', 'JSONC', 'JSON Code Generator', 'JSON Path', 'JSON Tree View', 'JSON在线工具', 'JSON Beautifier'],
  openGraph: {
    title: 'JSON Formatter & Validator | JSON格式化验证工具',
    description: 'Format, validate, and explore JSON with lenient parsing, code generation, and tree view.',
    url: 'https://dogupup.com/json-lab',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "JSON Formatter & Validator",
  "url": "https://dogupup.com/json-lab",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function JsonLabPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JsonLabPageContent />
    </>
  );
}
