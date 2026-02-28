import { Pause, Play, Timer } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { TabId } from "../App";

type TimerMode = "work" | "short" | "long";

interface FloatingTimerWidgetProps {
  mode: TimerMode;
  timeLeft: number;
  running: boolean;
  activeTab: TabId;
  onToggleRunning: () => void;
  onGoToTimer: () => void;
}

const MODE_CONFIG: Record<TimerMode, { label: string; color: string }> = {
  work: { label: "Focus", color: "text-primary" },
  short: { label: "Short Break", color: "text-green-400" },
  long: { label: "Long Break", color: "text-blue-400" },
};

export default function FloatingTimerWidget({
  mode,
  timeLeft,
  running,
  activeTab,
  onToggleRunning,
  onGoToTimer,
}: FloatingTimerWidgetProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const { label, color } = MODE_CONFIG[mode];

  return (
    <AnimatePresence>
      {activeTab !== "timer" && (
        <motion.div
          key="floating-timer"
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.92 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border"
            style={{
              background: "oklch(0.11 0.01 20 / 0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow:
                "0 8px 32px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(0.25 0.015 20 / 0.5)",
              minWidth: "196px",
            }}
          >
            {/* Icon + Label */}
            <button
              type="button"
              onClick={onGoToTimer}
              className="flex flex-col items-start gap-0.5 min-w-0 cursor-pointer group"
              aria-label="Go to timer"
            >
              <div className="flex items-center gap-1.5">
                <Timer
                  size={12}
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                />
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-wider">
                  {label}
                </span>
              </div>
              <span
                className={`font-mono text-xl font-bold tabular-nums leading-none ${color} ${
                  running && timeLeft <= 60 ? "animate-pulse" : ""
                }`}
              >
                {timeStr}
              </span>
            </button>

            {/* Play/Pause button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onToggleRunning}
              className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                running
                  ? "bg-primary/20 hover:bg-primary/30 text-primary"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
              aria-label={running ? "Pause timer" : "Start timer"}
            >
              {running ? (
                <Pause size={14} />
              ) : (
                <Play size={14} className="ml-0.5" />
              )}
            </motion.button>
          </div>

          {/* Running indicator dot */}
          {running && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary shadow-crimson-glow"
            >
              <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
