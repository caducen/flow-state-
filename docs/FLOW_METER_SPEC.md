# FLOW STATE - FLOW METER SYSTEM
## Feature Specification v1.0

**Date:** 2026-01-13  
**Status:** Ready for Implementation  
**Priority:** Core Feature  

---

## OVERVIEW

Replace the hard "Today's 3" limit with a dynamic **Flow Meter** system that adapts to the user's current state and provides real-time visual feedback through an animated arrow indicator.

**Core Principle:** Not all tasks are equal. A tired person selecting three heavy tasks is overloaded. A grounded person selecting three light tasks is underutilized.

---

## NAMING CONVENTION

| Term | Definition |
|------|------------|
| **Flow State** | The app name |
| **Energy Balance** | Points available based on check-in state (14/9/5) |
| **Flow Meter** | The animated arrow indicator showing capacity usage |
| **Task Weight** | Points a task "costs" based on priority + energy required |

---

## USER CHECK-IN & ENERGY BALANCE

When user opens the app, they check in with "How are you feeling?"

| Check-in State | Energy Balance | Starting Arrow | Description |
|----------------|----------------|----------------|-------------|
| **Grounded** | 14 points | ↗ GREEN (up-right) | Full energy, clear mind, ready for challenges |
| **Scattered** | 9 points | → BLUE (right) | Some energy, needs focus, moderate capacity |
| **Tired** | 5 points | ↘ RED (down-right) | Limited energy, needs rest, light tasks only |

---

## THE FLOW METER (Arrow Indicator)

### Visual States

| Arrow Direction | Color | Meaning |
|-----------------|-------|---------|
| ↗ Up-right (45°) | Green | Under capacity - room for more |
| → Right (0°) | Blue | At capacity - well balanced |
| ↘ Down-right (-45°) | Red/Orange | Over capacity - too much |

### Animation Behavior

- Arrow animates smoothly in REAL-TIME as user selects/deselects tasks
- Color transitions through spectrum: Green → Cyan → Blue → Purple → Red
- Rotation transitions smoothly between directions
- Reference: 5-second video animation showing full transition

### Animation Keyframes

| Frame | Color | Direction | Capacity State |
|-------|-------|-----------|----------------|
| 0% | Lime Green | ↗ Up-right | Very under capacity |
| 15% | Forest Green | ↗ Up-right | Under capacity |
| 30% | Cyan | ↗ Slight right | Approaching balance |
| 45% | Royal Blue | → Right | Balanced |
| 60% | Indigo/Purple | ↘ Slight down | Slightly over |
| 75% | Magenta | ↘ Down-right | Over capacity |
| 90% | Orange | ↘ Down-right | Very over capacity |
| 100% | Red | ↘ Down-right | Critical overload |

---

## TASK WEIGHT CALCULATION

### Weight Factors

| Factor | High | Medium | Low |
|--------|------|--------|-----|
| Priority | 3 pts | 2 pts | 1 pt |
| Energy Required | 3 pts | 2 pts | 1 pt |

### Task Weight Formula

```
Task Weight = Priority Points + Energy Points
```

### Weight Categories

| Combination | Weight | Category |
|-------------|--------|----------|
| High + High | 6 pts | Heavy |
| High + Medium | 5 pts | Heavy |
| Medium + High | 5 pts | Heavy |
| Medium + Medium | 4 pts | Medium |
| High + Low | 4 pts | Medium |
| Low + High | 4 pts | Medium |
| Medium + Low | 3 pts | Light |
| Low + Medium | 3 pts | Light |
| Low + Low | 2 pts | Light |

---

## CAPACITY ZONES

| Zone | Calculation | Arrow State | User Message |
|------|-------------|-------------|--------------|
| Under | Weight < 70% of Energy Balance | ↗ GREEN | "You have room for more" |
| Balanced | Weight = 70-100% of Energy Balance | → BLUE | "Good balance for today" |
| Over | Weight > 100% of Energy Balance | ↘ RED | "That's ambitious. Are you sure?" |

---

## USER INTERFACE REQUIREMENTS

### 1. Check-in Screen

- Question: "How are you feeling?"
- Options: Grounded / Scattered / Tired
- On selection:
  - Set Energy Balance (14/9/5)
  - Set initial Flow Meter arrow position and color
  - Show: "Energy Balance: 14 points" (or 9 or 5)

### 2. Task Creation/Edit Modal

When user sets Priority and Energy Required:
- Show immediate feedback on task "heaviness"
- Visual indicator showing task weight
- Examples:
  - Heavy task (6 pts): "This task requires a grounded state"
  - Medium task (4 pts): "Moderate energy needed"
  - Light task (2 pts): "Quick win - low energy"

### 3. Dashboard Flow Meter

- Large, prominent arrow on main dashboard
- Shows current capacity usage
- Animates in real-time as tasks are selected/deselected
- Display: Arrow + numeric balance (e.g., "8/14 points used")

### 4. Task Selection Feedback

When user selects a task for "Today":
- Flow Meter animates to new position
- Points update (e.g., "8/14 → 12/14")
- If moving into RED zone: show confirmation

### 5. Confirmation Dialog (When Over Capacity)

```
"You're selecting more than your current Energy Balance.

Current State: Scattered
Energy Balance: 9 points available
Selected Tasks: 12 points

This might be ambitious for today. Would you like to:

[ ] Continue anyway - I'm feeling good
[ ] Review my selections
[ ] Change my state to Grounded (+5 points)
```

