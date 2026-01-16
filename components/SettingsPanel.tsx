'use client'

import { useState, useRef, useEffect } from 'react'

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={panelRef}>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-10 h-10 rounded-xl
          bg-surface-raised hover:bg-surface-overlay
          border border-subtle
          flex items-center justify-center
          transition-all duration-200
          hover:scale-105
          ${isOpen ? 'bg-surface-overlay' : ''}
        `}
        aria-label="Settings"
        title="Settings"
      >
        <svg
          className={`
            w-5 h-5 text-ink-muted
            transition-transform duration-300
            ${isOpen ? 'rotate-90' : 'rotate-0'}
          `}
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

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="
            absolute right-0 top-full mt-2
            w-64 p-4 rounded-xl
            bg-surface-raised border border-subtle
            shadow-lg
            animate-scale-in
            z-50
          "
        >
          <h3 className="text-sm font-medium text-ink-rich mb-4">Settings</h3>

          <div className="space-y-4">
            {/* Placeholder for future settings */}
            <p className="text-xs text-ink-faint italic">
              More settings coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
