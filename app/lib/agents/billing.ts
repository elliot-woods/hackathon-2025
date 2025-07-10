import { Agent } from '@openai/agents';

export const billingAgent = new Agent({
  name: 'Billing Agent',
  instructions: `You are a billing specialist. You help with:
  - Invoice questions
  - Payment processing
  - Billing disputes
  - Account balance inquiries
  - Payment methods
  
  Always be professional and helpful. If you cannot resolve a billing issue, explain what the user needs to do next.`
});

export const billingAgentConfig = {
  name: 'Billing Agent',
  type: 'billing' as const,
  description: 'Handle invoices, payments, and billing inquiries',
  icon: '💳',
  color: 'from-blue-500 to-blue-600'
}; 