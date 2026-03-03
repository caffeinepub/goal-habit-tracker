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
export interface SectionTimeLog {
    date: string;
    section: Section;
    elapsedSeconds: bigint;
}
export interface MonthlyLogEntry {
    date: string;
    count: bigint;
}
export interface FileMetadata {
    id: bigint;
    blobUrl: string;
    mimeType: string;
    fileName: string;
    sizeBytes: bigint;
    uploadedAt: string;
}
export interface MockTestScore {
    totalMarks: bigint;
    subject: string;
    date: string;
    score: bigint;
}
export interface SubjectTarget {
    name: string;
    target: bigint;
}
export interface ExamSession {
    id: bigint;
    completedAt: string;
    subject: string;
    difficulty: string;
    timeTakenSeconds: bigint;
    totalQuestions: bigint;
    correctAnswers: bigint;
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
export interface NotebookEntry {
    id: bigint;
    title: string;
    content: string;
    subject: string;
    createdAt: string;
    updatedAt: string;
}
export interface NotepadEntry {
    id: bigint;
    content: string;
    subject: string;
    createdAt: string;
    updatedAt: string;
}
export interface StudySession {
    hours: number;
    subjectName: string;
    date: string;
}
export interface Question {
    id: bigint;
    subject: string;
    difficulty: string;
    createdAt: string;
    correctAnswer: string;
    questionText: string;
    questionType: string;
    options: Array<string>;
}
export interface Subject {
    id: bigint;
    days: Array<boolean>;
    name: string;
    description: string;
    isWeak: boolean;
}
export interface SectionPlanCycle {
    endDate: string;
    section: Section;
    summary: bigint;
    startDate: string;
}
export enum Section {
    studyplan = "studyplan",
    questions = "questions",
    dailyroutine = "dailyroutine"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMockScore(subject: string, score: bigint, totalMarks: bigint, date: string): Promise<void>;
    addNotebookEntry(subject: string, title: string, content: string, createdAt: string): Promise<void>;
    addNotepadEntry(subject: string, content: string, createdAt: string): Promise<void>;
    addQuestion(subject: string, questionText: string, questionType: string, options: Array<string>, correctAnswer: string, difficulty: string, createdAt: string): Promise<void>;
    addQuestions(subjectName: string, count: bigint): Promise<void>;
    addStudySession(subjectName: string, hours: number, date: string): Promise<void>;
    addSubject(name: string, description: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteFileMetadata(fileId: bigint): Promise<void>;
    deleteNotebookEntry(id: bigint): Promise<void>;
    deleteNotepadEntry(id: bigint): Promise<void>;
    deleteQuestion(id: bigint): Promise<void>;
    deleteSubject(subjectId: bigint): Promise<void>;
    getAllFileMetadata(): Promise<Array<FileMetadata>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomSubjects(): Promise<Array<string>>;
    getExamSessions(): Promise<Array<ExamSession>>;
    getMockScores(): Promise<Array<MockTestScore>>;
    getMonthlyLogs(): Promise<Array<MonthlyLogEntry>>;
    getNotebookEntries(): Promise<Array<NotebookEntry>>;
    getNotepadEntries(): Promise<Array<NotepadEntry>>;
    getPlanCycles(): Promise<Array<SectionPlanCycle>>;
    getQuestionProgress(): Promise<Array<SubjectQuestionProgress>>;
    getQuestions(): Promise<Array<Question>>;
    getQuestionsBySubject(subject: string): Promise<Array<Question>>;
    getSectionTimeLogs(): Promise<Array<SectionTimeLog>>;
    getStudySessions(): Promise<Array<StudySession>>;
    getSubjects(): Promise<Array<Subject>>;
    getTargets(): Promise<UserTargets>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveExamSession(subject: string, totalQuestions: bigint, correctAnswers: bigint, timeTakenSeconds: bigint, difficulty: string, completedAt: string): Promise<void>;
    saveFileMetadata(fileName: string, mimeType: string, sizeBytes: bigint, blobUrl: string, uploadedAt: string): Promise<bigint>;
    saveMonthlyLog(date: string, count: bigint): Promise<void>;
    savePlanCycle(section: Section, startDate: string, endDate: string, summary: bigint): Promise<void>;
    saveSectionTimeLog(section: Section, date: string, elapsedSeconds: bigint): Promise<void>;
    setCustomSubjects(subjects: Array<string>): Promise<void>;
    setQuestionCount(subjectName: string, count: bigint): Promise<void>;
    setStudySession(subjectName: string, hours: number, date: string): Promise<void>;
    setTargets(totalQuestionsGoal: bigint, dailyStudyHoursTarget: number, subjectTargets: Array<SubjectTarget>, planTotalDays: bigint): Promise<void>;
    toggleDay(subjectId: bigint, dayIndex: bigint): Promise<void>;
    updateNotebookEntry(id: bigint, title: string, content: string, updatedAt: string): Promise<void>;
    updateNotepadEntry(id: bigint, content: string, updatedAt: string): Promise<void>;
}
