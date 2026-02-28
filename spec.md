# SSC CGL Ultimate Tracker

## Current State
- Full-stack app with Motoko backend and React frontend
- Features: 30-day subject habit grid, weak topic detection, score predictor, auto timetable, Pomodoro timer, analytics with mock score history
- Backend APIs: addSubject, deleteSubject, toggleDay, addMockScore, getMockScores, getSubjects
- Tabs: Home (dashboard + subject cards), Add Subject, Analytics, Pomodoro Timer
- Sidebar shows overall progress

## Requested Changes (Diff)

### Add
1. **15 Hours Study Plan tab** -- A dedicated tab to track daily 15-hour study sessions
   - Visual breakdown of 15 hours across subjects/slots
   - Ability to log hours spent per subject per day
   - Progress bar showing today's hours vs 15-hour target
   - Weekly hours chart
   - Backend: addStudySession(subjectName, hours, date), getStudySessions() -> Array<StudySession>

2. **9000 Questions Progress tab** -- A tracker for solving 9000 practice questions
   - Shows total questions solved out of 9000
   - Subject-wise breakdown (e.g. Maths, English, Reasoning, GK) with individual targets
   - Ability to log questions solved per subject
   - Large visual progress indicator (circular or bar) showing overall % toward 9000
   - Milestones (e.g. 1000, 2500, 5000, 7500, 9000) with celebration states
   - Backend: addQuestions(subjectName, count), getQuestionProgress() -> Array<QuestionProgress>

### Modify
- App.tsx: Add two new tab IDs: "studyplan" and "questions"
- Sidebar.tsx: Add nav items for "Study Plan" and "Questions" tabs
- backend.d.ts: Add new types and API methods for study sessions and question progress

### Remove
- Nothing removed

## Implementation Plan
1. Update Motoko backend to add StudySession and QuestionProgress data models and CRUD functions
2. Update backend.d.ts with new types
3. Create StudyPlanTab.tsx component with 15-hour daily tracker and weekly chart
4. Create QuestionsTab.tsx component with 9000 question progress tracker, subject breakdowns, milestones
5. Update App.tsx to add new tabs and wire data
6. Update Sidebar.tsx to add new nav items
7. Add React Query hooks for new backend calls
