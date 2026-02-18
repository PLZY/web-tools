import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'DogUp DevTools | Java 效率工具集 - Maven 依赖排查 / SQL 转 Java / JVM 模板',
  description: '专为 Java 开发者设计的效率工具集。提供 Maven 依赖树可视化分析、SQL 转 POJO、JVM 启动参数模板及 Cron 表达式解析，解决开发中的日常痛点。',
  keywords: 'DogUp, Maven 依赖排查, SQL 转 Java, JVM 调优, Cron 解析, Java 开发工具',
  openGraph: {
    title: 'DogUp DevTools | Java 效率工具集',
    description: '专注解决依赖冲突、实体转换、参数调优等日常痛点。',
    images: ['/og-image.png'],
  }
};

export default function Page() {
  return <HomeClient />;
}
