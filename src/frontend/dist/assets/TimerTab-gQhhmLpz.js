import { f as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, P as Palette, m as motion, L as Label, I as Input, a3 as Zap, b as ue } from "./index-DLAs_Gc6.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-Dxf4uiUA.js";
import { u as useSectionStyle, S as SectionStylePanel, R as RotateCcw } from "./SectionStylePanel-0LZveikG.js";
import { F as Flame } from "./flame-BufIixUk.js";
import { P as Pause, a as Play } from "./play-ASYzIvJS.js";
import { S as Settings } from "./settings-DF32Gu2g.js";
import { A as AnimatePresence } from "./index-CZmu5IWb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M14 2v2", key: "6buw04" }],
  [
    "path",
    {
      d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
      key: "pwadti"
    }
  ],
  ["path", { d: "M6 2v2", key: "colzsn" }]
];
const Coffee = createLucideIcon("coffee", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
];
const Grid3x3 = createLucideIcon("grid-3x3", __iconNode);
const POMODORO_DAYS_KEY = "ssc_pomodoro_days";
const FOCUS_LOG_KEY = "ssc_focus_log";
const FOCUS_TARGET_KEY = "ssc_daily_focus_target";
const FOCUS_LIVE_PREFIX = "ssc_focus_live_";
function getTodayDateStr() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function loadPomoDays() {
  try {
    const saved = localStorage.getItem(POMODORO_DAYS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}
function savePomoDays(days) {
  localStorage.setItem(POMODORO_DAYS_KEY, JSON.stringify(days));
}
function loadFocusLog() {
  try {
    const saved = localStorage.getItem(FOCUS_LOG_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}
function saveFocusLog(log) {
  localStorage.setItem(FOCUS_LOG_KEY, JSON.stringify(log));
}
function loadFocusTarget() {
  try {
    const s = localStorage.getItem(FOCUS_TARGET_KEY);
    return s ? Number(s) : 900;
  } catch {
    return 900;
  }
}
function getLiveFocusKey(date) {
  return `${FOCUS_LIVE_PREFIX}${date}`;
}
function mergeLiveFocusOnMount(setFocusLog) {
  const today = getTodayDateStr();
  const liveKey = getLiveFocusKey(today);
  const liveSecs = Number(localStorage.getItem(liveKey) ?? 0);
  if (liveSecs > 0) {
    const liveMins = Math.floor(liveSecs / 60);
    if (liveMins > 0) {
      setFocusLog((prev) => {
        const next = { ...prev, [today]: (prev[today] ?? 0) + liveMins };
        saveFocusLog(next);
        return next;
      });
    }
    localStorage.removeItem(liveKey);
  }
}
function computeStreak(days) {
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
function computeTargetStreak(log, targetMins) {
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
function getLast14Days() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split("T")[0];
  });
}
function getLast7DaysStr() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}
function readSectionTime(prefix, date) {
  return Number(localStorage.getItem(`${prefix}${date}`) ?? 0);
}
function formatHMS(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor(secs % 3600 / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
const SECTION_PREFIXES = {
  "Study Plan": "ssc_section_time_studyplan_",
  Questions: "ssc_section_time_questions_",
  "Daily Routine": "ssc_section_time_dailyroutine_"
};
const TIMER_PRESETS = {
  work: { label: "Focus", color: "text-primary" },
  short: { label: "Short Break", color: "text-green-400" },
  long: { label: "Long Break", color: "text-blue-400" }
};
const SESSION_TIPS = [
  "Take a glass of water before starting",
  "Put your phone on Do Not Disturb",
  "Clear your desk before focusing",
  "Identify your single most important task",
  "Review your notes after the session"
];
function TimerTab({
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
  onFocusTimeUpdate
}) {
  const [defaultInput, setDefaultInput] = reactExports.useState(
    String(Math.round(customDefaultSeconds / 60))
  );
  const [showStylePanel, setShowStylePanel] = reactExports.useState(false);
  const styleBtnRef = reactExports.useRef(null);
  const { style: sectionStyle } = useSectionStyle("timer");
  const prevSessionsRef = reactExports.useRef(sessions);
  const [pomoDays, setPomoDays] = reactExports.useState(loadPomoDays);
  const [focusLog, setFocusLog] = reactExports.useState(loadFocusLog);
  const [focusTarget, setFocusTarget] = reactExports.useState(loadFocusTarget);
  const [focusTargetInput, setFocusTargetInput] = reactExports.useState(
    () => String(loadFocusTarget() / 60)
  );
  const sessionStartRef = reactExports.useRef(null);
  const prevRunning = reactExports.useRef(running);
  const liveAccumRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    mergeLiveFocusOnMount(setFocusLog);
  }, []);
  reactExports.useEffect(() => {
    if (running && !prevRunning.current && mode === "work") {
      sessionStartRef.current = Date.now();
      liveAccumRef.current = 0;
    } else if (!running && prevRunning.current && sessionStartRef.current !== null) {
      const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1e3);
      const totalElapsed = liveAccumRef.current + elapsed;
      if (totalElapsed > 0 && mode === "work") {
        const elapsedMins = Math.floor(totalElapsed / 60);
        if (elapsedMins > 0) {
          const today2 = getTodayDateStr();
          setFocusLog((prev) => {
            const next = { ...prev, [today2]: (prev[today2] ?? 0) + elapsedMins };
            saveFocusLog(next);
            return next;
          });
        }
        onFocusTimeUpdate == null ? void 0 : onFocusTimeUpdate(totalElapsed);
      }
      const today = getTodayDateStr();
      localStorage.removeItem(getLiveFocusKey(today));
      sessionStartRef.current = null;
      liveAccumRef.current = 0;
    }
    prevRunning.current = running;
  }, [running, mode, onFocusTimeUpdate]);
  reactExports.useEffect(() => {
    if (!running || mode !== "work") return;
    const today = getTodayDateStr();
    const liveKey = getLiveFocusKey(today);
    const interval = setInterval(() => {
      if (sessionStartRef.current !== null) {
        const elapsed = Math.floor(
          (Date.now() - sessionStartRef.current) / 1e3
        );
        liveAccumRef.current = elapsed;
        localStorage.setItem(liveKey, String(elapsed));
      }
    }, 1e3);
    return () => clearInterval(interval);
  }, [running, mode]);
  reactExports.useEffect(() => {
    if (sessions > prevSessionsRef.current) {
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
  const total = mode === "work" ? customDefaultSeconds : mode === "short" ? 300 : 900;
  const progress = (total - timeLeft) / total * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - progress / 100 * circumference;
  const handleSetDefault = () => {
    const mins = Number.parseInt(defaultInput, 10);
    if (Number.isNaN(mins) || mins < 1 || mins > 120) {
      ue.error("Enter a valid duration (1–120 minutes)");
      return;
    }
    onSetDefault(mins * 60);
    ue.success(`Default set to ${mins} minute${mins !== 1 ? "s" : ""}`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-lg mx-auto", style: sectionStyle, children: [
    showStylePanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionStylePanel,
      {
        sectionId: "timer",
        sectionLabel: "Timer",
        onClose: () => setShowStylePanel(false),
        anchorRef: styleBtnRef
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Pomodoro Timer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Stay focused with timed study sessions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            ref: styleBtnRef,
            size: "sm",
            variant: "outline",
            className: "h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50",
            onClick: () => setShowStylePanel((p) => !p),
            title: "Customize section style",
            "data-ocid": "timer.style.button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 13 })
          }
        ),
        streak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 14, className: "text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-primary", children: [
                streak,
                " day",
                streak !== 1 ? "s" : ""
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-6 p-1 rounded-xl bg-muted/50 border border-border", children: Object.entries(TIMER_PRESETS).map(([key, preset]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => onModeChange(key),
        className: `flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${mode === key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
        children: preset.label
      },
      key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "flex justify-center mb-6",
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.4 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              width: "200",
              height: "200",
              className: "transform -rotate-90",
              role: "img",
              "aria-label": "Timer progress ring",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "100",
                    cy: "100",
                    r: "80",
                    fill: "none",
                    stroke: "oklch(0.2 0.01 20)",
                    strokeWidth: "8"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.circle,
                  {
                    cx: "100",
                    cy: "100",
                    r: "80",
                    fill: "none",
                    stroke: mode === "work" ? "oklch(0.62 0.22 25)" : mode === "short" ? "oklch(0.75 0.2 145)" : "oklch(0.6 0.18 230)",
                    strokeWidth: "8",
                    strokeLinecap: "round",
                    strokeDasharray: circumference,
                    strokeDashoffset,
                    style: { transition: "stroke-dashoffset 0.5s linear" }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0.8 },
                animate: { opacity: 1 },
                className: "text-center",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: `font-mono text-5xl font-bold tabular-nums ${TIMER_PRESETS[mode].color} ${running && timeLeft <= 60 ? "animate-pulse" : ""}`,
                    children: [
                      String(minutes).padStart(2, "0"),
                      ":",
                      String(seconds).padStart(2, "0")
                    ]
                  }
                )
              },
              timeLeft
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 font-medium", children: TIMER_PRESETS[mode].label }),
            mode === "work" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground/60 mt-0.5", children: [
              "Default: ",
              Math.round(customDefaultSeconds / 60),
              " min"
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider mb-1", children: "Time Remaining" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: `font-mono text-xl font-bold tabular-nums ${TIMER_PRESETS[mode].color}`,
            children: [
              String(minutes).padStart(2, "0"),
              ":",
              String(seconds).padStart(2, "0")
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider mb-1", children: "Time Used" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xl font-bold tabular-nums text-emerald-400", children: [
          String(Math.floor((total - timeLeft) / 60)).padStart(2, "0"),
          ":",
          String((total - timeLeft) % 60).padStart(2, "0")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "icon",
          onClick: onReset,
          className: "h-10 w-10 rounded-full border-border hover:border-primary/40 hover:bg-primary/10",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 15 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.button,
        {
          whileHover: { scale: 1.04 },
          whileTap: { scale: 0.96 },
          onClick: onToggleRunning,
          className: `h-14 w-14 rounded-full flex items-center justify-center font-semibold text-primary-foreground transition-all duration-200 cursor-pointer shadow-crimson-glow ${running ? "bg-primary/80 hover:bg-primary/70" : "bg-primary hover:bg-primary/90"}`,
          children: running ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 20, className: "ml-0.5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "icon",
          onClick: () => onModeChange(mode === "work" ? "short" : "work"),
          className: "h-10 w-10 rounded-full border-border hover:border-primary/40 hover:bg-primary/10",
          title: "Toggle mode",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Coffee, { size: 15 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-6", children: [
      Array.from(
        { length: Math.min(sessions, 8) },
        (_, i) => `dot-${i}`
      ).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { scale: 0 },
          animate: { scale: 1 },
          className: "w-2.5 h-2.5 rounded-full bg-primary"
        },
        k
      )),
      sessions === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Complete sessions to see progress" }),
      sessions > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground ml-1", children: [
        sessions,
        " session",
        sessions !== 1 ? "s" : "",
        " today"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 14, className: "text-primary" }),
        "Set Default Focus Duration"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Minutes (1–120)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 1,
                max: 120,
                step: 1,
                placeholder: "e.g. 25",
                value: defaultInput,
                onChange: (e) => setDefaultInput(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") handleSetDefault();
                },
                className: "bg-muted/40 border-input focus:border-primary/50 font-mono"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleSetDefault,
              className: "bg-primary hover:bg-primary/90 text-primary-foreground",
              children: "Set Default"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-2", children: [
          "Current default: ",
          Math.round(customDefaultSeconds / 60),
          " min · Applies to Focus mode only"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 13, className: "text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mb-0.5", children: "Study Tip" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: SESSION_TIPS[tipIndex % SESSION_TIPS.length] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onModeChange("short"),
          className: "p-3 rounded-lg border border-border hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-150 text-left cursor-pointer group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-green-400 group-hover:text-green-300", children: "5 min break" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Short recharge" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onModeChange("long"),
          className: "p-3 rounded-lg border border-border hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-150 text-left cursor-pointer group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-blue-400 group-hover:text-blue-300", children: "15 min break" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Long recharge" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 14, className: "text-primary" }),
        "Daily Focus Log",
        targetStreak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 11, className: "text-amber-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-amber-400", children: [
            targetStreak,
            "d target streak"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground whitespace-nowrap", children: "Daily Target (hours):" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 0.1,
              max: 24,
              step: 0.5,
              value: focusTargetInput,
              onChange: (e) => setFocusTargetInput(e.target.value),
              onBlur: () => {
                const hours = Number.parseFloat(focusTargetInput);
                if (!Number.isNaN(hours) && hours > 0) {
                  const mins = Math.round(hours * 60);
                  setFocusTarget(mins);
                  localStorage.setItem(FOCUS_TARGET_KEY, String(mins));
                }
              },
              className: "h-7 text-xs bg-muted/40 border-input w-20 font-mono"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "= ",
            (focusTarget / 60).toFixed(1),
            "h"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs border-collapse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5 text-left text-[9px] font-bold text-muted-foreground uppercase tracking-wider", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5 text-right text-[9px] font-bold text-muted-foreground uppercase tracking-wider", children: "Minutes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5 text-right text-[9px] font-bold text-muted-foreground uppercase tracking-wider", children: "Hours" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5 text-center text-[9px] font-bold text-muted-foreground uppercase tracking-wider w-12", children: "Target" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: last14Days.map((date) => {
            const mins = focusLog[date] ?? 0;
            const hrs = (mins / 60).toFixed(1);
            const met = mins >= focusTarget;
            const isToday = date === getTodayDateStr();
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: `border-t border-border ${isToday ? "bg-primary/5" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 font-mono text-muted-foreground", children: isToday ? "Today" : date.slice(5) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 text-right font-mono text-foreground", children: mins }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2 py-1.5 text-right font-mono text-foreground", children: [
                    hrs,
                    "h"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 text-center", children: mins > 0 ? met ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400", children: "✓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "✗" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "–" }) })
                ]
              },
              date
            );
          }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Focus time accumulates from all work sessions (completed and paused). Target streak counts consecutive days meeting the daily target." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionBreakdownCard, {})
  ] });
}
function SectionBreakdownCard() {
  const todayStr = getTodayDateStr();
  const last7 = getLast7DaysStr();
  const sectionRows = Object.entries(SECTION_PREFIXES).map(([name, prefix]) => {
    const todaySecs = readSectionTime(prefix, todayStr);
    const weekSecs = last7.reduce(
      (acc, d) => acc + readSectionTime(prefix, d),
      0
    );
    return { name, todaySecs, weekSecs };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm font-semibold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { size: 14, className: "text-primary" }),
      "Section Time Breakdown"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left text-[9px] font-bold text-muted-foreground uppercase tracking-wider", children: "Section" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right text-[9px] font-bold text-muted-foreground uppercase tracking-wider", children: "Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right text-[9px] font-bold text-muted-foreground uppercase tracking-wider", children: "This Week" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sectionRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-foreground", children: row.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-mono text-primary font-semibold", children: row.todaySecs > 0 ? formatHMS(row.todaySecs) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-mono text-muted-foreground", children: row.weekSecs > 0 ? formatHMS(row.weekSecs) : "—" })
        ] }, row.name)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-2", children: "Time is tracked per section via your local device and persists across app restarts." })
    ] })
  ] });
}
export {
  TimerTab as default
};
