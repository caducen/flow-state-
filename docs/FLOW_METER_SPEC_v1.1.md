# FLOW STATE - FLOW METER SYSTEM
## Feature Specification v1.1

**Date:** 2026-01-13  
**Status:** ✅ CORE IMPLEMENTATION COMPLETE  
**Version:** 1.1 (Updated post-implementation)  
**Repository:** https://github.com/caducen/flow-state-

---

## OVERVIEW

A dynamic **Flow Meter** system that replaces traditional hard task limits with an energy-based capacity system. Users check in with their current state, receive an Energy Balance, and get real-time visual feedback through an animated arrow indicator as they select tasks.

**Core Principle:** Not all tasks are equal. A tired person selecting three heavy tasks is overloaded. A grounded person selecting three light tasks is underutilized.

---

## NAMING CONVENTION

| Term | Definition |
|------|------------|
| **Flow State** | The app name |
| **Energy Balance** | Points available based on check-in state (18/9/6) |
| **Flow Meter** | The animated arrow indicator showing capacity usage |
| **Task Weight** | Points a task "costs" based on priority + energy required |

---

## ✅ IMPLEMENTATION STATUS

### Completed Phases

| Phase | Feature | Status | Notes |
|-------|---------|--------|-------|
| 1 | Data Model Updates | ✅ DONE | `types/index.ts`, `utils/flowMeter.ts` |
| 2 | Check-in Component | ✅ DONE | `CheckInSection.tsx` |
| 3 | Flow Meter Component | ✅ DONE | `FlowMeter.tsx` with 12 image sprites |
| 4 | Task Weight Feedback | ✅ DONE | Weight indicator in `AddTaskModal.tsx` |
| 5 | Dashboard Integration | ✅ DONE | Flow Meter on main dashboard |
| 6 | Confirmation Flow | ✅ DONE | `OverCapacityDialog.tsx` |

### Key Files

```
/components
  CheckInSection.tsx      # User state selection + Flow Meter display
  FlowMeter.tsx           # Animated arrow (12 image sprites, crossfade)
  AddTaskModal.tsx        # Task creation/edit with weight indicator
  OverCapacityDialog.tsx  # Soft warning when over capacity
/types
  index.ts                # USER_STATE_CONFIG, weight calculations
/utils
  flowMeter.ts            # getFlowMeterPercentage(), capacity functions
/public
  flow-meter/             # 12 glossy 3D arrow images (PNG)
```

---

## USER CHECK-IN & ENERGY BALANCE

When user opens the app, they check in with "How are you feeling?"

| Check-in State | Energy Balance | Starting Arrow | Description |
|----------------|----------------|----------------|-------------|
| **Grounded** | 18 points | ↗ GREEN (up-right) | Full energy, clear mind, ready for challenges |
| **Scattered** | 9 points | → BLUE (right) | Some energy, needs focus, moderate capacity |
| **Tired** | 6 points | ↘ RED (down-right) | Limited energy, needs rest, light tasks only |

---

## THE FLOW METER (Arrow Indicator)

### Visual States

| Arrow Direction | Color | Meaning |
|-----------------|-------|---------|
| ↗ Up-right (45°) | Green | Under capacity - room for more |
| → Right (0°) | Blue | At capacity - well balanced |
| ↘ Down-right (-45°) | Red/Orange | Over capacity - too much |

### Current Implementation

- **12 pre-rendered 3D glossy arrow images** (created by Oscar in Midjourney + Grok)
- **Crossfade transitions** between frames using opacity
- **Color progression:** Green → Yellow → Cyan → Blue → Indigo → Purple → Magenta → Orange → Red
- **Rotation:** Up-right (↗) → Right (→) → Down-right (↘)

### Animation Keyframes

| Frame | Color | File |
|-------|-------|------|
| 1 | Lime Green | `frame-01-green.png` |
| 2 | Yellow-Green | `frame-02-yellow-green.png` |
| 3 | Cyan | `frame-03-cyan.png` |
| 4 | Blue | `frame-04-blue.png` |
| 5 | Indigo | `frame-05-indigo.png` |
| 6 | Purple | `frame-06-purple.png` |
| 7 | Magenta | `frame-07-magenta.png` |
| 8 | Red-Orange | `frame-08-red-orange.png` |
| 9 | Orange | `frame-09-orange.png` |
| 10 | Golden | `frame-10-golden.png` |
| 11 | Red | `frame-11-red.png` |
| 12 | Red Final | `frame-12-red-final.png` |

