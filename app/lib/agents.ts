import { Agent, handoff } from '@openai/agents';
import { fleshItOutAgent } from './agents/fleshit';
import { marketResearchAgent } from './agents/market-research';
import { painpointsAgent } from './agents/painpoints';
import { eyepopAgent } from './agents/eyepop';
import { seoAgent } from './agents/seo';

// Create the triage agent with handoffs
export const triageAgent = Agent.create({
  name: 'Triage Agent',
  instructions: `You are a triage agent that routes customer inquiries to the appropriate specialist.
  
  Analyze the user's request and determine which agent can best help them:
  - Flesh It Out Agent: For fleshing out startup ideas into concrete concepts
  - Does It Exist Agent: For idea validation, competitor analysis, market gaps, and "does this already exist" questions
  - Pain Points Agent: For analyzing customer pain points and problem validation
  - EyePop Vision Agent: For analyzing images using AI vision - detecting objects, faces, text, and extracting visual insights
  - SEO Agent: For generating SEO keywords and strategy for a startup
  
  If the request is simple and you can handle it directly, do so. Otherwise, hand off to the appropriate specialist.
  
  Always be friendly and let the user know you're connecting them to the right person.`,

  handoffs: [
    handoff(fleshItOutAgent),
    handoff(marketResearchAgent),
    handoff(painpointsAgent),
    handoff(seoAgent),
    handoff(eyepopAgent),
  ],

});

// Export a function to run the triage agent
export async function runTriageAgent(userMessage: string) {
  const { run } = await import('@openai/agents');
  
  const result = await run(triageAgent, userMessage);
  
  const response = result.finalOutput || 'Sorry, I encountered an error processing your request.';
  
  return {
    response: response,
    agentUsed: response.includes('Flesh It Out Agent') ? 'fleshit' :
               response.includes('Does It Exist Agent') ? 'market-research' : 
               response.includes('Pain Points Agent') ? 'painpoints' :
               response.includes('EyePop Vision Agent') ? 'eyepop' :
               response.includes('SEO Agent') ? 'seo' : 'triage'
  };
} 