import { NextRequest, NextResponse } from 'next/server';
import { runTriageAgent } from '../../lib/agents';
import { agents, type AgentType } from '../../lib/agents/index';

export async function POST(req: NextRequest) {
  try {
    const { message, preferredAgent } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let result = {
      response: 'Sorry, I encountered an error processing your request.',
      agentUsed: 'triage'
    };

    // If a preferred agent is specified, run that agent directly
    if (preferredAgent && preferredAgent in agents) {
      const { run } = await import('@openai/agents');
      const agent = agents[preferredAgent as AgentType];
      
      const agentResult = await run(agent, message);
      result = {
        response: agentResult.finalOutput || 'Sorry, I encountered an error processing your request.',
        agentUsed: preferredAgent
      };
    } else {
      // Run the triage agent
      result = await runTriageAgent(message);
    }

    return NextResponse.json({
      response: result.response,
      agentUsed: result.agentUsed,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 