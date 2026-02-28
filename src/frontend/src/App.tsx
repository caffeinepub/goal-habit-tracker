import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AddSubjectTab from "./components/AddSubjectTab";
import AnalyticsTab from "./components/AnalyticsTab";
import AppearancePanel, { type AppTheme } from "./components/AppearancePanel";
import ExamTab from "./components/ExamTab";
import FloatingTimerWidget from "./components/FloatingTimerWidget";
import HomeTab from "./components/HomeTab";
import LoginGate from "./components/LoginGate";
import NotebookTab from "./components/NotebookTab";
import NotepadTab from "./components/NotepadTab";
import QuestionsTab from "./components/QuestionsTab";
import Sidebar from "./components/Sidebar";
import StudyPlanTab from "./components/StudyPlanTab";
import TableMakerTab from "./components/TableMakerTab";
import TimerTab from "./components/TimerTab";
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
  | "tablemaker";

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

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [search, setSearch] = useState("");

  // ─── Appearance state ──────────────────────────────────────────────────────
  const [appearancePanelOpen, setAppearancePanelOpen] = useState(false);
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem("ssc_theme") as AppTheme) ?? "dark";
  });
  const [textColor, setTextColor] = useState<string>(() => {
    return localStorage.getItem("ssc_text_color") ?? "#e8e0d0";
  });
  const [appFont, setAppFont] = useState<string>(() => {
    return localStorage.getItem("ssc_font") ?? "Satoshi";
  });

  // Apply theme/font/color on mount and changes
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("ssc_theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--foreground-custom",
      textColor,
    );
    localStorage.setItem("ssc_text_color", textColor);
  }, [textColor]);

  useEffect(() => {
    document.documentElement.style.setProperty("--app-font", `'${appFont}'`);
    localStorage.setItem("ssc_font", appFont);
  }, [appFont]);

  // ─── Timer state (lifted to App for floating widget) ──────────────────────
  const [timerMode, setTimerMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(1500);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSessions, setTimerSessions] = useState(0);
  const [customDefaultSeconds, setCustomDefaultSeconds] = useState<number>(
    () => {
      const saved = localStorage.getItem("ssc_timer_default");
      return saved ? Number(saved) : 1500;
    },
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Backend data ──────────────────────────────────────────────────────────
  const { data: subjects = [], isLoading: subjectsLoading } = useGetSubjects();
  const { data: mockScores = [], isLoading: scoresLoading } =
    useGetMockScores();

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
          mockScores.reduce((acc, s) => acc + Number(s), 0) /
            mockScores.length +
            overallCompletion / 10,
        );

  const weakSubjects = subjects.filter((s) => s.isWeak);
  const timetable =
    weakSubjects.length > 0
      ? `Focus Today: ${weakSubjects.map((s) => s.name).join(", ")}`
      : "Balanced Revision Day";

  // ─── Timer interval ────────────────────────────────────────────────────────
  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearTimerInterval();
            setTimerRunning(false);
            setTimerSessions((s) => s + 1);
            toast.success(
              timerMode === "work"
                ? "Focus session complete! Take a break."
                : "Break over! Time to focus.",
            );
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearTimerInterval();
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
      setTimerMode(newMode);
      if (newMode === "work") {
        setTimeLeft(customDefaultSeconds);
      } else {
        setTimeLeft(TIMER_PRESETS[newMode].defaultSeconds);
      }
    },
    [customDefaultSeconds],
  );

  const handleTimerToggle = useCallback(() => {
    setTimerRunning((r) => !r);
  }, []);

  const handleTimerReset = useCallback(() => {
    setTimerRunning(false);
    if (timerMode === "work") {
      setTimeLeft(customDefaultSeconds);
    } else {
      setTimeLeft(TIMER_PRESETS[timerMode].defaultSeconds);
    }
  }, [timerMode, customDefaultSeconds]);

  const handleSetDefault = useCallback(
    (seconds: number) => {
      setCustomDefaultSeconds(seconds);
      if (timerMode === "work" && !timerRunning) {
        setTimeLeft(seconds);
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
      />

      {/* Appearance Panel */}
      {appearancePanelOpen && (
        <AppearancePanel
          theme={theme}
          textColor={textColor}
          font={appFont}
          onThemeChange={setTheme}
          onTextColorChange={setTextColor}
          onFontChange={setAppFont}
          onClose={() => setAppearancePanelOpen(false)}
        />
      )}

      <main className="flex-1 overflow-y-auto min-h-screen">
        {activeTab === "home" && (
          <HomeTab
            subjects={subjects}
            search={search}
            isLoading={subjectsLoading}
            overallCompletion={overallCompletion}
            predictedScore={predictedScore}
            timetable={timetable}
          />
        )}
        {activeTab === "add" && <AddSubjectTab />}
        {activeTab === "analytics" && (
          <AnalyticsTab
            mockScores={mockScores}
            isLoading={scoresLoading}
            overallCompletion={overallCompletion}
            predictedScore={predictedScore}
          />
        )}
        {activeTab === "timer" && (
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
        )}
        {activeTab === "studyplan" && <StudyPlanTab />}
        {activeTab === "questions" && <QuestionsTab />}
        {activeTab === "exam" && <ExamTab />}
        {activeTab === "notebook" && <NotebookTab />}
        {activeTab === "notepad" && <NotepadTab />}
        {activeTab === "tablemaker" && <TableMakerTab />}
      </main>

      {/* Floating Timer Widget */}
      <FloatingTimerWidget
        mode={timerMode}
        timeLeft={timeLeft}
        running={timerRunning}
        activeTab={activeTab}
        onToggleRunning={handleTimerToggle}
        onGoToTimer={() => setActiveTab("timer")}
      />

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
