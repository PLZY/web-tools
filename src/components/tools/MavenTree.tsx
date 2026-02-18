"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, ChevronRight, ChevronDown, Search, Trash2, BarChart3, Network, AlertTriangle, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DependencyTreeChart } from './maven-tree/DependencyTreeChart';
import { ConflictRadar } from './maven-tree/ConflictRadar';
import { WeightAnalysis } from './maven-tree/WeightAnalysis';
import { MavenNode } from './maven-tree/types';
import { parseMavenTree } from './maven-tree/parser';
import { useTranslation } from '@/lib/i18n';

// --- Components ---

const TreeNode = ({
  node,
  searchTerm,
  level = 0,
  expandConflicts = false
}: {
  node: MavenNode;
  searchTerm: string;
  level?: number;
  expandConflicts?: boolean;
}) => {
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

  // 路径上是否有冲突（用于自动展开）
  const hasConflictInPath = useMemo(() => {
    const check = (n: MavenNode): boolean => {
      if (n.isConflict) return true;
      return n.children.some(check);
    };
    return check(node);
  }, [node]);

  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(level === 0);

  // 响应式状态同步 (修复折叠联动逻辑)
  React.useEffect(() => {
    if (searchTerm) {
      if (hasMatchingChild || matchesSearch) {
        setIsExpanded(true);
      }
    } else if (expandConflicts) {
      if (hasConflictInPath) {
        setIsExpanded(true);
      }
    } else if (expandConflicts === false && searchTerm === "" && level > 0) {
      // 当处于“非展开冲突”且“非搜索”状态时，收起非根节点
      setIsExpanded(false);
    } else if (level === 0) {
      setIsExpanded(true);
    }
  }, [searchTerm, expandConflicts, hasMatchingChild, matchesSearch, hasConflictInPath, level]);

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
                  <div className="bg-red-600 text-white rounded-full p-0.5 shadow-sm animate-bounce" title="内含冲突">
                    <AlertTriangle className="w-2.5 h-2.5" />
                  </div>
                )}
                {subTreeStats.matchCount > 0 && (
                  <div className="bg-yellow-500 text-slate-950 text-[8px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-sm" title={`内含 ${subTreeStats.matchCount} 个匹配`}>
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
              expandConflicts={expandConflicts}
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
  const [expandConflicts, setExpandConflicts] = useState(false);

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
        setError("请输入 Maven 依赖树文本");
        return;
    }
    try {
      const result = parseMavenTree(inputText);
      if (result.length === 0) {
          setError("未能解析出有效的依赖树结构，请检查输入格式是否为 'mvn dependency:tree' 的输出");
          setTreeData(null);
      } else {
          setTreeData(result);
          setError(null);
          setExpandConflicts(false);
          setSearchTerm('');
      }
    } catch (e) {
      setError("解析出错，请检查输入格式");
      console.error(e);
    }
  };

  const clear = () => {
      setInputText('');
      setTreeData(null);
      setError(null);
  };


  const loadExample = () => {
      const example = `[INFO] com.example:my-project:jar:1.0.0
[INFO] +- org.springframework.boot:spring-boot-starter-web:jar:2.7.0:compile
[INFO] |  +- org.springframework.boot:spring-boot-starter:jar:2.7.0:compile
[INFO] |  |  +- org.springframework.boot:spring-boot:jar:2.7.0:compile
[INFO] |  |  +- org.springframework.boot:spring-boot-autoconfigure:jar:2.7.0:compile
[INFO] |  |  +- org.springframework.boot:spring-boot-starter-logging:jar:2.7.0:compile
[INFO] |  |  |  +- ch.qos.logback:logback-classic:jar:1.2.11:compile
[INFO] |  |  |  |  \\- ch.qos.logback:logback-core:jar:1.2.11:compile
[INFO] |  |  |  +- org.apache.logging.log4j:log4j-to-slf4j:jar:2.17.2:compile
[INFO] |  |  |  |  \\- org.apache.logging.log4j:log4j-api:jar:2.17.2:compile
[INFO] |  |  |  \\- org.slf4j:jul-to-slf4j:jar:1.7.36:compile
[INFO] |  |  \\- jakarta.annotation:jakarta.annotation-api:jar:1.3.5:compile
[INFO] |  |  \\- org.yaml:snakeyaml:jar:1.30:compile
[INFO] |  +- org.springframework.boot:spring-boot-starter-json:jar:2.7.0:compile
[INFO] |  |  +- com.fasterxml.jackson.core:jackson-databind:jar:2.13.3:compile
[INFO] |  |  |  +- com.fasterxml.jackson.core:jackson-annotations:jar:2.13.3:compile
[INFO] |  |  |  \\- com.fasterxml.jackson.core:jackson-core:jar:2.13.3:compile
[INFO] |  +- org.springframework:spring-web:jar:5.3.20:compile
[INFO] |  |  \\- org.springframework:spring-beans:jar:5.3.20:compile
[INFO] |  \\- org.springframework:spring-webmvc:jar:5.3.20:compile
[INFO] |     +- org.springframework:spring-aop:jar:5.3.20:compile
[INFO] |     +- org.springframework:spring-context:jar:5.3.20:compile
[INFO] |     \\- org.springframework:spring-expression:jar:5.3.20:compile
[INFO] +- org.apache.commons:commons-lang3:jar:3.12.0:compile
[INFO] \\- com.google.guava:guava:jar:19.0:compile
[INFO]    \\- (com.google.guava:guava:jar:28.0-jre:compile - omitted for conflict with 19.0)`;
      setInputText(example);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-slate-950 dark:text-slate-50">
             <span>{t('maven.input.title')}</span>
             <Button variant="ghost" size="sm" onClick={loadExample} className="text-slate-600 dark:text-slate-400 hover:text-slate-950">{t('common.example')}</Button>
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
                            variant="outline"
                            size="sm"
                            className={`h-8 text-xs font-bold border-red-300 transition-all ${expandConflicts ? 'bg-red-600 text-white hover:bg-red-700' : 'text-red-600 hover:bg-red-50'}`}
                            onClick={() => setExpandConflicts(!expandConflicts)}
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {expandConflicts ? t('maven.list.collapseAll') : t('maven.list.expandConflict')}
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
                            expandConflicts={expandConflicts}
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

