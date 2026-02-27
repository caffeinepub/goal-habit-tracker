import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Dashboard from "./components/Dashboard";
import GoalDetail from "./components/GoalDetail";
import { Toaster } from "@/components/ui/sonner";

type View =
  | { type: "dashboard" }
  | { type: "goal-detail"; goalId: bigint };

export default function App() {
  const [view, setView] = useState<View>({ type: "dashboard" });

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {view.type === "dashboard" && (
          <Dashboard
            key="dashboard"
            onViewGoal={(goalId) => setView({ type: "goal-detail", goalId })}
          />
        )}
        {view.type === "goal-detail" && (
          <GoalDetail
            key={`goal-${view.goalId}`}
            goalId={view.goalId}
            onBack={() => setView({ type: "dashboard" })}
          />
        )}
      </AnimatePresence>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.19 0.02 252)",
            border: "1px solid oklch(0.28 0.025 255)",
            color: "oklch(0.95 0.01 240)",
          },
        }}
      />
    </div>
  );
}
