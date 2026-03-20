import { r as reactExports, j as jsxRuntimeExports, m as motion, al as Bell, B as Button, Z as X, x as CalendarDays, U as Clock, a as BookOpen, am as Switch, S as Trash2 } from "./index-BsN7n755.js";
import { S as Settings } from "./settings-B0puVVKD.js";
import { C as CircleCheck } from "./circle-check-Cd1SZGCk.js";
const PREFS_KEY = "ssc_notif_prefs";
const DISMISSED_KEY = "ssc_notif_dismissed";
function loadPrefs() {
  try {
    const s = localStorage.getItem(PREFS_KEY);
    return s ? JSON.parse(s) : { routine: true, study: true, questions: true };
  } catch {
    return { routine: true, study: true, questions: true };
  }
}
function savePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}
function loadDismissed() {
  try {
    const s = localStorage.getItem(DISMISSED_KEY);
    return new Set(s ? JSON.parse(s) : []);
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function saveDismissed(dismissed) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...dismissed]));
}
function generateNotifications(prefs) {
  const notifs = [];
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const now = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });
  if (prefs.routine) {
    try {
      const routineKey = `ssc_routine_day_${today}`;
      const doneKey = `ssc_routine_done_${today}`;
      const rows = JSON.parse(localStorage.getItem(routineKey) ?? "[]");
      const done = new Set(
        JSON.parse(localStorage.getItem(doneKey) ?? "[]")
      );
      const incomplete = rows.filter((r) => !done.has(r.id)).length;
      if (rows.length > 0 && incomplete > 0) {
        notifs.push({
          id: "routine-today",
          type: "routine",
          title: "Daily Routine",
          message: `You have ${incomplete} incomplete task${incomplete !== 1 ? "s" : ""} today (${done.size}/${rows.length} done)`,
          timestamp: now,
          read: false
        });
      } else if (rows.length > 0 && incomplete === 0) {
        notifs.push({
          id: "routine-done",
          type: "routine",
          title: "Daily Routine ✓",
          message: `All ${rows.length} tasks completed for today! Great work!`,
          timestamp: now,
          read: false
        });
      } else {
        notifs.push({
          id: "routine-empty",
          type: "routine",
          title: "Daily Routine",
          message: "No routine scheduled for today. Add tasks to stay on track.",
          timestamp: now,
          read: false
        });
      }
    } catch {
    }
  }
  if (prefs.study) {
    try {
      const sessions = JSON.parse(
        localStorage.getItem("ssc_study_sessions") ?? "[]"
      );
      const todayHours = sessions.filter((s) => s.date === today).reduce((a, b) => a + b.hours, 0);
      const targetsRaw = JSON.parse(
        localStorage.getItem("ssc_targets") ?? "{}"
      );
      const target = (targetsRaw == null ? void 0 : targetsRaw.dailyStudyHoursTarget) ?? 15;
      const remaining = Math.max(target - todayHours, 0);
      if (todayHours >= target) {
        notifs.push({
          id: "study-done",
          type: "study",
          title: "Study Goal Achieved! 🎉",
          message: `You've studied ${todayHours.toFixed(1)}h today — daily goal of ${target}h met!`,
          timestamp: now,
          read: false
        });
      } else {
        const h = Math.floor(remaining);
        const m = Math.round((remaining - h) * 60);
        notifs.push({
          id: "study-remaining",
          type: "study",
          title: "Study Plan",
          message: `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}m ` : ""}more study needed today to reach your ${target}h target (${todayHours.toFixed(1)}h done)`,
          timestamp: now,
          read: false
        });
      }
    } catch {
    }
  }
  if (prefs.questions) {
    try {
      const qProgress = JSON.parse(
        localStorage.getItem("ssc_question_progress") ?? "[]"
      );
      const totalQ = qProgress.reduce((a, b) => a + Number(b.count), 0);
      const qTargetsRaw = JSON.parse(
        localStorage.getItem("ssc_targets") ?? "{}"
      );
      const qGoal = (qTargetsRaw == null ? void 0 : qTargetsRaw.totalQuestionsGoal) ?? 9e3;
      const monthlyPlan = JSON.parse(
        localStorage.getItem("ssc_monthly_plan") ?? "{}"
      );
      const todayDayPlan = monthlyPlan[today] !== void 0 ? monthlyPlan[today] : null;
      const qTargets = JSON.parse(
        localStorage.getItem("ssc_targets") ?? "{}"
      );
      const dailyQTarget = (qTargets == null ? void 0 : qTargets.dailyQuestionsTarget) ?? 300;
      const todayDone = todayDayPlan ?? 0;
      const qRemaining = Math.max(dailyQTarget - todayDone, 0);
      if (totalQ >= qGoal) {
        notifs.push({
          id: "questions-goal",
          type: "questions",
          title: "Questions Goal Achieved! 🏆",
          message: `You've completed all ${qGoal.toLocaleString()} questions! Outstanding!`,
          timestamp: now,
          read: false
        });
      } else {
        notifs.push({
          id: "questions-remaining",
          type: "questions",
          title: "Question Tracker",
          message: `${(qGoal - totalQ).toLocaleString()} questions remaining (${totalQ.toLocaleString()}/${qGoal.toLocaleString()}). Daily target: ${dailyQTarget} | Today done: ${todayDone} | Remaining today: ${qRemaining}`,
          timestamp: now,
          read: false
        });
      }
    } catch {
    }
  }
  return notifs;
}
function NotificationsPanel({
  onClose
}) {
  const panelRef = reactExports.useRef(null);
  const [prefs, setPrefs] = reactExports.useState(loadPrefs);
  const [dismissed, setDismissed] = reactExports.useState(loadDismissed);
  const [showPrefs, setShowPrefs] = reactExports.useState(false);
  const allNotifs = generateNotifications(prefs);
  const notifications = allNotifs.filter((n) => !dismissed.has(n.id));
  const handleDismiss = (id) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveDismissed(next);
      return next;
    });
  };
  const handleClearAll = () => {
    const allIds = new Set(allNotifs.map((n) => n.id));
    setDismissed(allIds);
    saveDismissed(allIds);
  };
  const handlePrefChange = (key, val) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: val };
      savePrefs(next);
      return next;
    });
  };
  const handleRestoreAll = () => {
    setDismissed(/* @__PURE__ */ new Set());
    saveDismissed(/* @__PURE__ */ new Set());
  };
  reactExports.useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  const ICON_MAP = {
    routine: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 14, className: "text-primary" }),
    study: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14, className: "text-blue-400" }),
    questions: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 14, className: "text-amber-400" })
  };
  const BORDER_MAP = {
    routine: "border-primary/20 bg-primary/5",
    study: "border-blue-500/20 bg-blue-500/5",
    questions: "border-amber-500/20 bg-amber-500/5"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: panelRef,
      className: "fixed z-50 w-80",
      style: { left: "268px", bottom: "80px" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 8, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 8, scale: 0.97 },
          transition: { duration: 0.2 },
          className: "rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-sm overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 15, className: "text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: "Notifications" }),
                notifications.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center", children: notifications.length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => setShowPrefs((v) => !v),
                    className: "h-6 w-6 p-0 text-muted-foreground hover:text-foreground",
                    title: "Notification preferences",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 13 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: onClose,
                    className: "h-6 w-6 p-0 text-muted-foreground hover:text-foreground",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[70vh] overflow-y-auto", children: [
              showPrefs && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border p-3 space-y-2 bg-muted/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-2", children: "Enable Notifications" }),
                [
                  {
                    key: "routine",
                    label: "Daily Routine",
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 12 })
                  },
                  {
                    key: "study",
                    label: "Study Plan",
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 })
                  },
                  {
                    key: "questions",
                    label: "Questions",
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 12 })
                  }
                ].map(({ key, label, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: icon }),
                    label
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: prefs[key],
                      onCheckedChange: (v) => handlePrefChange(key, v)
                    }
                  )
                ] }, key)),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: handleRestoreAll,
                    className: "w-full text-xs h-7 text-muted-foreground hover:text-foreground mt-1",
                    children: "Restore dismissed notifications"
                  }
                )
              ] }),
              notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-10 text-muted-foreground gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 32, className: "opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "All caught up!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center px-4", children: "No active notifications. Keep up the great work!" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-2", children: notifications.map((notif) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, x: -8 },
                  animate: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: 8 },
                  className: `rounded-xl border p-3 ${BORDER_MAP[notif.type]}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 mt-0.5", children: ICON_MAP[notif.type] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1 mb-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground leading-none", children: notif.title }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground shrink-0", children: notif.timestamp })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: notif.message })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleDismiss(notif.id),
                        className: "shrink-0 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                        "aria-label": "Dismiss notification",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 11 })
                      }
                    )
                  ] })
                },
                notif.id
              )) }),
              notifications.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: handleClearAll,
                  className: "w-full text-xs h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 11 }),
                    "Clear All"
                  ]
                }
              ) })
            ] })
          ]
        }
      )
    }
  );
}
export {
  NotificationsPanel as default
};
