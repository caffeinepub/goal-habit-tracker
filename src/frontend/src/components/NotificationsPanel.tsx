import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  id: string;
  type: "routine" | "study" | "questions";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotifPrefs {
  routine: boolean;
  study: boolean;
  questions: boolean;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

const PREFS_KEY = "ssc_notif_prefs";
const DISMISSED_KEY = "ssc_notif_dismissed";

function loadPrefs(): NotifPrefs {
  try {
    const s = localStorage.getItem(PREFS_KEY);
    return s ? JSON.parse(s) : { routine: true, study: true, questions: true };
  } catch {
    return { routine: true, study: true, questions: true };
  }
}

function savePrefs(prefs: NotifPrefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function loadDismissed(): Set<string> {
  try {
    const s = localStorage.getItem(DISMISSED_KEY);
    return new Set(s ? JSON.parse(s) : []);
  } catch {
    return new Set();
  }
}

function saveDismissed(dismissed: Set<string>) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...dismissed]));
}

// ─── Notification generation ──────────────────────────────────────────────────

function generateNotifications(prefs: NotifPrefs): Notification[] {
  const notifs: Notification[] = [];
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (prefs.routine) {
    try {
      const routineKey = `ssc_routine_day_${today}`;
      const doneKey = `ssc_routine_done_${today}`;
      const rows = JSON.parse(localStorage.getItem(routineKey) ?? "[]") as {
        id: number;
      }[];
      const done = new Set(
        JSON.parse(localStorage.getItem(doneKey) ?? "[]") as number[],
      );
      const incomplete = rows.filter((r) => !done.has(r.id)).length;
      if (rows.length > 0 && incomplete > 0) {
        notifs.push({
          id: "routine-today",
          type: "routine",
          title: "Daily Routine",
          message: `You have ${incomplete} incomplete task${incomplete !== 1 ? "s" : ""} today (${done.size}/${rows.length} done)`,
          timestamp: now,
          read: false,
        });
      } else if (rows.length > 0 && incomplete === 0) {
        notifs.push({
          id: "routine-done",
          type: "routine",
          title: "Daily Routine ✓",
          message: `All ${rows.length} tasks completed for today! Great work!`,
          timestamp: now,
          read: false,
        });
      } else {
        notifs.push({
          id: "routine-empty",
          type: "routine",
          title: "Daily Routine",
          message:
            "No routine scheduled for today. Add tasks to stay on track.",
          timestamp: now,
          read: false,
        });
      }
    } catch {}
  }

  if (prefs.study) {
    try {
      const sessions = JSON.parse(
        localStorage.getItem("ssc_study_sessions") ?? "[]",
      ) as { date: string; hours: number }[];
      const todayHours = sessions
        .filter((s) => s.date === today)
        .reduce((a, b) => a + b.hours, 0);
      const targetsRaw = JSON.parse(
        localStorage.getItem("ssc_targets") ?? "{}",
      ) as { dailyStudyHoursTarget?: number };
      const target = targetsRaw?.dailyStudyHoursTarget ?? 15;
      const remaining = Math.max(target - todayHours, 0);

      if (todayHours >= target) {
        notifs.push({
          id: "study-done",
          type: "study",
          title: "Study Goal Achieved! 🎉",
          message: `You've studied ${todayHours.toFixed(1)}h today — daily goal of ${target}h met!`,
          timestamp: now,
          read: false,
        });
      } else {
        const h = Math.floor(remaining);
        const m = Math.round((remaining - h) * 60);
        notifs.push({
          id: "study-remaining",
          type: "study",
          title: "Study Plan",
          message: `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}m ` : ""}more study needed today to reach your ${target}h target (${todayHours.toFixed(1)}h done)`,
          timestamp: now,
          read: false,
        });
      }
    } catch {}
  }

  if (prefs.questions) {
    try {
      const qProgress = JSON.parse(
        localStorage.getItem("ssc_question_progress") ?? "[]",
      ) as { subjectName: string; count: number }[];
      const totalQ = qProgress.reduce((a, b) => a + Number(b.count), 0);
      const qTargetsRaw = JSON.parse(
        localStorage.getItem("ssc_targets") ?? "{}",
      ) as { totalQuestionsGoal?: number };
      const qGoal = qTargetsRaw?.totalQuestionsGoal ?? 9000;

      // Daily questions target
      const monthlyPlan = JSON.parse(
        localStorage.getItem("ssc_monthly_plan") ?? "{}",
      ) as Record<string, number>;
      const todayDayPlan =
        monthlyPlan[today] !== undefined ? monthlyPlan[today] : null;
      const qTargets = JSON.parse(
        localStorage.getItem("ssc_targets") ?? "{}",
      ) as { dailyQuestionsTarget?: number };
      const dailyQTarget = qTargets?.dailyQuestionsTarget ?? 300;
      const todayDone = todayDayPlan ?? 0;
      const qRemaining = Math.max(dailyQTarget - todayDone, 0);

      if (totalQ >= qGoal) {
        notifs.push({
          id: "questions-goal",
          type: "questions",
          title: "Questions Goal Achieved! 🏆",
          message: `You've completed all ${qGoal.toLocaleString()} questions! Outstanding!`,
          timestamp: now,
          read: false,
        });
      } else {
        notifs.push({
          id: "questions-remaining",
          type: "questions",
          title: "Question Tracker",
          message: `${(qGoal - totalQ).toLocaleString()} questions remaining (${totalQ.toLocaleString()}/${qGoal.toLocaleString()}). Daily target: ${dailyQTarget} | Today done: ${todayDone} | Remaining today: ${qRemaining}`,
          timestamp: now,
          read: false,
        });
      }
    } catch {}
  }

  return notifs;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface NotificationsPanelProps {
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationsPanel({
  onClose,
}: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [prefs, setPrefs] = useState<NotifPrefs>(loadPrefs);
  const [dismissed, setDismissed] = useState<Set<string>>(loadDismissed);
  const [showPrefs, setShowPrefs] = useState(false);

  const allNotifs = generateNotifications(prefs);
  const notifications = allNotifs.filter((n) => !dismissed.has(n.id));

  const handleDismiss = (id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveDismissed(next);
      return next;
    });
  };

  const handleClearAll = () => {
    const allIds = new Set(allNotifs.map((n) => n.id));
    setDismissed(allIds);
    saveDismissed(allIds);
  };

  const handlePrefChange = (key: keyof NotifPrefs, val: boolean) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: val };
      savePrefs(next);
      return next;
    });
  };

  // Restore dismissed notifications when prefs change
  const handleRestoreAll = () => {
    setDismissed(new Set());
    saveDismissed(new Set());
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const ICON_MAP = {
    routine: <CalendarDays size={14} className="text-primary" />,
    study: <Clock size={14} className="text-blue-400" />,
    questions: <BookOpen size={14} className="text-amber-400" />,
  };

  const BORDER_MAP = {
    routine: "border-primary/20 bg-primary/5",
    study: "border-blue-500/20 bg-blue-500/5",
    questions: "border-amber-500/20 bg-amber-500/5",
  };

  return (
    <div
      ref={panelRef}
      className="fixed z-50 w-80"
      style={{ left: "268px", bottom: "80px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-sm overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-primary" />
            <span className="text-sm font-bold text-foreground">
              Notifications
            </span>
            {notifications.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrefs((v) => !v)}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              title="Notification preferences"
            >
              <Settings size={13} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </Button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {/* Preferences section */}
          {showPrefs && (
            <div className="border-b border-border p-3 space-y-2 bg-muted/20">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-2">
                Enable Notifications
              </p>
              {(
                [
                  {
                    key: "routine",
                    label: "Daily Routine",
                    icon: <CalendarDays size={12} />,
                  },
                  {
                    key: "study",
                    label: "Study Plan",
                    icon: <Clock size={12} />,
                  },
                  {
                    key: "questions",
                    label: "Questions",
                    icon: <BookOpen size={12} />,
                  },
                ] as {
                  key: keyof NotifPrefs;
                  label: string;
                  icon: React.ReactNode;
                }[]
              ).map(({ key, label, icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <span className="text-muted-foreground">{icon}</span>
                    {label}
                  </div>
                  <Switch
                    checked={prefs[key]}
                    onCheckedChange={(v) => handlePrefChange(key, v)}
                  />
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRestoreAll}
                className="w-full text-xs h-7 text-muted-foreground hover:text-foreground mt-1"
              >
                Restore dismissed notifications
              </Button>
            </div>
          )}

          {/* Notifications list */}
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
              <CheckCircle2 size={32} className="opacity-30" />
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs text-center px-4">
                No active notifications. Keep up the great work!
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className={`rounded-xl border p-3 ${BORDER_MAP[notif.type]}`}
                >
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 mt-0.5">
                      {ICON_MAP[notif.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <p className="text-xs font-semibold text-foreground leading-none">
                          {notif.title}
                        </p>
                        <span className="text-[9px] text-muted-foreground shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDismiss(notif.id)}
                      className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Dismiss notification"
                    >
                      <X size={11} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Clear all */}
          {notifications.length > 0 && (
            <div className="px-3 pb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="w-full text-xs h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
              >
                <Trash2 size={11} />
                Clear All
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
