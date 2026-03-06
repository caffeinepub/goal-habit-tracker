# SSC CGL Ultimate Tracker

## Current State
- Full-featured study tracker with: Home, Add Subject, Analytics, Pomodoro Timer, Study Plan, Questions, Exam, Notebook, Notepad, Daily Routine, Table Maker, Files tabs
- Global Appearance panel (palette icon in sidebar) controls theme, font, font size, accent color, text color, rainbow text, custom theme builder
- Questions tab has a "Log Questions" form with subject select + count input + timer + per-question time control; Subject Breakdown card; Monthly Plan section; Progress chart dialog; History dialog
- Known issue: the Questions section "Log Questions" form has a bug -- when subject is pre-populated from backend, calling `triggerSave` inside `handleSubjectChange` can cause a race condition / validation failure, and the count input sometimes resets or shows stale data

## Requested Changes (Diff)

### Add
- **Per-section appearance icon**: A small palette/color icon button in the header of each main section (Study Plan, Questions, Daily Routine, Pomodoro/Timer, Exam, Notebook, Notepad, Home, Analytics, Table Maker, Add Subject, Files). When clicked, opens a compact per-section style panel (popover/dialog) letting the user choose:
  - Font family (from same FONT_OPTIONS list)
  - Font size (slider 12–22px)
  - Text color (presets + custom color picker)
  - Accent/highlight color for that section
  - These settings are stored per-section in localStorage (key: `ssc_section_style_<sectionId>`) and applied via inline CSS on the section wrapper div

### Modify
- **Questions section bug fix**: 
  - In `handleSubjectChange`, do NOT call `triggerSave` immediately when pre-populating; only set the display value. Only save when the user manually changes the count input.
  - Fix the count input so it correctly shows the current backend count when a subject is selected (read from `progressMap` not stale ref)
  - Ensure `setTodayQCounts` is defined before `triggerSave` calls it (move or restructure)
  - The `setTodayQCounts` call inside `triggerSave` needs the setter to be stable

### Remove
- Nothing removed

## Implementation Plan
1. Create a `SectionStylePanel` component: compact popover with font family select, font size slider, text color picker (presets + custom), accent color picker. Accepts `sectionId`, `onClose`. Reads/writes localStorage key `ssc_section_style_<sectionId>`. Returns a `useSectionStyle(sectionId)` hook that returns `{fontFamily, fontSize, textColor, accentColor}` as inline style object.
2. Add a small palette icon button to each section's header (Study Plan, Questions, Daily Routine, Timer, Exam, Notebook, Notepad, Home, Analytics, Table Maker, AddSubject, Files). When clicked, toggles the SectionStylePanel popover.
3. In each section's root wrapper div, apply `style={sectionStyle}` from the hook.
4. Fix Questions tab: restructure `handleSubjectChange` to not auto-save, fix count pre-population, ensure `setTodayQCounts` is not called before it's defined.
