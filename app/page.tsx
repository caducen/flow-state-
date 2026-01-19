'use client'

import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useEnergySettings } from '@/hooks/useEnergySettings'
import { Task, Label, UserState, DEFAULT_LABELS, EnergySettings } from '@/types'
import { getSelectedWeight, getEnergyBalance, getTimeAdjustedPoints } from '@/utils/flowMeter'
import { TaskList } from '@/components/TaskList'
import { QuickTodos, QuickTodo } from '@/components/QuickTodos'
import { CheckInSection } from '@/components/CheckInSection'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SettingsPanel } from '@/components/SettingsPanel'
import { EnergyCursor } from '@/components/EnergyCursor'
import { EnergyProgressBar } from '@/components/EnergyProgressBar'
import { EnergyCustomizationModal } from '@/components/EnergyCustomizationModal'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { AmbientBackground } from '@/components/AmbientBackground'
import { AnimatePresence } from 'framer-motion'

// Helper to format hour as readable time
function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:00 ${period}`
}

// Calculate end hour of 12-hour window
function getWindowEnd(start: number): number {
  return (start + 12) % 24
}

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('flow-tasks-v3', [])
  const [quickTodos, setQuickTodos] = useLocalStorage<QuickTodo[]>('flow-quick-todos', [])
  const [labels, setLabels] = useLocalStorage<Label[]>('flow-labels', DEFAULT_LABELS)
  const [userState, setUserState] = useLocalStorage<UserState | null>('flow-user-state', null)
  const [lastCheckInDate, setLastCheckInDate] = useLocalStorage<string | null>('flow-last-checkin-date', null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [energyCursorEnabled, setEnergyCursorEnabled] = useLocalStorage<boolean>('energyCursorEnabled', false)
  const [hasSeenOnboarding, setHasSeenOnboarding, onboardingLoaded] = useLocalStorage<boolean>('flow-seen-onboarding', false)
  const [promotedTodo, setPromotedTodo] = useState<{ text: string; id: string } | null>(null)
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)
  const { settings: energySettings, setSettings: setEnergySettings, resetToDefaults: resetEnergySettings } = useEnergySettings()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showInstructions, setShowInstructions] = useState(false)
  const [instructionsHovered, setInstructionsHovered] = useState(false)

  // Update time every minute for real-time accuracy
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  // Check if user needs to see welcome screen (daily check-in)
  useEffect(() => {
    const today = new Date().toDateString()
    // Show welcome if no check-in today or no state selected
    if (lastCheckInDate !== today || !userState) {
      setShowWelcome(true)
    }
  }, [lastCheckInDate, userState])

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

  // Handle welcome screen state selection
  const handleWelcomeStateSelect = useCallback((state: UserState) => {
    setUserState(state)
    setLastCheckInDate(new Date().toDateString())
    setShowWelcome(false)
  }, [setUserState, setLastCheckInDate])

  // Handle recalibrate (show welcome screen again)
  const handleRecalibrate = useCallback(() => {
    setShowWelcome(true)
  }, [])

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
  const baseEnergyBalance = getEnergyBalance(userState, energySettings)
  // Apply time-based adjustment to energy balance (respects custom work window)
  const energyBalance = userState
    ? getTimeAdjustedPoints(baseEnergyBalance, currentTime, energySettings.workWindowStart ?? 7)
    : baseEnergyBalance

  // Count today's tasks
  const todayTaskCount = tasks.filter(t => t.isTodayTask && t.status === 'active').length

  return (
    <>
      {/* Dashboard Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          src="/dashboard-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-surface-deep/60" />
      </div>

      {/* Ambient Background - Drifting orbs */}
      <AmbientBackground />

      {/* Welcome Screen - Daily check-in ceremony */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen
            onSelectState={handleWelcomeStateSelect}
            energySettings={energySettings}
          />
        )}
      </AnimatePresence>

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

      <div className="min-h-screen p-4 md:p-6 lg:p-10 relative z-10">
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

            {/* Instructions + Energy Cursor + Recalibrate + Theme Toggle + Settings */}
            <div className="flex items-center gap-3">
              {/* Instructions Button */}
              <div className="relative">
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  onMouseEnter={() => setInstructionsHovered(true)}
                  onMouseLeave={() => setInstructionsHovered(false)}
                  className={`p-2 rounded-lg transition-all group ${
                    showInstructions
                      ? 'bg-amber-glow/20 text-amber-glow'
                      : 'hover:bg-surface-raised text-ink-faint hover:text-ink-muted'
                  }`}
                  title="Instructions"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                {/* Hover tooltip (only when not pinned) */}
                {instructionsHovered && !showInstructions && (
                  <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-surface-overlay border border-white/10 rounded-lg shadow-xl z-50">
                    <p className="text-xs text-ink-muted">Click to show setup instructions</p>
                  </div>
                )}
              </div>

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

              {/* Recalibrate Button */}
              <button
                onClick={handleRecalibrate}
                className="p-2 rounded-lg hover:bg-surface-raised transition-all group"
                title="Recalibrate energy"
              >
                <svg
                  className="w-4 h-4 text-ink-faint group-hover:text-ink-muted group-hover:rotate-180 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

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

        {/* Instructions Panel - Pinned */}
        {showInstructions && (
          <div className="mb-6 max-w-md animate-fade-in">
            <div className="bg-surface-base border border-amber-glow/30 rounded-xl p-4 relative">
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute top-3 right-3 p-1 text-ink-faint hover:text-ink-muted transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-glow">💡</span>
                <span className="text-sm font-medium text-ink-rich">Getting Started</span>
              </div>

              <ol className="space-y-2 text-sm text-ink-muted">
                <li className="flex gap-2">
                  <span className="text-amber-glow font-mono">1.</span>
                  <span><strong className="text-ink-rich">Check in</strong> — Select how you're feeling today (Grounded, Scattered, or Tired)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-glow font-mono">2.</span>
                  <span><strong className="text-ink-rich">Set your window</strong> — Adjust when your 12-hour productive period starts</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-glow font-mono">3.</span>
                  <span><strong className="text-ink-rich">Add tasks</strong> — Create tasks with priority and energy levels</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-glow font-mono">4.</span>
                  <span><strong className="text-ink-rich">Star tasks</strong> — Click ⭐ to add tasks to today's plan</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-glow font-mono">5.</span>
                  <span><strong className="text-ink-rich">Stay balanced</strong> — Keep your energy bar in the green zone</span>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Work Window Slider */}
        {userState && (
          <div className="mb-4 max-w-md animate-fade-in" style={{ animationDelay: '0.08s' }}>
            <div className="bg-surface-base border-subtle rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">⏰</span>
                  <span className="text-sm font-medium text-ink-rich">Work Window</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-ink-faint">🌅</span>
                  <span className="font-mono text-amber-glow">{formatHour(energySettings.workWindowStart ?? 7)}</span>
                  <span className="text-ink-faint">→</span>
                  <span className="text-ink-faint">🌙</span>
                  <span className="font-mono text-ink-muted">{formatHour(getWindowEnd(energySettings.workWindowStart ?? 7))}</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="23"
                value={energySettings.workWindowStart ?? 7}
                onChange={(e) => {
                  const newStart = parseInt(e.target.value, 10)
                  setEnergySettings({
                    ...energySettings,
                    workWindowStart: newStart,
                    customized: true,
                    lastUpdated: new Date().toISOString(),
                  })
                }}
                className="w-full h-2 bg-surface-raised rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-amber-glow
                  [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:w-5
                  [&::-moz-range-thumb]:h-5
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-amber-glow
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:shadow-lg
                  [&::-moz-range-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-ink-faint mt-1">
                <span>12AM</span>
                <span>6AM</span>
                <span>12PM</span>
                <span>6PM</span>
                <span>11PM</span>
              </div>
            </div>
          </div>
        )}

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
          {/* Quick Todos - higher z-index for tooltip visibility */}
          <div className="animate-slide-up relative z-20" style={{ animationDelay: '0.15s', opacity: 0 }}>
            <QuickTodos
              todos={quickTodos}
              setTodos={setQuickTodos}
              onPromote={handlePromoteTodo}
            />
          </div>

          {/* Tasks - lower z-index */}
          <div className="animate-slide-up relative z-10" style={{ animationDelay: '0.2s', opacity: 0 }}>
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
