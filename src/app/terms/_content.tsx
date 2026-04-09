"use client";

import { useTranslation } from "@/lib/i18n";
import { useEffect, useState } from "react";

export default function TermsPageContent() {
  const { lang } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl prose prose-neutral dark:prose-invert">
      <h1 className="text-3xl font-bold mb-6">
        {lang === "zh" ? "服务条款" : "Terms of Service"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {lang === "zh" ? "最后更新时间：" : "Last Updated: "} 2026-04-01
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "1. 接受条款" : "1. Agreement to Terms"}
        </h2>
        <p>
          {lang === "zh"
            ? "访问或使用我们的网站和工具（DogUpUp DevTools，可通过 dogupup.com 访问），即表示您同意受本服务条款的约束。如果您不同意这些条款的任何部分，则您可能无法访问我们的服务。"
            : "By accessing or using our website and tools (DogUpUp DevTools, accessible at dogupup.com), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, then you may not access our service."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "2. 使用许可" : "2. Use License"}
        </h2>
        <p>
          {lang === "zh"
            ? "DogUpUp DevTools 提供免费的在线实用工具，供软件开发者和普通大众使用。"
            : "DogUpUp DevTools provides free, online utility tools intended for software developers and general public use."}
        </p>
        <ul className="list-disc pl-6 mb-4">
          {lang === "zh" ? (
            <>
              <li>您可以自由地将我们的工具用于个人、教育或商业软件开发目的。</li>
              <li>除了在我们的 GitHub 存储库中明确以开源许可证发布的部分平台代码外，您不得尝试对任何专有算法进行反向工程、反编译或提取源代码。</li>
              <li>您不得出于任何非法或未经授权的目的使用本服务，或使用本服务构建向我们的服务器发送垃圾邮件或超载请求的自动抓取工具。</li>
            </>
          ) : (
            <>
              <li>You may freely use our tools for personal, educational, or commercial software development purposes.</li>
              <li>You may not attempt to reverse engineer, decompile, or extract the source code of any proprietary algorithms, save for those parts of the platform explicitly published under an Open Source License on our GitHub repository.</li>
              <li>You may not use the Service for any illegal or unauthorized purpose, or use the Service to build automated scrapers that spam or overload our servers.</li>
            </>
          )}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "3. 免责声明" : "3. Disclaimer of Warranties"}
        </h2>
        <p>
          {lang === "zh"
            ? `DogUpUp DevTools 网站上的资料和工具按"原样"提供。我们不作任何明示或暗示的保证，并特此否认并否定所有其他保证，包括但不限于适销性、特定用途适用性或不侵犯知识产权或其他权利的暗示保证或条件。`
            : "The materials and tools on DogUpUp DevTools's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."}
        </p>
        <p>
          <strong>{lang === "zh" ? "工具准确性：" : "Tool Accuracy: "}</strong>
          {lang === "zh"
            ? "虽然我们努力确保像 Cron 翻译官或 JVM 调优配方这样的工具提供准确的结果，但您全权负责在将其部署到生产环境之前验证输出。我们不保证解析数据、配置或生成的代码的 100% 准确性。"
            : "While we strive to ensure tools like the Cron Translator or JVM Tuning Recipe provide accurate results, you are solely responsible for verifying the output before deploying it to production environments. We do not guarantee 100% accuracy of parsed data, configurations, or generated code."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "4. 责任限制" : "4. Limitations of Liability"}
        </h2>
        <p>
          {lang === "zh"
            ? "在任何情况下，DogUpUp DevTools、其创建者或其供应商均不对因使用或无法使用 DogUpUp 网站上的资料和工具而引起的任何损害（包括但不限于数据或利润损失、服务器宕机、安全漏洞或业务中断的损害）负责，即使 DogUpUp 或授权代表已被口头或书面通知此类损害的可能性。"
            : "In no event shall DogUpUp DevTools, its creators, or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, server downtime, security breaches, or business interruption) arising out of the use or inability to use the materials and tools on DogUpUp's website, even if DogUpUp or an authorized representative has been notified orally or in writing of the possibility of such damage."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "5. 第三方链接" : "5. Third-Party Links"}
        </h2>
        <p>
          {lang === "zh"
            ? "我们的网站可能包含指向非 DogUpUp DevTools 拥有或控制的第三方网站或服务的链接。我们无法控制任何第三方网站或服务的内容、隐私政策或做法，也不承担任何责任。"
            : "Our website may contain links to third-party web sites or services that are not owned or controlled by DogUpUp DevTools. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services."}
        </p>
      </section>
    </div>
  );
}
