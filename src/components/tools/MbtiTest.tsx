"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw, ImageDown, ChevronLeft, ChevronRight, Briefcase, BookOpen, BarChart3, CheckCircle2, Circle, Home, Zap, ArrowRight, Clock, Layers, Users, Rocket } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import {
  classicQuestions,
  officeQuestions,
  mbtiTypes,
  type Pole,
  type Dimension,
} from "@/data/mbti-questions";

type TestMode = "classic" | "office";
type Screen = "select" | "testing" | "result";

type ClassicAnswers = Record<number, number>;
type OfficeAnswers = Record<number, number>;

const OPPOSITE: Record<Pole, Pole> = {
  E: "I", I: "E", S: "N", N: "S", T: "F", F: "T", J: "P", P: "J",
};

type ScoreMap = Record<string, number>;
type ResultData = { type: string; scores: ScoreMap };

function computeClassicResult(answers: ClassicAnswers): ResultData {
  const scores: ScoreMap = { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };
  for (const q of classicQuestions) {
    const v = answers[q.id];
    if (v === undefined || v === 0) continue;
    if (v > 0) scores[q.yesType] += v;
    else scores[OPPOSITE[q.yesType]] += Math.abs(v);
  }
  return { type: buildType(scores), scores };
}

function computeOfficeResult(answers: OfficeAnswers): ResultData {
  const scores: ScoreMap = { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };
  for (const q of officeQuestions) {
    const idx = answers[q.id];
    if (idx === undefined) continue;
    scores[q.options[idx].type]++;
  }
  return { type: buildType(scores), scores };
}

function buildType(scores: ScoreMap): string {
  return (["EI", "SN", "TF", "JP"] as Dimension[])
    .map(dim => scores[dim[0]] >= scores[dim[1]] ? dim[0] : dim[1])
    .join("");
}

// ─── Likert options ──────────────────────────────────────────────────────────
const LIKERT = [
  { value: -2, label: "完全不符合", labelEn: "Strongly disagree", color: "from-red-500 to-orange-500" },
  { value: -1, label: "不太符合",   labelEn: "Disagree",          color: "from-orange-500 to-yellow-500" },
  { value:  0, label: "说不准",     labelEn: "Neutral",           color: "from-yellow-500 to-green-500" },
  { value:  1, label: "比较符合",   labelEn: "Agree",             color: "from-green-500 to-blue-500" },
  { value:  2, label: "非常符合",   labelEn: "Strongly agree",    color: "from-blue-500 to-purple-500" },
];

