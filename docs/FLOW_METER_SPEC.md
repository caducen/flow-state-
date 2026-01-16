# FLOW STATE - ENERGY SYSTEM SPECIFICATION
## Version 1.2

**Date:** 2026-01-16
**Status:** Implemented
**Previous Versions:** v1.0 (Initial spec), v1.1 (All phases complete)

---

## OVERVIEW

Flow State is a task management app with a dynamic energy system that adapts to the user's current state. The system helps users make realistic commitments by tracking energy costs against their available capacity.

**Core Principle:** Not all tasks are equal. A tired person selecting heavy tasks is overloaded. A grounded person selecting only light tasks is underutilized. The energy system provides visual feedback to help users find balance.

---

## WHAT CHANGED IN v1.2

### Major Changes
1. **Single-column mobile-first layout** - Replaced 3-column Kanban board with a clean, focused task list
2. **Progress tracking** - Tasks now track progress (0%, 25%, 50%, 75%, 100%) with color-coded bars
3. **Dynamic energy cost** - Task energy cost decreases as progress increases (75% done = 25% cost)
4. **Archive system** - Completed tasks move to a collapsible archive section
5. **QuickTodos** - Lightweight reminders separate from structured tasks
6. **Delete confirmation** - Tasks require confirmation before deletion

### Removed
- FlowMeter video/arrow animation (replaced by EnergyProgressBar)
- 3-column Kanban (To Do / In Progress / Done)
- TodoList and NoteArea components
- OverCapacityDialog (replaced by softer guidance)

---

## NAMING CONVENTION

| Term | Definition |
|------|------------|
| **Flow State** | The app name |
| **Energy Balance** | Points available based on check-in state (18/9/6) |
| **Task Weight** | Points a task "costs" based on priority + energy required |
| **Progress** | How much of a task is complete (0-100%) |
| **Effective Weight** | Task weight adjusted for progress |
| **QuickTodo** | Lightweight reminder (no energy cost) |
| **Task** | Structured work item with energy cost |

---

## USER CHECK-IN & ENERGY BALANCE

When user opens the app, they check in with "How are you feeling?"

| Check-in State | Energy Balance | Description |
|----------------|----------------|-------------|
| **Grounded** | 18 points | Full energy, clear mind, ready for challenges |
| **Scattered** | 9 points | Some energy, needs focus, moderate capacity |
| **Tired** | 6 points | Limited energy, needs rest, light tasks only |

---

## ENERGY PROGRESS BAR

The main visual indicator showing energy usage. Uses a 6-color gradient system:

