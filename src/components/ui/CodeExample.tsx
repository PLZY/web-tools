"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeExampleProps {
  code: string;
  explanation: string;
  title?: string;
  language?: string;
  variant?: "default" | "success" | "warning" | "info";
}

export function CodeExample({
  code,
  explanation,
  title,
  language = "cron",
  variant = "default"
}: CodeExampleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const variantStyles = {
    default: "border-border bg-muted",
    success: "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20",
    warning: "border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20",
    info: "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20"
  };

  const codeStyles = {
    default: "text-primary",
    success: "text-green-700 dark:text-green-300",
    warning: "text-amber-700 dark:text-amber-300",
    info: "text-blue-700 dark:text-blue-300"
  };

  return (
    <div className={cn(
      "rounded-xl border p-6 transition-all duration-200 hover:shadow-sm",
      variantStyles[variant]
    )}>
      {title && (
        <div className="flex items-center mb-4">
          <Terminal className="w-4 h-4 mr-2 text-muted-foreground" />
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <code className={cn(
            "font-mono text-lg font-bold px-3 py-2 rounded-lg bg-background border border-border",
            codeStyles[variant]
          )}>
            {code}
          </code>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-background border border-border hover:bg-accent transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">解释：</span>
          {explanation}
        </p>
      </div>
    </div>
  );
}
