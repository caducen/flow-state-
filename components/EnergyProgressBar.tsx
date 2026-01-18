'use client'

import { DEFAULT_ENERGY_SETTINGS } from '@/types'

interface EnergyProgressBarProps {
  used: number        // Points used by selected tasks (e.g., 9)
  total: number       // Energy balance for current state (18/9/6)
  maxEnergy?: number  // Customizable max energy (grounded value)
  compact?: boolean   // Compact mode for smaller displays
  showLabel?: boolean // Show labels
}

export function EnergyProgressBar({
  used,
  total,
  maxEnergy = DEFAULT_ENERGY_SETTINGS.grounded,
  compact = false,
  showLabel = true
}: EnergyProgressBarProps) {
  // Calculate percentages for two-bar system
  const capacityPercentage = (total / maxEnergy) * 100
  const usedPercentage = (used / maxEnergy) * 100
  const usedOfCapacity = total > 0 ? (used / total) * 100 : 0
  const isOverCapacity = used > total

  // Color logic for Tasks Planned bar
  // Green (0-70%): Safe zone
  // Amber (70-100%): Getting close to limit
  // Red (>100%): Over capacity
  const getUsedBarColor = () => {
    if (isOverCapacity) return 'bg-rose-500'
    if (usedOfCapacity > 70) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const getUsedTextColor = () => {
    if (isOverCapacity) return 'text-rose-400'
    if (usedOfCapacity > 70) return 'text-amber-400'
    return 'text-emerald-400'
  }

  if (compact) {
    return (
      <div className="space-y-1.5">
        {/* Two compact bars stacked */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-faint w-12">Capacity</span>
          <div className="flex-1 h-1.5 bg-surface-overlay rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500/40"
              style={{ width: `${capacityPercentage}%` }}
            />
          </div>
          <span className="text-[10px] text-emerald-400 font-mono w-6 text-right">{total}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-faint w-12">Planned</span>
          <div className="flex-1 h-1.5 bg-surface-overlay rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getUsedBarColor()}`}
              style={{ width: `${Math.min(usedPercentage, 100)}%` }}
            />
          </div>
          <span className={`text-[10px] font-mono w-6 text-right ${getUsedTextColor()}`}>{used}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Bar 1: Your Capacity Today - Fixed, always shows total energy */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-muted">Your Capacity Today</span>
          <span className="text-xs text-emerald-400 font-mono">{total} points</span>
        </div>
        <div className="h-2.5 bg-surface-overlay rounded-full overflow-hidden relative">
          {/* Capacity bar - always green, shows total available */}
          <div
            className="h-full rounded-full bg-emerald-500/40 transition-all duration-500"
            style={{ width: `${capacityPercentage}%` }}
          />
        </div>
      </div>

      {/* Bar 2: Tasks Planned - Grows as tasks are added */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-muted">Tasks Planned</span>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-mono ${getUsedTextColor()}`}>
              {used} / {total} points
            </span>
            {usedOfCapacity > 0 && usedOfCapacity <= 100 && (
              <span className="text-[10px] text-ink-faint">
                ({Math.round(usedOfCapacity)}%)
              </span>
            )}
          </div>
        </div>
        <div className="h-2.5 bg-surface-overlay rounded-full overflow-hidden relative">
          {/* Capacity indicator line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-emerald-500/60 z-10"
            style={{ left: `${capacityPercentage}%` }}
          />
          {/* Used bar - grows as tasks are added */}
          <div
            className={`h-full rounded-full transition-all duration-300 ${getUsedBarColor()}`}
            style={{ width: `${Math.min(usedPercentage, 100)}%` }}
          />
          {/* Overflow indicator if over capacity */}
          {isOverCapacity && (
            <div
              className="absolute top-0 bottom-0 bg-rose-500/30 rounded-r-full"
              style={{
                left: `${capacityPercentage}%`,
                width: `${Math.min(usedPercentage - capacityPercentage, 100 - capacityPercentage)}%`
              }}
            />
          )}
        </div>
      </div>

      {/* Status message */}
      <div className="flex items-center gap-1.5 text-xs">
        {isOverCapacity ? (
          <>
            <svg className="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-rose-400">
              Over capacity by {used - total} points - consider removing a task
            </span>
          </>
        ) : usedOfCapacity > 70 ? (
          <>
            <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-amber-400">
              Getting close to your limit - {total - used} points remaining
            </span>
          </>
        ) : used > 0 ? (
          <>
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-emerald-400">
              Looking good! {total - used} points of capacity remaining
            </span>
          </>
        ) : (
          <span className="text-ink-faint">
            Star tasks below to add them to today's plan
          </span>
        )}
      </div>
    </div>
  )
}
