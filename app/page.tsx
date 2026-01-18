'use client'

import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useEnergySettings } from '@/hooks/useEnergySettings'
import { Task, Label, UserState, DEFAULT_LABELS, EnergySettings } from '@/types'
import { getSelectedWeight, getEnergyBalance } from '@/utils/flowMeter'
import { TaskList } from '@/components/TaskList'
import { QuickTodos, QuickTodo } from '@/components/QuickTodos'
import { CheckInSection } from '@/components/CheckInSection'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SettingsPanel } from '@/components/SettingsPanel'
import { EnergyCursor } from '@/components/EnergyCursor'
import { EnergyProgressBar } from '@/components/EnergyProgressBar'
import { EnergyCustomizationModal } from '@/components/EnergyCustomizationModal'

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('flow-tasks-v3', [])
  const [quickTodos, setQuickTodos] = useLocalStorage<QuickTodo[]>('flow-quick-todos', [])
  const [labels, setLabels] = useLocalStorage<Label[]>('flow-labels', DEFAULT_LABELS)
  const [userState, setUserState] = useLocalStorage<UserState | null>('flow-user-state', null)
  const [energyCursorEnabled, setEnergyCursorEnabled] = useLocalStorage<boolean>('energyCursorEnabled', false)
  const [hasSeenOnboarding, setHasSeenOnboarding, onboardingLoaded] = useLocalStorage<boolean>('flow-seen-onboarding', false)
  const [promotedTodo, setPromotedTodo] = useState<{ text: string; id: string } | null>(null)
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)
  const { settings: energySettings, setSettings: setEnergySettings, resetToDefaults: resetEnergySettings } = useEnergySettings()

  // Migrate old tasks to new format (add progress field)
  useEffect(() => {
    const needsMigration = tasks.some(t => t.progress === undefined)
    if (needsMigration) {
      setTasks(prev => prev.map(t => ({
        ...t,
        progress: t.progress ?? 0,
        // Handle legacy 'complete' status from old format
        status: (t.status as string) === 'complete' ? 'archived' : (t.status || 'active'),
      } as Task)))
    }
  }, [tasks, setTasks])

  // Show onboarding modal for first-time users
  useEffect(() => {
    // Wait for localStorage to load before checking
    if (!onboardingLoaded) return

    // Only show if user hasn't seen onboarding yet
    if (!hasSeenOnboarding) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => {
        setShowOnboardingModal(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [hasSeenOnboarding, onboardingLoaded])

  // Handle onboarding modal close
  const handleOnboardingClose = useCallback((settings: EnergySettings, skipped: boolean) => {
    setEnergySettings(settings)
    setHasSeenOnboarding(true)
    setShowOnboardingModal(false)
  }, [setEnergySettings, setHasSeenOnboarding])

  const handlePromoteTodo = useCallback((text: string, todoId: string) => {
    setPromotedTodo({ text, id: todoId })
    // Remove the todo after promoting
    setQuickTodos(prev => prev.filter(t => t.id !== todoId))
  }, [setQuickTodos])

  const handlePromotedTodoHandled = useCallback(() => {
    setPromotedTodo(null)
  }, [])

  // Calculate energy values for the cursor and progress bar
  const selectedWeight = getSelectedWeight(tasks, energySettings)
  const energyBalance = getEnergyBalance(userState, energySettings)

  // Count today's tasks
  const todayTaskCount = tasks.filter(t => t.isTodayTask && t.status === 'active').length

  return (
    <>
      {/* First-time onboarding modal */}
      <EnergyCustomizationModal
        isOpen={showOnboardingModal}
        onClose={handleOnboardingClose}
        initialSettings={energySettings}
      />

      {/* Energy Cursor - Custom cursor based on capacity */}
      <EnergyCursor
        enabled={energyCursorEnabled}
        selectedWeight={selectedWeight}
        energyBalance={energyBalance}
        maxEnergy={energySettings.grounded}
      />

      <div className="min-h-screen p-4 md:p-6 lg:p-10">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl md:text-3xl font-medium text-ink-rich tracking-tight">
                  Flow State
                </h1>
                <video
                  src="/Logo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-14 md:h-16 w-auto mix-blend-multiply rounded-xl"
                  aria-hidden="true"
                />
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
              <SettingsPanel
                settings={energySettings}
                onSettingsChange={setEnergySettings}
                onReset={resetEnergySettings}
              />
            </div>
          </div>
        </header>

        {/* State Check-in */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <CheckInSection
            userState={userState}
            setUserState={setUserState}
            tasks={tasks}
            energySettings={energySettings}
          />
        </div>

        {/* Energy Bar & Today's Plan */}
        {userState && (
          <div className="mb-6 max-w-md animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-surface-base border-subtle rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span title="Click stars on tasks below to select them for today">
                  <svg className="w-5 h-5 text-amber-glow drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-ink-rich">Today's Plan</span>
                {todayTaskCount > 0 && (
                  <span className="text-xs text-amber-glow/80">{todayTaskCount} selected</span>
                )}
              </div>
              <p className="text-[11px] text-ink-faint mb-3">
                Click the <span className="text-amber-glow">star</span> on any task to add it to today's plan.
                The bar below shows how much of your energy you're committing.
              </p>
              <EnergyProgressBar
                used={selectedWeight}
                total={energyBalance}
                maxEnergy={energySettings.grounded}
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
              energySettings={energySettings}
            />
          </div>
        </div>
      </div>
    </>
  )
}
