"use client";

import MavenTree from "@/components/tools/MavenTree";
import { useTranslation } from "@/lib/i18n";

export default function MavenTreePage() {
  const { t, lang } = useTranslation();

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* 头部标题区 */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t('maven.title')}
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t('maven.desc')}
        </p>
      </div>

      {/* 核心工具组件 */}
      <MavenTree />

      {/* 硬核 SEO 与 知识科普区 */}
      <article className="prose dark:prose-invert max-w-none mt-12 border-t border-border pt-8 text-slate-900 dark:text-slate-200">
        <h2 className="text-2xl font-black mb-4">{t('maven.help.title')}</h2>
        <p className="font-medium">
          {t('maven.help.content')}
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4">{t('maven.how.title')}</h3>
        <p className="font-medium">
          {t('maven.how.content').split('\n\n')[0]}
        </p>
        <div className="relative group">
          <pre className="bg-slate-950 p-4 rounded-lg text-slate-300 border border-slate-800">
            <code>mvn dependency:tree</code>
          </pre>
        </div>
        <p className="mt-4 font-medium">
          {t('maven.how.content').split('\n\n')[1]?.split('\n')[0]}
        </p>
        <div className="relative group">
          <pre className="bg-slate-950 p-4 rounded-lg text-slate-300 border border-slate-800">
            <code>mvn dependency:tree -Dverbose</code>
          </pre>
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4">{lang === 'zh' ? 'Maven 的依赖仲裁机制' : 'Maven Dependency Mediation'}</h3>
        <p className="font-medium">
          {lang === 'zh' 
            ? 'Maven 处理依赖冲突主要遵循两个原则：' 
            : 'Maven follows two main principles to resolve conflicts:'}
        </p>
        <ol className="list-decimal pl-6 space-y-2 font-medium">
          <li>
            <strong>{lang === 'zh' ? '路径最近者优先' : 'Nearest Definition'}</strong>: {lang === 'zh' ? '如果依赖路径深度不同，Maven 会选择路径最短的那个版本。' : 'Maven picks the version with the shortest path.'}
          </li>
          <li>
            <strong>{lang === 'zh' ? '第一声明者优先' : 'First Declaration'}</strong>: {lang === 'zh' ? '如果依赖路径深度相同，Maven 会选择在 pom.xml 中最先声明的那个版本。' : 'If paths are equal, the first one declared in pom.xml wins.'}
          </li>
        </ol>

        <h3 className="text-xl font-bold mt-8 mb-4">{lang === 'zh' ? '如何解决依赖冲突？' : 'How to resolve?'}</h3>
        <p className="font-medium">
          {lang === 'zh' ? '一旦通过本工具定位到冲突，您可以通过以下方式解决：' : 'Once located, you can resolve conflicts via:'}
        </p>
        <ul className="list-disc pl-6 space-y-2 font-medium">
          <li>{lang === 'zh' ? '排除依赖 (Exclusion)' : 'Exclusion in pom.xml'}</li>
          <li>{lang === 'zh' ? '锁定版本 (Dependency Management)' : 'DependencyManagement in parent POM'}</li>
        </ul>
      </article>
    </div>
  );
}
