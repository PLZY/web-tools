import { Metadata } from 'next';
import TermsPageContent from './_content';

export const metadata: Metadata = {
  title: '服务条款 | Terms of Service - DogUp DevTools',
  description: 'DogUp DevTools服务条款，免费在线工具供个人、教育和商业用途使用。Free online developer tools provided as-is for personal, educational, and commercial use.',
  alternates: {
    canonical: 'https://dogupup.com/terms',
    languages: {
      'zh-CN': 'https://dogupup.com/terms',
      'en': 'https://dogupup.com/terms',
    },
  },
  openGraph: {
    title: '服务条款 | Terms of Service - DogUp DevTools',
    description: 'DogUp DevTools服务条款，免费在线工具供个人、教育和商业用途使用。',
    url: 'https://dogupup.com/terms',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsPageContent />;
}
