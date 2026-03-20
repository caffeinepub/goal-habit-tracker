import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Palette,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Subject } from "../backend.d";
import { useDeleteSubject, useToggleDay } from "../hooks/useQueries";
import SectionStylePanel, { useSectionStyle } from "./SectionStylePanel";

const DAYS = 30;

const DEFAULT_SUBJECTS = [
  "Maths",
  "English",
  "Reasoning",
  "GK",
  "Current Affairs",
  "Computer",
  "Science",
];

function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

interface PerformanceData {
  studyPct: number;
  studiedSecs: number;
  studyTargetHours: number;
  questionsPct: number;
  questionsSolved: number;
  questionsTarget: number;
  routinePct: number;
  routineDone: number;
  routineTotal: number;
  overallPct: number;
}

function readPerformanceData(): PerformanceData {
  const dateKey = getTodayKey();

  // Targets
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
  } catch {}

  // Study Plan actual seconds
  let studiedSecs = 0;
  try {
    const v = localStorage.getItem(`ssc_section_time_studyplan_${dateKey}`);
    if (v) studiedSecs = Number(v) || 0;
  } catch {}
  const studyTargetSecs = dailyStudyHoursTarget * 3600;
  const studyPct = clamp(
    studyTargetSecs > 0 ? (studiedSecs / studyTargetSecs) * 100 : 0,
  );

  // Questions solved today
  let customSubjects: string[] = [];
  try {
    const raw = localStorage.getItem("ssc_custom_subjects");
    if (raw) customSubjects = JSON.parse(raw);
  } catch {}
  const allSubjects = [...DEFAULT_SUBJECTS, ...customSubjects];
  let questionsSolved = 0;
  for (const subj of allSubjects) {
    try {
      const v = localStorage.getItem(`ssc_daily_q_${subj}_${dateKey}`);
      if (v) questionsSolved += Number(v) || 0;
    } catch {}
  }
  const questionsPct = clamp(
    questionsTarget > 0 ? (questionsSolved / questionsTarget) * 100 : 0,
  );

  // Daily Routine
  let routineTotal = 0;
  let routineDone = 0;
  try {
    const tasksRaw = localStorage.getItem(`ssc_routine_day_${dateKey}`);
    if (tasksRaw) {
      const tasks = JSON.parse(tasksRaw);
      routineTotal = Array.isArray(tasks) ? tasks.length : 0;
    }
  } catch {}
  try {
    const doneRaw = localStorage.getItem(`ssc_routine_done_${dateKey}`);
    if (doneRaw) {
      const done = JSON.parse(doneRaw);
      routineDone = Array.isArray(done) ? done.length : 0;
    }
  } catch {}
  const routinePct = clamp(
    routineTotal > 0 ? (routineDone / routineTotal) * 100 : 0,
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
    overallPct,
  };
}

function CircleProgress({ pct, size = 150 }: { pct: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <svg
      width={size}
      height={size}
      className="-rotate-90"
      role="img"
      aria-label="Performance progress ring"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={10}
        className="text-muted"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="rotate-90"
        style={{
          transform: `rotate(90deg) translate(0px, ${-size / 2}px) translate(${size / 2}px, 0px)`,
          fill: color,
          fontSize: 28,
          fontWeight: 700,
          transformOrigin: `${size / 2}px ${size / 2}px`,
        }}
      >
        {pct}%
      </text>
    </svg>
  );
}

