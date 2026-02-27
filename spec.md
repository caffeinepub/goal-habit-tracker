# Goal & Habit Tracker

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A goal/habit tracker app with the following features:
  - Create, edit, and delete goals/habits
  - Each goal has a title, description, and target (e.g. number of completions or days)
  - Daily check-in / completion tracking (checkbox per day or per entry)
  - Progress bar showing completion percentage toward goal
  - Line chart showing progress over time (historical completion data)
  - Animated UI using framer-motion
  - Clean dashboard listing all goals with their progress

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - Data model: Goal { id, title, description, targetCount, createdAt }
   - Data model: Entry { goalId, date, completed }
   - CRUD for goals: createGoal, getGoals, updateGoal, deleteGoal
   - Entry tracking: logEntry, getEntriesForGoal
   - Computed progress: get completion count per goal

2. Frontend:
   - Dashboard page: list all goals with progress bars and quick check-in
   - Add/Edit goal modal with title, description, target fields
   - Goal detail view: line chart of completions over time
   - Animated transitions between views and on card hover
   - Empty state for no goals
