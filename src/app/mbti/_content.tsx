"use client";

import MbtiTest from "@/components/tools/MbtiTest";
import { useTranslation } from "@/lib/i18n";
import { ShieldCheck, Zap, HelpCircle, Heart, Shield, RefreshCw, BookOpen } from "lucide-react";


export default function MbtiPageContent() {
  const { lang, t } = useTranslation();
  const zh = lang !== "en";

  return (
    <div>
      {/* Hero Section */}
      <header className="pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            MBTI {zh ? "人格测试" : "Personality Test"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {zh
              ? "发现真实的自我。通过精密的人格分析，探索你的职业潜力、人际关系以及独特的思维模式。"
              : "Discover your true self. Explore your career potential, relationships, and unique thinking patterns through precise personality analysis."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-sm">
              <ShieldCheck className="w-4 h-4 mr-2" />
              {zh ? "专业心理学模型" : "Professional Model"}
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-sm">
              <Zap className="w-4 h-4 mr-2" />
              {zh ? "完全免费" : "100% Free"}
            </span>
          </div>
        </div>
        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 -z-10 opacity-15 dark:opacity-10">
          <div className="w-[400px] h-[400px] bg-blue-400 rounded-full blur-[120px]" />
        </div>
        <div className="absolute bottom-0 left-0 -z-10 opacity-10 dark:opacity-5">
          <div className="w-[300px] h-[300px] bg-orange-400 rounded-full blur-[100px]" />
        </div>
      </header>

      {/* Test Selection */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <MbtiTest />
      </div>

      {/* FAQ Section */}
      <section className="bg-muted/50 dark:bg-muted/20 py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <HelpCircle className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              {zh ? "什么是 MBTI?" : "What is MBTI?"}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {zh
                ? "MBTI（迈尔斯-布里格斯类型指标）是以瑞士心理学家荣格划分的8种心理类型为基础的。它将人格划分为四个维度，共计16种人格类型，是目前世界上应用最广泛的性格测试工具之一。"
                : "MBTI (Myers-Briggs Type Indicator) is based on the 8 psychological types classified by Swiss psychologist Carl Jung. It divides personality into four dimensions, totaling 16 personality types, and is one of the most widely used personality assessment tools in the world."}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              {zh ? "为什么我们要提供免费的 MBTI?" : "Why do we offer free MBTI?"}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {zh
                ? "DogUp 相信自我认知是个人成长和职场成功的第一步。我们希望通过提供高质量的免费测试，帮助更多人开启自我发现之旅，打破认知屏障。"
                : "DogUp believes self-awareness is the first step to personal growth and career success. We hope to help more people start their journey of self-discovery by providing high-quality free tests, breaking down cognitive barriers."}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              {zh ? "测试结果的准确性如何?" : "How accurate are the results?"}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {zh
                ? "我们的测试算法经过数百万次数据校准，严格遵循原版 MBTI 的心理学模型。虽然性格是流动的，但我们的测试能为你提供最接近当前状态的精准分析。"
                : "Our testing algorithm has been calibrated with millions of data points, strictly following the original MBTI psychological model. While personality is fluid, our test provides the most accurate analysis of your current state."}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <RefreshCw className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              {zh ? "我应该隔多久重新测试一次?" : "How often should I retake the test?"}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {zh
                ? "性格会随着生活阅历和环境的变化而微调。我们建议在经历重大生活转变（如换工作、毕业或长期生活状态改变）后，每隔 6-12 个月重新测试一次。"
                : "Personality adjusts with life experience and environment changes. We recommend retaking the test every 6-12 months, especially after major life changes like job transitions or graduation."}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-7 sm:p-8 border border-border">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              {t('seo.mbti.howto')}
            </h3>
            <p className="text-muted-foreground leading-relaxed">{t('seo.mbti.howto.body')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
