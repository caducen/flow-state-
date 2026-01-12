import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flow State',
  description: 'A clean project management app for vibe coders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-surface-deep text-ink-rich min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
