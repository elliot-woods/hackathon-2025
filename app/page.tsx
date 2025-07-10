import React from 'react'
import ChatInterface from './components/ChatInterface'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Startup Agent
          </h1>
          <p className="text-gray-600">
            Intelligent AI chat with specialized agent handoffs
          </p>
        </div>
        <ChatInterface />
      </div>
    </main>
  )
} 