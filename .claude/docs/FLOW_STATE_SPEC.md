# FLOW STATE - FEATURE SPECIFICATION

**Project:** Flow State - Calm-tech Kanban/Task Board
**Version:** 1.0
**Date:** 2026-01-12
**Purpose:** Implementation roadmap for enhancements

---

## FEATURE 1: Labels (Work-Type Tags)

**Current labels:** Bug, Feature, Design, Docs, Refactor

**New labels to add:**
- Research – For exploration tasks
- Planning – Strategic thinking
- Admin – Emails, paperwork, logistics
- Learning – Tutorials, courses, reading
- Meeting – Calls, sessions, discussions
- Review – Checking work, feedback

**Implementation requirements:**
- Store labels in a central config (easy to adjust names/colors later)
- Use soft, calm colors with similar luminance but different hues
- Never rely on color alone (keep text visible)
- Allow selecting multiple labels per task via chips/pills
- Show labels on task cards without overwhelming the card

---

## FEATURE 2: Edit Existing Tasks

**Requirements:**
- Clicking a task card opens the same modal as "New Task", pre-filled
- Editable fields: title, description, labels, priority, due date, energy level, subtasks
- Preserve keyboard accessibility and focus when modal opens/closes

---

## FEATURE 3: Tasks vs Todos Distinction

**Definitions:**
- **To-do** = Reminder; atomic, lightweight, often vague; intention-level
  - Example: "Review migration notes"
  - Answers: "What should I not forget?"
  
- **Task** = Unit of execution; clearly scoped and actionable; has beginning/end
  - Example: "Summarize Claude Desktop conversations into a 1-page brief"
  - Answers: "What will I actually do, and how will I know it's complete?"

**Essential difference:** A to-do points your attention. A task moves reality.

**Implementation:**
- Keep "Quick Todos" panel as simple checklist (text only, no dates/labels)
- Add "Promote to Task" action on each to-do
- Add info icons with tooltip showing definitions

---

## FEATURE 4: Column Hints and Empty States

**Requirements:**
- "In Progress" column: "Drag a task here to start" with subtle icon
- "Complete" column empty state: "Nothing completed yet today—small steps count."
- All columns: short, non-judgmental, encouraging messages

---

## FEATURE 5: Today Filter and "Today's 3"

**Requirements:**
- Add "Today" filter toggle (All / Today)
- "Today" shows tasks due today OR marked as "Today's 3"
- Add star/target icon for "Today's 3" designation
- Limit to max 3 active Today-tasks (gentle nudge if user tries to add 4th)
- Add compact "Today's 3" bar at top of board

---

## FEATURE 6: Focus Mode

**Requirements:**
- Trigger via "Focus" button on task card or from Today's 3 bar
- When active: center selected task, dim rest of board (reduced opacity/blur)
- Show only key actions: mark complete, manage subtasks, edit, exit focus
- Restore scroll position when exiting

---

## FEATURE 7: Energy Level and State Check

**Requirements:**
- Each task can have Energy tag: High / Medium / Low (optional, default unspecified)
- Add session-level State Check above board: "What state am I in right now?"
- Options: Grounded / Scattered / Tired (configurable)
- Store state locally (no backend needed)

---

## FEATURE 8: Subtasks and Progress Bar

**Requirements:**
- Inside Task modal: "Subtasks" section with add/remove checklist
- On card view: if task has subtasks, show small progress bar and "2/5" style indicator
- Keep progress bar thin and subtle

---

## FEATURE 9: Typography and Polish

**Requirements:**
- Increase line height in descriptions for readability
- Add clear but subtle hover states and focus rings
- Ensure keyboard navigation is smooth across modals and board

---

## FEATURE 10: Implementation Guidance

**Approach:**
- Work feature by feature
- Identify main files/components to update
- Propose clean data model updates
- Keep styles consistent with dark, calm visual design

---

## IMPLEMENTATION ORDER (Recommended)

| Order | Feature | Complexity |
|-------|---------|------------|
| 1 | Labels | Simple |
| 2 | Edit existing tasks | Simple |
| 3 | Column hints / empty states | Simple |
| 4 | Typography polish | Simple |
| 5 | Tasks vs Todos clarification | Medium |
| 6 | Subtasks + progress bar | Medium |
| 7 | Today filter | Medium |
| 8 | "Today's 3" | Medium |
| 9 | Energy level + state check | Medium |
| 10 | Focus mode | Complex |

---

**END OF SPECIFICATION**