---

## "TODAY'S 3" EVOLUTION

### Old System
- Hard limit: Maximum 3 tasks
- No weight consideration
- Same for all users

### New System
- Soft guidance based on Energy Balance
- "Today's 3" = guidance for HEAVY tasks (6 pts each × 3 = 18 pts)
- Light tasks: Could select 4-7 if capacity allows
- User decides, system advises via Flow Meter

### Examples

**Grounded User (14 pts Energy Balance):**
- 3 heavy tasks (18 pts) = Over capacity → RED → Warning
- 2 heavy + 1 light (14 pts) = Perfect → BLUE
- 7 light tasks (14 pts) = Perfect → BLUE

**Scattered User (9 pts Energy Balance):**
- 2 heavy tasks (12 pts) = Over capacity → RED → Warning
- 1 heavy + 1 medium (10 pts) = Slightly over → Warning
- 3 light + 1 medium (9 pts) = Perfect → BLUE

**Tired User (5 pts Energy Balance):**
- 1 heavy task (6 pts) = Over capacity → RED → Warning
- 1 medium + 1 light (5 pts) = Perfect → BLUE
- 2 light tasks (4 pts) = Under capacity → GREEN

---

## IMPLEMENTATION PHASES

### Phase 1: Data Model Updates
- [ ] Add `weight` field to Task type (calculated from priority + energy)
- [ ] Add `energyBalance` field to user/session state
- [ ] Add `selectedWeight` calculation (sum of today's task weights)
- [ ] Add `userState` field (grounded/scattered/tired)

### Phase 2: Check-in Component
- [ ] Create check-in screen/modal
- [ ] Three state options with descriptions
- [ ] Set Energy Balance on selection
- [ ] Store in local state/storage

### Phase 3: Flow Meter Component
- [ ] Create animated arrow component
- [ ] Support color transitions (green → blue → red spectrum)
- [ ] Support rotation transitions (up-right → right → down-right)
- [ ] Accept capacity percentage as input
- [ ] Smooth CSS/animation transitions

### Phase 4: Task Weight Feedback
- [ ] Add weight indicator to task creation modal
- [ ] Show "heaviness" category (Light/Medium/Heavy)
- [ ] Color-code based on weight
- [ ] Show point value

### Phase 5: Dashboard Integration
- [ ] Add Flow Meter to main dashboard
- [ ] Display Energy Balance (e.g., "8/14 points")
- [ ] Connect to selected tasks weight
- [ ] Real-time animation on selection changes

### Phase 6: Confirmation Flow
- [ ] Add confirmation dialog for over-capacity selections
- [ ] Soft warning (not blocking)
- [ ] Options: continue, review, or change state

---

## COLOR PALETTE

```css
/* GREEN - Under Capacity */
--green-main: #7CB342;
--green-light: #9CCC65;
--green-dark: #558B2F;

/* CYAN - Transition */
--cyan-main: #00BCD4;
--cyan-light: #4DD0E1;
--cyan-dark: #0097A7;

/* BLUE - Balanced */
--blue-main: #2196F3;
--blue-light: #64B5F6;
--blue-dark: #1565C0;

/* PURPLE - Transition */
--purple-main: #9C27B0;
--purple-light: #BA68C8;
--purple-dark: #7B1FA2;

/* RED/ORANGE - Over Capacity */
--red-main: #F4511E;
--red-light: #FF7043;
--red-dark: #BF360C;
```

---

## VISUAL ASSETS

### Arrow Animation Source
- Oscar's 5-second MP4 video
- 12 keyframe screenshots captured
- Implementation options:
  - CSS keyframe animation
  - Lottie animation
  - Video element with seek control

### Asset Files Needed
```
public/
├── flow-meter/
│   ├── arrow-green.png      # Keyframe: 0%
│   ├── arrow-cyan.png       # Keyframe: 30%
│   ├── arrow-blue.png       # Keyframe: 45%
│   ├── arrow-purple.png     # Keyframe: 60%
│   ├── arrow-orange.png     # Keyframe: 80%
│   ├── arrow-red.png        # Keyframe: 100%
│   └── flow-meter.mp4       # Full animation (optional)
```

---

## FUTURE ENHANCEMENTS

### Practices Integration (from Overwhelm Navigator)
- When Tired, suggest practices to become Scattered
- When Scattered, suggest practices to become Grounded
- Pull from Overwhelm Navigator practice library

### Smart Suggestions
- AI suggests optimal task selection based on state
- "Based on your energy, I'd recommend these tasks"

### Historical Learning
- Track planned vs actual completion
- Adjust capacity estimates based on history

---

## CHECKLIST

- [ ] Update Task type with weight calculation
- [ ] Add user state and Energy Balance to app state
- [ ] Create check-in component
- [ ] Create Flow Meter arrow component
- [ ] Add weight feedback to task modal
- [ ] Add Flow Meter to dashboard
- [ ] Connect Flow Meter to task selection
- [ ] Implement real-time animation
- [ ] Add over-capacity confirmation dialog
- [ ] Test all states (Grounded/Scattered/Tired)
- [ ] Test edge cases (0 tasks, many tasks)
- [ ] Extract arrow keyframes from video

---

**END OF FLOW METER SPECIFICATION v1.0**
