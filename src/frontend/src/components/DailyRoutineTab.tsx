import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Copy,
  Flame,
  Lock,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { formatTime } from "./AppearancePanel";

// ─── Types ─────────────────────────────────────────────────────────────────

type Priority = "High" | "Medium" | "Low";

interface RoutineRow {
  id: number;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  activity: string;
  subject: string;
  notes: string;
  priority: Priority;
}

// ─── Date utilities ─────────────────────────────────────────────────────────

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function todayKey(): string {
  const d = new Date();
  return toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
}

function compareKeys(a: string, b: string): number {
  return a.localeCompare(b);
}

// ─── localStorage helpers ────────────────────────────────────────────────────

function rowsKey(dateKey: string): string {
  return `ssc_routine_day_${dateKey}`;
}

function doneKey(dateKey: string): string {
  return `ssc_routine_done_${dateKey}`;
}

function loadRowsForDay(dateKey: string): RoutineRow[] {
  try {
    const saved = localStorage.getItem(rowsKey(dateKey));
    return saved ? (JSON.parse(saved) as RoutineRow[]) : [];
  } catch {
    return [];
  }
}

function saveRowsForDay(dateKey: string, rows: RoutineRow[]) {
  localStorage.setItem(rowsKey(dateKey), JSON.stringify(rows));
}

