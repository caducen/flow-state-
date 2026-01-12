# Changelog

All notable changes to Flow State will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Roadmap

**Phase 2: Database (Supabase)**
- Set up Supabase project
- Create database schema for tasks, todos, notes
- Replace localStorage with Supabase persistence

**Phase 3: Authentication (Supabase Auth)**
- Add user sign-up and login
- Link data to user accounts
- Protect routes for authenticated users

**Phase 4: AI Integration (Claude API)**
- Add AI-powered task suggestions
- Smart task breakdown into subtasks
- Natural language task creation

**Phase 5: Deployment (Vercel)**
- Deploy to production
- Set up environment variables
- Configure custom domain (optional)

**Phase 6: Payments (Stripe)**
- Add subscription tiers
- Integrate Stripe checkout
- Manage billing and invoices

### Design Assets
- **Logo & Favicon System** - 3D glossy arrow pointer in three color variants:
  - Green (↗ up-right) — Progress/Positive state
  - Blue (→ right) — Neutral/Steady state
  - Red (↘ down-right) — Needs attention state
  - Style: Solid glossy 3D, polished plastic/ceramic look with highlights and shadows
  - See `docs/DESIGN_BRIEF.md` for full specifications

### UI Polish Ideas
- **Time-Aware Greeting** - Dynamic header based on time of day ("Good morning. What matters today?")
- **Completion Moment** - Subtle acknowledgment when Today's 3 are complete (gentle glow or message)
- **Keyboard Shortcuts** - Power user shortcuts (N for new task, F for focus, ? for help)
- **Empty Board Welcome** - Warm first-time user experience with gentle prompt

### Other
- Add LICENSE file (MIT or similar)

## [0.1.0] - 2026-01-12

### Added
- **Labels system** - 11 work-type tags (Bug, Feature, Design, Docs, Refactor, Research, Planning, Admin, Learning, Meeting, Review) with calm, soft colors
- **Edit tasks** - Click any task card to edit its details in a modal
- **Task vs Todo distinction** - Quick Todos for reminders, Tasks for actionable work units with "Promote to Task" functionality
- **Column empty states** - Helpful, encouraging messages when columns are empty
- **Today's 3** - Mark up to 3 priority tasks for the day with star toggle and top bar display
- **Today filter** - Toggle between All tasks and Today's tasks (due today or marked as Today's 3)
- **Focus Mode** - Distraction-free view for single task with Mark Complete and Edit actions
- **Energy levels** - Tag tasks as High/Medium/Low energy required
- **State Check** - Session-level mood indicator (Grounded/Scattered/Tired)
- **Subtasks** - Add checklist items to tasks with progress bar display
- **Keyboard accessibility** - Focus trapping in modals, focus-visible states, ARIA attributes
- **Dark theme** - Calm, warm dark design with ambient glows and subtle animations

### Technical
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- @dnd-kit for drag-and-drop
- localStorage for data persistence
