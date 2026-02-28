import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StudySession {
    hours: number;
    subjectName: string;
    date: string;
}
export interface SubjectQuestionProgress {
    subjectName: string;
    count: bigint;
}
export interface Subject {
    id: bigint;
    days: Array<boolean>;
    name: string;
    description: string;
    isWeak: boolean;
}
export interface backendInterface {
    addMockScore(score: bigint): Promise<void>;
    addQuestions(subjectName: string, count: bigint): Promise<void>;
    addStudySession(subjectName: string, hours: number, date: string): Promise<void>;
    addSubject(name: string, description: string): Promise<void>;
    deleteSubject(subjectId: bigint): Promise<void>;
    getMockScores(): Promise<Array<bigint>>;
    getQuestionProgress(): Promise<Array<SubjectQuestionProgress>>;
    getStudySessions(): Promise<Array<StudySession>>;
    getSubjects(): Promise<Array<Subject>>;
    toggleDay(subjectId: bigint, dayIndex: bigint): Promise<void>;
}
