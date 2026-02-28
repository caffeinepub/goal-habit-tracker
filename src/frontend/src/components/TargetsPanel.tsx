import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, CheckCircle2, Settings, Target } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { SubjectTarget } from "../backend.d";
import {
  DEFAULT_TARGETS,
  useGetQuestionProgress,
  useGetStudySessions,
  useGetTargets,
  useSetQuestionCount,
  useSetStudySession,
  useSetTargets,
} from "../hooks/useQueries";

type SaveStatus = "idle" | "saving" | "saved";

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "text-primary",
  English: "text-blue-400",
  Reasoning: "text-purple-400",
  "General Knowledge": "text-amber-400",
  "Current Affairs": "text-emerald-400",
  Computer: "text-cyan-400",
};

const SUBJECT_BG: Record<string, string> = {
  Maths: "bg-primary/10",
  English: "bg-blue-400/10",
  Reasoning: "bg-purple-400/10",
  "General Knowledge": "bg-amber-400/10",
  "Current Affairs": "bg-emerald-400/10",
  Computer: "bg-cyan-400/10",
};

interface TargetsPanelProps {
  /** Optional trigger to replace the default gear icon */
  trigger?: React.ReactNode;
}

export default function TargetsPanel({ trigger }: TargetsPanelProps) {
  const { data: targets } = useGetTargets();
  const setTargets = useSetTargets();
  const { data: studySessions } = useGetStudySessions();
  const { data: questionProgress } = useGetQuestionProgress();
  const setStudySession = useSetStudySession();
  const setQuestionCount = useSetQuestionCount();

  const today = new Date().toISOString().split("T")[0];
  const todayDisplay = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const [open, setOpen] = useState(false);
  const [totalGoal, setTotalGoal] = useState(9000);
  const [dailyHours, setDailyHours] = useState(15);
  const [planDays, setPlanDays] = useState(30);
  const [subjectTargets, setSubjectTargets] = useState<SubjectTarget[]>(
    DEFAULT_TARGETS.subjectTargets,
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // Per-subject today's hours and questions local state
  const [todayHours, setTodayHours] = useState<Record<string, string>>({});
  const [todayQuestions, setTodayQuestions] = useState<Record<string, string>>(
    {},
  );
  const [hoursSaveStatus, setHoursSaveStatus] = useState<SaveStatus>("idle");
  const [questionsSaveStatus, setQuestionsSaveStatus] =
    useState<SaveStatus>("idle");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoursDebounceRefs = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const questionsDebounceRefs = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const hoursSavedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const questionsSavedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const initialized = useRef(false);
  const progressInitialized = useRef(false);

  // Derived: daily questions target
  const dailyQuestionsTarget =
    planDays > 0 ? Math.round(totalGoal / planDays) : 0;

  // Populate form when targets load (only once per dialog open)
  useEffect(() => {
    if (targets && open && !initialized.current) {
      setTotalGoal(Number(targets.totalQuestionsGoal));
      setDailyHours(targets.dailyStudyHoursTarget);
      setPlanDays(Number(targets.planTotalDays));
      setSubjectTargets(targets.subjectTargets);
      initialized.current = true;
    }
    if (!open) {
      initialized.current = false;
      progressInitialized.current = false;
    }
  }, [targets, open]);

  // Populate today's progress when dialog opens and data loads
  useEffect(() => {
    if (!open || progressInitialized.current) return;
    if (!studySessions || !questionProgress) return;

    // Build today's hours per subject
    const hoursMap: Record<string, string> = {};
    for (const subj of DEFAULT_TARGETS.subjectTargets) {
      const total = (
        studySessions as Array<{
          subjectName: string;
          hours: number;
          date: string;
        }>
      )
        .filter((s) => s.date === today && s.subjectName === subj.name)
        .reduce((acc, s) => acc + s.hours, 0);
      hoursMap[subj.name] = total > 0 ? String(total) : "0";
    }
    setTodayHours(hoursMap);

    // Build today's questions per subject
    const questionsMap: Record<string, string> = {};
    for (const subj of DEFAULT_TARGETS.subjectTargets) {
      const entry = (
        questionProgress as Array<{ subjectName: string; count: bigint }>
      ).find((q) => q.subjectName === subj.name);
      questionsMap[subj.name] = entry ? String(Number(entry.count)) : "0";
    }
    setTodayQuestions(questionsMap);

    progressInitialized.current = true;
  }, [open, studySessions, questionProgress, today]);

  const triggerSave = useCallback(
    (goal: number, hours: number, days: number, subjects: SubjectTarget[]) => {
      if (goal < 100 || goal > 99999) return;
      if (hours < 1 || hours > 24) return;
      if (days < 1 || days > 365) return;

      setSaveStatus("saving");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);

      setTargets.mutate(
        {
          totalQuestionsGoal: goal,
          dailyStudyHoursTarget: hours,
          subjectTargets: subjects,
          planTotalDays: days,
        },
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
            toast.error("Failed to save targets");
          },
        },
      );
    },
    [setTargets],
  );

  const scheduleAutoSave = useCallback(
    (goal: number, hours: number, days: number, subjects: SubjectTarget[]) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        triggerSave(goal, hours, days, subjects);
      }, 600);
    },
    [triggerSave],
  );

  const handleTotalGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(0, Number(e.target.value));
    setTotalGoal(val);
    scheduleAutoSave(val, dailyHours, planDays, subjectTargets);
  };

  const handleDailyHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(0, Number(e.target.value));
    setDailyHours(val);
    scheduleAutoSave(totalGoal, val, planDays, subjectTargets);
  };

  const handlePlanDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Number(e.target.value));
    setPlanDays(val);
    scheduleAutoSave(totalGoal, dailyHours, val, subjectTargets);
  };

  const handleSubjectTargetChange = (name: string, rawVal: string) => {
    const val = Math.max(0, Number(rawVal));
    const updated = subjectTargets.map((s) =>
      s.name === name ? { ...s, target: BigInt(val) } : s,
    );
    setSubjectTargets(updated);
    scheduleAutoSave(totalGoal, dailyHours, planDays, updated);
  };

  // Today's hours change handler with per-subject debounce
  const handleTodayHoursChange = (subjectName: string, rawVal: string) => {
    const val = Math.max(0, Number(rawVal));
    setTodayHours((prev) => ({ ...prev, [subjectName]: rawVal }));

    if (hoursDebounceRefs.current[subjectName]) {
      clearTimeout(hoursDebounceRefs.current[subjectName]);
    }
    setHoursSaveStatus("saving");
    if (hoursSavedTimerRef.current) clearTimeout(hoursSavedTimerRef.current);

    hoursDebounceRefs.current[subjectName] = setTimeout(() => {
      setStudySession.mutate(
        { subjectName, hours: val, date: today },
        {
          onSuccess: () => {
            setHoursSaveStatus("saved");
            hoursSavedTimerRef.current = setTimeout(
              () => setHoursSaveStatus("idle"),
              2500,
            );
          },
          onError: () => {
            setHoursSaveStatus("idle");
            toast.error(`Failed to save hours for ${subjectName}`);
          },
        },
      );
    }, 600);
  };

  // Today's questions change handler with per-subject debounce
  const handleTodayQuestionsChange = (subjectName: string, rawVal: string) => {
    const val = Math.max(0, Number(rawVal));
    setTodayQuestions((prev) => ({ ...prev, [subjectName]: rawVal }));

    if (questionsDebounceRefs.current[subjectName]) {
      clearTimeout(questionsDebounceRefs.current[subjectName]);
    }
    setQuestionsSaveStatus("saving");
    if (questionsSavedTimerRef.current)
      clearTimeout(questionsSavedTimerRef.current);

    questionsDebounceRefs.current[subjectName] = setTimeout(() => {
      setQuestionCount.mutate(
        { subjectName, count: val },
        {
          onSuccess: () => {
            setQuestionsSaveStatus("saved");
            questionsSavedTimerRef.current = setTimeout(
              () => setQuestionsSaveStatus("idle"),
              2500,
            );
          },
          onError: () => {
            setQuestionsSaveStatus("idle");
            toast.error(`Failed to save questions for ${subjectName}`);
          },
        },
      );
    }, 600);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      if (hoursSavedTimerRef.current) clearTimeout(hoursSavedTimerRef.current);
      if (questionsSavedTimerRef.current)
        clearTimeout(questionsSavedTimerRef.current);
      for (const t of Object.values(hoursDebounceRefs.current)) clearTimeout(t);
      for (const t of Object.values(questionsDebounceRefs.current))
        clearTimeout(t);
    };
  }, []);

  const subjectSum = subjectTargets.reduce(
    (acc, s) => acc + Number(s.target),
    0,
  );
  const subjectSumMatchesGoal = subjectSum === totalGoal;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors"
            aria-label="Edit targets"
          >
            <Settings size={15} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Target size={16} className="text-primary" />
            </div>
            <div>
              <DialogTitle className="font-display text-lg font-bold text-foreground">
                Edit Study Targets
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Changes auto-save and recalculate all daily plans
              </DialogDescription>
            </div>
          </div>

          {/* Save status */}
          <div className="h-5 flex items-center">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <span className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                Saving…
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                <CheckCircle2 size={12} />
                Saved
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Overall Goals */}
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
              Overall Goals
            </p>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Total Questions Goal
              </Label>
              <Input
                type="number"
                min={100}
                max={99999}
                value={totalGoal}
                onChange={handleTotalGoalChange}
                className="bg-muted/40 border-input focus:border-primary/50 font-mono"
              />
              <p className="text-[10px] text-muted-foreground">
                Default: 9000 · Daily target:{" "}
                <span className="font-mono font-bold text-primary">
                  {dailyQuestionsTarget} questions/day
                </span>{" "}
                ({planDays} days)
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Daily Study Hours Target
              </Label>
              <Input
                type="number"
                min={1}
                max={24}
                step={0.5}
                value={dailyHours}
                onChange={handleDailyHoursChange}
                className="bg-muted/40 border-input focus:border-primary/50 font-mono"
              />
              <p className="text-[10px] text-muted-foreground">
                Default: 15 hours/day
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Plan Duration (Days)
              </Label>
              <Input
                type="number"
                min={1}
                max={365}
                value={planDays}
                onChange={handlePlanDaysChange}
                className="bg-muted/40 border-input focus:border-primary/50 font-mono"
              />
              <p className="text-[10px] text-muted-foreground">
                Default: 30 days
              </p>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Per-subject targets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                Subject Targets
              </p>
              <span
                className={`text-[10px] font-mono font-bold ${subjectSumMatchesGoal ? "text-emerald-400" : "text-amber-400"}`}
              >
                {subjectSum.toLocaleString()}/{totalGoal.toLocaleString()}
                {subjectSumMatchesGoal ? " ✓" : " ≠"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground -mt-1">
              Sum of subject targets should equal total goal
            </p>

            <div className="space-y-3">
              {subjectTargets.map((s) => {
                const colorClass = SUBJECT_COLORS[s.name] ?? "text-foreground";
                const dailySubject =
                  planDays > 0 ? Math.round(Number(s.target) / planDays) : 0;
                return (
                  <div key={s.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className={`text-xs font-semibold ${colorClass}`}>
                        {s.name}
                      </Label>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {dailySubject}/day
                      </span>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      max={99999}
                      value={Number(s.target)}
                      onChange={(e) =>
                        handleSubjectTargetChange(s.name, e.target.value)
                      }
                      className="bg-muted/40 border-input focus:border-primary/50 font-mono h-8 text-sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* ── TODAY'S PROGRESS ── */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                Today's Progress
              </p>
              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                <CalendarDays size={9} />
                {todayDisplay} · Editable today only
              </span>
            </div>

            {/* Today's Study Hours */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">
                  Study Hours
                </p>
                <div className="h-4 flex items-center">
                  {hoursSaveStatus === "saving" && (
                    <span className="flex items-center gap-1 text-muted-foreground text-[10px]">
                      <span className="animate-spin h-2.5 w-2.5 border border-current border-t-transparent rounded-full" />
                      Saving…
                    </span>
                  )}
                  {hoursSaveStatus === "saved" && (
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                      <CheckCircle2 size={10} />
                      Saved
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {subjectTargets.map((s) => {
                  const colorClass =
                    SUBJECT_COLORS[s.name] ?? "text-foreground";
                  const bgClass = SUBJECT_BG[s.name] ?? "bg-muted/20";
                  return (
                    <div
                      key={`hours-${s.name}`}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${bgClass}`}
                    >
                      <Label
                        className={`text-xs font-semibold w-32 shrink-0 ${colorClass}`}
                      >
                        {s.name}
                      </Label>
                      <div className="flex items-center gap-1.5 flex-1">
                        <Input
                          type="number"
                          min={0}
                          max={24}
                          step={0.5}
                          value={todayHours[s.name] ?? "0"}
                          onChange={(e) =>
                            handleTodayHoursChange(s.name, e.target.value)
                          }
                          className="bg-background/50 border-input focus:border-primary/50 font-mono h-7 text-sm w-20"
                        />
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          hrs
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total hours summary */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-muted-foreground">
                  Total today
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {Object.values(todayHours)
                    .reduce((acc, v) => acc + (Number(v) || 0), 0)
                    .toFixed(1)}{" "}
                  / <span className="text-primary">{dailyHours}h target</span>
                </span>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Today's Questions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">
                  Questions Solved
                </p>
                <div className="h-4 flex items-center">
                  {questionsSaveStatus === "saving" && (
                    <span className="flex items-center gap-1 text-muted-foreground text-[10px]">
                      <span className="animate-spin h-2.5 w-2.5 border border-current border-t-transparent rounded-full" />
                      Saving…
                    </span>
                  )}
                  {questionsSaveStatus === "saved" && (
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                      <CheckCircle2 size={10} />
                      Saved
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {subjectTargets.map((s) => {
                  const colorClass =
                    SUBJECT_COLORS[s.name] ?? "text-foreground";
                  const bgClass = SUBJECT_BG[s.name] ?? "bg-muted/20";
                  const subjectMax = Number(s.target);
                  return (
                    <div
                      key={`qs-${s.name}`}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${bgClass}`}
                    >
                      <Label
                        className={`text-xs font-semibold w-32 shrink-0 ${colorClass}`}
                      >
                        {s.name}
                      </Label>
                      <div className="flex items-center gap-1.5 flex-1">
                        <Input
                          type="number"
                          min={0}
                          max={subjectMax}
                          value={todayQuestions[s.name] ?? "0"}
                          onChange={(e) =>
                            handleTodayQuestionsChange(s.name, e.target.value)
                          }
                          className="bg-background/50 border-input focus:border-primary/50 font-mono h-7 text-sm w-24"
                        />
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          / {subjectMax.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total questions summary */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-muted-foreground">
                  Total solved
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {Object.values(todayQuestions)
                    .reduce((acc, v) => acc + (Number(v) || 0), 0)
                    .toLocaleString()}{" "}
                  /{" "}
                  <span className="text-primary">
                    {totalGoal.toLocaleString()} goal
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
