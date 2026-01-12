# Flow State

A calm-tech Kanban task board designed to help you stay focused and organized without the overwhelm.

## Features

- **Kanban Board** - Drag-and-drop tasks between To Do, In Progress, and Complete columns
- **Today's 3** - Focus on what matters by marking up to 3 priority tasks for the day
- **Focus Mode** - Distraction-free view to work on a single task
- **Quick Todos** - Lightweight reminders that can be promoted to full tasks
- **Subtasks** - Break down tasks with checklists and track progress
- **Labels** - Categorize work with 11 built-in tags (Bug, Feature, Design, Research, etc.)
- **Energy Levels** - Tag tasks by energy required (High/Medium/Low)
- **State Check** - Track how you're feeling (Grounded/Scattered/Tired)
- **Dark Theme** - Easy on the eyes with warm, ambient design

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [@dnd-kit](https://dndkit.com/) - Drag and drop
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) - Client-side persistence

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flow-state.git
   cd flow-state
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
flow-state/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles and Tailwind
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/             # React components
│   ├── AddTaskModal.tsx    # Task creation/editing modal
│   ├── KanbanBoard.tsx     # Main board with columns
│   ├── KanbanCard.tsx      # Individual task card
│   ├── KanbanColumn.tsx    # Board column
│   ├── NoteArea.tsx        # Notes panel
│   ├── QuickTasks.tsx      # Quick tasks panel
│   └── TodoList.tsx        # Quick todos panel
├── hooks/                  # Custom React hooks
│   └── useLocalStorage.ts  # Persistence hook
├── types/                  # TypeScript types
│   └── index.ts            # Type definitions and configs
└── docs/                   # Documentation
```

## Usage

### Creating Tasks
Click the "+ Add task" button in the To Do column or press the + button.

### Editing Tasks
Click any task card to open the edit modal.

### Today's 3
Click the star icon on a task to add it to Today's 3 (max 3 tasks).

### Focus Mode
Click the expand icon on a task card or from Today's 3 bar to enter Focus Mode.

### Quick Todos
Use the Quick Todos panel for lightweight reminders. Click the up arrow to promote a todo to a full task.

## License

This project is for personal learning purposes.

## Acknowledgments

Built as a learning project with [Claude Code](https://claude.ai/code).
