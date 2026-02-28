import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Pause,
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
import { toast } from "sonner";
import type { SubjectQuestionProgress } from "../backend.d";
import {
  useGetQuestionProgress,
  useGetTargets,
  useSetQuestionCount,
} from "../hooks/useQueries";
import MonthlyPlanSection from "./MonthlyPlanSection";
import TargetsPanel from "./TargetsPanel";

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

export default function QuestionsTab() {
  const { data: rawProgress = [], isLoading } = useGetQuestionProgress();
  const { data: targets } = useGetTargets();
  const setQuestionCount = useSetQuestionCount();

  const TOTAL_GOAL = Number(targets?.totalQuestionsGoal ?? 9000);

  // Build subject targets list dynamically from backend targets
  const SUBJECT_TARGETS = useMemo(() => {
    const subjectTargets = targets?.subjectTargets ?? [];
    return subjectTargets.map((s) => ({
      name: s.name,
      target: Number(s.target),
      ...(SUBJECT_DISPLAY[s.name] ?? {
        color: "text-foreground bg-muted/20 border-border",
        icon: <Target size={14} />,
      }),
    }));
  }, [targets?.subjectTargets]);

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

  // ── Subject question countdown timer (local only) ─────────────────────────
  const [qTimerSecs, setQTimerSecs] = useState(0);
  const [qTimerRunning, setQTimerRunning] = useState(false);
  const [qTimerInitial, setQTimerInitial] = useState(0);
  const qTimerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset timer when subject, count, or per-question time change
  useEffect(() => {
    setQTimerRunning(false);
    if (qTimerIntervalRef.current) clearInterval(qTimerIntervalRef.current);
    const n = Number.parseInt(countInput, 10);
    if (subject && !Number.isNaN(n) && n > 0) {
      const secs = n * perQTimeSecs; // per-question time * count
      setQTimerSecs(secs);
      setQTimerInitial(secs);
    } else {
      setQTimerSecs(0);
      setQTimerInitial(0);
    }
  }, [subject, countInput, perQTimeSecs]);

  // Countdown tick
  useEffect(() => {
    if (qTimerRunning) {
      qTimerIntervalRef.current = setInterval(() => {
        setQTimerSecs((s) => {
          if (s <= 1) {
            setQTimerRunning(false);
            toast.success("Question session complete!");
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (qTimerIntervalRef.current) clearInterval(qTimerIntervalRef.current);
    }
    return () => {
      if (qTimerIntervalRef.current) clearInterval(qTimerIntervalRef.current);
    };
  }, [qTimerRunning]);

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

  const totalSolved = Object.values(progressMap).reduce((a, b) => a + b, 0);
  const totalPct = Math.min((totalSolved / TOTAL_GOAL) * 100, 100);

  const triggerSave = useCallback(
    (subj: string, countStr: string) => {
      const n = Number.parseInt(countStr, 10);
      if (!subj || Number.isNaN(n) || n < 0 || n > 99999) return;

      setSaveStatus("saving");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);

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

  const handleSubjectChange = useCallback(
    (val: string) => {
      setSubject(val);
      // Pre-populate with current known count
      const currentCount = progressMapRef.current[val] ?? 0;
      const newCountStr = String(currentCount);
      setCountInput(newCountStr);
      // Immediately trigger save if there's a valid count
      if (currentCount > 0) {
        triggerSave(val, newCountStr);
      }
    },
    [triggerSave],
  );

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
            <Trophy size={16} className="text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {TOTAL_GOAL.toLocaleString()} Questions Challenge
          </h2>
          <div className="ml-auto">
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
                Set Question Total
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
                      {SUBJECT_TARGETS.map((s) => (
                        <SelectItem key={s.name} value={s.name}>
                          {s.name} ({s.target.toLocaleString()} target)
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
                    Enter your running total. Auto-saves when subject and count
                    are filled.
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
                        onClick={() => setQTimerRunning((r) => !r)}
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
                    {SUBJECT_TARGETS.map((sub, i) => {
                      const solved = progressMap[sub.name] ?? 0;
                      const pct = Math.min((solved / sub.target) * 100, 100);
                      const done = solved >= sub.target;
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
                              <span className="text-[10px] text-muted-foreground">
                                /{sub.target.toLocaleString()}
                              </span>
                            </div>
                          </div>
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
                          <p className="text-[10px] text-muted-foreground mt-0.5 text-right">
                            {Math.round(pct)}%
                          </p>
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
    </div>
  );
}
