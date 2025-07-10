import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import Logo from './components/Logo'

export const metadata: Metadata = {
  title: 'Agent Factory',
  description: 'Factory of Specialized AI agents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <Logo />
          </div>
        </header>
        {children}
      </body>
    </html>
  )
} 