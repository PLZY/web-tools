"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Monitor } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

// ─── Types ────────────────────────────────────────────────────────────────────
type Mode = "windows" | "macos";
type Phase = "stuck14" | "crawling" | "done";

// ─── Progress Config ───────────────────────────────────────────────────────────
const STUCK_14_MS = 10 * 60 * 1000;   // 10 min stuck at 14%
const STUCK_99_MS = 30 * 60 * 1000;   // 30 min stuck at 99% (just caps it)
const CRAWL_MIN_MS = 2_000;
const CRAWL_MAX_MS = 8_000;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Shared CSS ────────────────────────────────────────────────────────────────
// Windows orbit animation is a 1:1 copy of fakeupdate.net/win10ue/ keyframes.
const SHARED_CSS = `
  /* ── Windows loader (fakeupdate.net exact) ── */
  .fu-win-loader {
    position: relative; width: 50px; height: 48px; margin: 0 auto;
  }
  .fu-win-loader .c {
    position: absolute; width: 48px; height: 48px;
    opacity: 0; transform: rotate(225deg);
    animation-iteration-count: infinite;
    animation-name: fu-orbit; animation-duration: 5.5s;
  }
  .fu-win-loader .c::after {
    content: ''; position: absolute;
    width: 6px; height: 6px; border-radius: 5px; background: #fff;
  }
  .fu-win-loader .c:nth-child(2) { animation-delay: 240ms; }
  .fu-win-loader .c:nth-child(3) { animation-delay: 480ms; }
  .fu-win-loader .c:nth-child(4) { animation-delay: 720ms; }
  .fu-win-loader .c:nth-child(5) { animation-delay: 960ms; }
  @keyframes fu-orbit {
    0%   { transform: rotate(225deg); opacity: 1; animation-timing-function: ease-out; }
    7%   { transform: rotate(345deg); animation-timing-function: linear; }
    30%  { transform: rotate(455deg); animation-timing-function: ease-in-out; }
    39%  { transform: rotate(690deg); animation-timing-function: linear; }
    70%  { transform: rotate(815deg); opacity: 1; animation-timing-function: ease-out; }
    75%  { transform: rotate(945deg); animation-timing-function: ease-out; }
    76%  { transform: rotate(945deg); opacity: 0; }
    100% { transform: rotate(945deg); opacity: 0; }
  }

`;

// ─── Windows Update Screen ─────────────────────────────────────────────────────
function WindowsScreen({ progress }: { progress: number }) {
  const { t } = useTranslation();

  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] select-none"
      style={{ background: "#006dae", cursor: "none", margin: 0, padding: 0 }}
    >
      <style>{SHARED_CSS}</style>

      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", marginTop: "-5%",
        width: 500, textAlign: "center",
        fontFamily: "'Segoe UI Light', 'Segoe UI', Arial, sans-serif",
        fontWeight: "normal", color: "#fff",
      }}>
        <div style={{ paddingTop: 2 }}>
          <div className="fu-win-loader">
            <div className="c" /><div className="c" /><div className="c" />
            <div className="c" /><div className="c" />
          </div>
        </div>
        <br /><br />
        <div style={{ fontSize: 24, lineHeight: 1.6 }}>
          {t("fakeUpdate.win.line1")}
        </div>
        <div style={{ fontSize: 24, lineHeight: 1.6 }}>
          {t("fakeUpdate.win.line2").replace("{pct}", String(progress))}
        </div>
        <div style={{ fontSize: 24, lineHeight: 1.6, marginTop: 4 }}>
          {t("fakeUpdate.win.line3")}
        </div>
      </div>

      <div style={{
        position: "fixed", bottom: "10%", width: "100%", left: 0,
        textAlign: "center",
        fontFamily: "'Segoe UI Light', 'Segoe UI', Arial, sans-serif",
        fontSize: 23, fontWeight: "normal", color: "#fff",
      }}>
        {t("fakeUpdate.win.bottom")}
      </div>
    </div>
  );
}

