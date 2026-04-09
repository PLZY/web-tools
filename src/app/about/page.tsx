import { Metadata } from 'next';
import AboutPageContent from './_content';

export const metadata: Metadata = {
  title: 'About Us | 关于我们 - DogUp DevTools',
  description: 'DogUp DevTools is a privacy-first, lightweight online toolkit for developers and everyday life. Open source, stateless, and blazing fast. DogUp DevTools是一个隐私优先、轻量级的在线工具箱，面向开发者和日常生活，开源、无状态、极速体验。',
  keywords: ['DogUp DevTools', 'About', '关于我们', 'Developer Tools', '开发者工具', 'Online Toolkit', '在线工具箱', 'Privacy First', 'Open Source', '开源工具'],
  openGraph: {
    title: 'About Us | 关于我们 - DogUp DevTools',
    description: 'Privacy-first, lightweight online toolkit for developers. Open source and blazing fast.',
    url: 'https://dogupup.com/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
