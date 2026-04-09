import { Metadata } from 'next';
import JsonLabPageContent from './_content';

export const metadata: Metadata = {
  title: 'JSON格式化验证工具 | JSON Formatter & Validator - DogUp DevTools',
  description: '在线JSON格式化、验证、代码生成工具，支持容错解析(JSON5/JSONC)和多语言代码生成。Format, validate, and explore JSON structures online with lenient parsing, code generation, path extraction, and tree view.',
  keywords: ['JSON Formatter', 'JSON Validator', 'JSON Parser', 'JSON格式化', 'JSON验证', 'JSON解析', 'JSON5', 'JSONC', 'JSON Code Generator', 'JSON Path', 'JSON Tree View', 'JSON在线工具', 'JSON Beautifier'],
  alternates: {
    canonical: 'https://dogupup.com/json-lab',
    languages: {
      'zh-CN': 'https://dogupup.com/json-lab',
      'en': 'https://dogupup.com/json-lab',
    },
  },
  openGraph: {
    title: 'JSON格式化验证工具 | JSON Formatter & Validator',
    description: '在线JSON格式化、验证和代码生成，支持容错解析、树形视图和多语言代码生成。',
    url: 'https://dogupup.com/json-lab',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "JSON Formatter & Validator",
      "url": "https://dogupup.com/json-lab",
      "description": "Format, validate, and explore JSON structures online. Supports lenient parsing (JSON5, JSONC), multi-language code generation, path extraction, and tree view.",
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
          "name": "Why does my JSON fail to parse?",
          "acceptedAnswer": { "@type": "Answer", "text": "Common causes include: keys not wrapped in double quotes, trailing commas, single quotes instead of double quotes, or comments (standard JSON doesn't support comments). Our tool supports lenient mode (JSON5) which can auto-fix some of these issues." }
        },
        {
          "@type": "Question",
          "name": "Does DogUp upload my JSON data to a server?",
          "acceptedAnswer": { "@type": "Answer", "text": "Absolutely not. All JSON parsing, formatting, and code generation happen locally in your browser (client-side JavaScript). Your data never leaves your computer." }
        },
        {
          "@type": "Question",
          "name": "How large of a JSON file can this handle?",
          "acceptedAnswer": { "@type": "Answer", "text": "It depends on your browser's available memory, but typically handles files up to 10MB with ease. For very large files (>50MB), consider using backend streaming tools like Jackson Streaming API." }
        },
        {
          "@type": "Question",
          "name": "Is the JSON to POJO / TypeScript code generation accurate?",
          "acceptedAnswer": { "@type": "Answer", "text": "We recursively analyze your JSON structure to infer types. For simple to moderately complex JSON, the generated code is ready to use. Nested arrays or mixed-type scenarios may require minor manual adjustments." }
        }
      ]
    }
  ]
};

export default function JsonLabPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JsonLabPageContent />
    </>
  );
}
