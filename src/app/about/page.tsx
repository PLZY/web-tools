import { Metadata } from 'next';
import AboutPageContent from './_content';

export const metadata: Metadata = {
  title: '关于我们 | About Us - DogUp DevTools',
  description: 'DogUp DevTools是一个隐私优先、轻量级的在线工具箱，面向开发者和日常生活，开源、无状态、极速体验。A privacy-first, lightweight online toolkit for developers and everyday life.',
  keywords: ['DogUp DevTools', 'About', '关于我们', 'Developer Tools', '开发者工具', 'Online Toolkit', '在线工具箱', 'Privacy First', 'Open Source', '开源工具'],
  alternates: {
    canonical: 'https://dogupup.com/about',
    languages: {
      'zh-CN': 'https://dogupup.com/about',
      'en': 'https://dogupup.com/about',
    },
  },
  openGraph: {
    title: '关于我们 | About Us - DogUp DevTools',
    description: '隐私优先、轻量级的在线开发者工具箱，开源、无状态、极速体验。',
    url: 'https://dogupup.com/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
