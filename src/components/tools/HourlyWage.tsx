"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import {
  Calculator, DollarSign, Home, Coffee, Clock,
  RotateCcw, ChevronDown, ChevronUp, Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  monthSalary: number;
  bonusType: "months" | "amount";
  bonusMonths: number;
  yearEndBonus: number;
  // 五险
  insurance5Mode: "amount" | "rate" | "none";
  insurance5Monthly: number;
  insurance5Rate: number;
  insurance5BaseMode: "min" | "full";
  insurance5Base: number;   // editable base (auto-filled from monthSalary when "按实际工资")
  // 公积金
  fundMode: "amount" | "rate" | "none";
  fundMonthly: number;
  fundRate: number;
  fundBaseMode: "min" | "full";
  fundBase: number;
  // 个税减免
  taxDeduction: number;
  // 必要支出
  rent: number;
  utilities: number;
  food: number;
  commute: number;
  // 工作支出
  subscriptions: number;
  lifestyle: number;
  // 时间
  workDays: 5 | 5.5 | 6 | 7;
  timeMode: "precise" | "estimate";
  leaveTime: string;
  returnTime: string;
  dailyHours: number;
}

const DEFAULT_FORM: FormData = {
  monthSalary: 0,
  bonusType: "months",
  bonusMonths: 0,
  yearEndBonus: 0,
  insurance5Mode: "rate",
  insurance5Monthly: 0,
  insurance5Rate: 10.5,
  insurance5BaseMode: "min",
  insurance5Base: 0,
  fundMode: "rate",
  fundMonthly: 0,
  fundRate: 8,
  fundBaseMode: "min",
  fundBase: 0,
  taxDeduction: 0,
  rent: 0,
  utilities: 0,
  food: 0,
  commute: 0,
  subscriptions: 0,
  lifestyle: 0,
  workDays: 5,
  timeMode: "precise",
  leaveTime: "09:00",
  returnTime: "21:00",
  dailyHours: 0,
};

// ─── Tax bracket helper ───────────────────────────────────────────────────────
function calcTax(taxable: number): { tax: number; rate: number; quickDeduction: number } {
  if (taxable <= 0) return { tax: 0, rate: 3, quickDeduction: 0 };
  const brackets = [
    { limit: 36000,    rate: 3,  qd: 0       },
    { limit: 144000,   rate: 10, qd: 2520    },
    { limit: 300000,   rate: 20, qd: 16920   },
    { limit: 420000,   rate: 25, qd: 31920   },
    { limit: 660000,   rate: 30, qd: 52920   },
    { limit: 960000,   rate: 35, qd: 85920   },
    { limit: Infinity, rate: 45, qd: 181920  },
  ];
  const b = brackets.find(b => taxable <= b.limit)!;
  return { tax: Math.max(0, taxable * b.rate / 100 - b.qd), rate: b.rate, quickDeduction: b.qd };
}

// ─── NumberInput ──────────────────────────────────────────────────────────────
function NumberInput({ label, value, onChange, placeholder, ring = "cyan", note }: {
  label: string; value: number; onChange: (v: number) => void; placeholder?: string; ring?: string; note?: string;
}) {
  const ringClass = { rose: "focus:ring-rose-500", orange: "focus:ring-orange-500", purple: "focus:ring-purple-500", cyan: "focus:ring-cyan-500" }[ring] ?? "focus:ring-cyan-500";
  return (
    <div>
      {label && <label className="block text-sm font-mono mb-1.5 text-foreground/80">{label}</label>}
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        placeholder={placeholder ?? "0"}
        className={`w-full px-4 py-2.5 rounded-lg font-mono text-sm bg-background border border-border text-foreground focus:outline-none focus:ring-2 ${ringClass} transition-colors`}
      />
      {note && <p className="text-[11px] text-muted-foreground mt-1">{note}</p>}
    </div>
  );
}

