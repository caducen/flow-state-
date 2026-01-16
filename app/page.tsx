'use client'

import { useState, useCallback } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Task, Label, UserState, DEFAULT_LABELS } from '@/types'
import { getSelectedWeight, getEnergyBalance } from '@/utils/flowMeter'
import { KanbanBoard } from '@/components/KanbanBoard'
import { QuickTodos, QuickTodo } from '@/components/QuickTodos'
import { CheckInSection } from '@/components/CheckInSection'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SettingsPanel } from '@/components/SettingsPanel'
import { EnergyCursor } from '@/components/EnergyCursor'

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('flow-tasks-v2', [])
  const [quickTodos, setQuickTodos] = useLocalStorage<QuickTodo[]>('flow-quick-todos', [])
  const [labels, setLabels] = useLocalStorage<Label[]>('flow-labels', DEFAULT_LABELS)
  const [userState, setUserState] = useLocalStorage<UserState | null>('flow-user-state', null)
  const [energyCursorEnabled, setEnergyCursorEnabled] = useLocalStorage<boolean>('energyCursorEnabled', false)
  const [promotedTodo, setPromotedTodo] = useState<{ text: string; id: string } | null>(null)

  const handlePromoteTodo = useCallback((text: string, todoId: string) => {
    setPromotedTodo({ text, id: todoId })
    // Remove the todo after promoting
    setQuickTodos(prev => prev.filter(t => t.id !== todoId))
  }, [setQuickTodos])

  const handlePromotedTodoHandled = useCallback(() => {
    setPromotedTodo(null)
  }, [])

  // Calculate energy values for the cursor and progress bar
  const selectedWeight = getSelectedWeight(tasks)
  const energyBalance = getEnergyBalance(userState)

  return (
    <>
      {/* Energy Cursor - Custom cursor based on capacity */}
      <EnergyCursor
        enabled={energyCursorEnabled}
        selectedWeight={selectedWeight}
        energyBalance={energyBalance}
      />

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
            <SettingsPanel
              energyCursorEnabled={energyCursorEnabled}
              onEnergyCursorChange={setEnergyCursorEnabled}
            />
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

      {/* Main Layout - Two column: Quick Todos + Kanban */}
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left Column - Quick Todos */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <QuickTodos
            todos={quickTodos}
            setTodos={setQuickTodos}
            onPromote={handlePromoteTodo}
          />
        </div>

        {/* Center - Kanban Board (Tasks) */}
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
      </div>
      </div>
    </>
  )
}
