import { GripVertical, Pause, Play, Timer } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

const POS_KEY = "ssc_timer_widget_pos";

function loadPos(): { x: number; y: number } | null {
  try {
    const s = localStorage.getItem(POS_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function savePos(pos: { x: number; y: number }) {
  localStorage.setItem(POS_KEY, JSON.stringify(pos));
}

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

  // ── Drag state ─────────────────────────────────────────────────────────────
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    const saved = loadPos();
    if (saved) return saved;
    return {
      x: Math.max(
        0,
        (typeof window !== "undefined" ? window.innerWidth : 1200) - 220,
      ),
      y: Math.max(
        0,
        (typeof window !== "undefined" ? window.innerHeight : 800) - 100,
      ),
    };
  });
  const isDragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, wx: 0, wy: 0 });
  const hasMoved = useRef(false);
  const posRef = useRef(pos);
  posRef.current = pos;

  // Clamp position within viewport
  const clamp = useCallback((x: number, y: number) => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const WIDGET_W = 220;
    const WIDGET_H = 60;
    return {
      x: Math.max(0, Math.min(W - WIDGET_W, x)),
      y: Math.max(0, Math.min(H - WIDGET_H, y)),
    };
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.mx;
      const dy = e.clientY - dragStart.current.my;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved.current = true;
      const newPos = clamp(
        dragStart.current.wx + dx,
        dragStart.current.wy + dy,
      );
      setPos(newPos);
    },
    [clamp],
  );

  const onMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      savePos(posRef.current);
    }
  }, []);

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.current.mx;
      const dy = touch.clientY - dragStart.current.my;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved.current = true;
      const newPos = clamp(
        dragStart.current.wx + dx,
        dragStart.current.wy + dy,
      );
      setPos(newPos);
      e.preventDefault();
    },
    [clamp],
  );

  const onTouchEnd = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      savePos(posRef.current);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      isDragging.current = true;
      hasMoved.current = false;
      if ("touches" in e) {
        const touch = e.touches[0];
        dragStart.current = {
          mx: touch.clientX,
          my: touch.clientY,
          wx: posRef.current.x,
          wy: posRef.current.y,
        };
      } else {
        dragStart.current = {
          mx: e.clientX,
          my: e.clientY,
          wx: posRef.current.x,
          wy: posRef.current.y,
        };
        e.preventDefault();
      }
    },
    [],
  );

  const handleGoToTimer = useCallback(
    (e: React.MouseEvent) => {
      if (hasMoved.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onGoToTimer();
    },
    [onGoToTimer],
  );

  return (
    <AnimatePresence>
      {activeTab !== "timer" && (
        <motion.div
          key="floating-timer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            zIndex: 9999,
            cursor: isDragging.current ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "none",
          }}
        >
          <div
            className="flex items-center gap-2 rounded-2xl border border-border"
            style={{
              background: "oklch(0.11 0.01 20 / 0.95)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow:
                "0 8px 32px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(0.25 0.015 20 / 0.5)",
              minWidth: "196px",
            }}
          >
            {/* Drag handle */}
            <div
              className="pl-2 py-3 pr-0 cursor-grab active:cursor-grabbing touch-none flex items-center text-muted-foreground hover:text-foreground transition-colors"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              aria-label="Drag to move timer"
              title="Drag to reposition"
            >
              <GripVertical size={14} />
            </div>

            {/* Icon + Label */}
            <button
              type="button"
              onClick={handleGoToTimer}
              className="flex flex-col items-start gap-0.5 min-w-0 cursor-pointer group py-3 flex-1"
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
            <div className="pr-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onToggleRunning}
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  running
                    ? "bg-primary/20 hover:bg-primary/30 text-primary"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
                aria-label={running ? "Pause timer" : "Start timer"}
              >
                {running ? (
                  <Pause size={13} />
                ) : (
                  <Play size={13} className="ml-0.5" />
                )}
              </motion.button>
            </div>
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