// ─── macOS Update Screen ───────────────────────────────────────────────────────
function MacOSScreen({ progress }: { progress: number }) {
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] select-none"
      style={{ background: "#000", cursor: "none", margin: 0, padding: 0 }}
    >
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", marginTop: "-5%",
        width: 550, textAlign: "center",
      }}>
        {/* Apple Logo — Simple Icons canonical 256×315 path */}
        <div style={{ marginBottom: 40 }}>
          <svg
            viewBox="0 0 256 315"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: 80, height: 98, display: "inline-block" }}
          >
            <path d="M213.803 167.03c.442 47.58 41.74 63.413 42.197 63.615-.35 1.116-6.599 22.563-21.757 44.716-13.104 19.153-26.705 38.235-48.13 38.63-21.05.388-27.82-12.483-51.888-12.483-24.061 0-31.582 12.088-51.51 12.871-20.68.783-36.428-20.71-49.64-39.793-27-39.033-47.633-110.3-19.928-158.408 13.763-23.89 38.36-39.017 65.056-39.405 20.307-.388 39.475 13.662 51.889 13.662 12.406 0 35.699-16.895 60.186-14.414 10.25.427 39.026 4.14 57.503 31.186-1.49.923-34.335 20.044-33.978 59.822M174.24 50.199c10.98-13.29 18.369-31.79 16.353-50.199-15.826.636-34.962 10.546-46.314 23.828-10.173 11.763-19.082 30.589-16.678 48.633 17.64 1.365 35.66-8.964 46.639-22.262"/>
          </svg>
        </div>

        <div style={{
          width: 260, height: 5,
          borderRadius: 3,
          background: "#3a3a3a",
          margin: "0 auto",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            borderRadius: 3,
            background: "#fff",
            width: `${progress}%`,
            transition: "width 0.7s ease",
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FakeUpdate() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("windows");
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(14);
  const [phase, setPhase] = useState<Phase>("stuck14");
  const phaseRef = useRef<Phase>("stuck14");
  const progressRef = useRef(14);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Progress engine
  useEffect(() => {
    if (!active) return;

    // Reset state on activation
    setProgress(0);
    setPhase("stuck14");
    phaseRef.current = "stuck14";
    progressRef.current = 0;

    // Phase 0: quick ramp 0 → 14% (each step +1%, every 200-500ms)
    const rampTo14 = () => {
      const cur = progressRef.current;
      if (cur >= 14) {
        // Phase 1: stuck at 14% for 10 min, then crawl
        timerRef.current = setTimeout(() => {
      phaseRef.current = "crawling";
      setPhase("crawling");

      const crawl = () => {
        if (phaseRef.current !== "crawling") return;
        const cur = progressRef.current;
        if (cur >= 99) {
          phaseRef.current = "done";
          setPhase("done");
          return;
        }
        const inc = randInt(1, 3);
        const next = Math.min(99, cur + inc);
        progressRef.current = next;
        setProgress(next);
        const delay = randInt(CRAWL_MIN_MS, CRAWL_MAX_MS);
        timerRef.current = setTimeout(crawl, delay);
      };
      crawl();
        }, STUCK_14_MS);
        return;
      }
      const next = cur + 1;
      progressRef.current = next;
      setProgress(next);
      timerRef.current = setTimeout(rampTo14, randInt(200, 500));
    };
    rampTo14();

    return () => stopTimers();
  }, [active, stopTimers]);

  // Keep a stable ref to handleExit so the keydown listener never goes stale
  const handleExit = useCallback(() => {
    stopTimers();
    setActive(false);
    setProgress(0);
    setPhase("stuck14");
    phaseRef.current = "stuck14";
    progressRef.current = 0;
  }, [stopTimers]);

  const handleExitRef = useRef(handleExit);
  useEffect(() => { handleExitRef.current = handleExit; }, [handleExit]);

  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);

  // Double-ESC listener — two presses within 800ms to exit
  const lastEscRef = useRef(0);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeRef.current) {
        const now = Date.now();
        if (now - lastEscRef.current < 800) {
          handleExitRef.current();
          lastEscRef.current = 0;
        } else {
          lastEscRef.current = now;
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleStart = () => setActive(true);

  if (active) {
    return (
      <div>
        {mode === "windows"
          ? <WindowsScreen progress={progress} />
          : <MacOSScreen progress={progress} />
        }
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-4">
        {/* Windows Option */}
        <button
          onClick={() => setMode("windows")}
          className={`group relative rounded-xl border-2 p-6 text-left transition-all duration-200 ${
            mode === "windows"
              ? "border-blue-500 bg-blue-500/10"
              : "border-border bg-card hover:border-blue-400/50 hover:bg-blue-500/5"
          }`}
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
            style={{ background: "#006dae" }}
          >
            <svg viewBox="0 0 88 88" fill="white" className="w-7 h-7">
              <path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.028 34.453L.028 75.48.026 45.7zm4.326-39.025L87.314 0v41.527l-47.318.376zm47.329 39.349l-.011 41.34-47.318-6.678-.066-34.739z"/>
            </svg>
          </div>
          <div className="font-bold text-sm tracking-tight">{t("fakeUpdate.mode.windows")}</div>
          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {t("fakeUpdate.mode.windows.desc")}
          </div>
          {mode === "windows" && (
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500" />
          )}
        </button>

        {/* macOS Option */}
        <button
          onClick={() => setMode("macos")}
          className={`group relative rounded-xl border-2 p-6 text-left transition-all duration-200 ${
            mode === "macos"
              ? "border-zinc-400 bg-zinc-500/10"
              : "border-border bg-card hover:border-zinc-400/50 hover:bg-zinc-500/5"
          }`}
        >
          <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center mb-4">
            <svg viewBox="0 0 814 1000" fill="white" className="w-7 h-7">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 680.6-.5 571.3-.5 467.2c0-173.1 113.3-265 224.5-265 59.3 0 108.7 39.5 146.1 39.5 35.7 0 91.9-41.7 160.5-41.7 25.8 0 108.2 2.6 168.9 80.9zm-225.2-192c30.7-36.3 52.4-86.9 52.4-137.5 0-7.1-.6-14.3-1.9-20.1-49.4 1.9-108.2 33.1-143.9 74.6-27.5 31.4-52.4 81.9-52.4 133.1 0 7.7 1.3 15.5 1.9 17.9 3.2.6 8.4 1.3 13.6 1.3 44.4 0 99.5-29.5 130.3-69.3z"/>
            </svg>
          </div>
          <div className="font-bold text-sm tracking-tight">{t("fakeUpdate.mode.macos")}</div>
          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {t("fakeUpdate.mode.macos.desc")}
          </div>
          {mode === "macos" && (
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-zinc-400" />
          )}
        </button>
      </div>

      {/* Timeline Preview */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("fakeUpdate.timeline.title")}</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <span className="text-muted-foreground">{t("fakeUpdate.timeline.ramp").replace("{pct}", "14")}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            </div>
            <span className="text-muted-foreground">{t("fakeUpdate.timeline.stuck").replace("{pct}", "14")}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>
            <span className="text-muted-foreground">{t("fakeUpdate.timeline.crawl")}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            </div>
            <span className="text-muted-foreground">{t("fakeUpdate.timeline.done").replace("{pct}", "99")}</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-4 py-3 border border-border/50">
        {t("fakeUpdate.exit.tip")}
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        style={{
          background: mode === "windows"
            ? "linear-gradient(135deg, #006dae, #0094d8)"
            : "linear-gradient(135deg, #1c1c1e, #3a3a3c)",
        }}
      >
        <Monitor className="inline w-4 h-4 mr-2 -mt-0.5" />
        {t("fakeUpdate.start")}
      </button>
    </div>
  );
}
