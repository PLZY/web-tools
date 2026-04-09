import { Metadata } from 'next';
import SqlStitcherPageContent from './_content';

export const metadata: Metadata = {
  title: 'SQL Parameter Stitcher | SQL参数拼接工具 - DogUp DevTools',
  description: 'Stitch ORM prepared statements with parameters into executable SQL. Auto-detect and support MyBatis, Hibernate, JPA, and Spring JDBC log formats. 将ORM预编译SQL与参数自动拼接为可执行SQL，支持MyBatis/Hibernate/JPA/Spring JDBC日志格式。',
  keywords: ['SQL Stitcher', 'SQL参数拼接', 'MyBatis SQL', 'Hibernate SQL', 'JPA SQL', 'Prepared Statement', 'SQL Debug', 'ORM SQL拼接', 'SQL Log Parser', 'SQL日志解析', 'Spring JDBC'],
  openGraph: {
    title: 'SQL Parameter Stitcher | SQL参数拼接工具',
    description: 'Stitch ORM prepared statements with parameters into executable SQL. Supports MyBatis, Hibernate, JPA.',
    url: 'https://dogupup.com/sql-stitcher',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SQL Parameter Stitcher",
  "url": "https://dogupup.com/sql-stitcher",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function SqlStitcherPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SqlStitcherPageContent />
    </>
  );
}
