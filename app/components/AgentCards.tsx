'use client';

import React, { useState } from 'react';
import { agentConfigs, type AgentType } from '../lib/agents/index';

export default function AgentCards() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAgent = async (agentType: AgentType, message: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: message,
          preferredAgent: agentType 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error running agent:', error);
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedAgent || isLoading) return;

    runAgent(selectedAgent, inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!inputValue.trim() || !selectedAgent || isLoading) return;
      runAgent(selectedAgent, inputValue);
    }
  };

  const resetSelection = () => {
    setSelectedAgent(null);
    setInputValue('');
    setResponse(null);
  };

  const selectedAgentConfig = agentConfigs.find(a => a.type === selectedAgent);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Agent
        </h2>
        <p className="text-gray-600">
          Select an agent to get specialized help
        </p>
      </div>

      {!selectedAgent ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agentConfigs.map((agent) => (
            <div
              key={agent.type}
              onClick={() => setSelectedAgent(agent.type)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200 hover:border-gray-300"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-white text-2xl mb-4`}>
                {agent.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {agent.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {agent.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedAgentConfig?.color} flex items-center justify-center text-white text-xl`}>
                {selectedAgentConfig?.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedAgentConfig?.name}
              </h3>
            </div>
            <button
              onClick={resetSelection}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask the ${selectedAgentConfig?.name} anything... (Press Enter to send, Shift+Enter for new line)`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : 'Send Message'}
            </button>
          </form>

          {response && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${selectedAgentConfig?.color}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {selectedAgentConfig?.name}
                </span>
              </div>
              <p className="text-gray-800">{response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 