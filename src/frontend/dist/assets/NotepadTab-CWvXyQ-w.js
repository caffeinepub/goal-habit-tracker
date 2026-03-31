import { ah as useGetNotepadEntries, ai as useAddNotepadEntry, aj as useDeleteNotepadEntry, ak as useUpdateNotepadEntry, r as reactExports, b as ue, j as jsxRuntimeExports, m as motion, al as StickyNote, B as Button, P as Palette, $ as Search, I as Input, _ as X, U as Trash2 } from "./index-CkkKRQCz.js";
import { S as Skeleton } from "./skeleton-D9TN-BzV.js";
import { T as Textarea } from "./textarea-NFs8BWG6.js";
import { u as useSectionStyle, S as SectionStylePanel } from "./SectionStylePanel-C0rTiG5h.js";
import { L as LoaderCircle } from "./loader-circle-B40aN6Dr.js";
import { P as Plus } from "./plus-BxiWicK6.js";
import { C as CircleCheck } from "./circle-check-BKlIhX_3.js";
import { A as AnimatePresence } from "./index-CNh01xf_.js";
const SUBJECTS = [
  "Maths",
  "English",
  "Reasoning",
  "General Knowledge",
  "Current Affairs",
  "Computer",
  "Science",
  "Other"
];
const SUBJECT_TAB_COLORS = {
  Maths: "data-[active=true]:text-primary data-[active=true]:border-primary",
  English: "data-[active=true]:text-blue-400 data-[active=true]:border-blue-400",
  Reasoning: "data-[active=true]:text-purple-400 data-[active=true]:border-purple-400",
  "General Knowledge": "data-[active=true]:text-amber-400 data-[active=true]:border-amber-400",
  "Current Affairs": "data-[active=true]:text-emerald-400 data-[active=true]:border-emerald-400",
  Computer: "data-[active=true]:text-cyan-400 data-[active=true]:border-cyan-400",
  Science: "data-[active=true]:text-green-400 data-[active=true]:border-green-400",
  Other: "data-[active=true]:text-foreground data-[active=true]:border-border"
};
function NotepadCard({
  entry,
  onDelete,
  onUpdate
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [content, setContent] = reactExports.useState(entry.content);
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const debounceRef = reactExports.useRef(null);
  const savedTimerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!expanded) setContent(entry.content);
  }, [entry.content, expanded]);
  reactExports.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);
  const handleChange = (val) => {
    setContent(val);
    setSaveStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdate(entry.id, val);
      setSaveStatus("saved");
      savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 3e3);
    }, 800);
  };
  const preview = entry.content.trim().slice(0, 100) + (entry.content.length > 100 ? "…" : "");
  const timeStr = new Date(entry.updatedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.96, height: 0 },
      className: "rounded-xl border border-border bg-card/50 overflow-hidden group",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: `w-full flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors text-left ${expanded ? "border-b border-border bg-muted/20" : "hover:bg-muted/20"}`,
            onClick: () => setExpanded((v) => !v),
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") setExpanded((v) => !v);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { size: 12, className: "text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-xs text-muted-foreground truncate", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Editing…" }) : preview || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-muted-foreground/50", children: "Empty note" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                saveStatus === "saving" && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 10, className: "animate-spin text-muted-foreground" }),
                saveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 10, className: "text-emerald-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60 hidden group-hover:inline", children: timeStr }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: (e) => {
                      e.stopPropagation();
                      onDelete(entry.id);
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        onDelete(entry.id);
                      }
                    },
                    className: "p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100 cursor-pointer",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 11 })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.2 },
            className: "overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: content,
                  onChange: (e) => handleChange(e.target.value),
                  placeholder: "Write your quick note...",
                  autoFocus: true,
                  className: "border-none rounded-none bg-muted/10 text-sm min-h-[120px] resize-none leading-relaxed focus-visible:ring-0 px-3 py-2.5 text-foreground placeholder:text-muted-foreground/30",
                  onClick: (e) => e.stopPropagation()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-1.5 border-t border-border bg-muted/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                  content.trim().split(/\s+/).filter(Boolean).length,
                  " words"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setExpanded(false),
                    className: "text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 }),
                      "Collapse"
                    ]
                  }
                )
              ] })
            ]
          }
        ) })
      ]
    }
  );
}
function NotepadTab() {
  const { data: entries = [], isLoading } = useGetNotepadEntries();
  const addEntry = useAddNotepadEntry();
  const deleteEntry = useDeleteNotepadEntry();
  const updateEntry = useUpdateNotepadEntry();
  const [activeSubject, setActiveSubject] = reactExports.useState(SUBJECTS[0]);
  const [search, setSearch] = reactExports.useState("");
  const [showStylePanel, setShowStylePanel] = reactExports.useState(false);
  const styleBtnRef = reactExports.useRef(null);
  const { style: sectionStyle } = useSectionStyle("notepad");
  const allEntries = entries;
  const filtered = reactExports.useMemo(() => {
    const subjectEntries = search ? allEntries : allEntries.filter((e) => e.subject === activeSubject);
    if (!search) return subjectEntries;
    const s = search.toLowerCase();
    return subjectEntries.filter((e) => e.content.toLowerCase().includes(s));
  }, [allEntries, activeSubject, search]);
  const sorted = reactExports.useMemo(
    () => [...filtered].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ),
    [filtered]
  );
  const subjectCounts = reactExports.useMemo(() => {
    const map = {};
    for (const e of allEntries) {
      map[e.subject] = (map[e.subject] || 0) + 1;
    }
    return map;
  }, [allEntries]);
  const handleNew = async () => {
    try {
      await addEntry.mutateAsync({
        subject: activeSubject,
        content: ""
      });
    } catch {
      ue.error("Failed to create note");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteEntry.mutateAsync(id);
      ue.success("Note deleted");
    } catch {
      ue.error("Failed to delete note");
    }
  };
  const handleUpdate = reactExports.useCallback(
    (id, content) => {
      updateEntry.mutate(
        { id, content },
        {
          onError: () => ue.error("Failed to save")
        }
      );
    },
    [updateEntry]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl mx-auto", style: sectionStyle, children: [
    showStylePanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionStylePanel,
      {
        sectionId: "notepad",
        sectionLabel: "Notepad",
        onClose: () => setShowStylePanel(false),
        anchorRef: styleBtnRef
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        className: "mb-5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { size: 16, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground flex-1", children: "Quick Notepad" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                ref: styleBtnRef,
                size: "sm",
                variant: "outline",
                className: "h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50",
                onClick: () => setShowStylePanel((p) => !p),
                title: "Customize section style",
                "data-ocid": "notepad.style.button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 13 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground ml-11", children: "Subject-wise scratch pad for quick notes, formulas, and rough work" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Search,
          {
            size: 12,
            className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search all notes...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-7 h-8 text-xs bg-muted/40 border-input"
          }
        ),
        search && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSearch(""),
            className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 11 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: handleNew,
          disabled: addEntry.isPending,
          className: "h-8 text-xs gap-1.5 shrink-0",
          children: [
            addEntry.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 12, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
            "New Note"
          ]
        }
      )
    ] }),
    !search && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mb-5 overflow-x-auto pb-1 border-b border-border", children: SUBJECTS.map((subj) => {
      const count = subjectCounts[subj] || 0;
      const isActive = activeSubject === subj;
      const colorClass = SUBJECT_TAB_COLORS[subj] || SUBJECT_TAB_COLORS.Other;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-active": isActive,
          onClick: () => setActiveSubject(subj),
          className: `flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors shrink-0 ${colorClass} ${isActive ? "" : "border-transparent text-muted-foreground hover:text-foreground"}`,
          children: [
            subj,
            count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[9px] font-mono rounded-full w-4 h-4 flex items-center justify-center ${isActive ? "bg-current/20" : "bg-muted text-muted-foreground"}`,
                children: count
              }
            )
          ]
        },
        subj
      );
    }) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full bg-muted" }, i)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "flex flex-col items-center py-16 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-xl bg-muted/20 border border-border flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { size: 22, className: "text-muted-foreground/30" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground mb-1", children: search ? "No notes match your search" : `No notes for ${activeSubject}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mb-4", children: search ? "Try a different search term" : "Tap 'New Note' to jot down your first quick note" }),
          !search && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: handleNew,
              className: "h-7 text-xs gap-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 11 }),
                "New Note"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: sorted.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      NotepadCard,
      {
        entry,
        onDelete: handleDelete,
        onUpdate: handleUpdate
      },
      String(entry.id)
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ".",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "hover:text-primary transition-colors",
          children: "Built with love using caffeine.ai"
        }
      )
    ] }) })
  ] });
}
export {
  NotepadTab as default
};
