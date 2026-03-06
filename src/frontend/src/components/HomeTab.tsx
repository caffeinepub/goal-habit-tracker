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
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Subject } from "../backend.d";
import { useDeleteSubject, useToggleDay } from "../hooks/useQueries";
import SectionStylePanel, { useSectionStyle } from "./SectionStylePanel";

const DAYS = 30;

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
