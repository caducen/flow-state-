'use client'

import { useEffect, useState, useCallback } from 'react'
import { DEFAULT_ENERGY_SETTINGS } from '@/types'

interface EnergyCursorProps {
  enabled: boolean
  selectedWeight: number
  energyBalance: number
  maxEnergy?: number  // Customizable max energy (grounded value)
}

type CursorState = 'green' | 'cyan' | 'blue' | 'purple' | 'orange' | 'red'

export function EnergyCursor({ enabled, selectedWeight, energyBalance, maxEnergy = DEFAULT_ENERGY_SETTINGS.grounded }: EnergyCursorProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Calculate REMAINING energy (fuel gauge style)
  const remaining = Math.max(energyBalance - selectedWeight, 0)
  const remainingPercent = (remaining / maxEnergy) * 100
  const isOverCapacity = selectedWeight > energyBalance

  // Determine cursor state based on remaining energy (fuel gauge with gradient)
  // 80-100% = Green (full tank)
  // 60-80%  = Cyan (good)
  // 45-60%  = Blue (half tank)
  // 30-45%  = Purple (getting low)
  // 15-30%  = Orange (low fuel warning)
  // 0-15%   = Red (critical)
  const getCursorState = useCallback((): CursorState => {
    if (isOverCapacity) return 'red'
    if (remainingPercent > 80) return 'green'
    if (remainingPercent > 60) return 'cyan'
    if (remainingPercent > 45) return 'blue'
    if (remainingPercent > 30) return 'purple'
    if (remainingPercent > 15) return 'orange'
    return 'red'
  }, [remainingPercent, isOverCapacity])

  const cursorState = getCursorState()

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      )
    }
    checkTouchDevice()
  }, [])

  // Track mouse position
  useEffect(() => {
    if (!enabled || isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [enabled, isTouchDevice, isVisible])

  // Add/remove cursor-hiding class on body
  useEffect(() => {
    if (enabled && !isTouchDevice) {
      document.body.classList.add('energy-cursor-enabled')
    } else {
      document.body.classList.remove('energy-cursor-enabled')
    }

    return () => {
      document.body.classList.remove('energy-cursor-enabled')
    }
  }, [enabled, isTouchDevice])

  // Don't render on touch devices or when disabled
  if (!enabled || isTouchDevice) return null

  // Get glow color for the shadow
  const getGlowColor = () => {
    switch (cursorState) {
      case 'green': return 'rgba(16, 185, 129, 0.5)'
      case 'cyan': return 'rgba(6, 182, 212, 0.5)'
      case 'blue': return 'rgba(59, 130, 246, 0.5)'
      case 'purple': return 'rgba(139, 92, 246, 0.5)'
      case 'orange': return 'rgba(249, 115, 22, 0.5)'
      case 'red': return 'rgba(244, 63, 94, 0.5)'
    }
  }

  return (
    <>
      {/* Global styles to hide default cursor */}
      <style>{`
        body.energy-cursor-enabled,
        body.energy-cursor-enabled * {
          cursor: none !important;
        }
        body.energy-cursor-enabled a,
        body.energy-cursor-enabled button,
        body.energy-cursor-enabled input,
        body.energy-cursor-enabled textarea,
        body.energy-cursor-enabled select,
        body.energy-cursor-enabled [role="button"] {
          cursor: none !important;
        }
      `}</style>

      {/* Custom cursor element */}
      <div
        className="energy-cursor"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: '32px',
          height: '32px',
          backgroundImage: `url(/cursors/cursor-${cursorState}.svg)`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          transform: 'translate(-4px, -4px)', // Offset to align cursor tip
          pointerEvents: 'none',
          zIndex: 100000,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 200ms ease',
          filter: `drop-shadow(0 0 6px ${getGlowColor()})`,
        }}
      >
        {/* Smooth transition overlay for color changes */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(/cursors/cursor-${cursorState}.svg)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            transition: 'background-image 400ms ease',
          }}
        />
      </div>
    </>
  )
}
