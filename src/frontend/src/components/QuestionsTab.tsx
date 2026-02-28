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
  Flame,
  PlusCircle,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { SubjectQuestionProgress } from "../backend.d";
import { useAddQuestions, useGetQuestionProgress } from "../hooks/useQueries";

const TOTAL_GOAL = 9000;

const SUBJECT_TARGETS: {
  name: string;
  target: number;
  color: string;
  icon: React.ReactNode;
}[] = [
  {
    name: "Maths",
    target: 2000,
    color: "text-primary bg-primary/10 border-primary/30",
    icon: <Target size={14} />,
  },
  {
    name: "English",
    target: 2000,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    icon: <BookOpen size={14} />,
  },
  {
    name: "Reasoning",
    target: 2000,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    icon: <Zap size={14} />,
  },
  {
    name: "General Knowledge",
    target: 1500,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    icon: <Star size={14} />,
  },
  {
    name: "Current Affairs",
    target: 1000,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    icon: <Flame size={14} />,
  },
  {
    name: "Computer",
    target: 500,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    icon: <CheckCircle2 size={14} />,
  },
];

const MILESTONES = [
  { count: 1000, label: "1K Hustler", icon: <Flame size={14} /> },
  { count: 2500, label: "2.5K Warrior", icon: <Zap size={14} /> },
  { count: 5000, label: "5K Champion", icon: <Award size={14} /> },
  { count: 7500, label: "7.5K Legend", icon: <Star size={14} /> },
  { count: 9000, label: "9K Master", icon: <Trophy size={14} /> },
];

function getMotivationalMessage(total: number): string {
  const pct = (total / TOTAL_GOAL) * 100;
  if (pct === 0)
    return "Begin your 9000 questions journey today. Every question counts!";
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
  if (pct < 100) return "So close to 9000! Give it everything you have!";
  return "🏆 All 9000 questions completed! You're ready to crack SSC CGL!";
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

export default function QuestionsTab() {
  const { data: rawProgress = [], isLoading } = useGetQuestionProgress();
  const addQuestions = useAddQuestions();

  const [subject, setSubject] = useState("");
  const [countInput, setCountInput] = useState("");

  // Build a map from backend data
  const progressMap: Record<string, number> = {};
  for (const p of rawProgress as SubjectQuestionProgress[]) {
    progressMap[p.subjectName] = Number(p.count);
  }

  const totalSolved = Object.values(progressMap).reduce((a, b) => a + b, 0);
  const totalPct = Math.min((totalSolved / TOTAL_GOAL) * 100, 100);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number.parseInt(countInput, 10);
    if (!subject) {
      toast.error("Select a subject");
      return;
    }
    if (Number.isNaN(n) || n <= 0 || n > 1000) {
      toast.error("Enter valid count (1 – 1000)");
      return;
    }
    addQuestions.mutate(
      { subjectName: subject, count: n },
      {
        onSuccess: () => {
          toast.success(`Added ${n} questions for ${subject}`);
          setCountInput("");
        },
        onError: () => toast.error("Failed to log questions"),
      },
    );
  };

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
            9000 Questions Challenge
          </h2>
        </div>
        <p className="text-sm text-muted-foreground ml-11">
          Solve 9000 targeted questions across all SSC CGL subjects
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
                    {getMotivationalMessage(totalSolved)}
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
                Log Questions Solved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Subject
                  </Label>
                  <Select value={subject} onValueChange={setSubject}>
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
                    Questions Solved
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={1000}
                    placeholder="e.g. 50"
                    value={countInput}
                    onChange={(e) => setCountInput(e.target.value)}
                    className="bg-muted/40 border-input focus:border-primary/50 font-mono"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={addQuestions.isPending || !subject || !countInput}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {addQuestions.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Adding...
                    </span>
                  ) : (
                    <>
                      <PlusCircle size={14} className="mr-2" />
                      Add Questions
                    </>
                  )}
                </Button>
              </form>
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
