"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, ChevronRight, ChevronDown, Search, Trash2, BarChart3, Network, AlertTriangle, Info, Copy, Check, Terminal, FolderOpen, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DependencyTreeChart } from './maven-tree/DependencyTreeChart';
import { ConflictRadar } from './maven-tree/ConflictRadar';
import { WeightAnalysis } from './maven-tree/WeightAnalysis';
import { MavenNode } from './maven-tree/types';
import { parseMavenTree } from './maven-tree/parser';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// --- Components ---

const TreeNode = ({
  node,
  searchTerm,
  level = 0,
  showOnlyConflicts = false,
}: {
  node: MavenNode;
  searchTerm: string;
  level?: number;
  showOnlyConflicts?: boolean;
}) => {
  const { t } = useTranslation();
  
  // 简单的搜索匹配
  const matchesSearch = useMemo(() => {
    if (!searchTerm) return false;
    const term = searchTerm.toLowerCase();
    return (
      node.groupId?.toLowerCase().includes(term) ||
      node.artifactId?.toLowerCase().includes(term) ||
      node.version?.toLowerCase().includes(term)
    );
  }, [node, searchTerm]);

  // 计算子树状态：匹配数、冲突、托管
  const subTreeStats = useMemo(() => {
    let hasConflict = false;
    let hasManaged = false;
    let matchCount = 0;
    const term = searchTerm.toLowerCase();
    
    const check = (n: MavenNode) => {
      if (n.isConflict) hasConflict = true;
      if (n.isManaged) hasManaged = true;
      if (searchTerm && (
        n.groupId?.toLowerCase().includes(term) ||
        n.artifactId?.toLowerCase().includes(term) ||
        n.version?.toLowerCase().includes(term)
      )) {
        matchCount++;
      }
      n.children.forEach(check);
    };
    
    node.children.forEach(check);
    return { hasConflict, hasManaged, matchCount };
  }, [node, searchTerm]);

  // 是否在搜索路径上
  const hasMatchingChild = subTreeStats.matchCount > 0;

  // 核心逻辑：判断本节点或其子孙是否有冲突
  const hasConflictInPath = useMemo(() => {
    const check = (n: MavenNode): boolean => {
      if (n.isConflict) return true;
      return n.children.some(check);
    };
    return check(node);
  }, [node]);

  // 状态控制
  const [isExpanded, setIsExpanded] = useState(level === 0);

  // 响应式状态同步
  React.useEffect(() => {
    if (searchTerm) {
      if (hasMatchingChild || matchesSearch) {
        setIsExpanded(true);
      }
    } else if (showOnlyConflicts) {
      if (hasConflictInPath) {
        setIsExpanded(true);
      }
    } else if (!showOnlyConflicts && searchTerm === "" && level > 0) {
      setIsExpanded(false);
    } else if (level === 0) {
      setIsExpanded(true);
    }
  }, [searchTerm, showOnlyConflicts, hasMatchingChild, matchesSearch, hasConflictInPath, level]);

  // 【关键改进】过滤逻辑：如果是“只看冲突”模式，且本分支没冲突，直接隐藏
  // 但是根节点（level 0）始终保留，作为入口
  if (showOnlyConflicts && !hasConflictInPath && !node.isConflict && level > 0) {
    return null;
  }

  const isDanger = node.isConflict;
  const isDuplicate = node.isDuplicate;
  const isManaged = node.isManaged;
  
  // 样式计算 (IDEA 风格高对比度)
  let textColor = 'text-slate-950 dark:text-slate-50';
  let bgColor = 'bg-white dark:bg-transparent';
  let borderColor = 'border-transparent';
  let ringStyle = '';

  if (matchesSearch) {
    textColor = 'text-slate-950';
    bgColor = 'bg-yellow-400';
    ringStyle = 'ring-2 ring-yellow-600 ring-offset-1';
  } else if (isDanger) {
    textColor = 'text-red-700 dark:text-red-400 font-bold';
    bgColor = 'bg-red-500/10 dark:bg-red-900/20';
    borderColor = 'border-red-500/50 border-2';
    ringStyle = 'animate-pulse';
  } else if (isDuplicate) {
    textColor = 'text-slate-500 dark:text-slate-500 italic line-through decoration-slate-400/50';
  } else if (isManaged) {
    textColor = 'text-amber-700 dark:text-amber-400 font-bold';
  } else if (hasMatchingChild) {
    borderColor = 'border-yellow-400/50 border-dashed border-2';
  }

  return (
    <div
      id={matchesSearch ? `search-result-${node.id}` : undefined}
      className={`ml-4 border-l border-slate-300 dark:border-slate-800 pl-2 relative bg-white dark:bg-transparent`}
    >
      <div className={`flex items-center py-1 text-sm font-mono hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded px-1 group transition-all duration-200 ${matchesSearch || hasMatchingChild ? 'opacity-100' : (searchTerm ? 'opacity-50' : 'opacity-100')} ${bgColor} ${borderColor} ${ringStyle} border`}>
        {/* 展开/折叠 按钮 */}
        {node.children.length > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mr-1 p-0.5 hover:bg-muted rounded text-muted-foreground relative"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {/* 折叠态状态提示 */}
            {!isExpanded && (
              <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center gap-0.5">
                {subTreeStats.hasConflict && (
                  <div className="bg-red-600 text-white rounded-full p-0.5 shadow-sm animate-bounce" title={t('maven.node.contains_conflict')}>
                    <AlertTriangle className="w-2.5 h-2.5" />
                  </div>
                )}
                {subTreeStats.matchCount > 0 && (
                  <div className="bg-yellow-500 text-slate-950 text-[8px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-sm" title={t('maven.node.subtree_matches').replace('{n}', subTreeStats.matchCount.toString())}>
                    {subTreeStats.matchCount}
                  </div>
                )}
              </div>
            )}
          </button>
        ) : (
          <span className="w-5 mr-1 block"></span>
        )}

        {/* 节点内容 */}
        <div className={`flex flex-wrap items-center gap-2 ${textColor}`}>
          <span className="font-semibold" title="GroupId">{node.groupId}</span>
          <span className="text-muted-foreground">:</span>
          <span className="font-bold" title="ArtifactId">{node.artifactId}</span>
          <span className="text-muted-foreground">:</span>
          <span title="Version">{node.version}</span>
          
          {node.scope && (
             <span className="text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 ml-1 border border-slate-200 dark:border-slate-700">
               {node.scope}
             </span>
          )}

          {node.isConflict && (
              <span className="flex items-center text-[10px] font-bold text-red-700 dark:text-red-400 ml-2 border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded shadow-sm uppercase tracking-tighter">
                  <span className="relative flex h-2 w-2 mr-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  {t('maven.node.conflict')}: {node.conflictWinner}
              </span>
          )}
          
          {node.isDuplicate && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-2 font-bold italic tracking-widest uppercase">
                  ({t('maven.node.duplicate')})
              </span>
          )}

          {node.isManaged && (
              <span className="flex items-center text-[10px] font-bold text-amber-700 dark:text-amber-400 ml-2 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded shadow-sm uppercase tracking-tighter">
                  <Info className="w-3 h-3 mr-1" />
                  {t('maven.node.managed')} ({node.managedVersion})
              </span>
          )}
        </div>
      </div>

      {/* 递归渲染子节点 */}
      {isExpanded && node.children.length > 0 && (
        <div className="ml-2">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              searchTerm={searchTerm}
              level={level + 1}
              showOnlyConflicts={showOnlyConflicts}
            />
          ))}
        </div>
      )}
    </div>
  );
};


