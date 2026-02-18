"use client";

import React, { useMemo, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';
import { MavenNode } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface ConflictRadarProps {
  data: MavenNode[];
}

export function ConflictRadar({ data }: ConflictRadarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      chartRef.current?.getEchartsInstance().resize();
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const conflictData = useMemo(() => {
    const conflicts: { [key: string]: { versions: Set<string>, nodes: MavenNode[] } } = {};

    const traverse = (node: MavenNode) => {
      const g = node.groupId || "unknown";
      const a = node.artifactId || "unknown";
      const key = `${g}:${a}`;
      if (!conflicts[key]) {
        conflicts[key] = { versions: new Set(), nodes: [] };
      }
      if (node.version) {
        conflicts[key].versions.add(node.version);
      }
      conflicts[key].nodes.push(node);
      
      node.children.forEach(traverse);
    };

    data.forEach(traverse);

    return Object.entries(conflicts)
      .filter(([_, value]) => value.versions.size > 1)
      .map(([key, value]) => {
        const winnerNode = value.nodes.find(n => !n.isConflict && !n.isDuplicate);
        const omittedNodes = value.nodes.filter(n => n.isConflict);
        
        return {
          name: key,
          artifactId: key.split(':')[1],
          versions: Array.from(value.versions).sort(),
          winner: winnerNode,
          omitted: omittedNodes,
          count: value.versions.size
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [data]);

  const option = {
    title: {
      text: t('maven.conflict.chart.title'),
      left: 'center',
      textStyle: { color: isDark ? '#cbd5e1' : '#020617' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const item = conflictData[params[0].dataIndex];
        return `<strong>${item.name}</strong><br/>${t('maven.stat.conflict')}: ${item.count}`;
      }
    },
    grid: {
      left: '5%',
      right: '15%',
      bottom: '5%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: t('maven.conflict.chart.xAxis'),
      splitLine: { show: false },
      axisLabel: { color: isDark ? '#94a3b8' : '#475569' }
    },
    yAxis: {
      type: 'category',
      data: conflictData.map(c => c.artifactId).reverse(),
      axisLabel: { 
        color: isDark ? '#cbd5e1' : '#020617',
        fontWeight: 'bold'
      }
    },
    series: [
      {
        name: t('maven.stat.conflict'),
        type: 'bar',
        data: conflictData.map(c => c.count).reverse(),
        barWidth: '60%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#f87171' },
              { offset: 1, color: '#ef4444' }
            ]
          },
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c} versions',
          color: isDark ? '#cbd5e1' : '#020617',
          fontWeight: 'bold'
        }
      }
    ]
  };

  if (conflictData.length === 0) {
      return <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">🎉 No Conflicts Found!</div>;
  }

  return (
    <div ref={containerRef} className="space-y-6 min-h-[600px]">
        <div className="h-[400px] bg-slate-50/50 dark:bg-slate-900/50 rounded-lg p-4">
            <ReactECharts ref={chartRef} option={option} style={{ height: '100%', width: '100%' }} theme={isDark ? 'dark' : undefined} />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
            {conflictData.map((conflict) => (
                <Card key={conflict.name} className="border-l-4 border-l-red-500 overflow-hidden shadow-sm">
                    <CardHeader className="py-3 bg-slate-50 dark:bg-slate-900/50">
                        <CardTitle className="text-base flex items-center justify-between">
                            <span className="font-mono text-slate-950 dark:text-slate-50">{conflict.name}</span>
                            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">
                                {t('maven.conflict.versions').replace('{n}', conflict.count.toString())}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="py-4 space-y-4">
                        {conflict.winner && (
                            <div className="flex items-start gap-3 p-3 bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 rounded-lg">
                                <div className="mt-1 bg-green-500 text-white p-0.5 rounded-full">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-widest flex items-center gap-1">
                                        {t('maven.conflict.card.winner')}
                                        <span className="bg-green-500 text-white text-[9px] px-1 rounded">ACTIVE</span>
                                    </div>
                                    <div className="text-sm font-mono font-bold text-slate-950 dark:text-slate-50">
                                        {conflict.winner.version} <span className="text-slate-500 font-normal">[{conflict.winner.scope}]</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                                {t('maven.conflict.card.omitted')}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {conflict.omitted.slice(0, 4).map((node, idx) => (
                                    <div key={idx} className="text-xs bg-red-500/5 dark:bg-red-500/10 p-2 rounded border border-red-500/20 dark:border-red-500/30 font-mono">
                                        <div className="flex items-center justify-between text-red-700 dark:text-red-400 font-bold mb-1">
                                            <span className="flex items-center gap-1">
                                                <ArrowRight className="w-3 h-3 opacity-50" />
                                                {node.version}
                                            </span>
                                            <span className="text-[9px] bg-red-500 text-white px-1 rounded uppercase tracking-tighter">Omitted</span>
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-400 truncate text-[10px] italic">
                                            {t('maven.conflict.card.from')}: {node.rawLine.split(/[\+\\]\-/).pop()?.trim().substring(0, 45)}...
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
