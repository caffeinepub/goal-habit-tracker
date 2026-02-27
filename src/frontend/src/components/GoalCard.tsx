import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreVertical, ChevronRight, Flame } from "lucide-react";
import type { Goal } from "../backend.d";
import { useGetCompletionCount, useIsCompleted, useLogCompletion } from "../hooks/useQueries";
import { toast } from "sonner";

interface GoalCardProps {
  goal: Goal;
  index: number;
  today: string;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: bigint) => void;
  onViewDetail: (goalId: bigint) => void;
}

export default function GoalCard({
  goal,
  index,
  today,
  onEdit,
  onDelete,
  onViewDetail,
}: GoalCardProps) {
  const { data: completionCount = BigInt(0) } = useGetCompletionCount(goal.id);
  const { data: isCompletedToday = false } = useIsCompleted(goal.id, today);
  const logCompletion = useLogCompletion();

  const count = Number(completionCount);
  const target = Number(goal.targetCount);
  const progress = Math.min(100, target > 0 ? (count / target) * 100 : 0);
  const isComplete = progress >= 100;

  const handleToggle = async () => {
    try {
      await logCompletion.mutateAsync({ goalId: goal.id, date: today });
      if (!isCompletedToday) {
        toast.success("Logged today's completion!");
      }
    } catch {
      toast.error("Failed to log completion");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      layout
    >
      <Card className="glass-card group relative overflow-hidden transition-all duration-300 hover:shadow-glow hover:border-primary/30">
        {/* Completion glow */}
        {isComplete && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 to-transparent" />
        )}

        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <div className="mt-0.5 shrink-0">
              <Checkbox
                checked={isCompletedToday}
                onCheckedChange={handleToggle}
                disabled={logCompletion.isPending}
                className="h-5 w-5 border-2 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                aria-label={`Mark ${goal.title} as done today`}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <button
                  type="button"
                  onClick={() => onViewDetail(goal.id)}
                  className="group/title flex items-center gap-1 text-left"
                >
                  <h3 className="font-semibold text-foreground text-base leading-tight group-hover/title:text-primary transition-colors truncate max-w-[200px]">
                    {goal.title}
                  </h3>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/title:opacity-100 transition-all -translate-x-1 group-hover/title:translate-x-0 shrink-0" />
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  {isComplete && (
                    <span className="badge-complete text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 shrink-0">
                      <Flame className="h-3 w-3" />
                      Complete
                    </span>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Goal actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-popover border-border"
                    >
                      <DropdownMenuItem
                        onClick={() => onEdit(goal)}
                        className="cursor-pointer hover:bg-accent"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(goal.id)}
                        className="cursor-pointer text-destructive hover:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {goal.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {goal.description}
                </p>
              )}

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {count} / {target} days
                  </span>
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      isComplete ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full progress-bar-emerald"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, delay: index * 0.06 + 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Today status */}
              {isCompletedToday && (
                <p className="text-xs text-primary mt-2 font-medium">
                  ✓ Done today
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
