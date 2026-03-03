import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  MockTestScore,
  Section,
  Subject,
  SubjectTarget,
  UserTargets,
} from "../backend.d";
import { useActor } from "./useActor";

const DEFAULT_TARGETS: UserTargets = {
  dailyStudyHoursTarget: 15,
  totalQuestionsGoal: BigInt(9000),
  planTotalDays: BigInt(30),
  subjectTargets: [
    { name: "Maths", target: BigInt(2000) },
    { name: "English", target: BigInt(2000) },
    { name: "Reasoning", target: BigInt(2000) },
    { name: "General Knowledge", target: BigInt(1500) },
    { name: "Current Affairs", target: BigInt(1000) },
    { name: "Computer", target: BigInt(500) },
    { name: "Science", target: BigInt(0) },
  ],
};

export { DEFAULT_TARGETS };

export function useGetTargets() {
  const { actor, isFetching } = useActor();
  return useQuery<UserTargets>({
    queryKey: ["targets"],
    queryFn: async () => {
      if (!actor) return DEFAULT_TARGETS;
      return actor.getTargets();
    },
    enabled: !!actor && !isFetching,
    placeholderData: DEFAULT_TARGETS,
  });
}

export function useSetTargets() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      totalQuestionsGoal,
      dailyStudyHoursTarget,
      subjectTargets,
      planTotalDays,
    }: {
      totalQuestionsGoal: number;
      dailyStudyHoursTarget: number;
      subjectTargets: Array<SubjectTarget>;
      planTotalDays: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.setTargets(
        BigInt(totalQuestionsGoal),
        dailyStudyHoursTarget,
        subjectTargets,
        BigInt(planTotalDays),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["targets"] });
    },
  });
}

export function useGetSubjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSubjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMockScores() {
  const { actor, isFetching } = useActor();
  return useQuery<MockTestScore[]>({
    queryKey: ["mockScores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMockScores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMockScoreFull() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subject,
      score,
      totalMarks,
      date,
    }: {
      subject: string;
      score: number;
      totalMarks: number;
      date: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addMockScore(
        subject,
        BigInt(score),
        BigInt(totalMarks),
        date,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mockScores"] });
    },
  });
}

export function useGetCustomSubjects() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["customSubjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomSubjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetCustomSubjects() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subjects: string[]) => {
      if (!actor) throw new Error("No actor");
      return actor.setCustomSubjects(subjects);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customSubjects"] });
    },
  });
}

export function useSaveSectionTimeLog() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      section,
      date,
      elapsedSeconds,
    }: {
      section: Section;
      date: string;
      elapsedSeconds: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.saveSectionTimeLog(section, date, BigInt(elapsedSeconds));
    },
  });
}

export function useGetSectionTimeLogs() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["sectionTimeLogs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSectionTimeLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePlanCycle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      section,
      startDate,
      endDate,
      summary,
    }: {
      section: Section;
      startDate: string;
      endDate: string;
      summary: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.savePlanCycle(section, startDate, endDate, BigInt(summary));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planCycles"] });
    },
  });
}

export function useGetPlanCycles() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["planCycles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlanCycles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSubject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addSubject(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useDeleteSubject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subjectId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteSubject(subjectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useToggleDay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subjectId,
      dayIndex,
    }: {
      subjectId: bigint;
      dayIndex: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.toggleDay(subjectId, BigInt(dayIndex));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useAddMockScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (score: number) => {
      if (!actor) throw new Error("No actor");
      const today = new Date().toISOString().split("T")[0];
      return actor.addMockScore("General", BigInt(score), BigInt(200), today);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mockScores"] });
    },
  });
}

// ---- Study Sessions ----

export function useGetStudySessions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["studySessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudySessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddStudySession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subjectName,
      hours,
      date,
    }: {
      subjectName: string;
      hours: number;
      date: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addStudySession(subjectName, hours, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studySessions"] });
    },
  });
}

// ---- Question Progress ----

export function useGetQuestionProgress() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["questionProgress"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuestionProgress();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddQuestions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subjectName,
      count,
    }: {
      subjectName: string;
      count: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addQuestions(subjectName, BigInt(count));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionProgress"] });
    },
  });
}

export function useSetQuestionCount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subjectName,
      count,
    }: {
      subjectName: string;
      count: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.setQuestionCount(subjectName, BigInt(count));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionProgress"] });
    },
  });
}

// ---- Monthly Logs ----

export function useGetMonthlyLogs() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["monthlyLogs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMonthlyLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveMonthlyLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      date,
      count,
    }: {
      date: string;
      count: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.saveMonthlyLog(date, BigInt(count));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthlyLogs"] });
    },
  });
}

// ---- Set Study Session (overwrite) ----

export function useSetStudySession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subjectName,
      hours,
      date,
    }: {
      subjectName: string;
      hours: number;
      date: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.setStudySession(subjectName, hours, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studySessions"] });
    },
  });
}

// ---- Question Bank ----

export function useGetQuestions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetQuestionsBySubject(subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["questions", subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuestionsBySubject(subject);
    },
    enabled: !!actor && !isFetching && subject !== "",
  });
}

export function useAddQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subject,
      questionText,
      questionType,
      options,
      correctAnswer,
      difficulty,
    }: {
      subject: string;
      questionText: string;
      questionType: string;
      options: string[];
      correctAnswer: string;
      difficulty: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addQuestion(
        subject,
        questionText,
        questionType,
        options,
        correctAnswer,
        difficulty,
        new Date().toISOString(),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useDeleteQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteQuestion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

// ---- Exam Sessions ----

export function useGetExamSessions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["examSessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExamSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveExamSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subject,
      totalQuestions,
      correctAnswers,
      timeTakenSeconds,
      difficulty,
    }: {
      subject: string;
      totalQuestions: number;
      correctAnswers: number;
      timeTakenSeconds: number;
      difficulty: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.saveExamSession(
        subject,
        BigInt(totalQuestions),
        BigInt(correctAnswers),
        BigInt(timeTakenSeconds),
        difficulty,
        new Date().toISOString(),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examSessions"] });
    },
  });
}

// ---- Notebook ----

export function useGetNotebookEntries() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notebookEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotebookEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddNotebookEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subject,
      title,
      content,
    }: {
      subject: string;
      title: string;
      content: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addNotebookEntry(
        subject,
        title,
        content,
        new Date().toISOString(),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebookEntries"] });
    },
  });
}

export function useUpdateNotebookEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
    }: {
      id: bigint;
      title: string;
      content: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateNotebookEntry(
        id,
        title,
        content,
        new Date().toISOString(),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebookEntries"] });
    },
  });
}

export function useDeleteNotebookEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteNotebookEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebookEntries"] });
    },
  });
}

// ---- Notepad ----

export function useGetNotepadEntries() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notepadEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotepadEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddNotepadEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subject,
      content,
    }: {
      subject: string;
      content: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addNotepadEntry(subject, content, new Date().toISOString());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notepadEntries"] });
    },
  });
}

export function useUpdateNotepadEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      content,
    }: {
      id: bigint;
      content: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateNotepadEntry(id, content, new Date().toISOString());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notepadEntries"] });
    },
  });
}

export function useDeleteNotepadEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteNotepadEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notepadEntries"] });
    },
  });
}
