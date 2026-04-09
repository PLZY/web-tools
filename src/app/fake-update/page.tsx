import { Metadata } from 'next';
import FakeUpdatePageContent from './_content';

export const metadata: Metadata = {
  title: 'Fake System Update Screen | 假装系统更新 - DogUp DevTools',
  description: 'Simulate a realistic full-screen system update to take a break or prank your colleagues. Supports Windows, macOS, and Linux update styles. 模拟逼真的全屏系统更新画面，支持Windows/macOS/Linux风格，摸鱼或整蛊同事的利器。',
  keywords: ['Fake Update', '假装更新', 'Fake System Update', 'Fake Update Screen', '摸鱼神器', 'Windows Update Prank', 'Prank Screen', '假装系统升级', 'System Update Simulator'],
  openGraph: {
    title: 'Fake System Update Screen | 假装系统更新',
    description: 'Simulate a realistic full-screen system update. Supports Windows, macOS, and Linux styles.',
    url: 'https://dogupup.com/fake-update',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Fake System Update Screen",
  "url": "https://dogupup.com/fake-update",
  "applicationCategory": "EntertainmentApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function FakeUpdatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FakeUpdatePageContent />
    </>
  );
}
