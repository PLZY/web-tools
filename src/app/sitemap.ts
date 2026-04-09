import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dogupup.com';
  
  // 开发者工具
  const devTools = [
    '/maven-tree',
    '/cron',
    '/json-lab',
    '/log-config',
    '/jvm-tuning',
    '/text-format',
    '/curl-builder',
    '/diff',
    '/sql-stitcher',
    '/mojibake',
    '/ide-shortcuts',
  ];

  // 生活工具
  const lifeTools = [
    '/hourly-wage',
    '/fake-update',
    '/mbti',
  ];

  // 静态页面
  const staticPages = [
    '/about',
    '/privacy',
    '/terms',
  ];

  const routes = [
    '',
    ...devTools,
    ...lifeTools,
    ...staticPages,
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
