import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  History,
  Palette,
  Pause,
  PieChart,
  Play,
  PlusCircle,
  RotateCcw,
  Star,
  Target,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import type { Section, SubjectQuestionProgress } from "../backend.d";
import {
  useGetCustomSubjects,
  useGetPlanCycles,
  useGetQuestionProgress,
  useGetTargets,
  useSavePlanCycle,
  useSaveSectionTimeLog,
  useSetQuestionCount,
} from "../hooks/useQueries";
import MonthlyPlanSection from "./MonthlyPlanSection";
import SectionStylePanel, { useSectionStyle } from "./SectionStylePanel";
import TargetsPanel from "./TargetsPanel";

// ── localStorage helpers for timer persistence ────────────────────────────
const Q_TIMER_KEY = "ssc_questions_timer_state";
const Q_SECTION_TIME_PREFIX = "ssc_section_time_questions_";
const Q_CYCLE_KEY = "ssc_cycle_start_questions";

interface QTimerState {
  subject: string;
  countInput: string;
  timerSecs: number;
  timerInitial: number;
  running: boolean;
  savedAt: number;
  elapsedSecs: number;
}

function loadQTimerState(): QTimerState | null {
  try {
    const s = localStorage.getItem(Q_TIMER_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function getQSectionTimeToday(): number {
  const today = new Date().toISOString().split("T")[0];
  const key = Q_SECTION_TIME_PREFIX + today;
  return Number(localStorage.getItem(key) ?? 0);
}

function addQSectionTimeToday(secs: number) {
  const today = new Date().toISOString().split("T")[0];
  const key = Q_SECTION_TIME_PREFIX + today;
  const current = Number(localStorage.getItem(key) ?? 0);
  localStorage.setItem(key, String(current + secs));
}

function daysDiffQ(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

// ── Daily question count helpers (localStorage) ──────────────────────────
const DAILY_Q_PREFIX = "ssc_daily_q_";

function getDailyQKey(subjectName: string, date: string): string {
  return `${DAILY_Q_PREFIX}${subjectName}_${date}`;
}

function getTodayQCount(subjectName: string, today: string): number {
  const key = getDailyQKey(subjectName, today);
  const val = localStorage.getItem(key);
  return val !== null ? Number(val) : 0;
}

function setTodayQCount(subjectName: string, today: string, count: number) {
  const key = getDailyQKey(subjectName, today);
  localStorage.setItem(key, String(count));
}

interface QuestionsTabProps {
  onSectionTimerStart?: (label: string, secs: number) => void;
  onSectionTimerPause?: () => void;
  onSectionTimerUpdate?: (
    label: string,
    secs: number,
    running: boolean,
  ) => void;
  onSyncPomodoro?: (durationSecs: number) => void;
}

// Hex colors for recharts slices
const SUBJECT_HEX_COLORS_Q: Record<string, string> = {
  Maths: "#e11d48",
  English: "#3b82f6",
  Reasoning: "#a855f7",
  "General Knowledge": "#f59e0b",
  "Current Affairs": "#10b981",
  Computer: "#06b6d4",
  Science: "#22c55e",
};

const SUBJECT_DISPLAY: Record<
  string,
  { color: string; icon: React.ReactNode }
> = {
  Maths: {
    color: "text-primary bg-primary/10 border-primary/30",
    icon: <Target size={14} />,
  },
  English: {
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    icon: <BookOpen size={14} />,
  },
  Reasoning: {
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    icon: <Zap size={14} />,
  },
  "General Knowledge": {
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    icon: <Star size={14} />,
  },
  "Current Affairs": {
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    icon: <Flame size={14} />,
  },
  Computer: {
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    icon: <CheckCircle2 size={14} />,
  },
  Science: {
    color: "text-green-400 bg-green-500/10 border-green-500/30",
    icon: <Zap size={14} />,
  },
};

const MILESTONE_LABELS = [
  { pct: 0.11, label: "1K Hustler", icon: <Flame size={14} /> },
  { pct: 0.28, label: "2.5K Warrior", icon: <Zap size={14} /> },
  { pct: 0.56, label: "Champion", icon: <Award size={14} /> },
  { pct: 0.83, label: "Legend", icon: <Star size={14} /> },
  { pct: 1.0, label: "Master", icon: <Trophy size={14} /> },
];

function getMotivationalMessage(total: number, goal: number): string {
  const pct = (total / goal) * 100;
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

interface CircularProgressBigProps {
  total: number;
  goal: number;
}

function CircularProgressBig({ total, goal }: CircularProgressBigProps) {
  const pct = Math.min(total / goal, 1);
  const size = 180;
  const strokeWidth = 14;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg]"
        role="img"
        aria-label={`Questions progress: ${Math.round((total / goal) * 100)}%`}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="oklch(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="oklch(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="font-display text-4xl font-bold text-foreground leading-none"
        >
          {total.toLocaleString()}
        </motion.span>
        <span className="text-xs text-muted-foreground mt-1">
          of {goal.toLocaleString()}
        </span>
        <span className="font-mono text-sm font-bold text-primary mt-0.5">
          {Math.round((total / goal) * 100)}%
        </span>
      </div>
    </div>
  );
}

type SaveStatus = "idle" | "saving" | "saved";

export default function QuestionsTab({
  onSectionTimerStart,
  onSectionTimerPause,
  onSectionTimerUpdate,
  onSyncPomodoro,
}: QuestionsTabProps) {
  const { data: rawProgress = [], isLoading } = useGetQuestionProgress();
  const { data: targets } = useGetTargets();
  const { data: planCycles = [] } = useGetPlanCycles();
  const { data: customSubjects = [] } = useGetCustomSubjects();
  const setQuestionCount = useSetQuestionCount();
  const savePlanCycleMutation = useSavePlanCycle();
  const saveSectionTimeLog = useSaveSectionTimeLog();

  const today = new Date().toISOString().split("T")[0];

  // ── 30-day cycle ─────────────────────────────────────────────────────────
  const [cycleStart, setCycleStart] = useState<string>(() => {
    return localStorage.getItem(Q_CYCLE_KEY) ?? today;
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const savePlanCycleMutateRef = useRef(savePlanCycleMutation.mutate);
  savePlanCycleMutateRef.current = savePlanCycleMutation.mutate;
  const saveSectionTimeLogMutateRef = useRef(saveSectionTimeLog.mutate);
  saveSectionTimeLogMutateRef.current = saveSectionTimeLog.mutate;

  const dayOfCycle = Math.min(daysDiffQ(cycleStart, today) + 1, 30);

  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const savedCycleStart = localStorage.getItem(Q_CYCLE_KEY);
    if (!savedCycleStart) {
      localStorage.setItem(Q_CYCLE_KEY, todayStr);
      setCycleStart(todayStr);
    } else {
      const diff = daysDiffQ(savedCycleStart, todayStr);
      if (diff >= 30) {
        savePlanCycleMutateRef.current({
          section: "questions" as Section,
          startDate: savedCycleStart,
          endDate: todayStr,
          summary: diff,
        });
        localStorage.setItem(Q_CYCLE_KEY, todayStr);
        setCycleStart(todayStr);
      }
    }
  }, []);

  // Filter cycles for questions section
  const questionCycles = planCycles.filter((c) => c.section === "questions");

  const TOTAL_GOAL = Number(targets?.totalQuestionsGoal ?? 9000);

  // Build subject targets list dynamically from backend targets
  const SUBJECT_TARGETS = useMemo(() => {
    const subjectTargets = targets?.subjectTargets ?? [];
    return subjectTargets.map((s) => ({
      name: s.name,
      target: Number(s.target),
      isCustom: false,
      ...(SUBJECT_DISPLAY[s.name] ?? {
        color: "text-foreground bg-muted/20 border-border",
        icon: <Target size={14} />,
      }),
    }));
  }, [targets?.subjectTargets]);

  // Merged subject list: standard + custom (no duplicates)
  const defaultSubjectNames = useMemo(
    () => new Set(SUBJECT_TARGETS.map((s) => s.name)),
    [SUBJECT_TARGETS],
  );

  const allSubjects = useMemo(() => {
    const extra = customSubjects
      .filter((name) => !defaultSubjectNames.has(name))
      .map((name) => ({
        name,
        target: 0,
        isCustom: true,
        color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
        icon: <Target size={14} />,
      }));
    return [...SUBJECT_TARGETS, ...extra];
  }, [SUBJECT_TARGETS, customSubjects, defaultSubjectNames]);

  // Build milestones dynamically from total goal
  const MILESTONES = useMemo(() => {
    return MILESTONE_LABELS.map((m) => ({
      count: Math.round(TOTAL_GOAL * m.pct),
      label: m.label,
      icon: m.icon,
    }));
  }, [TOTAL_GOAL]);

  const [subject, setSubject] = useState("");
  const [countInput, setCountInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Per-question solve time ───────────────────────────────────────────────
  const [perQTimeSecs, setPerQTimeSecs] = useState<number>(() => {
    const s = localStorage.getItem("ssc_per_q_time");
    return s ? Number(s) : 60;
  });

  const savePerQTime = (secs: number) => {
    setPerQTimeSecs(secs);
    localStorage.setItem("ssc_per_q_time", String(secs));
  };

  const PER_Q_PRESETS = [
    { label: "10s", secs: 10 },
    { label: "30s", secs: 30 },
    { label: "1m", secs: 60 },
    { label: "2m", secs: 120 },
    { label: "3m", secs: 180 },
    { label: "5m", secs: 300 },
  ];

  // ── Subject question countdown timer (with persistence) ──────────────────
  const [qTimerSecs, setQTimerSecs] = useState(0);
  const [qTimerRunning, setQTimerRunning] = useState(false);
  const [qTimerInitial, setQTimerInitial] = useState(0);
  const qTimerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const qElapsedRef = useRef(0);

  // ── Flag to skip reset effect when restoring from storage ────────────────
  const isQRestoringRef = useRef(false);

  // Restore timer state from localStorage on mount
  useEffect(() => {
    const saved = loadQTimerState();
    if (saved?.subject && saved.timerInitial > 0) {
      // Mark restore in progress so reset effect is skipped
      isQRestoringRef.current = true;

      const elapsed = Math.floor((Date.now() - saved.savedAt) / 1000);
      const restored = saved.running
        ? Math.max(0, saved.timerSecs - elapsed)
        : saved.timerSecs;

      setSubject(saved.subject);
      setCountInput(saved.countInput);
      setQTimerSecs(restored);
      setQTimerInitial(saved.timerInitial);
      qElapsedRef.current = saved.running
        ? saved.elapsedSecs + elapsed
        : saved.elapsedSecs;

      if (saved.running && restored > 0) {
        setQTimerRunning(true);
      }

      // Clear restore flag after state updates settle
      setTimeout(() => {
        isQRestoringRef.current = false;
      }, 0);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveQTimerState = useCallback(
    (
      sub: string,
      cnt: string,
      secs: number,
      initial: number,
      running: boolean,
      elapsed: number,
    ) => {
      const state: QTimerState = {
        subject: sub,
        countInput: cnt,
        timerSecs: secs,
        timerInitial: initial,
        running,
        savedAt: Date.now(),
        elapsedSecs: elapsed,
      };
      localStorage.setItem(Q_TIMER_KEY, JSON.stringify(state));
    },
    [],
  );

  const isFirstQMount = useRef(true);

  // Reset timer when subject, count, or per-question time change (but not on restore)
  useEffect(() => {
    if (isFirstQMount.current) {
      isFirstQMount.current = false;
      return;
    }
    // Skip if we are in the middle of restoring from localStorage
    if (isQRestoringRef.current) {
      return;
    }
    setQTimerRunning(false);
    if (qTimerIntervalRef.current) clearInterval(qTimerIntervalRef.current);
    const n = Number.parseInt(countInput, 10);
    if (subject && !Number.isNaN(n) && n > 0) {
      const secs = n * perQTimeSecs;
      setQTimerSecs(secs);
      setQTimerInitial(secs);
      saveQTimerState(subject, countInput, secs, secs, false, 0);
    } else {
      setQTimerSecs(0);
      setQTimerInitial(0);
    }
  }, [subject, countInput, perQTimeSecs, saveQTimerState]);

  // Keep stable refs for callbacks so the interval doesn't need them in deps
  const subjectRef = useRef(subject);
  subjectRef.current = subject;
  const countInputRef = useRef(countInput);
  countInputRef.current = countInput;
  const qTimerInitialRef = useRef(qTimerInitial);
  qTimerInitialRef.current = qTimerInitial;
  const onSectionTimerPauseRef = useRef(onSectionTimerPause);
  onSectionTimerPauseRef.current = onSectionTimerPause;
  const onSectionTimerUpdateRef = useRef(onSectionTimerUpdate);
  onSectionTimerUpdateRef.current = onSectionTimerUpdate;

  // Countdown tick with persistence and section time tracking
  useEffect(() => {
    if (qTimerRunning) {
      qTimerIntervalRef.current = setInterval(() => {
        qElapsedRef.current += 1;
        addQSectionTimeToday(1);
        setQTimerSecs((s) => {
          const next = s <= 1 ? 0 : s - 1;
          onSectionTimerUpdateRef.current?.(subjectRef.current, next, true);
          if (s <= 1) {
            setQTimerRunning(false);
            toast.success("Question session complete!");
            onSectionTimerPauseRef.current?.();
          }
          saveQTimerState(
            subjectRef.current,
            countInputRef.current,
            next,
            qTimerInitialRef.current,
            s > 1,
            qElapsedRef.current,
          );
          return next;
        });
      }, 1000);
    } else {
      if (qTimerIntervalRef.current) clearInterval(qTimerIntervalRef.current);
      saveQTimerState(
        subjectRef.current,
        countInputRef.current,
        // Read current secs from ref-captured state via functional updater below
        // We write state below in a separate effect when paused
        0, // placeholder — overwritten by the pause-save effect
        qTimerInitialRef.current,
        false,
        qElapsedRef.current,
      );
    }
    return () => {
      if (qTimerIntervalRef.current) clearInterval(qTimerIntervalRef.current);
    };
  }, [qTimerRunning, saveQTimerState]); // eslint-disable-line react-hooks/exhaustive-deps

  // When timer is paused, persist the current secs accurately
  useEffect(() => {
    if (!qTimerRunning) {
      saveQTimerState(
        subject,
        countInput,
        qTimerSecs,
        qTimerInitial,
        false,
        qElapsedRef.current,
      );
    }
  }, [
    qTimerRunning,
    subject,
    countInput,
    qTimerSecs,
    qTimerInitial,
    saveQTimerState,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save section time log to backend on unmount
  useEffect(() => {
    return () => {
      const elapsed = getQSectionTimeToday();
      if (elapsed > 0) {
        saveSectionTimeLogMutateRef.current({
          section: "questions" as Section,
          date: new Date().toISOString().split("T")[0],
          elapsedSeconds: elapsed,
        });
      }
    };
  }, []);

  const qTimerMins = Math.floor(qTimerSecs / 60);
  const qTimerRemSecs = qTimerSecs % 60;
  const showQTimer =
    subject !== "" && Number.parseInt(countInput, 10) > 0 && qTimerInitial > 0;

  // Build a map from backend data
  const progressMap: Record<string, number> = {};
  for (const p of rawProgress as SubjectQuestionProgress[]) {
    progressMap[p.subjectName] = Number(p.count);
  }

  // Stable ref to access progressMap in callbacks without dep churn
  const progressMapRef = useRef(progressMap);
  progressMapRef.current = progressMap;

  const totalSolved = (rawProgress as SubjectQuestionProgress[]).reduce(
    (a, p) => a + Number(p.count),
    0,
  );
  const totalPct = Math.min((totalSolved / TOTAL_GOAL) * 100, 100);

  const triggerSave = useCallback(
    (subj: string, countStr: string) => {
      const n = Number.parseInt(countStr, 10);
      if (!subj || Number.isNaN(n) || n < 0 || n > 99999) return;

      setSaveStatus("saving");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);

      // Also save today's daily count in localStorage (sync)
      const todayStr = new Date().toISOString().split("T")[0];
      setTodayQCount(subj, todayStr, n);
      setTodayQCounts((prev) => ({ ...prev, [subj]: n }));

      setQuestionCount.mutate(
        { subjectName: subj, count: n },
        {
          onSuccess: () => {
            setSaveStatus("saved");
            savedTimerRef.current = setTimeout(
              () => setSaveStatus("idle"),
              3000,
            );
          },
          onError: () => {
            setSaveStatus("idle");
            toast.error("Failed to save questions");
          },
        },
      );
    },
    [setQuestionCount],
  );

  const handleSubjectChange = useCallback((val: string) => {
    setSubject(val);
    // Pre-populate with current known count — don't auto-save; user must manually edit count to trigger save
    const currentCount = progressMapRef.current[val] ?? 0;
    setCountInput(String(currentCount));
  }, []);

  const handleCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setCountInput(val);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (subject) triggerSave(subject, val);
      }, 600);
    },
    [subject, triggerSave],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  // ── Progress chart dialog ─────────────────────────────────────────────────
  const [progressChartOpen, setProgressChartOpen] = useState(false);
  const [chartSelectedDate, setChartSelectedDate] = useState(today);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const styleBtnRef = useRef<HTMLButtonElement>(null);
  const { style: sectionStyle } = useSectionStyle("questions");

  // ── Today's daily question counts (from localStorage) ────────────────────
  const [todayQCounts, setTodayQCounts] = useState<Record<string, number>>(
    () => {
      const result: Record<string, number> = {};
      return result;
    },
  );

  // Refresh today's counts from localStorage whenever relevant data loads
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const result: Record<string, number> = {};
    for (const s of allSubjects) {
      result[s.name] = getTodayQCount(s.name, todayStr);
    }
    setTodayQCounts(result);
  }, [allSubjects]);

  const todayTotalQ = useMemo(() => {
    return Object.values(todayQCounts).reduce((a, b) => a + b, 0);
  }, [todayQCounts]);

  // Build chart data from progressMap (cumulative — both charts show same total progress)
  const questionChartData = useMemo(() => {
    return allSubjects
      .map((s) => ({
        name: s.name,
        value: progressMapRef.current[s.name] ?? 0,
      }))
      .filter((e) => e.value > 0);
  }, [allSubjects]);

  return (
    <div className="p-6 max-w-4xl mx-auto" style={sectionStyle}>
      {/* Section Style Panel */}
      {showStylePanel && (
        <SectionStylePanel
          sectionId="questions"
          sectionLabel="Questions"
          onClose={() => setShowStylePanel(false)}
          anchorRef={styleBtnRef as React.RefObject<HTMLElement | null>}
        />
      )}
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Trophy size={16} className="text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {TOTAL_GOAL.toLocaleString()} Questions Challenge
          </h2>
          <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-xs font-mono">
            Day {dayOfCycle} / 30
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            {/* Section Style */}
            <Button
              ref={styleBtnRef}
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50"
              onClick={() => setShowStylePanel((p) => !p)}
              title="Customize section style"
              data-ocid="questions.style.button"
            >
              <Palette size={13} />
            </Button>
            {/* Progress charts icon */}
            <Button
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50"
              onClick={() => setProgressChartOpen(true)}
              title="View progress charts"
              data-ocid="questions.progress.button"
            >
              <PieChart size={13} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 border-border text-muted-foreground hover:text-foreground"
              onClick={() => setHistoryOpen(true)}
              title="View previous 30-day cycles"
            >
              <History size={12} />
              History
            </Button>
            <TargetsPanel />
          </div>
        </div>
        <p className="text-sm text-muted-foreground ml-11">
          Solve {TOTAL_GOAL.toLocaleString()} targeted questions across all SSC
          CGL subjects
        </p>
      </motion.div>

      {/* Hero Progress Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
      >
        <Card
          className={`border overflow-hidden ${totalSolved >= TOTAL_GOAL ? "border-primary/40 bg-primary/5" : "border-border"}`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="shrink-0">
                <CircularProgressBig total={totalSolved} goal={TOTAL_GOAL} />
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Overall Progress
                  </h3>
                  {totalSolved >= TOTAL_GOAL && (
                    <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                      <Trophy size={10} className="mr-1" />
                      Completed!
                    </Badge>
                  )}
                </div>

                <Progress
                  value={totalPct}
                  className="h-3 bg-muted mb-4 rounded-full"
                />

                {/* Motivational message */}
                <div className="p-3 rounded-lg bg-muted/40 border border-border mb-4">
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {getMotivationalMessage(totalSolved, TOTAL_GOAL)}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2.5 rounded-lg bg-muted/40">
                    <p className="font-display text-lg font-bold text-primary leading-none">
                      {totalSolved.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Solved
                    </p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-muted/40">
                    <p className="font-display text-lg font-bold text-foreground leading-none">
                      {(TOTAL_GOAL - totalSolved).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Remaining
                    </p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-muted/40">
                    <p className="font-display text-lg font-bold text-foreground leading-none">
                      {Math.round(totalPct)}%
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Complete
                    </p>
                  </div>
                </div>

                {/* Today's total */}
                <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Clock size={13} className="text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-400 font-semibold">
                    Today:
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-300">
                    {todayTotalQ.toLocaleString()} questions
                  </span>
                  {allSubjects.filter((s) => (todayQCounts[s.name] ?? 0) > 0)
                    .length > 0 && (
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      across{" "}
                      {
                        allSubjects.filter(
                          (s) => (todayQCounts[s.name] ?? 0) > 0,
                        ).length
                      }{" "}
                      subject
                      {allSubjects.filter(
                        (s) => (todayQCounts[s.name] ?? 0) > 0,
                      ).length !== 1
                        ? "s"
                        : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
              <Award size={16} className="text-primary" />
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {MILESTONES.map((m, i) => {
                const achieved = totalSolved >= m.count;
                return (
                  <motion.div
                    key={m.count}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border shrink-0 min-w-[88px] transition-all ${
                      achieved
                        ? "bg-primary/15 border-primary/40"
                        : "bg-muted/30 border-border opacity-50"
                    }`}
                  >
                    <span
                      className={
                        achieved ? "text-primary" : "text-muted-foreground"
                      }
                    >
                      {m.icon}
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {m.count.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">
                      {m.label}
                    </span>
                    {achieved && (
                      <CheckCircle2 size={10} className="text-primary" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Log Questions Form */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
                <PlusCircle size={16} className="text-primary" />
                Log Questions (Today + 9000 Goal)
                {/* Save status indicator */}
                <span className="ml-auto">
                  {saveStatus === "saving" && (
                    <span className="flex items-center gap-1 text-muted-foreground text-xs font-normal">
                      <span className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                      Saving…
                    </span>
                  )}
                  {saveStatus === "saved" && (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-normal">
                      <CheckCircle2 size={12} />
                      Saved
                    </span>
                  )}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Today badge */}
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-medium gap-1.5">
                    <Clock size={10} />
                    {new Date().toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    · Editable all day
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Subject
                  </Label>
                  <Select value={subject} onValueChange={handleSubjectChange}>
                    <SelectTrigger className="bg-muted/40 border-input focus:border-primary/50">
                      <SelectValue placeholder="Select subject..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allSubjects.map((s) => (
                        <SelectItem key={s.name} value={s.name}>
                          {s.name}
                          {s.isCustom
                            ? " (custom)"
                            : s.target > 0
                              ? ` (${s.target.toLocaleString()} target)`
                              : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Total Questions Solved
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 350"
                    value={countInput}
                    onChange={handleCountChange}
                    className="bg-muted/40 border-input focus:border-primary/50 font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Sets your running total for the{" "}
                    {TOTAL_GOAL.toLocaleString()} goal AND logs today's count.
                  </p>
                </div>

                {/* Per-question time presets + slider */}
                <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Timer size={12} className="text-primary" />
                    <span className="text-xs font-semibold text-foreground">
                      Per-Question Time
                    </span>
                    <span className="ml-auto text-xs font-mono text-primary font-bold">
                      {perQTimeSecs < 60
                        ? `${perQTimeSecs}s`
                        : `${Math.floor(perQTimeSecs / 60)}m ${perQTimeSecs % 60 > 0 ? `${perQTimeSecs % 60}s` : ""}`}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {PER_Q_PRESETS.map((p) => (
                      <button
                        key={p.secs}
                        type="button"
                        onClick={() => savePerQTime(p.secs)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                          perQTimeSecs === p.secs
                            ? "bg-primary/20 border-primary text-primary"
                            : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/30"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[9px] text-muted-foreground">
                      10s
                    </span>
                    <input
                      type="range"
                      min={10}
                      max={300}
                      step={5}
                      value={perQTimeSecs}
                      onChange={(e) => savePerQTime(Number(e.target.value))}
                      className="flex-1 h-1.5 accent-primary cursor-pointer"
                    />
                    <span className="text-[9px] text-muted-foreground">5m</span>
                  </div>
                </div>

                {/* Question session countdown timer */}
                {showQTimer && (
                  <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Timer size={13} className="text-primary shrink-0" />
                      <span className="text-xs font-semibold text-foreground">
                        Session Timer
                      </span>
                      <span className="ml-auto font-mono text-xl font-bold text-primary tabular-nums">
                        {String(qTimerMins).padStart(2, "0")}:
                        {String(qTimerRemSecs).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {perQTimeSecs < 60
                        ? `${perQTimeSecs}s`
                        : `${Math.floor(perQTimeSecs / 60)}m`}
                      /question · {Number.parseInt(countInput, 10)} questions ·
                      at{" "}
                      {perQTimeSecs < 60
                        ? `${perQTimeSecs}s`
                        : `${Math.floor(perQTimeSecs / 60)}m`}
                      /question
                    </p>
                    {/* Mini progress bar */}
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        animate={{
                          width: `${((qTimerInitial - qTimerSecs) / qTimerInitial) * 100}%`,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs gap-1"
                        onClick={() => {
                          setQTimerRunning((r) => {
                            const next = !r;
                            if (next) {
                              onSectionTimerStart?.(subject, qTimerSecs);
                              onSyncPomodoro?.(qTimerInitial);
                            } else {
                              onSectionTimerPause?.();
                            }
                            return next;
                          });
                        }}
                      >
                        {qTimerRunning ? (
                          <>
                            <Pause size={11} />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play size={11} />
                            {qTimerSecs === qTimerInitial ? "Start" : "Resume"}
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs px-2 text-muted-foreground"
                        onClick={() => {
                          setQTimerRunning(false);
                          onSectionTimerPause?.();
                          setQTimerSecs(qTimerInitial);
                        }}
                      >
                        <RotateCcw size={11} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
                <BookOpen size={16} className="text-primary" />
                Subject Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-muted" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {allSubjects.map((sub, i) => {
                      const solved = progressMap[sub.name] ?? 0;
                      const pct =
                        sub.target > 0
                          ? Math.min((solved / sub.target) * 100, 100)
                          : 0;
                      const done = sub.target > 0 && solved >= sub.target;
                      const todayCount = todayQCounts[sub.name] ?? 0;
                      return (
                        <motion.div
                          key={sub.name}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.05 }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border ${sub.color}`}
                              >
                                {sub.icon}
                                {sub.name}
                                {sub.isCustom && (
                                  <span className="text-[9px] opacity-70 ml-0.5">
                                    custom
                                  </span>
                                )}
                              </span>
                              {done && (
                                <CheckCircle2
                                  size={12}
                                  className="text-primary"
                                />
                              )}
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-xs font-bold text-foreground">
                                {solved.toLocaleString()}
                              </span>
                              {sub.target > 0 && (
                                <span className="text-[10px] text-muted-foreground">
                                  /{sub.target.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          {sub.target > 0 && (
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{
                                  duration: 0.6,
                                  delay: 0.25 + i * 0.05,
                                  ease: "easeOut",
                                }}
                                className={`h-full rounded-full ${done ? "bg-primary" : "bg-primary/60"}`}
                              />
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-0.5">
                            {sub.target > 0 ? (
                              <p className="text-[10px] text-muted-foreground">
                                {Math.round(pct)}%
                              </p>
                            ) : (
                              <span />
                            )}
                            {todayCount > 0 && (
                              <p className="text-[10px] text-emerald-400 font-medium">
                                Today: {todayCount.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Total row */}
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-foreground">
                        Total Progress
                      </span>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-primary">
                          {totalSolved.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          /{TOTAL_GOAL.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={totalPct}
                      className="h-2 bg-muted rounded-full"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Plan Section */}
      <MonthlyPlanSection />

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-[11px] text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </div>

      {/* Progress Chart Dialog */}
      <Dialog open={progressChartOpen} onOpenChange={setProgressChartOpen}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <PieChart size={16} className="text-primary" />
              Questions Progress Charts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Date selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium">
                Reference Date:
              </span>
              <input
                type="date"
                value={chartSelectedDate}
                max={today}
                onChange={(e) => setChartSelectedDate(e.target.value)}
                className="h-8 px-2 text-sm rounded-md border border-input bg-muted/40 text-foreground focus:outline-none focus:border-primary/50"
              />
              <span className="text-[10px] text-muted-foreground">
                (Shows cumulative totals)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Subject-wise breakdown (same data) */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <h4 className="text-xs font-bold text-foreground mb-3 font-display">
                  Subject-Wise Totals (Today)
                </h4>
                {questionChartData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-44 text-muted-foreground/50 gap-2">
                    <PieChart size={28} className="opacity-30" />
                    <p className="text-xs">No questions logged yet</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <RechartsPieChart>
                      <Pie
                        data={questionChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {questionChartData.map((entry, idx) => (
                          <Cell
                            key={entry.name}
                            fill={
                              SUBJECT_HEX_COLORS_Q[entry.name] ??
                              `hsl(${(idx * 60) % 360}, 60%, 55%)`
                            }
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => [
                          value.toLocaleString(),
                          "questions",
                        ]}
                        contentStyle={{
                          background: "oklch(0.18 0.01 20)",
                          border: "1px solid oklch(0.3 0.01 20)",
                          borderRadius: "8px",
                          fontSize: "11px",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: "10px", paddingTop: "4px" }}
                        formatter={(value) => (
                          <span style={{ color: "oklch(0.8 0.01 60)" }}>
                            {value}
                          </span>
                        )}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                )}
              </div>
              {/* Monthly progress (cumulative = same data) */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <h4 className="text-xs font-bold text-foreground mb-3 font-display">
                  Monthly Progress (
                  {new Date().toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                  )
                </h4>
                {questionChartData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-44 text-muted-foreground/50 gap-2">
                    <PieChart size={28} className="opacity-30" />
                    <p className="text-xs">No questions logged this month</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <RechartsPieChart>
                      <Pie
                        data={questionChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {questionChartData.map((entry, idx) => (
                          <Cell
                            key={entry.name}
                            fill={
                              SUBJECT_HEX_COLORS_Q[entry.name] ??
                              `hsl(${(idx * 60) % 360}, 60%, 55%)`
                            }
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => [
                          value.toLocaleString(),
                          "questions",
                        ]}
                        contentStyle={{
                          background: "oklch(0.18 0.01 20)",
                          border: "1px solid oklch(0.3 0.01 20)",
                          borderRadius: "8px",
                          fontSize: "11px",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: "10px", paddingTop: "4px" }}
                        formatter={(value) => (
                          <span style={{ color: "oklch(0.8 0.01 60)" }}>
                            {value}
                          </span>
                        )}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <History size={16} className="text-primary" />
              Previous 30-Day Question Cycles
            </DialogTitle>
          </DialogHeader>
          {questionCycles.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No archived cycles yet. Data will appear here after 30 days.
            </p>
          ) : (
            <ScrollArea className="max-h-80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead className="text-right">Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionCycles.map((cycle, i) => (
                    <TableRow key={`${cycle.startDate}-${i}`}>
                      <TableCell className="font-mono text-xs">
                        {cycle.startDate}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {cycle.endDate}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-primary font-bold">
                        {Number(cycle.summary)}d
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
