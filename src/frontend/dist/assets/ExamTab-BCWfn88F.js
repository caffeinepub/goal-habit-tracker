import { f as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, X as GraduationCap, B as Button, P as Palette, a as BookOpen, Y as useGetQuestions, Z as useDeleteQuestion, _ as X, $ as Search, I as Input, a0 as useSaveExamSession, T as Target, L as Label, a1 as Slider, a2 as useGetExamSessions, V as Clock, a3 as useAddQuestion, a4 as Zap, U as Trash2, b as ue, a5 as Timer, e as Progress } from "./index-CkkKRQCz.js";
import { B as Badge } from "./badge-B1POrxcO.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CRESsubl.js";
import { S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem } from "./select-DWhMhOud.js";
import { S as Skeleton } from "./skeleton-D9TN-BzV.js";
import { T as Textarea } from "./textarea-NFs8BWG6.js";
import { u as useSectionStyle, S as SectionStylePanel } from "./SectionStylePanel-C0rTiG5h.js";
import { A as AnimatePresence } from "./index-CNh01xf_.js";
import { H as History, T as Trophy } from "./trophy--vyJKZz5.js";
import { P as Plus } from "./plus-BxiWicK6.js";
import { C as CircleCheck } from "./circle-check-BKlIhX_3.js";
import { C as CircleAlert } from "./circle-alert-CO4tHjeV.js";
import { L as LoaderCircle } from "./loader-circle-B40aN6Dr.js";
import { C as ChevronRight } from "./chevron-right-BhQzlmQA.js";
import "./check-BVWYkXo8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M12 17h.01", key: "p32p05" }],
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z", key: "1mlx9k" }],
  ["path", { d: "M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3", key: "mhlwft" }]
];
const FileQuestion = createLucideIcon("file-question", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
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
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
function generateQuestionsFromText(text, subject) {
  var _a, _b;
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 30 && s.split(" ").length >= 5);
  const results = [];
  for (let i = 0; i < Math.min(sentences.length, 10); i++) {
    const sentence = sentences[i];
    const words = sentence.split(" ").filter((w) => w.length > 3);
    if (words.length < 4) continue;
    const keyWordIndex = Math.floor(words.length * 0.6);
    const keyWord = words[keyWordIndex].replace(/[^a-zA-Z0-9 ]/g, "");
    if (!keyWord) continue;
    const questionText = `Which of the following best completes: "${sentence.replace(keyWord, "______")}"?`;
    const dummyOptions = [
      "None of the above",
      ((_a = words[Math.floor(words.length * 0.2)]) == null ? void 0 : _a.replace(/[^a-zA-Z0-9 ]/g, "")) || "Option B",
      ((_b = words[Math.floor(words.length * 0.4)]) == null ? void 0 : _b.replace(/[^a-zA-Z0-9 ]/g, "")) || "Option C"
    ].filter((o) => o && o !== keyWord);
    const options = [keyWord, ...dummyOptions.slice(0, 3)].sort(
      () => Math.random() - 0.5
    );
    results.push({
      questionText,
      questionType: "mcq",
      options: options.slice(0, 4),
      correctAnswer: keyWord,
      difficulty: i < 3 ? "Easy" : i < 7 ? "Medium" : "Hard"
    });
  }
  for (let i = 0; i < Math.min(3, sentences.length); i++) {
    const sentence = sentences[i];
    results.push({
      questionText: `True or False: "${sentence.substring(0, 100)}"`,
      questionType: "truefalse",
      options: ["True", "False"],
      correctAnswer: "True",
      difficulty: "Easy"
    });
  }
  return results.slice(0, 15);
}
function QuestionCard({
  question,
  onDelete
}) {
  const typeColor = question.questionType === "mcq" ? "bg-blue-500/10 text-blue-400 border-blue-500/30" : question.questionType === "truefalse" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30";
  const diffColor = question.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : question.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-primary/10 text-primary border-primary/30";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.96 },
      className: "p-3 rounded-lg border border-border bg-card/50 group",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground line-clamp-2 mb-2", children: question.questionText }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-[10px] px-1.5 py-0 ${typeColor}`,
                children: question.questionType === "mcq" ? "MCQ" : question.questionType === "truefalse" ? "T/F" : "Fill-in"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-[10px] px-1.5 py-0 ${diffColor}`,
                children: question.difficulty
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-[10px] px-1.5 py-0 text-muted-foreground border-border",
                children: question.subject
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10",
            onClick: () => onDelete(question.id),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
          }
        )
      ] })
    }
  );
}
function AddQuestionForm() {
  const addQuestion = useAddQuestion();
  const [subject, setSubject] = reactExports.useState(SUBJECTS[0]);
  const [questionType, setQuestionType] = reactExports.useState("mcq");
  const [questionText, setQuestionText] = reactExports.useState("");
  const [options, setOptions] = reactExports.useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = reactExports.useState("");
  const [difficulty, setDifficulty] = reactExports.useState("Medium");
  const [generateText, setGenerateText] = reactExports.useState("");
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  const handleSubmit = async () => {
    if (!questionText.trim() || !correctAnswer.trim()) {
      ue.error("Question text and correct answer are required");
      return;
    }
    const finalOptions = questionType === "mcq" ? options.filter((o) => o.trim()) : questionType === "truefalse" ? ["True", "False"] : [];
    try {
      await addQuestion.mutateAsync({
        subject,
        questionText: questionText.trim(),
        questionType,
        options: finalOptions,
        correctAnswer: correctAnswer.trim(),
        difficulty
      });
      ue.success("Question added to bank");
      setQuestionText("");
      setCorrectAnswer("");
      setOptions(["", "", "", ""]);
    } catch {
      ue.error("Failed to add question");
    }
  };
  const handleAutoGenerate = async () => {
    if (!generateText.trim()) {
      ue.error("Paste some textbook content first");
      return;
    }
    setIsGenerating(true);
    try {
      const generated = generateQuestionsFromText(generateText, subject);
      if (generated.length === 0) {
        ue.error("Could not extract questions from the text");
        return;
      }
      let successCount = 0;
      for (const q of generated) {
        try {
          await addQuestion.mutateAsync({
            subject,
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options,
            correctAnswer: q.correctAnswer,
            difficulty: q.difficulty
          });
          successCount++;
        } catch {
        }
      }
      ue.success(`Generated ${successCount} questions from your text!`);
      setGenerateText("");
    } finally {
      setIsGenerating(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "text-primary" }),
        "Add Question Manually"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Subject" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: subject, onValueChange: setSubject, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-muted/40 border-input h-8 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SUBJECTS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: questionType,
                onValueChange: (v) => setQuestionType(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-muted/40 border-input h-8 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mcq", children: "MCQ" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "truefalse", children: "True / False" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fillin", children: "Fill in Blank" })
                  ] })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Difficulty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5", children: DIFFICULTIES.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setDifficulty(d),
              className: `flex-1 text-xs py-1.5 rounded-md border transition-colors ${difficulty === d ? d === "Easy" ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : d === "Medium" ? "bg-amber-500/20 border-amber-500/50 text-amber-400" : "bg-primary/20 border-primary/50 text-primary" : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"}`,
              children: d
            },
            d
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Question" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              placeholder: "Enter your question...",
              value: questionText,
              onChange: (e) => setQuestionText(e.target.value),
              className: "bg-muted/40 border-input text-sm min-h-[80px] resize-none"
            }
          )
        ] }),
        questionType === "mcq" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Options (A/B/C/D)" }),
          options.map((opt, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: options are positional (A/B/C/D) and always 4
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground w-4", children: String.fromCharCode(65 + i) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: `Option ${String.fromCharCode(65 + i)}`,
                  value: opt,
                  onChange: (e) => {
                    const next = [...options];
                    next[i] = e.target.value;
                    setOptions(next);
                  },
                  className: "bg-muted/40 border-input h-8 text-xs"
                }
              )
            ] }, `option-${i}`)
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Correct Answer" }),
          questionType === "truefalse" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["True", "False"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setCorrectAnswer(v),
              className: `flex-1 text-xs py-2 rounded-md border transition-colors ${correctAnswer === v ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"}`,
              children: v
            },
            v
          )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Correct answer...",
              value: correctAnswer,
              onChange: (e) => setCorrectAnswer(e.target.value),
              className: "bg-muted/40 border-input h-8 text-xs"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleSubmit,
            disabled: addQuestion.isPending,
            className: "w-full h-8 text-xs",
            children: [
              addQuestion.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 12, className: "animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12, className: "mr-1.5" }),
              "Add Question"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14, className: "text-amber-400" }),
        "Auto-Generate from Text"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Paste textbook content and we'll generate MCQ and True/False questions automatically." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Subject for Generated Questions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: subject, onValueChange: setSubject, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-muted/40 border-input h-8 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SUBJECTS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Paste Textbook Content" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              placeholder: "Paste your textbook paragraphs or chapter content here...",
              value: generateText,
              onChange: (e) => setGenerateText(e.target.value),
              className: "bg-muted/40 border-input text-xs min-h-[180px] resize-none leading-relaxed"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400/80", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium mb-0.5", children: "How it works:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-amber-400/60 leading-relaxed", children: "The app analyzes your text and creates up to 15 questions (MCQ + True/False). Review and delete any you don't want." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleAutoGenerate,
            disabled: isGenerating || !generateText.trim(),
            variant: "outline",
            className: "w-full h-8 text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/10",
            children: [
              isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 12, className: "animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 12, className: "mr-1.5" }),
              "Generate Questions"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function QuestionBankView() {
  const { data: questions = [], isLoading } = useGetQuestions();
  const deleteQuestion = useDeleteQuestion();
  const [filterSubject, setFilterSubject] = reactExports.useState("all");
  const [filterDiff, setFilterDiff] = reactExports.useState("all");
  const [filterType, setFilterType] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [showAddForm, setShowAddForm] = reactExports.useState(false);
  const filtered = reactExports.useMemo(() => {
    return questions.filter((q) => {
      if (filterSubject !== "all" && q.subject !== filterSubject) return false;
      if (filterDiff !== "all" && q.difficulty !== filterDiff) return false;
      if (filterType !== "all" && q.questionType !== filterType) return false;
      if (search && !q.questionText.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [questions, filterSubject, filterDiff, filterType, search]);
  const handleDelete = async (id) => {
    try {
      await deleteQuestion.mutateAsync(id);
      ue.success("Question deleted");
    } catch {
      ue.error("Failed to delete question");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: () => setShowAddForm((v) => !v),
          className: "h-8 text-xs gap-1.5",
          children: [
            showAddForm ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
            showAddForm ? "Hide Form" : "Add Questions"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-auto", children: [
        questions.length,
        " questions in bank"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showAddForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        className: "overflow-hidden",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AddQuestionForm, {})
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[180px]", children: [
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
            placeholder: "Search questions...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-7 h-8 text-xs bg-muted/40 border-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterSubject, onValueChange: setFilterSubject, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-36 h-8 text-xs bg-muted/40 border-input", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 10, className: "mr-1.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Subject" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Subjects" }),
          SUBJECTS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterDiff, onValueChange: setFilterDiff, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-28 h-8 text-xs bg-muted/40 border-input", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Difficulty" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All" }),
          DIFFICULTIES.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterType, onValueChange: setFilterType, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-28 h-8 text-xs bg-muted/40 border-input", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Type" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Types" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mcq", children: "MCQ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "truefalse", children: "True/False" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fillin", children: "Fill-in" })
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full bg-muted" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileQuestion, { size: 36, className: "text-muted-foreground/30 mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: questions.length === 0 ? "No questions yet. Add your first question above." : "No questions match your filters." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: filtered.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuestionCard,
      {
        question: q,
        onDelete: handleDelete
      },
      String(q.id)
    )) }) })
  ] });
}
function ExamSessionView({
  questions,
  config,
  onFinish
}) {
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const [userAnswers, setUserAnswers] = reactExports.useState([]);
  const [fillAnswer, setFillAnswer] = reactExports.useState("");
  const hasTimeLimit = config.timeLimit > 0;
  const initialTime = hasTimeLimit ? config.timeLimit * 60 : null;
  const [timeLeft, setTimeLeft] = reactExports.useState(initialTime);
  const intervalRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(Date.now());
  const finishRef = reactExports.useRef({ onFinish, userAnswers, questions });
  finishRef.current = { onFinish, userAnswers, questions };
  const hasTimeLimitRef = reactExports.useRef(hasTimeLimit);
  const handleFinish = reactExports.useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1e3);
    const { onFinish: fin, userAnswers: ua, questions: qs } = finishRef.current;
    const correctCount = ua.filter((a) => {
      const q = qs.find((q2) => q2.id === a.questionId);
      return q && a.answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
    }).length;
    fin(correctCount, timeTaken, ua);
  }, []);
  reactExports.useEffect(() => {
    if (!hasTimeLimitRef.current) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null || t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          handleFinish();
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [handleFinish]);
  const currentQ = questions[currentIndex];
  const answered = userAnswers.find((a) => a.questionId === currentQ.id);
  const handleAnswer = (answer) => {
    if (answered) return;
    setUserAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === currentQ.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { questionId: currentQ.id, answer };
        return next;
      }
      return [...prev, { questionId: currentQ.id, answer }];
    });
  };
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFillAnswer("");
    } else {
      handleFinish();
    }
  };
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  const isLast = currentIndex === questions.length - 1;
  const progress = (currentIndex + 1) / questions.length * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Question ",
          currentIndex + 1,
          " of ",
          questions.length
        ] }),
        timeLeft !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `font-mono font-bold flex items-center gap-1 ${timeLeft < 60 ? "text-primary" : "text-foreground"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { size: 12 }),
              formatTime(timeLeft)
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-1.5 bg-muted" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.2 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-bold text-primary", children: currentIndex + 1 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-[10px] px-1.5 py-0 text-muted-foreground border-border",
                    children: currentQ.subject
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-[10px] px-1.5 py-0 ${currentQ.difficulty === "Easy" ? "text-emerald-400 border-emerald-500/30" : currentQ.difficulty === "Medium" ? "text-amber-400 border-amber-500/30" : "text-primary border-primary/30"}`,
                    children: currentQ.difficulty
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-foreground leading-relaxed", children: currentQ.questionText })
            ] })
          ] }),
          currentQ.questionType === "mcq" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: currentQ.options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleAnswer(opt),
              className: `w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-all ${(answered == null ? void 0 : answered.answer) === opt ? "bg-primary/20 border-primary/50 text-foreground" : "bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/50"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 ${(answered == null ? void 0 : answered.answer) === opt ? "bg-primary/30 border-primary text-primary" : "border-border"}`,
                    children: String.fromCharCode(65 + i)
                  }
                ),
                opt
              ]
            },
            `qopt-${i}-${opt}`
          )) }),
          currentQ.questionType === "truefalse" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: ["True", "False"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleAnswer(v),
              className: `flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${(answered == null ? void 0 : answered.answer) === v ? "bg-primary/20 border-primary/50 text-foreground" : "bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"}`,
              children: v
            },
            v
          )) }),
          currentQ.questionType === "fillin" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Type your answer...",
                value: fillAnswer,
                onChange: (e) => setFillAnswer(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && fillAnswer.trim()) {
                    handleAnswer(fillAnswer.trim());
                  }
                },
                className: "bg-muted/40 border-input text-sm"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                onClick: () => handleAnswer(fillAnswer.trim()),
                disabled: !fillAnswer.trim(),
                className: "text-xs h-7",
                children: "Submit Answer"
              }
            )
          ] })
        ] }) })
      },
      currentIndex
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-auto", children: [
        userAnswers.length,
        "/",
        questions.length,
        " answered"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleNext,
          disabled: !answered && currentQ.questionType !== "fillin",
          className: "gap-1.5 text-sm",
          children: isLast ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 14 }),
            "Submit Exam"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Next",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
          ] })
        }
      )
    ] })
  ] });
}
function ExamResults({
  questions,
  userAnswers,
  correctAnswers,
  timeTaken,
  config,
  onSave,
  onRetry
}) {
  const pct = Math.round(correctAnswers / questions.length * 100);
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;
  const subjectStats = reactExports.useMemo(() => {
    const map = {};
    for (const q of questions) {
      if (!map[q.subject]) map[q.subject] = { total: 0, correct: 0 };
      map[q.subject].total++;
      const ua = userAnswers.find((a) => a.questionId === q.id);
      if (ua && ua.answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        map[q.subject].correct++;
      }
    }
    return map;
  }, [questions, userAnswers]);
  const grade = pct >= 90 ? "Excellent!" : pct >= 75 ? "Great Job!" : pct >= 60 ? "Good Effort" : pct >= 40 ? "Keep Practicing" : "Needs Work";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { scale: 0.7, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring", duration: 0.6 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full border-4 border-primary/40 flex items-center justify-center mx-auto mb-4 bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-2xl font-bold text-primary leading-none", children: [
              pct,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: grade })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl font-semibold text-foreground mb-1", children: [
            correctAnswers,
            " / ",
            questions.length,
            " Correct"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Time: ",
            mins,
            "m ",
            secs,
            "s · Subject: ",
            config.subject,
            " · Difficulty:",
            " ",
            config.difficulty
          ] })
        ]
      }
    ) }) }),
    Object.keys(subjectStats).length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display font-semibold", children: "Subject Breakdown" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: Object.entries(subjectStats).map(([subj, stats]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: subj }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-muted-foreground", children: [
            stats.correct,
            "/",
            stats.total,
            " (",
            Math.round(stats.correct / stats.total * 100),
            "%)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Progress,
          {
            value: stats.correct / stats.total * 100,
            className: "h-1.5 bg-muted"
          }
        )
      ] }, subj)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display font-semibold", children: "Answer Review" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-80 overflow-y-auto pr-1", children: questions.map((q, i) => {
        const ua = userAnswers.find((a) => a.questionId === q.id);
        const isCorrect = ua && ua.answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `p-3 rounded-lg border text-sm ${isCorrect ? "border-emerald-500/30 bg-emerald-500/5" : "border-primary/30 bg-primary/5"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground mr-1.5 font-mono text-xs", children: [
                  "Q",
                  i + 1,
                  "."
                ] }),
                q.questionText.substring(0, 80),
                q.questionText.length > 80 ? "…" : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: isCorrect ? "text-emerald-400" : "text-primary",
                    children: [
                      isCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12, className: "inline mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12, className: "inline mr-1" }),
                      "Your: ",
                      (ua == null ? void 0 : ua.answer) || "—"
                    ]
                  }
                ),
                !isCorrect && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-400", children: [
                  "✓ Correct: ",
                  q.correctAnswer
                ] })
              ] })
            ]
          },
          String(q.id)
        );
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onSave, className: "flex-1 gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
        "Save Result"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: onRetry,
          variant: "outline",
          className: "flex-1 gap-1.5 border-border",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14 }),
            "Try Again"
          ]
        }
      )
    ] })
  ] });
}
function StartExamView() {
  const { data: allQuestions = [] } = useGetQuestions();
  const saveExamSession = useSaveExamSession();
  const [phase, setPhase] = reactExports.useState("config");
  const [config, setConfig] = reactExports.useState({
    subject: "All Subjects",
    numQuestions: 20,
    timeLimit: 30,
    difficulty: "All"
  });
  const [examQuestions, setExamQuestions] = reactExports.useState([]);
  const [examResults, setExamResults] = reactExports.useState(null);
  const startExam = () => {
    let pool = allQuestions;
    if (config.subject !== "All Subjects") {
      pool = pool.filter((q) => q.subject === config.subject);
    }
    if (config.difficulty !== "All") {
      pool = pool.filter((q) => q.difficulty === config.difficulty);
    }
    if (pool.length === 0) {
      ue.error(
        "No questions match your criteria. Add questions to the bank first."
      );
      return;
    }
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(
      0,
      Math.min(config.numQuestions, pool.length)
    );
    setExamQuestions(selected);
    setPhase("session");
  };
  const handleFinish = (correct, timeTaken, userAnswers) => {
    setExamResults({ correct, timeTaken, userAnswers });
    setPhase("results");
  };
  const handleSave = async () => {
    if (!examResults) return;
    try {
      await saveExamSession.mutateAsync({
        subject: config.subject,
        totalQuestions: examQuestions.length,
        correctAnswers: examResults.correct,
        timeTakenSeconds: examResults.timeTaken,
        difficulty: config.difficulty
      });
      ue.success("Exam result saved!");
    } catch {
      ue.error("Failed to save exam result");
    }
  };
  const handleRetry = () => {
    setPhase("config");
    setExamResults(null);
  };
  const poolSize = reactExports.useMemo(() => {
    let pool = allQuestions;
    if (config.subject !== "All Subjects") {
      pool = pool.filter((q) => q.subject === config.subject);
    }
    if (config.difficulty !== "All") {
      pool = pool.filter((q) => q.difficulty === config.difficulty);
    }
    return pool.length;
  }, [allQuestions, config.subject, config.difficulty]);
  if (phase === "session") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExamSessionView,
      {
        questions: examQuestions,
        config,
        onFinish: handleFinish
      }
    );
  }
  if (phase === "results" && examResults) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExamResults,
      {
        questions: examQuestions,
        userAnswers: examResults.userAnswers,
        correctAnswers: examResults.correct,
        timeTaken: examResults.timeTaken,
        config,
        onSave: handleSave,
        onRetry: handleRetry
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 16, className: "text-primary" }),
      "Configure Exam"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: config.subject,
            onValueChange: (v) => setConfig((c) => ({ ...c, subject: v })),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-muted/40 border-input", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All Subjects", children: "All Subjects" }),
                SUBJECTS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s))
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Difficulty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["All", ...DIFFICULTIES].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setConfig((c) => ({ ...c, difficulty: d })),
            className: `flex-1 text-xs py-2 rounded-md border transition-colors ${config.difficulty === d ? "bg-primary/20 border-primary/50 text-primary" : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"}`,
            children: d
          },
          d
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Number of Questions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono font-bold text-primary", children: config.numQuestions })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Slider,
          {
            min: 5,
            max: 50,
            step: 5,
            value: [config.numQuestions],
            onValueChange: ([v]) => setConfig((c) => ({ ...c, numQuestions: v })),
            className: "w-full"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "50" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Time Limit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono font-bold text-foreground", children: config.timeLimit === 0 ? "No Limit" : `${config.timeLimit} min` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Slider,
          {
            min: 0,
            max: 90,
            step: 5,
            value: [config.timeLimit],
            onValueChange: ([v]) => setConfig((c) => ({ ...c, timeLimit: v })),
            className: "w-full"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No limit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "90 min" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center gap-2 p-3 rounded-lg border text-xs ${poolSize > 0 ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" : "border-primary/30 bg-primary/5 text-primary"}`,
          children: [
            poolSize > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }),
            poolSize > 0 ? `${poolSize} questions available · Will use ${Math.min(config.numQuestions, poolSize)}` : "No questions match these criteria. Add questions first."
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: startExam,
          disabled: poolSize === 0,
          className: "w-full gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 16 }),
            "Start Exam"
          ]
        }
      )
    ] })
  ] }) });
}
function ExamHistoryView() {
  const { data: sessions = [], isLoading } = useGetExamSessions();
  const sorted = reactExports.useMemo(
    () => [...sessions].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    ),
    [sessions]
  );
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full bg-muted" }, i)) });
  }
  if (sorted.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 40, className: "text-muted-foreground/30 mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No exams taken yet. Start your first exam!" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: sorted.map((session, i) => {
    const pct = Math.round(
      Number(session.correctAnswers) / Number(session.totalQuestions) * 100
    );
    const mins = Math.floor(Number(session.timeTakenSeconds) / 60);
    const secs = Number(session.timeTakenSeconds) % 60;
    const date = new Date(session.completedAt).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.04 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-sm ${pct >= 75 ? "bg-emerald-500/15 text-emerald-400" : pct >= 50 ? "bg-amber-500/15 text-amber-400" : "bg-primary/15 text-primary"}`,
              children: [
                pct,
                "%"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm text-foreground", children: session.subject }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-[10px] px-1.5 py-0 ${session.difficulty === "Easy" ? "text-emerald-400 border-emerald-500/30" : session.difficulty === "Medium" ? "text-amber-400 border-amber-500/30" : session.difficulty === "All" ? "text-blue-400 border-blue-500/30" : "text-primary border-primary/30"}`,
                  children: session.difficulty
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11 }),
                String(session.correctAnswers),
                "/",
                String(session.totalQuestions),
                " correct"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
                mins,
                "m ",
                secs,
                "s"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: date })
            ] })
          ] })
        ] }) }) })
      },
      String(session.id)
    );
  }) }) });
}
function ExamTab() {
  const [view, setView] = reactExports.useState("bank");
  const [showStylePanel, setShowStylePanel] = reactExports.useState(false);
  const styleBtnRef = reactExports.useRef(null);
  const { style: sectionStyle } = useSectionStyle("exam");
  const viewConfig = {
    bank: { label: "Question Bank", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 14 }) },
    start: { label: "Start Exam", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 14 }) },
    history: { label: "Exam History", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 14 }) }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl mx-auto", style: sectionStyle, children: [
    showStylePanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionStylePanel,
      {
        sectionId: "exam",
        sectionLabel: "Exam",
        onClose: () => setShowStylePanel(false),
        anchorRef: styleBtnRef
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        className: "mb-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 16, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Exam Mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                ref: styleBtnRef,
                size: "sm",
                variant: "outline",
                className: "h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50",
                onClick: () => setShowStylePanel((p) => !p),
                title: "Customize section style",
                "data-ocid": "exam.style.button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 13 })
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground ml-11", children: "Build your question bank, take timed exams, and track your performance" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mb-6 p-1 bg-muted/30 rounded-lg border border-border w-fit", children: Object.keys(viewConfig).map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setView(v),
        className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === v ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`,
        children: [
          viewConfig[v].icon,
          viewConfig[v].label
        ]
      },
      v
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.15 },
        children: [
          view === "bank" && /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionBankView, {}),
          view === "start" && /* @__PURE__ */ jsxRuntimeExports.jsx(StartExamView, {}),
          view === "history" && /* @__PURE__ */ jsxRuntimeExports.jsx(ExamHistoryView, {})
        ]
      },
      view
    ) })
  ] });
}
export {
  ExamTab as default
};
