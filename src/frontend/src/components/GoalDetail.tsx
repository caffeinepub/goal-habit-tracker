import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  Target,
  CheckCircle2,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import GoalModal from "./GoalModal";
import { useGetGoals, useGetProgressEntries, useGetEntriesForGoal, useUpdateGoal, useDeleteGoal, useLogCompletion, useIsCompleted } from "../hooks/useQueries";

interface GoalDetailProps {
  goalId: bigint;
  onBack: () => void;
}

const today = new Date().toISOString().split("T")[0];

interface ChartDataPoint {
  date: string;
  cumulative: number;
  label: string;
}

function buildChartData(entries: string[]): ChartDataPoint[] {
  const sorted = [...entries].sort();
  const data: ChartDataPoint[] = [];
  sorted.forEach((date, i) => {
    const d = new Date(date);
    data.push({
      date,
      cumulative: i + 1,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  });
  return data;
}

export default function GoalDetail({ goalId, onBack }: GoalDetailProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data: goals = [], isLoading: goalsLoading } = useGetGoals();
  const { data: progressEntries = [], isLoading: progressLoading } = useGetProgressEntries(goalId);
  const { data: entries = [], isLoading: entriesLoading } = useGetEntriesForGoal(goalId);
  const { data: isCompletedToday = false } = useIsCompleted(goalId, today);
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const logCompletion = useLogCompletion();

  const goal = goals.find((g) => g.id === goalId);
  const isLoading = goalsLoading || progressLoading || entriesLoading;

  const target = goal ? Number(goal.targetCount) : 0;
  const progress = Math.min(100, target > 0 ? (entries.length / target) * 100 : 0);

  const chartData = buildChartData(entries);

  const handleToggleToday = async () => {
    try {
      await logCompletion.mutateAsync({ goalId, date: today });
      if (!isCompletedToday) {
        toast.success("Logged today's completion!");
      } else {
        toast("Removed today's completion");
      }
    } catch {
      toast.error("Failed to log completion");
    }
  };

  const handleEdit = async (data: { title: string; description: string; targetCount: number }) => {
    try {
      await updateGoal.mutateAsync({ goalId, ...data });
      toast.success("Goal updated");
      setEditModalOpen(false);
    } catch {
      toast.error("Failed to update goal");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGoal.mutateAsync(goalId);
      toast.success("Goal deleted");
      onBack();
    } catch {
      toast.error("Failed to delete goal");
    }
  };

  // Sort entries descending for the list
  const sortedEntries = [...entries].sort((a, b) => b.localeCompare(a));

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {goal && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditModalOpen(true)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit goal</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={deleteGoal.isPending}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete goal</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {isLoading ? (
          <LoadingSkeleton />
        ) : !goal ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Goal not found.</p>
            <Button onClick={onBack} className="mt-4" variant="outline">
              Go back
            </Button>
          </div>
        ) : (
          <>
            {/* Goal header card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-foreground leading-tight">
                        {goal.title}
                      </h2>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {goal.description}
                        </p>
                      )}
                    </div>
                    {progress >= 100 && (
                      <Badge className="badge-complete shrink-0">
                        Complete
                      </Badge>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {entries.length} of {target} completions
                      </span>
                      <span className="font-semibold text-primary tabular-nums">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full progress-bar-emerald"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Today's check-in */}
                  <Button
                    onClick={handleToggleToday}
                    disabled={logCompletion.isPending}
                    size="sm"
                    variant={isCompletedToday ? "outline" : "default"}
                    className={
                      isCompletedToday
                        ? "border-primary text-primary hover:bg-primary/10 gap-1.5"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm gap-1.5"
                    }
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isCompletedToday ? "Done today ✓" : "Log today"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-3"
            >
              <MiniStat
                icon={<Target className="h-4 w-4 text-primary" />}
                label="Target"
                value={target}
              />
              <MiniStat
                icon={<CheckCircle2 className="h-4 w-4 text-chart-2" />}
                label="Done"
                value={entries.length}
              />
              <MiniStat
                icon={<TrendingUp className="h-4 w-4 text-chart-4" />}
                label="Remaining"
                value={Math.max(0, target - entries.length)}
              />
            </motion.div>

            {/* Chart */}
            {chartData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="glass-card">
                  <CardHeader className="pb-0 pt-5 px-5">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Cumulative Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="oklch(0.28 0.025 255)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="label"
                          tick={{ fill: "oklch(0.58 0.02 250)", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          tick={{ fill: "oklch(0.58 0.02 250)", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "oklch(0.19 0.02 252)",
                            border: "1px solid oklch(0.28 0.025 255)",
                            borderRadius: "8px",
                            color: "oklch(0.95 0.01 240)",
                            fontSize: "12px",
                          }}
                          labelStyle={{ color: "oklch(0.72 0.19 155)", fontWeight: 600 }}
                          formatter={(value: number) => [value, "Completions"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="cumulative"
                          stroke="oklch(0.72 0.19 155)"
                          strokeWidth={2.5}
                          dot={{
                            fill: "oklch(0.72 0.19 155)",
                            r: 3,
                            strokeWidth: 0,
                          }}
                          activeDot={{
                            r: 5,
                            fill: "oklch(0.72 0.19 155)",
                            stroke: "oklch(0.13 0.015 250)",
                            strokeWidth: 2,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Completion log */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader className="pb-0 pt-5 px-5">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Completion Log
                    <span className="ml-auto text-xs font-normal normal-case text-muted-foreground">
                      {entries.length} entries
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-3">
                  {sortedEntries.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No completions logged yet.
                    </p>
                  ) : (
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                      {sortedEntries.map((date) => {
                        const d = new Date(date + "T00:00:00");
                        const isToday = date === today;
                        return (
                          <div
                            key={date}
                            className={`flex items-center justify-between py-2 px-3 rounded-md text-sm transition-colors ${
                              isToday
                                ? "bg-primary/10 border border-primary/20"
                                : "bg-muted/30 hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2
                                className={`h-4 w-4 shrink-0 ${
                                  isToday ? "text-primary" : "text-muted-foreground"
                                }`}
                              />
                              <span
                                className={isToday ? "text-primary font-medium" : "text-foreground"}
                              >
                                {d.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            {isToday && (
                              <span className="text-xs text-primary font-medium">Today</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-5">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {goal && (
        <GoalModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          goal={goal}
          onSubmit={handleEdit}
          isLoading={updateGoal.isPending}
        />
      )}
    </motion.div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="glass-card rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      <span className="text-2xl font-bold text-foreground tabular-nums block">
        {value}
      </span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-32 w-full rounded-lg bg-card" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-20 rounded-lg bg-card" />
        <Skeleton className="h-20 rounded-lg bg-card" />
        <Skeleton className="h-20 rounded-lg bg-card" />
      </div>
      <Skeleton className="h-60 w-full rounded-lg bg-card" />
      <Skeleton className="h-40 w-full rounded-lg bg-card" />
    </div>
  );
}
