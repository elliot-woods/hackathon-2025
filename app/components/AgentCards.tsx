'use client';

import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { agentConfigs, type AgentType } from '../lib/agents/index';

export default function AgentCards() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    id: string;
    text: string;
    sender: 'user' | 'agent';
    agentUsed?: string;
    timestamp: string;
  }>>([]);

  const runAgent = async (agentType: AgentType, message: string) => {
    setIsLoading(true);
    try {
      // Handle EyePop agent with image upload
      if (agentType === 'eyepop' && uploadedImage) {
        console.log('🔍 Starting EyePop image analysis...');
        console.log('📋 Request details:', {
          agentType,
          message,
          imageSize: uploadedImage.size,
          imageType: uploadedImage.type,
          imageName: uploadedImage.name
        });

        const formData = new FormData();
        formData.append('image', uploadedImage);
        formData.append('message', message);
        formData.append('preferredAgent', agentType);

        console.log('📤 Sending request to /api/upload-image...');
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        console.log('📥 Response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Network error details:', {
            status: response.status,
            statusText: response.statusText,
            responseBody: errorText
          });
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ EyePop analysis completed successfully');
        
        // Update conversation history for image analysis
        const userMessage = {
          id: Date.now().toString(),
          text: uploadedImage ? `[Image: ${uploadedImage.name}] ${message}` : message,
          sender: 'user' as const,
          timestamp: new Date().toISOString()
        };
        
        const agentMessage = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'agent' as const,
          agentUsed: data.agentUsed || agentType,
          timestamp: data.timestamp || new Date().toISOString()
        };
        
        setConversationHistory(prev => [...prev, userMessage, agentMessage]);
        setResponse(data.response);
      } else {
        // Regular text-based agent interaction
        console.log('💬 Starting regular agent interaction...');
        console.log('📋 Request details:', {
          agentType,
          message
        });

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: message,
            preferredAgent: agentType,
            conversationHistory: conversationHistory
          }),
        });

        console.log('📥 Response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Network error details:', {
            status: response.status,
            statusText: response.statusText,
            responseBody: errorText
          });
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Agent interaction completed successfully');
        
        // Update conversation history for regular text interaction
        const userMessage = {
          id: Date.now().toString(),
          text: message,
          sender: 'user' as const,
          timestamp: new Date().toISOString()
        };
        
        const agentMessage = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'agent' as const,
          agentUsed: data.agentUsed,
          timestamp: data.timestamp || new Date().toISOString()
        };
        
        setConversationHistory(prev => [...prev, userMessage, agentMessage]);
        setResponse(data.response);
      }
    } catch (error) {
      console.error('💥 Error running agent:', error);
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent || isLoading) return;
    
    // For EyePop agent, require either an image or message
    if (selectedAgent === 'eyepop' && !uploadedImage && !inputValue.trim()) {
      return;
    }
    
    // For other agents, require a message
    if (selectedAgent !== 'eyepop' && !inputValue.trim()) {
      return;
    }

    runAgent(selectedAgent, inputValue || 'Please analyze this image');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!selectedAgent || isLoading) return;
      
      // For EyePop agent, require either an image or message
      if (selectedAgent === 'eyepop' && !uploadedImage && !inputValue.trim()) {
        return;
      }
      
      // For other agents, require a message
      if (selectedAgent !== 'eyepop' && !inputValue.trim()) {
        return;
      }
      
      runAgent(selectedAgent, inputValue || 'Please analyze this image');
    }
  };

  // Image handling functions
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    setUploadedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
  };

  const resetSelection = () => {
    setSelectedAgent(null);
    setInputValue('');
    setResponse(null);
    setUploadedImage(null);
    setImagePreview(null);
    setDragActive(false);
    setConversationHistory([]);
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
            {/* EyePop Agent - Image Upload Interface */}
            {selectedAgent === 'eyepop' && (
              <div className="space-y-4">
                {/* Drag and Drop Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                  
                  {!uploadedImage ? (
                    <div className="space-y-2">
                      <div className="text-4xl">👁️</div>
                      <div className="text-lg font-medium text-gray-700">
                        Drop an image here or click to upload
                      </div>
                      <div className="text-sm text-gray-500">
                        Supports JPG, PNG, GIF, WebP
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <img
                          src={imagePreview!}
                          alt="Preview"
                          className="max-w-full max-h-48 rounded-lg shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        {uploadedImage.name}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Optional Text Input */}
                <div>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a message (optional)... What would you like me to analyze in this image?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={2}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
            
            {/* Other Agents - Text Only Interface */}
            {selectedAgent !== 'eyepop' && (
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
            )}
            
            <button
              type="submit"
              disabled={isLoading || (selectedAgent === 'eyepop' ? !uploadedImage && !inputValue.trim() : !inputValue.trim())}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : selectedAgent === 'eyepop' ? 'Analyze Image' : 'Send Message'}
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
              <div className="text-gray-800 prose prose-sm max-w-none">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 