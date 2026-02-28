import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AddSubjectTab from "./components/AddSubjectTab";
import AnalyticsTab from "./components/AnalyticsTab";
import HomeTab from "./components/HomeTab";
import Sidebar from "./components/Sidebar";
import TimerTab from "./components/TimerTab";
import { useGetMockScores, useGetSubjects } from "./hooks/useQueries";

export type TabId = "home" | "add" | "analytics" | "timer";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [search, setSearch] = useState("");

  const { data: subjects = [], isLoading: subjectsLoading } = useGetSubjects();
  const { data: mockScores = [], isLoading: scoresLoading } =
    useGetMockScores();

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

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        overallCompletion={overallCompletion}
        search={search}
        onSearchChange={setSearch}
      />

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
        {activeTab === "timer" && <TimerTab />}
      </main>

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
