'use client'

import { UserState, USER_STATE_CONFIG, EnergySettings, DEFAULT_ENERGY_SETTINGS } from '@/types'
import { motion } from 'framer-motion'

interface WelcomeScreenProps {
  onSelectState: (state: UserState) => void
  energySettings?: EnergySettings
}

export function WelcomeScreen({ onSelectState, energySettings = DEFAULT_ENERGY_SETTINGS }: WelcomeScreenProps) {
  const states: UserState[] = ['grounded', 'scattered', 'tired']

  // Get energy points from settings
  const getEnergyPoints = (state: UserState): number => {
    return energySettings[state]
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
    >
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          src="/welcome-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-surface-deep/70" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center mb-12 z-10"
      >
        <h1 className="text-dramatic text-4xl md:text-5xl lg:text-6xl text-ink-rich mb-4">
          Welcome to the Flow.
        </h1>
        <p className="text-lg text-ink-muted">
          Before we begin, let's calibrate your capacity.
        </p>
      </motion.div>

      {/* State Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl px-4 z-10">
        {states.map((state, index) => {
          const config = USER_STATE_CONFIG[state]
          const points = getEnergyPoints(state)

          return (
            <motion.button
              key={state}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectState(state)}
              className="glass-panel p-6 md:p-8 rounded-2xl text-center group cursor-pointer"
            >
              {/* Icon */}
              <motion.div
                className="text-5xl md:text-6xl mb-4"
                whileHover={{ scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {config.icon}
              </motion.div>

              {/* State Name */}
              <h3
                className="text-xl md:text-2xl font-medium mb-2 transition-colors"
                style={{ color: config.color }}
              >
                {config.label}
              </h3>

              {/* Description */}
              <p className="text-sm text-ink-muted mb-4 leading-relaxed">
                {config.description}
              </p>

              {/* Points Badge */}
              <span
                className="glass-subtle inline-block px-4 py-2 rounded-full text-data text-sm"
                style={{ color: config.color }}
              >
                {points} Points
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="text-center mt-12 z-10"
      >
        <p className="text-sm text-ink-faint">
          Select your current state to begin your session.
        </p>
        <p className="text-xs text-ink-faint/60 mt-2 flex items-center justify-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Energy points can be customized in Settings
        </p>
      </motion.div>
    </motion.div>
  )
}
