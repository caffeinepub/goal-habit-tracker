# SSC CGL Ultimate Tracker

## Current State
Full-stack study tracker with: Home, Add Subject, Analytics, Pomodoro Timer (with floating widget), Study Plan, Questions (9000 challenge + monthly plan), Exam Mode, Notebook, Notepad, Daily Routine (monthly calendar scheduler), Table Maker, Files, and Appearance Panel. Authentication via Internet Identity. Data persisted to ICP backend canister.

## Requested Changes (Diff)

### Add
- **Time format toggle (12h/24h)** -- global setting in Appearance Panel; affects all time displays across app
- **Draggable floating timer widget** -- user can drag the mini timer window to any position on screen (not fixed bottom-right)
- **Study Plan -- actual elapsed time display** -- Today's Progress section shows real elapsed time (HH:MM:SS live clock) not just the selected/planned hours
- **Daily Routine -- progress slider** -- horizontal progress bar / slider showing completion % of today's tasks
- **Daily Routine -- AM/PM time format** -- time picker fields show AM/PM selector alongside time input; stored internally as 24h but displayed in 12h/24h per global setting
- **Daily Routine -- copy any date's tasks** -- "Copy from Date" button lets user pick any past date and copy its schedule to current day (not just yesterday)
- **Daily Routine -- all-days progress table** -- separate table section below calendar showing all 100 days with columns: Day#, Date, Tasks, Done, Progress%, Streak indicator, tick marks; present day editable, past days locked
- **Daily Routine -- streak counter** -- consecutive days where all tasks are completed, shown as flame streak
- **Daily Routine -- progress in percentage** -- show % completion (done/total tasks) prominently in header and table
- **Pomodoro -- save focus time day-wise** -- store total focused minutes per day in localStorage; show daily history table
- **Pomodoro -- streak for target time** -- configurable daily target (default 15h = 900 min); track streak of consecutive days meeting target; show streak flame badge
- **Theme -- custom theme builder** -- "Build Your Own Theme" section in Appearance Panel: pick bg color, card color, border color, accent color, text color, merge 2 colors with a gradient option, preview live
- **Notifications section** -- new "Notifications" tab or panel (bell icon in sidebar footer): shows reminders for daily routine incomplete tasks, study plan remaining hours, questions remaining count; toggleable notification preferences
- **Questions -- per-question solve time** -- customizable timer per question from 10 seconds to 5 minutes (10s, 30s, 1m, 2m, 3m, 5m presets + custom slider); shown in exam/practice mode

### Modify
- **FloatingTimerWidget** -- make draggable via mouse/touch drag events; remember last position in localStorage
- **AppearancePanel** -- add time format toggle (12h/24h), add custom theme builder section with color pickers and gradient merge
- **DailyRoutineTab** -- add progress slider, AM/PM time display, copy-any-date feature, all-days progress table with streak + ticks + lock, % progress display
- **TimerTab** -- add daily focus time log table (day-wise), configurable target hours for streak (default 15h), persist and display total focused minutes per day
- **QuestionsTab** -- add per-question solve time selector (10s–5min)
- **Sidebar** -- add Notifications bell icon in footer area

### Remove
- Nothing removed

## Implementation Plan
1. Make FloatingTimerWidget draggable (mouse + touch, save position to localStorage)
2. Add 12h/24h time format toggle to AppearancePanel and propagate via context/prop to DailyRoutine time displays
3. Update StudyPlanTab Today's Progress to show live elapsed time (HH:MM:SS stopwatch) alongside planned hours
4. DailyRoutineTab: add % progress bar/slider, AM/PM time picker, copy-from-any-date dialog, all-100-days progress table with streak/ticks/lock logic
5. TimerTab: add per-day focus time tracking table, configurable target hours, streak calculation against target
6. QuestionsTab: add per-question solve time setting (10s–5min slider/presets)
7. AppearancePanel: add custom theme builder (bg/card/border/accent color pickers, gradient merge, live preview)
8. Add NotificationsPanel component + bell icon in Sidebar footer; show reminders for routine/study/questions
