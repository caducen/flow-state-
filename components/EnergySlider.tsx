'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface EnergySliderProps {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  label: string
  icon?: string
  description?: string
  color?: string
}

export function EnergySlider({
  value,
  min,
  max,
  onChange,
  label,
  icon,
  description,
  color = '#F59E0B'
}: EnergySliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())
  const sliderRef = useRef<HTMLDivElement>(null)

  // Sync input value with prop when value changes externally
  useEffect(() => {
    if (!isDragging) {
      setInputValue(value.toString())
    }
  }, [value, isDragging])

  // Calculate percentage for slider fill
  const percentage = ((value - min) / (max - min)) * 100

  // Handle slider drag
  const updateValue = useCallback((clientX: number) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(0, Math.min(1, x / rect.width))
    const newValue = Math.round(min + pct * (max - min))
    onChange(newValue)
    setInputValue(newValue.toString())
  }, [min, max, onChange])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updateValue(e.clientX)
  }

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    updateValue(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      updateValue(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Add/remove global event listeners for drag
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, updateValue])

  // Handle direct input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    const parsed = parseInt(inputValue, 10)
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed))
      onChange(clamped)
      setInputValue(clamped.toString())
    } else {
      setInputValue(value.toString())
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur()
    }
  }

  return (
    <div className="space-y-2">
      {/* Label and description */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="text-sm font-medium text-ink-rich">{label}</span>
        </div>
        {/* Direct input field */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="w-12 px-2 py-1 text-sm font-mono text-center bg-surface-raised
              border border-subtle rounded-lg text-ink-rich
              focus:outline-none focus:ring-1 focus:ring-amber-glow/50"
          />
          <span className="text-xs text-ink-faint">points</span>
        </div>
      </div>

      {description && (
        <p className="text-xs text-ink-muted">{description}</p>
      )}

      {/* Slider track */}
      <div
        ref={sliderRef}
        className="relative h-3 bg-surface-overlay rounded-full cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-75"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            opacity: 0.8,
          }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full
            bg-white shadow-md border-2 transition-transform duration-75
            hover:scale-110"
          style={{
            left: `calc(${percentage}% - 10px)`,
            borderColor: color,
          }}
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between text-xs text-ink-faint">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