### Video Scrubbing

The Flow Meter uses a 6.04-second video that scrubs to different timestamps based on user state and task load.

**Video Duration:** 6.04 seconds

**Starting Position by User State (0 tasks selected):**

| User State | Base % | Video Time | Arrow Position |
|------------|--------|------------|----------------|
| **Grounded** | 0% | 0.00s | Green (start) |
| **Scattered** | 50% | 3.02s | Blue (middle) |
| **Tired** | 85% | 5.13s | Red-orange (near end) |

**Formula:** `(capacityPercentage / 100) × 6.04s`

As users add tasks, the percentage increases from these starting points, scrubbing further into the video toward red/depleted. The video maxes out at 6.04s when capacity reaches 100%.

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

## KEY DECISIONS MADE

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Animation approach | Image sprites with crossfade | Uses Oscar's custom 3D renders |
| State affects start | Yes - Grounded=Green, Scattered=Blue, Tired=Red | More intuitive UX |
| Limit type | Soft (warning) not hard (blocking) | Respects user autonomy |
| Backend | None - localStorage only | Simplicity for MVP |

---

## 🎯 ROADMAP

### Quick Wins (Next Sprint)

| Feature | Priority | Complexity | Status |
|---------|----------|------------|--------|
| Dark/Light themes | High | Low | 🔲 TODO |
| Keyboard shortcuts | Medium | Low | 🔲 TODO |
| Mobile optimization | High | Medium | 🔲 TODO |

### High Impact (Planned)

| Feature | Priority | Complexity | Status |
|---------|----------|------------|--------|
| Lottie animation | High | Medium | 🔲 TODO |
| Onboarding flow | High | Medium | 🔲 TODO |
| Weekly review | Medium | Medium | 🔲 TODO |

### Future (Overwhelm Navigator Integration)

| Feature | Description | Status |
|---------|-------------|--------|
| Practices integration | Suggest practices to move Tired → Scattered → Grounded | 🔮 FUTURE |
| AI task suggestions | "Based on your energy, try these tasks" | 🔮 FUTURE |
| Smart scheduling | AI recommends optimal task timing | 🔮 FUTURE |
| Historical learning | Track planned vs actual, adjust estimates | 🔮 FUTURE |

---

## TECHNICAL NOTES

### Current Architecture

```
Next.js 14.2.35
├── React 18
├── TypeScript
├── Tailwind CSS
├── @dnd-kit (drag & drop)
└── localStorage (persistence)
```

### Animation Enhancement Path

**Current:** 12 PNG sprites with CSS opacity crossfade

**Planned:** Lottie animation for smoother real-time control

**Options evaluated:**
1. ✅ **Lottie** (Recommended) - Vector-based, small file, scrub to any position
2. Three.js/WebGL - Full 3D but complex
3. CSS Houdini - Limited 3D realism
4. Rive - Good but less ecosystem support

---

## AI INTEGRATION CONCEPTS

### Near-term: Task Suggestions

```
When user is Tired (6 pts):
→ AI suggests: "Here are 3 light tasks (2 pts each) that fit your energy"

When user is Grounded (18 pts):
→ AI suggests: "You have capacity for a heavy task. Want to tackle [X]?"
```

### Long-term: Overwhelm Navigator Bridge

```
User checks in as Tired
→ Flow State suggests: "Would you like a 5-minute grounding practice?"
→ User completes practice
→ State upgrades to Scattered (+3 pts)
→ Flow Meter adjusts
```

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-13 | Initial specification |
| 1.1 | 2026-01-13 | Updated post-implementation: marked phases complete, added roadmap, documented decisions |
| 1.1.1 | 2026-01-16 | Updated energy balance values (18/9/6), added video scrubbing timestamps |

---

## REFERENCES

- **Design Brief:** `docs/DESIGN_BRIEF.md`
- **Original Spec:** `docs/FLOW_STATE_SPEC.md`
- **Repository:** https://github.com/caducen/flow-state-

---

**END OF FLOW METER SPECIFICATION v1.1**
