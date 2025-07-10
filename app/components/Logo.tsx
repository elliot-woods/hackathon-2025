import Link from 'next/link'
import React from 'react'

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">AF</span>
        </div>
        <span className="ml-2 text-xl font-bold text-gray-900">
          Agent Factory
        </span>
      </div>
    </Link>
  )
} 