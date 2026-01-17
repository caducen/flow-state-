'use client'

import { useState } from 'react'
import { EnergySettings, DEFAULT_ENERGY_SETTINGS } from '@/types'
import { EnergyCustomizationScreen } from './EnergyCustomizationScreen'

interface EnergyCustomizationModalProps {
  isOpen: boolean
  onClose: (settings: EnergySettings, skipped: boolean) => void
  initialSettings?: EnergySettings
}

type ModalStep = 'welcome' | 'customize'

export function EnergyCustomizationModal({
  isOpen,
  onClose,
  initialSettings = DEFAULT_ENERGY_SETTINGS
}: EnergyCustomizationModalProps) {
  const [step, setStep] = useState<ModalStep>('welcome')
  const [settings, setSettings] = useState<EnergySettings>(initialSettings)

  if (!isOpen) return null

  const handleUseStandard = () => {
    onClose(DEFAULT_ENERGY_SETTINGS, true)
  }

  const handleCustomize = () => {
    setStep('customize')
  }

  const handleSave = (newSettings: EnergySettings) => {
    setSettings(newSettings)
    onClose(newSettings, false)
  }

  const handleBack = () => {
    setStep('welcome')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => {}} // Prevent closing by clicking backdrop for first-time setup
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface-base rounded-2xl shadow-xl
        border border-subtle overflow-hidden animate-scale-in">

        {step === 'welcome' ? (
          /* Welcome Screen */
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="text-4xl">✨</span>
              <h2 className="text-xl font-display font-medium text-ink-rich">
                Personalize Your Energy
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm text-ink-muted text-center leading-relaxed">
              Everyone's capacity is different. These starting values help Flow State match{' '}
              <span className="text-ink-base font-medium">YOUR</span> reality — not someone else's.
            </p>

            <p className="text-xs text-ink-faint text-center">
              You can always adjust these later as you learn more about yourself.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleCustomize}
                className="w-full py-3 px-4 text-sm font-medium text-white
                  bg-amber-glow hover:bg-amber-500 rounded-xl transition-colors"
              >
                Customize My Values
              </button>

              <button
                onClick={handleUseStandard}
                className="w-full py-3 px-4 text-sm text-ink-muted
                  bg-surface-raised hover:bg-surface-overlay rounded-xl transition-colors"
              >
                Use Standard Values
              </button>
            </div>

            {/* Standard values hint */}
            <p className="text-xs text-ink-faint text-center">
              Standard: Grounded 18 / Scattered 9 / Tired 6
            </p>
          </div>
        ) : (
          /* Customization Screen */
          <div className="p-6">
            {/* Header with back button */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleBack}
                className="p-1.5 -ml-1.5 text-ink-muted hover:text-ink-base
                  hover:bg-surface-raised rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-lg font-display font-medium text-ink-rich">
                Customize Your Energy
              </h2>
            </div>

            <EnergyCustomizationScreen
              settings={settings}
              onSave={handleSave}
              onCancel={handleBack}
              showResetButton={false}
              submitLabel="Save & Continue"
            />
          </div>
        )}
      </div>
    </div>
  )
}