function loadDoneForDay(dateKey: string): Set<number> {
  try {
    const saved = localStorage.getItem(doneKey(dateKey));
    const arr = saved ? (JSON.parse(saved) as number[]) : [];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveDoneForDay(dateKey: string, done: Set<number>) {
  localStorage.setItem(doneKey(dateKey), JSON.stringify([...done]));
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function calcDuration(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const diff = eh * 60 + em - (sh * 60 + sm);
  return diff > 0 ? diff : 0;
}

function formatDuration(mins: number): string {
  if (mins <= 0) return "–";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function sortByTime(rows: RoutineRow[]): RoutineRow[] {
  return [...rows].sort((a, b) => a.startTime.localeCompare(b.startTime));
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Priority styling ───────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<
  Priority,
  { badge: string; dot: string; label: string }
> = {
  High: {
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
    dot: "bg-red-500",
    label: "High",
  },
  Medium: {
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
    label: "Medium",
  },
  Low: {
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
    label: "Low",
  },
};

// ─── Subject options ─────────────────────────────────────────────────────────

const SUBJECT_OPTIONS = [
  "Maths",
  "English",
  "Reasoning",
  "General Knowledge",
  "Current Affairs",
  "Computer",
  "Science",
  "Other (custom)",
] as const;

// ─── Empty form state ────────────────────────────────────────────────────────

function emptyForm(): Omit<RoutineRow, "id"> {
  return {
    startTime: "",
    endTime: "",
    activity: "",
    subject: "",
    notes: "",
    priority: "Medium",
  };
}

// ─── Day type ────────────────────────────────────────────────────────────────

type DayType = "today" | "past" | "future";

function getDayType(dateKey: string): DayType {
  const today = todayKey();
  const cmp = compareKeys(dateKey, today);
  if (cmp === 0) return "today";
  if (cmp < 0) return "past";
  return "future";
}

// ─── AM/PM Time Picker ───────────────────────────────────────────────────────

interface AmPmTimePickerProps {
  value: string; // "HH:MM" 24h
  onChange: (val: string) => void;
  label?: string;
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function AmPmTimePicker({ value, onChange, label }: AmPmTimePickerProps) {
  const [h, m, ampm] = useMemo(() => {
    if (!value) return [12, 0, "AM" as "AM" | "PM"];
    const [hh, mm] = value.split(":").map(Number);
    const isPM = hh >= 12;
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return [h12, mm, isPM ? "PM" : "AM"] as [number, number, "AM" | "PM"];
  }, [value]);

  const toValue = (hour12: number, min: number, ap: "AM" | "PM") => {
    let h24 = hour12 % 12;
    if (ap === "PM") h24 += 12;
    return `${String(h24).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <Label className="text-xs text-muted-foreground">
          {label} <span className="text-destructive">*</span>
        </Label>
      )}
      <div className="flex items-center gap-1.5">
        {/* Hour */}
        <Select
          value={String(h)}
          onValueChange={(v) => onChange(toValue(Number(v), m, ampm))}
        >
          <SelectTrigger className="h-9 w-16 text-sm bg-input border-border px-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border max-h-48">
            {HOURS_12.map((hr) => (
              <SelectItem key={hr} value={String(hr)} className="text-sm">
                {hr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-muted-foreground text-sm font-bold">:</span>

        {/* Minutes */}
        <Select
          value={String(m)}
          onValueChange={(v) => onChange(toValue(h, Number(v), ampm))}
        >
          <SelectTrigger className="h-9 w-16 text-sm bg-input border-border px-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border max-h-48">
            {MINUTES.map((min) => (
              <SelectItem key={min} value={String(min)} className="text-sm">
                {String(min).padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* AM/PM toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["AM", "PM"] as const).map((ap) => (
            <button
              key={ap}
              type="button"
              onClick={() => onChange(toValue(h, m, ap))}
              className={`px-2.5 py-1.5 text-xs font-semibold transition-all ${
                ampm === ap
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground bg-input"
              }`}
            >
              {ap}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 100 Day Progress Table constants ────────────────────────────────────────

const START_DATE_KEY = "ssc_routine_start_date";

function getStartDate(): string {
  return localStorage.getItem(START_DATE_KEY) ?? todayKey();
}

function setStartDate(key: string) {
  localStorage.setItem(START_DATE_KEY, key);
}

function addDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface DailyRoutineTabProps {
  timeFormat?: "12h" | "24h";
}

export default function DailyRoutineTab({
  timeFormat = "12h",
}: DailyRoutineTabProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState<string>(todayKey());

  const [rows, setRows] = useState<RoutineRow[]>(() =>
    loadRowsForDay(todayKey()),
  );
  const [doneIds, setDoneIds] = useState<Set<number>>(() =>
    loadDoneForDay(todayKey()),
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<RoutineRow, "id">>(emptyForm());
  // Track subject select vs custom
  const [subjectSelect, setSubjectSelect] = useState<string>("");
  const [customSubject, setCustomSubject] = useState<string>("");

  // ── Copy from date dialog ─────────────────────────────────────────────────
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [copyFromDate, setCopyFromDate] = useState("");

  // ── 100-day progress table ────────────────────────────────────────────────
  const [startDate, setStartDateState] = useState(getStartDate);

  // ── Session elapsed time tracking for Daily Routine ───────────────────────
  const sessionStartRef = useRef<number>(Date.now());
  const accIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Accumulate time every 10 seconds
    accIntervalRef.current = setInterval(() => {
      const todayKey = new Date().toISOString().split("T")[0];
      const k = `ssc_section_time_dailyroutine_${todayKey}`;
      const current = Number(localStorage.getItem(k) ?? 0);
      localStorage.setItem(k, String(current + 10));
    }, 10000);

    return () => {
      // On unmount, save remaining partial time
      if (accIntervalRef.current) clearInterval(accIntervalRef.current);
      const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      if (elapsed > 0) {
        const todayKey = new Date().toISOString().split("T")[0];
        const k = `ssc_section_time_dailyroutine_${todayKey}`;
        const current = Number(localStorage.getItem(k) ?? 0);
        localStorage.setItem(k, String(current + (elapsed % 10)));
      }
    };
  }, []);

  // ── Load data when selected day changes ──────────────────────────────────
  useEffect(() => {
    setRows(loadRowsForDay(selectedKey));
    setDoneIds(loadDoneForDay(selectedKey));
  }, [selectedKey]);

  // ── Persist rows on change ───────────────────────────────────────────────
  useEffect(() => {
    saveRowsForDay(selectedKey, rows);
  }, [rows, selectedKey]);

  // ── Persist done set on change ───────────────────────────────────────────
  useEffect(() => {
    saveDoneForDay(selectedKey, doneIds);
  }, [doneIds, selectedKey]);

  // ── Derived ──────────────────────────────────────────────────────────────
  const dayType = getDayType(selectedKey);
  const canEdit = dayType === "today" || dayType === "future";
  const sorted = useMemo(() => sortByTime(rows), [rows]);
  const doneCount = useMemo(
    () => sorted.filter((r) => doneIds.has(r.id)).length,
    [sorted, doneIds],
  );
  const totalDuration = useMemo(
    () =>
      sorted.reduce((acc, r) => acc + calcDuration(r.startTime, r.endTime), 0),
    [sorted],
  );
  const progressPct =
    rows.length > 0 ? Math.round((doneCount / rows.length) * 100) : 0;

  // ── Calendar meta ─────────────────────────────────────────────────────────
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = getFirstDayOfMonth(viewYear, viewMonth);

  // Build per-day badge counts from localStorage for this month
  // We read directly from localStorage so we capture all days (not just the selected day's state).
  // daysInMonth is derived from viewYear/viewMonth, so those are the only stable deps needed.
  const monthBadges = useMemo(() => {
    const badges: Record<string, { count: number; allDone: boolean }> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const key = toDateKey(viewYear, viewMonth, d);
      const dayRows = loadRowsForDay(key);
      if (dayRows.length > 0) {
        const dayDone = loadDoneForDay(key);
        badges[key] = {
          count: dayRows.length,
          allDone: dayRows.every((r) => dayDone.has(r.id)),
        };
      }
    }
    return badges;
  }, [viewYear, viewMonth, daysInMonth]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const selectDay = useCallback((key: string) => {
    setSelectedKey(key);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const openAdd = useCallback(() => {
    if (!canEdit) return;
    setEditingId(null);
    setForm(emptyForm());
    setSubjectSelect("");
    setCustomSubject("");
    setDialogOpen(true);
  }, [canEdit]);

  const openEdit = useCallback(
    (row: RoutineRow) => {
      if (!canEdit) return;
      setEditingId(row.id);
      // Determine if subject matches a preset option
      const isPreset = SUBJECT_OPTIONS.slice(0, -1).includes(
        row.subject as (typeof SUBJECT_OPTIONS)[number],
      );
      if (isPreset) {
        setSubjectSelect(row.subject);
        setCustomSubject("");
      } else if (row.subject) {
        setSubjectSelect("Other (custom)");
        setCustomSubject(row.subject);
      } else {
        setSubjectSelect("");
        setCustomSubject("");
      }
      setForm({
        startTime: row.startTime,
        endTime: row.endTime,
        activity: row.activity,
        subject: row.subject,
        notes: row.notes,
        priority: row.priority,
      });
      setDialogOpen(true);
    },
    [canEdit],
  );

  const handleSave = useCallback(() => {
    // Resolve final subject value
    const resolvedSubject =
      subjectSelect === "Other (custom)" ? customSubject.trim() : subjectSelect;
    const finalForm = { ...form, subject: resolvedSubject };

    if (
      !finalForm.activity.trim() ||
      !finalForm.startTime ||
      !finalForm.endTime
    )
      return;

    if (editingId !== null) {
      setRows((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...finalForm } : r)),
      );
    } else {
      const newRow: RoutineRow = { id: Date.now(), ...finalForm };
      setRows((prev) => [...prev, newRow]);
    }

    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm());
    setSubjectSelect("");
    setCustomSubject("");
  }, [form, editingId, subjectSelect, customSubject]);

  // ── Copy from any date ────────────────────────────────────────────────────
  const handleCopyFromDate = useCallback(() => {
    if (!copyFromDate) {
      toast.error("Please select a date to copy from");
      return;
    }
    const sourceRows = loadRowsForDay(copyFromDate);
    if (sourceRows.length === 0) {
      toast.error("No schedule found for that date");
      return;
    }
    const copiedRows = sourceRows.map((r) => ({
      ...r,
      id: Date.now() + Math.random(),
    }));
    setRows(copiedRows);
    setDoneIds(new Set());
    setCopyDialogOpen(false);
    toast.success(`Schedule copied from ${copyFromDate}!`);
  }, [copyFromDate]);

  const handleDelete = useCallback(
    (id: number) => {
      if (!canEdit) return;
      setRows((prev) => prev.filter((r) => r.id !== id));
      setDoneIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [canEdit],
  );

  const toggleDone = useCallback(
    (id: number) => {
      if (dayType === "past") return;
      setDoneIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [dayType],
  );

  const duration = calcDuration(form.startTime, form.endTime);

  // ── Formatted selected date label ─────────────────────────────────────────
  const selectedDateLabel = useMemo(() => {
    const [y, m, d] = selectedKey.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [selectedKey]);

  // ── Cache-bust keys (rows/doneIds serialised so useMemo treats them as used deps) ──
  const rowsKey = rows.map((r) => r.id).join(",");
  const doneKey = [...doneIds].sort().join(",");

  // ── 100-day table data ────────────────────────────────────────────────────
  const hundredDayData = useMemo(() => {
    // Reference cache-bust keys inside the callback so biome sees them as used
    void rowsKey;
    void doneKey;
    const today = todayKey();
    return Array.from({ length: 100 }, (_, i) => {
      const dateKey = addDays(startDate, i);
      const dayRows = loadRowsForDay(dateKey);
      const dayDone = loadDoneForDay(dateKey);
      const scheduled = dayRows.length;
      const done = dayRows.filter((r) => dayDone.has(r.id)).length;
      const pct = scheduled > 0 ? Math.round((done / scheduled) * 100) : 0;
      const isToday = dateKey === today;
      const isPast = compareKeys(dateKey, today) < 0;
      const isFuture = compareKeys(dateKey, today) > 0;
      return {
        dayNum: i + 1,
        dateKey,
        scheduled,
        done,
        pct,
        isToday,
        isPast,
        isFuture,
      };
    });
  }, [startDate, rowsKey, doneKey]);

  // ── Streak calculation (consecutive days from today going back with 100% completion) ──
  const streak = useMemo(() => {
    // Reference cache-bust keys so biome sees them as used
    void rowsKey;
    void doneKey;
    const today = todayKey();
    let s = 0;
    let cursor = today;
    for (let i = 0; i < 100; i++) {
      const dayRows = loadRowsForDay(cursor);
      const dayDone = loadDoneForDay(cursor);
      if (dayRows.length > 0 && dayRows.every((r) => dayDone.has(r.id))) {
        s++;
        // Go back one day
        const [y, m, d] = cursor.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        date.setDate(date.getDate() - 1);
        cursor = toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
      } else {
        break;
      }
    }
    return s;
  }, [rowsKey, doneKey]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-border bg-card/40 shrink-0">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <CalendarDays size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-foreground leading-none font-display">
                Monthly Routine Scheduler
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Plan, track, and review your daily schedule
              </p>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Flame size={13} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400">
                  {streak} day streak
                </span>
              </div>
            )}
            {rows.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <CheckCircle2 size={14} className="text-primary" />
                <span className="text-xs font-semibold text-primary">
                  {progressPct}% ({doneCount}/{rows.length})
                </span>
              </div>
            )}
          </div>
          {rows.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-medium">
                  Today's Progress
                </span>
                <span className="text-[10px] font-bold text-primary font-mono">
                  {progressPct}%
                </span>
              </div>
              <Progress value={progressPct} className="h-1.5 bg-muted" />
            </div>
          )}
        </header>

        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6 space-y-5">
            {/* ── Monthly Calendar ─────────────────────────────────────────── */}
            <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
              {/* Month navigation */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80">
                <button
                  type="button"
                  onClick={prevMonth}
                  aria-label="Previous month"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-sm font-bold text-foreground font-display tracking-wide">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </h2>
                <button
                  type="button"
                  onClick={nextMonth}
                  aria-label="Next month"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 border-b border-border">
                {DAY_NAMES.map((d) => (
                  <div
                    key={d}
                    className="py-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {/* Leading blank cells — one per skipped weekday slot */}
                {Array.from(
                  { length: firstDayOfWeek },
                  (_, i) => DAY_NAMES[i],
                ).map((dayName) => (
                  <div
                    key={`blank-${viewYear}-${viewMonth}-${dayName}`}
                    className="border-b border-r border-border/30 h-11"
                  />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const key = toDateKey(viewYear, viewMonth, day);
                  const isToday = key === todayKey();
                  const isSelected = key === selectedKey;
                  const badge = monthBadges[key];
                  const isPast = compareKeys(key, todayKey()) < 0;
                  const isFuture = compareKeys(key, todayKey()) > 0;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selectDay(key)}
                      aria-label={`${day} ${MONTH_NAMES[viewMonth]}`}
                      className={[
                        "relative h-11 flex flex-col items-center justify-center transition-all duration-150",
                        "border-b border-r border-border/30",
                        isSelected
                          ? "bg-primary/20 ring-2 ring-inset ring-primary z-10"
                          : isToday
                            ? "bg-primary/10"
                            : isPast
                              ? "bg-background/30 hover:bg-accent/20"
                              : isFuture
                                ? "hover:bg-accent/20"
                                : "hover:bg-accent/20",
                        badge?.allDone && !isSelected
                          ? "bg-emerald-500/10"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span
                        className={[
                          "text-xs font-semibold leading-none",
                          isToday
                            ? "text-primary"
                            : isPast
                              ? "text-muted-foreground/60"
                              : "text-foreground",
                        ].join(" ")}
                      >
                        {day}
                      </span>
                      {badge && (
                        <span
                          className={[
                            "mt-0.5 text-[9px] font-bold px-1 rounded-full leading-tight",
                            badge.allDone
                              ? "bg-emerald-500/30 text-emerald-400"
                              : "bg-primary/30 text-primary",
                          ].join(" ")}
                        >
                          {badge.count}
                        </span>
                      )}
                      {isToday && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Selected Day Panel ───────────────────────────────────────── */}
            <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
              {/* Day header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                    <CalendarDays size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground font-display">
                      {selectedDateLabel}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {dayType === "today" && (
                        <Badge className="h-4 text-[10px] px-1.5 bg-primary/20 text-primary border-primary/30 border font-semibold">
                          Today
                        </Badge>
                      )}
                      {dayType === "past" && (
                        <Badge className="h-4 text-[10px] px-1.5 bg-muted/40 text-muted-foreground border-border font-semibold">
                          Past
                        </Badge>
                      )}
                      {dayType === "future" && (
                        <Badge className="h-4 text-[10px] px-1.5 bg-blue-500/20 text-blue-400 border-blue-500/30 border font-semibold">
                          Upcoming
                        </Badge>
                      )}
                      {rows.length > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {rows.length} task{rows.length !== 1 ? "s" : ""}
                          {totalDuration > 0 &&
                            ` · ${formatDuration(totalDuration)}`}
                          {" · "}
                          <span className="text-primary font-semibold">
                            {progressPct}% done
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {canEdit && (
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <Button
                        onClick={() => setCopyDialogOpen(true)}
                        size="sm"
                        variant="outline"
                        className="gap-2 h-8 text-xs font-semibold border-border text-muted-foreground hover:text-foreground"
                      >
                        <Copy size={13} />
                        Copy From Date
                      </Button>
                    )}
                    <Button
                      onClick={openAdd}
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs font-semibold"
                    >
                      <PlusCircle size={13} />
                      Add Task
                    </Button>
                  </div>
                )}
              </div>

              {/* Past day read-only banner */}
              {dayType === "past" && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20">
                  <AlertTriangle
                    size={14}
                    className="text-amber-400 shrink-0"
                  />
                  <p className="text-xs text-amber-400 font-medium">
                    Past Day — Read Only. Data is saved and cannot be edited.
                  </p>
                </div>
              )}

              {/* Future day info banner */}
              {dayType === "future" && rows.length === 0 && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-500/8 border-b border-blue-500/15">
                  <CalendarDays size={14} className="text-blue-400 shrink-0" />
                  <p className="text-xs text-blue-400 font-medium">
                    Plan ahead — tasks added here will be available on this day.
                  </p>
                </div>
              )}

              {/* Table or empty state */}
              {sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                  <CalendarDays size={40} className="opacity-20" />
                  <p className="text-sm font-medium">No tasks scheduled.</p>
                  {canEdit ? (
                    <p className="text-xs">
                      Click{" "}
                      <span className="text-primary font-semibold">
                        "Add Task"
                      </span>{" "}
                      to plan your day.
                    </p>
                  ) : (
                    <p className="text-xs">No data was logged for this day.</p>
                  )}
                </div>
              ) : (
                <div
                  className="max-h-96 w-full"
                  style={{ overflowX: "auto", overflowY: "auto" }}
                >
                  <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-card/95 backdrop-blur-sm">
                        <th className="w-10 px-3 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-[110px]">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-[150px]">
                          Activity
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-[100px]">
                          Subject
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-20">
                          Duration
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-24">
                          Priority
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-[140px]">
                          Notes
                        </th>
                        <th className="px-4 py-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-16">
                          Done
                        </th>
                        {canEdit && (
                          <th className="px-3 py-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-20">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((row, idx) => {
                        const done = doneIds.has(row.id);
                        const dur = calcDuration(row.startTime, row.endTime);
                        const pStyle = PRIORITY_STYLES[row.priority];

                        return (
                          <tr
                            key={row.id}
                            className={`border-t border-border transition-colors group ${
                              done
                                ? "bg-emerald-500/5 hover:bg-emerald-500/8"
                                : "hover:bg-accent/15"
                            }`}
                          >
                            {/* # */}
                            <td className="px-3 py-3 text-xs text-muted-foreground font-mono">
                              {idx + 1}
                            </td>

                            {/* Time */}
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs font-mono font-semibold ${done ? "text-muted-foreground line-through" : "text-foreground"}`}
                              >
                                {formatTime(row.startTime, timeFormat)} –{" "}
                                {formatTime(row.endTime, timeFormat)}
                              </span>
                            </td>

                            {/* Activity */}
                            <td className="px-4 py-3">
                              <span
                                className={`text-sm font-medium ${done ? "text-muted-foreground line-through" : "text-foreground"}`}
                              >
                                {row.activity}
                              </span>
                            </td>

                            {/* Subject */}
                            <td className="px-4 py-3">
                              {row.subject ? (
                                <span
                                  className={`text-xs px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium ${done ? "opacity-50" : ""}`}
                                >
                                  {row.subject}
                                </span>
                              ) : (
                                <span className="text-muted-foreground/40 text-xs">
                                  –
                                </span>
                              )}
                            </td>

                            {/* Duration */}
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs font-mono ${done ? "text-muted-foreground" : "text-foreground"}`}
                              >
                                {formatDuration(dur)}
                              </span>
                            </td>

                            {/* Priority */}
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-semibold ${pStyle.badge} ${done ? "opacity-50" : ""}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`}
                                />
                                {pStyle.label}
                              </span>
                            </td>

                            {/* Notes */}
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs ${done ? "text-muted-foreground/50 line-through" : "text-muted-foreground"} max-w-[180px] block truncate`}
                                title={row.notes}
                              >
                                {row.notes || "–"}
                              </span>
                            </td>

                            {/* Done checkbox */}
                            <td className="px-4 py-3 text-center">
                              {dayType === "future" ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex cursor-not-allowed opacity-40">
                                      <Circle
                                        size={20}
                                        className="text-muted-foreground/40"
                                      />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="text-xs"
                                  >
                                    Available on that day
                                  </TooltipContent>
                                </Tooltip>
                              ) : dayType === "past" ? (
                                done ? (
                                  <CheckCircle2
                                    size={20}
                                    className="text-emerald-500/50 mx-auto"
                                  />
                                ) : (
                                  <Circle
                                    size={20}
                                    className="text-muted-foreground/25 mx-auto"
                                  />
                                )
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => toggleDone(row.id)}
                                  aria-label={
                                    done ? "Mark as not done" : "Mark as done"
                                  }
                                  className="transition-all hover:scale-110"
                                >
                                  {done ? (
                                    <CheckCircle2
                                      size={20}
                                      className="text-emerald-500"
                                    />
                                  ) : (
                                    <Circle
                                      size={20}
                                      className="text-muted-foreground/40 hover:text-emerald-400 transition-colors"
                                    />
                                  )}
                                </button>
                              )}
                            </td>

                            {/* Actions — only for editable days */}
                            {canEdit && (
                              <td className="px-3 py-3 text-center">
                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => openEdit(row)}
                                    aria-label="Edit task"
                                    className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(row.id)}
                                    aria-label="Delete task"
                                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>

                    {/* Footer: total duration */}
                    {rows.length > 0 && (
                      <tfoot>
                        <tr className="border-t border-border bg-card/60">
                          <td
                            colSpan={canEdit ? 4 : 4}
                            className="px-4 py-2.5 text-xs text-muted-foreground font-semibold"
                          >
                            Total scheduled
                          </td>
                          <td className="px-4 py-2.5 text-xs font-mono font-bold text-primary">
                            {formatDuration(totalDuration)}
                          </td>
                          <td colSpan={canEdit ? 4 : 3} className="px-4 py-2.5">
                            {dayType !== "past" && rows.length > 0 && (
                              <div className="flex items-center gap-2 justify-end">
                                <Clock
                                  size={12}
                                  className="text-muted-foreground"
                                />
                                <span className="text-xs text-muted-foreground">
                                  {doneCount}/{rows.length} complete
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </div>

            {/* ── All Days Progress Table ──────────────────────────────── */}
            <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80">
                <div className="flex items-center gap-2">
                  <CalendarDays size={15} className="text-primary" />
                  <h3 className="text-sm font-bold text-foreground font-display">
                    All Days Progress (100 Days)
                  </h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-border text-muted-foreground hover:text-foreground gap-1.5"
                  onClick={() => {
                    const newStart = todayKey();
                    setStartDate(newStart);
                    setStartDateState(newStart);
                    toast.success("100-day tracker reset to today");
                  }}
                >
                  Set Start Date
                </Button>
              </div>
              <ScrollArea className="max-h-96">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-card/95 backdrop-blur-sm">
                        <th className="px-3 py-2 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-12">
                          Day
                        </th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Date
                        </th>
                        <th className="px-3 py-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-16">
                          Sched
                        </th>
                        <th className="px-3 py-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-14">
                          Done
                        </th>
                        <th className="px-3 py-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-20">
                          Progress
                        </th>
                        <th className="px-3 py-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-14">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {hundredDayData.map((entry) => {
                        const isSelected = entry.dateKey === selectedKey;
                        return (
                          <tr
                            key={entry.dateKey}
                            onClick={() => {
                              if (!entry.isFuture) selectDay(entry.dateKey);
                            }}
                            onKeyDown={(e) => {
                              if (
                                (e.key === "Enter" || e.key === " ") &&
                                !entry.isFuture
                              ) {
                                selectDay(entry.dateKey);
                              }
                            }}
                            tabIndex={entry.isFuture ? -1 : 0}
                            className={[
                              "border-t border-border transition-colors cursor-pointer",
                              entry.isToday
                                ? "bg-primary/10 font-semibold"
                                : "",
                              entry.isPast ? "opacity-70" : "",
                              isSelected
                                ? "ring-1 ring-inset ring-primary"
                                : "hover:bg-accent/15",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            <td className="px-3 py-2 text-xs font-mono text-muted-foreground">
                              <div className="flex items-center gap-1">
                                D{entry.dayNum}
                                {entry.isPast && (
                                  <Lock
                                    size={9}
                                    className="text-muted-foreground/40"
                                  />
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-foreground">
                              {(() => {
                                const [y, m, d] = entry.dateKey
                                  .split("-")
                                  .map(Number);
                                return new Date(y, m - 1, d).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  },
                                );
                              })()}
                              {entry.isToday && (
                                <span className="ml-1 text-[9px] text-primary font-bold">
                                  TODAY
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-xs text-center text-muted-foreground font-mono">
                              {entry.scheduled || <span>{"–"}</span>}
                            </td>
                            <td className="px-3 py-2 text-xs text-center font-mono">
                              {entry.scheduled > 0 ? (
                                entry.done
                              ) : (
                                <span>{"–"}</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-xs text-center">
                              {entry.scheduled > 0 ? (
                                <div className="flex items-center gap-1">
                                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary rounded-full"
                                      style={{ width: `${entry.pct}%` }}
                                    />
                                  </div>
                                  <span className="text-[9px] font-mono text-primary shrink-0">
                                    {entry.pct}%
                                  </span>
                                </div>
                              ) : (
                                <span>{"–"}</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {entry.scheduled === 0 ? (
                                <span className="text-muted-foreground/40 text-xs">
                                  {"–"}
                                </span>
                              ) : entry.pct === 100 ? (
                                <CheckCircle2
                                  size={14}
                                  className="text-emerald-400 mx-auto"
                                />
                              ) : entry.isFuture ? (
                                <Circle
                                  size={14}
                                  className="text-muted-foreground/30 mx-auto"
                                />
                              ) : (
                                <div className="flex items-center justify-center gap-0.5">
                                  <Circle
                                    size={14}
                                    className={
                                      entry.pct > 0
                                        ? "text-amber-400"
                                        : "text-muted-foreground/30"
                                    }
                                  />
                                  {entry.pct > 0 && (
                                    <span className="text-[8px] text-amber-400 font-bold">
                                      {entry.pct}%
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </div>
          </div>
        </ScrollArea>

        {/* ── Copy From Date Dialog ─────────────────────────────────────────── */}
        <Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
          <DialogContent className="sm:max-w-sm bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-foreground">
                Copy Schedule From Date
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <p className="text-xs text-muted-foreground">
                Select a date to copy its tasks to {selectedDateLabel}. Existing
                tasks will be replaced.
              </p>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Source Date
                </Label>
                <Input
                  type="date"
                  value={copyFromDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCopyFromDate(e.target.value)}
                  className="h-9 text-sm bg-input border-border"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCopyDialogOpen(false)}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCopyFromDate}
                disabled={!copyFromDate}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Copy size={13} />
                Copy Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Add / Edit Dialog ─────────────────────────────────────────────── */}
        <Dialog
          open={dialogOpen && canEdit}
          onOpenChange={(open) => {
            if (!canEdit) return;
            setDialogOpen(open);
          }}
        >
          <DialogContent className="sm:max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-foreground">
                {editingId !== null ? "Edit Task" : "Add New Task"}
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh]">
              <div className="grid gap-4 py-2 pr-2">
                {/* Activity */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Activity <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Morning Revision"
                    value={form.activity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, activity: e.target.value }))
                    }
                    className="h-9 text-sm bg-input border-border"
                    autoFocus
                  />
                </div>

                {/* Time row — AM/PM pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <AmPmTimePicker
                    value={form.startTime}
                    onChange={(v) => setForm((f) => ({ ...f, startTime: v }))}
                    label="Start Time"
                  />
                  <AmPmTimePicker
                    value={form.endTime}
                    onChange={(v) => setForm((f) => ({ ...f, endTime: v }))}
                    label="End Time"
                  />
                </div>

                {/* Auto duration */}
                {duration > 0 && (
                  <p className="text-xs text-primary font-medium -mt-2">
                    Duration: {formatDuration(duration)}
                  </p>
                )}

                {/* Subject + Priority row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Subject
                    </Label>
                    <Select
                      value={subjectSelect}
                      onValueChange={(v) => {
                        setSubjectSelect(v);
                        if (v !== "Other (custom)") {
                          setForm((f) => ({ ...f, subject: v }));
                          setCustomSubject("");
                        } else {
                          setForm((f) => ({
                            ...f,
                            subject: customSubject.trim(),
                          }));
                        }
                      }}
                    >
                      <SelectTrigger className="h-9 text-sm bg-input border-border">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {SUBJECT_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s} className="text-sm">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {subjectSelect === "Other (custom)" && (
                      <Input
                        placeholder="Enter custom subject..."
                        value={customSubject}
                        onChange={(e) => {
                          setCustomSubject(e.target.value);
                          setForm((f) => ({
                            ...f,
                            subject: e.target.value.trim(),
                          }));
                        }}
                        className="h-8 text-sm bg-input border-border mt-1"
                        autoFocus
                      />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Priority
                    </Label>
                    <Select
                      value={form.priority}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, priority: v as Priority }))
                      }
                    >
                      <SelectTrigger className="h-9 text-sm bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {(["High", "Medium", "Low"] as Priority[]).map((p) => (
                          <SelectItem key={p} value={p} className="text-sm">
                            <span className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${PRIORITY_STYLES[p].dot}`}
                              />
                              {p}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Notes</Label>
                  <Textarea
                    placeholder="Optional notes for this task..."
                    value={form.notes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    className="text-sm bg-input border-border resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDialogOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={
                  !form.activity.trim() || !form.startTime || !form.endTime
                }
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                {editingId !== null ? (
                  <>
                    <Pencil size={13} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <PlusCircle size={13} />
                    Add Task
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
