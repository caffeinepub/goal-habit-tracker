import { f as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, P as Palette, m as motion, a as BookOpen, e as Progress, aa as useDeleteSubject, ab as useToggleDay, O as TriangleAlert, U as Trash2, b as ue } from "./index-CkkKRQCz.js";
import { C as Card, c as CardContent } from "./card-CRESsubl.js";
import { S as Skeleton } from "./skeleton-D9TN-BzV.js";
import { u as useSectionStyle, S as SectionStylePanel } from "./SectionStylePanel-C0rTiG5h.js";
import { T as TrendingUp } from "./trending-up-m2t5YaDG.js";
import { A as AnimatePresence } from "./index-CNh01xf_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode);
const DAYS = 30;
const DEFAULT_SUBJECTS = [
  "Maths",
  "English",
  "Reasoning",
  "GK",
  "Current Affairs",
  "Computer",
  "Science"
];
function getTodayKey() {
  const d = /* @__PURE__ */ new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}
function readPerformanceData() {
  const dateKey = getTodayKey();
  let dailyStudyHoursTarget = 15;
  let questionsTarget = 300;
  try {
    const raw = localStorage.getItem("ssc_targets");
    if (raw) {
      const t = JSON.parse(raw);
      if (typeof t.dailyStudyHoursTarget === "number")
        dailyStudyHoursTarget = t.dailyStudyHoursTarget;
      if (typeof t.dailyQuestionsTarget === "number")
        questionsTarget = t.dailyQuestionsTarget;
      else if (typeof t.questionsTarget === "number")
        questionsTarget = t.questionsTarget;
    }
  } catch {
  }
  let studiedSecs = 0;
  try {
    const v = localStorage.getItem(`ssc_section_time_studyplan_${dateKey}`);
    if (v) studiedSecs = Number(v) || 0;
  } catch {
  }
  const studyTargetSecs = dailyStudyHoursTarget * 3600;
  const studyPct = clamp(
    studyTargetSecs > 0 ? studiedSecs / studyTargetSecs * 100 : 0
  );
  let customSubjects = [];
  try {
    const raw = localStorage.getItem("ssc_custom_subjects");
    if (raw) customSubjects = JSON.parse(raw);
  } catch {
  }
  const allSubjects = [...DEFAULT_SUBJECTS, ...customSubjects];
  let questionsSolved = 0;
  for (const subj of allSubjects) {
    try {
      const v = localStorage.getItem(`ssc_daily_q_${subj}_${dateKey}`);
      if (v) questionsSolved += Number(v) || 0;
    } catch {
    }
  }
  const questionsPct = clamp(
    questionsTarget > 0 ? questionsSolved / questionsTarget * 100 : 0
  );
  let routineTotal = 0;
  let routineDone = 0;
  try {
    const tasksRaw = localStorage.getItem(`ssc_routine_day_${dateKey}`);
    if (tasksRaw) {
      const tasks = JSON.parse(tasksRaw);
      routineTotal = Array.isArray(tasks) ? tasks.length : 0;
    }
  } catch {
  }
  try {
    const doneRaw = localStorage.getItem(`ssc_routine_done_${dateKey}`);
    if (doneRaw) {
      const done = JSON.parse(doneRaw);
      routineDone = Array.isArray(done) ? done.length : 0;
    }
  } catch {
  }
  const routinePct = clamp(
    routineTotal > 0 ? routineDone / routineTotal * 100 : 0
  );
  const overallPct = Math.round((studyPct + questionsPct + routinePct) / 3);
  return {
    studyPct: Math.round(studyPct),
    studiedSecs,
    studyTargetHours: dailyStudyHoursTarget,
    questionsPct: Math.round(questionsPct),
    questionsSolved,
    questionsTarget,
    routinePct: Math.round(routinePct),
    routineDone,
    routineTotal,
    overallPct
  };
}
function CircleProgress({ pct, size = 150 }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - pct / 100 * circ;
  const color = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size,
      className: "-rotate-90",
      role: "img",
      "aria-label": "Performance progress ring",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: size / 2,
            cy: size / 2,
            r,
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 10,
            className: "text-muted"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: size / 2,
            cy: size / 2,
            r,
            fill: "none",
            stroke: color,
            strokeWidth: 10,
            strokeLinecap: "round",
            strokeDasharray: circ,
            strokeDashoffset: offset,
            style: { transition: "stroke-dashoffset 0.6s ease" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "text",
          {
            x: size / 2,
            y: size / 2,
            textAnchor: "middle",
            dominantBaseline: "middle",
            className: "rotate-90",
            style: {
              transform: `rotate(90deg) translate(0px, ${-size / 2}px) translate(${size / 2}px, 0px)`,
              fill: color,
              fontSize: 28,
              fontWeight: 700,
              transformOrigin: `${size / 2}px ${size / 2}px`
            },
            children: [
              pct,
              "%"
            ]
          }
        )
      ]
    }
  );
}
function OverallPerformanceCard() {
  const [data, setData] = reactExports.useState(
    () => readPerformanceData()
  );
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      setData(readPerformanceData());
    }, 3e4);
    return () => clearInterval(id);
  }, []);
  const fmtTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor(secs % 3600 / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };
  const ringColor = data.overallPct >= 80 ? "text-green-500" : data.overallPct >= 50 ? "text-amber-500" : "text-red-500";
  const barColor = data.overallPct >= 80 ? "bg-green-500" : data.overallPct >= 50 ? "bg-amber-500" : "bg-red-500";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: 0.1 },
      className: "mb-6",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14, className: "text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Today's Overall Performance" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: ringColor, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleProgress, { pct: data.overallPct, size: 150 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Combined Score" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 w-full space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: "📚 Study Plan" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-foreground", children: [
                  data.studyPct,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: data.studyPct, className: "h-2 bg-muted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
                fmtTime(data.studiedSecs),
                " studied / ",
                data.studyTargetHours,
                "h target"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: "✏️ Questions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-foreground", children: [
                  data.questionsPct,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: data.questionsPct, className: "h-2 bg-muted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
                data.questionsSolved,
                " solved / ",
                data.questionsTarget,
                " target"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: "📋 Daily Routine" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-foreground", children: [
                  data.routinePct,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: data.routinePct, className: "h-2 bg-muted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
                data.routineDone,
                " done / ",
                data.routineTotal,
                " tasks"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Overall Average" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-sm font-bold ${ringColor}`, children: [
              data.overallPct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full rounded-full transition-all duration-700 ${barColor}`,
              style: { width: `${data.overallPct}%` }
            }
          ) })
        ] })
      ] }) })
    }
  );
}
function DashboardCard({
  overallCompletion,
  predictedScore,
  timetable
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-6 border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider", children: "Overall Completion" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-4xl font-bold text-foreground leading-none", children: overallCompletion }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg text-muted-foreground mb-0.5", children: "%" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              value: overallCompletion,
              className: "h-1.5 bg-muted mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider", children: "Predicted Score" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-4xl font-bold text-primary leading-none glow-red", children: predictedScore }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg text-muted-foreground mb-0.5", children: "/ 200" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Based on mock tests + consistency" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider", children: "Today's Plan" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground leading-relaxed", children: timetable }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "AI-generated schedule" })
        ] })
      ] }) }) })
    }
  );
}
function SubjectCard({ subject }) {
  const deleteSubject = useDeleteSubject();
  const toggleDay = useToggleDay();
  const completedCount = subject.days.filter(Boolean).length;
  const completionPct = Math.round(completedCount / DAYS * 100);
  const handleToggle = (index) => {
    toggleDay.mutate(
      { subjectId: subject.id, dayIndex: index },
      {
        onError: () => ue.error("Failed to update day")
      }
    );
  };
  const handleDelete = () => {
    deleteSubject.mutate(subject.id, {
      onSuccess: () => ue.success(`"${subject.name}" deleted`),
      onError: () => ue.error("Failed to delete subject")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.97 },
      transition: { duration: 0.25 },
      layout: true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: `border transition-all duration-200 ${subject.isWeak ? "weak-card" : "border-border hover:border-border/80"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 pr-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-base text-foreground truncate", children: subject.name }),
                  subject.isWeak && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/25 shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 9 }),
                    "WEAK"
                  ] })
                ] }),
                subject.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: subject.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-bold text-foreground", children: completionPct }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "%" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: handleDelete,
                    disabled: deleteSubject.isPending,
                    className: "h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: completionPct, className: "h-1 bg-muted mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-10 gap-1.5", children: subject.days.map((done, index) => {
              const dayKey = `${subject.id.toString()}-d${index}`;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  onClick: () => handleToggle(index),
                  disabled: toggleDay.isPending,
                  whileHover: { scale: 1.15 },
                  whileTap: { scale: 0.9 },
                  title: `Day ${index + 1}`,
                  "aria-label": `Day ${index + 1}: ${done ? "completed" : "not completed"}`,
                  className: `
                    w-full aspect-square rounded-sm cursor-pointer transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary
                    disabled:cursor-not-allowed
                    ${done ? "day-cell-active" : "day-cell-inactive hover:bg-muted"}
                  `
                },
                dayKey
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                completedCount,
                "/",
                DAYS,
                " days completed"
              ] }),
              subject.isWeak && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-primary font-medium", children: "Needs more attention" })
            ] })
          ] })
        }
      )
    }
  );
}
function LoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-40 bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-10 bg-muted" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-1 w-full bg-muted mb-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-10 gap-1.5", children: Array.from({ length: 30 }, (_, i2) => `sk-${i2}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Skeleton,
      {
        className: "aspect-square rounded-sm bg-muted"
      },
      k
    )) })
  ] }) }, i)) });
}
function HomeTab({
  subjects,
  search,
  isLoading,
  overallCompletion,
  predictedScore,
  timetable
}) {
  const filtered = subjects.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase())
  );
  const [showStylePanel, setShowStylePanel] = reactExports.useState(false);
  const styleBtnRef = reactExports.useRef(null);
  const { style: sectionStyle } = useSectionStyle("home");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl mx-auto", style: sectionStyle, children: [
    showStylePanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionStylePanel,
      {
        sectionId: "home",
        sectionLabel: "Dashboard",
        onClose: () => setShowStylePanel(false),
        anchorRef: styleBtnRef
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Track your 30-day study progress" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          ref: styleBtnRef,
          size: "sm",
          variant: "outline",
          className: "h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50 shrink-0",
          onClick: () => setShowStylePanel((p) => !p),
          title: "Customize section style",
          "data-ocid": "home.style.button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 13 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DashboardCard,
      {
        overallCompletion,
        predictedScore,
        timetable
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OverallPerformanceCard, {}),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, {}) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "flex flex-col items-center justify-center py-20 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 24, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: search ? "No subjects found" : "No subjects yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: search ? `No subjects match "${search}"` : "Add your first subject from the sidebar to start tracking." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filtered.map((subject) => /* @__PURE__ */ jsxRuntimeExports.jsx(SubjectCard, { subject }, subject.id.toString())) }) })
  ] });
}
export {
  HomeTab as default
};
