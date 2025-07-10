import { NextRequest, NextResponse } from 'next/server';
import { runTriageAgent } from '../../lib/agents';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Run the triage agent
    const result = await runTriageAgent(message);

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