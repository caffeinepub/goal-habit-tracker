import { r as reactExports, g as useControllableState, j as jsxRuntimeExports, h as createContextScope, i as useId, l as Primitive, n as composeEventHandlers, o as Presence, k as useComposedRefs, aw as useLayoutEffect2, ax as useGetStudySessions, ao as useGetTargets, ay as useGetMockScores, as as useGetCustomSubjects, ar as useGetPlanCycles, az as useSetStudySession, aA as useAddMockScoreFull, aB as useSetCustomSubjects, au as useSavePlanCycle, av as useSaveSectionTimeLog, aC as useQueryClient, b as ue, m as motion, U as Clock, B as Button, P as Palette, A as AlertDialog, y as AlertDialogTrigger, E as Eraser, z as AlertDialogContent, G as AlertDialogHeader, H as AlertDialogTitle, J as AlertDialogDescription, K as AlertDialogFooter, M as AlertDialogCancel, N as AlertDialogAction, e as Progress, a4 as Timer, C as CirclePlus, L as Label, I as Input, a as BookOpen, T as Target, x as CalendarDays, V as ScrollArea, Z as X } from "./index-BsN7n755.js";
import { B as Badge } from "./badge-B8mzrktq.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-DpdnamAG.js";
import { C as ChartPie, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, R as ResponsiveContainer, P as PieChart, d as Pie, e as Cell, T as Tooltip, L as Legend } from "./PieChart-CsgkFaSk.js";
import { S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem, h as ChevronDown } from "./select-CyHd4zrC.js";
import { S as Skeleton } from "./skeleton-CFyfsfdR.js";
import { T as TargetsPanel, a as Table, b as TableHeader, c as TableRow, d as TableHead, e as TableBody, f as TableCell } from "./TargetsPanel-CV0Y-FCn.js";
import { u as useSectionStyle, S as SectionStylePanel, R as RotateCcw } from "./SectionStylePanel-N7W_wvoR.js";
import { H as History, T as Trophy } from "./trophy-BMDsDgoy.js";
import { C as CircleCheck } from "./circle-check-Cd1SZGCk.js";
import { P as Pause, a as Play } from "./play-BijF0AK6.js";
import { F as Flame } from "./flame-DdK5_EmD.js";
import { C as ChevronRight } from "./chevron-right-Cz4nvJsI.js";
import { A as AnimatePresence } from "./index-DO5nt32h.js";
import "./check-Bglm8Rh6.js";
import "./settings-B0puVVKD.js";
var COLLAPSIBLE_NAME = "Collapsible";
var [createCollapsibleContext] = createContextScope(COLLAPSIBLE_NAME);
var [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext(COLLAPSIBLE_NAME);
var Collapsible$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCollapsible,
      open: openProp,
      defaultOpen,
      disabled,
      onOpenChange,
      ...collapsibleProps
    } = props;
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: COLLAPSIBLE_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CollapsibleProvider,
      {
        scope: __scopeCollapsible,
        disabled,
        contentId: useId(),
        open,
        onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            "data-state": getState(open),
            "data-disabled": disabled ? "" : void 0,
            ...collapsibleProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Collapsible$1.displayName = COLLAPSIBLE_NAME;
var TRIGGER_NAME = "CollapsibleTrigger";
var CollapsibleTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCollapsible, ...triggerProps } = props;
    const context = useCollapsibleContext(TRIGGER_NAME, __scopeCollapsible);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-controls": context.contentId,
        "aria-expanded": context.open || false,
        "data-state": getState(context.open),
        "data-disabled": context.disabled ? "" : void 0,
        disabled: context.disabled,
        ...triggerProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
CollapsibleTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "CollapsibleContent";
var CollapsibleContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useCollapsibleContext(CONTENT_NAME, props.__scopeCollapsible);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContentImpl, { ...contentProps, ref: forwardedRef, present }) });
  }
);
CollapsibleContent$1.displayName = CONTENT_NAME;
var CollapsibleContentImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeCollapsible, present, children, ...contentProps } = props;
  const context = useCollapsibleContext(CONTENT_NAME, __scopeCollapsible);
  const [isPresent, setIsPresent] = reactExports.useState(present);
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const heightRef = reactExports.useRef(0);
  const height = heightRef.current;
  const widthRef = reactExports.useRef(0);
  const width = widthRef.current;
  const isOpen = context.open || isPresent;
  const isMountAnimationPreventedRef = reactExports.useRef(isOpen);
  const originalStylesRef = reactExports.useRef(void 0);
  reactExports.useEffect(() => {
    const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
    return () => cancelAnimationFrame(rAF);
  }, []);
  useLayoutEffect2(() => {
    const node = ref.current;
    if (node) {
      originalStylesRef.current = originalStylesRef.current || {
        transitionDuration: node.style.transitionDuration,
        animationName: node.style.animationName
      };
      node.style.transitionDuration = "0s";
      node.style.animationName = "none";
      const rect = node.getBoundingClientRect();
      heightRef.current = rect.height;
      widthRef.current = rect.width;
      if (!isMountAnimationPreventedRef.current) {
        node.style.transitionDuration = originalStylesRef.current.transitionDuration;
        node.style.animationName = originalStylesRef.current.animationName;
      }
      setIsPresent(present);
    }
  }, [context.open, present]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-state": getState(context.open),
      "data-disabled": context.disabled ? "" : void 0,
      id: context.contentId,
      hidden: !isOpen,
      ...contentProps,
      ref: composedRefs,
      style: {
        [`--radix-collapsible-content-height`]: height ? `${height}px` : void 0,
        [`--radix-collapsible-content-width`]: width ? `${width}px` : void 0,
        ...props.style
      },
      children: isOpen && children
    }
  );
});
function getState(open) {
  return open ? "open" : "closed";
}
var Root = Collapsible$1;
function Collapsible({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "collapsible", ...props });
}
function CollapsibleTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CollapsibleTrigger$1,
    {
      "data-slot": "collapsible-trigger",
      ...props
    }
  );
}
function CollapsibleContent({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CollapsibleContent$1,
    {
      "data-slot": "collapsible-content",
      ...props
    }
  );
}
const SSC_SUBJECTS = [
  "Maths",
  "English",
  "Reasoning",
  "General Knowledge",
  "Current Affairs",
  "Computer",
  "Science",
  "Mock Test"
];
const SUBJECT_COLORS = {
  Maths: "bg-primary/20 text-primary border-primary/30",
  English: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Reasoning: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "General Knowledge": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Current Affairs": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Computer: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Science: "bg-green-500/20 text-green-400 border-green-500/30",
  "Mock Test": "bg-rose-500/20 text-rose-400 border-rose-500/30"
};
const SUBJECT_HEX_COLORS = {
  Maths: "#e11d48",
  English: "#3b82f6",
  Reasoning: "#a855f7",
  "General Knowledge": "#f59e0b",
  "Current Affairs": "#10b981",
  Computer: "#06b6d4",
  Science: "#22c55e",
  "Mock Test": "#f43f5e"
};
function getTodayDate() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function formatHours(h) {
  if (h < 1) return `${Math.round(h * 60)}m`;
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}
function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}
function getDayLabel(dateStr) {
  const d = /* @__PURE__ */ new Date(`${dateStr}T12:00:00`);
  const today = getTodayDate();
  if (dateStr === today) return "Today";
  const yesterday = /* @__PURE__ */ new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
}
function daysDiff(from, to) {
  const a = new Date(from);
  const b = new Date(to);
  return Math.floor((b.getTime() - a.getTime()) / (1e3 * 60 * 60 * 24));
}
const SP_TIMER_KEY = "ssc_studyplan_timer_state";
const SP_SECTION_TIME_PREFIX = "ssc_section_time_studyplan_";
const SP_CYCLE_KEY = "ssc_cycle_start_studyplan";
function loadTimerState() {
  try {
    const s = localStorage.getItem(SP_TIMER_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}
function getSectionTimeToday() {
  const key = SP_SECTION_TIME_PREFIX + getTodayDate();
  return Number(localStorage.getItem(key) ?? 0);
}
function addSectionTimeToday(secs) {
  const key = SP_SECTION_TIME_PREFIX + getTodayDate();
  const current = Number(localStorage.getItem(key) ?? 0);
  localStorage.setItem(key, String(current + secs));
}
function CircularProgress({
  value,
  max,
  size = 140,
  strokeWidth = 10
}) {
  const pct = Math.min(value / max, 1);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const cx = size / 2;
  const cy = size / 2;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size,
      className: "rotate-[-90deg]",
      role: "img",
      "aria-label": `Study progress: ${Math.round(value / max * 100)}%`,
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
            transition: { duration: 1, ease: "easeOut" }
          }
        )
      ]
    }
  );
}
function StudyPlanTab({
  onSectionTimerStart,
  onSectionTimerPause,
  onSectionTimerUpdate,
  onSyncPomodoro
}) {
  const { data: sessions = [], isLoading } = useGetStudySessions();
  const { data: targets } = useGetTargets();
  const { data: mockScoresList = [] } = useGetMockScores();
  const { data: customSubjects = [] } = useGetCustomSubjects();
  const { data: planCycles = [] } = useGetPlanCycles();
  const setSession = useSetStudySession();
  const addMockScore = useAddMockScoreFull();
  const setCustomSubjectsMutation = useSetCustomSubjects();
  const savePlanCycleMutation = useSavePlanCycle();
  const saveSectionTimeLog = useSaveSectionTimeLog();
  const queryClient = useQueryClient();
  const DAILY_TARGET_HOURS = (targets == null ? void 0 : targets.dailyStudyHoursTarget) ?? 15;
  const allSubjects = [...SSC_SUBJECTS, ...customSubjects];
  const [subject, setSubject] = reactExports.useState("");
  const [hoursInput, setHoursInput] = reactExports.useState("");
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const debounceRef = reactExports.useRef(null);
  const savedTimerRef = reactExports.useRef(null);
  const [newCustomSubject, setNewCustomSubject] = reactExports.useState("");
  const [customSubjectsOpen, setCustomSubjectsOpen] = reactExports.useState(false);
  const [mockTestOpen, setMockTestOpen] = reactExports.useState(false);
  const [mockSubject, setMockSubject] = reactExports.useState("");
  const [mockScore, setMockScore] = reactExports.useState("");
  const [mockTotalMarks, setMockTotalMarks] = reactExports.useState("200");
  const [mockDate, setMockDate] = reactExports.useState(getTodayDate());
  const [cycleStart, setCycleStart] = reactExports.useState(() => {
    return localStorage.getItem(SP_CYCLE_KEY) ?? getTodayDate();
  });
  const [historyOpen, setHistoryOpen] = reactExports.useState(false);
  const [showClearConfirm, setShowClearConfirm] = reactExports.useState(false);
  const savePlanCycleMutateRef = reactExports.useRef(savePlanCycleMutation.mutate);
  savePlanCycleMutateRef.current = savePlanCycleMutation.mutate;
  const today = getTodayDate();
  const dayOfCycle = Math.min(daysDiff(cycleStart, today) + 1, 30);
  reactExports.useEffect(() => {
    const todayStr = getTodayDate();
    const savedCycleStart = localStorage.getItem(SP_CYCLE_KEY);
    if (!savedCycleStart) {
      localStorage.setItem(SP_CYCLE_KEY, todayStr);
      setCycleStart(todayStr);
    } else {
      const diff = daysDiff(savedCycleStart, todayStr);
      if (diff >= 30) {
        savePlanCycleMutateRef.current({
          section: "studyplan",
          startDate: savedCycleStart,
          endDate: todayStr,
          summary: diff
        });
        localStorage.setItem(SP_CYCLE_KEY, todayStr);
        setCycleStart(todayStr);
      }
    }
  }, []);
  const [subjectTimerSecs, setSubjectTimerSecs] = reactExports.useState(0);
  const [subjectTimerRunning, setSubjectTimerRunning] = reactExports.useState(false);
  const [subjectTimerInitial, setSubjectTimerInitial] = reactExports.useState(0);
  const subjectTimerRef = reactExports.useRef(null);
  const onSectionTimerPauseRef = reactExports.useRef(onSectionTimerPause);
  onSectionTimerPauseRef.current = onSectionTimerPause;
  const onSectionTimerUpdateRef = reactExports.useRef(onSectionTimerUpdate);
  onSectionTimerUpdateRef.current = onSectionTimerUpdate;
  const subjectTimerInitialRef = reactExports.useRef(0);
  const spStartedAtRef = reactExports.useRef(null);
  const spBaseSecsRef = reactExports.useRef(0);
  const [elapsedSecs, setElapsedSecs] = reactExports.useState(0);
  const [todayTotalElapsedSecs, setTodayTotalElapsedSecs] = reactExports.useState(getSectionTimeToday);
  const elapsedRef = reactExports.useRef(null);
  const elapsedSecsRef = reactExports.useRef(0);
  const elapsedStartRef = reactExports.useRef(null);
  const elapsedBaseRef = reactExports.useRef(0);
  const lastSectionTimeWrittenRef = reactExports.useRef(0);
  const isRestoringRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const saved = loadTimerState();
    if ((saved == null ? void 0 : saved.subject) && saved.timerInitial > 0) {
      isRestoringRef.current = true;
      const restored = saved.timerSecs;
      const restoredElapsed = saved.elapsedSecs;
      setSubject(saved.subject);
      setHoursInput(saved.hoursInput);
      setSubjectTimerSecs(restored);
      setSubjectTimerInitial(saved.timerInitial);
      spBaseSecsRef.current = restored;
      elapsedSecsRef.current = restoredElapsed;
      elapsedBaseRef.current = restoredElapsed;
      setElapsedSecs(restoredElapsed);
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 0);
    }
  }, []);
  const saveTimerStateToLocalStorage = reactExports.useCallback(
    (sub, hrs, secs, initial, running, elapsed) => {
      const state = {
        subject: sub,
        hoursInput: hrs,
        timerSecs: secs,
        timerInitial: initial,
        running,
        savedAt: Date.now(),
        elapsedSecs: elapsed
      };
      localStorage.setItem(SP_TIMER_KEY, JSON.stringify(state));
    },
    []
  );
  const isFirstMount = reactExports.useRef(true);
  reactExports.useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (isRestoringRef.current) {
      return;
    }
    setSubjectTimerRunning(false);
    if (subjectTimerRef.current) clearInterval(subjectTimerRef.current);
    if (elapsedRef.current) clearInterval(elapsedRef.current);
    spStartedAtRef.current = null;
    elapsedStartRef.current = null;
    elapsedBaseRef.current = 0;
    elapsedSecsRef.current = 0;
    setElapsedSecs(0);
    lastSectionTimeWrittenRef.current = 0;
    const h = Number.parseFloat(hoursInput);
    if (subject && !Number.isNaN(h) && h > 0) {
      const secs = Math.round(h * 3600);
      setSubjectTimerSecs(secs);
      setSubjectTimerInitial(secs);
      subjectTimerInitialRef.current = secs;
      spBaseSecsRef.current = secs;
      saveTimerStateToLocalStorage(subject, hoursInput, secs, secs, false, 0);
    } else {
      setSubjectTimerSecs(0);
      setSubjectTimerInitial(0);
      spBaseSecsRef.current = 0;
    }
  }, [subject, hoursInput, saveTimerStateToLocalStorage]);
  reactExports.useEffect(() => {
    if (subjectTimerRunning) {
      spStartedAtRef.current = Date.now();
      elapsedStartRef.current = Date.now();
      subjectTimerRef.current = setInterval(() => {
        var _a, _b;
        const now = Date.now();
        if (spStartedAtRef.current !== null) {
          const spElapsed = Math.floor((now - spStartedAtRef.current) / 1e3);
          const newSecs = Math.max(0, spBaseSecsRef.current - spElapsed);
          setSubjectTimerSecs(newSecs);
          if (elapsedStartRef.current !== null) {
            const elapsedDelta = Math.floor(
              (now - elapsedStartRef.current) / 1e3
            );
            const totalElapsed2 = elapsedBaseRef.current + elapsedDelta;
            elapsedSecsRef.current = totalElapsed2;
            setElapsedSecs(totalElapsed2);
            const newSectionSecs = totalElapsed2 - lastSectionTimeWrittenRef.current;
            if (newSectionSecs > 0) {
              addSectionTimeToday(newSectionSecs);
              lastSectionTimeWrittenRef.current = totalElapsed2;
            }
          }
          (_a = onSectionTimerUpdateRef.current) == null ? void 0 : _a.call(
            onSectionTimerUpdateRef,
            subject,
            Math.max(
              0,
              spBaseSecsRef.current - Math.floor((now - spStartedAtRef.current) / 1e3)
            ),
            true
          );
          saveTimerStateToLocalStorage(
            subject,
            hoursInput,
            newSecs,
            subjectTimerInitial,
            newSecs > 0,
            elapsedSecsRef.current
          );
          if (newSecs <= 0) {
            setSubjectTimerRunning(false);
            ue.success("Study session complete!");
            (_b = onSectionTimerPauseRef.current) == null ? void 0 : _b.call(onSectionTimerPauseRef);
          }
        }
      }, 200);
    } else {
      if (subjectTimerRef.current) clearInterval(subjectTimerRef.current);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      spStartedAtRef.current = null;
      if (elapsedStartRef.current !== null) {
        const elapsedDelta = Math.floor(
          (Date.now() - elapsedStartRef.current) / 1e3
        );
        const totalElapsed2 = elapsedBaseRef.current + elapsedDelta;
        elapsedBaseRef.current = totalElapsed2;
        elapsedSecsRef.current = totalElapsed2;
        elapsedStartRef.current = null;
        const newSectionSecs = totalElapsed2 - lastSectionTimeWrittenRef.current;
        if (newSectionSecs > 0) {
          addSectionTimeToday(newSectionSecs);
          lastSectionTimeWrittenRef.current = totalElapsed2;
        }
        setTodayTotalElapsedSecs((prev) => prev + totalElapsed2);
        elapsedSecsRef.current = 0;
        elapsedBaseRef.current = 0;
        lastSectionTimeWrittenRef.current = 0;
        setElapsedSecs(0);
      }
      saveTimerStateToLocalStorage(
        subject,
        hoursInput,
        spBaseSecsRef.current,
        subjectTimerInitial,
        false,
        elapsedSecsRef.current
      );
    }
    return () => {
      if (subjectTimerRef.current) clearInterval(subjectTimerRef.current);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [subjectTimerRunning, saveTimerStateToLocalStorage]);
  const saveSectionTimeLogMutateRef = reactExports.useRef(saveSectionTimeLog.mutate);
  saveSectionTimeLogMutateRef.current = saveSectionTimeLog.mutate;
  reactExports.useEffect(() => {
    return () => {
      const todayStr = getTodayDate();
      const elapsed = getSectionTimeToday();
      if (elapsed > 0) {
        saveSectionTimeLogMutateRef.current({
          section: "studyplan",
          date: todayStr,
          elapsedSeconds: elapsed
        });
      }
    };
  }, []);
  const subjectTimerMins = Math.floor(subjectTimerSecs / 60);
  const subjectTimerRemSecs = subjectTimerSecs % 60;
  const showSubjectTimer = subject !== "" && Number.parseFloat(hoursInput) > 0 && subjectTimerInitial > 0;
  const totalElapsed = todayTotalElapsedSecs + elapsedSecs;
  const elapsedH = Math.floor(totalElapsed / 3600);
  const elapsedM = Math.floor(totalElapsed % 3600 / 60);
  const elapsedS = totalElapsed % 60;
  const elapsedDisplay = `${String(elapsedH).padStart(2, "0")}:${String(elapsedM).padStart(2, "0")}:${String(elapsedS).padStart(2, "0")}`;
  const todaysSessions = sessions.filter((s) => s.date === today);
  const todayHours = todaysSessions.reduce((acc, s) => acc + s.hours, 0);
  const dailyPct = Math.min(todayHours / DAILY_TARGET_HOURS * 100, 100);
  const remaining = Math.max(DAILY_TARGET_HOURS - todayHours, 0);
  const last7Days = getLast7Days();
  const weeklyData = last7Days.map((date) => {
    const dayHours = sessions.filter((s) => s.date === date).reduce((acc, s) => acc + s.hours, 0);
    return { date, hours: dayHours };
  });
  const todaySubjectMap = {};
  for (const s of todaysSessions) {
    todaySubjectMap[s.subjectName] = (todaySubjectMap[s.subjectName] ?? 0) + s.hours;
  }
  const goalMet = todayHours >= DAILY_TARGET_HOURS;
  const triggerSave = reactExports.useCallback(
    (subj, hrs) => {
      const h = Number.parseFloat(hrs);
      if (!subj || Number.isNaN(h) || h < 0 || h > DAILY_TARGET_HOURS + 10)
        return;
      setSaveStatus("saving");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      setSession.mutate(
        { subjectName: subj, hours: h, date: today },
        {
          onSuccess: () => {
            setSaveStatus("saved");
            queryClient.invalidateQueries({ queryKey: ["studySessions"] });
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
              ue.error(`Failed to save session: ${msg}. Please try again.`);
            }
          }
        }
      );
    },
    [setSession, today, DAILY_TARGET_HOURS, queryClient]
  );
  const handleSubjectChange = reactExports.useCallback((val) => {
    setSubject(val);
  }, []);
  const handleHoursChange = reactExports.useCallback(
    (e) => {
      const val = e.target.value;
      setHoursInput(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (subject) triggerSave(subject, val);
      }, 600);
    },
    [subject, triggerSave]
  );
  const handleTimerToggle = reactExports.useCallback(() => {
    setSubjectTimerRunning((r) => {
      const next = !r;
      if (next) {
        onSectionTimerStart == null ? void 0 : onSectionTimerStart(subject, subjectTimerSecs);
        onSyncPomodoro == null ? void 0 : onSyncPomodoro(subjectTimerInitial);
      } else {
        onSectionTimerPause == null ? void 0 : onSectionTimerPause();
      }
      return next;
    });
  }, [
    subject,
    subjectTimerSecs,
    subjectTimerInitial,
    onSectionTimerStart,
    onSectionTimerPause,
    onSyncPomodoro
  ]);
  const handleAddMockScore = reactExports.useCallback(() => {
    const score = Number.parseInt(mockScore, 10);
    const total = Number.parseInt(mockTotalMarks, 10);
    if (!mockSubject || Number.isNaN(score) || score < 0 || Number.isNaN(total) || total <= 0 || score > total) {
      ue.error("Please fill all mock test fields correctly");
      return;
    }
    addMockScore.mutate(
      { subject: mockSubject, score, totalMarks: total, date: mockDate },
      {
        onSuccess: () => {
          ue.success("Mock test score saved!");
          setMockScore("");
          setMockSubject("");
          setMockTotalMarks("200");
          setMockDate(getTodayDate());
        },
        onError: () => ue.error("Failed to save mock score")
      }
    );
  }, [addMockScore, mockSubject, mockScore, mockTotalMarks, mockDate]);
  const handleAddCustomSubject = reactExports.useCallback(() => {
    const name = newCustomSubject.trim();
    if (!name) return;
    if (SSC_SUBJECTS.includes(name) || customSubjects.includes(name)) {
      ue.error("Subject already exists");
      return;
    }
    setCustomSubjectsMutation.mutate([...customSubjects, name], {
      onSuccess: () => {
        ue.success(`Added custom subject: ${name}`);
        setNewCustomSubject("");
      },
      onError: () => ue.error("Failed to add custom subject")
    });
  }, [customSubjects, newCustomSubject, setCustomSubjectsMutation]);
  const handleRemoveCustomSubject = reactExports.useCallback(
    (name) => {
      setCustomSubjectsMutation.mutate(
        customSubjects.filter((s) => s !== name),
        {
          onSuccess: () => ue.success(`Removed ${name}`),
          onError: () => ue.error("Failed to remove subject")
        }
      );
    },
    [customSubjects, setCustomSubjectsMutation]
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
  const { style: sectionStyle } = useSectionStyle("studyplan");
  const [questionsSectionTime, setQuestionsSectionTime] = reactExports.useState(0);
  const [pomodoroTodayTime, setPomodoroTodayTime] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const refresh = () => {
      const qTime = Number(
        localStorage.getItem(`ssc_section_time_questions_${today}`) ?? 0
      );
      setQuestionsSectionTime(qTime);
      try {
        const log = JSON.parse(localStorage.getItem("ssc_focus_log") ?? "{}");
        const mins = log[today] ?? 0;
        setPomodoroTodayTime(mins * 60);
      } catch {
        setPomodoroTodayTime(0);
      }
    };
    refresh();
    const interval = setInterval(refresh, 5e3);
    return () => clearInterval(interval);
  }, [today]);
  const combinedTotalSecs = totalElapsed + questionsSectionTime + pomodoroTodayTime;
  function formatHMS(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor(secs % 3600 / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  function getChartDataForDate(dateKey) {
    const daySessions = sessions.filter((s) => s.date === dateKey);
    const map = {};
    for (const s of daySessions) {
      map[s.subjectName] = (map[s.subjectName] ?? 0) + s.hours;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 })).filter((e) => e.value > 0);
  }
  function getMonthlyChartData() {
    const now = /* @__PURE__ */ new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const map = {};
    for (const s of sessions) {
      const d = /* @__PURE__ */ new Date(`${s.date}T12:00:00`);
      if (d.getFullYear() === year && d.getMonth() === month) {
        map[s.subjectName] = (map[s.subjectName] ?? 0) + s.hours;
      }
    }
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 })).filter((e) => e.value > 0);
  }
  const chartDayData = getChartDataForDate(chartSelectedDate);
  const chartMonthData = getMonthlyChartData();
  const actualPct = Math.min(
    totalElapsed / (DAILY_TARGET_HOURS * 3600) * 100,
    100
  );
  const studyPlanCycles = planCycles.filter((c) => c.section === "studyplan");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl mx-auto", style: sectionStyle, children: [
    showStylePanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionStylePanel,
      {
        sectionId: "studyplan",
        sectionLabel: "Study Plan",
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-2xl font-bold text-foreground", children: [
              DAILY_TARGET_HOURS,
              "H Study Plan"
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
                  "data-ocid": "studyplan.style.button",
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
                  "data-ocid": "studyplan.progress.button",
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
                        title: "Clear today's study data",
                        "data-ocid": "studyplan.clear.open_modal_button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eraser, { size: 13 })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "studyplan.clear.dialog", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Clear today's study sessions?" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will remove all study hour logs for today. This cannot be undone." })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "studyplan.clear.cancel_button", children: "Cancel" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          AlertDialogAction,
                          {
                            onClick: () => {
                              const today2 = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
                              try {
                                const raw = localStorage.getItem("ssc_study_sessions");
                                const all = raw ? JSON.parse(raw) : [];
                                const filtered = all.filter(
                                  (s) => s.date !== today2
                                );
                                localStorage.setItem(
                                  "ssc_study_sessions",
                                  JSON.stringify(filtered)
                                );
                                ue.success("Today's study sessions cleared");
                              } catch {
                                ue.error("Failed to clear");
                              }
                            },
                            className: "bg-amber-500 hover:bg-amber-600 text-white",
                            "data-ocid": "studyplan.clear.confirm_button",
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
            "Track your daily ",
            DAILY_TARGET_HOURS,
            "-hour study target across all SSC CGL subjects"
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
            className: `border overflow-hidden ${goalMet ? "border-primary/40 bg-primary/5" : "border-border"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircularProgress,
                  {
                    value: totalElapsed,
                    max: DAILY_TARGET_HOURS * 3600,
                    size: 140,
                    strokeWidth: 11
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-2xl font-bold text-foreground leading-none", children: [
                    Math.round(actualPct),
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground mt-1", children: "actual" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground", children: "Today's Progress" }),
                  goalMet && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/15 text-primary border-primary/30 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 10, className: "mr-1" }),
                    "Goal Met!"
                  ] }),
                  subjectTimerRunning && subject && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" }),
                    "Timer: ",
                    subject
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Progress,
                  {
                    value: dailyPct,
                    className: "h-3 bg-muted mb-3 rounded-full"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-primary/8 border border-primary/15 p-2.5 flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { size: 13, className: "text-primary shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Study Plan timer today" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-bold text-primary tabular-nums", children: elapsedDisplay })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                      "Planned: ",
                      formatHours(todayHours)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                      Math.round(actualPct),
                      "% of target"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-blue-500/8 border border-blue-500/15 p-2 flex items-center gap-2 mb-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { size: 12, className: "text-blue-400 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Questions timer today" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs font-bold text-blue-400 tabular-nums", children: formatHMS(questionsSectionTime) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-amber-500/8 border border-amber-500/15 p-2 flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { size: 12, className: "text-amber-400 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Pomodoro focus today" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs font-bold text-amber-400 tabular-nums", children: formatHMS(pomodoroTodayTime) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-2 flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { size: 12, className: "text-emerald-400 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Total active time today" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-bold text-emerald-400 tabular-nums", children: formatHMS(combinedTotalSecs) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2.5 rounded-lg bg-muted/40", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-foreground leading-none", children: formatHours(remaining) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Remaining" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2.5 rounded-lg bg-muted/40", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-xl font-bold text-primary leading-none", children: [
                      Math.round(actualPct),
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Complete" })
                  ] })
                ] })
              ] })
            ] }) })
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -12 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.1 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 16, className: "text-primary" }),
              "Log Study Hours",
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
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: allSubjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Hours Studied" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 0.5,
                    max: 15,
                    step: 0.5,
                    placeholder: "e.g. 2.5",
                    value: hoursInput,
                    onChange: handleHoursChange,
                    className: "bg-muted/40 border-input focus:border-primary/50 font-mono"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Debounce auto-saves · or click button below to save immediately" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "w-full gap-2",
                  onClick: () => triggerSave(subject, hoursInput),
                  disabled: !subject || !hoursInput || saveStatus === "saving",
                  "data-ocid": "studyplan.submit_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13 }),
                    "Log Hours"
                  ]
                }
              ),
              showSubjectTimer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 p-3 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { size: 13, className: "text-primary shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Session Timer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto font-mono text-xl font-bold text-primary tabular-nums", children: [
                    String(subjectTimerMins).padStart(2, "0"),
                    ":",
                    String(subjectTimerRemSecs).padStart(2, "0")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "h-full bg-primary rounded-full",
                    animate: {
                      width: `${(subjectTimerInitial - subjectTimerSecs) / subjectTimerInitial * 100}%`
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
                      onClick: handleTimerToggle,
                      children: subjectTimerRunning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 11 }),
                        "Pause"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 11 }),
                        subjectTimerSecs === subjectTimerInitial ? "Start" : "Resume"
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
                        setSubjectTimerRunning(false);
                        onSectionTimerPause == null ? void 0 : onSectionTimerPause();
                        setSubjectTimerSecs(subjectTimerInitial);
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
          transition: { delay: 0.15 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border h-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 16, className: "text-primary" }),
              "Today's Breakdown",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] font-normal text-muted-foreground", children: "(from backend)" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-muted" }, i)) }) : Object.keys(todaySubjectMap).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Target,
                {
                  size: 24,
                  className: "text-muted-foreground mb-2 opacity-50"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No sessions logged today" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Start logging your study hours" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: Object.entries(todaySubjectMap).map(([sub, hrs], i) => {
              const pct = Math.min(
                hrs / DAILY_TARGET_HOURS * 100,
                100
              );
              const colorClass = SUBJECT_COLORS[sub] ?? "bg-muted/40 text-foreground border-border";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: 10 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: i * 0.05 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `text-xs font-semibold px-2 py-0.5 rounded border ${colorClass}`,
                          children: sub
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground font-semibold", children: formatHours(hrs) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        initial: { width: 0 },
                        animate: { width: `${pct}%` },
                        transition: {
                          duration: 0.5,
                          delay: i * 0.05
                        },
                        className: "h-full bg-primary rounded-full"
                      }
                    ) })
                  ]
                },
                sub
              );
            }) }) }) })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2 },
        className: "mb-6",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 16, className: "text-primary" }),
            "7-Day Overview"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-2", children: weeklyData.map(({ date, hours }, i) => {
              const pct = Math.min(hours / DAILY_TARGET_HOURS * 100, 100);
              const isToday = date === today;
              const goalMet2 = hours >= DAILY_TARGET_HOURS;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.2 + i * 0.04 },
                  className: `flex flex-col items-center gap-2 p-2 rounded-lg ${isToday ? "bg-primary/10 border border-primary/30" : "bg-muted/30"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-[10px] font-medium truncate w-full text-center ${isToday ? "text-primary" : "text-muted-foreground"}`,
                        children: getDayLabel(date)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-16 bg-muted/60 rounded relative overflow-hidden flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        initial: { height: 0 },
                        animate: { height: `${pct}%` },
                        transition: {
                          duration: 0.6,
                          delay: 0.3 + i * 0.06,
                          ease: "easeOut"
                        },
                        className: `w-full rounded ${goalMet2 ? "bg-primary" : "bg-primary/50"}`
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] font-bold text-foreground", children: formatHours(hours) }),
                      goalMet2 && /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 10, className: "text-primary" })
                    ] })
                  ]
                },
                date
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-3 border-t border-border flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Weekly total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-bold text-primary", children: formatHours(weeklyData.reduce((a, d) => a + d.hours, 0)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "/ ",
                  DAILY_TARGET_HOURS * 7,
                  "h target"
                ] })
              ] })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.25 },
        className: "mb-4",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collapsible, { open: mockTestOpen, onOpenChange: setMockTestOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 cursor-pointer hover:bg-muted/20 transition-colors rounded-t-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 16, className: "text-primary" }),
            "Mock Test Scores",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border-primary/20 text-xs ml-1", children: mockScoresList.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-muted-foreground", children: mockTestOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 }) })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-0 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-3 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Add New Score" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Subject" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: mockSubject,
                      onValueChange: setMockSubject,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-muted/40 border-input text-sm h-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select..." }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: allSubjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "date",
                      value: mockDate,
                      onChange: (e) => setMockDate(e.target.value),
                      className: "bg-muted/40 border-input h-8 text-sm"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Score" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 0,
                      placeholder: "e.g. 145",
                      value: mockScore,
                      onChange: (e) => setMockScore(e.target.value),
                      className: "bg-muted/40 border-input h-8 text-sm font-mono"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Total Marks" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 1,
                      placeholder: "200",
                      value: mockTotalMarks,
                      onChange: (e) => setMockTotalMarks(e.target.value),
                      className: "bg-muted/40 border-input h-8 text-sm font-mono"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  className: "w-full bg-primary text-primary-foreground",
                  onClick: handleAddMockScore,
                  disabled: addMockScore.isPending,
                  children: addMockScore.isPending ? "Saving..." : "Save Mock Score"
                }
              )
            ] }),
            mockScoresList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [...mockScoresList].reverse().map((entry, i) => {
              const pct = Math.round(
                Number(entry.score) / Number(entry.totalMarks) * 100
              );
              const colorClass = SUBJECT_COLORS[entry.subject] ?? "bg-muted/20 text-foreground border-border";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-3 rounded-lg p-2.5 border border-border bg-muted/20",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-xs font-semibold px-2 py-0.5 rounded border shrink-0 ${colorClass}`,
                        children: entry.subject
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs font-bold text-foreground", children: [
                          Number(entry.score),
                          "/",
                          Number(entry.totalMarks)
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: entry.date })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "h-full bg-primary rounded-full",
                            style: { width: `${pct}%` }
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: `text-xs font-mono font-bold ${pct >= 70 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-red-400"}`,
                            children: [
                              pct,
                              "%"
                            ]
                          }
                        )
                      ] })
                    ] })
                  ]
                },
                `${entry.date}-${i}`
              );
            }) }) })
          ] }) })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.3 },
        className: "mb-6",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Collapsible,
          {
            open: customSubjectsOpen,
            onOpenChange: setCustomSubjectsOpen,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 cursor-pointer hover:bg-muted/20 transition-colors rounded-t-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 16, className: "text-primary" }),
                "Custom Subjects",
                customSubjects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border-primary/20 text-xs ml-1", children: customSubjects.length }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-muted-foreground", children: customSubjectsOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 }) })
              ] }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-0 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "New subject name...",
                      value: newCustomSubject,
                      onChange: (e) => setNewCustomSubject(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") handleAddCustomSubject();
                      },
                      className: "bg-muted/40 border-input focus:border-primary/50 text-sm"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      className: "bg-primary text-primary-foreground shrink-0",
                      onClick: handleAddCustomSubject,
                      disabled: setCustomSubjectsMutation.isPending,
                      children: "Add"
                    }
                  )
                ] }),
                customSubjects.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-2", children: "No custom subjects yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: customSubjects.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-muted/30 text-xs font-medium text-foreground",
                    children: [
                      sub,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleRemoveCustomSubject(sub),
                          className: "text-muted-foreground hover:text-destructive transition-colors",
                          "aria-label": `Remove ${sub}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 11 })
                        }
                      )
                    ]
                  },
                  sub
                )) })
              ] }) })
            ] })
          }
        )
      }
    ),
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
        "Study Plan Progress Charts"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Select Date:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              value: chartSelectedDate,
              max: today,
              onChange: (e) => setChartSelectedDate(e.target.value),
              className: "h-8 px-2 text-sm rounded-md border border-input bg-muted/40 text-foreground focus:outline-none focus:border-primary/50"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold text-foreground mb-3 font-display", children: chartSelectedDate === today ? "Today's Progress" : `Progress on ${chartSelectedDate}` }),
            chartDayData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-44 text-muted-foreground/50 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 28, className: "opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No data for this date" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Pie,
                {
                  data: chartDayData,
                  cx: "50%",
                  cy: "50%",
                  innerRadius: 45,
                  outerRadius: 70,
                  paddingAngle: 2,
                  dataKey: "value",
                  children: chartDayData.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Cell,
                    {
                      fill: SUBJECT_HEX_COLORS[entry.name] ?? `hsl(${idx * 60 % 360}, 60%, 55%)`
                    },
                    entry.name
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  formatter: (value) => [`${value}h`, ""],
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
            chartMonthData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-44 text-muted-foreground/50 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 28, className: "opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No data this month" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Pie,
                {
                  data: chartMonthData,
                  cx: "50%",
                  cy: "50%",
                  innerRadius: 45,
                  outerRadius: 70,
                  paddingAngle: 2,
                  dataKey: "value",
                  children: chartMonthData.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Cell,
                    {
                      fill: SUBJECT_HEX_COLORS[entry.name] ?? `hsl(${idx * 60 % 360}, 60%, 55%)`
                    },
                    entry.name
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  formatter: (value) => [`${value}h`, ""],
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
        "Previous 30-Day Cycles"
      ] }) }),
      studyPlanCycles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "No archived cycles yet. Data will appear here after 30 days." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Start" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "End" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Days" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: studyPlanCycles.map((cycle, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
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
  StudyPlanTab as default
};
