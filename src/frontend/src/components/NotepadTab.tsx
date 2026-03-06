import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Loader2,
  Palette,
  Plus,
  Search,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { NotepadEntry } from "../backend.d";
import {
  useAddNotepadEntry,
  useDeleteNotepadEntry,
  useGetNotepadEntries,
  useUpdateNotepadEntry,
} from "../hooks/useQueries";
import SectionStylePanel, { useSectionStyle } from "./SectionStylePanel";

const SUBJECTS = [
  "Maths",
  "English",
  "Reasoning",
  "General Knowledge",
  "Current Affairs",
  "Computer",
  "Science",
  "Other",
];

const SUBJECT_TAB_COLORS: Record<string, string> = {
  Maths: "data-[active=true]:text-primary data-[active=true]:border-primary",
  English:
    "data-[active=true]:text-blue-400 data-[active=true]:border-blue-400",
  Reasoning:
    "data-[active=true]:text-purple-400 data-[active=true]:border-purple-400",
  "General Knowledge":
    "data-[active=true]:text-amber-400 data-[active=true]:border-amber-400",
  "Current Affairs":
    "data-[active=true]:text-emerald-400 data-[active=true]:border-emerald-400",
  Computer:
    "data-[active=true]:text-cyan-400 data-[active=true]:border-cyan-400",
  Science:
    "data-[active=true]:text-green-400 data-[active=true]:border-green-400",
  Other: "data-[active=true]:text-foreground data-[active=true]:border-border",
};

type SaveStatus = "idle" | "saving" | "saved";

