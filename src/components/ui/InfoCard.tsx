"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Info, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";

interface InfoCardProps {
  title: string;
  children: ReactNode;
  variant?: "info" | "warning" | "success" | "tip";
  icon?: ReactNode;
  className?: string;
}

export function InfoCard({
  title,
  children,
  variant = "info",
  icon,
  className
}: InfoCardProps) {
  const variants = {
    info: {
      container: "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20",
      header: "text-blue-800 dark:text-blue-300",
      content: "text-blue-700 dark:text-blue-200",
      icon: <Info className="w-5 h-5" />
    },
    warning: {
      container: "border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20",
      header: "text-amber-800 dark:text-amber-300",
      content: "text-amber-700 dark:text-amber-200",
      icon: <AlertTriangle className="w-5 h-5" />
    },
    success: {
      container: "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20",
      header: "text-green-800 dark:text-green-300",
      content: "text-green-700 dark:text-green-200",
      icon: <CheckCircle className="w-5 h-5" />
    },
    tip: {
      container: "border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20",
      header: "text-purple-800 dark:text-purple-300",
      content: "text-purple-700 dark:text-purple-200",
      icon: <Lightbulb className="w-5 h-5" />
    }
  };

  const variantStyle = variants[variant];

  return (
    <div className={cn(
      "rounded-xl border p-6 my-6",
      variantStyle.container,
      className
    )}>
      <div className={cn("flex items-center font-semibold mb-3", variantStyle.header)}>
        {icon || variantStyle.icon}
        <span className="ml-2">{title}</span>
      </div>
      <div className={cn("leading-relaxed", variantStyle.content)}>
        {children}
      </div>
    </div>
  );
}

interface FeatureGridProps {
  items: Array<{
    symbol: string;
    name: string;
    description: string;
    example?: string;
  }>;
  className?: string;
}

export function FeatureGrid({ items, className }: FeatureGridProps) {
  return (
    <div className={cn("grid gap-4 my-6", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border border-border bg-card hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
              <code className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                {item.symbol}
              </code>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">
                {item.name}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                {item.description}
              </p>
              {item.example && (
                <code className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                  {item.example}
                </code>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}