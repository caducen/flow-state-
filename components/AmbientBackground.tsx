'use client'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Orb 1 - Teal/Green (grounded energy) */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.15] animate-drift-slow"
        style={{
          background: 'radial-gradient(circle, rgba(126, 168, 143, 0.4) 0%, transparent 70%)',
          top: '5%',
          left: '15%',
        }}
      />

      {/* Orb 2 - Blue (scattered energy) */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.12] animate-drift-slower"
        style={{
          background: 'radial-gradient(circle, rgba(92, 158, 207, 0.4) 0%, transparent 70%)',
          top: '55%',
          right: '10%',
        }}
      />

      {/* Orb 3 - Amber (focus/energy glow) */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full blur-3xl opacity-[0.08] animate-drift-slowest"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
          top: '35%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Orb 4 - Rose (subtle accent) */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full blur-3xl opacity-[0.06] animate-drift-slow"
        style={{
          background: 'radial-gradient(circle, rgba(201, 136, 122, 0.3) 0%, transparent 70%)',
          bottom: '10%',
          left: '25%',
          animationDelay: '-10s',
        }}
      />
    </div>
  )
}
