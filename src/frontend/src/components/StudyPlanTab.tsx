import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Eraser,
  Flame,
  History,
  Palette,
  Pause,
  PieChart,
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
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
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
import SectionStylePanel, { useSectionStyle } from "./SectionStylePanel";
import TargetsPanel from "./TargetsPanel";

const SSC_SUBJECTS = [
  "Maths",
  "English",
  "Reasoning",
  "General Knowledge",
  "Current Affairs",
  "Computer",
  "Science",
  "Mock Test",
];

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "bg-primary/20 text-primary border-primary/30",
  English: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Reasoning: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "General Knowledge": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Current Affairs": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Computer: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Science: "bg-green-500/20 text-green-400 border-green-500/30",
  "Mock Test": "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

// Hex colors for recharts pie slices
const SUBJECT_HEX_COLORS: Record<string, string> = {
  Maths: "#e11d48",
  English: "#3b82f6",
  Reasoning: "#a855f7",
  "General Knowledge": "#f59e0b",
  "Current Affairs": "#10b981",
  Computer: "#06b6d4",
  Science: "#22c55e",
  "Mock Test": "#f43f5e",
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
  onSyncPomodoro?: (durationSecs: number) => void;
}

export default function StudyPlanTab({
  onSectionTimerStart,
  onSectionTimerPause,
  onSectionTimerUpdate,
  onSyncPomodoro,
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
  const queryClient = useQueryClient();

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
  const [showClearConfirm, setShowClearConfirm] = useState(false);
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

  // ── Stable refs for callback props (prevent effect re-runs on parent re-render) ──
  const onSectionTimerPauseRef = useRef(onSectionTimerPause);
  onSectionTimerPauseRef.current = onSectionTimerPause;
  const onSectionTimerUpdateRef = useRef(onSectionTimerUpdate);
  onSectionTimerUpdateRef.current = onSectionTimerUpdate;
  const subjectTimerInitialRef = useRef(0);

  // ── Timestamp-based refs to prevent drift ────────────────────────────────
  const spStartedAtRef = useRef<number | null>(null);
  const spBaseSecsRef = useRef<number>(0);

  // ── Actual elapsed time tracking (timestamp-based) ──────────────────────
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [todayTotalElapsedSecs, setTodayTotalElapsedSecs] =
    useState(getSectionTimeToday);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedSecsRef = useRef(0);
  // Timestamp-based elapsed refs
  const elapsedStartRef = useRef<number | null>(null);
  const elapsedBaseRef = useRef<number>(0);
  // Track last section time written so we only write diffs
  const lastSectionTimeWrittenRef = useRef<number>(0);

  // ── Flag to skip reset effect when restoring from storage ────────────────
  const isRestoringRef = useRef(false);

  // ── Restore timer state from localStorage on mount ────────────────────────
  useEffect(() => {
    const saved = loadTimerState();
    if (saved?.subject && saved.timerInitial > 0) {
      // Mark that we're doing a restore so the reset effect is skipped
      isRestoringRef.current = true;

      // Always restore timer as paused -- never add offline/background time
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

      // Always start paused on restore -- user must manually resume
      // setSubjectTimerRunning(false); // already false by default

      // Clear restore flag after state updates settle
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 0);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Save timer state to localStorage ─────────────────────────────────────
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

  // Reset timer when subject or hours change (but not on mount restore or tab switch restore)
  const isFirstMount = useRef(true);
  useEffect(() => {
    // Skip on very first mount
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    // Skip if we are in the middle of restoring from localStorage
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

  // Combined timestamp-based interval: countdown + elapsed + section time
  // biome-ignore lint/correctness/useExhaustiveDependencies: callback props intentionally stored in refs to prevent timer restart
  useEffect(() => {
    if (subjectTimerRunning) {
      // Record start timestamps
      spStartedAtRef.current = Date.now();
      elapsedStartRef.current = Date.now();

      subjectTimerRef.current = setInterval(() => {
        const now = Date.now();

        // ── Countdown (timestamp-based, no drift) ──
        if (spStartedAtRef.current !== null) {
          const spElapsed = Math.floor((now - spStartedAtRef.current) / 1000);
          const newSecs = Math.max(0, spBaseSecsRef.current - spElapsed);
          setSubjectTimerSecs(newSecs);

          // ── Elapsed counter (timestamp-based) ──
          if (elapsedStartRef.current !== null) {
            const elapsedDelta = Math.floor(
              (now - elapsedStartRef.current) / 1000,
            );
            const totalElapsed = elapsedBaseRef.current + elapsedDelta;
            elapsedSecsRef.current = totalElapsed;
            setElapsedSecs(totalElapsed);

            // Accumulate section time (only write new seconds)
            const newSectionSecs =
              totalElapsed - lastSectionTimeWrittenRef.current;
            if (newSectionSecs > 0) {
              addSectionTimeToday(newSectionSecs);
              lastSectionTimeWrittenRef.current = totalElapsed;
            }
          }

          // Notify parent with current secs
          onSectionTimerUpdateRef.current?.(
            subject,
            Math.max(
              0,
              spBaseSecsRef.current -
                Math.floor((now - spStartedAtRef.current) / 1000),
            ),
            true,
          );

          // Save state periodically
          saveTimerStateToLocalStorage(
            subject,
            hoursInput,
            newSecs,
            subjectTimerInitial,
            newSecs > 0,
            elapsedSecsRef.current,
          );

          if (newSecs <= 0) {
            setSubjectTimerRunning(false);
            toast.success("Study session complete!");
            onSectionTimerPauseRef.current?.();
          }
        }
      }, 200); // 200ms for responsiveness; elapsed is wall-clock based
    } else {
      if (subjectTimerRef.current) clearInterval(subjectTimerRef.current);
      if (elapsedRef.current) clearInterval(elapsedRef.current);

      // Capture accurate remaining time on pause
      spStartedAtRef.current = null;

      if (elapsedStartRef.current !== null) {
        const elapsedDelta = Math.floor(
          (Date.now() - elapsedStartRef.current) / 1000,
        );
        const totalElapsed = elapsedBaseRef.current + elapsedDelta;
        elapsedBaseRef.current = totalElapsed;
        elapsedSecsRef.current = totalElapsed;
        elapsedStartRef.current = null;

        // Finalize section time
        const newSectionSecs = totalElapsed - lastSectionTimeWrittenRef.current;
        if (newSectionSecs > 0) {
          addSectionTimeToday(newSectionSecs);
          lastSectionTimeWrittenRef.current = totalElapsed;
        }

        setTodayTotalElapsedSecs((prev) => prev + totalElapsed);
        elapsedSecsRef.current = 0;
        elapsedBaseRef.current = 0;
        lastSectionTimeWrittenRef.current = 0;
        setElapsedSecs(0);
      }

      // Save paused state
      saveTimerStateToLocalStorage(
        subject,
        hoursInput,
        spBaseSecsRef.current,
        subjectTimerInitial,
        false,
        elapsedSecsRef.current,
      );
    }
    return () => {
      if (subjectTimerRef.current) clearInterval(subjectTimerRef.current);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [subjectTimerRunning, saveTimerStateToLocalStorage]); // eslint-disable-line react-hooks/exhaustive-deps

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
              3000,
            );
          },
          onError: (err) => {
            setSaveStatus("idle");
            const msg = err instanceof Error ? err.message : String(err);
            if (!msg || msg.includes("actor") || msg.includes("null")) {
              toast.error(
                "Session expired. Please refresh the page to log in again.",
              );
            } else {
              toast.error(`Failed to save session: ${msg}. Please try again.`);
            }
          },
        },
      );
    },
    [setSession, today, DAILY_TARGET_HOURS, queryClient],
  );

  const handleSubjectChange = useCallback((val: string) => {
    setSubject(val);
    // Do NOT auto-save on subject change — user must click "Log Hours" or edit hours
  }, []);

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
        onSyncPomodoro?.(subjectTimerInitial);
      } else {
        onSectionTimerPause?.();
      }
      return next;
    });
  }, [
    subject,
    subjectTimerSecs,
    subjectTimerInitial,
    onSectionTimerStart,
    onSectionTimerPause,
    onSyncPomodoro,
  ]);

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

  // ── Progress chart dialog ─────────────────────────────────────────────────
  const [progressChartOpen, setProgressChartOpen] = useState(false);
  const [chartSelectedDate, setChartSelectedDate] = useState(today);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const styleBtnRef = useRef<HTMLButtonElement>(null);
  const { style: sectionStyle } = useSectionStyle("studyplan");

  // ── Extra time rows from localStorage ────────────────────────────────────
  const [questionsSectionTime, setQuestionsSectionTime] = useState(0);
  const [pomodoroTodayTime, setPomodoroTodayTime] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const qTime = Number(
        localStorage.getItem(`ssc_section_time_questions_${today}`) ?? 0,
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
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [today]);

  const combinedTotalSecs =
    totalElapsed + questionsSectionTime + pomodoroTodayTime;

  function formatHMS(secs: number): string {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  // ── Chart data helpers ───────────────────────────────────────────────────
  function getChartDataForDate(dateKey: string) {
    const daySessions = sessions.filter((s) => s.date === dateKey);
    const map: Record<string, number> = {};
    for (const s of daySessions) {
      map[s.subjectName] = (map[s.subjectName] ?? 0) + s.hours;
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }))
      .filter((e) => e.value > 0);
  }

  function getMonthlyChartData() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const map: Record<string, number> = {};
    for (const s of sessions) {
      const d = new Date(`${s.date}T12:00:00`);
      if (d.getFullYear() === year && d.getMonth() === month) {
        map[s.subjectName] = (map[s.subjectName] ?? 0) + s.hours;
      }
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }))
      .filter((e) => e.value > 0);
  }

  const chartDayData = getChartDataForDate(chartSelectedDate);
  const chartMonthData = getMonthlyChartData();

  // Actual percentage based on elapsed timer
  const actualPct = Math.min(
    (totalElapsed / (DAILY_TARGET_HOURS * 3600)) * 100,
    100,
  );

  // Filter plan cycles for this section
  const studyPlanCycles = planCycles.filter((c) => c.section === "studyplan");

  return (
    <div className="p-6 max-w-4xl mx-auto" style={sectionStyle}>
      {/* Section Style Panel */}
      {showStylePanel && (
        <SectionStylePanel
          sectionId="studyplan"
          sectionLabel="Study Plan"
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
            {/* Section Style */}
            <Button
              ref={styleBtnRef}
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50"
              onClick={() => setShowStylePanel((p) => !p)}
              title="Customize section style"
              data-ocid="studyplan.style.button"
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
              data-ocid="studyplan.progress.button"
            >
              <PieChart size={13} />
            </Button>
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
            {/* Clear today's data */}
            <AlertDialog
              open={showClearConfirm}
              onOpenChange={setShowClearConfirm}
            >
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                  title="Clear today's study data"
                  data-ocid="studyplan.clear.open_modal_button"
                >
                  <Eraser size={13} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="studyplan.clear.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Clear today's study sessions?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all study hour logs for today. This cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="studyplan.clear.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      const today = new Date().toISOString().split("T")[0];
                      try {
                        const raw = localStorage.getItem("ssc_study_sessions");
                        const all = raw ? JSON.parse(raw) : [];
                        const filtered = all.filter(
                          (s: { date: string }) => s.date !== today,
                        );
                        localStorage.setItem(
                          "ssc_study_sessions",
                          JSON.stringify(filtered),
                        );
                        toast.success("Today's study sessions cleared");
                      } catch {
                        toast.error("Failed to clear");
                      }
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                    data-ocid="studyplan.clear.confirm_button"
                  >
                    Clear
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
              {/* Circular progress — uses actual elapsed timer time */}
              <div className="relative shrink-0">
                <CircularProgress
                  value={totalElapsed}
                  max={DAILY_TARGET_HOURS * 3600}
                  size={140}
                  strokeWidth={11}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl font-bold text-foreground leading-none">
                    {Math.round(actualPct)}%
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    actual
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
                <div className="rounded-lg bg-primary/8 border border-primary/15 p-2.5 flex items-center gap-2 mb-2">
                  <Timer size={13} className="text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground">
                      Study Plan timer today
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
                      {Math.round(actualPct)}% of target
                    </p>
                  </div>
                </div>

                {/* Questions section time */}
                <div className="rounded-lg bg-blue-500/8 border border-blue-500/15 p-2 flex items-center gap-2 mb-1.5">
                  <Timer size={12} className="text-blue-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground">
                      Questions timer today
                    </p>
                    <p className="font-mono text-xs font-bold text-blue-400 tabular-nums">
                      {formatHMS(questionsSectionTime)}
                    </p>
                  </div>
                </div>

                {/* Pomodoro focus time */}
                <div className="rounded-lg bg-amber-500/8 border border-amber-500/15 p-2 flex items-center gap-2 mb-2">
                  <Timer size={12} className="text-amber-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground">
                      Pomodoro focus today
                    </p>
                    <p className="font-mono text-xs font-bold text-amber-400 tabular-nums">
                      {formatHMS(pomodoroTodayTime)}
                    </p>
                  </div>
                </div>

                {/* Combined total */}
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-2 flex items-center gap-2 mb-2">
                  <Timer size={12} className="text-emerald-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground">
                      Total active time today
                    </p>
                    <p className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
                      {formatHMS(combinedTotalSecs)}
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
                      {Math.round(actualPct)}%
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
                    Debounce auto-saves · or click button below to save
                    immediately
                  </p>
                </div>

                <Button
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => triggerSave(subject, hoursInput)}
                  disabled={!subject || !hoursInput || saveStatus === "saving"}
                  data-ocid="studyplan.submit_button"
                >
                  <CheckCircle2 size={13} />
                  Log Hours
                </Button>

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
                <span className="ml-auto text-[10px] font-normal text-muted-foreground">
                  (from backend)
                </span>
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

      {/* Progress Chart Dialog */}
      <Dialog open={progressChartOpen} onOpenChange={setProgressChartOpen}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <PieChart size={16} className="text-primary" />
              Study Plan Progress Charts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Date selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium">
                Select Date:
              </span>
              <input
                type="date"
                value={chartSelectedDate}
                max={today}
                onChange={(e) => setChartSelectedDate(e.target.value)}
                className="h-8 px-2 text-sm rounded-md border border-input bg-muted/40 text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Today / Selected Date Chart */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <h4 className="text-xs font-bold text-foreground mb-3 font-display">
                  {chartSelectedDate === today
                    ? "Today's Progress"
                    : `Progress on ${chartSelectedDate}`}
                </h4>
                {chartDayData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-44 text-muted-foreground/50 gap-2">
                    <PieChart size={28} className="opacity-30" />
                    <p className="text-xs">No data for this date</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <RechartsPieChart>
                      <Pie
                        data={chartDayData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartDayData.map((entry, idx) => (
                          <Cell
                            key={entry.name}
                            fill={
                              SUBJECT_HEX_COLORS[entry.name] ??
                              `hsl(${(idx * 60) % 360}, 60%, 55%)`
                            }
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => [`${value}h`, ""]}
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
              {/* Monthly Chart */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <h4 className="text-xs font-bold text-foreground mb-3 font-display">
                  Monthly Progress (
                  {new Date().toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                  )
                </h4>
                {chartMonthData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-44 text-muted-foreground/50 gap-2">
                    <PieChart size={28} className="opacity-30" />
                    <p className="text-xs">No data this month</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <RechartsPieChart>
                      <Pie
                        data={chartMonthData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartMonthData.map((entry, idx) => (
                          <Cell
                            key={entry.name}
                            fill={
                              SUBJECT_HEX_COLORS[entry.name] ??
                              `hsl(${(idx * 60) % 360}, 60%, 55%)`
                            }
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => [`${value}h`, ""]}
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
