import { Metadata } from 'next';
import FakeUpdatePageContent from './_content';

export const metadata: Metadata = {
  title: '假装系统更新 | Fake System Update Screen - DogUp DevTools',
  description: '模拟逼真的全屏系统更新画面，支持Windows/macOS/Linux风格，用于演示、恶作剧或休息。Simulate a realistic full-screen system update screen.',
  keywords: ['Fake Update', '假装更新', 'Fake System Update', 'Fake Update Screen', '摸鱼神器', 'Windows Update Prank', 'Prank Screen', '假装系统升级', 'System Update Simulator'],
  alternates: {
    canonical: 'https://dogupup.com/fake-update',
    languages: {
      'zh-CN': 'https://dogupup.com/fake-update',
      'en': 'https://dogupup.com/fake-update',
    },
  },
  openGraph: {
    title: '假装系统更新 | Fake System Update Screen',
    description: '模拟逼真的全屏系统更新画面，支持Windows/macOS/Linux风格。',
    url: 'https://dogupup.com/fake-update',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Fake System Update Screen",
      "url": "https://dogupup.com/fake-update",
      "description": "Simulate a realistic full-screen system update to take a break or prank your colleagues. Supports Windows, macOS, and Linux update styles.",
      "applicationCategory": "EntertainmentApplication",
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
          "name": "How do I exit the fake update screen?",
          "acceptedAnswer": { "@type": "Answer", "text": "Press ESC twice quickly (within 500ms) to exit. This two-press design prevents accidental exits from a single keypress." }
        },
        {
          "@type": "Question",
          "name": "Which operating systems are supported?",
          "acceptedAnswer": { "@type": "Answer", "text": "Currently Windows Update and macOS Update styles are available. Each style is carefully designed to match the real update screen as closely as possible." }
        },
        {
          "@type": "Question",
          "name": "Does it use any network resources?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. The entire simulation is a local CSS/JS animation. No data is downloaded or uploaded. It works perfectly offline." }
        }
      ]
    }
  ]
};

export default function FakeUpdatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FakeUpdatePageContent />
    </>
  );
}
