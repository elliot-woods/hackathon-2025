import { Agent, handoff } from '@openai/agents';
import { billingAgent } from './agents/billing';
import { supportAgent } from './agents/support';
import { salesAgent } from './agents/sales';
import { fleshItOutAgent } from './agents/fleshit';
import { marketResearchAgent } from './agents/market-research';
import { painpointsAgent } from './agents/painpoints';

// Create the triage agent with handoffs
export const triageAgent = Agent.create({
  name: 'Triage Agent',
  instructions: `You are a triage agent that routes customer inquiries to the appropriate specialist.
  
  Analyze the user's request and determine which agent can best help them:
  - Billing Agent: For billing, payments, invoices, account balance questions
  - Support Agent: For technical issues, troubleshooting, how-to questions
  - Sales Agent: For product information, pricing, demos, upgrades
  - Flesh It Out Agent: For fleshing out startup ideas into concrete concepts
  - Does It Exist Agent: For idea validation, competitor analysis, market gaps, and "does this already exist" questions
  - Pain Points Agent: For analyzing customer pain points and problem validation
  
  If the request is simple and you can handle it directly, do so. Otherwise, hand off to the appropriate specialist.
  
  Always be friendly and let the user know you're connecting them to the right person.`,
  handoffs: [billingAgent, handoff(supportAgent), handoff(salesAgent), handoff(fleshItOutAgent), handoff(marketResearchAgent), handoff(painpointsAgent)]
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
               response.includes('Sales Agent') ? 'sales' : 
               response.includes('Flesh It Out Agent') ? 'fleshit' :
               response.includes('Does It Exist Agent') ? 'market-research' : 
               response.includes('Pain Points Agent') ? 'painpoints' : 'triage'
  };
} 