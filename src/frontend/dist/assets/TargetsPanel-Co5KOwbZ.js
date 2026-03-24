import { j as jsxRuntimeExports, v as cn, ap as useGetTargets, aE as useSetTargets, ay as useGetStudySessions, ar as useGetQuestionProgress, aA as useSetStudySession, au as useSetQuestionCount, r as reactExports, aF as DEFAULT_TARGETS, b as ue, B as Button, T as Target, L as Label, I as Input, aG as Separator, x as CalendarDays } from "./index-BVnVdZrW.js";
import { D as Dialog, g as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, h as DialogDescription } from "./PieChart-B85u_bAs.js";
import { S as Settings } from "./settings-DXxM68xY.js";
import { C as CircleCheck } from "./circle-check-BJIG5X4e.js";
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
const SUBJECT_COLORS = {
  Maths: "text-primary",
  English: "text-blue-400",
  Reasoning: "text-purple-400",
  "General Knowledge": "text-amber-400",
  "Current Affairs": "text-emerald-400",
  Computer: "text-cyan-400",
  Science: "text-green-400"
};
const SUBJECT_BG = {
  Maths: "bg-primary/10",
  English: "bg-blue-400/10",
  Reasoning: "bg-purple-400/10",
  "General Knowledge": "bg-amber-400/10",
  "Current Affairs": "bg-emerald-400/10",
  Computer: "bg-cyan-400/10",
  Science: "bg-green-400/10"
};
function TargetsPanel({ trigger }) {
  const { data: targets } = useGetTargets();
  const setTargets = useSetTargets();
  const { data: studySessions } = useGetStudySessions();
  const { data: questionProgress } = useGetQuestionProgress();
  const setStudySession = useSetStudySession();
  const setQuestionCount = useSetQuestionCount();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const todayDisplay = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const [open, setOpen] = reactExports.useState(false);
  const [totalGoal, setTotalGoal] = reactExports.useState(9e3);
  const [dailyHours, setDailyHours] = reactExports.useState(15);
  const [planDays, setPlanDays] = reactExports.useState(30);
  const [subjectTargets, setSubjectTargets] = reactExports.useState(
    DEFAULT_TARGETS.subjectTargets
  );
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const [todayHours, setTodayHours] = reactExports.useState({});
  const [todayQuestions, setTodayQuestions] = reactExports.useState(
    {}
  );
  const [hoursSaveStatus, setHoursSaveStatus] = reactExports.useState("idle");
  const [questionsSaveStatus, setQuestionsSaveStatus] = reactExports.useState("idle");
  const debounceRef = reactExports.useRef(null);
  const savedTimerRef = reactExports.useRef(null);
  const hoursDebounceRefs = reactExports.useRef({});
  const questionsDebounceRefs = reactExports.useRef({});
  const hoursSavedTimerRef = reactExports.useRef(null);
  const questionsSavedTimerRef = reactExports.useRef(
    null
  );
  const initialized = reactExports.useRef(false);
  const progressInitialized = reactExports.useRef(false);
  const dailyQuestionsTarget = planDays > 0 ? Math.round(totalGoal / planDays) : 0;
  reactExports.useEffect(() => {
    if (targets && open && !initialized.current) {
      setTotalGoal(Number(targets.totalQuestionsGoal));
      setDailyHours(targets.dailyStudyHoursTarget);
      setPlanDays(Number(targets.planTotalDays));
      setSubjectTargets(targets.subjectTargets);
      initialized.current = true;
    }
    if (!open) {
      initialized.current = false;
      progressInitialized.current = false;
    }
  }, [targets, open]);
  reactExports.useEffect(() => {
    if (!open || progressInitialized.current) return;
    if (!studySessions || !questionProgress) return;
    const hoursMap = {};
    for (const subj of DEFAULT_TARGETS.subjectTargets) {
      const total = studySessions.filter((s) => s.date === today && s.subjectName === subj.name).reduce((acc, s) => acc + s.hours, 0);
      hoursMap[subj.name] = total > 0 ? String(total) : "0";
    }
    setTodayHours(hoursMap);
    const questionsMap = {};
    for (const subj of DEFAULT_TARGETS.subjectTargets) {
      const entry = questionProgress.find((q) => q.subjectName === subj.name);
      questionsMap[subj.name] = entry ? String(Number(entry.count)) : "0";
    }
    setTodayQuestions(questionsMap);
    progressInitialized.current = true;
  }, [open, studySessions, questionProgress, today]);
  const triggerSave = reactExports.useCallback(
    (goal, hours, days, subjects) => {
      if (goal < 100 || goal > 99999) return;
      if (hours < 1 || hours > 24) return;
      if (days < 1 || days > 365) return;
      setSaveStatus("saving");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      setTargets.mutate(
        {
          totalQuestionsGoal: goal,
          dailyStudyHoursTarget: hours,
          subjectTargets: subjects,
          planTotalDays: days
        },
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
            ue.error("Failed to save targets");
          }
        }
      );
    },
    [setTargets]
  );
  const scheduleAutoSave = reactExports.useCallback(
    (goal, hours, days, subjects) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        triggerSave(goal, hours, days, subjects);
      }, 600);
    },
    [triggerSave]
  );
  const handleTotalGoalChange = (e) => {
    const val = Math.max(0, Number(e.target.value));
    setTotalGoal(val);
    scheduleAutoSave(val, dailyHours, planDays, subjectTargets);
  };
  const handleDailyHoursChange = (e) => {
    const val = Math.max(0, Number(e.target.value));
    setDailyHours(val);
    scheduleAutoSave(totalGoal, val, planDays, subjectTargets);
  };
  const handlePlanDaysChange = (e) => {
    const val = Math.max(1, Number(e.target.value));
    setPlanDays(val);
    scheduleAutoSave(totalGoal, dailyHours, val, subjectTargets);
  };
  const handleSubjectTargetChange = (name, rawVal) => {
    const val = Math.max(0, Number(rawVal));
    const updated = subjectTargets.map(
      (s) => s.name === name ? { ...s, target: BigInt(val) } : s
    );
    setSubjectTargets(updated);
    scheduleAutoSave(totalGoal, dailyHours, planDays, updated);
  };
  const handleTodayHoursChange = (subjectName, rawVal) => {
    const val = Math.max(0, Number(rawVal));
    setTodayHours((prev) => ({ ...prev, [subjectName]: rawVal }));
    if (hoursDebounceRefs.current[subjectName]) {
      clearTimeout(hoursDebounceRefs.current[subjectName]);
    }
    setHoursSaveStatus("saving");
    if (hoursSavedTimerRef.current) clearTimeout(hoursSavedTimerRef.current);
    hoursDebounceRefs.current[subjectName] = setTimeout(() => {
      setStudySession.mutate(
        { subjectName, hours: val, date: today },
        {
          onSuccess: () => {
            setHoursSaveStatus("saved");
            hoursSavedTimerRef.current = setTimeout(
              () => setHoursSaveStatus("idle"),
              2500
            );
          },
          onError: () => {
            setHoursSaveStatus("idle");
            ue.error(`Failed to save hours for ${subjectName}`);
          }
        }
      );
    }, 600);
  };
  const handleTodayQuestionsChange = (subjectName, rawVal) => {
    const val = Math.max(0, Number(rawVal));
    setTodayQuestions((prev) => ({ ...prev, [subjectName]: rawVal }));
    if (questionsDebounceRefs.current[subjectName]) {
      clearTimeout(questionsDebounceRefs.current[subjectName]);
    }
    setQuestionsSaveStatus("saving");
    if (questionsSavedTimerRef.current)
      clearTimeout(questionsSavedTimerRef.current);
    questionsDebounceRefs.current[subjectName] = setTimeout(() => {
      setQuestionCount.mutate(
        { subjectName, count: val },
        {
          onSuccess: () => {
            setQuestionsSaveStatus("saved");
            questionsSavedTimerRef.current = setTimeout(
              () => setQuestionsSaveStatus("idle"),
              2500
            );
          },
          onError: () => {
            setQuestionsSaveStatus("idle");
            ue.error(`Failed to save questions for ${subjectName}`);
          }
        }
      );
    }, 600);
  };
  reactExports.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      if (hoursSavedTimerRef.current) clearTimeout(hoursSavedTimerRef.current);
      if (questionsSavedTimerRef.current)
        clearTimeout(questionsSavedTimerRef.current);
      for (const t of Object.values(hoursDebounceRefs.current)) clearTimeout(t);
      for (const t of Object.values(questionsDebounceRefs.current))
        clearTimeout(t);
    };
  }, []);
  const subjectSum = subjectTargets.reduce(
    (acc, s) => acc + Number(s.target),
    0
  );
  const subjectSumMatchesGoal = subjectSum === totalGoal;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: trigger ?? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors",
        "aria-label": "Edit targets",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 15 })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md bg-card border-border max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 16, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg font-bold text-foreground", children: "Edit Study Targets" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs text-muted-foreground mt-0.5", children: "Changes auto-save and recalculate all daily plans" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-5 flex items-center", children: [
          saveStatus === "saving" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" }),
            "Saving…"
          ] }),
          saveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-emerald-400 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12 }),
            "Saved"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest font-semibold text-muted-foreground", children: "Overall Goals" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: "Total Questions Goal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 100,
                max: 99999,
                value: totalGoal,
                onChange: handleTotalGoalChange,
                className: "bg-muted/40 border-input focus:border-primary/50 font-mono"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
              "Default: 9000 · Daily target:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-primary", children: [
                dailyQuestionsTarget,
                " questions/day"
              ] }),
              " ",
              "(",
              planDays,
              " days)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: "Daily Study Hours Target" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 1,
                max: 24,
                step: 0.5,
                value: dailyHours,
                onChange: handleDailyHoursChange,
                className: "bg-muted/40 border-input focus:border-primary/50 font-mono"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Default: 15 hours/day" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: "Plan Duration (Days)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 1,
                max: 365,
                value: planDays,
                onChange: handlePlanDaysChange,
                className: "bg-muted/40 border-input focus:border-primary/50 font-mono"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Default: 30 days" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest font-semibold text-muted-foreground", children: "Subject Targets" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `text-[10px] font-mono font-bold ${subjectSumMatchesGoal ? "text-emerald-400" : "text-amber-400"}`,
                children: [
                  subjectSum.toLocaleString(),
                  "/",
                  totalGoal.toLocaleString(),
                  subjectSumMatchesGoal ? " ✓" : " ≠"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground -mt-1", children: "Sum of subject targets should equal total goal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: subjectTargets.map((s) => {
            const colorClass = SUBJECT_COLORS[s.name] ?? "text-foreground";
            const dailySubject = planDays > 0 ? Math.round(Number(s.target) / planDays) : 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: `text-xs font-semibold ${colorClass}`, children: s.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-mono", children: [
                  dailySubject,
                  "/day"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  max: 99999,
                  value: Number(s.target),
                  onChange: (e) => handleSubjectTargetChange(s.name, e.target.value),
                  className: "bg-muted/40 border-input focus:border-primary/50 font-mono h-8 text-sm"
                }
              )
            ] }, s.name);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest font-semibold text-muted-foreground", children: "Today's Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 9 }),
              todayDisplay,
              " · Editable today only"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Study Hours" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-4 flex items-center", children: [
                hoursSaveStatus === "saving" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground text-[10px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin h-2.5 w-2.5 border border-current border-t-transparent rounded-full" }),
                  "Saving…"
                ] }),
                hoursSaveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-emerald-400 text-[10px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 10 }),
                  "Saved"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: subjectTargets.map((s) => {
              const colorClass = SUBJECT_COLORS[s.name] ?? "text-foreground";
              const bgClass = SUBJECT_BG[s.name] ?? "bg-muted/20";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center gap-3 rounded-lg px-3 py-2 ${bgClass}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        className: `text-xs font-semibold w-32 shrink-0 ${colorClass}`,
                        children: s.name
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          min: 0,
                          max: 24,
                          step: 0.5,
                          value: todayHours[s.name] ?? "0",
                          onChange: (e) => handleTodayHoursChange(s.name, e.target.value),
                          className: "bg-background/50 border-input focus:border-primary/50 font-mono h-7 text-sm w-20"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground shrink-0", children: "hrs" })
                    ] })
                  ]
                },
                `hours-${s.name}`
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Total today" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono font-bold text-foreground", children: [
                Object.values(todayHours).reduce((acc, v) => acc + (Number(v) || 0), 0).toFixed(1),
                " ",
                "/ ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
                  dailyHours,
                  "h target"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Questions Solved" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-4 flex items-center", children: [
                questionsSaveStatus === "saving" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground text-[10px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin h-2.5 w-2.5 border border-current border-t-transparent rounded-full" }),
                  "Saving…"
                ] }),
                questionsSaveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-emerald-400 text-[10px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 10 }),
                  "Saved"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: subjectTargets.map((s) => {
              const colorClass = SUBJECT_COLORS[s.name] ?? "text-foreground";
              const bgClass = SUBJECT_BG[s.name] ?? "bg-muted/20";
              const subjectMax = Number(s.target);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center gap-3 rounded-lg px-3 py-2 ${bgClass}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        className: `text-xs font-semibold w-32 shrink-0 ${colorClass}`,
                        children: s.name
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          min: 0,
                          max: subjectMax,
                          value: todayQuestions[s.name] ?? "0",
                          onChange: (e) => handleTodayQuestionsChange(s.name, e.target.value),
                          className: "bg-background/50 border-input focus:border-primary/50 font-mono h-7 text-sm w-24"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground shrink-0", children: [
                        "/ ",
                        subjectMax.toLocaleString()
                      ] })
                    ] })
                  ]
                },
                `qs-${s.name}`
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Total solved" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono font-bold text-foreground", children: [
                Object.values(todayQuestions).reduce((acc, v) => acc + (Number(v) || 0), 0).toLocaleString(),
                " ",
                "/",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
                  totalGoal.toLocaleString(),
                  " goal"
                ] })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  TargetsPanel as T,
  Table as a,
  TableHeader as b,
  TableRow as c,
  TableHead as d,
  TableBody as e,
  TableCell as f
};
