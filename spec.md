# SSC CGL Ultimate Tracker

## Current State
Full-stack SSC CGL study tracker with: Home, Add Subject, Analytics, Timer, Study Plan, Questions (9000 goal), Exam Mode, Notebook, and Notepad tabs. Uses Internet Identity auth, Motoko backend, React + Tailwind + shadcn/ui frontend. Dark theme only (Tactical Black + Crimson).

## Requested Changes (Diff)

### Add
- **Theme Toggle** -- Night Mode (current dark) and Light Mode, switchable via a toggle button in the Sidebar footer
- **Text Color Picker** -- A color picker in a new "Appearance" settings panel (accessible from Sidebar) that lets the user choose the app-wide text color (applied via CSS variable)
- **Text Font Picker** -- A font selector (dropdown) with several choices: Satoshi (default), Cabinet Grotesk, Geist Mono, Georgia (serif), Arial (sans-serif), applied app-wide via CSS variable
- **Table Maker tab** -- A new tab "Table Maker" in the sidebar where users can:
  - Set number of rows and columns (custom input)
  - Each cell is editable (text input)
  - Each cell has a tick/checkbox option (checkmark toggleable per cell)
  - Table can be named/titled
  - Multiple tables can be saved
  - Tables are stored in localStorage (no backend required for this feature)

### Modify
- `Sidebar.tsx` -- Add "Table Maker" nav item + Appearance settings button (moon/sun icon toggle for theme, palette icon to open Appearance panel)
- `App.tsx` -- Add `tablemaker` TabId, add theme/font/color context/state lifted to App level, pass to CSS variables on `<html>` or `<body>` element
- `index.css` -- Add light mode CSS variable overrides under `.light` class, add font CSS variables

### Remove
- Nothing removed

## Implementation Plan
1. Add `AppearanceContext` (or lift state in App.tsx) to hold: `theme` ("dark"|"light"), `textColor` (string, OKLCH or hex), `fontFamily` (string)
2. Update `index.css` to add `.light` class with full light-mode token overrides
3. Add font CSS variable `--app-font` and apply it to `body`
4. Add Appearance panel component (modal/popover) with: theme toggle buttons (Night/Light), color picker for text, font dropdown
5. Add Appearance button to Sidebar footer (palette icon)
6. Create `TableMakerTab.tsx` with: rows/columns configurator, editable cells, per-cell tick toggle, save/load multiple tables via localStorage
7. Add `tablemaker` to `TabId` in `App.tsx` and wire up in main render
8. Add Table Maker nav item to Sidebar
