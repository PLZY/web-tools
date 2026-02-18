"use client";

import React, { useMemo, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';
import { MavenNode } from './types';
import { useTranslation } from '@/lib/i18n';

interface WeightAnalysisProps {
  data: MavenNode[];
}

export function WeightAnalysis({ data }: WeightAnalysisProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const groupChartRef = useRef<any>(null);
  const scopeChartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ResizeObserver 实现
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      groupChartRef.current?.getEchartsInstance().resize();
      scopeChartRef.current?.getEchartsInstance().resize();
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const analysisData = useMemo(() => {
    const groupCount: { [key: string]: number } = {};
    const scopeCount: { [key: string]: number } = {
        compile: 0,
        test: 0,
        provided: 0,
        runtime: 0,
        system: 0,
        import: 0
    };
    let totalNodes = 0;
    
    const process = (node: MavenNode) => {
        totalNodes++;
        const g = node.groupId || "unknown";
        groupCount[g] = (groupCount[g] || 0) + 1;
        if (node.scope) {
            scopeCount[node.scope] = (scopeCount[node.scope] || 0) + 1;
        }
        node.children.forEach(process);
    };

    data.forEach(process);

    const calculateTopNAndOthers = (counts: { [key: string]: number }, threshold: number) => {
      const entries = Object.entries(counts)
        .map(([name, value]) => ({ name, value, percent: (value / totalNodes) * 100 }))
        .sort((a, b) => b.value - a.value);
      
      const filtered = entries.filter(item => item.percent >= threshold);
      const othersValue = entries.filter(item => item.percent < threshold).reduce((acc, curr) => acc + curr.value, 0);
      
      if (othersValue > 0) {
        filtered.push({ name: t('common.others'), value: othersValue, percent: (othersValue / totalNodes) * 100 });
      }
      return filtered;
    };

    return { 
      groupData: calculateTopNAndOthers(groupCount, 2).slice(0, 10),
      scopeData: calculateTopNAndOthers(scopeCount, 2)
    };
  }, [data, t]); // Add t as dependency

  const groupOption = {
    title: {
      text: t('maven.weight.chart.group'),
      left: 'center',
      textStyle: { color: 'var(--foreground)' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    series: [
      {
        name: 'GroupId',
        type: 'pie',
        radius: ['30%', '60%'],
        avoidLabelOverlap: true,
        label: {
          position: 'outer',
          alignTo: 'labelLine',
          formatter: '{b}: {d}%',
          color: 'var(--muted-foreground)'
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10
        },
        data: analysisData.groupData
      }
    ]
  };

  const scopeOption = {
    title: {
      text: t('maven.weight.chart.scope'),
      left: 'center',
      textStyle: { color: 'var(--foreground)' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    series: [
      {
        name: 'Scope',
        type: 'pie',
        radius: '50%',
        avoidLabelOverlap: true,
        label: {
          position: 'outer',
          alignTo: 'labelLine',
          formatter: '{b}: {d}%',
          color: 'var(--muted-foreground)'
        },
        labelLine: {
          show: true
        },
        data: analysisData.scopeData
      }
    ]
  };

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[600px]">
        <div className="w-full h-full min-h-[600px]">
            <ReactECharts ref={groupChartRef} option={groupOption} style={{ height: '100%', width: '100%', minHeight: '600px' }} theme={isDark ? 'dark' : undefined} />
        </div>
        <div className="w-full h-full min-h-[600px]">
            <ReactECharts ref={scopeChartRef} option={scopeOption} style={{ height: '100%', width: '100%', minHeight: '600px' }} theme={isDark ? 'dark' : undefined} />
        </div>
    </div>
  );
}
