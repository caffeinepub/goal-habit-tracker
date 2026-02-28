# SSC CGL Ultimate Tracker

## Current State
The app has a Questions tab that tracks 9000-question challenge progress by subject (Maths 2000, English 2000, Reasoning 2000, GK 1500, Current Affairs 1000, Computer 500). It shows overall circular progress, milestones, a log form, and a subject breakdown. Backend stores per-subject cumulative question counts. No monthly planning or month-by-month tracking exists.

## Requested Changes (Diff)

### Add
- Monthly Plan section in QuestionsTab: A 12-month plan showing how 9000 questions are distributed across months (750/month), with per-month target and progress tracking
- Backend: store monthly question logs with year+month+count so monthly progress can be retrieved per month
- Monthly progress bar cards (Jan–Dec) showing target vs. solved for that month
- Current month highlighted with "active" state
- Stats: questions logged this month, remaining for month, on-track indicator

### Modify
- QuestionsTab: Add a "Monthly Plan" section below the existing subject breakdown
- Backend: add `addQuestionsMonthly` and `getMonthlyProgress` endpoints that store date-stamped records

### Remove
- Nothing removed

## Implementation Plan
1. Update backend Motoko to add MonthlyQuestionLog type and two new endpoints: addQuestionsWithDate (stores subjectName, count, year, month) and getMonthlyProgress (returns aggregated count per year/month)
2. Update QuestionsTab frontend:
   - Add MonthlyPlanSection component showing 12-month grid
   - Each month card: target (750), solved, progress bar, active/past/future state
   - "This Month" badge on current month
   - Summary stats: this month solved / 750, days remaining, pace indicator
3. Wire the existing addQuestions form to also record a monthly log entry with current year/month
