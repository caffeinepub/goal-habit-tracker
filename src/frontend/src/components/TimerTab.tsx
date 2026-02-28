import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coffee, Pause, Play, RotateCcw, Settings, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { TimerMode } from "../App";

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
}: TimerTabProps) {
  const [defaultInput, setDefaultInput] = useState(
    String(Math.round(customDefaultSeconds / 60)),
  );

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
    <div className="p-6 max-w-lg mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Pomodoro Timer
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Stay focused with timed study sessions
        </p>
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
      <Card className="border-border">
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
      <div className="mt-4 grid grid-cols-2 gap-2">
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
    </div>
  );
}
