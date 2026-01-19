'use client'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Orb 1 - Teal/Green (grounded energy) */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.35] animate-drift-slow"
        style={{
          background: 'radial-gradient(circle, rgba(126, 168, 143, 0.6) 0%, transparent 70%)',
          top: '0%',
          left: '10%',
        }}
      />

      {/* Orb 2 - Blue (scattered energy) */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.3] animate-drift-slower"
        style={{
          background: 'radial-gradient(circle, rgba(92, 158, 207, 0.6) 0%, transparent 70%)',
          top: '50%',
          right: '5%',
        }}
      />

      {/* Orb 3 - Amber (focus/energy glow) */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full blur-3xl opacity-[0.25] animate-drift-slowest"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, transparent 70%)',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Orb 4 - Rose (subtle accent) */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.2] animate-drift-slow"
        style={{
          background: 'radial-gradient(circle, rgba(201, 136, 122, 0.5) 0%, transparent 70%)',
          bottom: '5%',
          left: '20%',
          animationDelay: '-10s',
        }}
      />
    </div>
  )
}
