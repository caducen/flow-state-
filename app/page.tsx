'use client'

import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Task, Label, UserState, DEFAULT_LABELS } from '@/types'
import { getSelectedWeight, getEnergyBalance } from '@/utils/flowMeter'
import { TaskList } from '@/components/TaskList'
import { QuickTodos, QuickTodo } from '@/components/QuickTodos'
import { CheckInSection } from '@/components/CheckInSection'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SettingsPanel } from '@/components/SettingsPanel'
import { EnergyCursor } from '@/components/EnergyCursor'
import { EnergyProgressBar } from '@/components/EnergyProgressBar'

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('flow-tasks-v3', [])
  const [quickTodos, setQuickTodos] = useLocalStorage<QuickTodo[]>('flow-quick-todos', [])
  const [labels, setLabels] = useLocalStorage<Label[]>('flow-labels', DEFAULT_LABELS)
  const [userState, setUserState] = useLocalStorage<UserState | null>('flow-user-state', null)
  const [energyCursorEnabled, setEnergyCursorEnabled] = useLocalStorage<boolean>('energyCursorEnabled', false)
  const [promotedTodo, setPromotedTodo] = useState<{ text: string; id: string } | null>(null)

  // Migrate old tasks to new format (add progress field)
  useEffect(() => {
    const needsMigration = tasks.some(t => t.progress === undefined)
    if (needsMigration) {
      setTasks(prev => prev.map(t => ({
        ...t,
        progress: t.progress ?? 0,
        status: t.status === 'complete' ? 'archived' : 'active',
      } as Task)))
    }
  }, [tasks, setTasks])

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

  // Count today's tasks
  const todayTaskCount = tasks.filter(t => t.isTodayTask && t.status === 'active').length

  return (
    <>
      {/* Energy Cursor - Custom cursor based on capacity */}
      <EnergyCursor
        enabled={energyCursorEnabled}
        selectedWeight={selectedWeight}
        energyBalance={energyBalance}
      />

      <div className="min-h-screen p-4 md:p-6 lg:p-10">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <h1 className="font-display text-2xl md:text-3xl font-medium text-ink-rich tracking-tight">
                  Flow State
                </h1>
                <span className="text-amber-glow text-sm font-mono">●</span>
              </div>
              <p className="text-ink-muted mt-1 text-sm tracking-wide">
                Organize your work, stay in the zone
              </p>
            </div>

            {/* Energy Cursor + Theme Toggle + Settings */}
            <div className="flex items-center gap-3">
              {/* Energy Cursor Checkbox */}
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={energyCursorEnabled}
                  onChange={(e) => setEnergyCursorEnabled(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-subtle bg-surface-raised
                    checked:bg-amber-glow checked:border-amber-glow
                    focus:ring-1 focus:ring-amber-glow/50 focus:ring-offset-0
                    cursor-pointer transition-colors"
                />
                <span className="text-xs text-ink-faint group-hover:text-ink-muted transition-colors">
                  Energy cursor
                </span>
              </label>

              <ThemeToggle />
              <SettingsPanel />
            </div>
          </div>
        </header>

        {/* State Check-in */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <CheckInSection
            userState={userState}
            setUserState={setUserState}
            tasks={tasks}
          />
        </div>

        {/* Energy Bar & Today's Count */}
        {userState && (
          <div className="mb-6 max-w-md animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-surface-base border-subtle rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-glow" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-xs font-medium text-ink-rich">Today's {todayTaskCount}</span>
                  <span className="text-xs text-ink-faint">/ 3</span>
                </div>
              </div>
              <EnergyProgressBar
                used={selectedWeight}
                total={energyBalance}
                compact={false}
                showLabel={false}
              />
            </div>
          </div>
        )}

        {/* Main Layout - Left-aligned, single column on mobile */}
        <div className="max-w-md space-y-6">
          {/* Quick Todos */}
          <div className="animate-slide-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
            <QuickTodos
              todos={quickTodos}
              setTodos={setQuickTodos}
              onPromote={handlePromoteTodo}
            />
          </div>

          {/* Tasks */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <TaskList
              tasks={tasks}
              setTasks={setTasks}
              labels={labels}
              setLabels={setLabels}
              promotedTodo={promotedTodo}
              onPromotedTodoHandled={handlePromotedTodoHandled}
            />
          </div>
        </div>
      </div>
    </>
  )
}
