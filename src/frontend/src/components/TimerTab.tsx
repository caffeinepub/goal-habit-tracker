import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Coffee,
  Flame,
  Grid3X3,
  Palette,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { TimerMode } from "../App";
import SectionStylePanel, { useSectionStyle } from "./SectionStylePanel";

const POMODORO_DAYS_KEY = "ssc_pomodoro_days";
const FOCUS_LOG_KEY = "ssc_focus_log";
const FOCUS_TARGET_KEY = "ssc_daily_focus_target";

function getTodayDateStr(): string {
  return new Date().toISOString().split("T")[0];
}

function loadPomoDays(): string[] {
  try {
    const saved = localStorage.getItem(POMODORO_DAYS_KEY);
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
}

function savePomoDays(days: string[]) {
  localStorage.setItem(POMODORO_DAYS_KEY, JSON.stringify(days));
}

function loadFocusLog(): Record<string, number> {
  try {
    const saved = localStorage.getItem(FOCUS_LOG_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveFocusLog(log: Record<string, number>) {
  localStorage.setItem(FOCUS_LOG_KEY, JSON.stringify(log));
}

function loadFocusTarget(): number {
  try {
    const s = localStorage.getItem(FOCUS_TARGET_KEY);
    return s ? Number(s) : 900; // default 15 hours = 900 min
  } catch {
    return 900;
  }
}

function computeStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const sorted = [...new Set(days)].sort().reverse();
  const today = getTodayDateStr();
  let streak = 0;
  let cursor = new Date(today);
  for (let i = 0; i < 365; i++) {
    const key = cursor.toISOString().split("T")[0];
    if (sorted.includes(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function computeTargetStreak(
  log: Record<string, number>,
  targetMins: number,
): number {
  const today = getTodayDateStr();
  let streak = 0;
  let cursor = new Date(today);
  for (let i = 0; i < 365; i++) {
    const key = cursor.toISOString().split("T")[0];
    if ((log[key] ?? 0) >= targetMins) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function getLast14Days(): string[] {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split("T")[0];
  });
}

// ── Section time helpers ──────────────────────────────────────────────────

function getLast7DaysStr(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}

function readSectionTime(prefix: string, date: string): number {
  return Number(localStorage.getItem(`${prefix}${date}`) ?? 0);
}

function formatHMS(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const SECTION_PREFIXES = {
  "Study Plan": "ssc_section_time_studyplan_",
  Questions: "ssc_section_time_questions_",
  "Daily Routine": "ssc_section_time_dailyroutine_",
} as const;

const TIMER_PRESETS: Record<TimerMode, { label: string; color: string }> = {
  work: { label: "Focus", color: "text-primary" },
  short: { label: "Short Break", color: "text-green-400" },
  long: { label: "Long Break", color: "text-blue-400" },
};

const SESSION_TIPS = [
  "Take a glass of water before starting",
  "Put your phone on Do Not Disturb",
  "Clear your desk before focusing",
  "Identify your single most important task",
  "Review your notes after the session",
];

export interface TimerTabProps {
  mode: TimerMode;
  timeLeft: number;
  running: boolean;
  sessions: number;
  customDefaultSeconds: number;
  tipIndex: number;
  onModeChange: (mode: TimerMode) => void;
  onToggleRunning: () => void;
  onReset: () => void;
  onSetDefault: (seconds: number) => void;
  onFocusTimeUpdate?: (elapsedSeconds: number) => void;
}

export default function TimerTab({
  mode,
  timeLeft,
  running,
  sessions,
  customDefaultSeconds,
  tipIndex,
  onModeChange,
  onToggleRunning,
  onReset,
  onSetDefault,
  onFocusTimeUpdate,
}: TimerTabProps) {
  const [defaultInput, setDefaultInput] = useState(
    String(Math.round(customDefaultSeconds / 60)),
  );
  const [showStylePanel, setShowStylePanel] = useState(false);
  const styleBtnRef = useRef<HTMLButtonElement>(null);
  const { style: sectionStyle } = useSectionStyle("timer");

  // ── Streak tracking (session-based) ──────────────────────────────────────
  const prevSessionsRef = useRef(sessions);
  const [pomoDays, setPomoDays] = useState<string[]>(loadPomoDays);

  // ── Focus time log ────────────────────────────────────────────────────────
  const [focusLog, setFocusLog] =
    useState<Record<string, number>>(loadFocusLog);
  const [focusTarget, setFocusTarget] = useState(loadFocusTarget);
  const [focusTargetInput, setFocusTargetInput] = useState(
    String(Math.round(loadFocusTarget() / 60)),
  );
  const sessionStartRef = useRef<number | null>(null);
  const prevRunning = useRef(running);

  // Track session start/stop for partial focus time
  useEffect(() => {
    if (running && !prevRunning.current) {
      // Timer started
      sessionStartRef.current = Date.now();
    } else if (
      !running &&
      prevRunning.current &&
      sessionStartRef.current !== null
    ) {
      // Timer paused/stopped — save elapsed time
      const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      if (elapsed > 0 && mode === "work") {
        const elapsedMins = Math.floor(elapsed / 60);
        if (elapsedMins > 0) {
          const today = getTodayDateStr();
          setFocusLog((prev) => {
            const next = { ...prev, [today]: (prev[today] ?? 0) + elapsedMins };
            saveFocusLog(next);
            return next;
          });
        }
        onFocusTimeUpdate?.(elapsed);
      }
      sessionStartRef.current = null;
    }
    prevRunning.current = running;
  }, [running, mode, onFocusTimeUpdate]);

  useEffect(() => {
    if (sessions > prevSessionsRef.current) {
      // A new session was completed — also save focus time for the completed session
      const today = getTodayDateStr();
      if (mode === "work") {
        const sessionMins = Math.round(customDefaultSeconds / 60);
        setFocusLog((prev) => {
          const next = { ...prev, [today]: (prev[today] ?? 0) + sessionMins };
          saveFocusLog(next);
          return next;
        });
      }
      setPomoDays((prev) => {
        if (prev.includes(today)) return prev;
        const next = [...prev, today];
        savePomoDays(next);
        return next;
      });
    }
    prevSessionsRef.current = sessions;
  }, [sessions, mode, customDefaultSeconds]);

  const streak = computeStreak(pomoDays);
  const targetStreak = computeTargetStreak(focusLog, focusTarget);
  const last14Days = getLast14Days();

  const total =
    mode === "work" ? customDefaultSeconds : mode === "short" ? 300 : 900;
  const progress = ((total - timeLeft) / total) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleSetDefault = () => {
    const mins = Number.parseInt(defaultInput, 10);
    if (Number.isNaN(mins) || mins < 1 || mins > 120) {
      toast.error("Enter a valid duration (1–120 minutes)");
      return;
    }
    onSetDefault(mins * 60);
    toast.success(`Default set to ${mins} minute${mins !== 1 ? "s" : ""}`);
  };

  return (
    <div className="p-6 max-w-lg mx-auto" style={sectionStyle}>
      {/* Section Style Panel */}
      {showStylePanel && (
        <SectionStylePanel
          sectionId="timer"
          sectionLabel="Timer"
          onClose={() => setShowStylePanel(false)}
          anchorRef={styleBtnRef as React.RefObject<HTMLElement | null>}
        />
      )}
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Pomodoro Timer
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Stay focused with timed study sessions
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            ref={styleBtnRef}
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50"
            onClick={() => setShowStylePanel((p) => !p)}
            title="Customize section style"
            data-ocid="timer.style.button"
          >
            <Palette size={13} />
          </Button>
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30"
            >
              <Flame size={14} className="text-primary" />
              <span className="text-xs font-bold text-primary">
                {streak} day{streak !== 1 ? "s" : ""}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl bg-muted/50 border border-border">
        {(
          Object.entries(TIMER_PRESETS) as [
            TimerMode,
            (typeof TIMER_PRESETS)[TimerMode],
          ][]
        ).map(([key, preset]) => (
          <button
            type="button"
            key={key}
            onClick={() => onModeChange(key)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              mode === key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <motion.div
        className="flex justify-center mb-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative">
          <svg
            width="200"
            height="200"
            className="transform -rotate-90"
            role="img"
            aria-label="Timer progress ring"
          >
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="oklch(0.2 0.01 20)"
              strokeWidth="8"
            />
            {/* Progress ring */}
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={
                mode === "work"
                  ? "oklch(0.62 0.22 25)"
                  : mode === "short"
                    ? "oklch(0.75 0.2 145)"
                    : "oklch(0.6 0.18 230)"
              }
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.5s linear" }}
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={timeLeft}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p
                  className={`font-mono text-5xl font-bold tabular-nums ${TIMER_PRESETS[mode].color} ${
                    running && timeLeft <= 60 ? "animate-pulse" : ""
                  }`}
                >
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </p>
              </motion.div>
            </AnimatePresence>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {TIMER_PRESETS[mode].label}
            </p>
            {mode === "work" && (
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                Default: {Math.round(customDefaultSeconds / 60)} min
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Remaining / Used time stat boxes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
            Time Remaining
          </p>
          <p
            className={`font-mono text-xl font-bold tabular-nums ${TIMER_PRESETS[mode].color}`}
          >
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
            Time Used
          </p>
          <p className="font-mono text-xl font-bold tabular-nums text-emerald-400">
            {String(Math.floor((total - timeLeft) / 60)).padStart(2, "0")}:
            {String((total - timeLeft) % 60).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="h-10 w-10 rounded-full border-border hover:border-primary/40 hover:bg-primary/10"
        >
          <RotateCcw size={15} />
        </Button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onToggleRunning}
          className={`h-14 w-14 rounded-full flex items-center justify-center font-semibold text-primary-foreground transition-all duration-200 cursor-pointer shadow-crimson-glow ${
            running
              ? "bg-primary/80 hover:bg-primary/70"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {running ? (
            <Pause size={20} />
          ) : (
            <Play size={20} className="ml-0.5" />
          )}
        </motion.button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onModeChange(mode === "work" ? "short" : "work")}
          className="h-10 w-10 rounded-full border-border hover:border-primary/40 hover:bg-primary/10"
          title="Toggle mode"
        >
          <Coffee size={15} />
        </Button>
      </div>

      {/* Sessions counter */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {Array.from(
          { length: Math.min(sessions, 8) },
          (_, i) => `dot-${i}`,
        ).map((k) => (
          <motion.div
            key={k}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2.5 h-2.5 rounded-full bg-primary"
          />
        ))}
        {sessions === 0 && (
          <p className="text-xs text-muted-foreground">
            Complete sessions to see progress
          </p>
        )}
        {sessions > 0 && (
          <p className="text-xs text-muted-foreground ml-1">
            {sessions} session{sessions !== 1 ? "s" : ""} today
          </p>
        )}
      </div>

      {/* Set Default Duration */}
      <Card className="border-border mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm font-semibold flex items-center gap-2">
            <Settings size={14} className="text-primary" />
            Set Default Focus Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Minutes (1–120)
              </Label>
              <Input
                type="number"
                min={1}
                max={120}
                step={1}
                placeholder="e.g. 25"
                value={defaultInput}
                onChange={(e) => setDefaultInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSetDefault();
                }}
                className="bg-muted/40 border-input focus:border-primary/50 font-mono"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleSetDefault}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Set Default
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Current default: {Math.round(customDefaultSeconds / 60)} min ·
            Applies to Focus mode only
          </p>
        </CardContent>
      </Card>

      {/* Tips card */}
      <Card className="border-border mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
              <Zap size={13} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-0.5">
                Study Tip
              </p>
              <p className="text-xs text-muted-foreground">
                {SESSION_TIPS[tipIndex % SESSION_TIPS.length]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick presets */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onModeChange("short")}
          className="p-3 rounded-lg border border-border hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-150 text-left cursor-pointer group"
        >
          <p className="text-xs font-semibold text-green-400 group-hover:text-green-300">
            5 min break
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Short recharge
          </p>
        </button>
        <button
          type="button"
          onClick={() => onModeChange("long")}
          className="p-3 rounded-lg border border-border hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-150 text-left cursor-pointer group"
        >
          <p className="text-xs font-semibold text-blue-400 group-hover:text-blue-300">
            15 min break
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Long recharge
          </p>
        </button>
      </div>

      {/* ── Daily Focus Log ──────────────────────────────────────────────────── */}
      <Card className="border-border mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm font-semibold flex items-center gap-2">
            <Flame size={14} className="text-primary" />
            Daily Focus Log
            {targetStreak > 0 && (
              <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Flame size={11} className="text-amber-400" />
                <span className="text-[10px] font-bold text-amber-400">
                  {targetStreak}d target streak
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Target setting */}
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">
              Daily Target (min):
            </Label>
            <Input
              type="number"
              min={1}
              max={1440}
              value={focusTargetInput}
              onChange={(e) => setFocusTargetInput(e.target.value)}
              onBlur={() => {
                const v = Number.parseInt(focusTargetInput, 10);
                if (!Number.isNaN(v) && v > 0) {
                  setFocusTarget(v);
                  localStorage.setItem(FOCUS_TARGET_KEY, String(v));
                }
              }}
              className="h-7 text-xs bg-muted/40 border-input w-20 font-mono"
            />
            <span className="text-xs text-muted-foreground">
              = {Math.floor(focusTarget / 60)}h {focusTarget % 60}m
            </span>
          </div>

          {/* Last 14 days table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-2 py-1.5 text-left text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-2 py-1.5 text-right text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Minutes
                  </th>
                  <th className="px-2 py-1.5 text-right text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-2 py-1.5 text-center text-[9px] font-bold text-muted-foreground uppercase tracking-wider w-12">
                    Target
                  </th>
                </tr>
              </thead>
              <tbody>
                {last14Days.map((date) => {
                  const mins = focusLog[date] ?? 0;
                  const hrs = (mins / 60).toFixed(1);
                  const met = mins >= focusTarget;
                  const isToday = date === getTodayDateStr();
                  return (
                    <tr
                      key={date}
                      className={`border-t border-border ${isToday ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-2 py-1.5 font-mono text-muted-foreground">
                        {isToday ? "Today" : date.slice(5)}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono text-foreground">
                        {mins}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono text-foreground">
                        {hrs}h
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        {mins > 0 ? (
                          met ? (
                            <span className="text-emerald-400">✓</span>
                          ) : (
                            <span className="text-muted-foreground/50">✗</span>
                          )
                        ) : (
                          <span className="text-muted-foreground/30">–</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[10px] text-muted-foreground">
            Focus time accumulates from all work sessions (completed and
            paused). Target streak counts consecutive days meeting the daily
            target.
          </p>
        </CardContent>
      </Card>

      {/* ── Section Time Breakdown ────────────────────────────────────────── */}
      <SectionBreakdownCard />
    </div>
  );
}

function SectionBreakdownCard() {
  const todayStr = getTodayDateStr();
  const last7 = getLast7DaysStr();

  const sectionRows = (
    Object.entries(SECTION_PREFIXES) as [
      keyof typeof SECTION_PREFIXES,
      string,
    ][]
  ).map(([name, prefix]) => {
    const todaySecs = readSectionTime(prefix, todayStr);
    const weekSecs = last7.reduce(
      (acc, d) => acc + readSectionTime(prefix, d),
      0,
    );
    return { name, todaySecs, weekSecs };
  });

  return (
    <Card className="border-border mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-sm font-semibold flex items-center gap-2">
          <Grid3X3 size={14} className="text-primary" />
          Section Time Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted/40">
                <th className="px-3 py-2 text-left text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Section
                </th>
                <th className="px-3 py-2 text-right text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Today
                </th>
                <th className="px-3 py-2 text-right text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  This Week
                </th>
              </tr>
            </thead>
            <tbody>
              {sectionRows.map((row) => (
                <tr key={row.name} className="border-t border-border">
                  <td className="px-3 py-2 font-medium text-foreground">
                    {row.name}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-primary font-semibold">
                    {row.todaySecs > 0 ? formatHMS(row.todaySecs) : "—"}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                    {row.weekSecs > 0 ? formatHMS(row.weekSecs) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          Time is tracked per section via your local device and persists across
          app restarts.
        </p>
      </CardContent>
    </Card>
  );
}
