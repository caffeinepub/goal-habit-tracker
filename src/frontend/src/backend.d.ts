import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Subject {
    id: bigint;
    days: Array<boolean>;
    name: string;
    description: string;
    isWeak: boolean;
}
export interface backendInterface {
    addMockScore(score: bigint): Promise<void>;
    addSubject(name: string, description: string): Promise<void>;
    deleteSubject(subjectId: bigint): Promise<void>;
    getMockScores(): Promise<Array<bigint>>;
    getSubjects(): Promise<Array<Subject>>;
    toggleDay(subjectId: bigint, dayIndex: bigint): Promise<void>;
}
