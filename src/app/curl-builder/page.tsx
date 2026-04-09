import { Metadata } from 'next';
import CurlBuilderPageContent from './_content';

export const metadata: Metadata = {
  title: 'cURL Command Builder | cURL命令生成器 - DogUp DevTools',
  description: 'Build cURL commands visually with an interactive form. Set HTTP method, headers, request body, authentication, and generate ready-to-use curl commands. 可视化构建cURL命令，设置请求方法、请求头、请求体和认证信息，一键生成可执行命令。',
  keywords: ['cURL Builder', 'cURL Generator', 'cURL命令生成', 'cURL Command', 'HTTP Request Builder', 'API Testing', 'REST Client', 'cURL构建器', 'curl命令', 'HTTP请求构建'],
  openGraph: {
    title: 'cURL Command Builder | cURL命令生成器',
    description: 'Build cURL commands visually with method, headers, body, and auth settings.',
    url: 'https://dogupup.com/curl-builder',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "cURL Command Builder",
  "url": "https://dogupup.com/curl-builder",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function CurlBuilderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CurlBuilderPageContent />
    </>
  );
}
