import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { TranslationProvider } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://tool.dogupup.com'),
  title: "狗狗蹦跶工具站 | DogUp DevTools - 开发者工具箱",
  description: "提供 Maven 依赖排查、Logback 配置生成、Cron 表达式解析、SQL 转 Java POJO、JVM 参数调优等极客工具，助力 Java 开发者提升效率。",
  keywords: ["Java工具", "Logback配置", "Maven依赖分析", "Cron表达式", "SQL转Java", "JVM调优", "DogUp"],
  openGraph: {
    title: "狗狗蹦跶工具站 | DogUp DevTools - 开发者工具箱",
    description: "提供 Maven 依赖排查、Logback 配置生成、Cron 表达式解析、SQL 转 Java POJO、JVM 参数调优等极客工具，助力 Java 开发者提升效率。",
    url: "https://tool.dogupup.com",
    siteName: "DogUp DevTools",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DogUp DevTools",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "狗狗蹦跶工具站 | DogUp DevTools - 开发者工具箱",
    description: "提供 Maven 依赖排查、Logback 配置生成、Cron 表达式解析、SQL 转 Java POJO、JVM 参数调优等极客工具，助力 Java 开发者提升效率。",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/dog.svg" type="image/svg+xml" />
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
      </body>
    </html>
  );
}
