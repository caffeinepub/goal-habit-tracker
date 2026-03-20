import { Toaster } from "@/components/ui/sonner";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// ── Pomodoro state persistence ──────────────────────────────────────────────
const POMO_STATE_KEY = "ssc_pomodoro_state";
interface PomoPersistedState {
  running: boolean;
  timeLeft: number;
  startedAt: number | null;
  mode: string;
}
function loadPomodoroState(): PomoPersistedState | null {
  try {
    const s = localStorage.getItem(POMO_STATE_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}
import { toast } from "sonner";
import type { MockTestScore } from "./backend.d";

// ── Lazy-loaded tab components (code-split per tab) ────────────────────────
const AddSubjectTab = lazy(() => import("./components/AddSubjectTab"));
const AnalyticsTab = lazy(() => import("./components/AnalyticsTab"));
const AppearancePanel = lazy(() =>
  import("./components/AppearancePanel").then((m) => ({ default: m.default })),
);
const DailyRoutineTab = lazy(() => import("./components/DailyRoutineTab"));
const ExamTab = lazy(() => import("./components/ExamTab"));
const FilesTab = lazy(() => import("./components/FilesTab"));
const FloatingTimerWidget = lazy(
  () => import("./components/FloatingTimerWidget"),
);
const HomeTab = lazy(() => import("./components/HomeTab"));
const NotebookTab = lazy(() => import("./components/NotebookTab"));
const NotepadTab = lazy(() => import("./components/NotepadTab"));
const NotificationsPanel = lazy(
  () => import("./components/NotificationsPanel"),
);
const QuestionsTab = lazy(() => import("./components/QuestionsTab"));
const StudyPlanTab = lazy(() => import("./components/StudyPlanTab"));
const TableMakerTab = lazy(() => import("./components/TableMakerTab"));
const TimerTab = lazy(() => import("./components/TimerTab"));

import {
  type AppearanceSettings,
  THEMES,
  applyCustomTheme,
} from "./components/AppearancePanel";
// ── Eagerly-loaded (small, always visible) ─────────────────────────────────
import LoginGate from "./components/LoginGate";
import Sidebar from "./components/Sidebar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetMockScores, useGetSubjects } from "./hooks/useQueries";

export type TabId =
  | "home"
  | "add"
  | "analytics"
  | "timer"
  | "studyplan"
  | "questions"
  | "exam"
  | "notebook"
  | "notepad"
  | "dailyroutine"
  | "tablemaker"
  | "files";

export type TimerMode = "work" | "short" | "long";

const TIMER_PRESETS: Record<
  TimerMode,
  { label: string; defaultSeconds: number }
> = {
  work: { label: "Focus", defaultSeconds: 1500 },
  short: { label: "Short Break", defaultSeconds: 300 },
  long: { label: "Long Break", defaultSeconds: 900 },
};

const SESSION_TIPS = [
  "Take a glass of water before starting",
  "Put your phone on Do Not Disturb",
  "Clear your desk before focusing",
  "Identify your single most important task",
  "Review your notes after the session",
];

const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: "dark",
  textColor: "#e8e0d0",
  font: "Satoshi",
  fontSize: 15,
  accentColor: "#c0392b",
  timeFormat: "12h",
  rainbowText: false,
};

function loadAppearance(): AppearanceSettings {
  try {
    const saved = localStorage.getItem("ssc_appearance_v2");
    if (saved) return { ...DEFAULT_APPEARANCE, ...JSON.parse(saved) };
  } catch {}
  // Migrate legacy keys
  return {
    theme:
      (localStorage.getItem("ssc_theme") as AppearanceSettings["theme"]) ??
      "dark",
    textColor: localStorage.getItem("ssc_text_color") ?? "#e8e0d0",
    font: localStorage.getItem("ssc_font") ?? "Satoshi",
    fontSize: 15,
    accentColor: "#c0392b",
    timeFormat: "12h" as const,
    rainbowText: false,
  };
}

// ── Tab loading fallback ───────────────────────────────────────────────────
function TabLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <span className="h-7 w-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// ── Tab error boundary ─────────────────────────────────────────────────────
import { Component, type ReactNode } from "react";
class TabErrorBoundary extends Component<
  { children: ReactNode; tabName: string },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: ReactNode; tabName: string }) {
    super(props);
    this.state = { hasError: false, error: "" };
  }
  static getDerivedStateFromError(err: Error) {
    return { hasError: true, error: err?.message ?? "Unknown error" };
  }
  override render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-md mx-auto mt-16 text-center">
          <div className="w-12 h-12 rounded-xl bg-destructive/15 flex items-center justify-center mx-auto mb-4">
            <span className="text-destructive text-2xl">!</span>
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            {this.props.tabName} failed to load
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {this.state.error}
          </p>
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => this.setState({ hasError: false, error: "" })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [search, setSearch] = useState("");

  // ─── Notifications panel ──────────────────────────────────────────────────
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  // ─── Appearance state (unified) ───────────────────────────────────────────
  const [appearancePanelOpen, setAppearancePanelOpen] = useState(false);
  const [appearance, setAppearance] =
    useState<AppearanceSettings>(loadAppearance);

  const handleAppearanceChange = useCallback(
    (updated: Partial<AppearanceSettings>) => {
      setAppearance((prev) => {
        const next = { ...prev, ...updated };
        localStorage.setItem("ssc_appearance_v2", JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  // Apply theme class to <html>
  useEffect(() => {
    const html = document.documentElement;
    // Remove all theme classes
    for (const t of THEMES) html.classList.remove(t.cssClass);
    // Remove legacy "light" class
    html.classList.remove("light");
    // Add new theme class
    const themeDef = THEMES.find((t) => t.id === appearance.theme);
    if (themeDef) {
      html.classList.add(themeDef.cssClass);
      // Keep "light" class for light theme for backward compat
      if (appearance.theme === "light") html.classList.add("light");
    }
  }, [appearance.theme]);

  // Apply text color
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--foreground-custom",
      appearance.textColor,
    );
  }, [appearance.textColor]);

  // Apply font family
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--app-font",
      `'${appearance.font}'`,
    );
  }, [appearance.font]);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--app-font-size",
      `${appearance.fontSize}px`,
    );
    document.documentElement.style.fontSize = `${appearance.fontSize}px`;
  }, [appearance.fontSize]);

  // Apply accent color override
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accent-color-override",
      appearance.accentColor,
    );
  }, [appearance.accentColor]);

  // Apply rainbow text class
  useEffect(() => {
    if (appearance.rainbowText) {
      document.documentElement.classList.add("rainbow-text");
    } else {
      document.documentElement.classList.remove("rainbow-text");
    }
  }, [appearance.rainbowText]);

  // Re-apply custom theme on page load if it was previously applied
  useEffect(() => {
    const saved = localStorage.getItem("ssc_custom_theme");
    if (saved) {
      try {
        const ct = JSON.parse(saved);
        const wasApplied = localStorage.getItem("ssc_custom_theme_applied");
        if (wasApplied === "1") {
          applyCustomTheme(ct);
        }
      } catch {
        // ignore malformed data
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Timer state (lifted to App for floating widget) ──────────────────────
  const [timerMode, setTimerMode] = useState<TimerMode>(() => {
    const p = loadPomodoroState();
    return (p?.mode as TimerMode) ?? "work";
  });
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const p = loadPomodoroState();
    if (p?.running && p.startedAt !== null) {
      const elapsed = Math.floor((Date.now() - p.startedAt) / 1000);
      return Math.max(0, p.timeLeft - elapsed);
    }
    return p?.timeLeft ?? 1500;
  });
  const [timerRunning, setTimerRunning] = useState<boolean>(() => {
    const p = loadPomodoroState();
    if (p?.running && p.startedAt !== null) {
      const elapsed = Math.floor((Date.now() - p.startedAt) / 1000);
      return Math.max(0, p.timeLeft - elapsed) > 0;
    }
    return false;
  });
  const [timerSessions, setTimerSessions] = useState(0);
  const [customDefaultSeconds, setCustomDefaultSeconds] = useState<number>(
    () => {
      const saved = localStorage.getItem("ssc_timer_default");
      return saved ? Number(saved) : 1500;
    },
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Timestamp-based refs to prevent drift
  const timerStartedAtRef = useRef<number | null>(null);
  const timerBaseLeftRef = useRef<number>(timeLeft);
  // Stable ref to latest timeLeft so interval effect doesn't need it as dep
  const timeLeftRef = useRef<number>(timeLeft);
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // ─── Section timer sync state ────────────────────────────────────────────
  const [activeSectionTimer, setActiveSectionTimer] = useState<{
    label: string;
    secs: number;
    running: boolean;
  } | null>(null);

  const handleSectionTimerStart = useCallback((label: string, secs: number) => {
    setActiveSectionTimer({ label, secs, running: true });
    // One-way: start Pomodoro if it's not running and mode is "work"
    setTimerRunning((current) => {
      if (!current) return true;
      return current;
    });
  }, []);

  const handleSectionTimerPause = useCallback(() => {
    setActiveSectionTimer((prev) =>
      prev ? { ...prev, running: false } : null,
    );
    // One-way: pause Pomodoro
    setTimerRunning(false);
  }, []);

  const handleSectionTimerUpdate = useCallback(
    (label: string, secs: number, running: boolean) => {
      setActiveSectionTimer({ label, secs, running });
    },
    [],
  );

  // One-way sync: when a section timer starts, set Pomodoro to matching duration and auto-start
  const handleSyncPomodoro = useCallback((durationSecs: number) => {
    setTimerMode("work");
    setCustomDefaultSeconds(durationSecs);
    setTimeLeft(durationSecs);
    setTimerRunning((current) => {
      if (!current) return true;
      return current;
    });
  }, []);

  // ─── Backend data ──────────────────────────────────────────────────────────
  const { data: subjects = [], isLoading: subjectsLoading } = useGetSubjects();
  const { data: mockScoresRaw = [], isLoading: scoresLoading } =
    useGetMockScores();

  // Derive a MockTestScore[] typed variable
  const mockScores: MockTestScore[] = mockScoresRaw as MockTestScore[];

  // ─── Derived values ────────────────────────────────────────────────────────
  const overallCompletion =
    subjects.length === 0
      ? 0
      : Math.round(
          subjects.reduce((acc, s) => {
            const completed = s.days.filter(Boolean).length;
            return acc + Math.round((completed / 30) * 100);
          }, 0) / subjects.length,
        );

  const predictedScore =
    mockScores.length === 0
      ? 0
      : Math.round(
          mockScores.reduce((acc, s) => acc + Number(s.score), 0) /
            mockScores.length +
            overallCompletion / 10,
        );

  const weakSubjects = subjects.filter((s) => s.isWeak);
  const timetable =
    weakSubjects.length > 0
      ? `Focus Today: ${weakSubjects.map((s) => s.name).join(", ")}`
      : "Balanced Revision Day";

  // ─── Timer interval (timestamp-based, no drift) ────────────────────────────
  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional -- timeLeft read via ref
  useEffect(() => {
    if (timerRunning) {
      // Record the start timestamp and base remaining time (from ref to avoid stale closure)
      timerStartedAtRef.current = Date.now();
      timerBaseLeftRef.current = timeLeftRef.current;

      intervalRef.current = setInterval(() => {
        if (timerStartedAtRef.current === null) return;
        const elapsed = Math.floor(
          (Date.now() - timerStartedAtRef.current) / 1000,
        );
        const newTimeLeft = Math.max(0, timerBaseLeftRef.current - elapsed);
        setTimeLeft(newTimeLeft);

        // Persist state on every tick so we can recover after tab sleep
        localStorage.setItem(
          POMO_STATE_KEY,
          JSON.stringify({
            running: true,
            timeLeft: timerBaseLeftRef.current,
            startedAt: timerStartedAtRef.current,
            mode: timerMode,
          } satisfies PomoPersistedState),
        );

        if (newTimeLeft <= 0) {
          clearTimerInterval();
          setTimerRunning(false);
          setTimerSessions((s) => s + 1);
          toast.success(
            timerMode === "work"
              ? "Focus session complete! Take a break."
              : "Break over! Time to focus.",
          );
          localStorage.setItem(
            POMO_STATE_KEY,
            JSON.stringify({
              running: false,
              timeLeft: 0,
              startedAt: null,
              mode: timerMode,
            } satisfies PomoPersistedState),
          );
        }
      }, 200); // 200ms for responsiveness, wall-clock based — no drift
    } else {
      // Capture the accurate remaining time on pause
      timerBaseLeftRef.current = timeLeftRef.current;
      timerStartedAtRef.current = null;
      clearTimerInterval();
      // Persist paused state
      localStorage.setItem(
        POMO_STATE_KEY,
        JSON.stringify({
          running: false,
          timeLeft: timeLeftRef.current,
          startedAt: null,
          mode: timerMode,
        } satisfies PomoPersistedState),
      );
    }
    return clearTimerInterval;
  }, [timerRunning, clearTimerInterval, timerMode]);

  // ─── Browser tab title update ──────────────────────────────────────────────
  useEffect(() => {
    if (timerRunning) {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      document.title = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} – SSC Tracker`;
    } else {
      document.title = "SSC CGL Tracker";
    }
    return () => {
      document.title = "SSC CGL Tracker";
    };
  }, [timerRunning, timeLeft]);

  // ─── Save custom default to localStorage ──────────────────────────────────
  useEffect(() => {
    localStorage.setItem("ssc_timer_default", String(customDefaultSeconds));
  }, [customDefaultSeconds]);

  // ─── Timer handlers ────────────────────────────────────────────────────────
  const handleTimerModeChange = useCallback(
    (newMode: TimerMode) => {
      setTimerRunning(false);
      timerStartedAtRef.current = null;
      setTimerMode(newMode);
      const newSecs =
        newMode === "work"
          ? customDefaultSeconds
          : TIMER_PRESETS[newMode].defaultSeconds;
      setTimeLeft(newSecs);
      timerBaseLeftRef.current = newSecs;
    },
    [customDefaultSeconds],
  );

  const handleTimerToggle = useCallback(() => {
    setTimerRunning((r) => !r);
  }, []);

  const handleTimerReset = useCallback(() => {
    setTimerRunning(false);
    timerStartedAtRef.current = null;
    const newSecs =
      timerMode === "work"
        ? customDefaultSeconds
        : TIMER_PRESETS[timerMode].defaultSeconds;
    setTimeLeft(newSecs);
    timerBaseLeftRef.current = newSecs;
  }, [timerMode, customDefaultSeconds]);

  const handleSetDefault = useCallback(
    (seconds: number) => {
      setCustomDefaultSeconds(seconds);
      if (timerMode === "work" && !timerRunning) {
        setTimeLeft(seconds);
        timerBaseLeftRef.current = seconds;
      }
    },
    [timerMode, timerRunning],
  );

  const tipIndex = timerSessions % SESSION_TIPS.length;

  // Show login gate if not authenticated
  if (isInitializing || !identity) {
    return (
      <>
        <LoginGate />
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "oklch(0.13 0.01 20)",
              border: "1px solid oklch(0.25 0.015 20)",
              color: "oklch(0.93 0.01 60)",
            },
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        overallCompletion={overallCompletion}
        search={search}
        onSearchChange={setSearch}
        onOpenAppearance={() => setAppearancePanelOpen((v) => !v)}
        onOpenNotifications={() => setNotificationsPanelOpen((v) => !v)}
      />

      {/* Appearance Panel */}
      {appearancePanelOpen && (
        <Suspense fallback={null}>
          <AppearancePanel
            settings={appearance}
            onChange={handleAppearanceChange}
            onClose={() => setAppearancePanelOpen(false)}
          />
        </Suspense>
      )}

      {/* Notifications Panel */}
      {notificationsPanelOpen && (
        <Suspense fallback={null}>
          <NotificationsPanel
            onClose={() => setNotificationsPanelOpen(false)}
          />
        </Suspense>
      )}

      <main className="flex-1 overflow-y-auto min-h-screen">
        <Suspense fallback={<TabLoader />}>
          {activeTab === "home" && (
            <TabErrorBoundary tabName="Home">
              <HomeTab
                subjects={subjects}
                search={search}
                isLoading={subjectsLoading}
                overallCompletion={overallCompletion}
                predictedScore={predictedScore}
                timetable={timetable}
              />
            </TabErrorBoundary>
          )}
          {activeTab === "add" && (
            <TabErrorBoundary tabName="Add Subject">
              <AddSubjectTab />
            </TabErrorBoundary>
          )}
          {activeTab === "analytics" && (
            <TabErrorBoundary tabName="Analytics">
              <AnalyticsTab
                mockScores={mockScores.map((s) => s.score)}
                isLoading={scoresLoading}
                overallCompletion={overallCompletion}
                predictedScore={predictedScore}
              />
            </TabErrorBoundary>
          )}
          {activeTab === "timer" && (
            <TabErrorBoundary tabName="Pomodoro">
              <TimerTab
                mode={timerMode}
                timeLeft={timeLeft}
                running={timerRunning}
                sessions={timerSessions}
                customDefaultSeconds={customDefaultSeconds}
                tipIndex={tipIndex}
                onModeChange={handleTimerModeChange}
                onToggleRunning={handleTimerToggle}
                onReset={handleTimerReset}
                onSetDefault={handleSetDefault}
              />
            </TabErrorBoundary>
          )}
          {activeTab === "studyplan" && (
            <TabErrorBoundary tabName="Study Plan">
              <StudyPlanTab
                onSectionTimerStart={handleSectionTimerStart}
                onSectionTimerPause={handleSectionTimerPause}
                onSectionTimerUpdate={handleSectionTimerUpdate}
                onSyncPomodoro={handleSyncPomodoro}
              />
            </TabErrorBoundary>
          )}
          {activeTab === "questions" && (
            <TabErrorBoundary tabName="Questions">
              <QuestionsTab
                onSectionTimerStart={handleSectionTimerStart}
                onSectionTimerPause={handleSectionTimerPause}
                onSectionTimerUpdate={handleSectionTimerUpdate}
                onSyncPomodoro={handleSyncPomodoro}
              />
            </TabErrorBoundary>
          )}
          {activeTab === "exam" && (
            <TabErrorBoundary tabName="Exam Mode">
              <ExamTab />
            </TabErrorBoundary>
          )}
          {activeTab === "notebook" && (
            <TabErrorBoundary tabName="Notebook">
              <NotebookTab />
            </TabErrorBoundary>
          )}
          {activeTab === "notepad" && (
            <TabErrorBoundary tabName="Notepad">
              <NotepadTab />
            </TabErrorBoundary>
          )}
          {activeTab === "dailyroutine" && (
            <TabErrorBoundary tabName="Daily Routine">
              <DailyRoutineTab timeFormat={appearance.timeFormat ?? "12h"} />
            </TabErrorBoundary>
          )}
          {activeTab === "tablemaker" && (
            <TabErrorBoundary tabName="Table Maker">
              <TableMakerTab />
            </TabErrorBoundary>
          )}
          {activeTab === "files" && (
            <TabErrorBoundary tabName="Files">
              <FilesTab />
            </TabErrorBoundary>
          )}
        </Suspense>
      </main>

      {/* Floating Timer Widget */}
      <Suspense fallback={null}>
        <FloatingTimerWidget
          mode={timerMode}
          timeLeft={timeLeft}
          running={timerRunning}
          activeTab={activeTab}
          onToggleRunning={handleTimerToggle}
          onGoToTimer={() => setActiveTab("timer")}
          sectionTimerLabel={activeSectionTimer?.label}
          sectionTimerSecs={activeSectionTimer?.secs}
          sectionTimerRunning={activeSectionTimer?.running}
        />
      </Suspense>

      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.13 0.01 20)",
            border: "1px solid oklch(0.25 0.015 20)",
            color: "oklch(0.93 0.01 60)",
          },
        }}
      />
    </div>
  );
}
