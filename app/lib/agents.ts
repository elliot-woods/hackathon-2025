import { Agent, handoff } from '@openai/agents';
import { fleshItOutAgent } from './agents/fleshit';
import { marketResearchAgent } from './agents/market-research';
import { painpointsAgent } from './agents/painpoints';

// Create the triage agent with handoffs
export const triageAgent = Agent.create({
  name: 'Triage Agent',
  instructions: `You are a triage agent that routes customer inquiries to the appropriate specialist.
  
  Analyze the user's request and determine which agent can best help them:
  - Flesh It Out Agent: For fleshing out startup ideas into concrete concepts
  - Does It Exist Agent: For idea validation, competitor analysis, market gaps, and "does this already exist" questions
  - Pain Points Agent: For analyzing customer pain points and problem validation
  
  If the request is simple and you can handle it directly, do so. Otherwise, hand off to the appropriate specialist.
  
  Always be friendly and let the user know you're connecting them to the right person.`,
  handoffs: [handoff(fleshItOutAgent), handoff(marketResearchAgent), handoff(painpointsAgent)]
});

export const summaryAgent = Agent.create({
  name: 'Summary Agent',
  instructions: `You are a summary agent that summarizes the results of the agents into a single response.
  
  You will receive a list of agents and their results.
  You will then summarize the results into a single response.
  `,
});

export const moAgent = Agent.create({
  name: 'MO Agent',
  instructions: `You are a message orchestrator that analyzes user inquiries and determines which agents should handle them.
  
  Analyze the user's message and determine ALL relevant agents that could help, then provide specific prompts for each agent.
  
  Available agents:
  - Billing Agent: For billing, payments, invoices, account balance questions
  - Support Agent: For technical issues, troubleshooting, how-to questions  
  - Sales Agent: For product information, pricing, demos, upgrades
  - Flesh It Out Agent: For fleshing out startup ideas into concrete concepts
  - Does It Exist Agent: For idea validation, competitor analysis, market gaps
  - Pain Points Agent: For analyzing customer pain points and problem validation
  - Summary Agent: For summarizing the results of the agents into a single response, make sure this agent is always used if multiple agents are used and always add it last
  
  Return your analysis as structured JSON data showing which agents should be involved and what specific prompts they should receive. Use the following format:
  {
    "agents": [
      {
        "agent": "agent_name",
        "prompt": "specific_prompt_for_the_agent"
      }
    ]
  }

  If you cannot determine which agents to use, return the response to the user's question or ask the user to clarify their request.
  Return this in the following format:
  {
    "response": "response_to_user_question"
  }
 `,
});

// Export a function to run the triage agent
export async function runTriageAgent(userMessage: string) {
  const { run } = await import('@openai/agents');
  
  // const result = await run(triageAgent, userMessage);
  const result = await run(moAgent, userMessage);

  const parsedResult = JSON.parse(result.finalOutput);
  if (parsedResult.response) {
    return {
      response: parsedResult.response,
      agentUsed: 'mo'
    };
  }

  const agents = parsedResult.agents;

  console.log('parsedResult: ', parsedResult);

  let results: string[] = [];
  const agentsUsed = []; 

  for (const agent of agents) {
    const agentName = agent.agent;
    const agentPrompt = agent.prompt;


    let result;
    switch (agentName) {
      case 'Flesh It Out Agent':
        console.log('running flesh it out agent with prompt: ', agentPrompt);
        result = await run(fleshItOutAgent, agentPrompt);
        results.push(result.finalOutput);
        agentsUsed.push(agentName);
        break;
      case 'Does It Exist Agent':
        console.log('running does it exist agent with prompt: ', agentPrompt);
        result = await run(marketResearchAgent, agentPrompt);
        results.push(result.finalOutput);
        agentsUsed.push(agentName);
        break;
      case 'Pain Points Agent':
        console.log('running pain points agent with prompt: ', agentPrompt);
        result = await run(painpointsAgent, agentPrompt);
        results.push(result.finalOutput);
        agentsUsed.push(agentName);
        break;
      case 'Billing Agent':
        console.log('running billing agent with prompt: ', agentPrompt);
        result = await run(billingAgent, agentPrompt);
        results.push(result.finalOutput);
        agentsUsed.push(agentName);
        break;
      case 'Summary Agent':
        console.log('running summary agent with results: ', results);
        result = await run(summaryAgent, `Here are the results of the agents: ${results.join('\n')}`);
        results = [result.finalOutput];
        agentsUsed.push(agentName);
        break;
    }
  }
  console.log("results: ", results);
  
  const response = results.join('\n') || 'Sorry, I encountered an error processing your request.';
  
  return {
    response: response,
    agentsUsed: agentsUsed
  };
} 