// ─── SegmentButtons ───────────────────────────────────────────────────────────
function SegmentButtons<T extends string | number>({ options, value, onChange, accent = "cyan", cols = 2 }: {
  options: { value: T; label: string; sub?: string }[];
  value: T; onChange: (v: T) => void; accent?: string; cols?: number;
}) {
  const active = {
    cyan:   "bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400",
    purple: "bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400",
  }[accent] ?? "bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400";
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {options.map((opt) => (
        <button key={String(opt.value)} onClick={() => onChange(opt.value)}
          className={`px-3 py-2.5 rounded-lg border-2 text-xs font-mono transition-all text-center ${value === opt.value ? active : "bg-muted/50 border-border text-foreground hover:border-border/60"}`}
        >
          <div className="font-semibold">{opt.label}</div>
          {opt.sub && <div className="opacity-60 text-[10px] mt-0.5">{opt.sub}</div>}
        </button>
      ))}
    </div>
  );
}

// ─── Custom TimePicker (select-based, auto-closes after each choice) ──────────
function TimePicker({ value, onChange, label, accentColor = "purple" }: {
  value: string; onChange: (v: string) => void; label: string; accentColor?: string;
}) {
  const hours   = value ? parseInt(value.split(":")[0], 10) : 8;
  const minutes = value ? parseInt(value.split(":")[1], 10) : 0;
  const pad = (n: number) => String(n).padStart(2, "0");
  const selectClass = `px-3 py-2.5 rounded-lg font-mono text-sm bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 transition-colors cursor-pointer appearance-none text-center`;
  return (
    <div>
      <label className="block text-xs font-mono mb-1.5 text-muted-foreground">{label}</label>
      <div className="flex items-center gap-1.5">
        <select value={hours} onChange={e => onChange(`${pad(Number(e.target.value))}:${pad(minutes)}`)} className={selectClass}>
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>{pad(i)}</option>
          ))}
        </select>
        <span className="font-mono text-muted-foreground font-bold">:</span>
        <select value={minutes} onChange={e => onChange(`${pad(hours)}:${pad(Number(e.target.value))}`)} className={selectClass}>
          {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
            <option key={m} value={m}>{pad(m)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── InsuranceBlock ───────────────────────────────────────────────────────────
function InsuranceBlock({ label, modeKey, mode, monthly, rate, baseMode, base, monthSalary, onChange }: {
  label: string;
  modeKey: "insurance5" | "fund";
  mode: "amount" | "rate" | "none";
  monthly: number;
  rate: number;
  baseMode: "min" | "full";
  base: number;
  monthSalary: number;
  onChange: (patch: Partial<{ mode: "amount" | "rate" | "none"; monthly: number; rate: number; baseMode: "min" | "full"; base: number }>) => void;
}) {
  const { t } = useTranslation();
  const inputClass = "w-full px-4 py-2.5 rounded-lg font-mono text-sm bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors";
  const btnActive = "bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400";
  const btnInactive = "bg-muted/50 border-border text-foreground hover:border-border/60";

  return (
    <div className="space-y-2.5">
      <label className="block text-sm font-mono text-foreground/80">{label}</label>

      {/* Mode selector: 直接填 and 不交 in top row; 按比例 as expandable below */}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => onChange({ mode: "amount" })}
          className={`px-3 py-2.5 rounded-lg border-2 text-xs font-mono transition-all text-center ${mode === "amount" ? btnActive : btnInactive}`}>
          {t(`hourlyWage.${modeKey}.mode.amount`)}
        </button>
        <button onClick={() => onChange({ mode: "none" })}
          className={`px-3 py-2.5 rounded-lg border-2 text-xs font-mono transition-all text-center ${mode === "none" ? btnActive : btnInactive}`}>
          {t(`hourlyWage.${modeKey}.mode.none`)}
        </button>
      </div>

      <button onClick={() => onChange({ mode: mode === "rate" ? "amount" : "rate" })}
        className={`w-full px-3 py-2.5 rounded-lg border-2 text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 ${mode === "rate" ? btnActive : btnInactive}`}>
        {t(`hourlyWage.${modeKey}.mode.rate`)}
        <span className="opacity-60">{mode === "rate" ? "▲" : "▼"}</span>
      </button>

      {/* 直接填金额 */}
      {mode === "amount" && (
        <input type="number" value={monthly} onChange={e => onChange({ monthly: Number(e.target.value) || 0 })}
          placeholder={t(`hourlyWage.${modeKey}.monthly`)}
          className={inputClass}
        />
      )}

      {/* 按比例 sub-form */}
      {mode === "rate" && (
        <div className="pl-3 border-l-2 border-cyan-500/30 space-y-2">
          {/* 比例 */}
          <div className="flex items-center gap-2">
            <input type="number" value={rate} onChange={e => onChange({ rate: Number(e.target.value) || 0 })}
              placeholder={t(`hourlyWage.${modeKey}.rate.placeholder`)}
              className={`${inputClass} flex-1`}
            />
            <span className="font-mono text-sm text-muted-foreground shrink-0">%</span>
          </div>

          {/* 基数选择 */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onChange({ baseMode: "min" })}
              className={`px-2 py-2 rounded-lg border-2 text-xs font-mono transition-all text-center ${baseMode === "min" ? btnActive : btnInactive}`}>
              {t(`hourlyWage.${modeKey}.base.min`)}
            </button>
            <button
              onClick={() => onChange({ baseMode: "full", base: monthSalary })}
              className={`px-2 py-2 rounded-lg border-2 text-xs font-mono transition-all text-center ${baseMode === "full" ? btnActive : btnInactive}`}>
              {t(`hourlyWage.${modeKey}.base.full`)}
            </button>
          </div>

          {/* 基数输入 */}
          <input type="number" value={base}
            onChange={e => onChange({ base: Number(e.target.value) || 0 })}
            placeholder={t(`hourlyWage.${modeKey}.minBase`)}
            className={inputClass}
          />

          <p className="text-[11px] font-mono text-muted-foreground">
            月扣：¥{(base * rate / 100).toFixed(0)}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HourlyWage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [showResult, setShowResult] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const set = useCallback((patch: Partial<FormData>) => setForm((f) => ({ ...f, ...patch })), []);

  // ── Precise daily hours from time inputs ──
  const preciseHours = useMemo(() => {
    if (!form.leaveTime || !form.returnTime) return null;
    const [lh, lm] = form.leaveTime.split(":").map(Number);
    const [rh, rm] = form.returnTime.split(":").map(Number);
    let h = rh - lh + (rm - lm) / 60;
    if (h < 0) h += 24;
    return Math.round(h * 100) / 100;
  }, [form.leaveTime, form.returnTime]);

  const calc = useMemo(() => {
    const weeksPerMonth = 52 / 12;

    // Monthly gross (bonus spread evenly)
    const monthlyBonus = form.bonusType === "months"
      ? form.monthSalary * form.bonusMonths / 12
      : form.yearEndBonus / 12;
    const monthlyGross = form.monthSalary + monthlyBonus;

    // Monthly insurance
    const ins5Monthly = (() => {
      if (form.insurance5Mode === "none") return 0;
      if (form.insurance5Mode === "amount") return form.insurance5Monthly;
      const base = form.insurance5BaseMode === "full" ? form.monthSalary : form.insurance5Base;
      return base * form.insurance5Rate / 100;
    })();
    const fundMonthly = (() => {
      if (form.fundMode === "none") return 0;
      if (form.fundMode === "amount") return form.fundMonthly;
      const base = form.fundBaseMode === "full" ? form.monthSalary : form.fundBase;
      return base * form.fundRate / 100;
    })();
    const monthlyInsurance = ins5Monthly + fundMonthly;

    // Annual taxable → annual tax → avg monthly tax (for accurate bracket calc)
    const annualGross = monthlyGross * 12;
    const annualInsurance = monthlyInsurance * 12;
    const taxableIncome = annualGross - annualInsurance - 60000 - form.taxDeduction;
    const { tax: annualTax, rate: taxRate, quickDeduction } = calcTax(taxableIncome);
    const avgMonthTax = annualTax / 12;

    const monthlyNetIncome = monthlyGross - monthlyInsurance - avgMonthTax;

    // Monthly expenses (food: daily × 30; commute: daily × workDays/week × weeksPerMonth)
    const monthlyExpense =
      form.rent + form.utilities +
      form.food * 30 +
      form.commute * form.workDays * weeksPerMonth +
      form.subscriptions + form.lifestyle;

    const monthlyNetProfit = monthlyNetIncome - monthlyExpense;

    const dailyHours = form.timeMode === "precise"
      ? (preciseHours ?? form.dailyHours)
      : form.dailyHours;

    const safeDailyHours = dailyHours > 0 ? dailyHours : 0;
    const monthlyHours  = form.workDays * weeksPerMonth * safeDailyHours;
    const nominalHours  = form.workDays * weeksPerMonth * 8;
    const realWage      = monthlyHours > 0 ? monthlyNetProfit / monthlyHours : 0;
    const nominalWage   = nominalHours > 0 ? monthlyGross / nominalHours : 0;
    const efficiency    = nominalWage > 0 ? Math.max(realWage, 0) / nominalWage * 100 : 0;

    return {
      monthlyGross, ins5Monthly, fundMonthly, monthlyInsurance,
      taxableIncome, annualTax, taxRate, quickDeduction, avgMonthTax,
      monthlyNetIncome, monthlyExpense, monthlyNetProfit,
      monthlyHours, nominalHours, realWage, nominalWage, efficiency, dailyHours,
    };
  }, [form, preciseHours]);

  const exchanges = [
    { key: "hourlyWage.exchange.waimai",  price: 30,   icon: "🥡", unit: "min"  },
    { key: "hourlyWage.exchange.hotpot",  price: 200,  icon: "🍲", unit: "hour" },
    { key: "hourlyWage.exchange.movie",   price: 80,   icon: "🎬", unit: "hour" },
    { key: "hourlyWage.exchange.game648", price: 648,  icon: "🎮", unit: "hour" },
    { key: "hourlyWage.exchange.phone",   price: 5000, icon: "📱", unit: "day"  },
    { key: "hourlyWage.exchange.trip",    price: 2000, icon: "✈️", unit: "day"  },
  ];

  const formatExchange = (price: number, unit: string) => {
    const w = Math.max(calc.realWage, 0.01);
    if (unit === "min")  return `${((price / w) * 60).toFixed(0)} ${t("hourlyWage.exchange.minutes")}`;
    if (unit === "hour") return `${(price / w).toFixed(1)} ${t("hourlyWage.exchange.hours")}`;
    return `${(price / (w * Math.max(calc.dailyHours, 1))).toFixed(1)} ${t("hourlyWage.exchange.days")}`;
  };

  const handleCalculate = () => {
    if (showResult) { setShowResult(false); return; }
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setShowResult(true);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }, 1500);
  };

  const handleShare = useCallback(async () => {
    if (!resultRef.current) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(resultRef.current, {
        pixelRatio: 3,
        backgroundColor: document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff",
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "时薪分析报告.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "时薪分析报告" });
        toast.success("分享成功");
      } else {
        const link = document.createElement("a");
        link.download = "时薪分析报告.png";
        link.href = dataUrl;
        link.click();
        toast.success("图片已保存");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("share error:", err);
      toast.error("分享失败，请截图保存");
    }
  }, []);

  const fmt = (n: number) => Math.round(n).toLocaleString();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Badge */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/20 w-fit">
        <Calculator className="w-4 h-4 text-rose-400 animate-pulse" />
        <span className="text-sm font-mono text-rose-600 dark:text-rose-400">{t("hourlyWage.badge")}</span>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Module A: 收入模块 */}
        <Card className="bg-card/60 backdrop-blur-xl border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-base font-mono">
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div>
                <div>{t("hourlyWage.moduleA.title")}</div>
                <div className="text-xs font-normal text-muted-foreground">{t("hourlyWage.moduleA.subtitle")}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberInput label={t("hourlyWage.monthSalary")} value={form.monthSalary} onChange={(v) => set({ monthSalary: v })} />

            <div>
              <label className="block text-sm font-mono mb-2 text-foreground/80">{t("hourlyWage.bonus")}</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {(["months", "amount"] as const).map((type) => (
                  <button key={type} onClick={() => set({ bonusType: type })}
                    className={`px-3 py-2 rounded-lg border-2 text-xs font-mono transition-all ${form.bonusType === type ? "bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400" : "bg-muted/50 border-border text-foreground"}`}
                  >
                    {t(`hourlyWage.bonus.${type}`)}
                  </button>
                ))}
              </div>
              {form.bonusType === "months"
                ? <NumberInput label="" value={form.bonusMonths} onChange={(v) => set({ bonusMonths: v })} placeholder={t("hourlyWage.bonus.monthsPlaceholder")} />
                : <NumberInput label="" value={form.yearEndBonus} onChange={(v) => set({ yearEndBonus: v })} placeholder={t("hourlyWage.bonus.amountPlaceholder")} />
              }
            </div>

            {/* 五险 */}
            <InsuranceBlock
              label={t("hourlyWage.insurance5.label")}
              modeKey="insurance5"
              mode={form.insurance5Mode}
              monthly={form.insurance5Monthly}
              rate={form.insurance5Rate}
              baseMode={form.insurance5BaseMode}
              base={form.insurance5Base}
              monthSalary={form.monthSalary}
              onChange={(p) => set({
                ...(p.mode     !== undefined ? { insurance5Mode:     p.mode     } : {}),
                ...(p.monthly  !== undefined ? { insurance5Monthly:  p.monthly  } : {}),
                ...(p.rate     !== undefined ? { insurance5Rate:     p.rate     } : {}),
                ...(p.baseMode !== undefined ? { insurance5BaseMode: p.baseMode } : {}),
                ...(p.base     !== undefined ? { insurance5Base:     p.base     } : {}),
              })}
            />

            {/* 公积金 */}
            <InsuranceBlock
              label={t("hourlyWage.fund.label")}
              modeKey="fund"
              mode={form.fundMode}
              monthly={form.fundMonthly}
              rate={form.fundRate}
              baseMode={form.fundBaseMode}
              base={form.fundBase}
              monthSalary={form.monthSalary}
              onChange={(p) => set({
                ...(p.mode     !== undefined ? { fundMode:     p.mode     } : {}),
                ...(p.monthly  !== undefined ? { fundMonthly:  p.monthly  } : {}),
                ...(p.rate     !== undefined ? { fundRate:     p.rate     } : {}),
                ...(p.baseMode !== undefined ? { fundBaseMode: p.baseMode } : {}),
                ...(p.base     !== undefined ? { fundBase:     p.base     } : {}),
              })}
            />

            <NumberInput
              label={t("hourlyWage.taxDeduction")}
              value={form.taxDeduction}
              onChange={(v) => set({ taxDeduction: v })}
              placeholder={t("hourlyWage.taxDeduction.placeholder")}
            />
          </CardContent>
        </Card>

        {/* Module B: 必要支出 */}
        <Card className="bg-card/60 backdrop-blur-xl border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-base font-mono">
              <div className="p-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-500">
                <Home className="w-4 h-4 text-white" />
              </div>
              <div>
                <div>{t("hourlyWage.moduleB.title")}</div>
                <div className="text-xs font-normal text-muted-foreground">{t("hourlyWage.moduleB.subtitle")}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberInput label={t("hourlyWage.rent")}      value={form.rent}      onChange={(v) => set({ rent: v })}      ring="rose" />
            <NumberInput label={t("hourlyWage.utilities")} value={form.utilities} onChange={(v) => set({ utilities: v })} ring="rose" />
            <NumberInput label={t("hourlyWage.food")}      value={form.food}      onChange={(v) => set({ food: v })}      ring="rose" />
            <NumberInput label={t("hourlyWage.commute")}   value={form.commute}   onChange={(v) => set({ commute: v })}   ring="rose" />
          </CardContent>
        </Card>

        {/* Module C: 工作支出 */}
        <Card className="bg-card/60 backdrop-blur-xl border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-base font-mono">
              <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500">
                <Coffee className="w-4 h-4 text-white" />
              </div>
              <div>
                <div>{t("hourlyWage.moduleC.title")}</div>
                <div className="text-xs font-normal text-muted-foreground">{t("hourlyWage.moduleC.subtitle")}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberInput label={t("hourlyWage.subscriptions")} value={form.subscriptions} onChange={(v) => set({ subscriptions: v })} placeholder={t("hourlyWage.subscriptions.placeholder")} ring="orange" />
            <NumberInput label={t("hourlyWage.lifestyle")}     value={form.lifestyle}     onChange={(v) => set({ lifestyle: v })}     placeholder={t("hourlyWage.lifestyle.placeholder")}     ring="orange" />
          </CardContent>
        </Card>

        {/* Module D: 时间成本 */}
        <Card className="bg-card/60 backdrop-blur-xl border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-base font-mono">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <div>{t("hourlyWage.moduleD.title")}</div>
                <div className="text-xs font-normal text-muted-foreground">{t("hourlyWage.moduleD.subtitle")}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-mono mb-2 text-foreground/80">{t("hourlyWage.workDays")}</label>
              <SegmentButtons
                cols={4}
                options={[
                  { value: 5   as const, label: t("hourlyWage.workDays.5"),   sub: t("hourlyWage.workDays.5.sub")   },
                  { value: 5.5 as const, label: t("hourlyWage.workDays.5.5"), sub: t("hourlyWage.workDays.5.5.sub") },
                  { value: 6   as const, label: t("hourlyWage.workDays.6"),   sub: t("hourlyWage.workDays.6.sub")   },
                  { value: 7   as const, label: t("hourlyWage.workDays.7"),   sub: t("hourlyWage.workDays.7.sub")   },
                ]}
                value={form.workDays}
                onChange={(v) => set({ workDays: v })}
                accent="purple"
              />
            </div>

            <div>
              <label className="block text-sm font-mono mb-2 text-foreground/80">{t("hourlyWage.timeMode")}</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {(["precise", "estimate"] as const).map((mode) => (
                  <button key={mode} onClick={() => set({ timeMode: mode })}
                    className={`px-3 py-2 rounded-lg border-2 text-xs font-mono transition-all ${form.timeMode === mode ? "bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400" : "bg-muted/50 border-border text-foreground"}`}
                  >
                    {t(`hourlyWage.timeMode.${mode}`)}
                  </button>
                ))}
              </div>

              {form.timeMode === "precise" ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <TimePicker
                      label={t("hourlyWage.leaveTime")}
                      value={form.leaveTime}
                      onChange={(v) => set({ leaveTime: v })}
                    />
                    <TimePicker
                      label={t("hourlyWage.returnTime")}
                      value={form.returnTime}
                      onChange={(v) => set({ returnTime: v })}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{t("hourlyWage.timeNote")}</p>
                  {preciseHours !== null && (
                    <p className="text-xs font-mono text-purple-500 font-semibold">
                      {t("hourlyWage.calcHours").replace("{hours}", String(preciseHours))}
                    </p>
                  )}
                </div>
              ) : (
                <NumberInput label={t("hourlyWage.dailyHours")} value={form.dailyHours} onChange={(v) => set({ dailyHours: v })} placeholder={t("hourlyWage.dailyHours.placeholder")} ring="purple" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button size="lg"
          onClick={handleCalculate}
          disabled={isAnimating}
          className="font-mono text-base px-10 py-6 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white border-0 shadow-lg shadow-rose-500/25"
        >
          {showResult
            ? <><ChevronUp className="w-5 h-5 mr-2" />{t("hourlyWage.cta.back")}</>
            : <><ChevronDown className="w-5 h-5 mr-2" />{t("hourlyWage.cta")}</>
          }
        </Button>
      </div>

      {/* Calculation animation overlay */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              className="absolute inset-3 rounded-2xl pointer-events-none"
              animate={{
                boxShadow: [
                  "0 0 0 4px #f43f5e, 0 0 40px #f43f5e88",
                  "0 0 0 4px #fb923c, 0 0 40px #fb923c88",
                  "0 0 0 4px #facc15, 0 0 40px #facc1588",
                  "0 0 0 4px #34d399, 0 0 40px #34d39988",
                  "0 0 0 4px #38bdf8, 0 0 40px #38bdf888",
                  "0 0 0 4px #a78bfa, 0 0 40px #a78bfa88",
                  "0 0 0 4px #f43f5e, 0 0 40px #f43f5e88",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full mx-auto"
              />
              <p className="font-mono text-lg text-foreground font-bold">计算中...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {showResult && (
        <div ref={resultRef} className="space-y-6 pt-2">
          {/* Wage Analysis */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-rose-500/40 bg-gradient-to-br from-rose-500/10 to-orange-500/10 p-8">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-orange-500" />
            <h2 className="text-xl font-bold font-mono text-foreground mb-6 text-center">{t("hourlyWage.result.title")}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* 表面时薪 */}
              <div className="bg-card/60 rounded-xl p-5 space-y-2">
                <div className="text-xs font-mono text-muted-foreground">{t("hourlyWage.result.nominal")}</div>
                <div className="text-3xl font-bold font-mono text-cyan-400">
                  ¥{calc.nominalWage.toFixed(2)}<span className="text-base text-muted-foreground">/h</span>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground/70 bg-muted/40 rounded px-2 py-1.5 leading-relaxed">
                  ¥{fmt(calc.monthlyGross)} ÷ {calc.nominalHours.toFixed(1)}h = ¥{calc.nominalWage.toFixed(2)}/h
                </div>
              </div>
              {/* 真实净时薪 */}
              <div className="bg-card/60 rounded-xl p-5 space-y-2">
                <div className="text-xs font-mono text-muted-foreground">{t("hourlyWage.result.real")}</div>
                <div className="text-3xl font-bold font-mono text-rose-400">
                  ¥{calc.realWage.toFixed(2)}<span className="text-base text-muted-foreground">/h</span>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground/70 bg-muted/40 rounded px-2 py-1.5 leading-relaxed">
                  (¥{fmt(calc.monthlyNetIncome)} - ¥{fmt(calc.monthlyExpense)}) ÷ {calc.monthlyHours.toFixed(1)}h = ¥{calc.realWage.toFixed(2)}/h
                </div>
              </div>
            </div>

            {/* Efficiency */}
            <div className="bg-card/60 rounded-xl p-5 text-center mb-6">
              <div className="text-xs font-mono text-muted-foreground mb-1">
                {t("hourlyWage.result.efficiency")}（{t("hourlyWage.result.efficiencyDesc")}）
              </div>
              <div className="text-4xl font-black font-mono" style={{
                color: calc.efficiency >= 50 ? "#34d399" : calc.efficiency >= 25 ? "#fb923c" : "#f43f5e"
              }}>
                {calc.efficiency.toFixed(1)}%
              </div>
              <div className="text-[11px] font-mono text-muted-foreground/70 mt-1">
                ¥{calc.realWage.toFixed(2)} / ¥{calc.nominalWage.toFixed(2)} = {calc.efficiency.toFixed(1)}%
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: t("hourlyWage.result.monthlyNet"),     value: `¥${fmt(calc.monthlyNetIncome)}`,    color: "" },
                { label: t("hourlyWage.result.monthlyExpense"), value: `¥${fmt(calc.monthlyExpense)}`,      color: "text-rose-400" },
                { label: t("hourlyWage.result.monthlyProfit"),  value: `¥${fmt(calc.monthlyNetProfit)}`,    color: calc.monthlyNetProfit < 0 ? "text-rose-500" : "text-emerald-500" },
              ].map((s) => (
                <div key={s.label} className="bg-card/60 rounded-xl p-3">
                  <div className={`text-xl font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 价目兑换表 — 仅在真实时薪为正时展示 */}
          {calc.realWage > 0 && <Card className="bg-card/60 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="text-base font-mono text-center">{t("hourlyWage.result.exchangeTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exchanges.map((item) => (
                  <div key={item.key} className="p-4 rounded-xl border-2 border-border bg-muted/30 hover:border-rose-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-bold font-mono text-sm text-foreground">{t(item.key)}</div>
                        <span className="inline-block px-2 py-0.5 rounded border border-border text-xs font-mono text-muted-foreground">¥{item.price}</span>
                      </div>
                    </div>
                    <div className="text-xs font-mono p-2 rounded-lg bg-card">
                      {t("hourlyWage.result.needsLife")}{" "}
                      <span className="font-bold text-rose-400 text-base">{formatExchange(item.price, item.unit)}</span>{" "}
                      {t("hourlyWage.result.ofLife")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>}

        </div>
      )}

      {/* Share / Reset — outside resultRef so buttons don't appear in screenshot */}
      {showResult && (
        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            className="font-mono bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />{t("hourlyWage.result.share")}
          </Button>
          <Button variant="outline" className="font-mono" onClick={() => { setShowResult(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <RotateCcw className="w-4 h-4 mr-2" />{t("hourlyWage.result.recalculate")}
          </Button>
        </div>
      )}
    </div>
  );
}
