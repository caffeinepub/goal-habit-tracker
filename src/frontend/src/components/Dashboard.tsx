import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Target, Zap, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import GoalCard from "./GoalCard";
import GoalModal from "./GoalModal";
import { useGetGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from "../hooks/useQueries";
import type { Goal } from "../backend.d";

interface DashboardProps {
  onViewGoal: (goalId: bigint) => void;
}

const today = new Date().toISOString().split("T")[0];

export default function Dashboard({ onViewGoal }: DashboardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deleteGoalId, setDeleteGoalId] = useState<bigint | null>(null);

  const { data: goals = [], isLoading } = useGetGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: {
    title: string;
    description: string;
    targetCount: number;
  }) => {
    try {
      if (editingGoal) {
        await updateGoal.mutateAsync({ goalId: editingGoal.id, ...data });
        toast.success("Goal updated");
      } else {
        await createGoal.mutateAsync(data);
        toast.success("Goal created!");
      }
      setModalOpen(false);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (deleteGoalId === null) return;
    try {
      await deleteGoal.mutateAsync(deleteGoalId);
      toast.success("Goal deleted");
    } catch {
      toast.error("Failed to delete goal");
    } finally {
      setDeleteGoalId(null);
    }
  };

  const isModalLoading = createGoal.isPending || updateGoal.isPending;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">
                Mission Control
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {today}
              </p>
            </div>
          </div>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats bar */}
        {!isLoading && goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            <StatCard
              icon={<Target className="h-4 w-4 text-primary" />}
              label="Total Goals"
              value={goals.length}
            />
            <StatCard
              icon={<Zap className="h-4 w-4 text-chart-4" />}
              label="Active"
              value={goals.length}
            />
            <StatCard
              icon={<TrendingUp className="h-4 w-4 text-chart-2" />}
              label="Today"
              value={new Date().toLocaleDateString("en-US", { weekday: "short" })}
            />
          </motion.div>
        )}

        {/* Goals list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[110px] w-full rounded-lg bg-card" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <EmptyState onCreate={handleOpenCreate} />
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {goals.map((goal, index) => (
                <GoalCard
                  key={goal.id.toString()}
                  goal={goal}
                  index={index}
                  today={today}
                  onEdit={handleOpenEdit}
                  onDelete={(id) => setDeleteGoalId(id)}
                  onViewDetail={onViewGoal}
                />
              ))}
            </AnimatePresence>
          </div>
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

      {/* Modals */}
      <GoalModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        goal={editingGoal}
        onSubmit={handleModalSubmit}
        isLoading={isModalLoading}
      />

      <AlertDialog
        open={deleteGoalId !== null}
        onOpenChange={(open) => !open && setDeleteGoalId(null)}
      >
        <AlertDialogContent className="bg-[oklch(0.19_0.02_252)] border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              All progress and completions will be permanently lost. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border hover:bg-accent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="glass-card rounded-lg p-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      <span className="text-xl font-bold text-foreground tabular-nums">
        {value}
      </span>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
          <Target className="h-9 w-9 text-primary" strokeWidth={1.5} />
        </div>
        <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">
        No goals yet
      </h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">
        Set your first goal and start tracking daily completions toward your
        target.
      </p>
      <Button
        onClick={onCreate}
        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow gap-2"
      >
        <Plus className="h-4 w-4" />
        Create your first goal
      </Button>
    </motion.div>
  );
}
