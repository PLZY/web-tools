'use client';

import React, { useState, useEffect, useRef } from 'react';
import cronstrue from 'cronstrue/i18n';
import { CronExpressionParser } from 'cron-parser';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HelpCircle, MousePointerClick } from 'lucide-react';
import { cn } from '@/lib/utils';

const ECOSYSTEMS = [
  { id: 'linux', label: '[ 🐧 Linux / Python / Go / PHP ]', value: 'LINUX' },
  { id: 'java', label: '[ ☕ Java / Spring / Quartz / XXL-JOB ]', value: 'JAVA' },
  { id: 'dotnet', label: '[ 🔷 .NET / Hangfire / Quartz.NET ]', value: 'DOTNET' },
  { id: 'nodejs', label: '[ ⚡ Node.js / Serverless / Jenkins ]', value: 'NODEJS' },
];

export default function CronTranslator() {
  const { lang, t } = useTranslation();
  const [ecosystem, setEcosystem] = useState('JAVA');
  const [cronExpression, setCronExpression] = useState('0 */5 * * * ?');
  const [translation, setTranslation] = useState('');
  const [nextRuns, setNextRuns] = useState<Date[]>([]);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [showConflictExp, setShowConflictExp] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getPresets = (eco: string) => {
    const isJava = eco === 'JAVA' || eco === 'DOTNET';
    const presets = [
      { label: t('cron.preset.every5Mins'), linux: '*/5 * * * *', java: '0 */5 * * * ?' },
      { label: t('cron.preset.everyHour'), linux: '0 * * * *', java: '0 0 * * * ?' },
      { label: t('cron.preset.dailyMidnight'), linux: '0 0 * * *', java: '0 0 0 * * ?' },
      { label: t('cron.preset.3amBackup'), linux: '0 3 * * *', java: '0 0 3 * * ?' },
      { label: t('cron.preset.weekday9am'), linux: '0 9 * * 1-5', java: '0 0 9 ? * MON-FRI' },
      { label: t('cron.preset.weekend12pm'), linux: '0 0 * * 0', java: '0 0 0 ? * SUN' },
      { label: t('cron.preset.monthly1st'), linux: '0 0 1 * *', java: '0 0 0 1 * ?' },
      { label: t('cron.preset.quarterly1st'), linux: '0 0 1 */3 *', java: '0 0 0 1 1/3 ?' },
      { label: t('cron.preset.1st15th830'), linux: '30 8 1,15 * *', java: '0 30 8 1,15 * ?' },
    ];

    if (isJava) {
      presets.splice(7, 0, { label: t('cron.preset.lastDayOfMonth'), linux: '', java: '0 0 0 L * ?' });
    }

    return presets.map(p => ({
      label: p.label,
      value: isJava ? (p.java || p.linux) : (p.linux || p.java)
    }));
  };

  useEffect(() => {
    translateCron(cronExpression, ecosystem);
  }, [cronExpression, lang, ecosystem]);

  const translateCron = (expression: string, currentEcosystem: string) => {
    setError('');
    setWarning('');
    setTranslation('');
    setNextRuns([]);

    if (!expression.trim()) {
      return;
    }

    if (currentEcosystem === 'LINUX' && expression.includes('?')) {
      setWarning(t('cron.warning.linux_question'));
    }

    try {
      const isQuartz = currentEcosystem === 'JAVA' || currentEcosystem === 'DOTNET';
      const desc = cronstrue.toString(expression, {
        locale: lang === 'zh' ? 'zh_CN' : 'en',
        // @ts-ignore
        useQuartz: isQuartz
      });
      setTranslation(desc);

      let parseExpression = expression;
      if (isQuartz) {
        parseExpression = expression.replace(/\?/g, '*');
      }

      const interval = CronExpressionParser.parse(parseExpression);
      const runs = [];
      for (let i = 0; i < 7; i++) {
        runs.push(interval.next().toDate());
      }
      setNextRuns(runs);
    } catch (err) {
      setError(t('cron.input.error'));
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

  const handleExampleClick = (code: string, isJava: boolean) => {
    if (isJava) {
      setEcosystem('JAVA');
    }
    setCronExpression(code);
    
    // 触发呼吸灯动画
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 1000);

    // 自动滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* 输入区域 */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-slate-50 rounded-xl shadow-sm p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-slate-950 dark:text-slate-200 uppercase tracking-wider">
              {t('cron.ecosystem.label')}
            </label>
            <Select value={ecosystem} onValueChange={setEcosystem}>
              <SelectTrigger className="w-full md:w-[450px] font-mono text-sm">
                <SelectValue placeholder={t('cron.ecosystem.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {ECOSYSTEMS.map((item) => (
                  <SelectItem key={item.id} value={item.value} className="font-mono">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="cron-input" className="text-sm font-bold text-slate-950 dark:text-slate-200 uppercase tracking-wider">
              {t('cron.title')}
            </label>
            <div className="flex gap-4">
              <input
                ref={inputRef}
                id="cron-input"
                type="text"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                className={cn(
                  "flex h-12 w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xl font-mono text-slate-950 dark:text-slate-50 focus:ring-2 focus:ring-slate-950 dark:focus:ring-slate-50 outline-none transition-all",
                  isGlowing && "animate-input-glow ring-2 ring-blue-500/50 border-blue-500"
                )}
                placeholder={t('cron.input.placeholder')}
              />
            </div>
          </div>
          
          {/* 预设按钮 */}
          <div className="flex flex-wrap gap-2">
            {getPresets(ecosystem).map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => setCronExpression(preset.value)}
                className={`font-bold border-slate-300 dark:border-slate-700 transition-colors ${cronExpression === preset.value ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-400'}`}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* 结果展示 (视觉中心) */}
          <div className="mt-4 min-h-[80px] space-y-2">
            {warning && !error && (
               <div className="text-amber-600 dark:text-amber-400 font-medium flex items-center bg-amber-500/10 p-3 rounded border border-amber-500/20 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                {warning}
              </div>
            )}
            {error ? (
              <div className="text-red-600 dark:text-red-400 font-bold flex items-center bg-red-500/10 p-4 rounded border border-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                {error}
              </div>
            ) : translation ? (
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-slate-950 dark:border-white shadow-md">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{t('cron.desc.title')}</div>
                <div className="text-2xl font-black text-slate-950 dark:text-slate-50 leading-tight">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextRuns.map((run, index) => (
              <div key={index} className="relative flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                {/* 数字编号 */}
                <div className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 transition-colors",
                  index === 0 
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                )}>
                  {index + 1}
                </div>
                
                <div className="flex-1 flex flex-row items-center justify-between">
                  <div className="font-mono text-base font-bold text-slate-950 dark:text-slate-50">{formatDate(run)}</div>
                  <div className="flex items-center gap-3">
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                      {getRelativeTime(run)}
                    </div>
                    {index === 1 && (
                      <span className="text-[10px] font-black text-white bg-red-500 px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm animate-pulse">NEXT</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 差异对比表 */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-slate-50 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
          {t('cron.compare.title')}
        </h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <th className="p-3 font-bold">{t('cron.compare.feature')}</th>
                <th className="p-3 font-bold">Linux / Python系</th>
                <th className="p-3 font-bold">Java / Spring系</th>
                <th className="p-3 font-bold">.NET系</th>
                <th className="p-3 font-bold">Node / Jenkins系</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-3 font-medium bg-slate-50/30 dark:bg-slate-900/30">{t('cron.compare.fields')}</td>
                <td className="p-3 text-xs">{t('cron.compare.fields.linux')}</td>
                <td className="p-3 text-xs" colSpan={2}>{t('cron.compare.fields.java')}</td>
                <td className="p-3 text-xs">{t('cron.compare.fields.node')}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium bg-slate-50/30 dark:bg-slate-900/30">{t('cron.compare.resolution')}</td>
                <td className="p-3 text-xs">{t('cron.compare.resolution.min')}</td>
                <td className="p-3 text-xs" colSpan={2}>{t('cron.compare.resolution.sec')}</td>
                <td className="p-3 text-xs">{t('cron.compare.resolution.node')}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium bg-slate-50/30 dark:bg-slate-900/30">{t('cron.compare.conflict')}</td>
                <td className="p-3 text-xs">{t('cron.compare.conflict.linux')}</td>
                <td className="p-3 text-xs relative" colSpan={2}>
                  <div className="flex items-center gap-1">
                    {t('cron.compare.conflict.java')}
                    <div 
                      className="cursor-help p-1"
                      onMouseEnter={() => setShowConflictExp(true)} 
                      onMouseLeave={() => setShowConflictExp(false)}
                    >
                      <HelpCircle className="w-3 h-3 text-blue-500" />
                    </div>
                  </div>
                  {showConflictExp && (
                    <div className="absolute z-50 bottom-full left-0 mb-2 w-80 p-4 bg-slate-900 dark:bg-slate-800 text-white rounded-lg shadow-2xl text-xs leading-relaxed animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
                      <p className="font-bold mb-1 text-blue-400">{t('cron.compare.conflict.exp.title')}</p>
                      {t('cron.compare.conflict.exp.desc')}
                    </div>
                  )}
                </td>
                <td className="p-3 text-xs">{t('cron.compare.conflict.node')}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium bg-slate-50/30 dark:bg-slate-900/30">{t('cron.compare.sunday')}</td>
                <td className="p-3 text-xs">{t('cron.compare.sunday.linux')}</td>
                <td className="p-3 text-xs" colSpan={2}>{t('cron.compare.sunday.java')}</td>
                <td className="p-3 text-xs">{t('cron.compare.sunday.node')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 符号百科 (卡片式) */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-slate-50 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <div className="w-1 h-5 bg-green-500 rounded-full"></div>
          {t('cron.guide.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { s: t('cron.guide.s.any.t'), d: t('cron.guide.s.any.d'), e: t('cron.guide.s.any.e'), code: '* * * * *', isJava: false, c: 'bg-green-500/10 text-green-700 dark:text-green-400' },
            { s: t('cron.guide.s.step.t'), d: t('cron.guide.s.step.d'), e: t('cron.guide.s.step.e'), code: '*/15 * * * *', isJava: false, c: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
            { s: t('cron.guide.s.conflict.t'), d: t('cron.guide.s.conflict.d'), e: t('cron.guide.s.conflict.e'), code: '0 0 0 15 * ?', isJava: true, c: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
            { s: t('cron.guide.s.last.t'), d: t('cron.guide.s.last.d'), e: t('cron.guide.s.last.e'), code: '0 0 0 L * ?', isJava: true, c: 'bg-purple-500/10 text-purple-700 dark:text-purple-400' },
            { s: t('cron.guide.s.nth.t'), d: t('cron.guide.s.nth.d'), e: t('cron.guide.s.nth.e'), code: '0 0 0 ? * 6#3', isJava: true, c: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' },
            { s: t('cron.guide.s.hash.t'), d: t('cron.guide.s.hash.d'), e: t('cron.guide.s.hash.e'), code: 'H/15 * * * *', isJava: false, c: 'bg-rose-500/10 text-rose-700 dark:text-rose-400' },
          ].map(item => (
            <div key={item.s} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-md transition-all group">
              <div className={`inline-block px-2 py-1 rounded text-xs font-black mb-3 ${item.c}`}>
                {item.s}
              </div>
              <p className="text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">{item.d}</p>
              <div 
                onClick={() => handleExampleClick(item.code, item.isJava)}
                className="relative cursor-pointer text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-transparent group-hover:border-blue-500 group-hover:bg-blue-500/5 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.code}</span>
                  <MousePointerClick className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                </div>
                <div className="text-[10px] text-slate-400">{item.e.split('（')[1]?.replace('）', '') || item.e.split(' (')[1]?.replace(')', '')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
