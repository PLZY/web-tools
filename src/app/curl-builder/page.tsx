import { Metadata } from 'next';
import CurlBuilderPageContent from './_content';

export const metadata: Metadata = {
  title: 'cURL命令生成器 | cURL Command Builder - DogUp DevTools',
  description: '可视化构建cURL命令，设置请求方法、请求头、请求体和认证信息，一键生成可执行命令。Build cURL commands visually with an interactive form.',
  keywords: ['cURL Builder', 'cURL Generator', 'cURL命令生成', 'cURL Command', 'HTTP Request Builder', 'API Testing', 'REST Client', 'cURL构建器', 'curl命令', 'HTTP请求构建'],
  alternates: {
    canonical: 'https://dogupup.com/curl-builder',
    languages: {
      'zh-CN': 'https://dogupup.com/curl-builder',
      'en': 'https://dogupup.com/curl-builder',
    },
  },
  openGraph: {
    title: 'cURL命令生成器 | cURL Command Builder',
    description: '可视化构建cURL命令，设置请求方法、请求头、请求体和认证，一键生成。',
    url: 'https://dogupup.com/curl-builder',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "cURL Command Builder",
      "url": "https://dogupup.com/curl-builder",
      "description": "Build cURL commands visually with an interactive form. Set HTTP method, headers, request body, authentication, and generate ready-to-use curl commands.",
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
          "name": "What platforms are supported?",
          "acceptedAnswer": { "@type": "Answer", "text": "The tool generates correctly quoted commands for three targets: macOS/Linux (Bash), Windows CMD, and PowerShell. Each platform has different quoting and escaping rules, which the tool handles automatically." }
        },
        {
          "@type": "Question",
          "name": "Can I parse an existing cURL command?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Paste any cURL command into the parse input area and click Parse. The tool will extract the method, URL, headers, body, and options back into the form for editing." }
        },
        {
          "@type": "Question",
          "name": "Does this tool send actual HTTP requests?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. This tool only generates the cURL command text. It does not execute any network requests. You copy the generated command and run it in your own terminal." }
        }
      ]
    }
  ]
};

export default function CurlBuilderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CurlBuilderPageContent />
    </>
  );
}
