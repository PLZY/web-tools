"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  tag?: string;
  className?: string;
  descriptionDetail?: string;
}

export function ToolCard({
  title,
  description,
  href,
  icon,
  tag,
  className,
  descriptionDetail,
}: ToolCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/50",
        className
      )}
    >
      <Link href={href} className="flex h-full flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary ring-1 ring-primary/20 transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-6">
              {icon}
            </div>
            {tag && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
                {tag}
              </span>
            )}
          </div>
          <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mb-4 text-sm font-medium text-muted-foreground leading-relaxed">
            {description}
          </p>
          {descriptionDetail && (
            <p className="text-xs text-muted-foreground/70 italic border-l-2 border-primary/20 pl-3 py-1">
              {descriptionDetail}
            </p>
          )}
        </div>
        
        <div className="mt-4 flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
          {t("jsonLab.startUsing")}
          <svg
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>

      {/* 边框流光效果 */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}
