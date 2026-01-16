'use client'

import { useEffect, useState, useCallback } from 'react'

interface EnergyCursorProps {
  enabled: boolean
  selectedWeight: number
  energyBalance: number
}

type CursorState = 'green' | 'blue' | 'red'

export function EnergyCursor({ enabled, selectedWeight, energyBalance }: EnergyCursorProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Calculate capacity percentage
  const capacityPercent = energyBalance > 0 ? (selectedWeight / energyBalance) * 100 : 0

  // Determine cursor state based on thresholds
  const getCursorState = useCallback((): CursorState => {
    if (capacityPercent > 100) return 'red'
    if (capacityPercent >= 70) return 'blue'
    return 'green'
  }, [capacityPercent])

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
      case 'blue': return 'rgba(59, 130, 246, 0.5)'
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
          zIndex: 9999,
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
