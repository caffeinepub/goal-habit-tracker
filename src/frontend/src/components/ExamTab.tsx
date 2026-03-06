import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileQuestion,
  Filter,
  GraduationCap,
  History,
  Loader2,
  Palette,
  Plus,
  RefreshCw,
  Save,
  Search,
  Target,
  Timer,
  Trash2,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { ExamSession as ExamSessionData, Question } from "../backend.d";
import {
  useAddQuestion,
  useDeleteQuestion,
  useGetExamSessions,
  useGetQuestions,
  useSaveExamSession,
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

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

type QuestionType = "mcq" | "truefalse" | "fillin";
type ExamView = "bank" | "start" | "history";
type ExamPhase = "config" | "session" | "results";

interface ExamConfig {
  subject: string;
  numQuestions: number;
  timeLimit: number; // 0 = no limit
  difficulty: string;
}

interface UserAnswer {
  questionId: bigint;
  answer: string;
}

// ── Auto-generate questions from pasted text ────────────────────────────────
function generateQuestionsFromText(
  text: string,
  subject: string,
): {
  questionText: string;
  questionType: QuestionType;
  options: string[];
  correctAnswer: string;
  difficulty: string;
}[] {
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30 && s.split(" ").length >= 5);

  const results: {
    questionText: string;
    questionType: QuestionType;
    options: string[];
    correctAnswer: string;
    difficulty: string;
  }[] = [];

  for (let i = 0; i < Math.min(sentences.length, 10); i++) {
    const sentence = sentences[i];
    const words = sentence.split(" ").filter((w) => w.length > 3);
    if (words.length < 4) continue;

    // Pick a key word/phrase to turn into a fill-in-the-blank or MCQ
    const keyWordIndex = Math.floor(words.length * 0.6);
    const keyWord = words[keyWordIndex].replace(/[^a-zA-Z0-9 ]/g, "");
    if (!keyWord) continue;

    const questionText = `Which of the following best completes: "${sentence.replace(keyWord, "______")}"?`;
    const dummyOptions = [
      "None of the above",
      words[Math.floor(words.length * 0.2)]?.replace(/[^a-zA-Z0-9 ]/g, "") ||
        "Option B",
      words[Math.floor(words.length * 0.4)]?.replace(/[^a-zA-Z0-9 ]/g, "") ||
        "Option C",
    ].filter((o) => o && o !== keyWord);

    const options = [keyWord, ...dummyOptions.slice(0, 3)].sort(
      () => Math.random() - 0.5,
    );

    results.push({
      questionText,
      questionType: "mcq",
      options: options.slice(0, 4),
      correctAnswer: keyWord,
      difficulty: i < 3 ? "Easy" : i < 7 ? "Medium" : "Hard",
    });
  }

  // Add a couple true/false questions
  for (let i = 0; i < Math.min(3, sentences.length); i++) {
    const sentence = sentences[i];
    results.push({
      questionText: `True or False: "${sentence.substring(0, 100)}"`,
      questionType: "truefalse",
      options: ["True", "False"],
      correctAnswer: "True",
      difficulty: "Easy",
    });
  }

  void subject; // used in caller
  return results.slice(0, 15);
}

// ── Question Card ────────────────────────────────────────────────────────────
function QuestionCard({
  question,
  onDelete,
}: {
  question: Question;
  onDelete: (id: bigint) => void;
}) {
  const typeColor =
    question.questionType === "mcq"
      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
      : question.questionType === "truefalse"
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
        : "bg-amber-500/10 text-amber-400 border-amber-500/30";

  const diffColor =
    question.difficulty === "Easy"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : question.difficulty === "Medium"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
        : "bg-primary/10 text-primary border-primary/30";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="p-3 rounded-lg border border-border bg-card/50 group"
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground line-clamp-2 mb-2">
            {question.questionText}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 ${typeColor}`}
            >
              {question.questionType === "mcq"
                ? "MCQ"
                : question.questionType === "truefalse"
                  ? "T/F"
                  : "Fill-in"}
            </Badge>
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 ${diffColor}`}
            >
              {question.difficulty}
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 text-muted-foreground border-border"
            >
              {question.subject}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(question.id)}
        >
          <Trash2 size={12} />
        </Button>
      </div>
    </motion.div>
  );
}