export default function MavenTree() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [treeData, setTreeData] = useState<MavenNode[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyConflicts, setShowOnlyConflicts] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 搜索结果计数
  const searchMatchCount = useMemo(() => {
    if (!searchTerm || !treeData) return 0;
    let count = 0;
    const term = searchTerm.toLowerCase();
    const traverse = (node: MavenNode) => {
      if (node.groupId?.toLowerCase().includes(term) ||
          node.artifactId?.toLowerCase().includes(term) ||
          node.version?.toLowerCase().includes(term)) {
        count++;
      }
      node.children.forEach(traverse);
    };
    treeData.forEach(traverse);
    return count;
  }, [treeData, searchTerm]);

  // 自动滚动到第一个搜索结果
  React.useEffect(() => {
    if (searchTerm && searchMatchCount > 0) {
      const timer = setTimeout(() => {
        const firstMatch = document.querySelector('[id^="search-result-"]');
        if (firstMatch) {
          firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, searchMatchCount]);

  const stats = useMemo(() => {
    if (!treeData) return null;
    let conflictCount = 0;
    let duplicateCount = 0;
    let managedCount = 0;

    const traverse = (node: MavenNode) => {
        if (node.isConflict) conflictCount++;
        if (node.isDuplicate) duplicateCount++;
        if (node.isManaged) managedCount++;
        node.children.forEach(traverse);
    };
    treeData.forEach(traverse);

    return { conflictCount, duplicateCount, managedCount };
  }, [treeData]);

  const handleParse = () => {
    if (!inputText.trim()) {
        setError(t('maven.input.error'));
        return;
    }
    try {
      const result = parseMavenTree(inputText);
      if (result.length === 0) {
          setError(t('maven.parse.error'));
          setTreeData(null);
      } else {
          setTreeData(result);
          setError(null);
          setShowOnlyConflicts(false);
          setSearchTerm('');
      }
    } catch (e) {
      setError(t('maven.parse.fail'));
      console.error(e);
    }
  };

  const clear = () => {
      setInputText('');
      setTreeData(null);
      setError(null);
  };


  const handleCopyCommand = () => {
    navigator.clipboard.writeText('mvn dependency:tree -Dverbose');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const loadExample = () => {
      const example = `[INFO] com.zhangdagou:fight-ai:jar:0.0.1
[INFO] +- com.alibaba:dashscope-sdk-java:jar:2.22.0:compile
[INFO] |  +- io.reactivex.rxjava2:rxjava:jar:2.2.21:compile
[INFO] |  |  \- org.reactivestreams:reactive-streams:jar:1.0.4:compile (version managed from 1.0.3)
[INFO] |  +- (org.projectlombok:lombok:jar:1.18.30:compile - version managed from 1.18.26; omitted for duplicate)
[INFO] |  +- com.google.code.gson:gson:jar:2.10.1:compile (version managed from 2.8.9)
[INFO] |  +- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 1.7.36; omitted for conflict with 1.7.30)
[INFO] |  +- org.jetbrains.kotlin:kotlin-stdlib-jdk8:jar:1.9.20:compile (version managed from 1.8.21)
[INFO] |  |  +- org.jetbrains.kotlin:kotlin-stdlib:jar:1.9.20:compile
[INFO] |  |  |  \- org.jetbrains:annotations:jar:13.0:compile
[INFO] |  |  \- org.jetbrains.kotlin:kotlin-stdlib-jdk7:jar:1.9.20:compile
[INFO] |  |     \- (org.jetbrains.kotlin:kotlin-stdlib:jar:1.9.20:compile - omitted for duplicate)
[INFO] |  +- com.squareup.okio:okio:jar:3.6.0:compile
[INFO] |  |  \- com.squareup.okio:okio-jvm:jar:3.6.0:compile
[INFO] |  |     +- (org.jetbrains.kotlin:kotlin-stdlib-jdk8:jar:1.9.20:compile - version managed from 1.9.10; omitted for duplicate)
[INFO] |  |     \- org.jetbrains.kotlin:kotlin-stdlib-common:jar:1.9.20:compile (version managed from 1.9.10)
[INFO] |  +- com.squareup.okhttp3:logging-interceptor:jar:4.12.0:compile
[INFO] |  |  +- (com.squareup.okhttp3:okhttp:jar:4.12.0:compile - omitted for duplicate)
[INFO] |  |  \- (org.jetbrains.kotlin:kotlin-stdlib-jdk8:jar:1.9.20:compile - version managed from 1.8.21; omitted for duplicate)
[INFO] |  +- com.squareup.okhttp3:okhttp-sse:jar:4.12.0:compile
[INFO] |  |  +- (com.squareup.okhttp3:okhttp:jar:4.12.0:compile - omitted for duplicate)
[INFO] |  |  \- (org.jetbrains.kotlin:kotlin-stdlib-jdk8:jar:1.9.20:compile - version managed from 1.8.21; omitted for duplicate)
[INFO] |  +- com.squareup.okhttp3:okhttp:jar:4.12.0:compile
[INFO] |  |  +- (com.squareup.okio:okio:jar:3.6.0:compile - omitted for duplicate)
[INFO] |  |  \- (org.jetbrains.kotlin:kotlin-stdlib-jdk8:jar:1.9.20:compile - version managed from 1.8.21; omitted for duplicate)
[INFO] |  \- com.github.victools:jsonschema-generator:jar:4.31.1:compile
[INFO] |     +- com.fasterxml:classmate:jar:1.6.0:compile (version managed from 1.5.1)
[INFO] |     +- com.fasterxml.jackson.core:jackson-core:jar:2.15.3:compile (version managed from 2.14.2)
[INFO] |     +- com.fasterxml.jackson.core:jackson-databind:jar:2.15.3:compile (version managed from 2.14.2)
[INFO] |     |  +- com.fasterxml.jackson.core:jackson-annotations:jar:2.15.3:compile
[INFO] |     |  \- (com.fasterxml.jackson.core:jackson-core:jar:2.15.3:compile - version managed from 2.14.2; omitted for duplicate)
[INFO] |     \- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 2.0.3; omitted for duplicate)
[INFO] +- org.springframework.boot:spring-boot-starter:jar:3.2.0:compile
[INFO] |  +- org.springframework.boot:spring-boot:jar:3.2.0:compile
[INFO] |  |  +- (org.springframework:spring-core:jar:6.1.1:compile - omitted for duplicate)
[INFO] |  |  \- org.springframework:spring-context:jar:6.1.1:compile
[INFO] |  |     +- (org.springframework:spring-aop:jar:6.1.1:compile - omitted for duplicate)
[INFO] |  |     +- (org.springframework:spring-beans:jar:6.1.1:compile - omitted for duplicate)
[INFO] |  |     +- (org.springframework:spring-core:jar:6.1.1:compile - omitted for duplicate)
[INFO] |  |     +- (org.springframework:spring-expression:jar:6.1.1:compile - omitted for duplicate)
[INFO] |  |     \- (io.micrometer:micrometer-observation:jar:1.12.0:compile - omitted for duplicate)
[INFO] |  +- org.springframework.boot:spring-boot-autoconfigure:jar:3.2.0:compile
[INFO] |  |  \- (org.springframework.boot:spring-boot:jar:3.2.0:compile - omitted for duplicate)
[INFO] |  +- org.springframework.boot:spring-boot-starter-logging:jar:3.2.0:compile
[INFO] |  |  +- ch.qos.logback:logback-classic:jar:1.4.11:compile
[INFO] |  |  |  +- ch.qos.logback:logback-core:jar:1.4.11:compile
[INFO] |  |  |  \- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 2.0.7; omitted for duplicate)
[INFO] |  |  +- org.apache.logging.log4j:log4j-to-slf4j:jar:2.21.1:compile
[INFO] |  |  |  +- org.apache.logging.log4j:log4j-api:jar:2.21.1:compile
[INFO] |  |  |  \- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 1.7.36; omitted for duplicate)
[INFO] |  |  \- org.slf4j:jul-to-slf4j:jar:2.0.9:compile
[INFO] |  |     \- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 1.7.36; omitted for duplicate)
[INFO] |  +- jakarta.annotation:jakarta.annotation-api:jar:2.1.1:compile
[INFO] |  +- org.springframework:spring-core:jar:6.1.1:compile
[INFO] |  |  \- org.springframework:spring-jcl:jar:6.1.1:compile
[INFO] |  \- org.yaml:snakeyaml:jar:2.2:compile
[INFO] +- org.slf4j:slf4j-api:jar:1.7.30:compile
[INFO] +- org.springframework.boot:spring-boot-starter-test:jar:3.2.0:test
[INFO] |  +- (org.springframework.boot:spring-boot-starter:jar:3.2.0:test - omitted for duplicate)
[INFO] |  +- org.springframework.boot:spring-boot-test:jar:3.2.0:test
[INFO] |  |  \- (org.springframework.boot:spring-boot:jar:3.2.0:test - omitted for duplicate)
[INFO] |  +- org.springframework.boot:spring-boot-test-autoconfigure:jar:3.2.0:test
[INFO] |  |  +- (org.springframework.boot:spring-boot:jar:3.2.0:test - omitted for duplicate)
[INFO] |  |  +- (org.springframework.boot:spring-boot-test:jar:3.2.0:test - omitted for duplicate)
[INFO] |  |  \- (org.springframework.boot:spring-boot-autoconfigure:jar:3.2.0:test - omitted for duplicate)
[INFO] |  +- com.jayway.jsonpath:json-path:jar:2.8.0:test
[INFO] |  |  +- (net.minidev:json-smart:jar:2.5.0:test - version managed from 2.4.10; omitted for duplicate)
[INFO] |  |  \- (org.slf4j:slf4j-api:jar:2.0.9:test - version managed from 1.7.36; omitted for conflict with 1.7.30)
[INFO] |  +- (jakarta.xml.bind:jakarta.xml.bind-api:jar:4.0.1:compile - scope updated from test; omitted for duplicate)
[INFO] |  +- net.minidev:json-smart:jar:2.5.0:test
[INFO] |  |  \- net.minidev:accessors-smart:jar:2.5.0:test
[INFO] |  |     \- (org.ow2.asm:asm:jar:9.3:compile - scope updated from test; omitted for duplicate)
[INFO] |  +- org.assertj:assertj-core:jar:3.24.2:test
[INFO] |  |  \- net.bytebuddy:byte-buddy:jar:1.14.10:test (version managed from 1.12.21)
[INFO] |  +- org.awaitility:awaitility:jar:4.2.0:test
[INFO] |  |  \- (org.hamcrest:hamcrest:jar:2.2:test - version managed from 2.1; omitted for duplicate)
[INFO] |  +- org.hamcrest:hamcrest:jar:2.2:test
[INFO] |  +- org.junit.jupiter:junit-jupiter:jar:5.10.1:test
[INFO] |  |  +- org.junit.jupiter:junit-jupiter-api:jar:5.10.1:test
[INFO] |  |  |  +- org.opentest4j:opentest4j:jar:1.3.0:test
[INFO] |  |  |  +- org.junit.platform:junit-platform-commons:jar:1.10.1:test
[INFO] |  |  |  |  \- (org.apiguardian:apiguardian-api:jar:1.1.2:test - omitted for duplicate)
[INFO] |  |  |  \- org.apiguardian:apiguardian-api:jar:1.1.2:test
[INFO] |  |  +- org.junit.jupiter:junit-jupiter-params:jar:5.10.1:test
[INFO] |  |  |  +- (org.junit.jupiter:junit-jupiter-api:jar:5.10.1:test - omitted for duplicate)
[INFO] |  |  |  \- (org.apiguardian:apiguardian-api:jar:1.1.2:test - omitted for duplicate)
[INFO] |  |  \- org.junit.jupiter:junit-jupiter-engine:jar:5.10.1:test
[INFO] |  |     +- org.junit.platform:junit-platform-engine:jar:1.10.1:test
[INFO] |  |     |  +- (org.opentest4j:opentest4j:jar:1.3.0:test - omitted for duplicate)
[INFO] |  |     |  +- (org.junit.platform:junit-platform-commons:jar:1.10.1:test - omitted for duplicate)
[INFO] |  |     |  \- (org.apiguardian:apiguardian-api:jar:1.1.2:test - omitted for duplicate)
[INFO] |  |     +- (org.junit.jupiter:junit-jupiter-api:jar:5.10.1:test - omitted for duplicate)
[INFO] |  |     \- (org.apiguardian:apiguardian-api:jar:1.1.2:test - omitted for duplicate)
[INFO] |  +- org.mockito:mockito-core:jar:5.7.0:test
[INFO] |  |  +- (net.bytebuddy:byte-buddy:jar:1.14.10:test - version managed from 1.14.9; omitted for duplicate)
[INFO] |  |  +- net.bytebuddy:byte-buddy-agent:jar:1.14.10:test (version managed from 1.14.9)
[INFO] |  |  \- org.objenesis:objenesis:jar:3.3:test
[INFO] |  +- org.mockito:mockito-junit-jupiter:jar:5.7.0:test
[INFO] |  |  +- (org.mockito:mockito-core:jar:5.7.0:test - omitted for duplicate)
[INFO] |  |  \- (org.junit.jupiter:junit-jupiter-api:jar:5.10.1:test - version managed from 5.10.0; omitted for duplicate)
[INFO] |  +- org.skyscreamer:jsonassert:jar:1.5.1:test
[INFO] |  |  \- com.vaadin.external.google:android-json:jar:0.0.20131108.vaadin1:test
[INFO] |  +- (org.springframework:spring-core:jar:6.1.1:test - omitted for duplicate)
[INFO] |  +- org.springframework:spring-test:jar:6.1.1:test
[INFO] |  |  \- (org.springframework:spring-core:jar:6.1.1:test - omitted for duplicate)
[INFO] |  \- org.xmlunit:xmlunit-core:jar:2.9.1:test
[INFO] +- org.springframework.boot:spring-boot-starter-web:jar:3.2.0:compile
[INFO] |  +- (org.springframework.boot:spring-boot-starter:jar:3.2.0:compile - omitted for duplicate)
[INFO] |  +- org.springframework.boot:spring-boot-starter-json:jar:3.2.0:compile
[INFO] |  |  +- (org.springframework.boot:spring-boot-starter:jar:3.2.0:compile - omitted for duplicate)
[INFO] |  |  +- (org.springframework:spring-web:jar:6.1.1:compile - omitted for duplicate)
[INFO] |  |  +- (com.fasterxml.jackson.core:jackson-databind:jar:2.15.3:compile - version managed from 2.14.2; omitted for duplicate)
[INFO] |  |  +- com.fasterxml.jackson.datatype:jackson-datatype-jdk8:jar:2.15.3:compile
[INFO] |  |  |  +- (com.fasterxml.jackson.core:jackson-core:jar:2.15.3:compile - version managed from 2.14.2; omitted for duplicate)
[INFO] |  |  |  \- (com.fasterxml.jackson.core:jackson-databind:jar:2.15.3:compile - version managed from 2.14.2; omitted for duplicate)
[INFO] |  |  +- com.fasterxml.jackson.datatype:jackson-datatype-jsr310:jar:2.15.3:compile
[INFO] |  |  |  +- (com.fasterxml.jackson.core:jackson-annotations:jar:2.15.3:compile - omitted for duplicate)
[INFO] |  |  |  +- (com.fasterxml.jackson.core:jackson-core:jar:2.15.3:compile - version managed from 2.14.2; omitted for duplicate)
[INFO] |  |  |  \- (com.fasterxml.jackson.core:jackson-databind:jar:2.15.3:compile - version managed from 2.14.2; omitted for duplicate)
[INFO] |  |  \- com.fasterxml.jackson.module:jackson-module-parameter-names:jar:2.15.3:compile
[INFO] |  |     +- (com.fasterxml.jackson.core:jackson-core:jar:2.15.3:compile - version managed from 2.14.2; omitted for duplicate)
[INFO] |  |     \- (com.fasterxml.jackson.core:jackson-databind:jar:2.15.3:compile - version managed from 2.14.2; omitted for duplicate)
[INFO] |  +- org.springframework.boot:spring-boot-starter-tomcat:jar:3.2.0:compile
[INFO] |  |  +- (jakarta.annotation:jakarta.annotation-api:jar:2.1.1:compile - omitted for duplicate)
[INFO] |  |  +- org.apache.tomcat.embed:tomcat-embed-core:jar:10.1.16:compile
[INFO] |  |  +- org.apache.tomcat.embed:tomcat-embed-el:jar:10.1.16:compile
[INFO] |  |  \- org.apache.tomcat.embed:tomcat-embed-websocket:jar:10.1.16:compile
[INFO] |  |     \- (org.apache.tomcat.embed:tomcat-embed-core:jar:10.1.16:compile - omitted for duplicate)
[INFO] |  +- org.springframework:spring-web:jar:6.1.1:compile
[INFO] |  |  +- org.springframework:spring-beans:jar:6.1.1:compile
[INFO] |  |  |  \- (org.springframework:spring-core:jar:6.1.1:compile - omitted for duplicate)
[INFO] |  |  +- (org.springframework:spring-core:jar:6.1.1:compile - omitted for duplicate)
[INFO] |  |  \- io.micrometer:micrometer-observation:jar:1.12.0:compile
[INFO] |  |     \- io.micrometer:micrometer-commons:jar:1.12.0:compile
[INFO] |  \- org.springframework:spring-webmvc:jar:6.1.1:compile
[INFO] |     +- org.springframework:spring-aop:jar:6.1.1:compile
[INFO] |     |  +- (org.springframework:spring-beans:jar:6.1.1:compile - omitted for duplicate)
[INFO] |     |  \- (org.springframework:spring-core:jar:6.1.1:compile - omitted for duplicate)
[INFO] |     +- (org.springframework:spring-beans:jar:6.1.1:compile - omitted for duplicate)
[INFO] |     +- (org.springframework:spring-context:jar:6.1.1:compile - omitted for duplicate)
[INFO] |     +- (org.springframework:spring-core:jar:6.1.1:compile - omitted for duplicate)
[INFO] |     +- org.springframework:spring-expression:jar:6.1.1:compile
[INFO] |     |  \- (org.springframework:spring-core:jar:6.1.1:compile - omitted for duplicate)
[INFO] |     \- (org.springframework:spring-web:jar:6.1.1:compile - omitted for duplicate)
[INFO] +- org.projectlombok:lombok:jar:1.18.30:compile
[INFO] +- group.springframework.ai:spring-ai-dashscope-spring-boot-starter:jar:1.1.0:compile
[INFO] |  +- (org.springframework.boot:spring-boot-starter:jar:3.2.0:compile - version managed from 3.3.0; omitted for duplicate)
[INFO] |  +- group.springframework.ai:spring-ai-spring-boot-autoconfigure:jar:1.1.0:compile
[INFO] |  |  +- com.google.protobuf:protobuf-java:jar:3.25.2:compile
[INFO] |  |  +- (org.springframework.boot:spring-boot-starter:jar:3.2.0:compile - version managed from 3.3.0; omitted for duplicate)
[INFO] |  |  +- io.netty:netty-codec-http2:jar:4.1.101.Final:compile (version managed from 4.1.100.Final)
[INFO] |  |  |  +- io.netty:netty-common:jar:4.1.101.Final:compile
[INFO] |  |  |  +- io.netty:netty-buffer:jar:4.1.101.Final:compile
[INFO] |  |  |  |  \- (io.netty:netty-common:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  +- io.netty:netty-transport:jar:4.1.101.Final:compile
[INFO] |  |  |  |  +- (io.netty:netty-common:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  |  +- (io.netty:netty-buffer:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  |  \- io.netty:netty-resolver:jar:4.1.101.Final:compile
[INFO] |  |  |  |     \- (io.netty:netty-common:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  +- io.netty:netty-codec:jar:4.1.101.Final:compile
[INFO] |  |  |  |  +- (io.netty:netty-common:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  |  +- (io.netty:netty-buffer:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  |  \- (io.netty:netty-transport:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  +- io.netty:netty-handler:jar:4.1.101.Final:compile
[INFO] |  |  |  |  +- (io.netty:netty-common:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  |  +- (io.netty:netty-resolver:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  |  +- (io.netty:netty-buffer:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  |  +- (io.netty:netty-transport:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  |  +- io.netty:netty-transport-native-unix-common:jar:4.1.101.Final:compile
[INFO] |  |  |  |  |  +- (io.netty:netty-common:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  |  |  +- (io.netty:netty-buffer:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  |  |  \- (io.netty:netty-transport:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  |  \- (io.netty:netty-codec:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |  \- io.netty:netty-codec-http:jar:4.1.101.Final:compile
[INFO] |  |  |     +- (io.netty:netty-common:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |     +- (io.netty:netty-buffer:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |     +- (io.netty:netty-transport:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |     +- (io.netty:netty-codec:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  |     \- (io.netty:netty-handler:jar:4.1.101.Final:compile - omitted for duplicate)
[INFO] |  |  \- redis.clients:jedis:jar:5.0.2:compile (version managed from 5.1.0)
[INFO] |  |     +- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 1.7.36; omitted for conflict with 1.7.30)
[INFO] |  |     +- org.apache.commons:commons-pool2:jar:2.12.0:compile (version managed from 2.11.1)
[INFO] |  |     +- org.json:json:jar:20231013:compile
[INFO] |  |     \- (com.google.code.gson:gson:jar:2.10.1:compile - version managed from 2.8.9; omitted for duplicate)
[INFO] |  \- group.springframework.ai:spring-ai-dashscope:jar:1.1.0:compile
[INFO] |     +- (group.springframework.ai:spring-ai-core:jar:1.1.0:compile - omitted for duplicate)
[INFO] |     +- group.springframework.ai:spring-ai-retry:jar:1.1.0:compile
[INFO] |     |  +- (group.springframework.ai:spring-ai-core:jar:1.1.0:compile - omitted for duplicate)
[INFO] |     |  +- org.springframework.retry:spring-retry:jar:2.0.4:compile (version managed from 2.0.5)
[INFO] |     |  \- org.springframework:spring-webflux:jar:6.1.1:compile (version managed from 6.1.8)
[INFO] |     |     +- (org.springframework:spring-beans:jar:6.1.1:compile - omitted for duplicate)
[INFO] |     |     +- (org.springframework:spring-core:jar:6.1.1:compile - version managed from 6.1.5; omitted for duplicate)
[INFO] |     |     +- (org.springframework:spring-web:jar:6.1.1:compile - omitted for duplicate)
[INFO] |     |     \- (io.projectreactor:reactor-core:jar:3.6.0:compile - version managed from 3.6.6; omitted for duplicate)
[INFO] |     +- (org.springframework.boot:spring-boot:jar:3.2.0:compile - version managed from 3.3.0; omitted for duplicate)
[INFO] |     +- io.rest-assured:json-path:jar:5.3.2:compile (version managed from 5.4.0)
[INFO] |     |  +- org.apache.groovy:groovy-json:jar:4.0.15:compile (version managed from 4.0.11)
[INFO] |     |  |  \- (org.apache.groovy:groovy:jar:4.0.15:compile - version managed from 4.0.11; omitted for duplicate)
[INFO] |     |  +- org.apache.groovy:groovy:jar:4.0.15:compile
[INFO] |     |  \- io.rest-assured:rest-assured-common:jar:5.3.2:compile
[INFO] |     |     +- (org.apache.groovy:groovy:jar:4.0.15:compile - version managed from 4.0.11; omitted for duplicate)
[INFO] |     |     \- (org.apache.commons:commons-lang3:jar:3.13.0:compile - version managed from 3.10; omitted for duplicate)
[INFO] |     +- (com.github.victools:jsonschema-generator:jar:4.31.1:compile - omitted for duplicate)
[INFO] |     +- com.github.victools:jsonschema-module-jackson:jar:4.31.1:compile
[INFO] |     |  \- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 2.0.3; omitted for conflict with 1.7.30)
[INFO] |     +- (org.springframework:spring-context-support:jar:6.1.1:compile - version managed from 6.1.8; omitted for duplicate)
[INFO] |     \- (org.springframework.boot:spring-boot-starter-logging:jar:3.2.0:compile - version managed from 3.3.0; omitted for duplicate)
[INFO] +- group.springframework.ai:spring-ai-milvus-store-spring-boot-starter:jar:1.1.0:compile
[INFO] |  +- (org.springframework.boot:spring-boot-starter:jar:3.2.0:compile - version managed from 3.3.0; omitted for duplicate)
[INFO] |  +- (group.springframework.ai:spring-ai-spring-boot-autoconfigure:jar:1.1.0:compile - omitted for duplicate)
[INFO] |  \- group.springframework.ai:spring-ai-milvus-store:jar:1.1.0:compile
[INFO] |     +- (group.springframework.ai:spring-ai-core:jar:1.1.0:compile - omitted for duplicate)
[INFO] |     \- io.milvus:milvus-sdk-java:jar:2.3.4:compile
[INFO] |        +- io.grpc:grpc-netty:jar:1.59.1:compile
[INFO] |        |  +- io.grpc:grpc-core:jar:1.59.1:compile
[INFO] |        |  |  +- (io.grpc:grpc-api:jar:1.59.1:compile - omitted for duplicate)
[INFO] |        |  |  +- (com.google.code.gson:gson:jar:2.10.1:runtime - version managed from 2.8.9; omitted for duplicate)
[INFO] |        |  |  +- com.google.android:annotations:jar:4.1.1.4:runtime
[INFO] |        |  |  +- org.codehaus.mojo:animal-sniffer-annotations:jar:1.23:runtime
[INFO] |        |  |  +- (com.google.errorprone:error_prone_annotations:jar:2.20.0:compile - scope updated from runtime; omitted for duplicate)
[INFO] |        |  |  +- (com.google.guava:guava:jar:32.0.1-android:runtime - omitted for duplicate)
[INFO] |        |  |  +- (io.perfmark:perfmark-api:jar:0.26.0:runtime - omitted for duplicate)
[INFO] |        |  |  +- io.grpc:grpc-context:jar:1.59.1:runtime
[INFO] |        |  |  |  \- (io.grpc:grpc-api:jar:1.59.1:runtime - omitted for duplicate)
[INFO] |        |  |  +- (io.grpc:grpc-core:jar:1.59.1:runtime - omitted for cycle)
[INFO] |        |  |  \- io.grpc:grpc-util:jar:1.59.1:runtime
[INFO] |        |  +- (io.netty:netty-codec-http2:jar:4.1.101.Final:compile - version managed from 4.1.97.Final; omitted for duplicate)
[INFO] |        |  +- io.netty:netty-handler-proxy:jar:4.1.101.Final:runtime (version managed from 4.1.97.Final)
[INFO] |        |  |  +- (io.netty:netty-common:jar:4.1.101.Final:runtime - omitted for duplicate)
[INFO] |        |  |  +- (io.netty:netty-buffer:jar:4.1.101.Final:runtime - omitted for duplicate)
[INFO] |        |  |  +- (io.netty:netty-transport:jar:4.1.101.Final:runtime - omitted for duplicate)
[INFO] |        |  |  +- (io.netty:netty-codec:jar:4.1.101.Final:runtime - omitted for duplicate)
[INFO] |        |  |  +- io.netty:netty-codec-socks:jar:4.1.101.Final:runtime
[INFO] |        |  |  |  +- (io.netty:netty-common:jar:4.1.101.Final:runtime - omitted for duplicate)
[INFO] |        |  |  |  +- (io.netty:netty-buffer:jar:4.1.101.Final:runtime - omitted for duplicate)
[INFO] |        |  |  |  +- (io.netty:netty-transport:jar:4.1.101.Final:runtime - omitted for duplicate)
[INFO] |        |  |  |  \- (io.netty:netty-codec:jar:4.1.101.Final:runtime - omitted for duplicate)
[INFO] |        |  |  \- (io.netty:netty-codec-http:jar:4.1.101.Final:runtime - omitted for duplicate)
[INFO] |        |  +- (com.google.guava:guava:jar:32.0.1-android:compile - scope updated from runtime; omitted for duplicate)
[INFO] |        |  +- (com.google.errorprone:error_prone_annotations:jar:2.20.0:compile - scope updated from runtime; omitted for duplicate)
[INFO] |        |  +- io.perfmark:perfmark-api:jar:0.26.0:runtime
[INFO] |        |  \- (io.netty:netty-transport-native-unix-common:jar:4.1.101.Final:runtime - version managed from 4.1.97.Final; omitted for duplicate)
[INFO] |        +- io.grpc:grpc-protobuf:jar:1.59.1:compile
[INFO] |        |  +- io.grpc:grpc-api:jar:1.59.1:compile
[INFO] |        |  |  +- (com.google.code.findbugs:jsr305:jar:3.0.2:compile - omitted for duplicate)
[INFO] |        |  |  +- com.google.errorprone:error_prone_annotations:jar:2.20.0:compile
[INFO] |        |  |  \- (com.google.guava:guava:jar:32.0.1-android:runtime - omitted for duplicate)
[INFO] |        |  +- com.google.code.findbugs:jsr305:jar:3.0.2:compile
[INFO] |        |  +- (com.google.protobuf:protobuf-java:jar:3.24.0:compile - omitted for conflict with 3.25.2)
[INFO] |        |  +- com.google.api.grpc:proto-google-common-protos:jar:2.22.0:compile
[INFO] |        |  |  \- (com.google.protobuf:protobuf-java:jar:3.23.2:compile - omitted for conflict with 3.25.2)
[INFO] |        |  +- io.grpc:grpc-protobuf-lite:jar:1.59.1:compile
[INFO] |        |  |  +- (io.grpc:grpc-api:jar:1.59.1:compile - omitted for duplicate)
[INFO] |        |  |  +- (com.google.code.findbugs:jsr305:jar:3.0.2:runtime - omitted for duplicate)
[INFO] |        |  |  \- (com.google.guava:guava:jar:32.0.1-android:runtime - omitted for duplicate)
[INFO] |        |  \- (com.google.guava:guava:jar:32.0.1-android:runtime - omitted for duplicate)
[INFO] |        +- io.grpc:grpc-stub:jar:1.59.1:compile
[INFO] |        |  +- (io.grpc:grpc-api:jar:1.59.1:compile - omitted for duplicate)
[INFO] |        |  +- com.google.guava:guava:jar:32.0.1-android:compile
[INFO] |        |  |  +- com.google.guava:failureaccess:jar:1.0.1:compile
[INFO] |        |  |  +- com.google.guava:listenablefuture:jar:9999.0-empty-to-avoid-conflict-with-guava:compile
[INFO] |        |  |  +- (com.google.code.findbugs:jsr305:jar:3.0.2:compile - omitted for duplicate)
[INFO] |        |  |  +- org.checkerframework:checker-qual:jar:3.33.0:compile
[INFO] |        |  |  +- (com.google.errorprone:error_prone_annotations:jar:2.18.0:compile - omitted for conflict with 2.20.0)
[INFO] |        |  |  \- com.google.j2objc:j2objc-annotations:jar:2.8:compile
[INFO] |        |  \- (com.google.errorprone:error_prone_annotations:jar:2.20.0:compile - scope updated from runtime; omitted for duplicate)
[INFO] |        +- (com.google.protobuf:protobuf-java:jar:3.24.0:compile - omitted for conflict with 3.25.2)
[INFO] |        +- org.apache.commons:commons-text:jar:1.10.0:compile
[INFO] |        |  \- (org.apache.commons:commons-lang3:jar:3.13.0:compile - version managed from 3.12.0; omitted for duplicate)
[INFO] |        +- org.apache.commons:commons-collections4:jar:4.3:compile
[INFO] |        +- (com.fasterxml.jackson.core:jackson-databind:jar:2.15.3:compile - version managed from 2.12.7.1; omitted for duplicate)
[INFO] |        +- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 1.7.30; omitted for conflict with 1.7.30)
[INFO] |        +- org.apache.logging.log4j:log4j-slf4j-impl:jar:2.21.1:compile (version managed from 2.17.1)
[INFO] |        |  +- (org.apache.logging.log4j:log4j-api:jar:2.21.1:compile - omitted for duplicate)
[INFO] |        |  +- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 1.7.25; omitted for conflict with 1.7.30)
[INFO] |        |  \- org.apache.logging.log4j:log4j-core:jar:2.21.1:runtime
[INFO] |        |     \- (org.apache.logging.log4j:log4j-api:jar:2.21.1:runtime - omitted for duplicate)
[INFO] |        +- (com.squareup.okhttp3:okhttp:jar:4.12.0:compile - version managed from 4.10.0; omitted for duplicate)
[INFO] |        +- org.codehaus.plexus:plexus-utils:jar:3.0.24:compile
[INFO] |        +- (com.google.code.gson:gson:jar:2.10.1:compile - version managed from 2.8.9; omitted for duplicate)
[INFO] |        +- (org.jetbrains.kotlin:kotlin-stdlib:jar:1.9.20:compile - version managed from 1.6.20; omitted for duplicate)
[INFO] |        \- com.alibaba:fastjson:jar:1.2.83:compile
[INFO] +- org.springframework.boot:spring-boot-starter-cache:jar:3.2.0:compile
[INFO] |  +- (org.springframework.boot:spring-boot-starter:jar:3.2.0:compile - version managed from 3.3.0; omitted for duplicate)
[INFO] |  \- org.springframework:spring-context-support:jar:6.1.1:compile
[INFO] |     +- (org.springframework:spring-beans:jar:6.1.1:compile - omitted for duplicate)
[INFO] |     +- (org.springframework:spring-context:jar:6.1.1:compile - version managed from 6.1.8; omitted for duplicate)
[INFO] |     \- (org.springframework:spring-core:jar:6.1.1:compile - version managed from 6.1.5; omitted for duplicate)
[INFO] +- group.springframework.ai:spring-ai-tika-document-reader:jar:1.1.0:compile
[INFO] |  +- group.springframework.ai:spring-ai-core:jar:1.1.0:compile
[INFO] |  |  +- io.swagger.core.v3:swagger-annotations:jar:2.2.20:compile
[INFO] |  |  +- com.github.victools:jsonschema-module-swagger-2:jar:4.35.0:compile
[INFO] |  |  |  \- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 2.0.3; omitted for conflict with 1.7.30)
[INFO] |  |  +- org.springframework.cloud:spring-cloud-function-context:jar:4.1.1:compile
[INFO] |  |  |  +- net.jodah:typetools:jar:0.6.2:compile
[INFO] |  |  |  +- (org.springframework.boot:spring-boot-autoconfigure:jar:3.2.0:compile - version managed from 3.2.4; omitted for duplicate)
[INFO] |  |  |  +- org.springframework.cloud:spring-cloud-function-core:jar:4.1.1:compile
[INFO] |  |  |  |  +- (io.projectreactor:reactor-core:jar:3.6.0:compile - version managed from 3.6.6; omitted for duplicate)
[INFO] |  |  |  |  \- (org.springframework:spring-core:jar:6.1.1:compile - version managed from 6.1.5; omitted for duplicate)
[INFO] |  |  |  +- (org.springframework:spring-messaging:jar:6.1.1:compile - version managed from 6.1.8; omitted for duplicate)
[INFO] |  |  |  \- (com.fasterxml.jackson.core:jackson-databind:jar:2.15.3:compile - version managed from 2.15.4; omitted for duplicate)
[INFO] |  |  +- org.antlr:stringtemplate:jar:4.0.2:compile
[INFO] |  |  |  +- (org.antlr:stringtemplate:jar:3.2.1:compile - omitted for cycle)
[INFO] |  |  |  \- org.antlr:antlr-runtime:jar:3.3:compile
[INFO] |  |  +- org.antlr:antlr4-runtime:jar:4.13.1:compile
[INFO] |  |  +- io.projectreactor:reactor-core:jar:3.6.0:compile
[INFO] |  |  |  \- (org.reactivestreams:reactive-streams:jar:1.0.4:compile - version managed from 1.0.3; omitted for duplicate)
[INFO] |  |  +- (org.springframework:spring-context:jar:6.1.1:compile - version managed from 6.1.8; omitted for duplicate)
[INFO] |  |  +- org.springframework:spring-messaging:jar:6.1.1:compile
[INFO] |  |  |  +- (org.springframework:spring-beans:jar:6.1.1:compile - omitted for duplicate)
[INFO] |  |  |  \- (org.springframework:spring-core:jar:6.1.1:compile - version managed from 6.1.5; omitted for duplicate)
[INFO] |  |  +- com.knuddels:jtokkit:jar:1.0.0:compile
[INFO] |  |  +- (com.github.victools:jsonschema-generator:jar:4.35.0:compile - omitted for conflict with 4.31.1)
[INFO] |  |  +- (com.github.victools:jsonschema-module-jackson:jar:4.35.0:compile - omitted for conflict with 4.31.1)
[INFO] |  |  +- (com.fasterxml.jackson.core:jackson-databind:jar:2.15.3:compile - version managed from 2.16.1; omitted for duplicate)
[INFO] |  |  \- (com.fasterxml.jackson.datatype:jackson-datatype-jsr310:jar:2.15.3:compile - version managed from 2.16.1; omitted for duplicate)
[INFO] |  +- org.apache.tika:tika-core:jar:2.9.0:compile
[INFO] |  |  +- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 2.0.7; omitted for conflict with 1.7.30)
[INFO] |  |  \- commons-io:commons-io:jar:2.13.0:compile
[INFO] |  \- org.apache.tika:tika-parsers-standard-package:jar:2.9.0:compile
[INFO] |     +- org.apache.tika:tika-parser-apple-module:jar:2.9.0:compile
[INFO] |     |  +- org.apache.tika:tika-parser-zip-commons:jar:2.9.0:compile
[INFO] |     |  |  \- (org.apache.commons:commons-compress:jar:1.23.0:compile - omitted for duplicate)
[INFO] |     |  \- com.googlecode.plist:dd-plist:jar:1.27:compile
[INFO] |     +- org.apache.tika:tika-parser-audiovideo-module:jar:2.9.0:compile
[INFO] |     |  \- com.drewnoakes:metadata-extractor:jar:2.18.0:compile
[INFO] |     |     \- com.adobe.xmp:xmpcore:jar:6.1.11:compile
[INFO] |     +- org.apache.tika:tika-parser-cad-module:jar:2.9.0:compile
[INFO] |     |  +- (org.apache.tika:tika-parser-microsoft-module:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  +- (com.fasterxml.jackson.core:jackson-core:jar:2.15.3:compile - version managed from 2.15.2; omitted for duplicate)
[INFO] |     |  \- (com.fasterxml.jackson.core:jackson-databind:jar:2.15.3:compile - version managed from 2.15.2; omitted for duplicate)
[INFO] |     +- org.apache.tika:tika-parser-code-module:jar:2.9.0:compile
[INFO] |     |  +- (org.apache.tika:tika-parser-text-module:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  +- org.codelibs:jhighlight:jar:1.1.0:compile
[INFO] |     |  |  \- (commons-io:commons-io:jar:2.7:compile - omitted for conflict with 2.13.0)
[INFO] |     |  +- org.ccil.cowan.tagsoup:tagsoup:jar:1.2.1:compile
[INFO] |     |  +- org.ow2.asm:asm:jar:9.3:compile
[INFO] |     |  +- com.epam:parso:jar:2.0.14:compile
[INFO] |     |  |  \- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 1.7.5; omitted for conflict with 1.7.30)
[INFO] |     |  \- org.tallison:jmatio:jar:1.5:compile
[INFO] |     |     \- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 1.7.25; omitted for conflict with 1.7.30)
[INFO] |     +- org.apache.tika:tika-parser-crypto-module:jar:2.9.0:compile
[INFO] |     |  +- org.bouncycastle:bcmail-jdk18on:jar:1.76:compile
[INFO] |     |  |  +- (org.bouncycastle:bcprov-jdk18on:jar:1.76:compile - omitted for duplicate)
[INFO] |     |  |  +- org.bouncycastle:bcutil-jdk18on:jar:1.76:compile
[INFO] |     |  |  |  \- (org.bouncycastle:bcprov-jdk18on:jar:1.76:compile - omitted for duplicate)
[INFO] |     |  |  \- org.bouncycastle:bcpkix-jdk18on:jar:1.76:compile
[INFO] |     |  |     +- (org.bouncycastle:bcprov-jdk18on:jar:1.76:compile - omitted for duplicate)
[INFO] |     |  |     \- (org.bouncycastle:bcutil-jdk18on:jar:1.76:compile - omitted for duplicate)
[INFO] |     |  \- org.bouncycastle:bcprov-jdk18on:jar:1.76:compile
[INFO] |     +- org.apache.tika:tika-parser-digest-commons:jar:2.9.0:compile
[INFO] |     |  +- commons-codec:commons-codec:jar:1.16.0:compile
[INFO] |     |  +- (org.bouncycastle:bcmail-jdk18on:jar:1.76:compile - omitted for duplicate)
[INFO] |     |  \- (org.bouncycastle:bcprov-jdk18on:jar:1.76:compile - omitted for duplicate)
[INFO] |     +- org.apache.tika:tika-parser-font-module:jar:2.9.0:compile
[INFO] |     |  \- (org.apache.pdfbox:fontbox:jar:2.0.29:compile - omitted for conflict with 2.0.30)
[INFO] |     +- org.apache.tika:tika-parser-html-module:jar:2.9.0:compile
[INFO] |     |  +- (org.ccil.cowan.tagsoup:tagsoup:jar:1.2.1:compile - omitted for duplicate)
[INFO] |     |  \- (commons-codec:commons-codec:jar:1.16.0:compile - version managed from 1.15; omitted for duplicate)
[INFO] |     +- org.apache.tika:tika-parser-image-module:jar:2.9.0:compile
[INFO] |     |  +- (com.drewnoakes:metadata-extractor:jar:2.18.0:compile - omitted for duplicate)
[INFO] |     |  +- (org.apache.tika:tika-parser-xmp-commons:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  +- com.github.jai-imageio:jai-imageio-core:jar:1.4.0:compile
[INFO] |     |  \- org.apache.pdfbox:jbig2-imageio:jar:3.0.4:compile
[INFO] |     +- org.apache.tika:tika-parser-mail-module:jar:2.9.0:compile
[INFO] |     |  +- org.apache.tika:tika-parser-mail-commons:jar:2.9.0:compile
[INFO] |     |  |  +- org.apache.james:apache-mime4j-core:jar:0.8.9:compile
[INFO] |     |  |  |  \- (commons-io:commons-io:jar:2.11.0:compile - omitted for conflict with 2.13.0)
[INFO] |     |  |  \- org.apache.james:apache-mime4j-dom:jar:0.8.9:compile
[INFO] |     |  |     +- (org.apache.james:apache-mime4j-core:jar:0.8.9:compile - omitted for duplicate)
[INFO] |     |  |     \- (commons-io:commons-io:jar:2.11.0:compile - omitted for conflict with 2.13.0)
[INFO] |     |  +- (org.apache.tika:tika-parser-text-module:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  \- (org.apache.tika:tika-parser-html-module:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     +- org.apache.tika:tika-parser-microsoft-module:jar:2.9.0:compile
[INFO] |     |  +- (org.apache.tika:tika-parser-html-module:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  +- (org.apache.tika:tika-parser-text-module:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  +- (org.apache.tika:tika-parser-xml-module:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  +- (org.apache.tika:tika-parser-mail-commons:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  +- com.pff:java-libpst:jar:0.9.3:compile
[INFO] |     |  +- (org.apache.tika:tika-parser-zip-commons:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  +- (commons-codec:commons-codec:jar:1.16.0:compile - version managed from 1.15; omitted for duplicate)
[INFO] |     |  +- org.apache.commons:commons-lang3:jar:3.13.0:compile
[INFO] |     |  +- org.apache.poi:poi:jar:5.2.3:compile
[INFO] |     |  |  +- (commons-codec:commons-codec:jar:1.16.0:compile - version managed from 1.15; omitted for duplicate)
[INFO] |     |  |  +- (org.apache.commons:commons-collections4:jar:4.4:compile - omitted for conflict with 4.3)
[INFO] |     |  |  +- org.apache.commons:commons-math3:jar:3.6.1:compile
[INFO] |     |  |  +- (commons-io:commons-io:jar:2.11.0:compile - omitted for conflict with 2.13.0)
[INFO] |     |  |  +- com.zaxxer:SparseBitSet:jar:1.2:compile
[INFO] |     |  |  \- (org.apache.logging.log4j:log4j-api:jar:2.21.1:compile - version managed from 2.18.0; omitted for duplicate)
[INFO] |     |  +- org.apache.poi:poi-scratchpad:jar:5.2.3:compile
[INFO] |     |  |  +- (org.apache.poi:poi:jar:5.2.3:compile - omitted for duplicate)
[INFO] |     |  |  +- (org.apache.logging.log4j:log4j-api:jar:2.21.1:compile - version managed from 2.18.0; omitted for duplicate)
[INFO] |     |  |  +- (org.apache.commons:commons-math3:jar:3.6.1:compile - omitted for duplicate)
[INFO] |     |  |  \- (commons-codec:commons-codec:jar:1.16.0:compile - version managed from 1.15; omitted for duplicate)
[INFO] |     |  +- org.apache.poi:poi-ooxml:jar:5.2.3:compile
[INFO] |     |  |  +- (org.apache.poi:poi:jar:5.2.3:compile - omitted for duplicate)
[INFO] |     |  |  +- org.apache.poi:poi-ooxml-lite:jar:5.2.3:compile
[INFO] |     |  |  |  \- (org.apache.xmlbeans:xmlbeans:jar:5.1.1:compile - omitted for duplicate)
[INFO] |     |  |  +- org.apache.xmlbeans:xmlbeans:jar:5.1.1:compile
[INFO] |     |  |  |  +- (org.apache.logging.log4j:log4j-api:jar:2.21.1:compile - version managed from 2.18.0; omitted for duplicate)
[INFO] |     |  |  |  \- (xml-apis:xml-apis:jar:1.4.01:compile - omitted for duplicate)
[INFO] |     |  |  +- (org.apache.commons:commons-compress:jar:1.21:compile - omitted for conflict with 1.23.0)
[INFO] |     |  |  +- (commons-io:commons-io:jar:2.11.0:compile - omitted for conflict with 2.13.0)
[INFO] |     |  |  +- com.github.virtuald:curvesapi:jar:1.07:compile
[INFO] |     |  |  +- (org.apache.logging.log4j:log4j-api:jar:2.21.1:compile - version managed from 2.18.0; omitted for duplicate)
[INFO] |     |  |  \- (org.apache.commons:commons-collections4:jar:4.4:compile - omitted for conflict with 4.3)
[INFO] |     |  +- (commons-logging:commons-logging:jar:1.2:compile - omitted for duplicate)
[INFO] |     |  +- com.healthmarketscience.jackcess:jackcess:jar:4.0.5:compile
[INFO] |     |  |  +- (org.apache.commons:commons-lang3:jar:3.13.0:compile - version managed from 3.10; omitted for duplicate)
[INFO] |     |  |  \- (commons-logging:commons-logging:jar:1.2:compile - omitted for duplicate)
[INFO] |     |  +- com.healthmarketscience.jackcess:jackcess-encrypt:jar:4.0.2:compile
[INFO] |     |  |  \- (org.bouncycastle:bcprov-jdk18on:jar:1.72:compile - omitted for conflict with 1.76)
[INFO] |     |  +- (org.bouncycastle:bcmail-jdk18on:jar:1.76:compile - omitted for duplicate)
[INFO] |     |  \- (org.bouncycastle:bcprov-jdk18on:jar:1.76:compile - omitted for duplicate)
[INFO] |     +- org.slf4j:jcl-over-slf4j:jar:2.0.9:compile (version managed from 2.0.7)
[INFO] |     |  \- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 1.7.25; omitted for conflict with 1.7.30)
[INFO] |     +- org.apache.tika:tika-parser-miscoffice-module:jar:2.9.0:compile
[INFO] |     |  +- (org.apache.tika:tika-parser-zip-commons:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  +- (org.apache.tika:tika-parser-text-module:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  +- (org.apache.tika:tika-parser-xml-module:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  +- (org.apache.commons:commons-lang3:jar:3.13.0:compile - version managed from 3.10; omitted for duplicate)
[INFO] |     |  +- (org.apache.commons:commons-collections4:jar:4.4:compile - omitted for conflict with 4.3)
[INFO] |     |  +- (org.apache.poi:poi:jar:5.2.3:compile - omitted for duplicate)
[INFO] |     |  +- (commons-codec:commons-codec:jar:1.16.0:compile - version managed from 1.15; omitted for duplicate)
[INFO] |     |  +- org.glassfish.jaxb:jaxb-runtime:jar:4.0.4:compile (version managed from 2.3.6)
[INFO] |     |  |  \- org.glassfish.jaxb:jaxb-core:jar:4.0.4:compile
[INFO] |     |  |     +- jakarta.xml.bind:jakarta.xml.bind-api:jar:4.0.1:compile
[INFO] |     |  |     |  \- (jakarta.activation:jakarta.activation-api:jar:2.1.2:compile - omitted for duplicate)
[INFO] |     |  |     +- jakarta.activation:jakarta.activation-api:jar:2.1.2:compile
[INFO] |     |  |     +- org.eclipse.angus:angus-activation:jar:2.0.1:runtime
[INFO] |     |  |     |  \- (jakarta.activation:jakarta.activation-api:jar:2.1.2:runtime - omitted for duplicate)
[INFO] |     |  |     +- org.glassfish.jaxb:txw2:jar:4.0.4:compile
[INFO] |     |  |     \- com.sun.istack:istack-commons-runtime:jar:4.1.2:compile
[INFO] |     |  \- (org.apache.tika:tika-parser-xmp-commons:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     +- org.apache.tika:tika-parser-news-module:jar:2.9.0:compile
[INFO] |     |  +- com.rometools:rome:jar:2.1.0:compile
[INFO] |     |  |  +- com.rometools:rome-utils:jar:2.1.0:compile
[INFO] |     |  |  |  \- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 2.0.6; omitted for conflict with 1.7.30)
[INFO] |     |  |  +- org.jdom:jdom2:jar:2.0.6.1:compile
[INFO] |     |  |  \- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 2.0.6; omitted for conflict with 1.7.30)
[INFO] |     |  \- (org.slf4j:slf4j-api:jar:2.0.9:compile - version managed from 2.0.7; omitted for conflict with 1.7.30)
[INFO] |     +- org.apache.tika:tika-parser-ocr-module:jar:2.9.0:compile
[INFO] |     |  +- (org.apache.commons:commons-lang3:jar:3.13.0:compile - version managed from 3.10; omitted for duplicate)
[INFO] |     |  \- org.apache.commons:commons-exec:jar:1.3:compile
[INFO] |     +- org.apache.tika:tika-parser-pdf-module:jar:2.9.0:compile
[INFO] |     |  +- (org.apache.tika:tika-parser-xmp-commons:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  +- (org.apache.pdfbox:pdfbox:jar:2.0.29:compile - omitted for conflict with 2.0.30)
[INFO] |     |  +- org.apache.pdfbox:pdfbox-tools:jar:2.0.29:compile
[INFO] |     |  +- org.apache.pdfbox:jempbox:jar:1.8.17:compile
[INFO] |     |  +- (org.bouncycastle:bcmail-jdk18on:jar:1.76:compile - omitted for duplicate)
[INFO] |     |  +- (org.bouncycastle:bcprov-jdk18on:jar:1.76:compile - omitted for duplicate)
[INFO] |     |  \- (org.glassfish.jaxb:jaxb-runtime:jar:4.0.4:compile - version managed from 2.3.6; omitted for duplicate)
[INFO] |     +- org.apache.tika:tika-parser-pkg-module:jar:2.9.0:compile
[INFO] |     |  +- org.tukaani:xz:jar:1.9:compile
[INFO] |     |  +- org.brotli:dec:jar:0.1.2:compile
[INFO] |     |  +- (org.apache.tika:tika-parser-zip-commons:jar:2.9.0:compile - omitted for duplicate)
[INFO] |     |  \- com.github.junrar:junrar:jar:7.5.5:compile
[INFO] |     |     \- (org.slf4j:slf4j-api:jar:2.0.9:runtime - version managed from 1.7.36; omitted for conflict with 1.7.30)
[INFO] |     +- org.apache.tika:tika-parser-text-module:jar:2.9.0:compile
[INFO] |     |  +- com.github.albfernandez:juniversalchardet:jar:2.4.0:compile
[INFO] |     |  +- (commons-codec:commons-codec:jar:1.16.0:compile - version managed from 1.15; omitted for duplicate)
[INFO] |     |  \- org.apache.commons:commons-csv:jar:1.10.0:compile
[INFO] |     +- org.apache.tika:tika-parser-webarchive-module:jar:2.9.0:compile
[INFO] |     |  +- org.netpreserve:jwarc:jar:0.28.1:compile
[INFO] |     |  \- org.apache.commons:commons-compress:jar:1.23.0:compile
[INFO] |     +- org.apache.tika:tika-parser-xml-module:jar:2.9.0:compile
[INFO] |     |  +- (commons-codec:commons-codec:jar:1.16.0:compile - version managed from 1.15; omitted for duplicate)
[INFO] |     |  \- xerces:xercesImpl:jar:2.12.2:compile
[INFO] |     |     \- xml-apis:xml-apis:jar:1.4.01:compile
[INFO] |     +- org.apache.tika:tika-parser-xmp-commons:jar:2.9.0:compile
[INFO] |     |  +- (org.apache.pdfbox:jempbox:jar:1.8.17:compile - omitted for duplicate)
[INFO] |     |  \- org.apache.pdfbox:xmpbox:jar:2.0.29:compile
[INFO] |     |     \- (commons-logging:commons-logging:jar:1.2:compile - omitted for duplicate)
[INFO] |     +- org.gagravarr:vorbis-java-tika:jar:0.8:compile
[INFO] |     \- org.gagravarr:vorbis-java-core:jar:0.8:compile
[INFO] \- org.apache.pdfbox:pdfbox:jar:2.0.30:compile
[INFO]    +- org.apache.pdfbox:fontbox:jar:2.0.30:compile
[INFO]    |  \- (commons-logging:commons-logging:jar:1.2:compile - omitted for duplicate)
[INFO]    \- commons-logging:commons-logging:jar:1.2:compile`;
      setInputText(example);
  };

  return (
    <div className="space-y-6">
      {/* 快速上手指南 - 极限压缩水平步骤条 */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-1 min-w-[300px]">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">1</span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('maven.guide.step1.content')}</span>
          </div>
          <div className="h-4 w-px bg-slate-200 dark:border-slate-800 hidden md:block"></div>
          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">2</span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('maven.guide.step2.content')}</span>
          </div>
          <div className="h-4 w-px bg-slate-200 dark:border-slate-800 hidden md:block"></div>
          {/* Step 3 */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">3</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('maven.guide.step3.content')}</span>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 overflow-hidden min-w-[200px]">
              <code className="text-[10px] font-mono text-slate-500 truncate flex-1">mvn dependency:tree -Dverbose</code>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 px-2 text-[10px] font-bold transition-all duration-300",
                  isCopied ? "text-emerald-500 bg-emerald-500/10" : "text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800"
                )}
                onClick={handleCopyCommand}
              >
                {isCopied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {isCopied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={loadExample}
          className="h-8 text-xs font-bold px-3 border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 shrink-0"
        >
          {t('common.example')}
        </Button>
      </div>

      <Card className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-950 dark:text-slate-50">
             {t('maven.input.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={t('maven.input.placeholder')}
            className="h-64 font-mono text-xs whitespace-pre bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-50 border-slate-300 dark:border-slate-800"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4">
              <Button variant="outline" onClick={clear} disabled={!inputText} className="text-slate-600 border-slate-300">
                  <Trash2 className="w-4 h-4 mr-2"/> {t('common.clear')}
              </Button>
              <div className="flex gap-2">
                <Button onClick={handleParse} className="bg-slate-950 text-white hover:bg-slate-800">
                    <Search className="w-4 h-4 mr-2"/> {t('common.parse')}
                </Button>
              </div>
          </div>
          {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm flex items-center border border-red-200">
                  <AlertCircle className="w-4 h-4 mr-2"/>
                  {error}
              </div>
          )}
        </CardContent>
      </Card>

      {treeData && stats && (
    <Tabs defaultValue="list" className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-900 p-1">
        <TabsTrigger value="list" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-950 dark:data-[state=active]:text-slate-50">{t('maven.tab.list')}</TabsTrigger>
        <TabsTrigger value="conflict" className={stats.conflictCount > 0 ? "text-red-600 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800" : "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"}>
            <AlertTriangle className="w-4 h-4 mr-2"/>
            {t('maven.tab.conflict')} ({stats.conflictCount})
        </TabsTrigger>
        <TabsTrigger value="weight" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-950 dark:data-[state=active]:text-slate-50"><BarChart3 className="w-4 h-4 mr-2"/> {t('maven.tab.weight')}</TabsTrigger>
      </TabsList>
      
      <div className="my-2 flex gap-4 text-xs font-bold text-slate-950 dark:text-slate-400 px-2 bg-slate-50 dark:bg-slate-900/30 py-2 rounded border border-slate-200 dark:border-slate-800">
          <span className="flex items-center"><div className="w-3 h-3 rounded-sm bg-red-500 mr-2 shadow-sm"></div> {t('maven.stat.conflict')} (CONFLICT): {stats.conflictCount}</span>
          <span className="flex items-center"><div className="w-3 h-3 rounded-sm bg-amber-500 mr-2 shadow-sm"></div> {t('maven.stat.managed')} (MANAGED): {stats.managedCount}</span>
          <span className="flex items-center"><div className="w-3 h-3 rounded-sm bg-slate-400 mr-2 shadow-sm"></div> {t('maven.stat.duplicate')} (DUPLICATE): {stats.duplicateCount}</span>
      </div>
          
          <TabsContent value="list">
            <Card className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 shadow-lg">
              <CardHeader className="border-b bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-slate-950 dark:text-slate-50">{t('maven.list.detail')}</CardTitle>
                        {stats.conflictCount > 0 && (
                          <Button
                            variant={showOnlyConflicts ? "destructive" : "outline"}
                            size="sm"
                            className={`h-8 text-xs font-bold transition-all ${showOnlyConflicts ? '' : 'text-red-600 border-red-300 hover:bg-red-50'}`}
                            onClick={() => {
                              setShowOnlyConflicts(!showOnlyConflicts);
                            }}
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {showOnlyConflicts ? t('maven.list.showAll') : t('maven.list.locateConflict')}
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                          {searchTerm && (
                              <span className="text-xs font-bold bg-yellow-400 text-slate-950 px-3 py-1 rounded-full shadow-sm animate-in zoom-in-50">
                                  {t('maven.list.matchResult').replace('{n}', searchMatchCount.toString())}
                              </span>
                          )}
                          <div className="relative w-full md:w-64">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                              <Input
                                  placeholder={t('common.search')}
                                  className="pl-8 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50 focus:ring-slate-950"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                              />
                          </div>
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto bg-white dark:bg-transparent">
                  <div className="p-4 min-w-[600px]">
                      {treeData.map(root => (
                          <TreeNode
                            key={root.id}
                            node={root}
                            searchTerm={searchTerm}
                            level={0}
                            showOnlyConflicts={showOnlyConflicts}
                          />
                      ))}
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conflict">
             <Card className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-950 dark:text-slate-50">{t('maven.conflict.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ConflictRadar data={treeData} />
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="weight">
              <Card className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-950 dark:text-slate-50">{t('maven.weight.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <WeightAnalysis data={treeData} />
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

