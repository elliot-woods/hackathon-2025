import { Agent, handoff } from '@openai/agents';

// Create specialized agents for different tasks
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

// Create the triage agent with handoffs
export const triageAgent = Agent.create({
  name: 'Triage Agent',
  instructions: `You are a triage agent that routes customer inquiries to the appropriate specialist.
  
  Analyze the user's request and determine which agent can best help them:
  - Billing Agent: For billing, payments, invoices, account balance questions
  - Support Agent: For technical issues, troubleshooting, how-to questions
  - Sales Agent: For product information, pricing, demos, upgrades
  
  If the request is simple and you can handle it directly, do so. Otherwise, hand off to the appropriate specialist.
  
  Always be friendly and let the user know you're connecting them to the right person.`,
  handoffs: [billingAgent, handoff(supportAgent), handoff(salesAgent)]
});

// Export a function to run the triage agent
export async function runTriageAgent(userMessage: string) {
  const { run } = await import('@openai/agents');
  
  const result = await run(triageAgent, userMessage);
  
  const response = result.finalOutput || 'Sorry, I encountered an error processing your request.';
  
  return {
    response: response,
    agentUsed: response.includes('Billing Agent') ? 'billing' : 
               response.includes('Support Agent') ? 'support' : 
               response.includes('Sales Agent') ? 'sales' : 'triage'
  };
} 