// ─── Shimmer CSS ────────────────────────────────────────────────────────────
const SHIMMER_CSS = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer { animation: shimmer 2s infinite; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }
`;

// ─── Mode Select ─────────────────────────────────────────────────────────────
function ModeSelect({ onSelect }: { onSelect: (mode: TestMode) => void }) {
  const { lang } = useTranslation();
  const zh = lang !== "en";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {/* Classic MBTI Card */}
      <motion.button
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect("classic")}
        className="group relative bg-card rounded-3xl p-8 sm:p-10 flex flex-col text-left border border-border transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
          <BookOpen className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">{zh ? "MBTI 测试" : "MBTI Test"}</h2>
        <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
          {zh ? "深度自我探索版本。通过全面的维度分析，获取最精准的性格画像，适用于个人深度成长。" : "Deep self-exploration. Comprehensive dimension analysis for the most accurate personality portrait."}
        </p>
        <div className="space-y-3.5 mb-10">
          <div className="flex items-center text-sm text-muted-foreground">
            <Layers className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span>{zh ? "104 道标准题目" : "104 standard questions"}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <BarChart3 className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span>{zh ? "5 档量表精准测量" : "5-point Likert scale"}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span>~15 min</span>
          </div>
        </div>
        <div className="w-full bg-muted text-foreground py-3.5 rounded-xl font-bold text-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex items-center justify-center">
          {zh ? "开始测试" : "Start Test"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </motion.button>

      {/* Office MBTI Card */}
      <motion.button
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect("office")}
        className="group relative overflow-hidden bg-card rounded-3xl p-8 sm:p-10 flex flex-col text-left border border-border transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
      >
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-amber-400" />
        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 dark:bg-orange-500/15 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
          <Briefcase className="w-7 h-7 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-2xl sm:text-3xl font-bold">{zh ? "MBTI 测试（牛马版）" : "MBTI Test (Office)"}</h2>
          <span className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full">{zh ? "推荐" : "HOT"}</span>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
          {zh ? "职场精简版。专注于工作场景下的沟通风格与协作模式，快速获取你的打工人格画像。" : "Workplace edition. Focus on communication styles and collaboration patterns in work scenarios."}
        </p>
        <div className="space-y-3.5 mb-10">
          <div className="flex items-center text-sm text-muted-foreground">
            <Layers className="w-4 h-4 mr-3 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <span>{zh ? "20 道职场灵魂拷问" : "20 workplace scenarios"}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-3 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <span>{zh ? "专为打工人设计" : "Designed for workers"}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-3 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <span>~3 min</span>
          </div>
        </div>
        <div className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3.5 rounded-xl font-bold text-center transition-all duration-300 flex items-center justify-center shadow-md group-hover:shadow-lg">
          {zh ? "立即体验" : "Try Now"}
          <Rocket className="w-4 h-4 ml-2" />
        </div>
      </motion.button>
    </div>
  );
}

// ─── Classic Question (5-point Likert) ───────────────────────────────────────
function ClassicQuestion({
  question,
  answer,
  onAnswer,
}: {
  question: typeof classicQuestions[0];
  answer: number | undefined;
  onAnswer: (v: number) => void;
}) {
  const { lang } = useTranslation();
  const zh = lang !== "en";
  return (
    <div className="space-y-4">
      {LIKERT.map(({ value, label, labelEn, color }) => {
        const selected = answer === value;
        return (
          <button
            key={value}
            onClick={() => onAnswer(value)}
            className={cn(
              "group relative w-full p-5 rounded-xl border-2 transition-all duration-300",
              selected
                ? "bg-muted/50 dark:bg-slate-800 border-cyan-500 scale-[1.02]"
                : "bg-card dark:bg-slate-900/30 border-border hover:border-muted-foreground/40 hover:scale-[1.01]"
            )}
          >
            {selected && (
              <div className={cn("absolute -inset-1 bg-gradient-to-r rounded-xl opacity-20 blur-xl", color)} />
            )}
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0 relative">
                {selected ? (
                  <>
                    <div className={cn("absolute inset-0 bg-gradient-to-r rounded-full blur-md opacity-60", color)} />
                    <div className={cn("relative p-1 bg-gradient-to-r rounded-full", color)}>
                      <CheckCircle2 className="size-6 text-white" />
                    </div>
                  </>
                ) : (
                  <Circle className="size-8 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                )}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className={cn(
                  "text-base font-medium transition-colors",
                  selected ? "text-foreground" : "text-muted-foreground"
                )}>
                  {zh ? label : labelEn}
                </span>
                <span className={cn(
                  "text-xs font-mono px-2 py-0.5 rounded-full",
                  selected
                    ? cn("bg-gradient-to-r text-white", color)
                    : "bg-muted text-muted-foreground"
                )}>
                  {value}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Office Question (A/B/C/D) ───────────────────────────────────────────────
function OfficeQuestion({
  question,
  answer,
  onAnswer,
}: {
  question: typeof officeQuestions[0];
  answer: number | undefined;
  onAnswer: (idx: number) => void;
}) {
  const { lang } = useTranslation();
  const zh = lang !== "en";
  const optionColors = [
    "from-red-500 to-orange-500",
    "from-orange-500 to-yellow-500",
    "from-green-500 to-blue-500",
    "from-blue-500 to-purple-500",
  ];
  return (
    <div className="space-y-3">
      {question.options.map((opt, i) => {
        const label = String.fromCharCode(65 + i);
        const selected = answer === i;
        const color = optionColors[i];
        return (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            className={cn(
              "group relative w-full p-5 rounded-xl border-2 text-left transition-all duration-300",
              selected
                ? "bg-muted/50 dark:bg-slate-800 border-orange-500 scale-[1.02]"
                : "bg-card dark:bg-slate-900/30 border-border hover:border-muted-foreground/40 hover:scale-[1.01]"
            )}
          >
            {selected && (
              <div className={cn("absolute -inset-1 bg-gradient-to-r rounded-xl opacity-20 blur-xl", color)} />
            )}
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 relative mt-0.5">
                {selected ? (
                  <>
                    <div className={cn("absolute inset-0 bg-gradient-to-r rounded-full blur-md opacity-60", color)} />
                    <div className={cn("relative p-1 bg-gradient-to-r rounded-full", color)}>
                      <CheckCircle2 className="size-5 text-white" />
                    </div>
                  </>
                ) : (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-muted-foreground text-sm font-mono">
                    {label}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-sm font-medium leading-relaxed transition-colors",
                selected ? "text-foreground" : "text-muted-foreground"
              )}>
                {zh ? opt.text : opt.textEn}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Question Screen ──────────────────────────────────────────────────────────
function QuestionScreen({
  mode,
  classicAnswers,
  officeAnswers,
  onClassicAnswer,
  onOfficeAnswer,
  onBack,
  onSubmit,
}: {
  mode: TestMode;
  classicAnswers: ClassicAnswers;
  officeAnswers: OfficeAnswers;
  onClassicAnswer: (id: number, v: number | undefined) => void;
  onOfficeAnswer: (id: number, idx: number | undefined) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const questions = mode === "classic" ? classicQuestions : officeQuestions;
  const answers = mode === "classic" ? classicAnswers : officeAnswers;
  const answeredCount = Object.keys(answers).length;

  const [viewIdx, setViewIdx] = useState<number>(0);
  const viewIdxRef = useRef(0);

  const question = questions[viewIdx];
  const progress = (answeredCount / questions.length) * 100;

  const [animDir, setAnimDir] = useState<1 | -1>(1);

  const goTo = useCallback((idx: number) => {
    setAnimDir(idx > viewIdxRef.current ? 1 : -1);
    viewIdxRef.current = idx;
    setViewIdx(idx);
  }, []);

  const handleClassicAnswer = useCallback((v: number) => {
    const idx = viewIdxRef.current;
    onClassicAnswer(questions[idx].id, v);
    if (idx < questions.length - 1) {
      const next = idx + 1;
      setAnimDir(1);
      viewIdxRef.current = next;
      setViewIdx(next);
    }
  }, [questions, onClassicAnswer]);

  const handleOfficeAnswer = useCallback((idx: number) => {
    const qi = viewIdxRef.current;
    onOfficeAnswer(questions[qi].id, idx);
    if (qi < questions.length - 1) {
      const next = qi + 1;
      setAnimDir(1);
      viewIdxRef.current = next;
      setViewIdx(next);
    }
  }, [questions, onOfficeAnswer]);

  const handlePrev = useCallback(() => {
    if (viewIdxRef.current > 0) goTo(viewIdxRef.current - 1);
  }, [goTo]);

  const handleNext = useCallback(() => {
    if (viewIdxRef.current < questions.length - 1) goTo(viewIdxRef.current + 1);
  }, [goTo, questions.length]);

  const allDone = useMemo(() => questions.every(q => answers[q.id] !== undefined), [questions, answers]);
  const firstUnansweredIdx = useMemo(() => questions.findIndex(q => answers[q.id] === undefined), [questions, answers]);

  const { lang } = useTranslation();
  const zh = lang !== "en";
  const isClassic = mode === "classic";

  return (
    <div className="space-y-6">
      <style>{SHIMMER_CSS}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-muted-foreground">
          <ChevronLeft className="w-4 h-4" />
          {zh ? "返回" : "Back"}
        </Button>
        <div className="text-sm font-mono text-muted-foreground">
          {zh ? "已完成" : "Done"} {answeredCount} / {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="h-2 rounded-full overflow-hidden bg-muted">
          <div
            className={cn(
              "h-full transition-all duration-500 relative overflow-hidden rounded-full",
              isClassic
                ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
            )}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs font-mono text-muted-foreground">
          <span>{isClassic ? (zh ? "MBTI 测试 · 5 档量表" : "MBTI · 5-point scale") : (zh ? "MBTI 牛马版" : "MBTI Office")}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Main Content: Left question + Right navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
        {/* Left: Question Area */}
        <div className="space-y-6">
          {/* Question Card */}
          <div className="relative bg-card/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-border overflow-hidden">
            {/* Question Header */}
            <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className={cn(
                  "text-sm font-mono font-semibold px-3 py-1 rounded-lg text-white",
                  isClassic
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                    : "bg-gradient-to-r from-orange-500 to-red-500"
                )}>
                  {zh ? "问题" : "Q"} {viewIdx + 1}
                </span>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <BarChart3 className="size-4" />
                  <span>{zh ? "维度" : "Dim"}: {question.dimension}</span>
                </div>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold leading-relaxed">
                {mode === "classic"
                  ? (zh ? (question as typeof classicQuestions[0]).zh : (question as typeof classicQuestions[0]).en)
                  : (zh ? (question as typeof officeQuestions[0]).question : (question as typeof officeQuestions[0]).questionEn)
                }
              </h2>
            </div>

            {/* Answer Options */}
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: animDir * 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -animDir * 30 }}
                  transition={{ duration: 0.15 }}
                >
                  {mode === "classic" ? (
                    <ClassicQuestion
                      question={question as typeof classicQuestions[0]}
                      answer={classicAnswers[question.id]}
                      onAnswer={handleClassicAnswer}
                    />
                  ) : (
                    <OfficeQuestion
                      question={question as typeof officeQuestions[0]}
                      answer={officeAnswers[question.id] as number | undefined}
                      onAnswer={handleOfficeAnswer}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={viewIdx === 0}
                  className="flex-1 font-mono"
                >
                  <ChevronLeft className="size-4 mr-2" />
                  {zh ? "上一题" : "Prev"}
                </Button>
                {viewIdx < questions.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className={cn(
                      "flex-1 font-mono text-white",
                      isClassic
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                        : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                    )}
                  >
                    {zh ? "下一题" : "Next"}
                    <ChevronRight className="size-4 ml-2" />
                  </Button>
                ) : allDone ? (
                  <Button
                    onClick={onSubmit}
                    className="flex-1 font-mono text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                  >
                    <CheckCircle2 className="size-4 mr-2" />
                    {zh ? "查看结果" : "See Results"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => firstUnansweredIdx !== -1 && goTo(firstUnansweredIdx)}
                    className="flex-1 font-mono"
                  >
                    {zh ? `跳到第 ${firstUnansweredIdx + 1} 题` : `Go to Q${firstUnansweredIdx + 1}`}
                  </Button>
                )}
              </div>

              {/* Tip */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start gap-3">
                  <Zap className="size-4 text-cyan-500 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">{zh ? "答题建议：" : "Tip: "}</span>
                    {zh ? "请根据你的第一直觉作答，不要过度思考。选择最符合你日常行为和想法的选项。" : "Go with your gut feeling. Choose the option that best matches your everyday behavior."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Question Navigator */}
        <div className="hidden lg:flex sticky top-4 self-start">
          <div className="bg-card/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-border overflow-hidden flex flex-col w-full max-h-[calc(100vh-120px)]">
            <div className="px-5 py-4 border-b border-border shrink-0">
              <h3 className="text-base font-bold font-mono flex items-center gap-2">
                <BarChart3 className="size-4" />
                {zh ? "题目总览" : "Overview"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{zh ? "点击题号快速跳转" : "Click to jump"}</p>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 min-h-0">
              <div className="grid grid-cols-6 gap-2">
                {questions.map((q, i) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = i === viewIdx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => goTo(i)}
                      className={cn(
                        "relative aspect-square rounded-lg font-mono text-sm font-semibold transition-all duration-200 flex items-center justify-center",
                        isCurrent
                          ? isClassic
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-110 z-10"
                            : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-110 z-10"
                          : isAnswered
                            ? "bg-cyan-500/10 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 dark:hover:bg-slate-700"
                            : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                      )}
                    >
                      {isCurrent && (
                        <div className={cn(
                          "absolute -inset-1 bg-gradient-to-r rounded-lg blur opacity-60",
                          isClassic ? "from-cyan-500 to-blue-500" : "from-orange-500 to-red-500"
                        )} />
                      )}
                      <span className="relative">{i + 1}</span>
                      {isAnswered && !isCurrent && (
                        <CheckCircle2 className="absolute -top-1 -right-1 size-3 text-green-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit button in sidebar */}
            {allDone && (
              <div className="p-4 border-t border-border">
                <Button
                  onClick={onSubmit}
                  className="w-full font-mono text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                >
                  <CheckCircle2 className="size-4 mr-2" />
                  {zh ? "查看结果" : "See Results"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: Compact navigator (collapsible) */}
      <div className="lg:hidden">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-muted/50 border border-border text-sm font-mono text-muted-foreground">
            <span className="flex items-center gap-2">
              <BarChart3 className="size-4" />
              {zh ? "题目总览" : "Overview"} · {answeredCount}/{questions.length}
            </span>
            <ChevronRight className="size-4 transition-transform group-open:rotate-90" />
          </summary>
          <div className="grid grid-cols-10 sm:grid-cols-13 gap-1.5 mt-3">
            {questions.map((q, i) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = i === viewIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => goTo(i)}
                  className={cn(
                    "aspect-square rounded text-xs font-mono font-semibold transition-all flex items-center justify-center",
                    isCurrent
                      ? isClassic ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
                      : isAnswered
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </details>
      </div>
    </div>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────
function ResultScreen({
  mode,
  type,
  scores,
  onRestart,
  onHome,
}: {
  mode: TestMode;
  type: string;
  scores: ScoreMap;
  onRestart: () => void;
  onHome: () => void;
}) {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const { lang } = useTranslation();
  const zh = lang !== "en";
  const typeInfo = mbtiTypes[type];
  const accentColor = mode === "classic" ? "blue" : "orange";

  const typeName     = zh ? typeInfo.title      : typeInfo.titleEn;
  const typeTagline  = zh ? typeInfo.tagline     : typeInfo.taglineEn;
  const typeDesc     = zh ? typeInfo.desc        : typeInfo.descEn;
  const typeStrengths  = zh ? typeInfo.strengths   : typeInfo.strengthsEn;
  const typeWeaknesses = zh ? typeInfo.weaknesses  : typeInfo.weaknessesEn;
  const officeTitle  = zh ? typeInfo.officeTitle  : typeInfo.officeTitleEn;
  const officeDesc   = zh ? typeInfo.officeDesc   : typeInfo.officeDescEn;

  const dimensions: { dim: Dimension; poles: [Pole, Pole] }[] = [
    { dim: "EI", poles: ["E", "I"] },
    { dim: "SN", poles: ["S", "N"] },
    { dim: "TF", poles: ["T", "F"] },
    { dim: "JP", poles: ["J", "P"] },
  ];

  const dimLabels: Record<Dimension, { label: string; desc: [string, string] }> = zh ? {
    EI: { label: "能量来源", desc: ["外向 E", "内向 I"] },
    SN: { label: "信息收集", desc: ["实感 S", "直觉 N"] },
    TF: { label: "决策方式", desc: ["思考 T", "情感 F"] },
    JP: { label: "生活方式", desc: ["判断 J", "感知 P"] },
  } : {
    EI: { label: "Energy",     desc: ["Extrovert E", "Introvert I"] },
    SN: { label: "Perception", desc: ["Sensing S",   "Intuition N"] },
    TF: { label: "Judgment",   desc: ["Thinking T",  "Feeling F"]   },
    JP: { label: "Lifestyle",  desc: ["Judging J",   "Perceiving P"] },
  };

  const handleShare = useCallback(async () => {
    if (!shareCardRef.current) return;
    try {
      const { toPng } = await import("html-to-image");
      const isDark = document.documentElement.classList.contains("dark");
      const dataUrl = await toPng(shareCardRef.current, {
        pixelRatio: 3,
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `MBTI-${type}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(zh ? "图片已保存" : "Image saved");
    } catch {
      toast.error(zh ? "生成图片失败，请截图保存" : "Failed to generate image");
    }
  }, [type, zh]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* ── Shareable card ── */}
      <div ref={shareCardRef} className="space-y-6 rounded-2xl p-4">
        {/* Type badge */}
        <div className="text-center space-y-3 py-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={cn(
              "inline-flex items-center justify-center w-24 h-24 rounded-3xl text-4xl font-black mx-auto",
              accentColor === "blue"
                ? "bg-blue-500/15 text-blue-500 border-2 border-blue-500/30"
                : "bg-orange-500/15 text-orange-500 border-2 border-orange-500/30"
            )}
          >
            {typeInfo.emoji}
          </motion.div>
          <div>
            <div className="text-4xl font-black tracking-widest font-mono">{type}</div>
            <div className="text-lg font-bold text-muted-foreground mt-1">
              {mode === "classic" ? typeName : officeTitle}
            </div>
            {mode === "classic" && typeTagline && (
              <div className="text-sm text-muted-foreground italic mt-1">{typeTagline}</div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className={cn(
          "p-5 rounded-2xl border",
          accentColor === "blue" ? "border-blue-500/20 bg-blue-500/5" : "border-orange-500/20 bg-orange-500/5"
        )}>
          <p className="text-sm leading-relaxed">
            {mode === "classic" ? typeDesc : officeDesc}
          </p>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>✦</span> {zh ? "核心优势" : "Core Strengths"}
            </div>
            <div className="flex flex-wrap gap-2">
              {typeStrengths.map((s, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">{s}</span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span>⚠</span> {zh ? "注意盲点" : "Watch Out For"}
            </div>
            <div className="flex flex-wrap gap-2">
              {typeWeaknesses.map((w, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">{w}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Famous people */}
        {typeInfo.famous.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-muted-foreground">{zh ? "代表人物" : "Famous Examples"}</div>
            <div className="flex flex-wrap gap-2">
              {typeInfo.famous.map((f, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground border border-border whitespace-nowrap">{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* Dimension bars */}
        <div className="space-y-4">
          <div className="text-sm font-bold text-muted-foreground">{zh ? "维度分析" : "Dimension Analysis"}</div>
          {dimensions.map(({ dim, poles }) => {
            const [a, b] = poles;
            const aScore = scores[a] ?? 0;
            const bScore = scores[b] ?? 0;
            const total = aScore + bScore || 1;
            const aPct = Math.round((aScore / total) * 100);
            const bPct = 100 - aPct;
            const winner = aScore >= bScore ? a : b;
            return (
              <div key={dim} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className={cn(winner === a ? "text-foreground font-bold" : "text-muted-foreground")}>
                    {dimLabels[dim].desc[0]}
                  </span>
                  <span className="text-muted-foreground font-mono text-[10px]">{dimLabels[dim].label}</span>
                  <span className={cn(winner === b ? "text-foreground font-bold" : "text-muted-foreground")}>
                    {dimLabels[dim].desc[1]}
                  </span>
                </div>
                <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "absolute left-0 top-0 h-full rounded-full transition-all",
                      accentColor === "blue" ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-gradient-to-r from-orange-500 to-red-500"
                    )}
                    style={{ width: `${aPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>{aPct}%</span>
                  <span>{bPct}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Watermark */}
        <div className="text-center text-[10px] text-muted-foreground/50 font-mono pt-1">
          dogupup.com/mbti
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
          <ImageDown className="w-4 h-4" />
          {zh ? "图片分享" : "Save Image"}
        </Button>
        <Button variant="outline" className="flex-1 gap-2" onClick={onRestart}>
          <RotateCcw className="w-4 h-4" />
          {zh ? "重新测试" : "Retake"}
        </Button>
        <Button variant="outline" className="flex-1 gap-2" onClick={onHome}>
          <Home className="w-4 h-4" />
          {zh ? "返回首页" : "Home"}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── localStorage helpers ───────────────────────────────────────────────────
const MBTI_STORAGE_KEY = "mbti_progress";

function saveProgress(mode: TestMode, answers: ClassicAnswers | OfficeAnswers) {
  try {
    localStorage.setItem(MBTI_STORAGE_KEY, JSON.stringify({ mode, answers, ts: Date.now() }));
  } catch { /* quota exceeded or private mode */ }
}

function loadProgress(): { mode: TestMode; answers: ClassicAnswers | OfficeAnswers } | null {
  try {
    const raw = localStorage.getItem(MBTI_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - (data.ts || 0) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(MBTI_STORAGE_KEY);
      return null;
    }
    if (data.mode && data.answers && Object.keys(data.answers).length > 0) return data;
    return null;
  } catch { return null; }
}

function clearProgress() {
  try { localStorage.removeItem(MBTI_STORAGE_KEY); } catch { /* ignore */ }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MbtiTest() {
  const [screen, setScreen] = useState<Screen>("select");
  const [mode, setMode] = useState<TestMode>("classic");
  const [classicAnswers, setClassicAnswers] = useState<ClassicAnswers>({});
  const [officeAnswers, setOfficeAnswers] = useState<OfficeAnswers>({});
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setMode(saved.mode);
      if (saved.mode === "classic") setClassicAnswers(saved.answers as ClassicAnswers);
      else setOfficeAnswers(saved.answers as OfficeAnswers);
      setScreen("testing");
    }
  }, []);

  useEffect(() => {
    if (screen !== "testing") return;
    const answers = mode === "classic" ? classicAnswers : officeAnswers;
    if (Object.keys(answers).length > 0) saveProgress(mode, answers);
  }, [screen, mode, classicAnswers, officeAnswers]);

  const handleModeSelect = (m: TestMode) => {
    setMode(m);
    setClassicAnswers({});
    setOfficeAnswers({});
    setResult(null);
    clearProgress();
    setScreen("testing");
  };

  const handleClassicAnswer = useCallback((id: number, v: number | undefined) => {
    setClassicAnswers((prev) => {
      const next = { ...prev };
      if (v === undefined) { delete next[id]; return next; }
      next[id] = v;
      return next;
    });
  }, []);

  const handleOfficeAnswer = useCallback((id: number, idx: number | undefined) => {
    setOfficeAnswers((prev) => {
      const next = { ...prev };
      if (idx === undefined) { delete next[id]; return next; }
      next[id] = idx;
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const res = mode === "classic"
      ? computeClassicResult(classicAnswers)
      : computeOfficeResult(officeAnswers);
    setResult(res);
    setScreen("result");
    clearProgress();
  }, [mode, classicAnswers, officeAnswers]);

  const handleRestart = () => {
    setClassicAnswers({});
    setOfficeAnswers({});
    setResult(null);
    clearProgress();
    setScreen("select");
  };

  return (
    <div className={cn("w-full mx-auto", screen === "select" ? "max-w-5xl" : screen === "testing" ? "max-w-[1200px]" : "max-w-2xl")}>
      <div className={cn(
        screen === "result" && "rounded-2xl border border-border bg-card/50 p-6",
        screen === "testing" && "border-none bg-transparent p-0"
      )}>
        <AnimatePresence mode="wait">
          {screen === "select" && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ModeSelect onSelect={handleModeSelect} />
            </motion.div>
          )}
          {screen === "testing" && (
            <motion.div key="testing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuestionScreen
                mode={mode}
                classicAnswers={classicAnswers}
                officeAnswers={officeAnswers}
                onClassicAnswer={handleClassicAnswer}
                onOfficeAnswer={handleOfficeAnswer}
                onBack={() => { setClassicAnswers({}); setOfficeAnswers({}); clearProgress(); setScreen("select"); }}
                onSubmit={handleSubmit}
              />
            </motion.div>
          )}
          {screen === "result" && result && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultScreen
                mode={mode}
                type={result.type}
                scores={result.scores}
                onRestart={handleRestart}
                onHome={() => { setClassicAnswers({}); setOfficeAnswers({}); setResult(null); clearProgress(); setScreen("select"); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
