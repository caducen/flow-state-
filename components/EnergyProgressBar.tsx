'use client'

import { DEFAULT_ENERGY_SETTINGS } from '@/types'

interface EnergyProgressBarProps {
  used: number        // Points used by selected tasks (e.g., 9)
  total: number       // Energy balance for current state (18/9/6)
  maxEnergy?: number  // Customizable max energy (grounded value)
  compact?: boolean   // Compact mode for smaller displays
  showLabel?: boolean // Show "Energy" label
}

export function EnergyProgressBar({
  used,
  total,
  maxEnergy = DEFAULT_ENERGY_SETTINGS.grounded,
  compact = false,
  showLabel = true
}: EnergyProgressBarProps) {
  // Calculate REMAINING energy (fuel gauge style)
  const remaining = Math.max(total - used, 0)
  const percentage = (remaining / maxEnergy) * 100
  const isOverCapacity = used > total
  const displayPercentage = Math.max(percentage, 0)

  // Color logic based on remaining energy (fuel gauge with gradient)
  // 80-100% = Green (full tank)
  // 60-80%  = Cyan (good)
  // 45-60%  = Blue (half tank)
  // 30-45%  = Purple (getting low)
  // 15-30%  = Orange (low fuel warning)
  // 0-15%   = Red (critical)
  const getBarColor = () => {
    if (isOverCapacity) return 'bg-rose-500'
    if (percentage > 80) return 'bg-emerald-500'
    if (percentage > 60) return 'bg-cyan-500'
    if (percentage > 45) return 'bg-blue-500'
    if (percentage > 30) return 'bg-violet-500'
    if (percentage > 15) return 'bg-orange-500'
    return 'bg-rose-500'
  }

  const getTextColor = () => {
    if (isOverCapacity) return 'text-rose-400'
    if (percentage > 80) return 'text-emerald-400'
    if (percentage > 60) return 'text-cyan-400'
    if (percentage > 45) return 'text-blue-400'
    if (percentage > 30) return 'text-violet-400'
    if (percentage > 15) return 'text-orange-400'
    return 'text-rose-400'
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Compact bar - fuel gauge style */}
        <div className="w-20 h-2 bg-surface-overlay rounded-full overflow-hidden relative">
          {/* Quarter markers */}
          <div className="absolute inset-0 flex justify-between px-px">
            <div className="w-px h-full bg-ink-faint/20" />
            <div className="w-px h-full bg-ink-faint/20" />
            <div className="w-px h-full bg-ink-faint/20" />
          </div>
          {/* Fill bar */}
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${displayPercentage}%` }}
          />
        </div>
        {/* Compact text - show remaining */}
        <span className={`text-xs font-mono ${getTextColor()}`}>
          {remaining}/{maxEnergy}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      {/* Label and points */}
      <div className="flex items-center justify-between">
        {showLabel && (
          <span className="text-xs text-ink-muted">Energy</span>
        )}
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-mono font-medium ${getTextColor()}`}>
            {remaining}/{maxEnergy}
          </span>
          <span className="text-xs text-ink-faint">remaining</span>
          {isOverCapacity && (
            <span className="text-xs text-rose-400 ml-1">
              (overloaded by {used - total})
            </span>
          )}
        </div>
      </div>

      {/* Progress bar - fuel gauge with markers */}
      <div className="h-3 bg-surface-overlay rounded-full overflow-hidden relative">
        {/* Quarter markers at 25%, 50%, 75% */}
        <div className="absolute inset-y-0 left-1/4 w-px bg-ink-faint/30 z-10" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-ink-faint/30 z-10" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-ink-faint/30 z-10" />

        {/* Fill bar */}
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>

      {/* Markers labels */}
      <div className="flex justify-between text-[10px] text-ink-faint px-0.5">
        <span>E</span>
        <span>¼</span>
        <span>½</span>
        <span>¾</span>
        <span>F</span>
      </div>

      {/* Over capacity warning */}
      {isOverCapacity && (
        <div className="flex items-center gap-1 text-xs text-rose-400">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Over capacity - you may be overcommitting</span>
        </div>
      )}
    </div>
  )
}
