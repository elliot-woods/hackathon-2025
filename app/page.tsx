import React from 'react'
import ChatInterface from './components/ChatInterface'
import AgentCards from './components/AgentCards'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Startup Agent
          </h1>
          <p className="text-gray-600 text-lg">
            Intelligent AI chat with specialized agent handoffs
          </p>
        </div>
        
        <div className="space-y-12">
          <AgentCards />
          
          <div className="border-t border-gray-200 pt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Full Chat Interface
              </h2>
              <p className="text-gray-600">
                Or use the complete chat experience with automatic agent routing
              </p>
            </div>
            <ChatInterface />
          </div>
        </div>
      </div>
    </main>
  )
} 