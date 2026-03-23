import { f as createLucideIcon, an as useGetMonthlyLogs, ao as useGetTargets, ap as useSaveMonthlyLog, r as reactExports, b as ue, j as jsxRuntimeExports, m as motion, x as CalendarDays, T as Target, U as Clock, L as Label, I as Input, e as Progress, aq as useGetQuestionProgress, ar as useGetPlanCycles, as as useGetCustomSubjects, at as useSetQuestionCount, au as useSavePlanCycle, av as useSaveSectionTimeLog, B as Button, P as Palette, A as AlertDialog, y as AlertDialogTrigger, E as Eraser, z as AlertDialogContent, G as AlertDialogHeader, H as AlertDialogTitle, J as AlertDialogDescription, K as AlertDialogFooter, M as AlertDialogCancel, N as AlertDialogAction, C as CirclePlus, a4 as Timer, a as BookOpen, V as ScrollArea, a3 as Zap } from "./index-DLAs_Gc6.js";
import { B as Badge } from "./badge-CHsaAkW-.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-Dxf4uiUA.js";
import { C as ChartPie, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, R as ResponsiveContainer, P as PieChart, d as Pie, e as Cell, T as Tooltip, L as Legend } from "./PieChart-BO68wdGm.js";
import { S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem } from "./select-Dsc1j4A2.js";
import { S as Skeleton } from "./skeleton-DCKYeWup.js";
import { T as TargetsPanel, a as Table, b as TableHeader, c as TableRow, d as TableHead, e as TableBody, f as TableCell } from "./TargetsPanel-DEwiXtHJ.js";
import { F as Flame } from "./flame-BufIixUk.js";
import { T as TrendingUp } from "./trending-up-BZ6z9oH7.js";
import { C as CircleCheck } from "./circle-check-D6S-380R.js";
import { C as CircleAlert } from "./circle-alert-j8zZhBCn.js";
import { P as Pencil } from "./pencil-Vx6XsmJ6.js";
import { A as AnimatePresence } from "./index-CZmu5IWb.js";
import { u as useSectionStyle, S as SectionStylePanel, R as RotateCcw } from "./SectionStylePanel-0LZveikG.js";
import { T as Trophy, H as History } from "./trophy-Dvr7s2CK.js";
import { A as Award } from "./award-DexwFpyJ.js";
import { P as Pause, a as Play } from "./play-ASYzIvJS.js";
import "./check-CZSheQsr.js";
import "./settings-DF32Gu2g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
function getTodayKey() {
  const d = /* @__PURE__ */ new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function getDateKey(planStart, dayIndex) {
  const d = new Date(planStart);
  d.setDate(d.getDate() + dayIndex);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function getDaysElapsed(planStart, totalDays) {
  const now = /* @__PURE__ */ new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startDate = new Date(
    planStart.getFullYear(),
    planStart.getMonth(),
    planStart.getDate()
  );
  const diff = startOfToday.getTime() - startDate.getTime();
  return Math.max(0, Math.min(totalDays, Math.floor(diff / 864e5)));
}
function getPaceMessage(daysElapsed, totalSoFar, totalGoal, totalDays, dailyTarget) {
  const remaining = totalGoal - totalSoFar;
  const daysLeft = totalDays - daysElapsed;
  if (daysLeft <= 0) {
    if (totalSoFar >= totalGoal)
      return "🏆 Challenge complete! Incredible work!";
    return `Plan ended — ${totalSoFar.toLocaleString()}/${totalGoal.toLocaleString()} questions done.`;
  }
  if (remaining <= 0) return "🏆 Goal achieved ahead of schedule!";
  const requiredPerDay = Math.ceil(remaining / daysLeft);
  if (requiredPerDay <= dailyTarget)
    return `You need ${requiredPerDay}/day for ${daysLeft} remaining days — you're on track! ✅`;
  return `You need ${requiredPerDay}/day for ${daysLeft} remaining days to hit ${totalGoal.toLocaleString()} — step it up! ⚡`;
}
function getDayStatus(count, isPast, isToday, dailyTarget) {
  if (isToday) return "today";
  if (!isPast && !isToday) return "future";
  if (count >= dailyTarget) return "complete";
  if (count > 0) return "partial";
  return "missed";
}
const DAY_STATUS_STYLES = {
  complete: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
  partial: "bg-amber-500/15 border-amber-500/40 text-amber-400",
  missed: "bg-destructive/10 border-destructive/30 text-destructive/70",
  today: "border-primary ring-2 ring-primary/40 bg-primary/10 text-primary",
  future: "bg-muted/20 border-border text-muted-foreground/40"
};
function MonthlyPlanSection() {
  const { data: rawLogs = [], isLoading: logsLoading } = useGetMonthlyLogs();
  const { data: targets } = useGetTargets();
  const saveMonthlyLog = useSaveMonthlyLog();
  const TOTAL_GOAL = Number((targets == null ? void 0 : targets.totalQuestionsGoal) ?? 9e3);
  const TOTAL_DAYS = Number((targets == null ? void 0 : targets.planTotalDays) ?? 30);
  const DAILY_TARGET = TOTAL_DAYS > 0 ? Math.round(TOTAL_GOAL / TOTAL_DAYS) : 300;
  const SUBJECT_DAILY = reactExports.useMemo(() => {
    const subjectTargets = (targets == null ? void 0 : targets.subjectTargets) ?? [];
    return subjectTargets.map((s) => ({
      name: s.name,
      total: Number(s.target),
      daily: TOTAL_DAYS > 0 ? Math.round(Number(s.target) / TOTAL_DAYS) : 0
    }));
  }, [targets == null ? void 0 : targets.subjectTargets, TOTAL_DAYS]);
  const [planStart, setPlanStart] = reactExports.useState(null);
  const [inputValue, setInputValue] = reactExports.useState("");
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const debounceRef = reactExports.useRef(null);
  const savedTimerRef = reactExports.useRef(null);
  const inputInitialized = reactExports.useRef(false);
  const logs = reactExports.useMemo(() => {
    const map = {};
    for (const entry of rawLogs) {
      map[entry.date] = Number(entry.count);
    }
    return map;
  }, [rawLogs]);
  reactExports.useEffect(() => {
    const savedStart = localStorage.getItem("ssc_plan_start");
    if (savedStart) {
      setPlanStart(new Date(savedStart));
    } else {
      const now = /* @__PURE__ */ new Date();
      const startStr = now.toISOString();
      localStorage.setItem("ssc_plan_start", startStr);
      setPlanStart(now);
    }
  }, []);
  const todayKey = getTodayKey();
  const daysElapsed = planStart ? getDaysElapsed(planStart, TOTAL_DAYS) : 0;
  const daysRemaining = Math.max(0, TOTAL_DAYS - daysElapsed);
  const todaySolved = logs[todayKey] ?? 0;
  const totalSoFar = Object.values(logs).reduce((a, b) => a + b, 0);
  reactExports.useEffect(() => {
    if (!logsLoading && !inputInitialized.current) {
      const todayCount = logs[todayKey] ?? 0;
      if (todayCount > 0) {
        setInputValue(String(todayCount));
      }
      inputInitialized.current = true;
    }
  }, [logsLoading, logs, todayKey]);
  const triggerSave = reactExports.useCallback(
    (valueStr) => {
      const n = Number.parseInt(valueStr, 10);
      if (Number.isNaN(n) || n < 0 || n > 99999) return;
      setSaveStatus("saving");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      saveMonthlyLog.mutate(
        { date: todayKey, count: n },
        {
          onSuccess: () => {
            setSaveStatus("saved");
            savedTimerRef.current = setTimeout(
              () => setSaveStatus("idle"),
              3e3
            );
          },
          onError: () => {
            setSaveStatus("idle");
            ue.error("Failed to save");
          }
        }
      );
    },
    [saveMonthlyLog, todayKey]
  );
  const handleInputChange = reactExports.useCallback(
    (e) => {
      const val = e.target.value;
      setInputValue(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        triggerSave(val);
      }, 600);
    },
    [triggerSave]
  );
  reactExports.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);
  const weeks = [];
  for (let w = 0; w < Math.ceil(TOTAL_DAYS / 7); w++) {
    const startDay = w * 7;
    const endDay = Math.min(startDay + 6, TOTAL_DAYS - 1);
    weeks.push({ label: `Week ${w + 1}`, startDay, endDay });
  }
  const getWeekStats = (startDay, endDay) => {
    const days = endDay - startDay + 1;
    const target = days * DAILY_TARGET;
    let solved = 0;
    if (planStart) {
      for (let d = startDay; d <= endDay; d++) {
        const key = getDateKey(planStart, d);
        solved += logs[key] ?? 0;
      }
    }
    return { target, solved, days };
  };
  const paceMessage = getPaceMessage(
    daysElapsed,
    totalSoFar,
    TOTAL_GOAL,
    TOTAL_DAYS,
    DAILY_TARGET
  );
  const dayCells = planStart ? Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const dayKey = getDateKey(planStart, i);
    const count = logs[dayKey] ?? 0;
    const isPast = i < daysElapsed;
    const isToday = dayKey === todayKey;
    const status = getDayStatus(count, isPast, isToday, DAILY_TARGET);
    return { dayNum: i + 1, key: dayKey, count, status };
  }) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.25, duration: 0.5 },
      className: "mt-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 16, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold text-foreground", children: [
              TOTAL_DAYS,
              "-Day ",
              TOTAL_GOAL.toLocaleString(),
              " Questions Plan"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              DAILY_TARGET,
              " questions/day · Track your daily progress toward the ultimate goal"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TargetsPanel, {}) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-5",
            initial: "hidden",
            animate: "visible",
            variants: {
              visible: { transition: { staggerChildren: 0.07 } },
              hidden: {}
            },
            children: [
              {
                label: "Daily Target",
                value: DAILY_TARGET.toString(),
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14, className: "text-primary" }),
                sub: "questions/day",
                highlight: false
              },
              {
                label: "Today Solved",
                value: todaySolved.toString(),
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 14, className: "text-amber-400" }),
                sub: todaySolved >= DAILY_TARGET ? "Target hit! 🎯" : `${DAILY_TARGET - todaySolved} to go`,
                highlight: todaySolved >= DAILY_TARGET
              },
              {
                label: "Total So Far",
                value: totalSoFar.toLocaleString(),
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14, className: "text-emerald-400" }),
                sub: `${Math.round(totalSoFar / TOTAL_GOAL * 100)}% of ${TOTAL_GOAL.toLocaleString()}`,
                highlight: false
              },
              {
                label: "Days Remaining",
                value: daysRemaining.toString(),
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 14, className: "text-blue-400" }),
                sub: `Day ${Math.min(daysElapsed + 1, TOTAL_DAYS)} of ${TOTAL_DAYS}`,
                highlight: false
              }
            ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                variants: {
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 }
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Card,
                  {
                    className: `border ${stat.highlight ? "border-primary/40 bg-primary/5" : "border-border"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [
                        stat.icon,
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-medium", children: stat.label })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: `font-display text-2xl font-bold leading-none ${stat.highlight ? "text-primary" : "text-foreground"}`,
                          children: stat.value
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: stat.sub })
                    ] })
                  }
                )
              },
              stat.label
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-5 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 15, className: "text-amber-400" }),
              "Today's Questions",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto", children: [
                saveStatus === "saving" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground text-xs font-normal", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" }),
                  "Saving…"
                ] }),
                saveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-emerald-400 text-xs font-normal", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12 }),
                  "Saved"
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-medium gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
                  (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short"
                  }),
                  " ",
                  "· Editable all day"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Total Questions Solved Today" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 0,
                      placeholder: "e.g. 150",
                      value: inputValue,
                      onChange: handleInputChange,
                      className: "bg-muted/40 border-input focus:border-primary/50 font-mono"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                    "Enter your total for today. Auto-saves as you type.",
                    todaySolved > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `ml-1 ${todaySolved >= DAILY_TARGET ? "text-emerald-400" : "text-amber-400"}`,
                        children: todaySolved >= DAILY_TARGET ? "✓ Target met!" : `(${DAILY_TARGET - todaySolved} more to reach ${DAILY_TARGET})`
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Today's Progress" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold", children: [
                    todaySolved,
                    "/",
                    DAILY_TARGET
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Progress,
                  {
                    value: Math.min(todaySolved / DAILY_TARGET * 100, 100),
                    className: "h-2 bg-muted rounded-full"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium", children: "Daily Subject Targets" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5", children: SUBJECT_DAILY.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between px-2 py-1 rounded bg-muted/30 text-[10px]",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: s.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-foreground ml-1 shrink-0", children: [
                        s.daily,
                        "/day"
                      ] })
                    ]
                  },
                  s.name
                )) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: `border ${totalSoFar >= TOTAL_GOAL ? "border-primary/40 bg-primary/5" : daysElapsed > 0 && totalSoFar < daysElapsed * DAILY_TARGET ? "border-destructive/40 bg-destructive/5" : "border-border"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 shrink-0", children: totalSoFar >= TOTAL_GOAL ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16, className: "text-primary" }) : daysElapsed > 0 && totalSoFar < daysElapsed * DAILY_TARGET ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 16, className: "text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16, className: "text-emerald-400" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mb-1", children: "Pace Indicator" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90 leading-relaxed", children: paceMessage })
                  ] })
                ] }) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground", children: [
                  TOTAL_DAYS,
                  "-Day Overall Progress"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "font-mono text-xs border-primary/30 text-primary",
                    children: [
                      Math.round(totalSoFar / TOTAL_GOAL * 100),
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Progress,
                {
                  value: Math.min(totalSoFar / TOTAL_GOAL * 100, 100),
                  className: "h-3 bg-muted rounded-full"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-lg bg-muted/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-bold text-primary", children: totalSoFar.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground mt-0.5", children: "Solved" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-lg bg-muted/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-bold text-foreground", children: (TOTAL_GOAL - totalSoFar).toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground mt-0.5", children: "Remaining" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-lg bg-muted/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-bold text-foreground", children: daysElapsed * DAILY_TARGET > 0 ? (totalSoFar / Math.max(daysElapsed, 1)).toFixed(0) : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground mt-0.5", children: "Avg/Day" })
                ] })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3 },
            className: "mb-5",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 15, className: "text-primary" }),
                TOTAL_DAYS,
                "-Day Calendar",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 ml-auto text-[10px] text-muted-foreground font-normal", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-emerald-500/40 border border-emerald-500/50 inline-block" }),
                    "≥",
                    DAILY_TARGET
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-amber-500/30 border border-amber-500/50 inline-block" }),
                    "1–",
                    DAILY_TARGET - 1
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-destructive/20 border border-destructive/30 inline-block" }),
                    "Missed"
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: dayCells.map((cell, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.85 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { delay: i * 0.015, duration: 0.2 },
                  className: `relative flex flex-col items-center justify-center gap-0.5 p-1.5 rounded-lg border text-center min-h-[56px] ${DAY_STATUS_STYLES[cell.status]}`,
                  title: cell.status === "today" ? "Editable today" : void 0,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-medium opacity-70 flex items-center gap-0.5", children: [
                      "D",
                      cell.dayNum,
                      cell.status === "today" && /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 7, className: "opacity-70" })
                    ] }),
                    cell.status === "today" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: 0,
                        value: inputValue,
                        onChange: handleInputChange,
                        onClick: (e) => e.currentTarget.select(),
                        className: "w-full text-center font-mono text-[11px] font-bold bg-transparent border-0 border-b border-current/40 outline-none p-0 leading-none text-current [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        "aria-label": "Today's questions solved"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] font-bold leading-none", children: cell.status === "future" ? "—" : cell.count }),
                    cell.status !== "future" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full mt-1 h-0.5 rounded-full bg-current/20 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full bg-current",
                        style: {
                          width: `${Math.min((cell.status === "today" ? Number(inputValue) || 0 : cell.count) / DAILY_TARGET * 100, 100)}%`
                        }
                      }
                    ) }),
                    cell.status === "complete" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleCheck,
                      {
                        size: 8,
                        className: "text-emerald-400 absolute top-1 right-1"
                      }
                    )
                  ]
                },
                cell.key
              )) }) }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.35 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 15, className: "text-primary" }),
                "Weekly Breakdown"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border hover:bg-transparent", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-medium pl-4", children: "Week" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-medium", children: "Days" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-medium", children: "Target" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-medium", children: "Solved" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-medium pr-4", children: "Status" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: weeks.map((week) => {
                  const stats = getWeekStats(week.startDay, week.endDay);
                  const weekDaysElapsed = Math.max(
                    0,
                    Math.min(
                      week.endDay - week.startDay + 1,
                      Math.max(0, daysElapsed - week.startDay)
                    )
                  );
                  const expectedSoFar = weekDaysElapsed * DAILY_TARGET;
                  let statusLabel = "Upcoming";
                  let statusClass = "text-muted-foreground border-border";
                  if (weekDaysElapsed > 0) {
                    if (stats.solved >= stats.target) {
                      statusLabel = "Ahead";
                      statusClass = "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
                    } else if (stats.solved >= expectedSoFar) {
                      statusLabel = "On Track";
                      statusClass = "text-blue-400 border-blue-500/40 bg-blue-500/10";
                    } else {
                      statusLabel = "Behind";
                      statusClass = "text-destructive border-destructive/40 bg-destructive/10";
                    }
                  }
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TableRow,
                    {
                      className: "border-border hover:bg-muted/10",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-display font-semibold text-sm text-foreground pl-4", children: week.label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-xs text-muted-foreground", children: [
                          "D",
                          week.startDay + 1,
                          "–D",
                          week.endDay + 1
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-foreground", children: stats.target.toLocaleString() }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-foreground", children: stats.solved.toLocaleString() }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 rounded-full bg-muted overflow-hidden min-w-[40px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "h-full rounded-full bg-primary/70",
                              style: {
                                width: `${Math.min(stats.solved / stats.target * 100, 100)}%`
                              }
                            }
                          ) })
                        ] }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "outline",
                            className: `text-[10px] font-semibold ${statusClass}`,
                            children: statusLabel
                          }
                        ) })
                      ]
                    },
                    week.label
                  );
                }) })
              ] }) })
            ] })
          }
        )
      ]
    }
  );
}
const Q_TIMER_KEY = "ssc_questions_timer_state";
const Q_SECTION_TIME_PREFIX = "ssc_section_time_questions_";
const Q_CYCLE_KEY = "ssc_cycle_start_questions";
function loadQTimerState() {
  try {
    const s = localStorage.getItem(Q_TIMER_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}
function getQSectionTimeToday() {
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const key = Q_SECTION_TIME_PREFIX + today;
  return Number(localStorage.getItem(key) ?? 0);
}
function addQSectionTimeToday(secs) {
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const key = Q_SECTION_TIME_PREFIX + today;
  const current = Number(localStorage.getItem(key) ?? 0);
  localStorage.setItem(key, String(current + secs));
}
function daysDiffQ(from, to) {
  const a = new Date(from);
  const b = new Date(to);
  return Math.floor((b.getTime() - a.getTime()) / (1e3 * 60 * 60 * 24));
}
const DAILY_Q_PREFIX = "ssc_daily_q_";
function getDailyQKey(subjectName, date) {
  return `${DAILY_Q_PREFIX}${subjectName}_${date}`;
}
function getTodayQCount(subjectName, today) {
  const key = getDailyQKey(subjectName, today);
  const val = localStorage.getItem(key);
  return val !== null ? Number(val) : 0;
}
function setTodayQCount(subjectName, today, count) {
  const key = getDailyQKey(subjectName, today);
  localStorage.setItem(key, String(count));
}
const SUBJECT_HEX_COLORS_Q = {
  Maths: "#e11d48",
  English: "#3b82f6",
  Reasoning: "#a855f7",
  "General Knowledge": "#f59e0b",
  "Current Affairs": "#10b981",
  Computer: "#06b6d4",
  Science: "#22c55e"
};
const SUBJECT_DISPLAY = {
  Maths: {
    color: "text-primary bg-primary/10 border-primary/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14 })
  },
  English: {
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 14 })
  },
  Reasoning: {
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14 })
  },
  "General Knowledge": {
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 14 })
  },
  "Current Affairs": {
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 14 })
  },
  Computer: {
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14 })
  },
  Science: {
    color: "text-green-400 bg-green-500/10 border-green-500/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14 })
  }
};
const MILESTONE_LABELS = [
  { pct: 0.11, label: "1K Hustler", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 14 }) },
  { pct: 0.28, label: "2.5K Warrior", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14 }) },
  { pct: 0.56, label: "Champion", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 14 }) },
  { pct: 0.83, label: "Legend", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 14 }) },
  { pct: 1, label: "Master", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 14 }) }
];
function getMotivationalMessage(total, goal) {
  const pct = total / goal * 100;
  if (pct === 0)
    return `Begin your ${goal.toLocaleString()} questions journey today. Every question counts!`;
  if (pct < 10)
    return "Great start! The first step is always the hardest. Keep going!";
  if (pct < 25) return "You're building momentum! Stay consistent every day.";
  if (pct < 50)
    return "You're a quarter of the way there. The grind is paying off!";
  if (pct < 60)
    return "Halfway there! You're in the top percentile of serious aspirants.";
  if (pct < 75)
    return "More than halfway done! The finish line is visible now.";
  if (pct < 90) return "Almost there! Final push — don't slow down now!";
  if (pct < 100)
    return `So close to ${goal.toLocaleString()}! Give it everything you have!`;
  return `🏆 All ${goal.toLocaleString()} questions completed! You're ready to crack SSC CGL!`;
}
function CircularProgressBig({ total, goal }) {
  const pct = Math.min(total / goal, 1);
  const size = 180;
  const strokeWidth = 14;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const cx = size / 2;
  const cy = size / 2;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex items-center justify-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: size,
        height: size,
        className: "rotate-[-90deg]",
        role: "img",
        "aria-label": `Questions progress: ${Math.round(total / goal * 100)}%`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx,
              cy,
              r,
              fill: "none",
              stroke: "oklch(var(--muted))",
              strokeWidth
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.circle,
            {
              cx,
              cy,
              r,
              fill: "none",
              stroke: "oklch(var(--primary))",
              strokeWidth,
              strokeLinecap: "round",
              strokeDasharray: circ,
              initial: { strokeDashoffset: circ },
              animate: { strokeDashoffset: offset },
              transition: { duration: 1.2, ease: "easeOut" }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.span,
        {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.5 },
          className: "font-display text-4xl font-bold text-foreground leading-none",
          children: total.toLocaleString()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground mt-1", children: [
        "of ",
        goal.toLocaleString()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-bold text-primary mt-0.5", children: [
        Math.round(total / goal * 100),
        "%"
      ] })
    ] })
  ] });
}
function QuestionsTab({
  onSectionTimerStart,
  onSectionTimerPause,
  onSectionTimerUpdate,
  onSyncPomodoro
}) {
  const { data: rawProgress = [], isLoading } = useGetQuestionProgress();
  const { data: targets } = useGetTargets();
  const { data: planCycles = [] } = useGetPlanCycles();
  const { data: customSubjects = [] } = useGetCustomSubjects();
  const setQuestionCount = useSetQuestionCount();
  const savePlanCycleMutation = useSavePlanCycle();
  const saveSectionTimeLog = useSaveSectionTimeLog();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const [cycleStart, setCycleStart] = reactExports.useState(() => {
    return localStorage.getItem(Q_CYCLE_KEY) ?? today;
  });
  const [historyOpen, setHistoryOpen] = reactExports.useState(false);
  const [showClearConfirm, setShowClearConfirm] = reactExports.useState(false);
  const savePlanCycleMutateRef = reactExports.useRef(savePlanCycleMutation.mutate);
  savePlanCycleMutateRef.current = savePlanCycleMutation.mutate;
  const saveSectionTimeLogMutateRef = reactExports.useRef(saveSectionTimeLog.mutate);
  saveSectionTimeLogMutateRef.current = saveSectionTimeLog.mutate;
  const dayOfCycle = Math.min(daysDiffQ(cycleStart, today) + 1, 30);
  reactExports.useEffect(() => {
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const savedCycleStart = localStorage.getItem(Q_CYCLE_KEY);
    if (!savedCycleStart) {
      localStorage.setItem(Q_CYCLE_KEY, todayStr);
      setCycleStart(todayStr);
    } else {
      const diff = daysDiffQ(savedCycleStart, todayStr);
      if (diff >= 30) {
        savePlanCycleMutateRef.current({
          section: "questions",
          startDate: savedCycleStart,
          endDate: todayStr,
          summary: diff
        });
        localStorage.setItem(Q_CYCLE_KEY, todayStr);
        setCycleStart(todayStr);
      }
    }
  }, []);
  const questionCycles = planCycles.filter((c) => c.section === "questions");
  const TOTAL_GOAL = Number((targets == null ? void 0 : targets.totalQuestionsGoal) ?? 9e3);
  const subjectTargetsRef = reactExports.useRef(targets == null ? void 0 : targets.subjectTargets);
  subjectTargetsRef.current = targets == null ? void 0 : targets.subjectTargets;
  const subjectTargetsKey = ((targets == null ? void 0 : targets.subjectTargets) ?? []).map((s) => `${s.name}:${s.target}`).join(",");
  const SUBJECT_TARGETS = reactExports.useMemo(() => {
    const subjectTargets = subjectTargetsRef.current ?? [];
    return subjectTargets.map((s) => ({
      name: s.name,
      target: Number(s.target),
      isCustom: false,
      ...SUBJECT_DISPLAY[s.name] ?? {
        color: "text-foreground bg-muted/20 border-border",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14 })
      }
    }));
  }, [subjectTargetsKey]);
  const defaultSubjectNames = reactExports.useMemo(
    () => new Set(SUBJECT_TARGETS.map((s) => s.name)),
    [SUBJECT_TARGETS]
  );
  const allSubjects = reactExports.useMemo(() => {
    const extra = customSubjects.filter((name) => !defaultSubjectNames.has(name)).map((name) => ({
      name,
      target: 0,
      isCustom: true,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14 })
    }));
    return [...SUBJECT_TARGETS, ...extra];
  }, [SUBJECT_TARGETS, customSubjects, defaultSubjectNames]);
  const MILESTONES = reactExports.useMemo(() => {
    return MILESTONE_LABELS.map((m) => ({
      count: Math.round(TOTAL_GOAL * m.pct),
      label: m.label,
      icon: m.icon
    }));
  }, [TOTAL_GOAL]);
  const [subject, setSubject] = reactExports.useState("");
  const [countInput, setCountInput] = reactExports.useState("");
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const debounceRef = reactExports.useRef(null);
  const savedTimerRef = reactExports.useRef(null);
  const [perQTimeSecs, setPerQTimeSecs] = reactExports.useState(() => {
    const s = localStorage.getItem("ssc_per_q_time");
    return s ? Number(s) : 60;
  });
  const savePerQTime = (secs) => {
    setPerQTimeSecs(secs);
    localStorage.setItem("ssc_per_q_time", String(secs));
  };
  const PER_Q_PRESETS = [
    { label: "10s", secs: 10 },
    { label: "30s", secs: 30 },
    { label: "1m", secs: 60 },
    { label: "2m", secs: 120 },
    { label: "3m", secs: 180 },
    { label: "5m", secs: 300 }
  ];
  const [qTimerSecs, setQTimerSecs] = reactExports.useState(0);
  const [qTimerRunning, setQTimerRunning] = reactExports.useState(false);
  const [qTimerInitial, setQTimerInitial] = reactExports.useState(0);
  const qTimerIntervalRef = reactExports.useRef(null);
  const qElapsedRef = reactExports.useRef(0);
  const qStartedAtRef = reactExports.useRef(null);
  const qBaseSecsRef = reactExports.useRef(0);
  const qElapsedStartRef = reactExports.useRef(null);
  const qElapsedBaseRef = reactExports.useRef(0);
  const qLastSectionWrittenRef = reactExports.useRef(0);
  const qCurrentSecsRef = reactExports.useRef(0);
  const isQRestoringRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const saved = loadQTimerState();
    if ((saved == null ? void 0 : saved.subject) && saved.timerInitial > 0) {
      isQRestoringRef.current = true;
      const wallElapsed = Math.floor((Date.now() - saved.savedAt) / 1e3);
      const restored = saved.running ? Math.max(0, saved.timerSecs - wallElapsed) : saved.timerSecs;
      const restoredElapsed = saved.running ? saved.elapsedSecs + wallElapsed : saved.elapsedSecs;
      setSubject(saved.subject);
      setCountInput(saved.countInput);
      setQTimerSecs(restored);
      setQTimerInitial(saved.timerInitial);
      qBaseSecsRef.current = restored;
      qElapsedRef.current = restoredElapsed;
      qElapsedBaseRef.current = restoredElapsed;
      if (saved.running && restored > 0) {
        setQTimerRunning(true);
      }
      setTimeout(() => {
        isQRestoringRef.current = false;
      }, 0);
    }
  }, []);
  const saveQTimerState = reactExports.useCallback(
    (sub, cnt, secs, initial, running, elapsed) => {
      const state = {
        subject: sub,
        countInput: cnt,
        timerSecs: secs,
        timerInitial: initial,
        running,
        savedAt: Date.now(),
        elapsedSecs: elapsed
      };
      localStorage.setItem(Q_TIMER_KEY, JSON.stringify(state));
    },
    []
  );
  const isFirstQMount = reactExports.useRef(true);
  reactExports.useEffect(() => {
    if (isFirstQMount.current) {
      isFirstQMount.current = false;
      return;
    }
    if (isQRestoringRef.current) {
      return;
    }
    setQTimerRunning(false);
    if (qTimerIntervalRef.current) clearInterval(qTimerIntervalRef.current);
    qStartedAtRef.current = null;
    qElapsedStartRef.current = null;
    qElapsedBaseRef.current = 0;
    qElapsedRef.current = 0;
    qLastSectionWrittenRef.current = 0;
    const n = Number.parseInt(countInput, 10);
    if (subject && !Number.isNaN(n) && n > 0) {
      const secs = n * perQTimeSecs;
      setQTimerSecs(secs);
      setQTimerInitial(secs);
      qBaseSecsRef.current = secs;
      saveQTimerState(subject, countInput, secs, secs, false, 0);
    } else {
      setQTimerSecs(0);
      setQTimerInitial(0);
      qBaseSecsRef.current = 0;
    }
  }, [subject, countInput, perQTimeSecs, saveQTimerState]);
  const saveQTimerStateRef = reactExports.useRef(saveQTimerState);
  saveQTimerStateRef.current = saveQTimerState;
  const subjectRef = reactExports.useRef(subject);
  subjectRef.current = subject;
  const countInputRef = reactExports.useRef(countInput);
  countInputRef.current = countInput;
  const qTimerInitialRef = reactExports.useRef(qTimerInitial);
  qTimerInitialRef.current = qTimerInitial;
  const onSectionTimerPauseRef = reactExports.useRef(onSectionTimerPause);
  onSectionTimerPauseRef.current = onSectionTimerPause;
  const onSectionTimerUpdateRef = reactExports.useRef(onSectionTimerUpdate);
  onSectionTimerUpdateRef.current = onSectionTimerUpdate;
  reactExports.useEffect(() => {
    if (qTimerRunning) {
      if (qStartedAtRef.current === null) {
        qStartedAtRef.current = Date.now();
      }
      if (qElapsedStartRef.current === null) {
        qElapsedStartRef.current = Date.now();
      }
      qTimerIntervalRef.current = setInterval(() => {
        var _a, _b;
        const now = Date.now();
        if (qStartedAtRef.current !== null) {
          const spElapsed = Math.floor((now - qStartedAtRef.current) / 1e3);
          const newSecs = Math.max(0, qBaseSecsRef.current - spElapsed);
          qCurrentSecsRef.current = newSecs;
          setQTimerSecs(newSecs);
          if (qElapsedStartRef.current !== null) {
            const elapsedDelta = Math.floor(
              (now - qElapsedStartRef.current) / 1e3
            );
            const totalElapsed = qElapsedBaseRef.current + elapsedDelta;
            qElapsedRef.current = totalElapsed;
            const newSectionSecs = totalElapsed - qLastSectionWrittenRef.current;
            if (newSectionSecs > 0) {
              addQSectionTimeToday(newSectionSecs);
              qLastSectionWrittenRef.current = totalElapsed;
            }
          }
          (_a = onSectionTimerUpdateRef.current) == null ? void 0 : _a.call(onSectionTimerUpdateRef, subjectRef.current, newSecs, true);
          saveQTimerStateRef.current(
            subjectRef.current,
            countInputRef.current,
            newSecs,
            qTimerInitialRef.current,
            newSecs > 0,
            qElapsedRef.current
          );
          if (newSecs <= 0) {
            setQTimerRunning(false);
            ue.success("Question session complete!");
            (_b = onSectionTimerPauseRef.current) == null ? void 0 : _b.call(onSectionTimerPauseRef);
          }
        }
      }, 200);
    } else {
      if (qTimerIntervalRef.current) clearInterval(qTimerIntervalRef.current);
      qStartedAtRef.current = null;
      if (qElapsedStartRef.current !== null) {
        const elapsedDelta = Math.floor(
          (Date.now() - qElapsedStartRef.current) / 1e3
        );
        const totalElapsed = qElapsedBaseRef.current + elapsedDelta;
        qElapsedBaseRef.current = totalElapsed;
        qElapsedRef.current = totalElapsed;
        qElapsedStartRef.current = null;
        const newSectionSecs = totalElapsed - qLastSectionWrittenRef.current;
        if (newSectionSecs > 0) {
          addQSectionTimeToday(newSectionSecs);
          qLastSectionWrittenRef.current = totalElapsed;
        }
      }
      qBaseSecsRef.current = qCurrentSecsRef.current;
      saveQTimerStateRef.current(
        subjectRef.current,
        countInputRef.current,
        qCurrentSecsRef.current,
        qTimerInitialRef.current,
        false,
        qElapsedRef.current
      );
    }
    return () => {
      if (qTimerIntervalRef.current) clearInterval(qTimerIntervalRef.current);
    };
  }, [qTimerRunning]);
  reactExports.useEffect(() => {
    return () => {
      const elapsed = getQSectionTimeToday();
      if (elapsed > 0) {
        saveSectionTimeLogMutateRef.current({
          section: "questions",
          date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          elapsedSeconds: elapsed
        });
      }
    };
  }, []);
  const qTimerMins = Math.floor(qTimerSecs / 60);
  const qTimerRemSecs = qTimerSecs % 60;
  const showQTimer = subject !== "" && Number.parseInt(countInput, 10) > 0 && qTimerInitial > 0;
  const progressMap = {};
  for (const p of rawProgress) {
    progressMap[p.subjectName] = Number(p.count);
  }
  const progressMapRef = reactExports.useRef(progressMap);
  progressMapRef.current = progressMap;
  const totalSolved = rawProgress.reduce(
    (a, p) => a + Number(p.count),
    0
  );
  const totalPct = Math.min(totalSolved / TOTAL_GOAL * 100, 100);
  const triggerSave = reactExports.useCallback(
    (subj, countStr) => {
      const n = Number.parseInt(countStr, 10);
      if (!subj || Number.isNaN(n) || n < 0 || n > 99999) return;
      setSaveStatus("saving");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      setTodayQCount(subj, todayStr, n);
      setTodayQCounts((prev) => ({ ...prev, [subj]: n }));
      setQuestionCount.mutate(
        { subjectName: subj, count: n },
        {
          onSuccess: () => {
            setSaveStatus("saved");
            savedTimerRef.current = setTimeout(
              () => setSaveStatus("idle"),
              3e3
            );
          },
          onError: (err) => {
            setSaveStatus("idle");
            const msg = err instanceof Error ? err.message : String(err);
            if (!msg || msg.includes("actor") || msg.includes("null")) {
              ue.error(
                "Session expired. Please refresh the page to log in again."
              );
            } else {
              ue.error(
                `Failed to save questions: ${msg}. Please try again.`
              );
            }
          }
        }
      );
    },
    [setQuestionCount]
  );
  const handleSubjectChange = reactExports.useCallback((val) => {
    setSubject(val);
    setCountInput("");
  }, []);
  const handleCountChange = reactExports.useCallback(
    (e) => {
      const val = e.target.value;
      setCountInput(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (subject) triggerSave(subject, val);
      }, 600);
    },
    [subject, triggerSave]
  );
  reactExports.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);
  const [progressChartOpen, setProgressChartOpen] = reactExports.useState(false);
  const [chartSelectedDate, setChartSelectedDate] = reactExports.useState(today);
  const [showStylePanel, setShowStylePanel] = reactExports.useState(false);
  const styleBtnRef = reactExports.useRef(null);
  const { style: sectionStyle } = useSectionStyle("questions");
  const [todayQCounts, setTodayQCounts] = reactExports.useState(
    () => {
      const result = {};
      return result;
    }
  );
  const allSubjectsRef = reactExports.useRef(allSubjects);
  allSubjectsRef.current = allSubjects;
  const allSubjectNamesKey = allSubjects.map((s) => s.name).join(",");
  reactExports.useEffect(() => {
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const result = {};
    for (const s of allSubjectsRef.current) {
      result[s.name] = getTodayQCount(s.name, todayStr);
    }
    setTodayQCounts((prev) => {
      const keys = Object.keys(result);
      const prevKeys = Object.keys(prev);
      if (keys.length !== prevKeys.length) return result;
      for (const k of keys) {
        if (prev[k] !== result[k]) return result;
      }
      return prev;
    });
  }, [allSubjectNamesKey]);
  const rawProgressRef = reactExports.useRef(rawProgress);
  rawProgressRef.current = rawProgress;
  reactExports.useEffect(() => {
    const backendData = rawProgressRef.current;
    if (!backendData || backendData.length === 0) return;
    setTodayQCounts((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const p of backendData) {
        const n = Number(p.count);
        if (next[p.subjectName] !== n) {
          next[p.subjectName] = n;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [rawProgress.length]);
  const todayTotalQ = reactExports.useMemo(() => {
    return Object.values(todayQCounts).reduce((a, b) => a + b, 0);
  }, [todayQCounts]);
  const questionChartData = reactExports.useMemo(() => {
    return allSubjects.map((s) => ({
      name: s.name,
      value: progressMapRef.current[s.name] ?? 0
    })).filter((e) => e.value > 0);
  }, [allSubjects]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl mx-auto", style: sectionStyle, children: [
    showStylePanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionStylePanel,
      {
        sectionId: "questions",
        sectionLabel: "Questions",
        onClose: () => setShowStylePanel(false),
        anchorRef: styleBtnRef
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        className: "mb-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 16, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-2xl font-bold text-foreground", children: [
              TOTAL_GOAL.toLocaleString(),
              " Questions Challenge"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-500/15 text-blue-400 border-blue-500/30 text-xs font-mono", children: [
              "Day ",
              dayOfCycle,
              " / 30"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  ref: styleBtnRef,
                  size: "sm",
                  variant: "outline",
                  className: "h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50",
                  onClick: () => setShowStylePanel((p) => !p),
                  title: "Customize section style",
                  "data-ocid": "questions.style.button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 13 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50",
                  onClick: () => setProgressChartOpen(true),
                  title: "View progress charts",
                  "data-ocid": "questions.progress.button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 13 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "h-7 text-xs gap-1 border-border text-muted-foreground hover:text-foreground",
                  onClick: () => setHistoryOpen(true),
                  title: "View previous 30-day cycles",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 12 }),
                    "History"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TargetsPanel, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                AlertDialog,
                {
                  open: showClearConfirm,
                  onOpenChange: setShowClearConfirm,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        className: "h-7 px-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10",
                        title: "Clear today's questions",
                        "data-ocid": "questions.clear.open_modal_button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eraser, { size: 13 })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "questions.clear.dialog", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Clear today's questions?" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will reset all question counts for today. This cannot be undone." })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "questions.clear.cancel_button", children: "Cancel" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          AlertDialogAction,
                          {
                            onClick: () => {
                              const today2 = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
                              localStorage.removeItem(`ssc_qcounts_${today2}`);
                              ue.success("Today's questions cleared");
                            },
                            className: "bg-amber-500 hover:bg-amber-600 text-white",
                            "data-ocid": "questions.clear.confirm_button",
                            children: "Clear"
                          }
                        )
                      ] })
                    ] })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground ml-11", children: [
            "Solve ",
            TOTAL_GOAL.toLocaleString(),
            " targeted questions across all SSC CGL subjects"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.97 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: 0.05 },
        className: "mb-6",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: `border overflow-hidden ${totalSolved >= TOTAL_GOAL ? "border-primary/40 bg-primary/5" : "border-border"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgressBig, { total: totalSolved, goal: TOTAL_GOAL }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground", children: "Overall Progress" }),
                  totalSolved >= TOTAL_GOAL && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/15 text-primary border-primary/30 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 10, className: "mr-1" }),
                    "Completed!"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Progress,
                  {
                    value: totalPct,
                    className: "h-3 bg-muted mb-4 rounded-full"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-lg bg-muted/40 border border-border mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90 leading-relaxed", children: getMotivationalMessage(totalSolved, TOTAL_GOAL) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2.5 rounded-lg bg-muted/40", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold text-primary leading-none", children: totalSolved.toLocaleString() }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Solved" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2.5 rounded-lg bg-muted/40", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold text-foreground leading-none", children: (TOTAL_GOAL - totalSolved).toLocaleString() }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Remaining" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2.5 rounded-lg bg-muted/40", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg font-bold text-foreground leading-none", children: [
                      Math.round(totalPct),
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Complete" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 13, className: "text-emerald-400 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-emerald-400 font-semibold", children: "Today:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs font-bold text-emerald-300", children: [
                    todayTotalQ.toLocaleString(),
                    " questions"
                  ] }),
                  allSubjects.filter((s) => (todayQCounts[s.name] ?? 0) > 0).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground ml-auto", children: [
                    "across",
                    " ",
                    allSubjects.filter(
                      (s) => (todayQCounts[s.name] ?? 0) > 0
                    ).length,
                    " ",
                    "subject",
                    allSubjects.filter(
                      (s) => (todayQCounts[s.name] ?? 0) > 0
                    ).length !== 1 ? "s" : ""
                  ] })
                ] })
              ] })
            ] }) })
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 },
        className: "mb-6",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 16, className: "text-primary" }),
            "Milestones"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 overflow-x-auto pb-1", children: MILESTONES.map((m, i) => {
            const achieved = totalSolved >= m.count;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.8 },
                animate: { opacity: 1, scale: 1 },
                transition: { delay: 0.1 + i * 0.06 },
                className: `flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border shrink-0 min-w-[88px] transition-all ${achieved ? "bg-primary/15 border-primary/40" : "bg-muted/30 border-border opacity-50"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: achieved ? "text-primary" : "text-muted-foreground",
                      children: m.icon
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-foreground", children: m.count.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground text-center leading-tight", children: m.label }),
                  achieved && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 10, className: "text-primary" })
                ]
              },
              m.count
            );
          }) }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -12 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.15 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 16, className: "text-primary" }),
              "Log Questions (Today + 9000 Goal)",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto", children: [
                saveStatus === "saving" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground text-xs font-normal", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" }),
                  "Saving…"
                ] }),
                saveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-emerald-400 text-xs font-normal", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12 }),
                  "Saved"
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-medium gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
                (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short"
                }),
                " ",
                "· Editable all day"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Subject" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: subject, onValueChange: handleSubjectChange, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-muted/40 border-input focus:border-primary/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select subject..." }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: allSubjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.name, children: [
                    s.name,
                    s.isCustom ? " (custom)" : s.target > 0 ? ` (${s.target.toLocaleString()} target)` : ""
                  ] }, s.name)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: [
                  "Set Total Count",
                  subject ? ` for ${subject}` : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 0,
                    placeholder: "Enter total count (e.g. 350)",
                    value: countInput,
                    onChange: handleCountChange,
                    className: "bg-muted/40 border-input focus:border-primary/50 font-mono"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                  "This sets the ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "total" }),
                  " question count for this subject (overwrites previous value)."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-3 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { size: 12, className: "text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Per-Question Time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs font-mono text-primary font-bold", children: perQTimeSecs < 60 ? `${perQTimeSecs}s` : `${Math.floor(perQTimeSecs / 60)}m ${perQTimeSecs % 60 > 0 ? `${perQTimeSecs % 60}s` : ""}` })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: PER_Q_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => savePerQTime(p.secs),
                    className: `px-2 py-1 rounded text-[10px] font-semibold border transition-all ${perQTimeSecs === p.secs ? "bg-primary/20 border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/30"}`,
                    children: p.label
                  },
                  p.secs
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "10s" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "range",
                      min: 10,
                      max: 300,
                      step: 5,
                      value: perQTimeSecs,
                      onChange: (e) => savePerQTime(Number(e.target.value)),
                      className: "flex-1 h-1.5 accent-primary cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "5m" })
                ] })
              ] }),
              showQTimer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 p-3 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { size: 13, className: "text-primary shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Session Timer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto font-mono text-xl font-bold text-primary tabular-nums", children: [
                    String(qTimerMins).padStart(2, "0"),
                    ":",
                    String(qTimerRemSecs).padStart(2, "0")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                  perQTimeSecs < 60 ? `${perQTimeSecs}s` : `${Math.floor(perQTimeSecs / 60)}m`,
                  "/question · ",
                  Number.parseInt(countInput, 10),
                  " questions · at",
                  " ",
                  perQTimeSecs < 60 ? `${perQTimeSecs}s` : `${Math.floor(perQTimeSecs / 60)}m`,
                  "/question"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "h-full bg-primary rounded-full",
                    animate: {
                      width: `${(qTimerInitial - qTimerSecs) / qTimerInitial * 100}%`
                    },
                    transition: { duration: 0.5 }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "flex-1 h-7 text-xs gap-1",
                      onClick: () => {
                        setQTimerRunning((r) => {
                          const next = !r;
                          if (next) {
                            onSectionTimerStart == null ? void 0 : onSectionTimerStart(subject, qTimerSecs);
                            onSyncPomodoro == null ? void 0 : onSyncPomodoro(qTimerInitial);
                          } else {
                            onSectionTimerPause == null ? void 0 : onSectionTimerPause();
                          }
                          return next;
                        });
                      },
                      children: qTimerRunning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 11 }),
                        "Pause"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 11 }),
                        qTimerSecs === qTimerInitial ? "Start" : "Resume"
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "h-7 text-xs px-2 text-muted-foreground",
                      onClick: () => {
                        setQTimerRunning(false);
                        onSectionTimerPause == null ? void 0 : onSectionTimerPause();
                        setQTimerSecs(qTimerInitial);
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 11 })
                    }
                  )
                ] })
              ] })
            ] }) })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 12 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.2 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 16, className: "text-primary" }),
              "Subject Breakdown"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-muted" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: allSubjects.map((sub, i) => {
                const solved = progressMap[sub.name] ?? 0;
                const pct = sub.target > 0 ? Math.min(solved / sub.target * 100, 100) : 0;
                const done = sub.target > 0 && solved >= sub.target;
                const todayCount = todayQCounts[sub.name] ?? 0;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 6 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.2 + i * 0.05 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: `flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border ${sub.color}`,
                              children: [
                                sub.icon,
                                sub.name,
                                sub.isCustom && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] opacity-70 ml-0.5", children: "custom" })
                              ]
                            }
                          ),
                          done && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            CircleCheck,
                            {
                              size: 12,
                              className: "text-primary"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-foreground", children: solved.toLocaleString() }),
                          sub.target > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                            "/",
                            sub.target.toLocaleString()
                          ] })
                        ] })
                      ] }),
                      sub.target > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.div,
                        {
                          initial: { width: 0 },
                          animate: { width: `${pct}%` },
                          transition: {
                            duration: 0.6,
                            delay: 0.25 + i * 0.05,
                            ease: "easeOut"
                          },
                          className: `h-full rounded-full ${done ? "bg-primary" : "bg-primary/60"}`
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-0.5", children: [
                        sub.target > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                          Math.round(pct),
                          "%"
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                        todayCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-emerald-400 font-medium", children: [
                          "Today: ",
                          todayCount.toLocaleString()
                        ] })
                      ] })
                    ]
                  },
                  sub.name
                );
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 border-t border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Total Progress" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-primary", children: totalSolved.toLocaleString() }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                      "/",
                      TOTAL_GOAL.toLocaleString()
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Progress,
                  {
                    value: totalPct,
                    className: "h-2 bg-muted rounded-full"
                  }
                )
              ] })
            ] }) })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlyPlanSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ".",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "hover:text-primary transition-colors",
          children: "Built with love using caffeine.ai"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: progressChartOpen, onOpenChange: setProgressChartOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl bg-card border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 16, className: "text-primary" }),
        "Questions Progress Charts"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Reference Date:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              value: chartSelectedDate,
              max: today,
              onChange: (e) => setChartSelectedDate(e.target.value),
              className: "h-8 px-2 text-sm rounded-md border border-input bg-muted/40 text-foreground focus:outline-none focus:border-primary/50"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "(Shows cumulative totals)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold text-foreground mb-3 font-display", children: "Subject-Wise Totals (Today)" }),
            questionChartData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-44 text-muted-foreground/50 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 28, className: "opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No questions logged yet" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Pie,
                {
                  data: questionChartData,
                  cx: "50%",
                  cy: "50%",
                  innerRadius: 45,
                  outerRadius: 70,
                  paddingAngle: 2,
                  dataKey: "value",
                  children: questionChartData.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Cell,
                    {
                      fill: SUBJECT_HEX_COLORS_Q[entry.name] ?? `hsl(${idx * 60 % 360}, 60%, 55%)`
                    },
                    entry.name
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  formatter: (value) => [
                    value.toLocaleString(),
                    "questions"
                  ],
                  contentStyle: {
                    background: "oklch(0.18 0.01 20)",
                    border: "1px solid oklch(0.3 0.01 20)",
                    borderRadius: "8px",
                    fontSize: "11px"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Legend,
                {
                  iconType: "circle",
                  iconSize: 8,
                  wrapperStyle: { fontSize: "10px", paddingTop: "4px" },
                  formatter: (value) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.8 0.01 60)" }, children: value })
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xs font-bold text-foreground mb-3 font-display", children: [
              "Monthly Progress (",
              (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric"
              }),
              ")"
            ] }),
            questionChartData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-44 text-muted-foreground/50 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 28, className: "opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No questions logged this month" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Pie,
                {
                  data: questionChartData,
                  cx: "50%",
                  cy: "50%",
                  innerRadius: 45,
                  outerRadius: 70,
                  paddingAngle: 2,
                  dataKey: "value",
                  children: questionChartData.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Cell,
                    {
                      fill: SUBJECT_HEX_COLORS_Q[entry.name] ?? `hsl(${idx * 60 % 360}, 60%, 55%)`
                    },
                    entry.name
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  formatter: (value) => [
                    value.toLocaleString(),
                    "questions"
                  ],
                  contentStyle: {
                    background: "oklch(0.18 0.01 20)",
                    border: "1px solid oklch(0.3 0.01 20)",
                    borderRadius: "8px",
                    fontSize: "11px"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Legend,
                {
                  iconType: "circle",
                  iconSize: 8,
                  wrapperStyle: { fontSize: "10px", paddingTop: "4px" },
                  formatter: (value) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.8 0.01 60)" }, children: value })
                }
              )
            ] }) })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: historyOpen, onOpenChange: setHistoryOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg bg-card border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 16, className: "text-primary" }),
        "Previous 30-Day Question Cycles"
      ] }) }),
      questionCycles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "No archived cycles yet. Data will appear here after 30 days." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Start" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "End" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Days" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: questionCycles.map((cycle, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs", children: cycle.startDate }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs", children: cycle.endDate }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right font-mono text-xs text-primary font-bold", children: [
            Number(cycle.summary),
            "d"
          ] })
        ] }, `${cycle.startDate}-${i}`)) })
      ] }) })
    ] }) })
  ] });
}
export {
  QuestionsTab as default
};
