"use client";

import React, { useMemo, useState, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { MavenNode } from './types';
import { useTranslation } from '@/lib/i18n';

interface DependencyTreeChartProps {
  data: MavenNode[];
}

export function DependencyTreeChart({ data }: DependencyTreeChartProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [localSearch, setLocalSearch] = useState('');
  const [highlightPath, setHighlightPath] = useState<string[]>([]);
  const chartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ResizeObserver Implementation
  useEffect(() => {
    if (!containerRef.current || !chartRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      const echartInstance = chartRef.current.getEchartsInstance();
      echartInstance.resize();
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const parentMap = useMemo(() => {
    const map = new Map<string, string>();
    const traverse = (node: MavenNode, parentId?: string) => {
      if (parentId) map.set(node.id, parentId);
      node.children.forEach(c => traverse(c, node.id));
    };
    data.forEach(root => traverse(root));
    return map;
  }, [data]);

  const chartData = useMemo(() => {
    const transformNode = (node: MavenNode): any => {
      const isHighlighted = highlightPath.includes(node.id);
      const isSearchMatched = localSearch && (
        node.artifactId?.toLowerCase().includes(localSearch.toLowerCase()) ||
        node.groupId?.toLowerCase().includes(localSearch.toLowerCase())
      );

      let color = isDark ? '#cbd5e1' : '#020617';
      let borderColor = isDark ? '#475569' : '#cbd5e1'; 
      let bgColor = isDark ? '#0f172a' : '#f0f9ff';

      if (isHighlighted || isSearchMatched) {
        borderColor = '#eab308';
        color = isDark ? '#fde047' : '#854d0e';
        bgColor = isDark ? '#422006' : '#fef9c3';
      } else if (node.isConflict) {
        color = '#b91c1c';
        borderColor = '#ef4444';
        bgColor = isDark ? 'rgba(185, 28, 28, 0.2)' : 'rgba(185, 28, 28, 0.05)';
      }

      const labelText = node.artifactId?.length > 18 
          ? node.artifactId.substring(0, 16) + '..' 
          : node.artifactId || "unknown";

      return {
        id: node.id,
        name: `${labelText}\n${node.version || 'unknown'}`,
        value: `${node.groupId}:${node.artifactId}:${node.version}`,
        children: node.children.map(transformNode),
        itemStyle: {
          color: bgColor,
          borderColor: borderColor,
          borderWidth: (isHighlighted || isSearchMatched || node.isConflict) ? 2 : 1,
          borderRadius: 4,
        },
        label: {
          color: color,
          fontWeight: (isHighlighted || isSearchMatched) ? 'bold' : 'normal',
          fontSize: 11,
          padding: [4, 4],
          hideOverlap: true
        },
        symbol: 'roundRect',
        symbolSize: [140, 48], // Slightly larger for better readability
        // BUG FIX: Only force 'collapsed: false' if the node is part of a search/highlight.
        // Otherwise, do NOT specify 'collapsed' to avoid overriding ECharts internal state on every re-render.
        ...( (isHighlighted || isSearchMatched) ? { collapsed: false } : {} )
      };
    };

    return data.map(transformNode);
  }, [data, isDark, localSearch, highlightPath]);

  const onChartClick = (params: any) => {
    if (params.data && params.data.id) {
      const path: string[] = [];
      let currentId = params.data.id;
      while (currentId) {
        path.push(currentId);
        currentId = parentMap.get(currentId);
      }
      setHighlightPath(path);
    }
  };

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => (params.value || "").replace(/:/g, '<br/>')
    },
    series: [
      {
        type: 'tree',
        data: chartData,
        top: '5%',
        left: '12%',
        bottom: '5%',
        right: '12%',
        layout: 'orthogonal',
        // INCREASE GAPS TO PREVENT OVERLAP
        nodeGap: 60, // Increase vertical gap to avoid label/box collision
        levelGap: 240, // Increase horizontal gap for better polyline clarity
        orient: 'LR',
        roam: true,
        edgeShape: 'polyline', // Use polyline for cleaner industrial look
        edgeForkPosition: '20%',
        symbolKeepAspect: true,
        lineStyle: {
          color: isDark ? '#334155' : '#cbd5e1',
          width: 1.5,
          curveness: 0
        },
        emphasis: {
          lineStyle: {
            width: 3,
            color: '#eab308'
          }
        },
        // INITIAL DEPTH ONLY
        initialTreeDepth: 1,
        expandAndCollapse: true,
        animationDuration: 300,
        animationDurationUpdate: 300
      }
    ]
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('maven.graph.search')}
            className="pl-8 h-9 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 border-slate-300 dark:border-slate-800"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
            {highlightPath.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => setHighlightPath([])} className="h-8 text-xs font-bold border-slate-300">
                    {t('maven.graph.clearPath')}
                </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => setLocalSearch('')} className="h-8 text-xs font-bold" disabled={!localSearch}>
                {t('common.clearSearch')}
            </Button>
        </div>
      </div>
      <div 
        ref={containerRef}
        className="w-full min-h-[650px] border rounded-xl bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden shadow-inner"
      >
        <ReactECharts 
          ref={chartRef}
          option={option} 
          style={{ height: '650px', width: '100%' }}
          onEvents={{ 'click': onChartClick }}
          theme={isDark ? 'dark' : undefined}
        />
        <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 dark:text-slate-400 font-medium pointer-events-none bg-white/80 dark:bg-black/40 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
          {t('maven.graph.tips')}
        </div>
      </div>
    </div>
  );
}
