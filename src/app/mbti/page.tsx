import { Metadata } from 'next';
import MbtiPageContent from './_content';

export const metadata: Metadata = {
  title: 'Free MBTI Personality Test - 16 Types | 免费MBTI人格测试 - DogUp DevTools',
  description: 'Take a free MBTI personality test with professional questions. Discover your personality type among 16 types, explore career potential and relationship patterns. No registration required. 免费MBTI人格测试，专业题目，无需注册即可获取16型人格完整分析报告。',
  keywords: ['MBTI Test', 'MBTI测试', 'MBTI Personality Test', 'MBTI人格测试', '16 Personalities', '16型人格', 'Free MBTI', '免费MBTI', 'Personality Type', '人格类型', 'Myers-Briggs', 'INTJ', 'INFP', 'ENFP', '性格测试'],
  openGraph: {
    title: 'Free MBTI Personality Test | 免费MBTI人格测试',
    description: 'Discover your personality type among 16 types. Free, professional, no registration required.',
    url: 'https://dogupup.com/mbti',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free MBTI Personality Test",
  "url": "https://dogupup.com/mbti",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function MbtiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MbtiPageContent />
    </>
  );
}
