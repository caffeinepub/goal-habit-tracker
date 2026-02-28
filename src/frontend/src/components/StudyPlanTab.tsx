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
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  PlusCircle,
  Target,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { StudySession } from "../backend.d";
import { useAddStudySession, useGetStudySessions } from "../hooks/useQueries";

const DAILY_TARGET_HOURS = 15;
const SSC_SUBJECTS = [
  "Maths",
  "English",
  "Reasoning",
  "General Knowledge",
  "Current Affairs",
  "Computer",
];

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "bg-primary/20 text-primary border-primary/30",
  English: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Reasoning: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "General Knowledge": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Current Affairs": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Computer: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
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

export default function StudyPlanTab() {
  const { data: sessions = [], isLoading } = useGetStudySessions();
  const addSession = useAddStudySession();

  const [subject, setSubject] = useState("");
  const [hoursInput, setHoursInput] = useState("");
  const [dateInput, setDateInput] = useState(getTodayDate());

  const today = getTodayDate();
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

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Number.parseFloat(hoursInput);
    if (!subject) {
      toast.error("Select a subject");
      return;
    }
    if (Number.isNaN(h) || h <= 0 || h > 15) {
      toast.error("Enter valid hours (0.5 – 15)");
      return;
    }
    addSession.mutate(
      { subjectName: subject, hours: h, date: dateInput },
      {
        onSuccess: () => {
          toast.success(`Logged ${formatHours(h)} for ${subject}`);
          setHoursInput("");
        },
        onError: () => toast.error("Failed to log session"),
      },
    );
  };

  const goalMet = todayHours >= DAILY_TARGET_HOURS;

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
            15 Hours Study Plan
          </h2>
        </div>
        <p className="text-sm text-muted-foreground ml-11">
          Track your daily 15-hour study target across all SSC CGL subjects
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
                </div>

                <Progress
                  value={dailyPct}
                  className="h-3 bg-muted mb-3 rounded-full"
                />

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2.5 rounded-lg bg-muted/40">
                    <p className="font-display text-xl font-bold text-primary leading-none">
                      {formatHours(todayHours)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Studied
                    </p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-muted/40">
                    <p className="font-display text-xl font-bold text-foreground leading-none">
                      {formatHours(remaining)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Remaining
                    </p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-muted/40">
                    <p className="font-display text-xl font-bold text-foreground leading-none">
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLog} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Subject
                  </Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="bg-muted/40 border-input focus:border-primary/50">
                      <SelectValue placeholder="Select subject..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SSC_SUBJECTS.map((s) => (
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
                    onChange={(e) => setHoursInput(e.target.value)}
                    className="bg-muted/40 border-input focus:border-primary/50 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Date
                  </Label>
                  <Input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="bg-muted/40 border-input focus:border-primary/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={addSession.isPending || !subject || !hoursInput}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {addSession.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Logging...
                    </span>
                  ) : (
                    <>
                      <Clock size={14} className="mr-2" />
                      Log Hours
                    </>
                  )}
                </Button>
              </form>
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

                    {/* Bar */}
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

            {/* Weekly total */}
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
