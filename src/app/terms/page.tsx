import { Metadata } from 'next';
import TermsPageContent from './_content';

export const metadata: Metadata = {
  title: 'Terms of Service | 服务条款 - DogUp DevTools',
  description: 'DogUp DevTools terms of service. Free online developer tools and life utilities provided as-is for personal, educational, and commercial use. DogUp DevTools服务条款，免费在线工具供个人、教育和商业用途使用。',
  openGraph: {
    title: 'Terms of Service | 服务条款 - DogUp DevTools',
    description: 'Terms of service for DogUp DevTools free online tools.',
    url: 'https://dogupup.com/terms',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsPageContent />;
}
