"use client";

import { useTranslation } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { CodeExample } from "@/components/ui/CodeExample";
import { InfoCard, FeatureGrid } from "@/components/ui/InfoCard";
import { Package, GitBranch, Settings } from "lucide-react";
import Link from "next/link";

export default function MavenArticlePage() {
  const { lang } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const relatedTools = [
    {
      name: lang === 'zh' ? 'Maven 依赖分析' : 'Maven Tree Analyzer',
      url: '/maven-tree',
      icon: <GitBranch className="w-4 h-4 text-blue-500" />
    },
    {
      name: lang === 'zh' ? 'JVM 调优' : 'JVM Tuning',
      url: '/jvm-tuning',
      icon: <Settings className="w-4 h-4 text-blue-500" />
    }
  ];

  return (
    <ArticleLayout
      title={mounted && lang === 'zh' ? "Maven 依赖冲突排查指南：告别 ClassNotFoundException" : "Maven Dependency Conflict Resolution: Say Goodbye to ClassNotFoundException"}
      description={mounted && lang === 'zh' ?
        "在 Java 生态和 Spring Boot 开发中，Maven 依赖冲突是最常见也是最令人头疼的构建问题。本文带你深入理解 Maven 的版本调解机制，并学习如何优雅地解决冲突。" :
        "In Java ecosystem and Spring Boot development, Maven dependency conflicts are the most common and frustrating build issues. This guide helps you understand Maven's version mediation mechanism and learn to resolve conflicts elegantly."
      }
      readTime={mounted && lang === 'zh' ? "10 分钟" : "10 min"}
      category={mounted && lang === 'zh' ? "依赖管理" : "Dependency Management"}
      backLabel={mounted ? (lang === 'zh' ? '返回技术专栏' : 'Back to Guides') : 'Back to Guides'}
      relatedTools={relatedTools}
      lang={lang}
    >
        {(!mounted || lang === 'zh') && (
          <div lang="zh" className={!mounted ? "hidden" : undefined}>
            <h2>什么是 Maven 依赖冲突？</h2>
            <p>
              当你引入一个依赖（如 A）时，A 可能依赖了 B，B 又依赖了 C。这种链式依赖被称为<strong>传递依赖 (Transitive Dependency)</strong>。如果你的项目同时引入了两个不同版本的同一个包，Maven 就必须决定保留哪一个。
            </p>

            <InfoCard title="常见错误" variant="warning">
              如果不幸的是，Maven 选择了一个较低的版本（里面缺少某个你需要的类或方法），程序在运行时就会抛出臭名昭著的：
              <ul className="mt-2 space-y-1">
                <li>• <code>java.lang.ClassNotFoundException</code></li>
                <li>• <code>java.lang.NoSuchMethodError</code></li>
              </ul>
            </InfoCard>

            <h2>Maven 的两大调解原则</h2>
            <p>Maven 处理冲突主要基于以下两条核心规则：</p>

            <FeatureGrid
              items={[
                {
                  symbol: "1",
                  name: "最短路径优先 (Nearest Definition)",
                  description: "距离项目根目录最近的依赖版本获胜",
                  example: "项目→A→B(1.0) 胜过 项目→C→D→B(2.0)"
                },
                {
                  symbol: "2",
                  name: "第一声明优先 (First Declaration)",
                  description: "路径长度相同时，在 pom.xml 中先声明的依赖获胜",
                  example: "同样深度时按声明顺序决定"
                }
              ]}
            />

            <h2>如何排查？</h2>
            <p>排查冲突的利器是 Maven 自带的插件命令：</p>

            <CodeExample
              code="mvn dependency:tree -Dverbose"
              explanation="加上 -Dverbose 非常关键，它会输出那些因为冲突而被 Maven 忽略 (omitted) 的依赖包"
              variant="info"
            />

            <InfoCard title="专业工具" variant="tip">
              <p>你可以将输出文本直接粘贴到我们的 <Link href="/maven-tree" className="text-blue-500 hover:underline font-medium">Maven 依赖树可视化工具</Link> 中，系统会自动帮你在一张关系图中标记出红色的冲突点。</p>
            </InfoCard>

            <h2>解决冲突的最佳实践</h2>
            <p>发现了冲突后，你有两种优雅的解决方案：</p>

            <div className="space-y-6 mt-6">
              <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-amber-500" />
                  方法一：使用 Exclusion (排除法)
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  在引入引发冲突的源头包时，显式将其不需要的传递依赖排除。
                </p>
                <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
{`<dependency>
    <groupId>org.example</groupId>
    <artifactId>framework-core</artifactId>
    <version>2.0.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.conflicting</groupId>
            <artifactId>old-lib</artifactId>
        </exclusion>
    </exclusions>
</dependency>`}
                </pre>
              </div>

              <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl border border-green-200 dark:border-green-700">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-green-500" />
                  方法二：使用 DependencyManagement (锁定法) 【推荐】
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  在父 POM 中锁定该依赖的版本，强制全项目统一。
                </p>
                <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
{`<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.conflicting</groupId>
            <artifactId>old-lib</artifactId>
            <version>3.1.0</version>
        </dependency>
    </dependencies>
</dependencyManagement>`}
                </pre>
              </div>
            </div>

            <InfoCard title="总结" variant="success">
              掌握这两招，你就能游刃有余地处理任何复杂的 Java 依赖泥潭！记住：先用 <code>mvn dependency:tree -Dverbose</code> 定位冲突，再用适当的方法解决。
            </InfoCard>
          </div>
        )}

        {(!mounted || lang === 'en') && (
          <div lang="en" className={!mounted ? "hidden" : undefined}>
            <h2>What is a Maven Dependency Conflict?</h2>
            <p>
              When you introduce a dependency (e.g., A), A might depend on B, which depends on C. This chain is known as a <strong>Transitive Dependency</strong>. If your project accidentally pulls in two different versions of the exact same library, Maven must decide which one to keep.
            </p>

            <InfoCard title="Common Errors" variant="warning">
              If Maven unfortunately picks a lower version (which might be missing a class or method you need), your application will crash at runtime throwing:
              <ul className="mt-2 space-y-1">
                <li>• <code>java.lang.ClassNotFoundException</code></li>
                <li>• <code>java.lang.NoSuchMethodError</code></li>
              </ul>
            </InfoCard>

            <h2>Maven's Two Mediation Rules</h2>
            <p>Maven resolves conflicts based on two core principles:</p>

            <FeatureGrid
              items={[
                {
                  symbol: "1",
                  name: "Nearest Definition",
                  description: "The dependency version closest to the project root wins",
                  example: "Project→A→B(1.0) beats Project→C→D→B(2.0)"
                },
                {
                  symbol: "2",
                  name: "First Declaration",
                  description: "When path lengths are equal, first declared dependency in pom.xml wins",
                  example: "Declaration order matters at same depth"
                }
              ]}
            />

            <h2>How to Troubleshoot?</h2>
            <p>The ultimate weapon for troubleshooting is the built-in Maven plugin command:</p>

            <CodeExample
              code="mvn dependency:tree -Dverbose"
              explanation="The -Dverbose flag is crucial; it forces Maven to print out the dependencies that were omitted due to conflicts"
              variant="info"
            />

            <InfoCard title="Professional Tool" variant="tip">
              <p>You can paste the raw output directly into our <Link href="/maven-tree" className="text-blue-500 hover:underline font-medium">Maven Dependency Visualizer</Link>, and the system will automatically highlight the conflicting nodes in red on an interactive graph.</p>
            </InfoCard>

            <h2>Best Practices for Resolution</h2>
            <p>Once identified, you have two elegant ways to fix the conflict:</p>

            <div className="space-y-6 mt-6">
              <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-amber-500" />
                  Method 1: Using Exclusions
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Explicitly exclude the unwanted transitive dependency from the source artifact that brought it in.
                </p>
                <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
{`<dependency>
    <groupId>org.example</groupId>
    <artifactId>framework-core</artifactId>
    <version>2.0.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.conflicting</groupId>
            <artifactId>old-lib</artifactId>
        </exclusion>
    </exclusions>
</dependency>`}
                </pre>
              </div>

              <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl border border-green-200 dark:border-green-700">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-green-500" />
                  Method 2: Using DependencyManagement 【Recommended】
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Lock the version of the dependency in your parent POM, forcing a unified version across the entire project.
                </p>
                <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
{`<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.conflicting</groupId>
            <artifactId>old-lib</artifactId>
            <version>3.1.0</version>
        </dependency>
    </dependencies>
</dependencyManagement>`}
                </pre>
              </div>
            </div>

            <InfoCard title="Summary" variant="success">
              Master these two techniques, and you'll navigate any complex Java dependency swamp with ease! Remember: first use <code>mvn dependency:tree -Dverbose</code> to identify conflicts, then apply the appropriate resolution method.
            </InfoCard>
          </div>
        )}
    </ArticleLayout>
  );
}
