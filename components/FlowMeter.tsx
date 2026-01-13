'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { getCapacityZone, getCapacityMessage, CapacityZone } from '@/utils/flowMeter'

interface FlowMeterProps {
  capacityPercentage: number
  size?: number
  showMessage?: boolean
}

// Frame images mapped to capacity percentage thresholds
const FRAMES = [
  { maxPercent: 10, src: '/flow-meter/frame-01-green.png' },
  { maxPercent: 20, src: '/flow-meter/frame-02-yellow-green.png' },
  { maxPercent: 35, src: '/flow-meter/frame-03-cyan.png' },
  { maxPercent: 50, src: '/flow-meter/frame-04-blue.png' },
  { maxPercent: 65, src: '/flow-meter/frame-05-indigo.png' },
  { maxPercent: 75, src: '/flow-meter/frame-06-purple.png' },
  { maxPercent: 85, src: '/flow-meter/frame-07-magenta.png' },
  { maxPercent: 95, src: '/flow-meter/frame-08-red-orange.png' },
  { maxPercent: 105, src: '/flow-meter/frame-09-orange.png' },
  { maxPercent: 115, src: '/flow-meter/frame-10-golden.png' },
  { maxPercent: 130, src: '/flow-meter/frame-11-red.png' },
  { maxPercent: Infinity, src: '/flow-meter/frame-12-red-final.png' },
]

// Get the appropriate frame based on capacity percentage
function getFrameForPercentage(percent: number): string {
  for (const frame of FRAMES) {
    if (percent <= frame.maxPercent) {
      return frame.src
    }
  }
  return FRAMES[FRAMES.length - 1].src
}

// Get color for the message text based on capacity zone
function getMessageColor(zone: CapacityZone): string {
  switch (zone) {
    case 'under':
      return '#7CB342' // Green
    case 'balanced':
      return '#2196F3' // Blue
    case 'over':
      return '#F4511E' // Red-orange
  }
}

export function FlowMeter({ capacityPercentage, size = 120, showMessage = true }: FlowMeterProps) {
  const frameSrc = useMemo(() => getFrameForPercentage(capacityPercentage), [capacityPercentage])
  const zone = useMemo(() => getCapacityZone(capacityPercentage), [capacityPercentage])
  const message = useMemo(() => getCapacityMessage(zone), [zone])
  const messageColor = useMemo(() => getMessageColor(zone), [zone])

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Arrow Image Container */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Preload all frames for smooth transitions */}
        {FRAMES.map((frame) => (
          <Image
            key={frame.src}
            src={frame.src}
            alt=""
            width={size}
            height={size}
            className={`
              absolute inset-0 object-contain
              transition-opacity duration-500 ease-out
              ${frame.src === frameSrc ? 'opacity-100' : 'opacity-0'}
            `}
            priority={frame.maxPercent <= 50} // Prioritize loading first few frames
          />
        ))}
      </div>

      {/* Capacity Message */}
      {showMessage && (
        <div
          className="text-sm font-medium transition-colors duration-500"
          style={{ color: messageColor }}
        >
          {message}
        </div>
      )}
    </div>
  )
}

// Export zone colors for use elsewhere
export const ZONE_COLORS: Record<CapacityZone, string> = {
  under: '#7CB342',
  balanced: '#2196F3',
  over: '#F4511E',
}
