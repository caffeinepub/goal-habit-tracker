import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProgressEntry {
    date: string;
    count: bigint;
}
export interface Goal {
    id: bigint;
    title: string;
    description: string;
    targetCount: bigint;
}
export interface backendInterface {
    createGoal(title: string, description: string, targetCount: bigint): Promise<Goal>;
    deleteGoal(goalId: bigint): Promise<void>;
    getCompletionCount(goalId: bigint): Promise<bigint>;
    getEntriesForGoal(goalId: bigint): Promise<Array<string>>;
    getGoals(): Promise<Array<Goal>>;
    getProgressEntries(goalId: bigint): Promise<Array<ProgressEntry>>;
    isCompleted(goalId: bigint, date: string): Promise<boolean>;
    logCompletion(goalId: bigint, date: string): Promise<void>;
    updateGoal(goalId: bigint, title: string, description: string, targetCount: bigint): Promise<void>;
}
