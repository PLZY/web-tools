"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
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

  useEffect(() => {
    if (!containerRef.current || !chartRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      chartRef.current?.getEchartsInstance()?.resize();
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

  // 计算树的总节点数来动态调整高度
  const totalNodes = useMemo(() => {
    let count = 0;
    const traverse = (node: MavenNode) => {
      count++;
      node.children.forEach(traverse);
    };
    data.forEach(traverse);
    return count;
  }, [data]);

  const chartData = useMemo(() => {
    const transformNode = (node: MavenNode): any => {
      const isHighlighted = highlightPath.includes(node.id);
      const isSearchMatched = localSearch && (
        node.artifactId?.toLowerCase().includes(localSearch.toLowerCase()) ||
        node.groupId?.toLowerCase().includes(localSearch.toLowerCase())
      );

      let color = isDark ? '#cbd5e1' : '#334155';
      let borderColor = isDark ? '#475569' : '#d1d5db';
      let bgColor = isDark ? '#1e293b' : '#ffffff';

      if (isHighlighted || isSearchMatched) {
        borderColor = '#f59e0b';
        color = isDark ? '#fde047' : '#92400e';
        bgColor = isDark ? '#451a03' : '#fef3c7';
      } else if (node.isConflict) {
        color = isDark ? '#fca5a5' : '#b91c1c';
        borderColor = '#ef4444';
        bgColor = isDark ? '#450a0a' : '#fef2f2';
      }

      const labelText = node.artifactId?.length > 22
          ? node.artifactId.substring(0, 20) + '..'
          : node.artifactId || "unknown";

      return {
        id: node.id,
        name: `${labelText}\n${node.version || ''}`,
        value: `${node.groupId}:${node.artifactId}:${node.version}`,
        children: node.children.map(transformNode),
        itemStyle: {
          color: bgColor,
          borderColor,
          borderWidth: (isHighlighted || isSearchMatched || node.isConflict) ? 2.5 : 1,
          borderRadius: 6,
          shadowBlur: (isHighlighted || isSearchMatched) ? 8 : 0,
          shadowColor: (isHighlighted || isSearchMatched) ? 'rgba(245, 158, 11, 0.4)' : 'transparent',
        },
        label: {
          color,
          fontWeight: (isHighlighted || isSearchMatched) ? 'bold' : 'normal',
          fontSize: 11,
          lineHeight: 16,
          padding: [6, 8],
          hideOverlap: false,
        },
        symbol: 'roundRect',
        symbolSize: [160, 44],
        ...((isHighlighted || isSearchMatched) ? { collapsed: false } : {})
      };
    };

    return data.map(transformNode);
  }, [data, isDark, localSearch, highlightPath]);

  const onChartClick = useCallback((params: any) => {
    if (params.data && params.data.id) {
      const path: string[] = [];
      let currentId = params.data.id;
      while (currentId) {
        path.push(currentId);
        currentId = parentMap.get(currentId);
      }
      setHighlightPath(path);
    }
  }, [parentMap]);

  const dynamicHeight = Math.max(650, Math.min(totalNodes * 12, 2000));

  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#475569' : '#e2e8f0',
      textStyle: { color: isDark ? '#e2e8f0' : '#334155', fontSize: 12 },
      formatter: (params: any) => {
        const parts = (params.value || "").split(':');
        if (parts.length >= 3) {
          return `<div style="font-weight:600">${parts[1]}</div><div style="color:#64748b;font-size:11px">${parts[0]}</div><div style="margin-top:4px;color:#3b82f6">${parts[2]}</div>`;
        }
        return params.value;
      }
    },
    series: [
      {
        type: 'tree',
        data: chartData,
        top: '40',
        left: '60',
        bottom: '40',
        right: '60',
        layout: 'orthogonal',
        orient: 'LR',
        roam: true,
        zoom: 0.9,
        edgeShape: 'polyline',
        edgeForkPosition: '30%',
        symbolKeepAspect: true,
        lineStyle: {
          color: isDark ? '#334155' : '#d1d5db',
          width: 1.5,
          curveness: 0
        },
        emphasis: {
          focus: 'ancestor',
          lineStyle: { width: 3, color: '#f59e0b' }
        },
        initialTreeDepth: 2,
        expandAndCollapse: true,
        animationDuration: 300,
        animationDurationUpdate: 300
      }
    ]
  }), [chartData, isDark]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('maven.graph.search')}
            className="pl-8 h-9 bg-white dark:bg-slate-900 text-sm"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button onClick={() => setLocalSearch('')} className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {highlightPath.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setHighlightPath([])} className="h-8 text-xs font-medium">
            {t('maven.graph.clearPath')}
          </Button>
        )}
      </div>
      <div
        ref={containerRef}
        className="w-full border rounded-xl bg-white dark:bg-slate-950 relative overflow-hidden"
      >
        <ReactECharts
          ref={chartRef}
          option={option}
          style={{ height: `${dynamicHeight}px`, width: '100%' }}
          onEvents={{ 'click': onChartClick }}
          theme={isDark ? 'dark' : undefined}
        />
        <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground pointer-events-none bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border">
          {t('maven.graph.tips')}
        </div>
      </div>
    </div>
  );
}
