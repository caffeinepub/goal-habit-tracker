import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Subject } from "../backend.d";
import { useActor } from "./useActor";

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
  return useQuery<bigint[]>({
    queryKey: ["mockScores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMockScores();
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
      return actor.addMockScore(BigInt(score));
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
