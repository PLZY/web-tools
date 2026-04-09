import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { TranslationProvider } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://dogupup.com'),
  title: {
    default: "DogUp DevTools | Free Online Developer Toolkit & Life Utilities | 免费在线开发者工具箱",
    template: "%s",
  },
  description: "DogUp DevTools — free, privacy-first online toolkit for developers and everyday life. Maven dependency analyzer, Cron parser, JSON formatter, JVM tuning, log config generator, text diff, SQL stitcher, cURL builder, MBTI test, and more. All tools run in your browser with zero data uploaded. DogUp DevTools — 免费、隐私优先的在线工具箱，提供Maven依赖分析、Cron解析、JSON格式化、JVM调优、日志配置、文本对比、SQL拼接、cURL构建、MBTI测试等工具，所有数据在浏览器中处理，不上传任何数据。",
  keywords: [
    "DogUp DevTools", "Online Developer Tools", "在线开发者工具", "Free Online Toolkit", "免费在线工具箱",
    "Maven Dependency Analysis", "Maven依赖分析", "Cron Expression Parser", "Cron表达式解析",
    "JSON Formatter", "JSON格式化", "JVM Tuning", "JVM调优", "Logback Config", "日志配置生成",
    "Text Diff", "文本对比", "SQL Stitcher", "SQL参数拼接", "cURL Builder", "cURL命令生成",
    "Mojibake Fixer", "乱码修复", "IDE Shortcuts", "IDE快捷键",
    "MBTI Test", "MBTI测试", "Hourly Wage Calculator", "时薪计算器",
    "Text Formatter", "文本格式化", "Privacy First Developer Tools", "隐私优先开发工具"
  ],
  openGraph: {
    title: "DogUp DevTools | Free Online Developer Toolkit & Life Utilities",
    description: "Free, privacy-first online toolkit for developers. Maven analyzer, Cron parser, JSON formatter, JVM tuning, MBTI test, and more. All tools run in your browser.",
    url: "https://dogupup.com",
    siteName: "DogUp DevTools",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DogUp DevTools",
      },
    ],
    locale: "en_US",
    alternateLocale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DogUp DevTools | Free Online Developer Toolkit",
    description: "Free, privacy-first online toolkit for developers. Maven analyzer, Cron parser, JSON formatter, JVM tuning, and more.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/dog.svg" type="image/svg+xml" />
        <meta name="google-adsense-account" content="ca-pub-8178726174601950" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://dogupup.com/#website",
                  "url": "https://dogupup.com",
                  "name": "DogUp DevTools",
                  "description": "Free, privacy-first online toolkit for developers and everyday life.",
                  "inLanguage": ["en", "zh-CN"],
                },
                {
                  "@type": "Organization",
                  "@id": "https://dogupup.com/#organization",
                  "name": "DogUp DevTools",
                  "url": "https://dogupup.com",
                  "logo": "https://dogupup.com/dog.svg",
                  "sameAs": [
                    "https://github.com/PLZY/web-tools"
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <TranslationProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </TranslationProvider>
        </ThemeProvider>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8178726174601950"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
