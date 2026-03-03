import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Flame,
  History,
  Pause,
  Play,
  PlusCircle,
  RotateCcw,
  Target,
  Timer,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Section } from "../backend.d";
import {
  useAddMockScoreFull,
  useGetCustomSubjects,
  useGetMockScores,
  useGetPlanCycles,
  useGetStudySessions,
  useGetTargets,
  useSavePlanCycle,
  useSaveSectionTimeLog,
  useSetCustomSubjects,
  useSetStudySession,
} from "../hooks/useQueries";
import TargetsPanel from "./TargetsPanel";

const SSC_SUBJECTS = [
  "Maths",
  "English",
  "Reasoning",
  "General Knowledge",
  "Current Affairs",
  "Computer",
  "Science",
];

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "bg-primary/20 text-primary border-primary/30",
  English: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Reasoning: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "General Knowledge": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Current Affairs": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Computer: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Science: "bg-green-500/20 text-green-400 border-green-500/30",
};

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function formatHours(h: number) {
  if (h < 1) return `${Math.round(h * 60)}m`;
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}

function getDayLabel(dateStr: string) {
  const d = new Date(`${dateStr}T12:00:00`);
  const today = getTodayDate();
  if (dateStr === today) return "Today";
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
}

function daysDiff(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

// localStorage keys for timer persistence
const SP_TIMER_KEY = "ssc_studyplan_timer_state";
const SP_SECTION_TIME_PREFIX = "ssc_section_time_studyplan_";
const SP_CYCLE_KEY = "ssc_cycle_start_studyplan";

interface TimerState {
  subject: string;
  hoursInput: string;
  timerSecs: number;
  timerInitial: number;
  running: boolean;
  savedAt: number;
  elapsedSecs: number;
}

function loadTimerState(): TimerState | null {
  try {
    const s = localStorage.getItem(SP_TIMER_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function getSectionTimeToday(): number {
  const key = SP_SECTION_TIME_PREFIX + getTodayDate();
  return Number(localStorage.getItem(key) ?? 0);
}

function addSectionTimeToday(secs: number) {
  const key = SP_SECTION_TIME_PREFIX + getTodayDate();
  const current = Number(localStorage.getItem(key) ?? 0);
  localStorage.setItem(key, String(current + secs));
}

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
}

function CircularProgress({
  value,
  max,
  size = 140,
  strokeWidth = 10,
}: CircularProgressProps) {
  const pct = Math.min(value / max, 1);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg
      width={size}
      height={size}
      className="rotate-[-90deg]"
      role="img"
      aria-label={`Study progress: ${Math.round((value / max) * 100)}%`}
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
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
}

type SaveStatus = "idle" | "saving" | "saved";

interface StudyPlanTabProps {
  onSectionTimerStart?: (label: string, secs: number) => void;
  onSectionTimerPause?: () => void;
  onSectionTimerUpdate?: (
    label: string,
    secs: number,
    running: boolean,
  ) => void;
}

export default function StudyPlanTab({
  onSectionTimerStart,
  onSectionTimerPause,
  onSectionTimerUpdate,
}: StudyPlanTabProps) {
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

  const DAILY_TARGET_HOURS = targets?.dailyStudyHoursTarget ?? 15;

  // ── All subjects (SSC + custom) ───────────────────────────────────────────
  const allSubjects = [...SSC_SUBJECTS, ...customSubjects];

  // ── Subject form ──────────────────────────────────────────────────────────
  const [subject, setSubject] = useState("");
  const [hoursInput, setHoursInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Custom subjects ───────────────────────────────────────────────────────
  const [newCustomSubject, setNewCustomSubject] = useState("");
  const [customSubjectsOpen, setCustomSubjectsOpen] = useState(false);

  // ── Mock test form ────────────────────────────────────────────────────────
  const [mockTestOpen, setMockTestOpen] = useState(false);
  const [mockSubject, setMockSubject] = useState("");
  const [mockScore, setMockScore] = useState("");
  const [mockTotalMarks, setMockTotalMarks] = useState("200");
  const [mockDate, setMockDate] = useState(getTodayDate());

  // ── 30-day cycle ─────────────────────────────────────────────────────────
  const [cycleStart, setCycleStart] = useState<string>(() => {
    return localStorage.getItem(SP_CYCLE_KEY) ?? getTodayDate();
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const savePlanCycleMutateRef = useRef(savePlanCycleMutation.mutate);
  savePlanCycleMutateRef.current = savePlanCycleMutation.mutate;

  const today = getTodayDate();
  const dayOfCycle = Math.min(daysDiff(cycleStart, today) + 1, 30);

  // On mount, check if cycle needs reset
  useEffect(() => {
    const todayStr = getTodayDate();
    const savedCycleStart = localStorage.getItem(SP_CYCLE_KEY);
    if (!savedCycleStart) {
      localStorage.setItem(SP_CYCLE_KEY, todayStr);
      setCycleStart(todayStr);
    } else {
      const diff = daysDiff(savedCycleStart, todayStr);
      if (diff >= 30) {
        savePlanCycleMutateRef.current({
          section: "studyplan" as Section,
          startDate: savedCycleStart,
          endDate: todayStr,
          summary: diff,
        });
        localStorage.setItem(SP_CYCLE_KEY, todayStr);
        setCycleStart(todayStr);
      }
    }
  }, []);

  // ── Subject countdown timer (with persistence) ────────────────────────────
  const [subjectTimerSecs, setSubjectTimerSecs] = useState(0);
  const [subjectTimerRunning, setSubjectTimerRunning] = useState(false);
  const [subjectTimerInitial, setSubjectTimerInitial] = useState(0);
  const subjectTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Actual elapsed time tracking ──────────────────────────────────────────
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [todayTotalElapsedSecs, setTodayTotalElapsedSecs] =
    useState(getSectionTimeToday);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedSecsRef = useRef(0);

  // ── Restore timer state from localStorage on mount ────────────────────────
  useEffect(() => {
    const saved = loadTimerState();
    if (saved?.subject && saved.timerInitial > 0) {
      // Compute how much time passed since savedAt
      const elapsed = Math.floor((Date.now() - saved.savedAt) / 1000);
      const restored = saved.running
        ? Math.max(0, saved.timerSecs - elapsed)
        : saved.timerSecs;
      const restoredElapsed = saved.running
        ? saved.elapsedSecs + elapsed
        : saved.elapsedSecs;

      setSubject(saved.subject);
      setHoursInput(saved.hoursInput);
      setSubjectTimerSecs(restored);
      setSubjectTimerInitial(saved.timerInitial);
      elapsedSecsRef.current = restoredElapsed;
      setElapsedSecs(restoredElapsed);

      if (saved.running && restored > 0) {
        setSubjectTimerRunning(true);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Save timer state to localStorage on every relevant state change ───────
  const saveTimerStateToLocalStorage = useCallback(
    (
      sub: string,
      hrs: string,
      secs: number,
      initial: number,
      running: boolean,
      elapsed: number,
    ) => {
      const state: TimerState = {
        subject: sub,
        hoursInput: hrs,
        timerSecs: secs,
        timerInitial: initial,
        running,
        savedAt: Date.now(),
        elapsedSecs: elapsed,
      };
      localStorage.setItem(SP_TIMER_KEY, JSON.stringify(state));
    },
    [],
  );

  // Reset timer when subject or hours change (but not on mount restore)
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setSubjectTimerRunning(false);
    if (subjectTimerRef.current) clearInterval(subjectTimerRef.current);
    if (elapsedRef.current) clearInterval(elapsedRef.current);
    elapsedSecsRef.current = 0;
    setElapsedSecs(0);
    const h = Number.parseFloat(hoursInput);
    if (subject && !Number.isNaN(h) && h > 0) {
      const secs = Math.round(h * 3600);
      setSubjectTimerSecs(secs);
      setSubjectTimerInitial(secs);
      saveTimerStateToLocalStorage(subject, hoursInput, secs, secs, false, 0);
    } else {
      setSubjectTimerSecs(0);
      setSubjectTimerInitial(0);
    }
  }, [subject, hoursInput, saveTimerStateToLocalStorage]);

  // Elapsed counter (runs when timer is running) + section time tracking
  useEffect(() => {
    if (subjectTimerRunning) {
      elapsedRef.current = setInterval(() => {
        elapsedSecsRef.current += 1;
        setElapsedSecs(elapsedSecsRef.current);
        // Accumulate to section time (every second)
        addSectionTimeToday(1);
        // Notify parent
        onSectionTimerUpdate?.(subject, subjectTimerSecs, true);
      }, 1000);
    } else {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      if (elapsedSecsRef.current > 0) {
        setTodayTotalElapsedSecs((prev) => prev + elapsedSecsRef.current);
        elapsedSecsRef.current = 0;
        setElapsedSecs(0);
      }
    }
    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [subjectTimerRunning, subject, subjectTimerSecs, onSectionTimerUpdate]);

  // Countdown tick
  useEffect(() => {
    if (subjectTimerRunning) {
      subjectTimerRef.current = setInterval(() => {
        setSubjectTimerSecs((s) => {
          const next = s <= 1 ? 0 : s - 1;
          if (s <= 1) {
            setSubjectTimerRunning(false);
            toast.success("Study session complete!");
            onSectionTimerPause?.();
          }
          // Save state on every tick
          saveTimerStateToLocalStorage(
            subject,
            hoursInput,
            next,
            subjectTimerInitial,
            s > 1,
            elapsedSecsRef.current,
          );
          return next;
        });
      }, 1000);
    } else {
      if (subjectTimerRef.current) clearInterval(subjectTimerRef.current);
      // Save paused state
      saveTimerStateToLocalStorage(
        subject,
        hoursInput,
        subjectTimerSecs,
        subjectTimerInitial,
        false,
        elapsedSecsRef.current,
      );
    }
    return () => {
      if (subjectTimerRef.current) clearInterval(subjectTimerRef.current);
    };
  }, [
    subjectTimerRunning,
    subject,
    hoursInput,
    subjectTimerInitial,
    subjectTimerSecs,
    saveTimerStateToLocalStorage,
    onSectionTimerPause,
  ]);

  // Save section time log to backend on unmount
  const saveSectionTimeLogMutateRef = useRef(saveSectionTimeLog.mutate);
  saveSectionTimeLogMutateRef.current = saveSectionTimeLog.mutate;
  useEffect(() => {
    return () => {
      const todayStr = getTodayDate();
      const elapsed = getSectionTimeToday();
      if (elapsed > 0) {
        saveSectionTimeLogMutateRef.current({
          section: "studyplan" as Section,
          date: todayStr,
          elapsedSeconds: elapsed,
        });
      }
    };
  }, []);

  const subjectTimerMins = Math.floor(subjectTimerSecs / 60);
  const subjectTimerRemSecs = subjectTimerSecs % 60;
  const showSubjectTimer =
    subject !== "" &&
    Number.parseFloat(hoursInput) > 0 &&
    subjectTimerInitial > 0;

  // Formatted elapsed time
  const totalElapsed = todayTotalElapsedSecs + elapsedSecs;
  const elapsedH = Math.floor(totalElapsed / 3600);
  const elapsedM = Math.floor((totalElapsed % 3600) / 60);
  const elapsedS = totalElapsed % 60;
  const elapsedDisplay = `${String(elapsedH).padStart(2, "0")}:${String(elapsedM).padStart(2, "0")}:${String(elapsedS).padStart(2, "0")}`;

  const todaysSessions = sessions.filter((s) => s.date === today);
  const todayHours = todaysSessions.reduce((acc, s) => acc + s.hours, 0);
  const dailyPct = Math.min((todayHours / DAILY_TARGET_HOURS) * 100, 100);
  const remaining = Math.max(DAILY_TARGET_HOURS - todayHours, 0);

  const last7Days = getLast7Days();
  const weeklyData = last7Days.map((date) => {
    const dayHours = sessions
      .filter((s) => s.date === date)
      .reduce((acc, s) => acc + s.hours, 0);
    return { date, hours: dayHours };
  });

  // subject breakdown for today
  const todaySubjectMap: Record<string, number> = {};
  for (const s of todaysSessions) {
    todaySubjectMap[s.subjectName] =
      (todaySubjectMap[s.subjectName] ?? 0) + s.hours;
  }

  const goalMet = todayHours >= DAILY_TARGET_HOURS;

  const triggerSave = useCallback(
    (subj: string, hrs: string) => {
      const h = Number.parseFloat(hrs);
      if (!subj || Number.isNaN(h) || h < 0.5 || h > DAILY_TARGET_HOURS + 10)
        return;

      setSaveStatus("saving");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);

      setSession.mutate(
        { subjectName: subj, hours: h, date: today },
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
            toast.error("Failed to save session");
          },
        },
      );
    },
    [setSession, today, DAILY_TARGET_HOURS],
  );

  const handleSubjectChange = useCallback(
    (val: string) => {
      setSubject(val);
      const h = Number.parseFloat(hoursInput);
      if (!Number.isNaN(h) && h >= 0.5 && h <= DAILY_TARGET_HOURS + 10) {
        triggerSave(val, hoursInput);
      }
    },
    [hoursInput, triggerSave, DAILY_TARGET_HOURS],
  );

  const handleHoursChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setHoursInput(val);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (subject) triggerSave(subject, val);
      }, 600);
    },
    [subject, triggerSave],
  );

  // Timer toggle with Pomodoro sync
  const handleTimerToggle = useCallback(() => {
    setSubjectTimerRunning((r) => {
      const next = !r;
      if (next) {
        onSectionTimerStart?.(subject, subjectTimerSecs);
      } else {
        onSectionTimerPause?.();
      }
      return next;
    });
  }, [subject, subjectTimerSecs, onSectionTimerStart, onSectionTimerPause]);

  // Mock test handlers
  const handleAddMockScore = useCallback(() => {
    const score = Number.parseInt(mockScore, 10);
    const total = Number.parseInt(mockTotalMarks, 10);
    if (
      !mockSubject ||
      Number.isNaN(score) ||
      score < 0 ||
      Number.isNaN(total) ||
      total <= 0 ||
      score > total
    ) {
      toast.error("Please fill all mock test fields correctly");
      return;
    }
    addMockScore.mutate(
      { subject: mockSubject, score, totalMarks: total, date: mockDate },
      {
        onSuccess: () => {
          toast.success("Mock test score saved!");
          setMockScore("");
          setMockSubject("");
          setMockTotalMarks("200");
          setMockDate(getTodayDate());
        },
        onError: () => toast.error("Failed to save mock score"),
      },
    );
  }, [addMockScore, mockSubject, mockScore, mockTotalMarks, mockDate]);

  // Custom subjects handlers
  const handleAddCustomSubject = useCallback(() => {
    const name = newCustomSubject.trim();
    if (!name) return;
    if (SSC_SUBJECTS.includes(name) || customSubjects.includes(name)) {
      toast.error("Subject already exists");
      return;
    }
    setCustomSubjectsMutation.mutate([...customSubjects, name], {
      onSuccess: () => {
        toast.success(`Added custom subject: ${name}`);
        setNewCustomSubject("");
      },
      onError: () => toast.error("Failed to add custom subject"),
    });
  }, [customSubjects, newCustomSubject, setCustomSubjectsMutation]);

  const handleRemoveCustomSubject = useCallback(
    (name: string) => {
      setCustomSubjectsMutation.mutate(
        customSubjects.filter((s) => s !== name),
        {
          onSuccess: () => toast.success(`Removed ${name}`),
          onError: () => toast.error("Failed to remove subject"),
        },
      );
    },
    [customSubjects, setCustomSubjectsMutation],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  // Filter plan cycles for this section
  const studyPlanCycles = planCycles.filter((c) => c.section === "studyplan");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Clock size={16} className="text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {DAILY_TARGET_HOURS}H Study Plan
          </h2>
          {/* Day of cycle badge */}
          <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-xs font-mono">
            Day {dayOfCycle} / 30
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            {/* History button */}
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
          Track your daily {DAILY_TARGET_HOURS}-hour study target across all SSC
          CGL subjects
        </p>
      </motion.div>

      {/* Today's Progress Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
      >
        <Card
          className={`border overflow-hidden ${goalMet ? "border-primary/40 bg-primary/5" : "border-border"}`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Circular progress */}
              <div className="relative shrink-0">
                <CircularProgress
                  value={todayHours}
                  max={DAILY_TARGET_HOURS}
                  size={140}
                  strokeWidth={11}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-bold text-foreground leading-none">
                    {formatHours(todayHours)}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    of {DAILY_TARGET_HOURS}h
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Today's Progress
                  </h3>
                  {goalMet && (
                    <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                      <CheckCircle2 size={10} className="mr-1" />
                      Goal Met!
                    </Badge>
                  )}
                  {subjectTimerRunning && subject && (
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Timer: {subject}
                    </Badge>
                  )}
                </div>

                <Progress
                  value={dailyPct}
                  className="h-3 bg-muted mb-3 rounded-full"
                />

                {/* Actual studied time as primary stat */}
                <div className="rounded-lg bg-primary/8 border border-primary/15 p-2.5 flex items-center gap-2 mb-3">
                  <Timer size={13} className="text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground">
                      Actual studied today (timer-based)
                    </p>
                    <p className="font-mono text-sm font-bold text-primary tabular-nums">
                      {elapsedDisplay}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">
                      Planned: {formatHours(todayHours)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {Math.round(dailyPct)}% of target
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2.5 rounded-lg bg-muted/40">
                    <p className="font-display text-xl font-bold text-foreground leading-none">
                      {formatHours(remaining)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Remaining
                    </p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-muted/40">
                    <p className="font-display text-xl font-bold text-primary leading-none">
                      {Math.round(dailyPct)}%
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Complete
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Log Session Form */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
                <PlusCircle size={16} className="text-primary" />
                Log Study Hours
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
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Hours Studied
                  </Label>
                  <Input
                    type="number"
                    min={0.5}
                    max={15}
                    step={0.5}
                    placeholder="e.g. 2.5"
                    value={hoursInput}
                    onChange={handleHoursChange}
                    className="bg-muted/40 border-input focus:border-primary/50 font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Auto-saves when subject and hours are both filled
                  </p>
                </div>

                {/* Subject countdown timer */}
                {showSubjectTimer && (
                  <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Timer size={13} className="text-primary shrink-0" />
                      <span className="text-xs font-semibold text-foreground">
                        Session Timer
                      </span>
                      <span className="ml-auto font-mono text-xl font-bold text-primary tabular-nums">
                        {String(subjectTimerMins).padStart(2, "0")}:
                        {String(subjectTimerRemSecs).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        animate={{
                          width: `${((subjectTimerInitial - subjectTimerSecs) / subjectTimerInitial) * 100}%`,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs gap-1"
                        onClick={handleTimerToggle}
                      >
                        {subjectTimerRunning ? (
                          <>
                            <Pause size={11} />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play size={11} />
                            {subjectTimerSecs === subjectTimerInitial
                              ? "Start"
                              : "Resume"}
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs px-2 text-muted-foreground"
                        onClick={() => {
                          setSubjectTimerRunning(false);
                          onSectionTimerPause?.();
                          setSubjectTimerSecs(subjectTimerInitial);
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

        {/* Today's Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-border h-full">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
                <BookOpen size={16} className="text-primary" />
                Today's Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full bg-muted" />
                  ))}
                </div>
              ) : Object.keys(todaySubjectMap).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Target
                    size={24}
                    className="text-muted-foreground mb-2 opacity-50"
                  />
                  <p className="text-sm text-muted-foreground">
                    No sessions logged today
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start logging your study hours
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {Object.entries(todaySubjectMap).map(([sub, hrs], i) => {
                      const pct = Math.min(
                        (hrs / DAILY_TARGET_HOURS) * 100,
                        100,
                      );
                      const colorClass =
                        SUBJECT_COLORS[sub] ??
                        "bg-muted/40 text-foreground border-border";
                      return (
                        <motion.div
                          key={sub}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded border ${colorClass}`}
                            >
                              {sub}
                            </span>
                            <span className="font-mono text-xs text-foreground font-semibold">
                              {formatHours(hrs)}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 0.5,
                                delay: i * 0.05,
                              }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weekly View */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
              <CalendarDays size={16} className="text-primary" />
              7-Day Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weeklyData.map(({ date, hours }, i) => {
                const pct = Math.min((hours / DAILY_TARGET_HOURS) * 100, 100);
                const isToday = date === today;
                const goalMet = hours >= DAILY_TARGET_HOURS;
                return (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg ${
                      isToday
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-muted/30"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-medium truncate w-full text-center ${
                        isToday ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {getDayLabel(date)}
                    </span>

                    <div className="w-full h-16 bg-muted/60 rounded relative overflow-hidden flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{
                          duration: 0.6,
                          delay: 0.3 + i * 0.06,
                          ease: "easeOut",
                        }}
                        className={`w-full rounded ${goalMet ? "bg-primary" : "bg-primary/50"}`}
                      />
                    </div>

                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-mono text-[11px] font-bold text-foreground">
                        {formatHours(hours)}
                      </span>
                      {goalMet && <Flame size={10} className="text-primary" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Weekly total</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-primary">
                  {formatHours(weeklyData.reduce((a, d) => a + d.hours, 0))}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {DAILY_TARGET_HOURS * 7}h target
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mock Test Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-4"
      >
        <Collapsible open={mockTestOpen} onOpenChange={setMockTestOpen}>
          <Card className="border-border">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/20 transition-colors rounded-t-xl">
                <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
                  <Trophy size={16} className="text-primary" />
                  Mock Test Scores
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs ml-1">
                    {mockScoresList.length}
                  </Badge>
                  <span className="ml-auto text-muted-foreground">
                    {mockTestOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                {/* Add mock score form */}
                <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Add New Score
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Subject
                      </Label>
                      <Select
                        value={mockSubject}
                        onValueChange={setMockSubject}
                      >
                        <SelectTrigger className="bg-muted/40 border-input text-sm h-8">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {allSubjects.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Date
                      </Label>
                      <Input
                        type="date"
                        value={mockDate}
                        onChange={(e) => setMockDate(e.target.value)}
                        className="bg-muted/40 border-input h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Score
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g. 145"
                        value={mockScore}
                        onChange={(e) => setMockScore(e.target.value)}
                        className="bg-muted/40 border-input h-8 text-sm font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Total Marks
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        placeholder="200"
                        value={mockTotalMarks}
                        onChange={(e) => setMockTotalMarks(e.target.value)}
                        className="bg-muted/40 border-input h-8 text-sm font-mono"
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-primary text-primary-foreground"
                    onClick={handleAddMockScore}
                    disabled={addMockScore.isPending}
                  >
                    {addMockScore.isPending ? "Saving..." : "Save Mock Score"}
                  </Button>
                </div>

                {/* Scores list */}
                {mockScoresList.length > 0 && (
                  <ScrollArea className="max-h-64">
                    <div className="space-y-2">
                      {[...mockScoresList].reverse().map((entry, i) => {
                        const pct = Math.round(
                          (Number(entry.score) / Number(entry.totalMarks)) *
                            100,
                        );
                        const colorClass =
                          SUBJECT_COLORS[entry.subject] ??
                          "bg-muted/20 text-foreground border-border";
                        return (
                          <div
                            key={`${entry.date}-${i}`}
                            className="flex items-center gap-3 rounded-lg p-2.5 border border-border bg-muted/20"
                          >
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded border shrink-0 ${colorClass}`}
                            >
                              {entry.subject}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs font-bold text-foreground">
                                  {Number(entry.score)}/
                                  {Number(entry.totalMarks)}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {entry.date}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span
                                  className={`text-xs font-mono font-bold ${pct >= 70 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-red-400"}`}
                                >
                                  {pct}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </motion.div>

      {/* Custom Subjects Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Collapsible
          open={customSubjectsOpen}
          onOpenChange={setCustomSubjectsOpen}
        >
          <Card className="border-border">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/20 transition-colors rounded-t-xl">
                <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
                  <PlusCircle size={16} className="text-primary" />
                  Custom Subjects
                  {customSubjects.length > 0 && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs ml-1">
                      {customSubjects.length}
                    </Badge>
                  )}
                  <span className="ml-auto text-muted-foreground">
                    {customSubjectsOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="New subject name..."
                    value={newCustomSubject}
                    onChange={(e) => setNewCustomSubject(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddCustomSubject();
                    }}
                    className="bg-muted/40 border-input focus:border-primary/50 text-sm"
                  />
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground shrink-0"
                    onClick={handleAddCustomSubject}
                    disabled={setCustomSubjectsMutation.isPending}
                  >
                    Add
                  </Button>
                </div>
                {customSubjects.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    No custom subjects yet
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {customSubjects.map((sub) => (
                      <div
                        key={sub}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-muted/30 text-xs font-medium text-foreground"
                      >
                        {sub}
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomSubject(sub)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label={`Remove ${sub}`}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </motion.div>

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

      {/* History Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <History size={16} className="text-primary" />
              Previous 30-Day Cycles
            </DialogTitle>
          </DialogHeader>
          {studyPlanCycles.length === 0 ? (
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
                  {studyPlanCycles.map((cycle, i) => (
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
