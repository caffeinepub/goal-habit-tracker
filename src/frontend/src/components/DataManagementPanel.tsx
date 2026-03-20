import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DatabaseBackup, Eraser, Trash2, TriangleAlert, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DataManagementPanelProps {
  open: boolean;
  onClose: () => void;
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

interface StudySession {
  date: string;
  subject: string;
  hours: number;
  id?: string;
}

function getTodaySessions(): StudySession[] {
  try {
    const raw = localStorage.getItem("ssc_study_sessions");
    if (!raw) return [];
    const all: StudySession[] = JSON.parse(raw);
    const today = getToday();
    return all.filter((s) => s.date === today);
  } catch {
    return [];
  }
}

function getTodayQCounts(): Record<string, number> {
  try {
    const today = getToday();
    const raw = localStorage.getItem(`ssc_qcounts_${today}`);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default function DataManagementPanel({
  open,
  onClose,
}: DataManagementPanelProps) {
  const today = getToday();
  const [resetInput, setResetInput] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  // Section A handlers
  function clearStudySessions() {
    try {
      const raw = localStorage.getItem("ssc_study_sessions");
      const all: StudySession[] = raw ? JSON.parse(raw) : [];
      const filtered = all.filter((s) => s.date !== today);
      localStorage.setItem("ssc_study_sessions", JSON.stringify(filtered));
      toast.success("Today's study sessions cleared");
      refresh();
    } catch {
      toast.error("Failed to clear");
    }
  }

  function clearTodayQuestions() {
    localStorage.removeItem(`ssc_qcounts_${today}`);
    toast.success("Today's questions cleared");
    refresh();
  }

  function clearRoutineStatus() {
    localStorage.removeItem(`ssc_routine_done_${today}`);
    toast.success("Today's routine status cleared");
    refresh();
  }

  function clearPomodoroFocus() {
    try {
      const raw = localStorage.getItem("ssc_focus_log");
      if (raw) {
        const log: Array<{ date: string; minutes: number }> = JSON.parse(raw);
        const filtered = log.filter((e) => e.date !== today);
        localStorage.setItem("ssc_focus_log", JSON.stringify(filtered));
      }
      toast.success("Today's Pomodoro focus cleared");
      refresh();
    } catch {
      toast.error("Failed to clear");
    }
  }

  // Section B handlers
  function deleteStudySession(sessionId: string | number) {
    try {
      const raw = localStorage.getItem("ssc_study_sessions");
      const all: StudySession[] = raw ? JSON.parse(raw) : [];
      const filtered = all.filter((_, i) => {
        if (typeof sessionId === "number") return i !== sessionId;
        return true;
      });
      localStorage.setItem("ssc_study_sessions", JSON.stringify(filtered));
      toast.success("Session deleted");
      refresh();
    } catch {
      toast.error("Failed to delete");
    }
  }

  function deleteQuestionSubject(subject: string) {
    try {
      const raw = localStorage.getItem(`ssc_qcounts_${today}`);
      const counts: Record<string, number> = raw ? JSON.parse(raw) : {};
      counts[subject] = 0;
      localStorage.setItem(`ssc_qcounts_${today}`, JSON.stringify(counts));
      toast.success(`${subject} questions reset to 0`);
      refresh();
    } catch {
      toast.error("Failed to reset");
    }
  }

  // Section C handler
  function resetAllData() {
    if (resetInput !== "RESET") return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("ssc_")) {
        keysToRemove.push(key);
      }
    }
    for (const k of keysToRemove) {
      localStorage.removeItem(k);
    }
    toast.success("All data has been reset");
    setTimeout(() => window.location.reload(), 800);
  }

  // Re-read on each render (controlled by refreshKey)
  void refreshKey;
  const sessions = getTodaySessions();
  const qCounts = getTodayQCounts();

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-[380px] sm:w-[420px] p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 font-display text-lg">
            <DatabaseBackup size={18} className="text-primary" />
            Manage Data
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Clear today's data, remove specific entries, or reset everything.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {/* ── Section A: Clear Today's Data ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eraser size={15} className="text-amber-500" />
                <h3 className="font-semibold text-sm text-foreground">
                  Clear Today's Data
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  {
                    label: "Study Sessions",
                    action: clearStudySessions,
                    desc: "Removes all study hour logs for today",
                  },
                  {
                    label: "Questions Solved",
                    action: clearTodayQuestions,
                    desc: "Clears all question counts for today",
                  },
                  {
                    label: "Routine Status",
                    action: clearRoutineStatus,
                    desc: "Resets all task checkboxes for today",
                  },
                  {
                    label: "Pomodoro Focus",
                    action: clearPomodoroFocus,
                    desc: "Removes today's focus time log",
                  },
                ].map(({ label, action, desc }) => (
                  <AlertDialog key={label}>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-border hover:border-amber-500/40 hover:bg-amber-500/5 transition-colors group text-left"
                        data-ocid="data.clear.button"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-amber-500 transition-colors">
                            {label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {desc}
                          </p>
                        </div>
                        <Eraser
                          size={14}
                          className="text-muted-foreground group-hover:text-amber-500 transition-colors shrink-0 ml-2"
                        />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear {label}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove today's {label.toLowerCase()} data.
                          This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="data.clear.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={action}
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                          data-ocid="data.clear.confirm_button"
                        >
                          Clear
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ))}
              </div>
            </div>

            <Separator />

            {/* ── Section B: Delete Specific Entries ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trash2 size={15} className="text-red-500" />
                <h3 className="font-semibold text-sm text-foreground">
                  Delete Specific Entries
                </h3>
              </div>

              {/* Study sessions today */}
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Study Sessions Today
                </p>
                {sessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic px-1">
                    No study sessions logged today
                  </p>
                ) : (
                  <div className="space-y-1" data-ocid="data.sessions.list">
                    {sessions.map((s, i) => (
                      <div
                        key={`${s.subject}-${i}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border border-border"
                        data-ocid={`data.sessions.item.${i + 1}`}
                      >
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {s.subject}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {s.hours}h
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteStudySession(i)}
                          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete session"
                          data-ocid={`data.sessions.delete_button.${i + 1}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Questions today */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Questions Logged Today
                </p>
                {Object.keys(qCounts).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic px-1">
                    No questions logged today
                  </p>
                ) : (
                  <div className="space-y-1" data-ocid="data.questions.list">
                    {Object.entries(qCounts).map(([subject, count], i) => (
                      <div
                        key={subject}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border border-border"
                        data-ocid={`data.questions.item.${i + 1}`}
                      >
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {subject}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {count} questions
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteQuestionSubject(subject)}
                          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Reset to 0"
                          data-ocid={`data.questions.delete_button.${i + 1}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* ── Section C: Full Data Reset ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TriangleAlert size={15} className="text-destructive" />
                <h3 className="font-semibold text-sm text-destructive">
                  Full Data Reset
                </h3>
              </div>
              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 mb-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-destructive">Warning:</strong> This
                  will permanently delete <strong>ALL your data</strong>{" "}
                  including all study history, questions, routines, notes, and
                  settings. <strong>This cannot be undone.</strong>
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full gap-2"
                    data-ocid="data.reset.open_modal_button"
                  >
                    <TriangleAlert size={14} />
                    Reset All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent data-ocid="data.reset.dialog">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                      <TriangleAlert size={16} />
                      Reset All Data?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                      <span className="block">
                        This action will permanently delete{" "}
                        <strong>all your SSC CGL tracker data</strong>. You will
                        lose all study sessions, questions, routines, notes,
                        habits, exam history, and settings.
                      </span>
                      <span className="block font-medium text-foreground">
                        Type{" "}
                        <code className="bg-muted px-1.5 py-0.5 rounded text-destructive font-mono">
                          RESET
                        </code>{" "}
                        to confirm:
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input
                    value={resetInput}
                    onChange={(e) => setResetInput(e.target.value)}
                    placeholder="Type RESET to confirm"
                    className="font-mono"
                    data-ocid="data.reset.input"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setResetInput("")}
                      data-ocid="data.reset.cancel_button"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={resetAllData}
                      disabled={resetInput !== "RESET"}
                      className="bg-destructive hover:bg-destructive/90 disabled:opacity-40"
                      data-ocid="data.reset.confirm_button"
                    >
                      Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
