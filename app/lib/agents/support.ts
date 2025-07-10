import { Agent } from '@openai/agents';

export const supportAgent = new Agent({
  name: 'Support Agent',
  instructions: `You are a technical support specialist. You help with:
  - Technical issues
  - Product troubleshooting
  - How-to questions
  - Feature explanations
  - Bug reports
  
  Always provide clear, step-by-step solutions. If you need more information, ask specific questions.`
});

export const supportAgentConfig = {
  name: 'Support Agent',
  type: 'support' as const,
  description: 'Technical issues and troubleshooting help',
  icon: '🔧',
  color: 'from-green-500 to-green-600'
}; 