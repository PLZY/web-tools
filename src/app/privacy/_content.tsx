"use client";

import { useTranslation } from "@/lib/i18n";

export default function PrivacyPageContent() {
  const { lang } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl prose prose-neutral dark:prose-invert">
      <h1 className="text-3xl font-bold mb-6">
        {lang === "zh" ? "隐私政策" : "Privacy Policy"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {lang === "zh" ? "最后更新时间：" : "Last Updated: "} 2026-04-01
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "1. 引言" : "1. Introduction"}
        </h2>
        <p>
          {lang === "zh"
            ? `欢迎访问 DogUpUp DevTools（下称"我们"、"本站"）。我们非常重视您的隐私，并承诺保护您在使用本网站 (dogupup.com) 时可能提供的任何信息。本隐私政策解释了我们如何收集、使用和披露数据。`
            : "Welcome to DogUpUp DevTools (\"we,\" \"our,\" or \"us\"). We respect your privacy and are committed to protecting any personal information you may provide while using our website (dogupup.com). This Privacy Policy explains our data collection, use, and disclosure practices."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "2. 我们收集的信息" : "2. Information We Collect"}
        </h2>
        <p>
          {lang === "zh"
            ? "我们的工具设计为完全无状态的，数据仅在客户端浏览器中或在服务器内存中临时处理。"
            : "Our tools are designed to be entirely stateless and process data client-side or ephemerally on the server."}
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>{lang === "zh" ? "输入数据：" : "Input Data: "}</strong>
            {lang === "zh"
              ? "您输入到我们工具中的任何代码、日志、Cron 表达式或 JSON 字符串均在您的浏览器中处理或在服务器内存中临时处理。我们绝对不会将您的输入数据存储、记录或保存在任何数据库中。"
              : "Any code, logs, Cron expressions, or JSON strings you input into our tools are processed in your browser or temporarily in memory. We do not store, save, or log your input data in any database."}
          </li>
          <li>
            <strong>{lang === "zh" ? "使用数据：" : "Usage Data: "}</strong>
            {lang === "zh"
              ? "我们可能会收集匿名的分析数据（例如页面浏览量、浏览器类型和交互指标），以改善我们的服务并了解用户行为。"
              : "We may collect anonymous analytics data (such as page views, browser type, and interaction metrics) to improve our service and understand user behavior."}
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "3. 第三方服务与广告" : "3. Third-Party Services and Advertising"}
        </h2>
        <p>
          {lang === "zh"
            ? "我们在网站上使用第三方服务，包括 Google AdSense 来展示广告。"
            : "We use third-party services, including Google AdSense, to display advertisements on our site."}
        </p>
        <ul className="list-disc pl-6 mb-4">
          {lang === "zh" ? (
            <>
              <li>包括 Google 在内的第三方供应商会使用 Cookie 来根据用户先前对本网站或其他网站的访问投放广告。</li>
              <li>Google 使用广告 Cookie 可让其及其合作伙伴根据用户对您的网站和/或互联网上其他网站的访问情况向他们投放广告。</li>
              <li>用户可以通过访问 <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-primary underline">Google 广告设置</a>来选择停用个性化广告。</li>
            </>
          ) : (
            <>
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-primary underline">Google Ads Settings</a>.</li>
            </>
          )}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "4. Cookie 政策" : "4. Cookies"}
        </h2>
        <p>
          {lang === "zh"
            ? "我们以及我们的第三方合作伙伴使用 Cookie（存储在您设备上的小型文本文件）来提供深色模式/语言偏好保存、分析网站流量以及投放定向广告。您可以指示您的浏览器拒绝所有 Cookie 或在发送 Cookie 时进行提示。"
            : "We and our third-party partners use cookies (small text files stored on your device) to personalize content, provide social media features, analyze traffic, and serve targeted advertisements. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "5. 数据安全" : "5. Data Security"}
        </h2>
        <p>
          {lang === "zh"
            ? "虽然没有任何在线服务是 100% 安全的，但我们实施了行业标准的安全措施来防止未经授权的访问。由于我们不存储您的处理数据（例如 JSON 文件、代码），因此敏感输入数据泄露的风险被降至最低。"
            : "While no online service is 100% secure, we implement industry-standard security measures to protect against unauthorized access. Because we do not store your processing data (e.g., JSON files, code), the risk of data breach for sensitive input is minimized."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {lang === "zh" ? "6. 联系我们" : "6. Contact Us"}
        </h2>
        <p>
          {lang === "zh"
            ? "如果您对本隐私政策有任何疑问，请通过我们的 "
            : "If you have any questions about this Privacy Policy, please contact us at via our "}
          <a href="https://github.com/PLZY/web-tools/issues" target="_blank" rel="noreferrer" className="text-primary underline">
            {lang === "zh" ? "GitHub 仓库" : "GitHub Repository"}
          </a>
          {lang === "zh" ? " 联系我们。" : "."}
        </p>
      </section>
    </div>
  );
}
