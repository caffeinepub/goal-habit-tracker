import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Clock,
  Download,
  FolderOpen,
  GraduationCap,
  Home,
  LogOut,
  NotebookPen,
  Palette,
  PlusCircle,
  Search,
  StickyNote,
  Table,
  Timer,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { TabId } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import DataPortal from "./DataPortal";

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  overallCompletion: number;
  search: string;
  onSearchChange: (val: string) => void;
  onOpenAppearance: () => void;
  onOpenNotifications: () => void;
}

function computeNotificationCount(): number {
  let count = 0;
  try {
    // Daily routine check
    const today = new Date().toISOString().split("T")[0];
    const routineKey = `ssc_routine_day_${today}`;
    const doneKey = `ssc_routine_done_${today}`;
    const rows = JSON.parse(localStorage.getItem(routineKey) ?? "[]") as {
      id: number;
    }[];
    const done = new Set(
      JSON.parse(localStorage.getItem(doneKey) ?? "[]") as number[],
    );
    const incomplete = rows.filter((r) => !done.has(r.id)).length;
    if (rows.length > 0 && incomplete > 0) count++;

    // Study plan check
    const sessions = JSON.parse(
      localStorage.getItem("ssc_study_sessions") ?? "[]",
    ) as { date: string; hours: number }[];
    const todayHours = sessions
      .filter((s) => s.date === today)
      .reduce((a, b) => a + b.hours, 0);
    const targets = JSON.parse(localStorage.getItem("ssc_targets") ?? "{}") as {
      dailyStudyHoursTarget?: number;
    };
    const target = targets?.dailyStudyHoursTarget ?? 15;
    if (todayHours < target) count++;

    // Questions check
    const qProgress = JSON.parse(
      localStorage.getItem("ssc_question_progress") ?? "[]",
    ) as { subjectName: string; count: number }[];
    const totalQ = qProgress.reduce((a, b) => a + Number(b.count), 0);
    const qTargets = JSON.parse(
      localStorage.getItem("ssc_targets") ?? "{}",
    ) as { totalQuestionsGoal?: number };
    const qGoal = qTargets?.totalQuestionsGoal ?? 9000;
    if (totalQ < qGoal) count++;
  } catch {}
  return count;
}

const navItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", icon: <Home size={18} /> },
  { id: "add", label: "Add Subject", icon: <PlusCircle size={18} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { id: "timer", label: "Pomodoro", icon: <Timer size={18} /> },
  { id: "studyplan", label: "Study Plan", icon: <Clock size={18} /> },
  { id: "questions", label: "Questions", icon: <BookOpen size={18} /> },
  { id: "exam", label: "Exam Mode", icon: <GraduationCap size={18} /> },
  { id: "notebook", label: "Notebook", icon: <NotebookPen size={18} /> },
  { id: "notepad", label: "Notepad", icon: <StickyNote size={18} /> },
  {
    id: "dailyroutine",
    label: "Daily Routine",
    icon: <CalendarDays size={18} />,
  },
  { id: "tablemaker", label: "Table Maker", icon: <Table size={18} /> },
  { id: "files", label: "My Files", icon: <FolderOpen size={18} /> },
];

function truncatePrincipal(principal: string): string {
  if (principal.length <= 12) return principal;
  return `${principal.slice(0, 6)}...${principal.slice(-4)}`;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  overallCompletion,
  search,
  onSearchChange,
  onOpenAppearance,
  onOpenNotifications,
}: SidebarProps) {
  const { identity, clear } = useInternetIdentity();
  const principalStr = identity?.getPrincipal().toString() ?? "";
  const [notifCount, setNotifCount] = useState(0);

  // PWA install prompt
  // biome-ignore lint/suspicious/noExplicitAny: BeforeInstallPromptEvent is non-standard
  const installPromptRef = useRef<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }
    const handler = (e: Event) => {
      e.preventDefault();
      installPromptRef.current = e;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setCanInstall(false);
    });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPromptRef.current) return;
    installPromptRef.current.prompt();
    const { outcome } = await installPromptRef.current.userChoice;
    if (outcome === "accepted") {
      setCanInstall(false);
      installPromptRef.current = null;
    }
  };

  useEffect(() => {
    setNotifCount(computeNotificationCount());
    const interval = setInterval(
      () => setNotifCount(computeNotificationCount()),
      30000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-64 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <GraduationCap size={16} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-primary leading-none tracking-tight">
              SSC CGL
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ultimate Tracker
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-xs bg-muted/50 border-sidebar-border focus:border-primary/50"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
                transition-colors duration-150 cursor-pointer
                ${isActive ? "nav-item-active text-foreground" : "nav-item text-muted-foreground hover:text-foreground hover:bg-accent/50"}
              `}
            >
              <span className={isActive ? "text-primary" : ""}>
                {item.icon}
              </span>
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom: Overall Progress + Account */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="mb-2 flex justify-between items-center">
          <p className="text-xs text-muted-foreground font-medium">
            Overall Progress
          </p>
          <span className="text-xs font-mono text-primary font-semibold">
            {overallCompletion}%
          </span>
        </div>
        <Progress value={overallCompletion} className="h-1.5 bg-muted" />

        {/* User principal */}
        {principalStr && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/30">
            <User size={11} className="text-muted-foreground shrink-0" />
            <span
              className="font-mono text-[10px] text-muted-foreground truncate"
              title={principalStr}
            >
              {truncatePrincipal(principalStr)}
            </span>
          </div>
        )}

        {/* Appearance + Notifications + Import/Export + Logout row */}
        <div className="flex gap-1.5 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenAppearance}
            className="flex-1 h-7 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 gap-1.5 justify-start min-w-0"
            title="Appearance Settings"
          >
            <Palette size={12} />
            <span className="truncate">Appearance</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onOpenNotifications();
              setNotifCount(computeNotificationCount());
            }}
            className="relative h-7 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="Notifications"
          >
            <Bell size={12} />
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-destructive text-[8px] text-white flex items-center justify-center font-bold leading-none">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </Button>
          <DataPortal />
          {canInstall && !isInstalled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleInstall}
              className="flex-1 h-7 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 gap-1.5 justify-start min-w-0"
              title="Install as App"
              data-ocid="sidebar.install.button"
            >
              <Download size={12} />
              <span className="truncate">Install App</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Log out"
          >
            <LogOut size={12} />
          </Button>
        </div>
      </div>
    </aside>
  );
}
