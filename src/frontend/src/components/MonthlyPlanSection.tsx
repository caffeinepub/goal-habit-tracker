import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  Lock,
  Target,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const TOTAL_GOAL = 9000;
const TOTAL_DAYS = 30;
const DAILY_TARGET = 300; // 9000 / 30

// Subject daily targets
const SUBJECT_DAILY = [
  { name: "Maths", daily: 67, total: 2000 },
  { name: "English", daily: 67, total: 2000 },
  { name: "Reasoning", daily: 67, total: 2000 },
  { name: "General Knowledge", daily: 50, total: 1500 },
  { name: "Current Affairs", daily: 33, total: 1000 },
  { name: "Computer", daily: 17, total: 500 },
];

function isPastNoon() {
  // Today is always editable for the full 24 hours
  return false;
}

function getTodayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getDateKey(planStart: Date, dayIndex: number): string {
  const d = new Date(planStart);
  d.setDate(d.getDate() + dayIndex);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getDaysElapsed(planStart: Date): number {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startDate = new Date(
    planStart.getFullYear(),
    planStart.getMonth(),
    planStart.getDate(),
  );
  const diff = startOfToday.getTime() - startDate.getTime();
  return Math.max(0, Math.min(TOTAL_DAYS, Math.floor(diff / 86400000)));
}

function getPaceMessage(
  _totalSolved: number,
  daysElapsed: number,
  totalSoFar: number,
): string {
  const remaining = TOTAL_GOAL - totalSoFar;
  const daysLeft = TOTAL_DAYS - daysElapsed;
  if (daysLeft <= 0) {
    if (totalSoFar >= TOTAL_GOAL)
      return "🏆 Challenge complete! Incredible work!";
    return `Plan ended — ${totalSoFar.toLocaleString()}/${TOTAL_GOAL.toLocaleString()} questions done.`;
  }
  if (remaining <= 0) return "🏆 Goal achieved ahead of schedule!";
  const requiredPerDay = Math.ceil(remaining / daysLeft);
  if (requiredPerDay <= DAILY_TARGET)
    return `You need ${requiredPerDay}/day for ${daysLeft} remaining days — you're on track! ✅`;
  return `You need ${requiredPerDay}/day for ${daysLeft} remaining days to hit 9000 — step it up! ⚡`;
}

type DayStatus = "complete" | "partial" | "missed" | "today" | "future";

function getDayStatus(
  count: number,
  isPast: boolean,
  isToday: boolean,
): DayStatus {
  if (isToday) return "today";
  if (!isPast && !isToday) return "future";
  if (count >= DAILY_TARGET) return "complete";
  if (count > 0) return "partial";
  return "missed";
}

const DAY_STATUS_STYLES: Record<DayStatus, string> = {
  complete: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
  partial: "bg-amber-500/15 border-amber-500/40 text-amber-400",
  missed: "bg-destructive/10 border-destructive/30 text-destructive/70",
  today: "border-primary ring-2 ring-primary/40 bg-primary/10 text-primary",
  future: "bg-muted/20 border-border text-muted-foreground/40",
};

export default function MonthlyPlanSection() {
  const [logs, setLogs] = useState<Record<string, number>>({});
  const [planStart, setPlanStart] = useState<Date | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locked = isPastNoon();

  // Load from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem("ssc_monthly_plan");
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch {
        setLogs({});
      }
    }

    const savedStart = localStorage.getItem("ssc_plan_start");
    if (savedStart) {
      setPlanStart(new Date(savedStart));
    } else {
      const now = new Date();
      const startStr = now.toISOString();
      localStorage.setItem("ssc_plan_start", startStr);
      setPlanStart(now);
    }
  }, []);

  const todayKey = getTodayKey();
  const daysElapsed = planStart ? getDaysElapsed(planStart) : 0;
  const daysRemaining = Math.max(0, TOTAL_DAYS - daysElapsed);

  const todaySolved = logs[todayKey] ?? 0;
  const totalSoFar = Object.values(logs).reduce((a, b) => a + b, 0);

  const handleLogToday = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number.parseInt(inputValue, 10);
    if (Number.isNaN(n) || n < 1 || n > 500) {
      toast.error("Enter a valid number between 1 and 500");
      return;
    }
    setIsSubmitting(true);
    const newLogs = { ...logs, [todayKey]: (logs[todayKey] ?? 0) + n };
    setLogs(newLogs);
    localStorage.setItem("ssc_monthly_plan", JSON.stringify(newLogs));
    setInputValue("");
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Logged ${n} questions for today! Keep going! 🔥`);
    }, 400);
  };

  // Build weekly breakdown
  const weeks: { label: string; startDay: number; endDay: number }[] = [];
  for (let w = 0; w < Math.ceil(TOTAL_DAYS / 7); w++) {
    const startDay = w * 7;
    const endDay = Math.min(startDay + 6, TOTAL_DAYS - 1);
    weeks.push({ label: `Week ${w + 1}`, startDay, endDay });
  }

  const getWeekStats = (
    startDay: number,
    endDay: number,
  ): { target: number; solved: number; days: number } => {
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

  const paceMessage = getPaceMessage(todaySolved, daysElapsed, totalSoFar);

  // Build 30 day cells
  const dayCells = planStart
    ? Array.from({ length: TOTAL_DAYS }, (_, i) => {
        const dayKey = getDateKey(planStart, i);
        const count = logs[dayKey] ?? 0;
        const isPast = i < daysElapsed;
        const isToday = dayKey === todayKey;
        const status = getDayStatus(count, isPast, isToday);
        return { dayNum: i + 1, key: dayKey, count, status };
      })
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="mt-8"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
          <CalendarDays size={16} className="text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            30-Day 9000 Questions Plan
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            300 questions/day · Track your daily progress toward the ultimate
            goal
          </p>
        </div>
      </div>

      {/* Summary Stats Row */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.07 } },
          hidden: {},
        }}
      >
        {[
          {
            label: "Daily Target",
            value: DAILY_TARGET.toString(),
            icon: <Target size={14} className="text-primary" />,
            sub: "questions/day",
            highlight: false,
          },
          {
            label: "Today Solved",
            value: todaySolved.toString(),
            icon: <Flame size={14} className="text-amber-400" />,
            sub:
              todaySolved >= DAILY_TARGET
                ? "Target hit! 🎯"
                : `${DAILY_TARGET - todaySolved} to go`,
            highlight: todaySolved >= DAILY_TARGET,
          },
          {
            label: "Total So Far",
            value: totalSoFar.toLocaleString(),
            icon: <TrendingUp size={14} className="text-emerald-400" />,
            sub: `${Math.round((totalSoFar / TOTAL_GOAL) * 100)}% of 9000`,
            highlight: false,
          },
          {
            label: "Days Remaining",
            value: daysRemaining.toString(),
            icon: <CalendarDays size={14} className="text-blue-400" />,
            sub: `Day ${Math.min(daysElapsed + 1, 30)} of 30`,
            highlight: false,
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Card
              className={`border ${stat.highlight ? "border-primary/40 bg-primary/5" : "border-border"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  {stat.icon}
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    {stat.label}
                  </span>
                </div>
                <p
                  className={`font-display text-2xl font-bold leading-none ${stat.highlight ? "text-primary" : "text-foreground"}`}
                >
                  {stat.value}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {stat.sub}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {/* Log Today's Questions */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
              <Flame size={15} className="text-amber-400" />
              Log Today's Questions
              {locked && (
                <span className="ml-auto flex items-center gap-1 text-amber-400 text-xs font-normal">
                  <Lock size={11} />
                  Locked
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {locked ? (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 py-6 px-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center">
                  <Lock size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-400">
                    Editing locked after 12:00 PM
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Today's questions have been recorded. Come back tomorrow to
                    log more.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={11} />
                  <span>Today solved: {todaySolved} questions</span>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleLogToday} className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border mb-2">
                  <Clock size={12} className="text-muted-foreground shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Logging for today:{" "}
                    <span className="font-semibold text-foreground">
                      {new Date().toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>{" "}
                    · Editable all day
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Questions Solved Today
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={500}
                    placeholder="e.g. 150"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-muted/40 border-input focus:border-primary/50 font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Today so far:{" "}
                    <span className="font-mono font-bold text-foreground">
                      {todaySolved}
                    </span>{" "}
                    questions
                    {todaySolved > 0 && (
                      <span
                        className={`ml-1 ${todaySolved >= DAILY_TARGET ? "text-emerald-400" : "text-amber-400"}`}
                      >
                        {todaySolved >= DAILY_TARGET
                          ? "✓ Target met!"
                          : `(${DAILY_TARGET - todaySolved} more to reach 300)`}
                      </span>
                    )}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !inputValue}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Logging...
                    </span>
                  ) : (
                    <>
                      <Flame size={14} className="mr-2" />
                      Log Questions
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Today's progress bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Today's Progress</span>
                <span className="font-mono font-bold">
                  {todaySolved}/{DAILY_TARGET}
                </span>
              </div>
              <Progress
                value={Math.min((todaySolved / DAILY_TARGET) * 100, 100)}
                className="h-2 bg-muted rounded-full"
              />
            </div>

            {/* Subject daily targets reference */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                Daily Subject Targets
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {SUBJECT_DAILY.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between px-2 py-1 rounded bg-muted/30 text-[10px]"
                  >
                    <span className="text-muted-foreground truncate">
                      {s.name}
                    </span>
                    <span className="font-mono font-bold text-foreground ml-1 shrink-0">
                      {s.daily}/day
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pace Indicator + Overall Plan Progress */}
        <div className="space-y-4">
          {/* Motivational Pace Card */}
          <Card
            className={`border ${totalSoFar >= TOTAL_GOAL ? "border-primary/40 bg-primary/5" : daysElapsed > 0 && totalSoFar < daysElapsed * DAILY_TARGET ? "border-destructive/40 bg-destructive/5" : "border-border"}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {totalSoFar >= TOTAL_GOAL ? (
                    <CheckCircle2 size={16} className="text-primary" />
                  ) : daysElapsed > 0 &&
                    totalSoFar < daysElapsed * DAILY_TARGET ? (
                    <AlertCircle size={16} className="text-destructive" />
                  ) : (
                    <TrendingUp size={16} className="text-emerald-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground mb-1">
                    Pace Indicator
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {paceMessage}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall plan progress */}
          <Card className="border-border">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  30-Day Overall Progress
                </span>
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-primary/30 text-primary"
                >
                  {Math.round((totalSoFar / TOTAL_GOAL) * 100)}%
                </Badge>
              </div>
              <Progress
                value={Math.min((totalSoFar / TOTAL_GOAL) * 100, 100)}
                className="h-3 bg-muted rounded-full"
              />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="font-mono text-sm font-bold text-primary">
                    {totalSoFar.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    Solved
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="font-mono text-sm font-bold text-foreground">
                    {(TOTAL_GOAL - totalSoFar).toLocaleString()}
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    Remaining
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="font-mono text-sm font-bold text-foreground">
                    {daysElapsed * DAILY_TARGET > 0
                      ? (totalSoFar / Math.max(daysElapsed, 1)).toFixed(0)
                      : "—"}
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    Avg/Day
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 30-Day Calendar Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-5"
      >
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
              <CalendarDays size={15} className="text-primary" />
              30-Day Calendar
              <div className="flex items-center gap-3 ml-auto text-[10px] text-muted-foreground font-normal">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 border border-emerald-500/50 inline-block" />
                  ≥300
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/30 border border-amber-500/50 inline-block" />
                  1–299
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-destructive/20 border border-destructive/30 inline-block" />
                  Missed
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
              <AnimatePresence>
                {dayCells.map((cell, i) => (
                  <motion.div
                    key={cell.key}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.015, duration: 0.2 }}
                    className={`relative flex flex-col items-center justify-center gap-0.5 p-1.5 rounded-lg border text-center min-h-[56px] ${DAY_STATUS_STYLES[cell.status]}`}
                  >
                    <span className="text-[9px] font-medium opacity-70">
                      D{cell.dayNum}
                    </span>
                    <span className="font-mono text-[11px] font-bold leading-none">
                      {cell.status === "future" ? "—" : cell.count}
                    </span>
                    {/* Mini bar */}
                    {cell.status !== "future" && (
                      <div className="w-full mt-1 h-0.5 rounded-full bg-current/20 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-current"
                          style={{
                            width: `${Math.min((cell.count / DAILY_TARGET) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    )}
                    {cell.status === "complete" && (
                      <CheckCircle2
                        size={8}
                        className="text-emerald-400 absolute top-1 right-1"
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
              <TrendingUp size={15} className="text-primary" />
              Weekly Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium pl-4">
                    Week
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Days
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Target
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Solved
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium pr-4">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeks.map((week) => {
                  const stats = getWeekStats(week.startDay, week.endDay);
                  const weekDaysElapsed = Math.max(
                    0,
                    Math.min(
                      week.endDay - week.startDay + 1,
                      Math.max(0, daysElapsed - week.startDay),
                    ),
                  );
                  const expectedSoFar = weekDaysElapsed * DAILY_TARGET;
                  let statusLabel = "Upcoming";
                  let statusClass = "text-muted-foreground border-border";

                  if (weekDaysElapsed > 0) {
                    if (stats.solved >= stats.target) {
                      statusLabel = "Ahead";
                      statusClass =
                        "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
                    } else if (stats.solved >= expectedSoFar) {
                      statusLabel = "On Track";
                      statusClass =
                        "text-blue-400 border-blue-500/40 bg-blue-500/10";
                    } else {
                      statusLabel = "Behind";
                      statusClass =
                        "text-destructive border-destructive/40 bg-destructive/10";
                    }
                  }

                  return (
                    <TableRow
                      key={week.label}
                      className="border-border hover:bg-muted/10"
                    >
                      <TableCell className="font-display font-semibold text-sm text-foreground pl-4">
                        {week.label}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        D{week.startDay + 1}–D{week.endDay + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-foreground">
                        {stats.target.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {stats.solved.toLocaleString()}
                          </span>
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden min-w-[40px]">
                            <div
                              className="h-full rounded-full bg-primary/70"
                              style={{
                                width: `${Math.min((stats.solved / stats.target) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="pr-4">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${statusClass}`}
                        >
                          {statusLabel}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
