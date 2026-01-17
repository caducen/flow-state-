'use client'

import { useLocalStorage } from './useLocalStorage'
import { EnergySettings, DEFAULT_ENERGY_SETTINGS, UserState, Priority, EnergyLevel } from '@/types'

// Analytics event type
export interface CustomizationEvent {
  timestamp: string
  oldValues: Partial<EnergySettings>
  newValues: Partial<EnergySettings>
  reason: 'first_time' | 'adjustment' | 'reset'
}

export interface EnergyAnalytics {
  customizationEvents: CustomizationEvent[]
}

const DEFAULT_ANALYTICS: EnergyAnalytics = {
  customizationEvents: []
}

export function useEnergySettings() {
  const [settings, setSettings] = useLocalStorage<EnergySettings>(
    'flow-energy-settings',
    DEFAULT_ENERGY_SETTINGS
  )

  const [analytics, setAnalytics] = useLocalStorage<EnergyAnalytics>(
    'flow-energy-analytics',
    DEFAULT_ANALYTICS
  )

  // Log a customization event
  const logCustomizationEvent = (
    oldSettings: EnergySettings,
    newSettings: EnergySettings,
    reason: CustomizationEvent['reason']
  ) => {
    const event: CustomizationEvent = {
      timestamp: new Date().toISOString(),
      oldValues: {
        grounded: oldSettings.grounded,
        scattered: oldSettings.scattered,
        tired: oldSettings.tired,
        priorityHigh: oldSettings.priorityHigh,
        priorityMed: oldSettings.priorityMed,
        priorityLow: oldSettings.priorityLow,
        energyHigh: oldSettings.energyHigh,
        energyMed: oldSettings.energyMed,
        energyLow: oldSettings.energyLow,
      },
      newValues: {
        grounded: newSettings.grounded,
        scattered: newSettings.scattered,
        tired: newSettings.tired,
        priorityHigh: newSettings.priorityHigh,
        priorityMed: newSettings.priorityMed,
        priorityLow: newSettings.priorityLow,
        energyHigh: newSettings.energyHigh,
        energyMed: newSettings.energyMed,
        energyLow: newSettings.energyLow,
      },
      reason,
    }

    setAnalytics(prev => ({
      ...prev,
      customizationEvents: [...prev.customizationEvents, event],
    }))
  }

  // Helper to update settings and mark as customized
  const updateSettings = (updates: Partial<EnergySettings>) => {
    const newSettings = {
      ...settings,
      ...updates,
      customized: true,
      lastUpdated: new Date().toISOString(),
    }

    // Determine reason based on current state
    const reason: CustomizationEvent['reason'] = settings.customized ? 'adjustment' : 'first_time'
    logCustomizationEvent(settings, newSettings, reason)

    setSettings(newSettings)
  }

  // Set settings directly (for use by the modal/screen)
  const setSettingsWithAnalytics = (newSettings: EnergySettings) => {
    const reason: CustomizationEvent['reason'] = settings.customized ? 'adjustment' : 'first_time'
    logCustomizationEvent(settings, newSettings, reason)
    setSettings(newSettings)
  }

  // Reset to defaults
  const resetToDefaults = () => {
    const newSettings = {
      ...DEFAULT_ENERGY_SETTINGS,
      customized: false,
      lastUpdated: new Date().toISOString(),
    }

    logCustomizationEvent(settings, newSettings, 'reset')
    setSettings(newSettings)
  }

  // Get energy balance for a user state
  const getEnergyForState = (state: UserState | null): number => {
    if (!state) return settings.scattered
    return settings[state]
  }

  // Get priority points
  const getPriorityPoints = (priority: Priority): number => {
    switch (priority) {
      case 'high': return settings.priorityHigh
      case 'medium': return settings.priorityMed
      case 'low': return settings.priorityLow
    }
  }

  // Get energy level points
  const getEnergyPoints = (energyLevel: EnergyLevel): number => {
    switch (energyLevel) {
      case 'high': return settings.energyHigh
      case 'medium': return settings.energyMed
      case 'low': return settings.energyLow
    }
  }

  // Get max energy (grounded is always the max)
  const getMaxEnergy = (): number => {
    return settings.grounded
  }

  // Get analytics summary
  const getAnalyticsSummary = () => {
    const events = analytics.customizationEvents
    return {
      totalCustomizations: events.length,
      firstTimeSetups: events.filter(e => e.reason === 'first_time').length,
      adjustments: events.filter(e => e.reason === 'adjustment').length,
      resets: events.filter(e => e.reason === 'reset').length,
      lastCustomization: events.length > 0 ? events[events.length - 1] : null,
    }
  }

  return {
    settings,
    setSettings: setSettingsWithAnalytics,
    updateSettings,
    resetToDefaults,
    getEnergyForState,
    getPriorityPoints,
    getEnergyPoints,
    getMaxEnergy,
    analytics,
    getAnalyticsSummary,
  }
}
