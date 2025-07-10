import { Agent } from '@openai/agents';

export const salesAgent = new Agent({
  name: 'Sales Agent',
  instructions: `You are a sales representative. You help with:
  - Product information
  - Pricing questions
  - Feature comparisons
  - Demo requests
  - Upgrade options
  
  Always be enthusiastic and focus on how our products can solve the customer's problems.`
});

export const salesAgentConfig = {
  name: 'Sales Agent',
  type: 'sales' as const,
  description: 'Product info, pricing, and demos',
  icon: '📈',
  color: 'from-purple-500 to-purple-600'
}; 