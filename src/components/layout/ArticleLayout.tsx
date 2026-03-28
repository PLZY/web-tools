"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleLayoutProps {
  title: string;
  description: string;
  readTime?: string;
  category?: string;
  backUrl?: string;
  backLabel?: string;
  relatedTools?: Array<{
    name: string;
    url: string;
    icon?: ReactNode;
  }>;
  children: ReactNode;
  lang?: string;
}

export function ArticleLayout({
  title,
  description,
  readTime = "5 min",
  category,
  backUrl = "/guides",
  backLabel = "Back to Guides",
  relatedTools = [],
  children,
  lang = "zh"
}: ArticleLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href={backUrl}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          {backLabel}
        </Link>

        {category && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            <BookOpen className="w-3 h-3 mr-1" />
            {category}
          </div>
        )}

        <h1 className="text-3xl font-extrabold tracking-tight">
          {title}
        </h1>

        <p className="text-muted-foreground text-lg font-medium max-w-3xl">
          {description}
        </p>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {readTime} {lang === 'zh' ? '阅读' : 'read'}
          </div>
          {relatedTools.length > 0 && (
            <div className="hidden sm:block h-4 border-l border-border"></div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className={cn(
            "prose prose-slate dark:prose-invert prose-lg max-w-none",
            "prose-headings:font-bold prose-headings:tracking-tight",
            "prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-border prose-h2:pb-3",
            "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4",
            "prose-p:leading-relaxed",
            "prose-strong:font-semibold",
            "prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-medium prose-code:text-sm",
            "prose-pre:bg-slate-900 dark:prose-pre:bg-slate-800 prose-pre:border prose-pre:border-border",
            "prose-ul:space-y-2",
            "prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          )}>
            {children}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  {lang === 'zh' ? '相关工具' : 'Related Tools'}
                </h3>
                <div className="space-y-3">
                  {relatedTools.map((tool, index) => (
                    <Link
                      key={index}
                      href={tool.url}
                      className="group flex items-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent transition-all duration-200"
                    >
                      {tool.icon && (
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mr-3 group-hover:bg-accent transition-colors">
                          {tool.icon}
                        </div>
                      )}
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {tool.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="rounded-xl border border-border bg-primary p-6 text-primary-foreground">
              <h3 className="text-lg font-semibold mb-2">
                {lang === 'zh' ? '立即试用工具' : 'Try Our Tools'}
              </h3>
              <p className="text-primary-foreground/70 text-sm mb-4">
                {lang === 'zh'
                  ? '将理论转化为实践，使用我们的开发工具提升效率。'
                  : 'Turn theory into practice with our developer tools.'
                }
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-lg font-medium text-sm transition-colors"
              >
                {lang === 'zh' ? '探索工具箱' : 'Explore Tools'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
