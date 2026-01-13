'use client'

import { UserState, USER_STATE_CONFIG } from '@/types'

interface OverCapacityDialogProps {
  isOpen: boolean
  onClose: () => void
  userState: UserState
  energyBalance: number
  selectedWeight: number
  newTaskWeight: number
  onContinue: () => void
  onChangeState: (newState: UserState) => void
}

export function OverCapacityDialog({
  isOpen,
  onClose,
  userState,
  energyBalance,
  selectedWeight,
  newTaskWeight,
  onContinue,
  onChangeState,
}: OverCapacityDialogProps) {
  if (!isOpen) return null

  const totalWeight = selectedWeight + newTaskWeight
  const stateConfig = USER_STATE_CONFIG[userState]

  // Determine if we can suggest upgrading state
  const canUpgradeToGrounded = userState !== 'grounded'
  const canUpgradeToScattered = userState === 'tired'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="bg-surface-base border border-subtle rounded-2xl shadow-2xl overflow-hidden">
          {/* Warning glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-accent/20 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative p-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-accent/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-ink-rich">
                  Over Capacity
                </h3>
                <p className="text-sm text-ink-muted">
                  This might be ambitious for today
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-5 space-y-4">
            <p className="text-sm text-ink-muted">
              You're selecting more than your current Energy Balance.
            </p>

            {/* Stats */}
            <div className="bg-surface-raised rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Current State:</span>
                <span style={{ color: stateConfig.color }}>
                  {stateConfig.icon} {stateConfig.label}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Energy Balance:</span>
                <span className="text-ink-rich font-mono">{energyBalance} points</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Current Selection:</span>
                <span className="text-ink-rich font-mono">{selectedWeight} points</span>
              </div>
              <div className="flex justify-between text-sm border-t border-white/5 pt-2">
                <span className="text-ink-muted">After adding task:</span>
                <span className="text-rose-accent font-mono font-semibold">{totalWeight} points</span>
              </div>
            </div>

            <p className="text-sm text-ink-faint">
              Would you like to:
            </p>
          </div>

          {/* Actions */}
          <div className="relative p-5 pt-0 space-y-2">
            {/* Continue anyway */}
            <button
              onClick={onContinue}
              className="w-full px-4 py-3 text-sm font-medium text-left
                bg-surface-raised hover:bg-surface-overlay rounded-xl
                transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-ink-rich group-hover:text-amber-glow transition-colors">
                    Continue anyway
                  </div>
                  <div className="text-xs text-ink-faint">
                    I'm feeling good today
                  </div>
                </div>
                <svg className="w-5 h-5 text-ink-faint group-hover:text-amber-glow transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Review selections */}
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-sm font-medium text-left
                bg-surface-raised hover:bg-surface-overlay rounded-xl
                transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-ink-rich group-hover:text-cyan-400 transition-colors">
                    Review my selections
                  </div>
                  <div className="text-xs text-ink-faint">
                    Let me reconsider what's on my plate
                  </div>
                </div>
                <svg className="w-5 h-5 text-ink-faint group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </button>

            {/* Change state to Grounded */}
            {canUpgradeToGrounded && (
              <button
                onClick={() => onChangeState('grounded')}
                className="w-full px-4 py-3 text-sm font-medium text-left
                  bg-surface-raised hover:bg-surface-overlay rounded-xl
                  transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-ink-rich group-hover:text-emerald-400 transition-colors">
                      Change to Grounded
                    </div>
                    <div className="text-xs text-ink-faint">
                      +{USER_STATE_CONFIG.grounded.energyBalance - energyBalance} points ({USER_STATE_CONFIG.grounded.energyBalance} total)
                    </div>
                  </div>
                  <span className="text-lg">{USER_STATE_CONFIG.grounded.icon}</span>
                </div>
              </button>
            )}

            {/* Change state to Scattered (only if tired) */}
            {canUpgradeToScattered && (
              <button
                onClick={() => onChangeState('scattered')}
                className="w-full px-4 py-3 text-sm font-medium text-left
                  bg-surface-raised hover:bg-surface-overlay rounded-xl
                  transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-ink-rich group-hover:text-blue-400 transition-colors">
                      Change to Scattered
                    </div>
                    <div className="text-xs text-ink-faint">
                      +{USER_STATE_CONFIG.scattered.energyBalance - energyBalance} points ({USER_STATE_CONFIG.scattered.energyBalance} total)
                    </div>
                  </div>
                  <span className="text-lg">{USER_STATE_CONFIG.scattered.icon}</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
