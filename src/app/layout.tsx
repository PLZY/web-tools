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
  title: "DogUp DevTools", // 通用品牌名
  description: "DogUp DevTools",
  keywords: ["Java Tools", "Maven Dependency Analysis", "Cron Expression", "JSON Parser", "JVM Tuning", "Java工具", "Maven依赖分析", "Cron表达式", "JSON解析", "JVM调优"],
  openGraph: {
    title: "DogUp DevTools",
    description: "DogUp DevTools",
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
    title: "DogUp DevTools",
    description: "DogUp DevTools",
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8178726174601950"
          crossOrigin="anonymous"
          strategy="afterInteractive"
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
      </body>
    </html>
  );
}
