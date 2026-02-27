import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { Goal, ProgressEntry } from "../backend.d";

export function useGetGoals() {
  const { actor, isFetching } = useActor();
  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGoals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProgressEntries(goalId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<ProgressEntry[]>({
    queryKey: ["progressEntries", goalId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProgressEntries(goalId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEntriesForGoal(goalId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["entriesForGoal", goalId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEntriesForGoal(goalId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCompletionCount(goalId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["completionCount", goalId.toString()],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCompletionCount(goalId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCompleted(goalId: bigint, date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCompleted", goalId.toString(), date],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCompleted(goalId, date);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      targetCount,
    }: {
      title: string;
      description: string;
      targetCount: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createGoal(title, description, BigInt(targetCount));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useUpdateGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      goalId,
      title,
      description,
      targetCount,
    }: {
      goalId: bigint;
      title: string;
      description: string;
      targetCount: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateGoal(goalId, title, description, BigInt(targetCount));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useDeleteGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goalId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteGoal(goalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useLogCompletion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ goalId, date }: { goalId: bigint; date: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.logCompletion(goalId, date);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["isCompleted", variables.goalId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["completionCount", variables.goalId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["progressEntries", variables.goalId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["entriesForGoal", variables.goalId.toString()],
      });
    },
  });
}
