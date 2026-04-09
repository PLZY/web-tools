import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://dogupup.com'),
  title: '免费在线工具箱 | DogUp DevTools - Free Online Toolkit for Developers & Life',
  description: 'DogUp DevTools — 免费、隐私优先的在线工具箱。开发者工具：Maven依赖分析、Cron表达式解析、JSON格式化、JVM调优、日志配置生成、文本对比、SQL参数拼接、cURL命令构建、乱码修复、IDE快捷键对照。生活工具：MBTI人格测试、时薪计算器。所有工具在浏览器中运行，不上传任何数据。Free, privacy-first online toolkit for developers. All tools run in your browser with zero data uploaded.',
  keywords: [
    'DogUp DevTools', 'Online Developer Tools', '在线开发者工具', 'Free Online Toolkit', '免费在线工具箱',
    'Maven Dependency Analysis', 'Maven依赖分析', 'Maven Dependency Tree', 'Maven依赖树',
    'Cron Expression', 'Cron表达式', 'Cron Parser', 'Cron解析器',
    'JSON Formatter', 'JSON格式化', 'JSON Validator', 'JSON验证', 'JSON Parser', 'JSON解析',
    'JVM Tuning', 'JVM调优', 'JVM Parameters', 'JVM参数',
    'Logback Config', 'Logback配置', 'Log4j2 Config', 'Log4j2配置',
    'Text Diff', '文本对比', 'Code Diff', '代码对比',
    'SQL Stitcher', 'SQL参数拼接', 'MyBatis SQL',
    'cURL Builder', 'cURL命令生成',
    'Mojibake Fixer', '乱码修复', 'Encoding Fix',
    'IDE Shortcuts', 'IDE快捷键', 'IntelliJ VS Code Eclipse',
    'Text Formatter', '文本格式化', 'Base64 Encode', 'URL Encode',
    'MBTI Test', 'MBTI测试', 'MBTI Personality', 'MBTI人格测试',
    'Hourly Wage Calculator', '时薪计算器',
    'Fake Update', '假装更新', '摸鱼神器',
    'Privacy First', '隐私优先', 'Browser Only Tools', '纯浏览器工具'
  ],
  alternates: {
    canonical: 'https://dogupup.com',
    languages: {
      'zh-CN': 'https://dogupup.com',
      'en': 'https://dogupup.com',
    },
  },
  openGraph: {
    title: '免费在线工具箱 | DogUp DevTools',
    description: '免费、隐私优先的在线工具箱，提供Maven依赖分析、Cron解析、JSON格式化、JVM调优、MBTI测试等10+工具，所有数据在浏览器中处理。',
    images: ['/opengraph-image'],
    locale: 'zh_CN',
    alternateLocale: ['en_US'],
    type: 'website',
  }
};

export default function Page() {
  return <HomeClient />;
}
