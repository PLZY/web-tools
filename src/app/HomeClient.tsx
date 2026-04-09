"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, FileText, Clock, Database, Cpu, Terminal,
  GitCompare, Unplug, FlaskConical, Zap, Wrench, Sparkles,
  Calculator, ArrowRight, X, Scale, Lightbulb, Heart, Code2, Brain, Monitor, Keyboard,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { ReactNode, useState } from "react";

// ─── Jumping Dog ──────────────────────────────────────────────────────────────
const JumpingDog = ({ className }: { className?: string }) => (
  <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1280.000000 885.000000" preserveAspectRatio="xMidYMid meet"
    className={className}>
    <g transform="translate(1280.000000,885.000000) scale(-0.100000,-0.100000)" fill="currentColor" stroke="none">
      <path d="M2180 8840 c-47 -5 -110 -16 -140 -24 -30 -8 -95 -22 -145 -31 -123
      -23 -252 -67 -365 -126 -100 -52 -403 -263 -433 -302 -9 -12 -27 -53 -39 -92
      -27 -91 -93 -193 -182 -281 -60 -59 -92 -81 -201 -136 -71 -36 -162 -77 -202
      -92 -39 -15 -77 -33 -83 -41 -6 -8 -35 -21 -63 -31 -29 -9 -86 -34 -127 -55
      -41 -21 -96 -47 -122 -58 -62 -26 -82 -64 -75 -140 5 -57 99 -328 130 -375 19
      -28 50 -39 182 -63 130 -23 433 -23 589 1 151 23 163 15 89 -54 -28 -26 -71
      -57 -95 -69 -52 -26 -166 -121 -208 -176 -17 -22 -60 -67 -96 -100 -40 -39
      -64 -69 -64 -82 0 -20 6 -22 58 -25 l57 -3 6 -41 c18 -138 248 -246 425 -201
      33 9 156 63 274 121 299 148 435 189 495 150 32 -21 105 -11 130 16 25 27 30
      26 87 -20 55 -43 63 -45 183 -31 l70 8 45 -39 c25 -21 75 -63 112 -94 38 -30
      75 -69 84 -87 9 -18 33 -56 52 -86 59 -89 88 -292 58 -397 -8 -27 -29 -116
      -46 -198 -66 -320 -53 -403 97 -627 39 -57 78 -120 88 -139 10 -19 63 -102
      117 -184 113 -170 178 -292 178 -334 0 -16 -16 -63 -36 -103 -30 -60 -57 -94
      -143 -179 -59 -58 -125 -117 -147 -131 -256 -168 -303 -197 -547 -339 -97 -56
      -223 -218 -259 -333 -23 -74 -26 -368 -4 -429 16 -44 113 -181 179 -252 26
      -28 47 -54 47 -59 0 -4 13 -25 29 -45 28 -35 122 -214 135 -258 10 -33 250
      -239 326 -279 25 -13 60 -35 79 -49 19 -14 44 -26 55 -26 12 0 50 -14 86 -31
      75 -35 169 -49 351 -49 151 0 173 8 193 68 34 99 32 140 -12 253 -22 57 -47
      128 -57 157 -18 56 -30 66 -96 77 -21 3 -43 13 -50 22 -22 26 -110 63 -150 63
      -31 0 -38 4 -43 24 -8 31 -99 131 -147 162 -25 15 -41 35 -49 61 -17 53 -77
      132 -105 139 -40 10 -57 37 -53 85 3 42 6 45 53 69 28 14 75 44 105 67 65 49
      155 93 191 93 15 0 47 9 71 20 25 11 109 40 189 64 79 25 216 73 304 106 215
      83 324 120 351 120 12 0 32 8 45 18 13 10 60 37 104 61 44 23 87 51 97 61 9
      11 24 20 32 20 42 0 28 -55 -70 -276 -30 -67 -54 -126 -54 -131 0 -5 -13 -30
      -30 -56 -16 -26 -30 -53 -30 -59 0 -6 -24 -64 -54 -128 -83 -179 -99 -240 -94
      -368 4 -140 10 -151 182 -357 27 -32 52 -48 122 -74 139 -53 165 -59 326 -76
      83 -9 159 -20 168 -25 9 -5 68 -16 131 -24 63 -8 173 -27 244 -41 72 -14 182
      -30 245 -36 63 -6 154 -19 202 -30 48 -10 96 -19 107 -19 10 0 21 -6 23 -12 4
      -10 55 -14 195 -17 l190 -3 23 53 c47 105 37 261 -22 380 -37 74 -115 159
      -146 159 -12 0 -43 9 -70 19 -26 11 -69 22 -95 26 -25 4 -52 13 -58 21 -16 19
      -64 18 -84 -3 -16 -16 -18 -16 -27 0 -12 22 -44 22 -57 0 -9 -16 -11 -17 -28
      -1 -80 73 -253 77 -340 8 -34 -26 -102 -26 -151 0 -20 11 -63 30 -95 41 -32
      12 -61 27 -64 34 -5 15 -6 14 192 350 78 132 156 267 175 300 18 33 49 79 68
      103 62 78 54 76 362 83 221 6 282 10 312 23 86 37 610 126 833 141 55 4 106
      12 113 17 7 6 61 14 122 18 108 7 324 54 490 105 97 30 99 31 297 60 92 14
      198 25 236 25 l67 0 0 -48 c0 -66 32 -183 90 -329 62 -155 89 -208 157 -307
      30 -43 67 -104 83 -135 33 -66 87 -137 188 -250 39 -45 72 -85 72 -90 0 -5 10
      -11 23 -15 34 -9 113 -82 152 -141 20 -29 55 -70 78 -90 23 -20 47 -41 52 -47
      78 -83 171 -166 215 -191 33 -19 114 -90 201 -177 l146 -145 42 -105 c84 -210
      101 -314 61 -375 -11 -16 -20 -43 -20 -58 0 -15 -8 -40 -18 -55 -11 -15 -36
      -54 -57 -87 -53 -83 -164 -211 -287 -331 -190 -185 -174 -178 -406 -193 -106
      -8 -160 -16 -175 -26 -12 -8 -30 -15 -40 -15 -29 0 -91 -36 -157 -91 -82 -68
      -120 -122 -120 -170 0 -21 -6 -43 -12 -48 -61 -48 -98 -86 -109 -112 -12 -30
      -11 -32 27 -66 21 -19 59 -44 84 -56 43 -21 56 -22 340 -22 458 1 777 32 859
      83 68 42 86 73 84 142 -2 55 0 62 38 110 22 28 51 56 63 61 13 6 32 30 43 52
      11 23 96 123 189 222 93 99 180 196 193 215 14 19 51 63 82 97 32 34 74 91 93
      126 20 35 45 72 56 82 11 10 20 26 20 35 0 23 89 195 129 250 l33 45 -6 164
      -6 165 -73 77 c-67 71 -93 103 -187 226 -19 25 -56 70 -81 99 -58 67 -104 161
      -118 238 -6 33 -21 73 -35 91 -13 17 -37 60 -53 96 -27 62 -28 70 -27 219 0
      210 39 399 90 441 8 6 18 28 24 48 5 20 32 70 60 111 27 41 50 80 50 86 0 6 9
      23 20 36 10 14 24 47 30 73 6 26 31 98 55 160 25 62 45 117 45 121 0 4 9 17
      19 28 37 41 170 316 183 379 16 83 16 534 0 697 -7 69 -22 151 -32 183 -11 31
      -20 79 -20 106 0 41 5 56 35 91 19 23 35 46 35 50 0 13 241 218 273 233 15 6
      27 15 27 19 0 8 151 136 231 196 31 24 98 92 149 152 80 96 293 298 505 480
      35 30 86 80 112 110 51 59 149 151 224 213 51 41 197 130 244 149 66 27 320
      160 358 188 81 59 124 155 75 164 -13 2 -50 9 -83 15 -33 6 -85 18 -115 26
      -77 21 -147 19 -237 -9 -43 -14 -124 -36 -180 -50 -104 -25 -256 -84 -305
      -118 -15 -10 -60 -34 -100 -52 -40 -18 -96 -51 -124 -72 -65 -49 -249 -248
      -269 -291 -8 -17 -24 -34 -34 -38 -10 -3 -50 -33 -87 -66 -81 -72 -172 -138
      -232 -169 -27 -14 -60 -46 -93 -90 -28 -38 -63 -73 -79 -80 -16 -6 -59 -39
      -97 -71 -37 -33 -99 -75 -138 -94 -128 -62 -415 -145 -502 -145 -115 0 -306
      54 -583 165 -423 170 -748 256 -1175 312 -121 16 -215 18 -695 18 -398 0 -607
      -4 -740 -15 -233 -18 -457 -19 -530 -1 -30 8 -101 34 -159 58 -110 46 -236 83
      -283 83 -37 0 -208 55 -283 91 -33 16 -85 45 -115 65 -70 44 -124 60 -274 79
      -160 21 -228 39 -303 81 -42 23 -99 43 -174 59 -131 29 -196 57 -288 122 -92
      66 -237 215 -290 298 -63 98 -111 154 -308 358 -95 99 -173 182 -173 187 0 8
      58 48 110 75 19 10 68 21 107 25 40 4 80 13 89 21 20 16 14 94 -14 196 -12 40
      -25 111 -30 158 -5 47 -17 96 -26 110 -20 30 -119 61 -230 71 -72 6 -82 10
      -122 45 -25 21 -60 41 -80 45 -57 11 -223 -2 -297 -22 l-68 -19 -127 33 c-147
      38 -200 40 -277 11 l-55 -20 -57 22 c-50 19 -81 22 -223 25 -91 1 -203 -1
      -250 -6z m3280 -2857 c-1 -5 -7 -19 -15 -33 l-14 -25 -1 26 c0 14 3 29 7 32 9
      9 23 9 23 0z"/>
    </g>
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface ToolItem {
  href: string;
  title: string;
  desc: string;
  icon: ReactNode;

  gradient: string;
  iconColor: string;
}

// ─── Mini Tool Card (inside popup) ───────────────────────────────────────────
function ToolCard({ href, title, desc, icon, gradient, iconColor }: ToolItem) {
  const { t } = useTranslation();
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative h-full"
    >
      <div className={`absolute -inset-px bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300`} />
      <Link href={href} className="relative flex flex-col h-full p-4 rounded-xl border border-border bg-card/95 overflow-hidden transition-colors duration-300">
        <div className={`absolute top-0 right-0 w-14 h-14 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full`} />
        <div className="flex items-start justify-between mb-2.5">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-lg opacity-20 blur-md group-hover:opacity-40 transition-opacity`} />
            <div className="relative p-2 rounded-lg bg-muted group-hover:scale-110 transition-transform duration-300">
              <div className={iconColor}>{icon}</div>
            </div>
          </div>

        </div>
        <div className="space-y-1 flex-1">
          <h3 className="font-bold text-sm tracking-tight text-foreground font-mono">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{desc}</p>
        </div>
        <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-end">
          <div className="flex items-center gap-1 text-xs font-mono text-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <span>{t("home.launch")}</span><ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Mini Tool Row (preview list inside the big card) ────────────────────────
function MiniToolRow({ href, title, icon, iconColor }: Pick<ToolItem, 'href' | 'title' | 'icon' | 'iconColor'>) {
  return (
    <Link href={href} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-all cursor-pointer">
      <div className={`p-2 rounded-lg bg-muted group-hover:scale-110 transition-transform shrink-0 ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold font-mono text-foreground truncate">{title}</div>

      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-cyan-400 transition-colors shrink-0" />
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomeClient() {
  const { t, lang } = useTranslation();

  // Daily Geek Quotes — changes every day
  const geekQuotes = [
    { zh: "代码永远不会按预期工作，除非它在生产环境崩溃。", en: "Code never works as expected — unless it's crashing in production.", author: "Murphy's Law of Dev" },
    { zh: "先让代码跑起来，再让它跑得优雅，最后求它别崩。", en: "Make it work, make it pretty, then pray it survives production.", author: "Every Dev's Prayer" },
    { zh: "我不是在调试，我是在和宇宙进行深度对话。", en: "I'm not debugging. I'm having a philosophical dialogue with the universe.", author: "Debug Zen" },
    { zh: "那个 bug 不是我写的，是上一个离职同事留下的。", en: "That bug isn't mine. It was a parting gift from my former colleague.", author: "The First Law of Blame" },
    { zh: "周五下午五点部署：勇气可嘉，后果自负。", en: "Deploying on Friday at 5pm: bold, brave, and profoundly unwise.", author: "DevOps Proverb" },
    { zh: "这段代码我三年前写的，我也看不懂了，但它在跑。", en: "I wrote this three years ago. I have no idea what it does. It works.", author: "Legacy Code Meditation" },
    { zh: "99 个 bug，修一个，剩 127 个。", en: "99 bugs in the code. Fix one bug. 127 bugs remain.", author: "The Fibonacci Bug Theorem" },
    { zh: "最恐怖的注释：// 不知道为什么，但删掉这行就会崩。", en: "Scariest comment: // Not sure why, but removing this breaks everything.", author: "Haunted Codebase Chronicles" },
    { zh: "计算机科学只有两件难事：缓存失效和命名。", en: "There are only two hard problems in CS: cache invalidation and naming things.", author: "Phil Karlton" },
    { zh: "这不是 bug，这是隐藏功能。", en: "It's not a bug — it's an undocumented feature.", author: "Product Manager Approved" },
    { zh: "'我先写测试再写代码。'——每个程序员说过，没有程序员实践过。", en: "'I'll write tests first.' — said by every developer, honored by none.", author: "TDD in Theory" },
    { zh: "堆栈溢出不是报错，是程序在向你求救。", en: "A stack overflow isn't an error — it's your program screaming for help.", author: "Debugging Empathy" },
    { zh: "如果能运行，就不要动它。如果必须动，先备份再祈祷。", en: "If it ain't broken, don't fix it. If you must, back up and pray.", author: "Sacred Rule of Legacy Systems" },
    { zh: "工作是把需求变成代码，生活是把代码变成需求。", en: "Work turns requirements into code. Life turns code back into requirements.", author: "The Eternal Cycle" },
    { zh: "乐观者说杯子半满，悲观者说半空，程序员说数组越界了。", en: "Optimist: glass half full. Pessimist: half empty. Developer: index out of bounds.", author: "Programmer's Perspective" },
    { zh: "任何足够大的代码库都包含一个充满 bug 的 Excel 替代品。", en: "Any sufficiently large codebase contains an ad hoc, bug-ridden Excel replacement.", author: "Greenspun's Corollary" },
    { zh: "程序员的乐观：'就改一行，五分钟搞定。'", en: "Programmer optimism: 'Just one line change. Done in five minutes.'", author: "Estimation Hall of Fame" },
    { zh: "文档是写给未来的开发者的，而那个人就是六个月后的你自己。", en: "Docs are written for a future developer — who turns out to be past-you in 6 months.", author: "Temporal Developer Theory" },
  ];

  const todayIndex = Math.floor(Date.now() / 86400000) % geekQuotes.length;
  const todayQuote = geekQuotes[todayIndex];
  const [openModal, setOpenModal] = useState<"productivity" | "toy" | null>(null);

  const productivityTools: ToolItem[] = [
    { href: "/json-lab",     title: t("home.jsonLab.title"),     desc: t("home.jsonLab.desc"),     icon: <Database className="w-4 h-4" />,    gradient: "from-cyan-500 to-blue-500",     iconColor: "text-cyan-500"    },
    { href: "/diff",         title: t("home.diff.title"),        desc: t("home.diff.desc"),        icon: <GitCompare className="w-4 h-4" />,   gradient: "from-purple-500 to-pink-500",   iconColor: "text-purple-500"  },
    { href: "/sql-stitcher", title: t("home.sqlStitcher.title"), desc: t("home.sqlStitcher.desc"), icon: <Unplug className="w-4 h-4" />,       gradient: "from-emerald-500 to-teal-500",  iconColor: "text-emerald-500" },
    { href: "/mojibake",     title: t("home.mojibake.title"),    desc: t("home.mojibake.desc"),    icon: <FlaskConical className="w-4 h-4" />, gradient: "from-orange-500 to-red-500",    iconColor: "text-orange-500"  },
    { href: "/maven-tree",   title: t("home.maven.title"),       desc: t("home.maven.desc"),       icon: <Search className="w-4 h-4" />,       gradient: "from-pink-500 to-rose-500",     iconColor: "text-pink-500"    },
    { href: "/curl-builder", title: t("home.curl.title"),        desc: t("home.curl.desc"),        icon: <Terminal className="w-4 h-4" />,     gradient: "from-blue-500 to-cyan-500",     iconColor: "text-blue-500"    },
    { href: "/ide-shortcuts", title: t("home.ideShortcuts.title"), desc: t("home.ideShortcuts.desc"), icon: <Keyboard className="w-4 h-4" />,    gradient: "from-blue-500 to-indigo-500",   iconColor: "text-blue-500"    },
    { href: "/log-config",   title: t("home.logback.title"),     desc: t("home.logback.desc"),     icon: <FileText className="w-4 h-4" />,     gradient: "from-yellow-500 to-orange-500", iconColor: "text-yellow-500"  },
    { href: "/cron",         title: t("home.cron.title"),        desc: t("home.cron.desc"),        icon: <Clock className="w-4 h-4" />,        gradient: "from-indigo-500 to-purple-500", iconColor: "text-indigo-500"  },
    { href: "/jvm-tuning",   title: t("home.jvm.title"),         desc: t("home.jvm.desc"),         icon: <Cpu className="w-4 h-4" />,          gradient: "from-violet-500 to-purple-500", iconColor: "text-violet-500"  },
  ];

  const toyTools: ToolItem[] = [
    { href: "/hourly-wage", title: t("home.hourlyWage.title"), desc: t("home.hourlyWage.desc"), icon: <Calculator className="w-4 h-4" />, gradient: "from-rose-500 to-orange-500", iconColor: "text-rose-500" },
    { href: "/mbti", title: t("home.mbti.title"), desc: t("home.mbti.desc"), icon: <Brain className="w-4 h-4" />, gradient: "from-violet-500 to-pink-500", iconColor: "text-violet-500" },
    { href: "/fake-update", title: t("home.fakeUpdate.title"), desc: t("home.fakeUpdate.desc"), icon: <Monitor className="w-4 h-4" />, gradient: "from-blue-500 to-cyan-400", iconColor: "text-blue-500" },
  ];

  const activeTools = openModal === "productivity" ? productivityTools : toyTools;
  const activeTitle = openModal === "productivity" ? t("home.work.title") : t("home.life.title");
  const activeSubtitle = openModal === "productivity" ? t("home.work.popupSubtitle") : t("home.life.popupSubtitle");
  const activeGradient = openModal === "productivity" ? "from-cyan-500 to-blue-500" : "from-rose-500 to-orange-500";

  return (
    <div className="relative flex flex-col" style={{ minHeight: "calc(100dvh - 56px - 64px)" }}>
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]" style={{
          backgroundImage: "linear-gradient(rgba(148,163,184,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.8) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          animation: "home-grid 20s linear infinite",
        }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse bg-blue-500/8 dark:bg-blue-500/15" style={{ animationDuration: "5s" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse bg-purple-500/8 dark:bg-purple-500/15" style={{ animationDuration: "7s" }} />
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 shrink-0 px-6 pt-5 pb-3 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
          <Zap className="w-3.5 h-3.5 text-cyan-500" />
          <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">{t("home.tagline")}</span>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, -4, 4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary shrink-0"
          >
            <JumpingDog className="w-12 h-12" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
            {t("home.title.main")}
            <span className="relative inline-block ml-2">
              <span className="relative z-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {t("home.title.box")}
              </span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-sm" />
            </span>
          </h1>
        </div>

        {/* Work / Life row */}
        <div className="flex items-center justify-center gap-5 mb-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <Wrench className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-sm font-mono text-cyan-600 dark:text-cyan-400">{t("home.workLabel")}</span>
          </div>

          <div className="relative flex items-center justify-center">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-rose-500 rounded-full blur-lg opacity-60" />
              <div className="relative w-8 h-8 bg-gradient-to-r from-cyan-500 to-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⚖</span>
              </div>
            </motion.div>
            {/* Decorative pulse dots */}
            <div className="absolute -left-7 flex flex-col gap-1">
              {[0, 0.3, 0.6].map((d) => (
                <motion.div key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: d }}
                  className="w-1 h-1 rounded-full bg-cyan-400" />
              ))}
            </div>
            <div className="absolute -right-7 flex flex-col gap-1">
              {[0, 0.3, 0.6].map((d) => (
                <motion.div key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: d + 0.15 }}
                  className="w-1 h-1 rounded-full bg-rose-400" />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
            <span className="text-sm font-mono text-rose-600 dark:text-rose-400">{t("home.lifeLabel")}</span>
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          </div>
        </div>

        <p className="text-sm text-muted-foreground font-mono">
          {">"} {t("home.mottoWork")} <span className="animate-pulse">_</span>
        </p>
      </motion.div>

      {/* ── Two Main Modules ── */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0 px-4 sm:px-6 lg:px-8 pb-2">
        <div className="relative flex-1 flex flex-col min-h-0 max-w-6xl mx-auto w-full">

          {/* Two-column grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 min-h-[320px]">

            {/* Work card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="relative flex flex-col"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl blur-2xl" />
              <div className="relative flex-1 bg-card/80 dark:bg-card/60 backdrop-blur-2xl rounded-2xl border border-cyan-500/20 overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

                {/* Header */}
                <div className="p-6 border-b border-border/50 shrink-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur" />
                      <div className="relative p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                        <Wrench className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold font-mono text-foreground">{t("home.work.title")}</h2>
                      <p className="text-sm font-mono text-cyan-600 dark:text-cyan-400">{t("home.work.subtitle")}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500 text-white">
                      {productivityTools.length}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t("home.work.cardDesc")}</p>
                </div>

                {/* Scrollable tool list */}
                <div className="flex-1 overflow-y-auto home-scrollbar p-4 space-y-1">
                  {productivityTools.slice(0, 5).map(tool => (
                    <MiniToolRow key={tool.href} {...tool} />
                  ))}
                </div>

                {/* Button */}
                <div className="p-4 pt-2 shrink-0">
                  <button
                    onClick={() => setOpenModal("productivity")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-mono font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all duration-200"
                  >
                    {t("home.viewAll")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Life card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="relative flex flex-col"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-rose-500/5 to-orange-500/5 rounded-3xl blur-2xl" />
              <div className="relative flex-1 bg-card/80 dark:bg-card/60 backdrop-blur-2xl rounded-2xl border border-rose-500/20 overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

                {/* Header */}
                <div className="p-6 border-b border-border/50 shrink-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 rounded-lg blur" />
                      <div className="relative p-2 bg-gradient-to-r from-rose-500 to-orange-500 rounded-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold font-mono text-foreground">{t("home.life.title")}</h2>
                      <p className="text-sm font-mono text-rose-600 dark:text-rose-400">{t("home.life.subtitle")}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-rose-500 text-white">
                      {toyTools.length}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t("home.life.cardDesc")}</p>
                </div>

                {/* Scrollable tool list */}
                <div className="flex-1 overflow-y-auto home-scrollbar p-4 space-y-1">
                  {toyTools.map(tool => (
                    <MiniToolRow key={tool.href} {...tool} />
                  ))}
                </div>

                {/* Button */}
                <div className="p-4 pt-2 shrink-0">
                  <button
                    onClick={() => setOpenModal("toy")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-mono font-semibold bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white transition-all duration-200"
                  >
                    {t("home.viewAll")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center Divider — absolute, large screens only */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-32 pointer-events-none">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-16 bottom-16 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
            {/* Center icon */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-rose-500 rounded-full blur-xl opacity-50 animate-pulse" />
                  <div className="relative w-14 h-14 bg-background border-2 border-border/60 rounded-full flex items-center justify-center shadow-xl">
                    <Scale className="w-7 h-7 text-primary/60" />
                  </div>
                </div>
              </motion.div>
            </div>
            {/* Dots top */}
            <div className="absolute left-1/2 top-8 -translate-x-1/2 flex flex-col gap-1.5 items-center">
              {[0.6, 0.3, 0].map((op, i) => (
                <div key={i} className="rounded-full bg-cyan-400" style={{ width: `${6 - i * 2}px`, height: `${6 - i * 2}px`, opacity: op }} />
              ))}
            </div>
            {/* Dots bottom */}
            <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex flex-col gap-1.5 items-center">
              {[0, 0.3, 0.6].map((op, i) => (
                <div key={i} className="rounded-full bg-rose-400" style={{ width: `${2 + i * 2}px`, height: `${2 + i * 2}px`, opacity: op }} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Daily Geek Quote */}
      <div className="relative z-10 shrink-0 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative p-6 rounded-2xl border border-border/60 bg-card/20 backdrop-blur-xl overflow-hidden">
            <div className="flex items-start gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-cyan-500 dark:text-cyan-400 shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="text-lg font-bold font-mono text-foreground mb-2">
                  {t("home.geekQuote.title")}
                </h4>
                <blockquote className="text-base text-muted-foreground leading-relaxed mb-2">
                  &ldquo;{lang === "zh" ? todayQuote.zh : todayQuote.en}&rdquo;
                </blockquote>
                <p className="text-sm font-mono text-muted-foreground/60">
                  — {todayQuote.author}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About DogUp — SEO intro */}
      <div className="relative z-10 shrink-0 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl border border-border/60 bg-card/20 backdrop-blur-xl">
            <h2 className="text-lg font-bold font-mono text-foreground mb-3">
              {t("home.seo.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("home.seo.text")}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom quote */}
      <div className="relative z-10 shrink-0 mt-6 pb-8 text-center">
        <p className="text-sm font-mono text-muted-foreground/40 italic">{t("home.quote")}</p>
      </div>

      {/* ── Modal — fixed full-screen overlay ── */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpenModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
              className="relative max-w-5xl w-full max-h-[85vh] bg-card rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient top stripe */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${activeGradient}`} />

              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${activeGradient}`} />
                  <div>
                    <h2 className="text-lg font-bold font-mono text-foreground">{activeTitle}</h2>
                    <p className="text-xs text-muted-foreground font-mono">{activeSubtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-muted border border-border text-muted-foreground">
                    {activeTools.length}{openModal === "productivity" ? t("home.toolUnit") : t("home.toyUnit")}
                  </span>
                  <button
                    onClick={() => setOpenModal(null)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tool grid */}
              <div className="flex-1 p-5 overflow-y-auto home-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
                  {activeTools.map((tool) => (
                    <ToolCard key={tool.href} {...tool} />
                  ))}
                </div>
                {openModal === "toy" && (
                  <div className="mt-4 p-4 rounded-xl border border-dashed border-border/50 text-center">
                    <p className="text-xs font-mono text-muted-foreground/50">{t("home.comingSoon")}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes home-grid {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        .home-scrollbar::-webkit-scrollbar { width: 5px; }
        .home-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .home-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 10px; }
        .home-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.5); }
      `}</style>
    </div>
  );
}
