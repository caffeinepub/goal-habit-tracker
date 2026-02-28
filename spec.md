# SSC CGL Ultimate Tracker

## Current State

The app has Study Plan, Questions, and Monthly Plan tabs where users log study hours and questions. Editing is already restricted to the present day. The Settings dialog (TargetsPanel) lets users customize overall targets (total questions goal, daily hours, plan days, subject targets).

## Requested Changes (Diff)

### Add
- A dedicated "Today's Edit" section inside the Settings dialog (TargetsPanel) that allows the user to:
  - Set the exact number of questions done today (0 to max, any value, free input) per subject
  - Set the exact number of study hours done today (0 to max, free input) per subject
  - These fields pre-populate with today's already-saved values on load
  - Auto-save to backend as the user types (debounced)
  - Show "Editable today only" badge and today's date
  - Past dates cannot be edited from this section

### Modify
- TargetsPanel dialog: add a new "Today's Progress" section after the existing targets section, separated by a divider, with:
  - Study hours input per subject (uses setStudySession with today's date)
  - Questions solved input per subject (uses setQuestionCount)
  - Both are present-day only, auto-saving

### Remove
- Nothing removed

## Implementation Plan

1. In TargetsPanel.tsx:
   - Import useGetQuestionProgress, useGetStudySessions, useSetStudySession, useSetQuestionCount hooks
   - Add state for today's study hours per subject (map) and today's questions per subject (map)
   - On dialog open, pre-populate those maps from existing sessions/progress data filtered to today
   - Add a "Today's Progress" section below the subject targets divider
   - For study hours: show each subject with an input pre-filled with today's logged hours (sum from sessions for today)
   - For questions: show each subject with an input pre-filled with current question count
   - Both auto-save on debounce using the existing setStudySession / setQuestionCount mutations
   - Show save status indicators
   - Show today's date badge with "Editable today only" note
