'use client'

interface EnergyProgressBarProps {
  used: number        // Points used (e.g., 9)
  total: number       // Total points (e.g., 18)
  compact?: boolean   // Compact mode for smaller displays
  showLabel?: boolean // Show "Energy" label
}

export function EnergyProgressBar({
  used,
  total,
  compact = false,
  showLabel = true
}: EnergyProgressBarProps) {
  const percentage = total > 0 ? (used / total) * 100 : 0
  const isOverCapacity = percentage > 100
  const cappedPercentage = Math.min(percentage, 100)

  // Color logic based on capacity zones
  const getBarColor = () => {
    if (percentage > 100) return 'bg-rose-500'
    if (percentage > 70) return 'bg-blue-500'
    return 'bg-emerald-500'
  }

  const getTextColor = () => {
    if (percentage > 100) return 'text-rose-400'
    if (percentage > 70) return 'text-blue-400'
    return 'text-emerald-400'
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Compact bar */}
        <div className="w-16 h-1.5 bg-surface-overlay rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getBarColor()}`}
            style={{ width: `${cappedPercentage}%` }}
          />
        </div>
        {/* Compact text */}
        <span className={`text-xs font-mono ${getTextColor()}`}>
          {used}/{total}
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
            {used}/{total}
          </span>
          <span className="text-xs text-ink-faint">points</span>
          {isOverCapacity && (
            <span className="text-xs text-rose-400 ml-1">
              ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-surface-overlay rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${cappedPercentage}%` }}
        />
      </div>

      {/* Over capacity warning */}
      {isOverCapacity && (
        <div className="flex items-center gap-1 text-xs text-rose-400">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Over capacity</span>
        </div>
      )}
    </div>
  )
}
