# SSC CGL Ultimate Tracker

## Current State
The Questions section has a 30-day challenge that auto-resets after 30 days have elapsed (cycleStart stored in `localStorage` under `ssc_cycle_start_questions`). There is no manual reset option. Challenge progress (per-subject question counts) is stored in localStorage (`ssc_daily_q_<subject>_<date>`) and synced to backend via `useSetQuestionCount`. The cycle start date drives day-of-cycle calculation and auto-rollover.

## Requested Changes (Diff)

### Add
- **Manual Reset button** in the Questions section header/settings area (e.g. a "Reset Challenge" button with a refresh/warning icon).
- **Date picker dialog**: When clicked, opens a dialog with:
  - A calendar/date picker to choose the new challenge **start date** (any date, past or future)
  - A confirmation button labelled "Reset Challenge"
  - A warning message: "This will clear all challenge progress and start a fresh 30-day window from the chosen date. You cannot reset again for 30 days."
- **Reset logic on confirm**:
  1. Archive current cycle to backend (same as auto-rollover: call `savePlanCycleMutate` with current `cycleStart` and today as `endDate`)
  2. Set `ssc_cycle_start_questions` in localStorage to the chosen start date
  3. Set `ssc_challenge_reset_lock` in localStorage to the chosen start date (used to compute the 30-day lock window)
  4. Update React state `cycleStart` to the new date
  5. Clear all backend question counts by calling `setQuestionCount` with 0 for every subject
  6. Clear today's localStorage question counts for all subjects
- **Lock mechanism**:
  - On mount and after reset, check `ssc_challenge_reset_lock` in localStorage
  - If today is less than 30 days after the lock date, disable the Reset button and show a countdown badge: "Reset in X days" next to the button
  - If 30 days have passed, enable the Reset button normally
  - Lock date is set to the chosen start date at reset time

### Modify
- QuestionsTab.tsx: Add the reset button, dialog, lock logic, and countdown display.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `RESET_LOCK_KEY = 'ssc_challenge_reset_lock'` constant in QuestionsTab.
2. Add state: `resetLockDate` (string | null), `showResetDialog` (boolean), `resetPickedDate` (string - defaults to today).
3. On mount, read `ssc_challenge_reset_lock` from localStorage into `resetLockDate`.
4. Compute `daysUntilReset`: if `resetLockDate` is set and `daysDiffQ(resetLockDate, today) < 30`, then `daysUntilReset = 30 - daysDiffQ(resetLockDate, today)`, else 0.
5. Add a "Reset Challenge" button in the Questions header/card area. Disabled if `daysUntilReset > 0`, showing a tooltip or badge "Reset in X days".
6. Clicking the button opens a dialog with a date input (type="date") defaulting to today, a warning message, and a Confirm button.
7. On confirm: archive cycle, update localStorage keys, reset backend counts to 0 for all subjects, update React state, close dialog.
8. All existing auto-rollover logic remains unchanged.
