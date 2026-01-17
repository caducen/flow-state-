'use client'

import { useState, useEffect } from 'react'
import { EnergySettings, DEFAULT_ENERGY_SETTINGS, USER_STATE_CONFIG } from '@/types'
import { EnergySlider } from './EnergySlider'

interface EnergyCustomizationScreenProps {
  settings: EnergySettings
  onSave: (settings: EnergySettings) => void
  onCancel?: () => void
  onReset?: () => void
  showResetButton?: boolean
  submitLabel?: string
}

export function EnergyCustomizationScreen({
  settings,
  onSave,
  onCancel,
  onReset,
  showResetButton = true,
  submitLabel = 'Save & Continue'
}: EnergyCustomizationScreenProps) {
  // Local state for editing
  const [localSettings, setLocalSettings] = useState<EnergySettings>(settings)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])

  // Sync with prop changes
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  // Update a single setting
  const updateSetting = (key: keyof EnergySettings, value: number) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  // Validate and generate warnings
  useEffect(() => {
    const newWarnings: string[] = []

    // Check energy state ordering
    if (localSettings.scattered > localSettings.grounded) {
      newWarnings.push('Scattered energy should be less than Grounded energy')
    }
    if (localSettings.tired > localSettings.scattered) {
      newWarnings.push('Tired energy should be less than Scattered energy')
    }

    // Check for extreme values
    if (localSettings.grounded > 40) {
      newWarnings.push("That's unusually high for Grounded! You can always adjust if needed.")
    }
    if (localSettings.tired < 3) {
      newWarnings.push("That's very low for Tired. Remember, this is about realistic capacity, not punishment.")
    }

    // Check for same values
    if (localSettings.grounded === localSettings.scattered &&
        localSettings.scattered === localSettings.tired) {
      newWarnings.push("When all states are the same, your check-in won't affect your capacity. Is this intentional?")
    }

    setWarnings(newWarnings)
  }, [localSettings])

  // Calculate example task cost
  const exampleTaskCost = localSettings.priorityHigh + localSettings.energyHigh
  const tasksPerGroundedDay = Math.floor(localSettings.grounded / exampleTaskCost)

  const handleSave = () => {
    onSave({
      ...localSettings,
      customized: true,
      lastUpdated: new Date().toISOString(),
    })
  }

  const handleReset = () => {
    setLocalSettings(DEFAULT_ENERGY_SETTINGS)
    setShowResetConfirm(false)
    onReset?.()
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Daily Energy States Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-subtle">
          <span className="text-base">💚</span>
          <h3 className="text-sm font-medium text-ink-rich">Daily Energy States</h3>
        </div>

        {/* Grounded Slider */}
        <EnergySlider
          value={localSettings.grounded}
          min={10}
          max={30}
          onChange={(v) => updateSetting('grounded', v)}
          label="Grounded"
          icon={USER_STATE_CONFIG.grounded.icon}
          description="How much can you handle on your best days?"
          color={USER_STATE_CONFIG.grounded.color}
        />

        {/* Scattered Slider */}
        <EnergySlider
          value={localSettings.scattered}
          min={5}
          max={15}
          onChange={(v) => updateSetting('scattered', v)}
          label="Scattered"
          icon={USER_STATE_CONFIG.scattered.icon}
          description="On busy, scattered days?"
          color={USER_STATE_CONFIG.scattered.color}
        />

        {/* Tired Slider */}
        <EnergySlider
          value={localSettings.tired}
          min={3}
          max={10}
          onChange={(v) => updateSetting('tired', v)}
          label="Tired"
          icon={USER_STATE_CONFIG.tired.icon}
          description="On your lowest-energy days?"
          color={USER_STATE_CONFIG.tired.color}
        />
      </div>

      {/* Advanced Settings Toggle */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink-base transition-colors"
        >
          <span className="text-base">⚡</span>
          <span>Task Weights (Advanced)</span>
          <svg
            className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Advanced Settings (Collapsed) */}
      {showAdvanced && (
        <div className="space-y-6 pl-4 border-l-2 border-subtle animate-fade-in">
          <p className="text-xs text-ink-muted">
            How much energy do different task types cost YOU?
          </p>

          {/* Priority Level Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              Priority Level
            </h4>

            <EnergySlider
              value={localSettings.priorityHigh}
              min={2}
              max={5}
              onChange={(v) => updateSetting('priorityHigh', v)}
              label="High Priority"
              color="#ef4444"
            />

            <EnergySlider
              value={localSettings.priorityMed}
              min={1}
              max={4}
              onChange={(v) => updateSetting('priorityMed', v)}
              label="Medium Priority"
              color="#f59e0b"
            />

            <EnergySlider
              value={localSettings.priorityLow}
              min={1}
              max={3}
              onChange={(v) => updateSetting('priorityLow', v)}
              label="Low Priority"
              color="#3b82f6"
            />
          </div>

          {/* Energy Required Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              Energy Required
            </h4>

            <EnergySlider
              value={localSettings.energyHigh}
              min={2}
              max={5}
              onChange={(v) => updateSetting('energyHigh', v)}
              label="High Energy"
              color="#f59e0b"
            />

            <EnergySlider
              value={localSettings.energyMed}
              min={1}
              max={4}
              onChange={(v) => updateSetting('energyMed', v)}
              label="Medium Energy"
              color="#8b9caa"
            />

            <EnergySlider
              value={localSettings.energyLow}
              min={1}
              max={3}
              onChange={(v) => updateSetting('energyLow', v)}
              label="Low Energy"
              color="#9a9fd8"
            />
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((warning, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20"
            >
              <span className="text-amber-500 text-sm">💡</span>
              <p className="text-xs text-amber-600 dark:text-amber-400">{warning}</p>
            </div>
          ))}
        </div>
      )}

      {/* Live Preview */}
      <div className="p-3 bg-surface-raised rounded-lg border border-subtle">
        <p className="text-xs text-ink-muted mb-2">💡 With these settings:</p>
        <p className="text-sm text-ink-base">
          A High Priority + High Energy task = <span className="font-mono font-bold text-amber-glow">{exampleTaskCost}</span> points
        </p>
        <p className="text-xs text-ink-muted mt-1">
          You could fit {tasksPerGroundedDay} of these in a Grounded day
        </p>
      </div>

      {/* Help text */}
      <p className="text-xs text-ink-muted text-center">
        💡 Not sure? Start with these and adjust as you learn!
      </p>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-subtle">
        {showResetButton ? (
          showResetConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-muted">Reset to standard values?</span>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs text-ink-muted hover:text-ink-base
                  bg-surface-raised rounded-lg transition-colors"
              >
                Keep Mine
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs text-rose-500 hover:text-rose-400
                  bg-rose-500/10 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1.5 text-xs text-ink-muted hover:text-ink-base
                bg-surface-raised rounded-lg transition-colors"
            >
              Reset to Standard
            </button>
          )
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-ink-muted hover:text-ink-base
                bg-surface-raised rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white
              bg-amber-glow hover:bg-amber-500 rounded-lg transition-colors"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
