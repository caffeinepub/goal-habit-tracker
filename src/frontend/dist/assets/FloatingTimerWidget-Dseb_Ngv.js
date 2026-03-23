import { f as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, a4 as Timer } from "./index-DLAs_Gc6.js";
import { P as Pause, a as Play } from "./play-ASYzIvJS.js";
import { A as AnimatePresence } from "./index-CZmu5IWb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
];
const GripVertical = createLucideIcon("grip-vertical", __iconNode);
const MODE_CONFIG = {
  work: { label: "Focus", color: "text-primary" },
  short: { label: "Short Break", color: "text-green-400" },
  long: { label: "Long Break", color: "text-blue-400" }
};
const POS_KEY = "ssc_timer_widget_pos";
function loadPos() {
  try {
    const s = localStorage.getItem(POS_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}
function savePos(pos) {
  localStorage.setItem(POS_KEY, JSON.stringify(pos));
}
function FloatingTimerWidget({
  mode,
  timeLeft,
  running,
  activeTab,
  onToggleRunning,
  onGoToTimer,
  sectionTimerLabel,
  sectionTimerSecs,
  sectionTimerRunning
}) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const { label, color } = MODE_CONFIG[mode];
  const hasSectionTimer = sectionTimerRunning && sectionTimerLabel && sectionTimerSecs !== void 0;
  const sectionMins = sectionTimerSecs !== void 0 ? Math.floor(sectionTimerSecs / 60) : 0;
  const sectionSecs = sectionTimerSecs !== void 0 ? sectionTimerSecs % 60 : 0;
  const sectionTimeStr = `${String(sectionMins).padStart(2, "0")}:${String(sectionSecs).padStart(2, "0")}`;
  const shouldShow = activeTab !== "timer" || hasSectionTimer;
  const [pos, setPos] = reactExports.useState(() => {
    const saved = loadPos();
    if (saved) return saved;
    return {
      x: Math.max(
        0,
        (typeof window !== "undefined" ? window.innerWidth : 1200) - 220
      ),
      y: Math.max(
        0,
        (typeof window !== "undefined" ? window.innerHeight : 800) - 100
      )
    };
  });
  const isDragging = reactExports.useRef(false);
  const dragStart = reactExports.useRef({ mx: 0, my: 0, wx: 0, wy: 0 });
  const hasMoved = reactExports.useRef(false);
  const posRef = reactExports.useRef(pos);
  posRef.current = pos;
  const clamp = reactExports.useCallback((x, y) => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const WIDGET_W = 220;
    const WIDGET_H = 60;
    return {
      x: Math.max(0, Math.min(W - WIDGET_W, x)),
      y: Math.max(0, Math.min(H - WIDGET_H, y))
    };
  }, []);
  const onMouseMove = reactExports.useCallback(
    (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.mx;
      const dy = e.clientY - dragStart.current.my;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved.current = true;
      const newPos = clamp(
        dragStart.current.wx + dx,
        dragStart.current.wy + dy
      );
      setPos(newPos);
    },
    [clamp]
  );
  const onMouseUp = reactExports.useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      savePos(posRef.current);
    }
  }, []);
  const onTouchMove = reactExports.useCallback(
    (e) => {
      if (!isDragging.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.current.mx;
      const dy = touch.clientY - dragStart.current.my;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved.current = true;
      const newPos = clamp(
        dragStart.current.wx + dx,
        dragStart.current.wy + dy
      );
      setPos(newPos);
      e.preventDefault();
    },
    [clamp]
  );
  const onTouchEnd = reactExports.useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      savePos(posRef.current);
    }
  }, []);
  reactExports.useEffect(() => {
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
  const handleDragStart = reactExports.useCallback(
    (e) => {
      isDragging.current = true;
      hasMoved.current = false;
      if ("touches" in e) {
        const touch = e.touches[0];
        dragStart.current = {
          mx: touch.clientX,
          my: touch.clientY,
          wx: posRef.current.x,
          wy: posRef.current.y
        };
      } else {
        dragStart.current = {
          mx: e.clientX,
          my: e.clientY,
          wx: posRef.current.x,
          wy: posRef.current.y
        };
        e.preventDefault();
      }
    },
    []
  );
  const handleGoToTimer = reactExports.useCallback(
    (e) => {
      if (hasMoved.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onGoToTimer();
    },
    [onGoToTimer]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: shouldShow && /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
      transition: { duration: 0.2, ease: "easeOut" },
      style: {
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        cursor: isDragging.current ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 rounded-2xl border border-border",
            style: {
              background: "oklch(0.11 0.01 20 / 0.95)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 8px 32px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(0.25 0.015 20 / 0.5)",
              minWidth: "196px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "pl-2 py-3 pr-0 cursor-grab active:cursor-grabbing touch-none flex items-center text-muted-foreground hover:text-foreground transition-colors",
                  onMouseDown: handleDragStart,
                  onTouchStart: handleDragStart,
                  "aria-label": "Drag to move timer",
                  title: "Drag to reposition",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleGoToTimer,
                  className: "flex flex-col items-start gap-0.5 min-w-0 cursor-pointer group py-2.5 flex-1",
                  "aria-label": "Go to timer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Timer,
                        {
                          size: 12,
                          className: "text-muted-foreground group-hover:text-primary transition-colors"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-wider", children: label })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `font-mono text-xl font-bold tabular-nums leading-none ${color} ${running && timeLeft <= 60 ? "animate-pulse" : ""}`,
                        children: timeStr
                      }
                    ),
                    hasSectionTimer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-emerald-400 font-mono font-semibold truncate max-w-[110px]", children: [
                        sectionTimerLabel,
                        " – ",
                        sectionTimeStr
                      ] })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  type: "button",
                  whileHover: { scale: 1.08 },
                  whileTap: { scale: 0.92 },
                  onClick: onToggleRunning,
                  className: `shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${running ? "bg-primary/20 hover:bg-primary/30 text-primary" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`,
                  "aria-label": running ? "Pause timer" : "Start timer",
                  children: running ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 13, className: "ml-0.5" })
                }
              ) })
            ]
          }
        ),
        running && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { scale: 0 },
            animate: { scale: 1 },
            className: "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary shadow-crimson-glow",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-primary animate-ping opacity-75" })
          }
        )
      ]
    },
    "floating-timer"
  ) });
}
export {
  FloatingTimerWidget as default
};
