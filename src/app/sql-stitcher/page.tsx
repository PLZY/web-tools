import { Metadata } from 'next';
import SqlStitcherPageContent from './_content';

export const metadata: Metadata = {
  title: 'SQL参数拼接工具 | SQL Parameter Stitcher - DogUp DevTools',
  description: '将ORM预编译SQL与参数自动拼接为可执行SQL，支持MyBatis/Hibernate/JPA/Spring JDBC日志格式。Stitch ORM prepared statements with parameters into executable SQL.',
  keywords: ['SQL Stitcher', 'SQL参数拼接', 'MyBatis SQL', 'Hibernate SQL', 'JPA SQL', 'Prepared Statement', 'SQL Debug', 'ORM SQL拼接', 'SQL Log Parser', 'SQL日志解析', 'Spring JDBC'],
  alternates: {
    canonical: 'https://dogupup.com/sql-stitcher',
    languages: {
      'zh-CN': 'https://dogupup.com/sql-stitcher',
      'en': 'https://dogupup.com/sql-stitcher',
    },
  },
  openGraph: {
    title: 'SQL参数拼接工具 | SQL Parameter Stitcher',
    description: '将ORM预编译SQL与参数自动拼接为可执行SQL，支持MyBatis/Hibernate/JPA格式。',
    url: 'https://dogupup.com/sql-stitcher',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "SQL Parameter Stitcher",
      "url": "https://dogupup.com/sql-stitcher",
      "description": "Stitch ORM prepared statements with parameters into executable SQL. Auto-detect and support MyBatis, Hibernate, JPA, and Spring JDBC log formats.",
      "applicationCategory": "DeveloperApplication",
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
          "name": "What is SQL stitching?",
          "acceptedAnswer": { "@type": "Answer", "text": "When debugging data issues, ORM frameworks like MyBatis and Hibernate print SQL templates with ? placeholders, and parameters on a separate line. SQL Stitcher auto-detects the log format and merges the SQL template with its parameters into complete, executable SQL that you can paste directly into your database client." }
        },
        {
          "@type": "Question",
          "name": "Which ORM log formats are supported?",
          "acceptedAnswer": { "@type": "Answer", "text": "The tool supports MyBatis Preparing/Parameters style, Hibernate binding parameter style, JPA, and Spring JDBC log formats. It auto-detects the format from your pasted log." }
        },
        {
          "@type": "Question",
          "name": "Is my SQL data uploaded anywhere?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. All SQL parsing happens locally in your browser. Your SQL queries and parameters never leave your machine." }
        }
      ]
    }
  ]
};

export default function SqlStitcherPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SqlStitcherPageContent />
    </>
  );
}
