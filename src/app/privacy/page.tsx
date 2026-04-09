import { Metadata } from 'next';
import PrivacyPageContent from './_content';

export const metadata: Metadata = {
  title: 'Privacy Policy | 隐私政策 - DogUp DevTools',
  description: 'DogUp DevTools privacy policy. Learn how we protect your data with stateless, client-side processing. No data is stored or uploaded. DogUp DevTools隐私政策，了解我们如何通过无状态客户端处理保护您的数据。',
  openGraph: {
    title: 'Privacy Policy | 隐私政策 - DogUp DevTools',
    description: 'How DogUp DevTools protects your data with stateless, client-side processing.',
    url: 'https://dogupup.com/privacy',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
