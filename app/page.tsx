'use client'

import { useState, useCallback } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Task, TodoItem, Note, Label, UserState, DEFAULT_LABELS } from '@/types'
import { KanbanBoard } from '@/components/KanbanBoard'
import { TodoList } from '@/components/TodoList'
import { NoteArea } from '@/components/NoteArea'
import { QuickTasks, QuickTask } from '@/components/QuickTasks'
import { CheckInSection } from '@/components/CheckInSection'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SettingsPanel } from '@/components/SettingsPanel'

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('flow-tasks-v2', [])
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('flow-todos', [])
  const [notes, setNotes] = useLocalStorage<Note[]>('flow-notes', [])
  const [quickTasks, setQuickTasks] = useLocalStorage<QuickTask[]>('flow-quick-tasks', [])
  const [labels, setLabels] = useLocalStorage<Label[]>('flow-labels', DEFAULT_LABELS)
  const [userState, setUserState] = useLocalStorage<UserState | null>('flow-user-state', null)
  const [promotedTodo, setPromotedTodo] = useState<{ text: string; id: string } | null>(null)

  const handlePromoteTodo = useCallback((text: string, todoId: string) => {
    setPromotedTodo({ text, id: todoId })
    // Remove the todo after promoting
    setTodos(prev => prev.filter(t => t.id !== todoId))
  }, [setTodos])

  const handlePromotedTodoHandled = useCallback(() => {
    setPromotedTodo(null)
  }, [])

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <header className="mb-10 animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="font-display text-3xl md:text-4xl font-medium text-ink-rich tracking-tight">
                Flow State
              </h1>
              <span className="text-amber-glow text-sm font-mono">●</span>
            </div>
            <p className="text-ink-muted mt-2 text-sm tracking-wide">
              Organize your work, stay in the zone
            </p>
          </div>

          {/* Theme Toggle + Settings */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SettingsPanel />
          </div>
        </div>
      </header>

      {/* State Check-in */}
      <div className="animate-fade-in" style={{ animationDelay: '0.05s' }}>
        <CheckInSection
          userState={userState}
          setUserState={setUserState}
          tasks={tasks}
        />
      </div>

      {/* Main Layout */}
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left Column - Quick Tasks */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <QuickTasks tasks={quickTasks} setTasks={setQuickTasks} />
        </div>

        {/* Center - Kanban Board */}
        <main className="flex-1 min-w-0 animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <KanbanBoard
            tasks={tasks}
            setTasks={setTasks}
            labels={labels}
            setLabels={setLabels}
            userState={userState}
            setUserState={setUserState}
            promotedTodo={promotedTodo}
            onPromotedTodoHandled={handlePromotedTodoHandled}
          />
        </main>

        {/* Right Sidebar */}
        <aside className="w-full xl:w-[300px] flex flex-col gap-6 animate-slide-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <TodoList todos={todos} setTodos={setTodos} onPromote={handlePromoteTodo} />
          <NoteArea notes={notes} setNotes={setNotes} />
        </aside>
      </div>
    </div>
  )
}
