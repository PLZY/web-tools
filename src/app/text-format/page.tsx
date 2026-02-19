"use client";

import TextFormatter from "@/components/tools/TextFormatter";

export default function TextFormatPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          纯文本格式化
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          一个用于格式化和压缩JSON文本的简单骨架。
        </p>
      </div>
      <TextFormatter />
    </div>
  );
}
