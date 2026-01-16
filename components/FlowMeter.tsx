'use client'

import { useRef, useEffect, useState } from 'react'
import { getCapacityZone, getCapacityMessage, CapacityZone, getEnergyZone, getEnergyMessage, getEnergyZoneColor, EnergyZone } from '@/utils/flowMeter'

interface FlowMeterProps {
  capacityPercentage: number
  selectedWeight?: number
  energyBalance?: number
  size?: number
  showMessage?: boolean
  compact?: boolean  // For header icon mode (40px, no message, rounded)
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

// Get color for the message text based on capacity zone (legacy)
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

export function FlowMeter({
  capacityPercentage,
  selectedWeight = 0,
  energyBalance = 18,
  size = 120,
  showMessage = true,
  compact = false
}: FlowMeterProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)

  // Use the new energy zone system for messages (matches color gradient)
  const energyZone = getEnergyZone(selectedWeight, energyBalance)
  const message = getEnergyMessage(energyZone)
  const messageColor = getEnergyZoneColor(energyZone)

  // For compact mode, use 40px
  const displaySize = compact ? 40 : size

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

  // Compact mode - small rounded icon for header
  if (compact) {
    return (
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-xl border border-subtle"
        style={{ width: displaySize, height: displaySize, backgroundColor: '#000000' }}
        title={message}
      >
        <video
          ref={videoRef}
          src="/flow-meter/Flow-meter.mp4"
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-contain scale-150"
          style={{
            opacity: isReady ? 1 : 0,
            transition: 'opacity 0.3s ease-out'
          }}
        />
        {/* Loading placeholder */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="w-4 h-4 border border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center gap-3 p-4 rounded-xl"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Video Container */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ width: displaySize, height: displaySize }}
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
