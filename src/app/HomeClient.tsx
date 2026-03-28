"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Clock,
  Database,
  Cpu,
  Terminal,
  GitCompare,
  Unplug,
  FlaskConical,
  Zap,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { ReactNode } from "react";

const JumpingDog = ({ className }: { className?: string }) => (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1280.000000 885.000000"
    preserveAspectRatio="xMidYMid meet"
    className={className}
  >
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

// Gradient color palette per tool
const TOOL_GRADIENTS = [
  { bg: "from-cyan-500 to-blue-500",     icon: "text-cyan-500" },
  { bg: "from-purple-500 to-pink-500",   icon: "text-purple-500" },
  { bg: "from-emerald-500 to-teal-500",  icon: "text-emerald-500" },
  { bg: "from-orange-500 to-red-500",    icon: "text-orange-500" },
  { bg: "from-indigo-500 to-purple-500", icon: "text-indigo-500" },
  { bg: "from-blue-500 to-cyan-500",     icon: "text-blue-500" },
  { bg: "from-yellow-500 to-orange-500", icon: "text-yellow-500" },
  { bg: "from-pink-500 to-rose-500",     icon: "text-pink-500" },
  { bg: "from-violet-500 to-purple-500", icon: "text-violet-500" },
];

interface MiniCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  index: number;
}

function MiniCard({ title, description, href, icon, index }: MiniCardProps) {
  const { bg: gradient, icon: iconColor } = TOOL_GRADIENTS[index % TOOL_GRADIENTS.length];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative h-full"
    >
      {/* Glow border */}
      <div className={`absolute -inset-px bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500`} />

      {/* Shimmer overlay */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "home-shimmer 2s infinite",
          }}
        />
      </div>

      <Link
        href={href}
        className="relative flex flex-col h-full p-5 rounded-xl border border-border bg-card/90 backdrop-blur-xl overflow-hidden transition-colors duration-300 group-hover:border-border/80"
      >
        {/* Corner accent */}
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full`} />

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{ animation: "home-scan 3s linear infinite" }}
          />
        </div>

        {/* Header row */}
        <div className="flex items-start justify-between mb-3 relative z-10">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-lg opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300`} />
            <div className="relative p-2.5 rounded-lg bg-muted group-hover:scale-110 transition-transform duration-300">
              <div className={iconColor}>
                {icon}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5 relative z-10 flex-1">
          <h3 className="font-bold text-sm tracking-tight text-foreground leading-tight font-mono">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between relative z-10">
          <span className="text-xs font-mono text-muted-foreground/50">
            {`#${(index + 1).toString().padStart(2, "0")}`}
          </span>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <span>启动</span>
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomeClient() {
  const { t } = useTranslation();

  const tools = [
    { href: "/json-lab",     title: t("home.jsonLab.title"),     desc: t("home.jsonLab.desc"),     icon: <Database className="w-4 h-4" /> },
    { href: "/diff",         title: t("home.diff.title"),        desc: t("home.diff.desc"),        icon: <GitCompare className="w-4 h-4" /> },
    { href: "/sql-stitcher", title: t("home.sqlStitcher.title"), desc: t("home.sqlStitcher.desc"), icon: <Unplug className="w-4 h-4" /> },
    { href: "/mojibake",     title: t("home.mojibake.title"),    desc: t("home.mojibake.desc"),    icon: <FlaskConical className="w-4 h-4" /> },
    { href: "/cron",         title: t("home.cron.title"),        desc: t("home.cron.desc"),        icon: <Clock className="w-4 h-4" /> },
    { href: "/curl-builder", title: t("home.curl.title"),        desc: t("home.curl.desc"),        icon: <Terminal className="w-4 h-4" /> },
    { href: "/log-config",   title: t("home.logback.title"),     desc: t("home.logback.desc"),     icon: <FileText className="w-4 h-4" /> },
    { href: "/maven-tree",   title: t("home.maven.title"),       desc: t("home.maven.desc"),       icon: <Search className="w-4 h-4" /> },
    { href: "/jvm-tuning",   title: t("home.jvm.title"),         desc: t("home.jvm.desc"),         icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <div className="relative flex flex-col" style={{ height: "calc(100dvh - 56px - 64px)" }}>
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.8) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            animation: "home-grid 20s linear infinite",
          }}
        />
        {/* Gradient orbs */}
        <div
          className="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse bg-blue-500/10 dark:bg-blue-500/20"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse bg-purple-500/10 dark:bg-purple-500/20"
          style={{ animationDuration: "6s" }}
        />
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 shrink-0 px-6 pt-6 pb-4 text-center"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
          <Zap className="w-3.5 h-3.5 text-cyan-500" />
          <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">简洁 · 高效 · 实用</span>
        </div>

        {/* Title row with dog */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, -3, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary shrink-0"
          >
            <JumpingDog className="w-9 h-9" />
          </motion.div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground leading-tight">
            {t("home.title")}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground font-mono">
          {t("home.subtitle")}
        </p>
      </motion.div>

      {/* Tool grid */}
      <div className="relative z-10 flex-1 flex items-center px-5 pb-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-5xl mx-auto"
        >
          {tools.map((tool, i) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <MiniCard
                href={tool.href}
                title={tool.title}
                description={tool.desc}
                icon={tool.icon}
                index={i}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes home-grid {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes home-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes home-scan {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