| Remaining % | Color | Zone | Message |
|-------------|-------|------|---------|
| 80-100% | Green (#10B981) | Full | "Full tank! Plenty of energy" |
| 60-80% | Cyan (#06B6D4) | Good | "Good reserves remaining" |
| 45-60% | Blue (#3B82F6) | Half | "Half tank - pacing well" |
| 30-45% | Purple (#8B5CF6) | Low | "Getting low on capacity" |
| 15-30% | Orange (#F97316) | Warning | "Running low - prioritize carefully" |
| 0-15% | Red (#F43F5E) | Critical | "Very low capacity remaining" |
| Over capacity | Red (#F43F5E) | Overloaded | "Overloaded - consider dropping tasks" |

### Display Format
- **Starting**: User's energy balance (18, 9, or 6)
- **Used**: Sum of effective task weights
- **Remaining**: Starting - Used (color-coded)

---

## TASK WEIGHT CALCULATION

### Weight Factors

| Factor | High | Medium | Low |
|--------|------|--------|-----|
| Priority | 3 pts | 2 pts | 1 pt |
| Energy Required | 3 pts | 2 pts | 1 pt |

### Base Weight Formula

```
Base Weight = Priority Points + Energy Points
Range: 2 (low+low) to 6 (high+high)
```

### Weight Categories

| Weight | Category | Color | Description |
|--------|----------|-------|-------------|
| 2-3 pts | Light | Green (#7CB342) | Quick win - low energy |
| 4 pts | Medium | Blue (#2196F3) | Moderate energy needed |
| 5-6 pts | Heavy | Orange (#F4511E) | Requires a grounded state |

---

## PROGRESS TRACKING (New in v1.2)

### Progress Levels

| Progress | Color | Label |
|----------|-------|-------|
| 0% | Red (#F43F5E) | Not Started |
| 25% | Orange (#F97316) | 25% |
| 50% | Blue (#3B82F6) | 50% |
| 75% | Cyan (#06B6D4) | 75% |
| 100% | Green (#10B981) | Complete |

### Effective Weight Formula

```
Effective Weight = Base Weight × (1 - Progress/100)
```

**Examples:**
- 6pt task at 0% = 6 pts cost
- 6pt task at 25% = 4.5 pts cost
- 6pt task at 50% = 3 pts cost
- 6pt task at 75% = 1.5 pts cost
- 6pt task at 100% = 0 pts cost (archived)

This encourages progress on existing tasks rather than just adding new ones.

---

## APPLICATION ARCHITECTURE

### Active Components

```
components/
├── TaskList.tsx          # Main task list with progress tracking
├── AddTaskModal.tsx      # Create/edit tasks
├── QuickTodos.tsx        # Lightweight reminders
├── CheckInSection.tsx    # User state check-in
├── EnergyProgressBar.tsx # Visual energy indicator
├── EnergyCursor.tsx      # Optional cursor effect
├── SettingsPanel.tsx     # App settings
└── ThemeToggle.tsx       # Dark/light theme switch
```

### Data Types

```typescript
interface Task {
  id: string
  title: string
  description?: string
  status: 'active' | 'archived'
  progress: number          // 0, 25, 50, 75, 100
  priority: Priority        // 'low' | 'medium' | 'high'
  energyLevel?: EnergyLevel // 'low' | 'medium' | 'high'
  dueDate?: string
  labelIds: string[]
  subtasks?: Subtask[]
  createdAt: number
  completedAt?: number      // When archived
  isTodayTask?: boolean     // Star indicator
}

type UserState = 'grounded' | 'scattered' | 'tired'

interface QuickTodo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}
```

### Local Storage Keys

| Key | Description |
|-----|-------------|
| `flow-tasks-v3` | Task array |
| `flow-quick-todos` | QuickTodo array |
| `flow-labels` | Custom labels |
| `flow-user-state` | Current check-in state |
| `energyCursorEnabled` | Cursor feature toggle |

---

## USER INTERFACE

### Layout (Mobile-First)

```
┌─────────────────────────────┐
│  Flow State        [☀️] [⚙️] │  Header
├─────────────────────────────┤
│  How are you feeling?       │  Check-in
│  [Grounded] [Scattered] ... │
├─────────────────────────────┤
│  ████████░░░░ 12/18 pts     │  Energy Bar
│  Today's 2 / 3              │
├─────────────────────────────┤
│  Quick Todos (3 pending)    │  QuickTodos
│  ○ Buy groceries      [↑]   │
│  ○ Call mom           [↑]   │
├─────────────────────────────┤
│  Tasks (5)          [+ Add] │  TaskList
│  ┌─────────────────────┐    │
│  │ ★ Design homepage   │    │  Task Card
│  │ █████████░░ 75%     │    │  Progress bar
│  │ #design   1.5/6 pts │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ ○ API integration   │    │
│  │ ████░░░░░░ 50%      │    │
│  │           3/6 pts   │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  ▸ Completed (8)            │  Archive
└─────────────────────────────┘
```

### Task Card (Expanded)

```
┌─────────────────────────────┐
│ ★ Design homepage           │
│ ████████████ 75%            │
│                             │
│ Description text here...    │
│                             │
│ [High] [⚡ High] 📅 Jan 20  │
│                             │
│ Subtasks (2/3)              │
│ ✓ Wireframe                 │
│ ✓ Colors                    │
│ ○ Final review              │
│                             │
│ Progress                    │
│ [0%][25%][50%][75%][100%]   │
│                             │
│ [Edit] [✓ Complete] [✕]     │
└─────────────────────────────┘
```

### Delete Confirmation

When user clicks the delete button (✕):

```
┌─────────────────────────────┐
│         ⚠️                  │
│                             │
│     Delete Task?            │
│                             │
│  This will delete           │
│  "Design homepage".         │
│  Are you sure?              │
│                             │
│   [Cancel]    [Delete]      │
└─────────────────────────────┘
```

---

## QUICK TODOS vs TASKS

| Feature | Quick Todos | Tasks |
|---------|-------------|-------|
| Energy cost | None | 2-6 points |
| Progress tracking | No (done/not done) | Yes (0-100%) |
| Priority/Energy | No | Yes |
| Subtasks | No | Yes |
| Labels | No | Yes |
| Due dates | No | Yes |
| Archive | No | Yes |
| Use case | Quick reminders | Structured work |

**Promote**: QuickTodos can be promoted to Tasks (↑ button)

---

## OPTIONAL FEATURES

### Energy Cursor
When enabled in Settings:
- Custom cursor that changes based on energy state
- Visual feedback showing remaining capacity
- Matches the 6-color gradient system

### Theme Toggle
- Light and dark mode support
- Persists in local storage

---

## IMPLEMENTATION STATUS

### Completed
- [x] User state check-in (Grounded/Scattered/Tired)
- [x] Energy balance calculation
- [x] Task weight calculation
- [x] Progress tracking (0-100%)
- [x] Effective weight based on progress
- [x] EnergyProgressBar with 6-color gradient
- [x] Single-column TaskList
- [x] Archive system for completed tasks
- [x] QuickTodos component
- [x] Promote todo to task
- [x] Delete confirmation dialog
- [x] Theme toggle (dark/light)
- [x] Optional energy cursor
- [x] Mobile-first responsive layout

### Future Enhancements
- [ ] Practice suggestions based on state
- [ ] AI task recommendations
- [ ] Historical capacity learning
- [ ] Drag-and-drop reordering
- [ ] Keyboard shortcuts
- [ ] Data export/import

---

## CHANGELOG

### v1.2 (2026-01-16)
- Replaced Kanban board with single-column TaskList
- Added progress tracking (0%, 25%, 50%, 75%, 100%)
- Energy cost now decreases with task progress
- Added archive section for completed tasks
- Added delete confirmation dialog
- Merged QuickTasks + TodoList into QuickTodos
- Removed FlowMeter video animation
- Removed OverCapacityDialog
- Cleaned up unused components

### v1.1 (2026-01-14)
- All implementation phases complete
- Added EnergyProgressBar
- Added EnergyCursor
- Updated energy values (18/9/6)

### v1.0 (2026-01-13)
- Initial specification
- Flow Meter concept with arrow animation
- Energy balance system design

---

**END OF SPECIFICATION v1.2**
