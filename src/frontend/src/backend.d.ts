import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface MonthlyLogEntry {
    date: string;
    count: bigint;
}
export interface SubjectTarget {
    name: string;
    target: bigint;
}
export interface StudySession {
    hours: number;
    subjectName: string;
    date: string;
}
export interface Subject {
    id: bigint;
    days: Array<boolean>;
    name: string;
    description: string;
    isWeak: boolean;
}
export interface SubjectQuestionProgress {
    subjectName: string;
    count: bigint;
}
export interface UserTargets {
    dailyStudyHoursTarget: number;
    subjectTargets: Array<SubjectTarget>;
    planTotalDays: bigint;
    totalQuestionsGoal: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMockScore(score: bigint): Promise<void>;
    addQuestions(subjectName: string, count: bigint): Promise<void>;
    addStudySession(subjectName: string, hours: number, date: string): Promise<void>;
    addSubject(name: string, description: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteSubject(subjectId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMockScores(): Promise<Array<bigint>>;
    getMonthlyLogs(): Promise<Array<MonthlyLogEntry>>;
    getQuestionProgress(): Promise<Array<SubjectQuestionProgress>>;
    getStudySessions(): Promise<Array<StudySession>>;
    getSubjects(): Promise<Array<Subject>>;
    getTargets(): Promise<UserTargets>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveMonthlyLog(date: string, count: bigint): Promise<void>;
    setQuestionCount(subjectName: string, count: bigint): Promise<void>;
    setStudySession(subjectName: string, hours: number, date: string): Promise<void>;
    setTargets(totalQuestionsGoal: bigint, dailyStudyHoursTarget: number, subjectTargets: Array<SubjectTarget>, planTotalDays: bigint): Promise<void>;
    toggleDay(subjectId: bigint, dayIndex: bigint): Promise<void>;
}