// ── Add Question Form ────────────────────────────────────────────────────────
function AddQuestionForm() {
  const addQuestion = useAddQuestion();
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [questionType, setQuestionType] = useState<QuestionType>("mcq");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [generateText, setGenerateText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    if (!questionText.trim() || !correctAnswer.trim()) {
      toast.error("Question text and correct answer are required");
      return;
    }

    const finalOptions =
      questionType === "mcq"
        ? options.filter((o) => o.trim())
        : questionType === "truefalse"
          ? ["True", "False"]
          : [];

    try {
      await addQuestion.mutateAsync({
        subject,
        questionText: questionText.trim(),
        questionType,
        options: finalOptions,
        correctAnswer: correctAnswer.trim(),
        difficulty,
      });
      toast.success("Question added to bank");
      setQuestionText("");
      setCorrectAnswer("");
      setOptions(["", "", "", ""]);
    } catch {
      toast.error("Failed to add question");
    }
  };

  const handleAutoGenerate = async () => {
    if (!generateText.trim()) {
      toast.error("Paste some textbook content first");
      return;
    }
    setIsGenerating(true);
    try {
      const generated = generateQuestionsFromText(generateText, subject);
      if (generated.length === 0) {
        toast.error("Could not extract questions from the text");
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
            difficulty: q.difficulty,
          });
          successCount++;
        } catch {
          // continue
        }
      }
      toast.success(`Generated ${successCount} questions from your text!`);
      setGenerateText("");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Manual Add */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm font-semibold flex items-center gap-2">
            <Plus size={14} className="text-primary" />
            Add Question Manually
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Subject
              </Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="bg-muted/40 border-input h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Type
              </Label>
              <Select
                value={questionType}
                onValueChange={(v) => setQuestionType(v as QuestionType)}
              >
                <SelectTrigger className="bg-muted/40 border-input h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">MCQ</SelectItem>
                  <SelectItem value="truefalse">True / False</SelectItem>
                  <SelectItem value="fillin">Fill in Blank</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Difficulty
            </Label>
            <div className="flex gap-1.5">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 text-xs py-1.5 rounded-md border transition-colors ${
                    difficulty === d
                      ? d === "Easy"
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : d === "Medium"
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                          : "bg-primary/20 border-primary/50 text-primary"
                      : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Question
            </Label>
            <Textarea
              placeholder="Enter your question..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="bg-muted/40 border-input text-sm min-h-[80px] resize-none"
            />
          </div>

          {questionType === "mcq" && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Options (A/B/C/D)
              </Label>
              {options.map((opt, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: options are positional (A/B/C/D) and always 4
                <div key={`option-${i}`} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground w-4">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <Input
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    value={opt}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = e.target.value;
                      setOptions(next);
                    }}
                    className="bg-muted/40 border-input h-8 text-xs"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Correct Answer
            </Label>
            {questionType === "truefalse" ? (
              <div className="flex gap-2">
                {["True", "False"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setCorrectAnswer(v)}
                    className={`flex-1 text-xs py-2 rounded-md border transition-colors ${
                      correctAnswer === v
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            ) : (
              <Input
                placeholder="Correct answer..."
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="bg-muted/40 border-input h-8 text-xs"
              />
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={addQuestion.isPending}
            className="w-full h-8 text-xs"
          >
            {addQuestion.isPending ? (
              <Loader2 size={12} className="animate-spin mr-1.5" />
            ) : (
              <Plus size={12} className="mr-1.5" />
            )}
            Add Question
          </Button>
        </CardContent>
      </Card>

      {/* Auto-Generate */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm font-semibold flex items-center gap-2">
            <Zap size={14} className="text-amber-400" />
            Auto-Generate from Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Paste textbook content and we'll generate MCQ and True/False
            questions automatically.
          </p>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Subject for Generated Questions
            </Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="bg-muted/40 border-input h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Paste Textbook Content
            </Label>
            <Textarea
              placeholder="Paste your textbook paragraphs or chapter content here..."
              value={generateText}
              onChange={(e) => setGenerateText(e.target.value)}
              className="bg-muted/40 border-input text-xs min-h-[180px] resize-none leading-relaxed"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400/80">
            <p className="font-medium mb-0.5">How it works:</p>
            <p className="text-amber-400/60 leading-relaxed">
              The app analyzes your text and creates up to 15 questions (MCQ +
              True/False). Review and delete any you don't want.
            </p>
          </div>

          <Button
            onClick={handleAutoGenerate}
            disabled={isGenerating || !generateText.trim()}
            variant="outline"
            className="w-full h-8 text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
          >
            {isGenerating ? (
              <Loader2 size={12} className="animate-spin mr-1.5" />
            ) : (
              <Zap size={12} className="mr-1.5" />
            )}
            Generate Questions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Question Bank View ────────────────────────────────────────────────────────
function QuestionBankView() {
  const { data: questions = [], isLoading } = useGetQuestions();
  const deleteQuestion = useDeleteQuestion();
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterDiff, setFilterDiff] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = useMemo(() => {
    return (questions as Question[]).filter((q) => {
      if (filterSubject !== "all" && q.subject !== filterSubject) return false;
      if (filterDiff !== "all" && q.difficulty !== filterDiff) return false;
      if (filterType !== "all" && q.questionType !== filterType) return false;
      if (
        search &&
        !q.questionText.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [questions, filterSubject, filterDiff, filterType, search]);

  const handleDelete = async (id: bigint) => {
    try {
      await deleteQuestion.mutateAsync(id);
      toast.success("Question deleted");
    } catch {
      toast.error("Failed to delete question");
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Form Toggle */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => setShowAddForm((v) => !v)}
          className="h-8 text-xs gap-1.5"
        >
          {showAddForm ? <X size={12} /> : <Plus size={12} />}
          {showAddForm ? "Hide Form" : "Add Questions"}
        </Button>
        <span className="text-xs text-muted-foreground ml-auto">
          {(questions as Question[]).length} questions in bank
        </span>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <AddQuestionForm />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-8 text-xs bg-muted/40 border-input"
          />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-36 h-8 text-xs bg-muted/40 border-input">
            <Filter size={10} className="mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {SUBJECTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterDiff} onValueChange={setFilterDiff}>
          <SelectTrigger className="w-28 h-8 text-xs bg-muted/40 border-input">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-28 h-8 text-xs bg-muted/40 border-input">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="mcq">MCQ</SelectItem>
            <SelectItem value="truefalse">True/False</SelectItem>
            <SelectItem value="fillin">Fill-in</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Question List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <FileQuestion size={36} className="text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            {(questions as Question[]).length === 0
              ? "No questions yet. Add your first question above."
              : "No questions match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((q) => (
              <QuestionCard
                key={String(q.id)}
                question={q}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Exam Session Component ───────────────────────────────────────────────────
function ExamSessionView({
  questions,
  config,
  onFinish,
}: {
  questions: Question[];
  config: ExamConfig;
  onFinish: (
    correctAnswers: number,
    timeTaken: number,
    userAnswers: UserAnswer[],
  ) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [fillAnswer, setFillAnswer] = useState("");
  const hasTimeLimit = config.timeLimit > 0;
  const initialTime = hasTimeLimit ? config.timeLimit * 60 : null;
  const [timeLeft, setTimeLeft] = useState<number | null>(initialTime);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());
  // Use a ref to access onFinish/userAnswers/questions in timer callback without stale closure issues
  const finishRef = useRef({ onFinish, userAnswers, questions });
  finishRef.current = { onFinish, userAnswers, questions };
  // Store whether timer is enabled
  const hasTimeLimitRef = useRef(hasTimeLimit);

  const handleFinish = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const { onFinish: fin, userAnswers: ua, questions: qs } = finishRef.current;
    const correctCount = ua.filter((a) => {
      const q = qs.find((q) => q.id === a.questionId);
      return (
        q &&
        a.answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
      );
    }).length;
    fin(correctCount, timeTaken, ua);
  }, []);

  // Start countdown timer on mount (only if time limit is enabled)
  useEffect(() => {
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
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [handleFinish]);

  const currentQ = questions[currentIndex];
  const answered = userAnswers.find((a) => a.questionId === currentQ.id);

  const handleAnswer = (answer: string) => {
    if (answered) return; // already answered
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isLast = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            {timeLeft !== null && (
              <span
                className={`font-mono font-bold flex items-center gap-1 ${timeLeft < 60 ? "text-primary" : "text-foreground"}`}
              >
                <Timer size={12} />
                {formatTime(timeLeft)}
              </span>
            )}
          </div>
          <Progress value={progress} className="h-1.5 bg-muted" />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-border mb-4">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-mono font-bold text-primary">
                    {currentIndex + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 text-muted-foreground border-border"
                    >
                      {currentQ.subject}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${
                        currentQ.difficulty === "Easy"
                          ? "text-emerald-400 border-emerald-500/30"
                          : currentQ.difficulty === "Medium"
                            ? "text-amber-400 border-amber-500/30"
                            : "text-primary border-primary/30"
                      }`}
                    >
                      {currentQ.difficulty}
                    </Badge>
                  </div>
                  <p className="text-base text-foreground leading-relaxed">
                    {currentQ.questionText}
                  </p>
                </div>
              </div>

              {/* Answer Options */}
              {currentQ.questionType === "mcq" && (
                <div className="space-y-2">
                  {currentQ.options.map((opt, i) => (
                    <button
                      key={`qopt-${i}-${opt}`}
                      type="button"
                      onClick={() => handleAnswer(opt)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-all ${
                        answered?.answer === opt
                          ? "bg-primary/20 border-primary/50 text-foreground"
                          : "bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/50"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 ${
                          answered?.answer === opt
                            ? "bg-primary/30 border-primary text-primary"
                            : "border-border"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {currentQ.questionType === "truefalse" && (
                <div className="flex gap-3">
                  {["True", "False"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleAnswer(v)}
                      className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${
                        answered?.answer === v
                          ? "bg-primary/20 border-primary/50 text-foreground"
                          : "bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}

              {currentQ.questionType === "fillin" && (
                <div className="space-y-2">
                  <Input
                    placeholder="Type your answer..."
                    value={fillAnswer}
                    onChange={(e) => setFillAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && fillAnswer.trim()) {
                        handleAnswer(fillAnswer.trim());
                      }
                    }}
                    className="bg-muted/40 border-input text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAnswer(fillAnswer.trim())}
                    disabled={!fillAnswer.trim()}
                    className="text-xs h-7"
                  >
                    Submit Answer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground ml-auto">
          {userAnswers.length}/{questions.length} answered
        </span>
        <Button
          onClick={handleNext}
          disabled={!answered && currentQ.questionType !== "fillin"}
          className="gap-1.5 text-sm"
        >
          {isLast ? (
            <>
              <Trophy size={14} />
              Submit Exam
            </>
          ) : (
            <>
              Next
              <ChevronRight size={14} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ── Exam Results View ────────────────────────────────────────────────────────
function ExamResults({
  questions,
  userAnswers,
  correctAnswers,
  timeTaken,
  config,
  onSave,
  onRetry,
}: {
  questions: Question[];
  userAnswers: UserAnswer[];
  correctAnswers: number;
  timeTaken: number;
  config: ExamConfig;
  onSave: () => void;
  onRetry: () => void;
}) {
  const pct = Math.round((correctAnswers / questions.length) * 100);
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;

  // Subject-wise breakdown
  const subjectStats = useMemo(() => {
    const map: Record<string, { total: number; correct: number }> = {};
    for (const q of questions) {
      if (!map[q.subject]) map[q.subject] = { total: 0, correct: 0 };
      map[q.subject].total++;
      const ua = userAnswers.find((a) => a.questionId === q.id);
      if (
        ua &&
        ua.answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
      ) {
        map[q.subject].correct++;
      }
    }
    return map;
  }, [questions, userAnswers]);

  const grade =
    pct >= 90
      ? "Excellent!"
      : pct >= 75
        ? "Great Job!"
        : pct >= 60
          ? "Good Effort"
          : pct >= 40
            ? "Keep Practicing"
            : "Needs Work";

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Score Hero */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-6 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <div className="w-24 h-24 rounded-full border-4 border-primary/40 flex items-center justify-center mx-auto mb-4 bg-primary/10">
              <div>
                <p className="font-display text-2xl font-bold text-primary leading-none">
                  {pct}%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{grade}</p>
              </div>
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-1">
              {correctAnswers} / {questions.length} Correct
            </h3>
            <p className="text-sm text-muted-foreground">
              Time: {mins}m {secs}s · Subject: {config.subject} · Difficulty:{" "}
              {config.difficulty}
            </p>
          </motion.div>
        </CardContent>
      </Card>

      {/* Subject Breakdown */}
      {Object.keys(subjectStats).length > 1 && (
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display font-semibold">
              Subject Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(subjectStats).map(([subj, stats]) => (
              <div key={subj}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground">{subj}</span>
                  <span className="font-mono text-muted-foreground">
                    {stats.correct}/{stats.total} (
                    {Math.round((stats.correct / stats.total) * 100)}%)
                  </span>
                </div>
                <Progress
                  value={(stats.correct / stats.total) * 100}
                  className="h-1.5 bg-muted"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Review Questions */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display font-semibold">
            Answer Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {questions.map((q, i) => {
              const ua = userAnswers.find((a) => a.questionId === q.id);
              const isCorrect =
                ua &&
                ua.answer.toLowerCase().trim() ===
                  q.correctAnswer.toLowerCase().trim();
              return (
                <div
                  key={String(q.id)}
                  className={`p-3 rounded-lg border text-sm ${
                    isCorrect
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-primary/30 bg-primary/5"
                  }`}
                >
                  <p className="text-foreground mb-1">
                    <span className="text-muted-foreground mr-1.5 font-mono text-xs">
                      Q{i + 1}.
                    </span>
                    {q.questionText.substring(0, 80)}
                    {q.questionText.length > 80 ? "…" : ""}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={
                        isCorrect ? "text-emerald-400" : "text-primary"
                      }
                    >
                      {isCorrect ? (
                        <CheckCircle2 size={12} className="inline mr-1" />
                      ) : (
                        <X size={12} className="inline mr-1" />
                      )}
                      Your: {ua?.answer || "—"}
                    </span>
                    {!isCorrect && (
                      <span className="text-emerald-400">
                        ✓ Correct: {q.correctAnswer}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={onSave} className="flex-1 gap-1.5">
          <Save size={14} />
          Save Result
        </Button>
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex-1 gap-1.5 border-border"
        >
          <RefreshCw size={14} />
          Try Again
        </Button>
      </div>
    </div>
  );
}

// ── Start Exam View ───────────────────────────────────────────────────────────
function StartExamView() {
  const { data: allQuestions = [] } = useGetQuestions();
  const saveExamSession = useSaveExamSession();
  const [phase, setPhase] = useState<ExamPhase>("config");
  const [config, setConfig] = useState<ExamConfig>({
    subject: "All Subjects",
    numQuestions: 20,
    timeLimit: 30,
    difficulty: "All",
  });
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examResults, setExamResults] = useState<{
    correct: number;
    timeTaken: number;
    userAnswers: UserAnswer[];
  } | null>(null);

  const startExam = () => {
    let pool = allQuestions as Question[];
    if (config.subject !== "All Subjects") {
      pool = pool.filter((q) => q.subject === config.subject);
    }
    if (config.difficulty !== "All") {
      pool = pool.filter((q) => q.difficulty === config.difficulty);
    }
    if (pool.length === 0) {
      toast.error(
        "No questions match your criteria. Add questions to the bank first.",
      );
      return;
    }

    // Shuffle and pick
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(
      0,
      Math.min(config.numQuestions, pool.length),
    );
    setExamQuestions(selected);
    setPhase("session");
  };

  const handleFinish = (
    correct: number,
    timeTaken: number,
    userAnswers: UserAnswer[],
  ) => {
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
        difficulty: config.difficulty,
      });
      toast.success("Exam result saved!");
    } catch {
      toast.error("Failed to save exam result");
    }
  };

  const handleRetry = () => {
    setPhase("config");
    setExamResults(null);
  };

  // Always compute poolSize (hooks must be called unconditionally)
  const poolSize = useMemo(() => {
    let pool = allQuestions as Question[];
    if (config.subject !== "All Subjects") {
      pool = pool.filter((q) => q.subject === config.subject);
    }
    if (config.difficulty !== "All") {
      pool = pool.filter((q) => q.difficulty === config.difficulty);
    }
    return pool.length;
  }, [allQuestions, config.subject, config.difficulty]);

  if (phase === "session") {
    return (
      <ExamSessionView
        questions={examQuestions}
        config={config}
        onFinish={handleFinish}
      />
    );
  }

  if (phase === "results" && examResults) {
    return (
      <ExamResults
        questions={examQuestions}
        userAnswers={examResults.userAnswers}
        correctAnswers={examResults.correct}
        timeTaken={examResults.timeTaken}
        config={config}
        onSave={handleSave}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
            <Target size={16} className="text-primary" />
            Configure Exam
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Subject */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Subject
            </Label>
            <Select
              value={config.subject}
              onValueChange={(v) => setConfig((c) => ({ ...c, subject: v }))}
            >
              <SelectTrigger className="bg-muted/40 border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Subjects">All Subjects</SelectItem>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Difficulty
            </Label>
            <div className="flex gap-2">
              {["All", ...DIFFICULTIES].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setConfig((c) => ({ ...c, difficulty: d }))}
                  className={`flex-1 text-xs py-2 rounded-md border transition-colors ${
                    config.difficulty === d
                      ? "bg-primary/20 border-primary/50 text-primary"
                      : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Number of Questions
              </Label>
              <span className="text-sm font-mono font-bold text-primary">
                {config.numQuestions}
              </span>
            </div>
            <Slider
              min={5}
              max={50}
              step={5}
              value={[config.numQuestions]}
              onValueChange={([v]) =>
                setConfig((c) => ({ ...c, numQuestions: v }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>5</span>
              <span>50</span>
            </div>
          </div>

          {/* Time Limit */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Time Limit
              </Label>
              <span className="text-sm font-mono font-bold text-foreground">
                {config.timeLimit === 0
                  ? "No Limit"
                  : `${config.timeLimit} min`}
              </span>
            </div>
            <Slider
              min={0}
              max={90}
              step={5}
              value={[config.timeLimit]}
              onValueChange={([v]) =>
                setConfig((c) => ({ ...c, timeLimit: v }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>No limit</span>
              <span>90 min</span>
            </div>
          </div>

          {/* Pool info */}
          <div
            className={`flex items-center gap-2 p-3 rounded-lg border text-xs ${
              poolSize > 0
                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                : "border-primary/30 bg-primary/5 text-primary"
            }`}
          >
            {poolSize > 0 ? (
              <CheckCircle2 size={14} />
            ) : (
              <AlertCircle size={14} />
            )}
            {poolSize > 0
              ? `${poolSize} questions available · Will use ${Math.min(config.numQuestions, poolSize)}`
              : "No questions match these criteria. Add questions first."}
          </div>

          <Button
            onClick={startExam}
            disabled={poolSize === 0}
            className="w-full gap-2"
          >
            <GraduationCap size={16} />
            Start Exam
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Exam History View ────────────────────────────────────────────────────────
function ExamHistoryView() {
  const { data: sessions = [], isLoading } = useGetExamSessions();

  const sorted = useMemo(
    () =>
      [...(sessions as ExamSessionData[])].sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
      ),
    [sessions],
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full bg-muted" />
        ))}
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <History size={40} className="text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">
          No exams taken yet. Start your first exam!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {sorted.map((session, i) => {
          const pct = Math.round(
            (Number(session.correctAnswers) / Number(session.totalQuestions)) *
              100,
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
              minute: "2-digit",
            },
          );

          return (
            <motion.div
              key={String(session.id)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-sm ${
                        pct >= 75
                          ? "bg-emerald-500/15 text-emerald-400"
                          : pct >= 50
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-primary/15 text-primary"
                      }`}
                    >
                      {pct}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground">
                          {session.subject}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${
                            session.difficulty === "Easy"
                              ? "text-emerald-400 border-emerald-500/30"
                              : session.difficulty === "Medium"
                                ? "text-amber-400 border-amber-500/30"
                                : session.difficulty === "All"
                                  ? "text-blue-400 border-blue-500/30"
                                  : "text-primary border-primary/30"
                          }`}
                        >
                          {session.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={11} />
                          {String(session.correctAnswers)}/
                          {String(session.totalQuestions)} correct
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {mins}m {secs}s
                        </span>
                        <span>{date}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ── Main ExamTab ─────────────────────────────────────────────────────────────
export default function ExamTab() {
  const [view, setView] = useState<ExamView>("bank");
  const [showStylePanel, setShowStylePanel] = useState(false);
  const styleBtnRef = useRef<HTMLButtonElement>(null);
  const { style: sectionStyle } = useSectionStyle("exam");

  const viewConfig: Record<ExamView, { label: string; icon: React.ReactNode }> =
    {
      bank: { label: "Question Bank", icon: <BookOpen size={14} /> },
      start: { label: "Start Exam", icon: <GraduationCap size={14} /> },
      history: { label: "Exam History", icon: <History size={14} /> },
    };

  return (
    <div className="p-6 max-w-4xl mx-auto" style={sectionStyle}>
      {/* Section Style Panel */}
      {showStylePanel && (
        <SectionStylePanel
          sectionId="exam"
          sectionLabel="Exam"
          onClose={() => setShowStylePanel(false)}
          anchorRef={styleBtnRef as React.RefObject<HTMLElement | null>}
        />
      )}
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <GraduationCap size={16} className="text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Exam Mode
          </h2>
          <div className="ml-auto">
            <Button
              ref={styleBtnRef}
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50"
              onClick={() => setShowStylePanel((p) => !p)}
              title="Customize section style"
              data-ocid="exam.style.button"
            >
              <Palette size={13} />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground ml-11">
          Build your question bank, take timed exams, and track your performance
        </p>
      </motion.div>

      {/* Sub-navigation */}
      <div className="flex gap-1 mb-6 p-1 bg-muted/30 rounded-lg border border-border w-fit">
        {(Object.keys(viewConfig) as ExamView[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              view === v
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {viewConfig[v].icon}
            {viewConfig[v].label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {view === "bank" && <QuestionBankView />}
          {view === "start" && <StartExamView />}
          {view === "history" && <ExamHistoryView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