function OverallPerformanceCard() {
  const [data, setData] = useState<PerformanceData>(() =>
    readPerformanceData(),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setData(readPerformanceData());
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const fmtTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const ringColor =
    data.overallPct >= 80
      ? "text-green-500"
      : data.overallPct >= 50
        ? "text-amber-500"
        : "text-red-500";

  const barColor =
    data.overallPct >= 80
      ? "bg-green-500"
      : data.overallPct >= 50
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-6"
    >
      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-primary" />
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Today's Overall Performance
            </h3>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Ring */}
            <div className="flex flex-col items-center shrink-0">
              <div className={ringColor}>
                <CircleProgress pct={data.overallPct} size={150} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Combined Score
              </p>
            </div>

            {/* Breakdown rows */}
            <div className="flex-1 w-full space-y-4">
              {/* Study Plan */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">
                    📚 Study Plan
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {data.studyPct}%
                  </span>
                </div>
                <Progress value={data.studyPct} className="h-2 bg-muted" />
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {fmtTime(data.studiedSecs)} studied / {data.studyTargetHours}h
                  target
                </p>
              </div>

              {/* Questions */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">
                    ✏️ Questions
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {data.questionsPct}%
                  </span>
                </div>
                <Progress value={data.questionsPct} className="h-2 bg-muted" />
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {data.questionsSolved} solved / {data.questionsTarget} target
                </p>
              </div>

              {/* Daily Routine */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">
                    📋 Daily Routine
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {data.routinePct}%
                  </span>
                </div>
                <Progress value={data.routinePct} className="h-2 bg-muted" />
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {data.routineDone} done / {data.routineTotal} tasks
                </p>
              </div>
            </div>
          </div>

          {/* Overall bar accent */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-foreground">
                Overall Average
              </span>
              <span className={`text-sm font-bold ${ringColor}`}>
                {data.overallPct}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                style={{ width: `${data.overallPct}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface HomeTabProps {
  subjects: Subject[];
  search: string;
  isLoading: boolean;
  overallCompletion: number;
  predictedScore: number;
  timetable: string;
}

function DashboardCard({
  overallCompletion,
  predictedScore,
  timetable,
}: {
  overallCompletion: number;
  predictedScore: number;
  timetable: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="mb-6 border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Completion */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-primary" />
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Overall Completion
                </p>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="font-display text-4xl font-bold text-foreground leading-none">
                  {overallCompletion}
                </span>
                <span className="text-lg text-muted-foreground mb-0.5">%</span>
              </div>
              <Progress
                value={overallCompletion}
                className="h-1.5 bg-muted mt-2"
              />
            </div>

            {/* Predicted Score */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-primary" />
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Predicted Score
                </p>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-display text-4xl font-bold text-primary leading-none glow-red">
                  {predictedScore}
                </span>
                <span className="text-lg text-muted-foreground mb-0.5">
                  / 200
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on mock tests + consistency
              </p>
            </div>

            {/* Timetable */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} className="text-primary" />
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Today's Plan
                </p>
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {timetable}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                AI-generated schedule
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SubjectCard({ subject }: { subject: Subject }) {
  const deleteSubject = useDeleteSubject();
  const toggleDay = useToggleDay();

  const completedCount = subject.days.filter(Boolean).length;
  const completionPct = Math.round((completedCount / DAYS) * 100);

  const handleToggle = (index: number) => {
    toggleDay.mutate(
      { subjectId: subject.id, dayIndex: index },
      {
        onError: () => toast.error("Failed to update day"),
      },
    );
  };

  const handleDelete = () => {
    deleteSubject.mutate(subject.id, {
      onSuccess: () => toast.success(`"${subject.name}" deleted`),
      onError: () => toast.error("Failed to delete subject"),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      layout
    >
      <Card
        className={`border transition-all duration-200 ${
          subject.isWeak ? "weak-card" : "border-border hover:border-border/80"
        }`}
      >
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-semibold text-base text-foreground truncate">
                  {subject.name}
                </h3>
                {subject.isWeak && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/25 shrink-0">
                    <AlertTriangle size={9} />
                    WEAK
                  </span>
                )}
              </div>
              {subject.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {subject.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-foreground">
                  {completionPct}
                </span>
                <span className="text-xs text-muted-foreground">%</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={deleteSubject.isPending}
                className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Trash2 size={13} />
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <Progress value={completionPct} className="h-1 bg-muted mb-3" />

          {/* 30-day grid */}
          <div className="grid grid-cols-10 gap-1.5">
            {subject.days.map((done, index) => {
              const dayKey = `${subject.id.toString()}-d${index}`;
              return (
                <motion.button
                  key={dayKey}
                  onClick={() => handleToggle(index)}
                  disabled={toggleDay.isPending}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  title={`Day ${index + 1}`}
                  aria-label={`Day ${index + 1}: ${done ? "completed" : "not completed"}`}
                  className={`
                    w-full aspect-square rounded-sm cursor-pointer transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary
                    disabled:cursor-not-allowed
                    ${done ? "day-cell-active" : "day-cell-inactive hover:bg-muted"}
                  `}
                />
              );
            })}
          </div>

          {/* Footer stats */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-[10px] text-muted-foreground">
              {completedCount}/{DAYS} days completed
            </p>
            {subject.isWeak && (
              <p className="text-[10px] text-primary font-medium">
                Needs more attention
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-border">
          <CardContent className="p-5">
            <div className="flex justify-between mb-3">
              <Skeleton className="h-5 w-40 bg-muted" />
              <Skeleton className="h-5 w-10 bg-muted" />
            </div>
            <Skeleton className="h-1 w-full bg-muted mb-3" />
            <div className="grid grid-cols-10 gap-1.5">
              {Array.from({ length: 30 }, (_, i) => `sk-${i}`).map((k) => (
                <Skeleton
                  key={k}
                  className="aspect-square rounded-sm bg-muted"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function HomeTab({
  subjects,
  search,
  isLoading,
  overallCompletion,
  predictedScore,
  timetable,
}: HomeTabProps) {
  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );
  const [showStylePanel, setShowStylePanel] = useState(false);
  const styleBtnRef = useRef<HTMLButtonElement>(null);
  const { style: sectionStyle } = useSectionStyle("home");

  return (
    <div className="p-6 max-w-4xl mx-auto" style={sectionStyle}>
      {/* Section Style Panel */}
      {showStylePanel && (
        <SectionStylePanel
          sectionId="home"
          sectionLabel="Dashboard"
          onClose={() => setShowStylePanel(false)}
          anchorRef={styleBtnRef as React.RefObject<HTMLElement | null>}
        />
      )}
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track your 30-day study progress
          </p>
        </div>
        <Button
          ref={styleBtnRef}
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50 shrink-0"
          onClick={() => setShowStylePanel((p) => !p)}
          title="Customize section style"
          data-ocid="home.style.button"
        >
          <Palette size={13} />
        </Button>
      </div>

      {/* Dashboard summary */}
      <DashboardCard
        overallCompletion={overallCompletion}
        predictedScore={predictedScore}
        timetable={timetable}
      />

      {/* Overall Performance Card */}
      <OverallPerformanceCard />

      {/* Subject grid */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
            <BookOpen size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-foreground mb-1">
            {search ? "No subjects found" : "No subjects yet"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {search
              ? `No subjects match "${search}"`
              : "Add your first subject from the sidebar to start tracking."}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((subject) => (
              <SubjectCard key={subject.id.toString()} subject={subject} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
