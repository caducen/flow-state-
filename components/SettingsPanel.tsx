'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { USER_STATE_CONFIG, EnergySettings, DEFAULT_ENERGY_SETTINGS } from '@/types'
import { EnergyCustomizationScreen } from './EnergyCustomizationScreen'

interface SettingsPanelProps {
  settings: EnergySettings
  onSettingsChange: (settings: EnergySettings) => void
  onReset: () => void
}

export function SettingsPanel({ settings, onSettingsChange, onReset }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Wait for client-side mount for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setShowCustomization(false)
  }

  const handleSaveSettings = (newSettings: EnergySettings) => {
    onSettingsChange(newSettings)
    setShowCustomization(false)
  }

  const handleReset = () => {
    onReset()
  }

  // Modal content
  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Panel - bottom sheet on mobile, centered on larger screens */}
      <div
        className={`
          relative w-full sm:w-auto sm:min-w-[360px] sm:max-w-md
          max-h-[85vh] overflow-hidden
          bg-surface-raised border-t sm:border border-subtle
          sm:rounded-2xl rounded-t-2xl
          shadow-xl
          animate-slide-up sm:animate-scale-in
        `}
      >
        {/* Drag handle for mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-ink-faint/30 rounded-full" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-2rem)]">
          {showCustomization ? (
            /* Customization Screen */
            <div>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setShowCustomization(false)}
                  className="p-1.5 -ml-1.5 text-ink-muted hover:text-ink-base
                    hover:bg-surface-overlay rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-base font-medium text-ink-rich">Customize Energy</h3>
                <div className="flex-1" />
                <button
                  onClick={handleClose}
                  className="p-1.5 text-ink-muted hover:text-ink-base
                    hover:bg-surface-overlay rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <EnergyCustomizationScreen
                settings={settings}
                onSave={handleSaveSettings}
                onCancel={() => setShowCustomization(false)}
                onReset={handleReset}
                showResetButton={true}
                submitLabel="Save Changes"
              />
            </div>
          ) : (
            /* Settings Overview */
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-ink-rich">Settings</h3>
                <button
                  onClick={handleClose}
                  className="p-1.5 text-ink-muted hover:text-ink-base
                    hover:bg-surface-overlay rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Energy Customization Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">
                      Energy Customization
                    </span>
                    {settings.customized && (
                      <span className="flex items-center gap-1 text-xs text-amber-glow">
                        <span>⚡</span>
                        Personalized
                      </span>
                    )}
                  </div>

                  {/* Current Values */}
                  <div className="p-3 bg-surface-base rounded-lg space-y-2">
                    {/* Grounded */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{USER_STATE_CONFIG.grounded.icon}</span>
                        <span className="text-sm text-ink-muted">Grounded</span>
                      </div>
                      <span
                        className="text-sm font-mono font-medium"
                        style={{ color: USER_STATE_CONFIG.grounded.color }}
                      >
                        {settings.grounded} pts
                      </span>
                    </div>

                    {/* Scattered */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{USER_STATE_CONFIG.scattered.icon}</span>
                        <span className="text-sm text-ink-muted">Scattered</span>
                      </div>
                      <span
                        className="text-sm font-mono font-medium"
                        style={{ color: USER_STATE_CONFIG.scattered.color }}
                      >
                        {settings.scattered} pts
                      </span>
                    </div>

                    {/* Tired */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{USER_STATE_CONFIG.tired.icon}</span>
                        <span className="text-sm text-ink-muted">Tired</span>
                      </div>
                      <span
                        className="text-sm font-mono font-medium"
                        style={{ color: USER_STATE_CONFIG.tired.color }}
                      >
                        {settings.tired} pts
                      </span>
                    </div>
                  </div>

                  {/* Adjust Button */}
                  <button
                    onClick={() => setShowCustomization(true)}
                    className="w-full py-3 px-4 text-sm font-medium
                      text-ink-base hover:text-ink-rich
                      bg-surface-base hover:bg-surface-overlay
                      border border-subtle rounded-xl
                      transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                    Adjust Energy Values
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-border-subtle" />

                {/* Future settings placeholder */}
                <p className="text-xs text-ink-faint italic text-center py-2">
                  More settings coming soon...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          relative w-10 h-10 rounded-xl
          bg-surface-raised hover:bg-surface-overlay
          border border-subtle
          flex items-center justify-center
          transition-all duration-200
          hover:scale-105
        `}
        aria-label="Settings"
        title="Settings"
      >
        <svg
          className="w-5 h-5 text-ink-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Modal rendered via portal to document.body */}
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  )
}
