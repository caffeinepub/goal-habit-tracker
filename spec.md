# SSC CGL Ultimate Study Tracker

## Current State
Existing project is a basic Goal & Habit Tracker. Starting fresh with a merged, comprehensive SSC CGL study tracker.

## Requested Changes (Diff)

### Add
- **30-Day Habit/Subject Grid**: Each subject has a 30-day checkbox grid; clicking a cell toggles study completion for that day
- **Subject Management**: Add subjects with name and topic description; delete subjects
- **Weak Topic Detection**: Subjects with < 40% completion are flagged as weak automatically
- **Score Predictor**: User enters mock test scores; app predicts final score using average + consistency boost from overall completion
- **Auto Timetable Generator**: Displays today's focus plan based on weak subjects
- **Pomodoro Timer**: 25-minute countdown timer with Start, Pause, Reset controls
- **Dashboard**: Shows overall completion progress bar, predicted score, and today's timetable
- **Search**: Filter subjects by name
- **Persistent backend storage**: Subjects, mock scores, and study data stored in canister (replaces localStorage)
- **Sidebar navigation**: Home, Analytics, Add Subject, Timer tabs

### Modify
- Replace localStorage with canister backend storage for persistence across devices

### Remove
- Firebase integration (not supported on this platform)
- Android APK/Capacitor references

## Implementation Plan
1. Backend canister: store subjects (id, name, description, days array, weak flag), mock scores, retrieve and update per user
2. Frontend: sidebar layout with tabs (Home, Add Subject, Analytics, Timer)
3. Dashboard card: overall progress, predicted score, timetable suggestion
4. Subject cards: 30-day grid with checkboxes, weak subject highlighted in red
5. Add subject form: name + description inputs
6. Mock score input + list display in Analytics tab
7. Pomodoro timer component in Timer tab
8. Search bar filtering subjects on Home tab
