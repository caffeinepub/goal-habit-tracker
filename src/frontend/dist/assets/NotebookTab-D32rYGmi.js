import { f as createLucideIcon, ac as useGetNotebookEntries, ad as useAddNotebookEntry, ae as useDeleteNotebookEntry, r as reactExports, j as jsxRuntimeExports, a as BookOpen, B as Button, P as Palette, $ as Search, I as Input, m as motion, b as ue, U as Trash2, af as useUpdateNotebookEntry, ag as Type } from "./index-CkkKRQCz.js";
import { B as Badge } from "./badge-B1POrxcO.js";
import { S as Skeleton } from "./skeleton-D9TN-BzV.js";
import { T as Textarea } from "./textarea-NFs8BWG6.js";
import { u as useSectionStyle, S as SectionStylePanel } from "./SectionStylePanel-C0rTiG5h.js";
import { L as LoaderCircle } from "./loader-circle-B40aN6Dr.js";
import { P as Plus } from "./plus-BxiWicK6.js";
import { F as FileText } from "./file-text-DQgza0t5.js";
import { B as Bold } from "./bold-RKUbVRX9.js";
import { A as AnimatePresence } from "./index-CNh01xf_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 18h.01", key: "1tta3j" }],
  ["path", { d: "M3 6h.01", key: "1rqtza" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 18h13", key: "1lx6n3" }],
  ["path", { d: "M8 6h13", key: "ik3vkj" }]
];
const List = createLucideIcon("list", __iconNode);
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
const SUBJECT_COLORS = {
  Maths: "text-primary border-primary/40 bg-primary/10",
  English: "text-blue-400 border-blue-500/40 bg-blue-500/10",
  Reasoning: "text-purple-400 border-purple-500/40 bg-purple-500/10",
  "General Knowledge": "text-amber-400 border-amber-500/40 bg-amber-500/10",
  "Current Affairs": "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  Computer: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
  Science: "text-green-400 border-green-500/40 bg-green-500/10",
  Other: "text-muted-foreground border-border bg-muted/20"
};
function insertMarkdown(textarea, syntax, wrap = false) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const val = textarea.value;
  const selected = val.slice(start, end);
  let newVal;
  let newCursor;
  if (wrap) {
    newVal = val.slice(0, start) + syntax + selected + syntax + val.slice(end);
    newCursor = selected ? start + syntax.length + selected.length + syntax.length : start + syntax.length;
  } else {
    const lineStart = val.lastIndexOf("\n", start - 1) + 1;
    newVal = val.slice(0, lineStart) + syntax + val.slice(lineStart);
    newCursor = lineStart + syntax.length + (start - lineStart);
  }
  return { newVal, newCursor };
}
function NoteEditor({
  note,
  onClose
}) {
  const updateNote = useUpdateNotebookEntry();
  const [title, setTitle] = reactExports.useState(note.title);
  const [content, setContent] = reactExports.useState(note.content);
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const debounceRef = reactExports.useRef(null);
  const savedTimerRef = reactExports.useRef(null);
  const textareaRef = reactExports.useRef(null);
  const triggerSave = reactExports.useCallback(
    (newTitle, newContent) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSaveStatus("saving");
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        updateNote.mutate(
          {
            id: note.id,
            title: newTitle.trim() || "Untitled",
            content: newContent
          },
          {
            onSuccess: () => {
              setSaveStatus("saved");
              savedTimerRef.current = setTimeout(
                () => setSaveStatus("idle"),
                3e3
              );
            },
            onError: () => {
              setSaveStatus("idle");
              ue.error("Failed to save note");
            }
          }
        );
      }, 800);
    },
    [note.id, updateNote]
  );
  reactExports.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);
  const handleTitleChange = (val) => {
    setTitle(val);
    triggerSave(val, content);
  };
  const handleContentChange = (val) => {
    setContent(val);
    triggerSave(title, val);
  };
  const handleToolbarAction = (action) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    let result;
    if (action === "bold") {
      result = insertMarkdown(textarea, "**", true);
    } else if (action === "bullet") {
      result = insertMarkdown(textarea, "- ", false);
    } else {
      result = insertMarkdown(textarea, "## ", false);
    }
    setContent(result.newVal);
    triggerSave(title, result.newVal);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(result.newCursor, result.newCursor);
    }, 0);
  };
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 12 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 12 },
      className: "flex flex-col h-full",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `text-[10px] px-1.5 py-0 shrink-0 ${SUBJECT_COLORS[note.subject] || SUBJECT_COLORS.Other}`,
              children: note.subject
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 ml-auto", children: [
            saveStatus === "saving" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 10, className: "animate-spin" }),
              "Saving…"
            ] }),
            saveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-1 text-emerald-400 text-xs", children: "✓ Saved" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
              wordCount,
              " words"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleToolbarAction("bold"),
              title: "Bold (**text**)",
              className: "p-1.5 rounded hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { size: 13 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleToolbarAction("bullet"),
              title: "Bullet point",
              className: "p-1.5 rounded hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { size: 13 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleToolbarAction("heading"),
              title: "Heading (## text)",
              className: "p-1.5 rounded hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { size: 13 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border mx-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
            "Updated",
            " ",
            new Date(note.updatedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short"
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: onClose,
              className: "ml-auto h-7 text-xs text-muted-foreground hover:text-foreground",
              children: "Close"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: title,
            onChange: (e) => handleTitleChange(e.target.value),
            placeholder: "Note title...",
            className: "px-4 py-3 text-lg font-display font-semibold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/40 border-b border-border"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            ref: textareaRef,
            value: content,
            onChange: (e) => handleContentChange(e.target.value),
            placeholder: "Start writing your notes here...\n\nUse **bold** for emphasis\nUse ## for headings\nUse - for bullet points",
            className: "flex-1 resize-none border-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-0 rounded-none px-4 py-3 min-h-[300px]"
          }
        )
      ]
    }
  );
}
function NoteListItem({
  note,
  isActive,
  onSelect,
  onDelete
}) {
  const preview = note.content.replace(/^#{1,3}\s/gm, "").replace(/\*\*/g, "").replace(/^-\s/gm, "• ").trim().slice(0, 80);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 4 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.96 },
      className: `group relative cursor-pointer rounded-lg px-3 py-2.5 transition-colors border ${isActive ? "bg-primary/10 border-primary/30" : "bg-transparent border-transparent hover:bg-muted/30 hover:border-border"}`,
      onClick: onSelect,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FileText,
          {
            size: 13,
            className: `mt-0.5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-xs font-medium leading-tight truncate ${isActive ? "text-foreground" : "text-foreground/80"}`,
              children: note.title || "Untitled"
            }
          ),
          preview && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed", children: preview }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/50 mt-1", children: new Date(note.updatedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              onDelete();
            },
            className: "opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all shrink-0",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 11 })
          }
        )
      ] })
    }
  );
}
function NotebookTab() {
  const { data: entries = [], isLoading } = useGetNotebookEntries();
  const addNote = useAddNotebookEntry();
  const deleteNote = useDeleteNotebookEntry();
  const [selectedSubject, setSelectedSubject] = reactExports.useState(SUBJECTS[0]);
  const [activeNoteId, setActiveNoteId] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [showStylePanel, setShowStylePanel] = reactExports.useState(false);
  const styleBtnRef = reactExports.useRef(null);
  const { style: sectionStyle } = useSectionStyle("notebook");
  const allEntries = entries;
  const filtered = reactExports.useMemo(() => {
    if (search.trim()) {
      const s = search.toLowerCase();
      return allEntries.filter(
        (e) => e.title.toLowerCase().includes(s) || e.content.toLowerCase().includes(s)
      );
    }
    return allEntries.filter((e) => e.subject === selectedSubject);
  }, [allEntries, selectedSubject, search]);
  const sorted = reactExports.useMemo(
    () => [...filtered].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ),
    [filtered]
  );
  const activeNote = reactExports.useMemo(
    () => allEntries.find((e) => e.id === activeNoteId) ?? null,
    [allEntries, activeNoteId]
  );
  const subjectCounts = reactExports.useMemo(() => {
    const map = {};
    for (const e of allEntries) {
      map[e.subject] = (map[e.subject] || 0) + 1;
    }
    return map;
  }, [allEntries]);
  const handleNewNote = async () => {
    try {
      await addNote.mutateAsync({
        subject: selectedSubject,
        title: "Untitled Note",
        content: ""
      });
      ue.success("Note created");
    } catch {
      ue.error("Failed to create note");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteNote.mutateAsync(id);
      if (activeNoteId === id) setActiveNoteId(null);
      ue.success("Note deleted");
    } catch {
      ue.error("Failed to delete note");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen overflow-hidden", style: sectionStyle, children: [
    showStylePanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionStylePanel,
      {
        sectionId: "notebook",
        sectionLabel: "Notebook",
        onClose: () => setShowStylePanel(false),
        anchorRef: styleBtnRef
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-44 shrink-0 border-r border-border flex flex-col bg-sidebar/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 14, className: "text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-semibold text-foreground flex-1", children: "Notebook" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            ref: styleBtnRef,
            size: "sm",
            variant: "ghost",
            className: "h-6 w-6 p-0 text-muted-foreground hover:text-primary",
            onClick: () => setShowStylePanel((p) => !p),
            title: "Customize section style",
            "data-ocid": "notebook.style.button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 12 })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-2 space-y-0.5 overflow-y-auto", children: SUBJECTS.map((subj) => {
        const count = subjectCounts[subj] || 0;
        const isActive = selectedSubject === subj && !search;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              setSelectedSubject(subj);
              setSearch("");
            },
            className: `w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs transition-colors ${isActive ? "bg-primary/15 text-foreground border-l-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border-l-2 border-transparent"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: subj }),
              count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-[9px] font-mono rounded-full w-4 h-4 flex items-center justify-center shrink-0 ${isActive ? "bg-primary/30 text-primary" : "bg-muted text-muted-foreground"}`,
                  children: count
                }
              )
            ]
          },
          subj
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-60 shrink-0 border-r border-border flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-border space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Search,
            {
              size: 11,
              className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search all notes...",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "pl-7 h-7 text-xs bg-muted/40 border-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: handleNewNote,
            disabled: addNote.isPending,
            className: "w-full h-7 text-xs gap-1",
            children: [
              addNote.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 10, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 10 }),
              "New Note"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-1", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full bg-muted" }, i)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-10 text-center px-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 28, className: "text-muted-foreground/30 mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: search ? "No notes match your search" : `No notes for ${selectedSubject} yet` })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: sorted.map((note) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteListItem,
        {
          note,
          isActive: activeNoteId === note.id,
          onSelect: () => setActiveNoteId(note.id),
          onDelete: () => handleDelete(note.id)
        },
        String(note.id)
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
        sorted.length,
        " note",
        sorted.length !== 1 ? "s" : "",
        search ? " found" : ` in ${selectedSubject}`
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col overflow-hidden", children: activeNote ? /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteEditor,
      {
        note: activeNote,
        onClose: () => setActiveNoteId(null)
      },
      String(activeNote.id)
    ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center h-full text-center px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        className: "max-w-xs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/30 border border-border flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 24, className: "text-muted-foreground/50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-display font-semibold text-foreground mb-1", children: "Select a note to edit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Choose a note from the list, or create a new one. Your notes are auto-saved as you type." })
        ]
      }
    ) }) })
  ] });
}
export {
  NotebookTab as default
};
