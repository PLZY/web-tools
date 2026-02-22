import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://dogupup.com'),
  title: 'DogUp DevTools | 开发者工具箱',
  description: 'DogUp DevTools 专为开发者设计，提供 Maven 依赖冲突分析、Cron 表达式解析、JSON 格式化、JVM 调优，日志配置等工具。DogUp DevTools provides Maven dependency analysis, Cron expression parsing, JSON formatting, and JVM tuning，Log config for developers.',
  keywords: [
    'DogUp', 'Online DevTools', '在线工具站',
    'Maven Dependency Analysis', 'Maven 依赖排查', 'Maven 依赖树',
    'Cron Expression', 'Cron 表达式', 'Cron Parser',
    'JSON Lab', 'JSON Parser', 'JSON Format', 'JSON 解析', 'JSON 格式化',
    'JVM Tuning', 'JVM 调优', 'JVM 参数',
    'Logback Config', 'Logback 配置', 'Log4j2 Config','Log4j2 配置',
    'POJO Generator',
    'Developer Tools Online', '在线开发工具',
    'Java Developer Tools', 'Java 开发工具'
  ],
  openGraph: {
    title: 'DogUp DevTools | 开发者工具箱',
    description: 'DogUp DevTools 专为开发者设计，提供 Maven 依赖冲突分析、Cron 表达式解析、JSON 格式化、JVM 调优，日志配置等工具',
    images: ['/opengraph-image'],
    locale: 'zh_CN',
    alternateLocale: ['en_US'],
    type: 'website',
  }
};

export default function Page() {
  return <HomeClient />;
}
