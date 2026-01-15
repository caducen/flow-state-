'use client'

import { useRef, useEffect, useState } from 'react'
import { getCapacityZone, getCapacityMessage, CapacityZone } from '@/utils/flowMeter'

interface FlowMeterProps {
  capacityPercentage: number
  size?: number
  showMessage?: boolean
}

// Video duration in seconds
const VIDEO_DURATION = 6.04

/**
 * Calculate video timestamp from capacity percentage
 * 0% used → 0.00s (green, full energy)
 * 100% used → 6.04s (red, depleted)
 */
function getVideoTimestamp(capacityPercentage: number): number {
  const clampedPercent = Math.min(Math.max(capacityPercentage, 0), 100)
  return (clampedPercent / 100) * VIDEO_DURATION
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)

  const zone = getCapacityZone(capacityPercentage)
  const message = getCapacityMessage(zone)
  const messageColor = getMessageColor(zone)

  // Update video timestamp when capacity changes
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isReady) return

    const timestamp = getVideoTimestamp(capacityPercentage)
    video.currentTime = timestamp
  }, [capacityPercentage, isReady])

  // Handle video ready state
  const handleLoadedMetadata = () => {
    setIsReady(true)
    // Set initial frame
    if (videoRef.current) {
      videoRef.current.currentTime = getVideoTimestamp(capacityPercentage)
    }
  }

  return (
    <div
      className="flex flex-col items-center gap-3 p-4 rounded-xl"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Video Container */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        <video
          ref={videoRef}
          src="/flow-meter/Flow-meter.mp4"
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-contain"
          style={{
            opacity: isReady ? 1 : 0,
            transition: 'opacity 0.3s ease-out'
          }}
        />
        {/* Loading placeholder */}
        {!isReady && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black rounded-lg"
          >
            <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
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
