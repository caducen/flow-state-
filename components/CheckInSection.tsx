'use client'

import { useState, useEffect } from 'react'
import { Task, UserState, USER_STATE_CONFIG, EnergySettings, DEFAULT_ENERGY_SETTINGS } from '@/types'
import { getSelectedWeight, getEnergyBalance, getEnergyZone, getEnergyZoneColor, getTimeInfo, formatCheckInTime } from '@/utils/flowMeter'

interface CheckInSectionProps {
  userState: UserState | null
  setUserState: (state: UserState | null) => void
  tasks: Task[]
  energySettings?: EnergySettings
}

export function CheckInSection({ userState, setUserState, tasks, energySettings = DEFAULT_ENERGY_SETTINGS }: CheckInSectionProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute for real-time accuracy
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  // Get base energy balance for the selected state
  const baseEnergyBalance = getEnergyBalance(userState, energySettings)

  // Calculate time-adjusted energy
  const timeInfo = userState ? getTimeInfo(baseEnergyBalance, currentTime) : null
  const energyBalance = timeInfo?.adjustedPoints ?? baseEnergyBalance

  const selectedWeight = getSelectedWeight(tasks, energySettings)
  const todayTaskCount = tasks.filter(t => t.isTodayTask).length

  return (
    <div className="mb-8">
      {/* Question */}
      <div className="mb-10">
        <span className="text-base text-ink-muted">How are you feeling?</span>
      </div>

      {/* State Buttons */}
      <div className="flex gap-3 flex-wrap mb-4">
        {(Object.keys(USER_STATE_CONFIG) as UserState[]).map((state) => {
          const config = USER_STATE_CONFIG[state]
          const isSelected = userState === state

          return (
            <button
              key={state}
              onClick={() => setUserState(isSelected ? null : state)}
              className={`
                group relative px-4 py-2.5 rounded-xl border-2 transition-all duration-200
                ${isSelected
                  ? 'border-transparent shadow-md'
                  : 'border-subtle bg-surface-base hover:bg-surface-raised hover:border-transparent'
                }
              `}
              style={isSelected ? {
                backgroundColor: `${config.color}15`,
                borderColor: `${config.color}40`,
              } : {}}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{config.icon}</span>
                <span
                  className={`font-medium ${isSelected ? '' : 'text-ink-muted group-hover:text-ink-base'}`}
                  style={isSelected ? { color: config.color } : {}}
                >
                  {config.label}
                </span>
                {isSelected && timeInfo && (
                  <span
                    className="ml-1 text-sm font-mono px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${config.color}20`,
                      color: config.color,
                    }}
                  >
                    {timeInfo.adjustedPoints}pts
                  </span>
                )}
              </div>

              {/* Description tooltip on hover - 2 o'clock position */}
              <div className="
                absolute left-3/4 bottom-full mb-2 -translate-x-1/4 px-3 py-1.5
                bg-surface-overlay text-ink-muted text-sm rounded-lg shadow-lg
                whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity
                pointer-events-none z-10
              ">
                {config.description}
              </div>
            </button>
          )
        })}
      </div>

      {/* Energy Display */}
      {userState && timeInfo && (
        <div className="space-y-3 animate-fade-in max-w-md">
          {/* Time-based info banner */}
          <div className="px-4 py-2.5 bg-surface-base rounded-xl border border-subtle">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="text-ink-faint">Checked in at</span>
              <span className="font-mono text-ink-muted">{formatCheckInTime(currentTime)}</span>
              <span className="text-ink-faint">·</span>
              {timeInfo.isEarlyBird ? (
                <span className="text-emerald-400">Early bird! Full energy available</span>
              ) : (
                <>
                  <span className="text-ink-faint">
                    {timeInfo.hoursRemaining}h remaining
                  </span>
                  {timeInfo.adjustedPoints < timeInfo.basePoints && (
                    <>
                      <span className="text-ink-faint">·</span>
                      <span className="text-ink-muted">
                        <span className="line-through text-ink-faint">{timeInfo.basePoints}</span>
                        {' → '}
                        <span className="font-semibold" style={{ color: USER_STATE_CONFIG[userState].color }}>
                          {timeInfo.adjustedPoints}pts
                        </span>
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Energy stats row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-surface-raised rounded-xl flex-wrap">
              {/* Starting Energy (time-adjusted) */}
              <div className="flex items-center gap-1.5">
                <span className="text-ink-muted text-base">Starting:</span>
                <span
                  className="font-mono font-semibold"
                  style={{ color: USER_STATE_CONFIG[userState].color }}
                >
                  {energyBalance}
                </span>
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-border-subtle" />

              {/* Used Energy */}
              <div className="flex items-center gap-1.5">
                <span className="text-ink-muted text-base">Used:</span>
                <span className="font-mono font-semibold text-ink-base">
                  {selectedWeight}
                </span>
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-border-subtle" />

              {/* Remaining Energy - uses gradient color */}
              <div className="flex items-center gap-1.5">
                <span className="text-ink-muted text-base">Remaining:</span>
                <span
                  className="font-mono font-semibold"
                  style={{ color: getEnergyZoneColor(getEnergyZone(selectedWeight, energyBalance, energySettings)) }}
                >
                  {Math.max(energyBalance - selectedWeight, 0)}
                </span>
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-border-subtle" />

              {/* Today's tasks count */}
              <div className="text-base text-ink-muted">
                {todayTaskCount} task{todayTaskCount !== 1 ? 's' : ''} selected
              </div>
            </div>

            {/* Clear hint */}
            <button
              onClick={() => setUserState(null)}
              className="text-sm text-ink-faint hover:text-ink-muted transition-colors"
            >
              clear
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
