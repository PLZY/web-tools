import { Metadata } from 'next';
import MbtiPageContent from './_content';

export const metadata: Metadata = {
  title: '免费MBTI人格测试 - 16型人格 | Free MBTI Personality Test - DogUp DevTools',
  description: '免费MBTI人格测试，93道专业题目，无需注册即可获取16型人格完整分析报告，含职业建议和人际关系分析。Free MBTI personality test with professional questions. No registration required.',
  keywords: ['MBTI Test', 'MBTI测试', 'MBTI Personality Test', 'MBTI人格测试', '16 Personalities', '16型人格', 'Free MBTI', '免费MBTI', 'Personality Type', '人格类型', 'Myers-Briggs', 'INTJ', 'INFP', 'ENFP', '性格测试'],
  alternates: {
    canonical: 'https://dogupup.com/mbti',
    languages: {
      'zh-CN': 'https://dogupup.com/mbti',
      'en': 'https://dogupup.com/mbti',
    },
  },
  openGraph: {
    title: '免费MBTI人格测试 | Free MBTI Personality Test',
    description: '免费MBTI人格测试，93道专业题目，无需注册，获取完整16型人格分析报告。',
    url: 'https://dogupup.com/mbti',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Free MBTI Personality Test",
      "url": "https://dogupup.com/mbti",
      "description": "Take a free MBTI personality test with professional questions. Discover your personality type among 16 types, explore career potential and relationship patterns.",
      "applicationCategory": "LifestyleApplication",
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
          "name": "How many questions are in this MBTI test?",
          "acceptedAnswer": { "@type": "Answer", "text": "This test contains 93 professionally designed questions covering all four MBTI dimensions: Extraversion/Introversion (E/I), Sensing/Intuition (S/N), Thinking/Feeling (T/F), and Judging/Perceiving (J/P). It takes approximately 10-15 minutes to complete." }
        },
        {
          "@type": "Question",
          "name": "Is this test scientifically validated?",
          "acceptedAnswer": { "@type": "Answer", "text": "This test is based on the Myers-Briggs Type Indicator framework. While no online test can replace a certified practitioner's assessment, our 93-question version provides a thorough self-assessment that aligns with standard MBTI methodology." }
        },
        {
          "@type": "Question",
          "name": "Is my test data stored or uploaded?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. All test processing and result calculation happen locally in your browser. Your answers and personality results are never uploaded to any server. No registration is required." }
        }
      ]
    }
  ]
};

export default function MbtiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MbtiPageContent />
    </>
  );
}
