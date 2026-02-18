'use client';

import React, { useState, useEffect } from 'react';
import cronstrue from 'cronstrue/i18n';
import { CronExpressionParser } from 'cron-parser';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

export default function CronTranslator() {
  const { lang, t } = useTranslation();
  const [cronExpression, setCronExpression] = useState('*/5 * * * *');
  const [translation, setTranslation] = useState('');
  const [nextRuns, setNextRuns] = useState<Date[]>([]);
  const [error, setError] = useState('');

  const PRESETS = [
    { label: lang === 'zh' ? '每分钟' : 'Every Minute', value: '* * * * *' },
    { label: lang === 'zh' ? '每 5 分钟' : 'Every 5 Mins', value: '*/5 * * * *' },
    { label: lang === 'zh' ? '每小时' : 'Every Hour', value: '0 * * * *' },
    { label: lang === 'zh' ? '每天午夜' : 'Daily Midnight', value: '0 0 * * *' },
    { label: lang === 'zh' ? '每周一早 9 点' : 'Mon 9:00 AM', value: '0 9 * * 1' },
    { label: lang === 'zh' ? '每月 1 号' : 'Monthly 1st', value: '0 0 1 * *' },
  ];

  useEffect(() => {
    translateCron(cronExpression);
  }, [cronExpression, lang]);

  const translateCron = (expression: string) => {
    setError('');
    setTranslation('');
    setNextRuns([]);

    if (!expression.trim()) {
      return;
    }

    try {
      // 1. 尝试翻译
      const desc = cronstrue.toString(expression, { locale: lang === 'zh' ? 'zh_CN' : 'en' });
      setTranslation(desc);

      // 2. 计算未来执行时间
      const interval = CronExpressionParser.parse(expression);
      const runs = [];
      for (let i = 0; i < 7; i++) {
        runs.push(interval.next().toDate());
      }
      setNextRuns(runs);
    } catch (err) {
      setError(lang === 'zh' ? '无效的 Cron 表达式' : 'Invalid Cron Expression');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (lang === 'en') {
        if (diffMins < 60) return `${diffMins} mins later`;
        if (diffHours < 24) return `${diffHours} hours later`;
        return `${diffDays} days later`;
    }

    if (diffMins < 60) return `${diffMins} 分钟后`;
    if (diffHours < 24) return `${diffHours} 小时后`;
    return `${diffDays} 天后`;
  };

  return (
    <div className="space-y-8">
      {/* 输入区域 */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-slate-50 rounded-xl shadow-sm p-6">
        <div className="flex flex-col space-y-4">
          <label htmlFor="cron-input" className="text-sm font-bold text-slate-950 dark:text-slate-200 uppercase tracking-wider">
            {t('cron.title')}
          </label>
          <div className="flex gap-4">
            <input
              id="cron-input"
              type="text"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              className="flex h-12 w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xl font-mono text-slate-950 dark:text-slate-50 focus:ring-2 focus:ring-slate-950 dark:focus:ring-slate-50 outline-none transition-all"
              placeholder={t('cron.input.placeholder')}
            />
          </div>
          
          {/* 预设按钮 */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                onClick={() => setCronExpression(preset.value)}
                className={`font-bold border-slate-300 dark:border-slate-700 transition-colors ${cronExpression === preset.value ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-400'}`}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* 结果展示 */}
          <div className="mt-4 min-h-[60px]">
            {error ? (
              <div className="text-red-600 dark:text-red-400 font-bold flex items-center bg-red-500/10 p-3 rounded border border-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                {error}
              </div>
            ) : translation ? (
              <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t('cron.desc.title')}</div>
                <div className="text-lg font-bold text-slate-950 dark:text-slate-50">
                  {translation}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 视觉时间轴 */}
      {nextRuns.length > 0 && !error && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-slate-50 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50 mb-6 flex items-center gap-2">
            <div className="w-1 h-5 bg-slate-950 dark:bg-white rounded-full"></div>
            {t('cron.timeline.title')}
          </h3>
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-8 pb-2">
            {nextRuns.map((run, index) => (
              <div key={index} className="relative flex items-center pl-6">
                {/* 节点圆点 */}
                <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white ring-4 ring-white dark:ring-slate-950"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
                  <div className="font-mono text-lg font-bold text-slate-950 dark:text-slate-50">
                    {formatDate(run)}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md w-fit border border-slate-200 dark:border-slate-700">
                    {getRelativeTime(run)}
                  </div>
                  {index === 0 && (
                    <span className="text-[10px] font-black text-white bg-slate-950 dark:bg-white dark:text-slate-950 px-2 py-1 rounded uppercase tracking-tighter ml-auto sm:ml-0 shadow-sm animate-pulse">
                      NEXT
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