// ── Notepad Card ─────────────────────────────────────────────────────────────
function NotepadCard({
  entry,
  onDelete,
  onUpdate,
}: {
  entry: NotepadEntry;
  onDelete: (id: bigint) => void;
  onUpdate: (id: bigint, content: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState(entry.content);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep in sync with external updates (e.g. after save invalidation)
  useEffect(() => {
    if (!expanded) setContent(entry.content);
  }, [entry.content, expanded]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  const handleChange = (val: string) => {
    setContent(val);
    setSaveStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdate(entry.id, val);
      setSaveStatus("saved");
      savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
    }, 800);
  };

  const preview =
    entry.content.trim().slice(0, 100) +
    (entry.content.length > 100 ? "…" : "");

  const timeStr = new Date(entry.updatedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, height: 0 }}
      className="rounded-xl border border-border bg-card/50 overflow-hidden group"
    >
      {/* Card Header */}
      <button
        type="button"
        className={`w-full flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors text-left ${
          expanded ? "border-b border-border bg-muted/20" : "hover:bg-muted/20"
        }`}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded((v) => !v);
        }}
      >
        <StickyNote size={12} className="text-muted-foreground shrink-0" />
        <p className="flex-1 text-xs text-muted-foreground truncate">
          {expanded ? (
            <span className="text-foreground font-medium">Editing…</span>
          ) : (
            preview || (
              <span className="italic text-muted-foreground/50">
                Empty note
              </span>
            )
          )}
        </p>
        <div className="flex items-center gap-1.5 shrink-0">
          {saveStatus === "saving" && (
            <Loader2 size={10} className="animate-spin text-muted-foreground" />
          )}
          {saveStatus === "saved" && (
            <CheckCircle2 size={10} className="text-emerald-400" />
          )}
          <span className="text-[10px] text-muted-foreground/60 hidden group-hover:inline">
            {timeStr}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onDelete(entry.id);
              }
            }}
            className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </button>

      {/* Expanded Editor */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Textarea
              value={content}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Write your quick note..."
              autoFocus
              className="border-none rounded-none bg-muted/10 text-sm min-h-[120px] resize-none leading-relaxed focus-visible:ring-0 px-3 py-2.5 text-foreground placeholder:text-muted-foreground/30"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-muted/10">
              <span className="text-[10px] text-muted-foreground">
                {content.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <X size={10} />
                Collapse
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main NotepadTab ──────────────────────────────────────────────────────────
export default function NotepadTab() {
  const { data: entries = [], isLoading } = useGetNotepadEntries();
  const addEntry = useAddNotepadEntry();
  const deleteEntry = useDeleteNotepadEntry();
  const updateEntry = useUpdateNotepadEntry();

  const [activeSubject, setActiveSubject] = useState(SUBJECTS[0]);
  const [search, setSearch] = useState("");
  const [showStylePanel, setShowStylePanel] = useState(false);
  const styleBtnRef = useRef<HTMLButtonElement>(null);
  const { style: sectionStyle } = useSectionStyle("notepad");

  const allEntries = entries as NotepadEntry[];

  // Filter entries for current subject + search
  const filtered = useMemo(() => {
    const subjectEntries = search
      ? allEntries
      : allEntries.filter((e) => e.subject === activeSubject);

    if (!search) return subjectEntries;
    const s = search.toLowerCase();
    return subjectEntries.filter((e) => e.content.toLowerCase().includes(s));
  }, [allEntries, activeSubject, search]);

  // Sort by most recent
  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [filtered],
  );

  const subjectCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of allEntries) {
      map[e.subject] = (map[e.subject] || 0) + 1;
    }
    return map;
  }, [allEntries]);

  const handleNew = async () => {
    try {
      await addEntry.mutateAsync({
        subject: activeSubject,
        content: "",
      });
    } catch {
      toast.error("Failed to create note");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteEntry.mutateAsync(id);
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleUpdate = useCallback(
    (id: bigint, content: string) => {
      updateEntry.mutate(
        { id, content },
        {
          onError: () => toast.error("Failed to save"),
        },
      );
    },
    [updateEntry],
  );

  return (
    <div className="p-6 max-w-4xl mx-auto" style={sectionStyle}>
      {/* Section Style Panel */}
      {showStylePanel && (
        <SectionStylePanel
          sectionId="notepad"
          sectionLabel="Notepad"
          onClose={() => setShowStylePanel(false)}
          anchorRef={styleBtnRef as React.RefObject<HTMLElement | null>}
        />
      )}
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <StickyNote size={16} className="text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground flex-1">
            Quick Notepad
          </h2>
          <Button
            ref={styleBtnRef}
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50"
            onClick={() => setShowStylePanel((p) => !p)}
            title="Customize section style"
            data-ocid="notepad.style.button"
          >
            <Palette size={13} />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground ml-11">
          Subject-wise scratch pad for quick notes, formulas, and rough work
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search all notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-8 text-xs bg-muted/40 border-input"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={11} />
            </button>
          )}
        </div>

        <Button
          size="sm"
          onClick={handleNew}
          disabled={addEntry.isPending}
          className="h-8 text-xs gap-1.5 shrink-0"
        >
          {addEntry.isPending ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Plus size={12} />
          )}
          New Note
        </Button>
      </div>

      {/* Subject Tabs */}
      {!search && (
        <div className="flex gap-1 mb-5 overflow-x-auto pb-1 border-b border-border">
          {SUBJECTS.map((subj) => {
            const count = subjectCounts[subj] || 0;
            const isActive = activeSubject === subj;
            const colorClass =
              SUBJECT_TAB_COLORS[subj] || SUBJECT_TAB_COLORS.Other;
            return (
              <button
                key={subj}
                type="button"
                data-active={isActive}
                onClick={() => setActiveSubject(subj)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors shrink-0 ${colorClass} ${
                  isActive
                    ? ""
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {subj}
                {count > 0 && (
                  <span
                    className={`text-[9px] font-mono rounded-full w-4 h-4 flex items-center justify-center ${
                      isActive
                        ? "bg-current/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Notes Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full bg-muted" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-16 text-center"
        >
          <div className="w-14 h-14 rounded-xl bg-muted/20 border border-border flex items-center justify-center mx-auto mb-3">
            <StickyNote size={22} className="text-muted-foreground/30" />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {search
              ? "No notes match your search"
              : `No notes for ${activeSubject}`}
          </p>
          <p className="text-xs text-muted-foreground/60 mb-4">
            {search
              ? "Try a different search term"
              : "Tap 'New Note' to jot down your first quick note"}
          </p>
          {!search && (
            <Button
              size="sm"
              onClick={handleNew}
              className="h-7 text-xs gap-1.5"
            >
              <Plus size={11} />
              New Note
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          <AnimatePresence>
            {sorted.map((entry) => (
              <NotepadCard
                key={String(entry.id)}
                entry={entry}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-[11px] text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
