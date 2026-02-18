import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tool.dogupup.com';
  
  // 静态路由
  const routes = [
    '',
    '/maven-tree',
    '/sql-to-pojo',
    '/cron',
    '/log-config',
    '/jvm-tuning',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
