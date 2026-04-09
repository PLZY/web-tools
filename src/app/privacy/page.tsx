import { Metadata } from 'next';
import PrivacyPageContent from './_content';

export const metadata: Metadata = {
  title: '隐私政策 | Privacy Policy - DogUp DevTools',
  description: 'DogUp DevTools隐私政策，了解我们如何通过无状态客户端处理保护您的数据，不存储不上传。Learn how we protect your data with stateless, client-side processing.',
  alternates: {
    canonical: 'https://dogupup.com/privacy',
    languages: {
      'zh-CN': 'https://dogupup.com/privacy',
      'en': 'https://dogupup.com/privacy',
    },
  },
  openGraph: {
    title: '隐私政策 | Privacy Policy - DogUp DevTools',
    description: 'DogUp DevTools隐私政策，通过无状态客户端处理保护您的数据。',
    url: 'https://dogupup.com/privacy',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
