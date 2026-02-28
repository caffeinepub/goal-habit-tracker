import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  GraduationCap,
  Home,
  PlusCircle,
  Search,
  Timer,
} from "lucide-react";
import { motion } from "motion/react";
import type { TabId } from "../App";

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  overallCompletion: number;
  search: string;
  onSearchChange: (val: string) => void;
}

const navItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", icon: <Home size={18} /> },
  { id: "add", label: "Add Subject", icon: <PlusCircle size={18} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { id: "timer", label: "Pomodoro", icon: <Timer size={18} /> },
];

export default function Sidebar({
  activeTab,
  onTabChange,
  overallCompletion,
  search,
  onSearchChange,
}: SidebarProps) {
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

      {/* Bottom: Overall Progress */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-2 flex justify-between items-center">
          <p className="text-xs text-muted-foreground font-medium">
            Overall Progress
          </p>
          <span className="text-xs font-mono text-primary font-semibold">
            {overallCompletion}%
          </span>
        </div>
        <Progress value={overallCompletion} className="h-1.5 bg-muted" />
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          SSC CGL Ultimate Tracker
        </p>
      </div>
    </aside>
  );
}
