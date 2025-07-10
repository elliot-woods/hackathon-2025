import { NextRequest, NextResponse } from 'next/server';
import { runTriageAgent } from '../../lib/agents';
import { agents, type AgentType } from '../../lib/agents/index';

// Web search function for market research
async function performWebSearch(query: string): Promise<string> {
  try {
    // Simulate web search results with multiple targeted queries
    
    let searchResults = `[Market Research Results for "${query}"]\n\n`;
    
    // In a real implementation, you would make actual web search API calls here
    // For now, we'll provide structured market research guidance
    searchResults += `## 🔍 Competitor Analysis
    
To thoroughly research if your idea exists, I recommend searching for:
1. **Direct Competitors**: Companies offering the exact same solution
2. **Indirect Competitors**: Alternative solutions to the same problem
3. **Market Players**: Established companies that might enter this space
4. **Startups**: Recent companies building similar solutions

## 📊 Market Research Areas

**Search Terms to Use:**
- "${query} competitors"
- "${query} market size"
- "${query} existing solutions"
- "${query} alternative approaches"
- "${query} startup funding"

**Key Research Questions:**
- What companies are already solving this problem?
- How are they positioning their solutions?
- What's missing in current offerings?
- What do customer reviews say about existing solutions?
- Are there any recent acquisitions or major funding rounds?

## 🎯 Gap Analysis Framework

Look for opportunities in:
- **Underserved Markets**: Geographic or demographic segments
- **Feature Gaps**: Missing functionality in existing solutions
- **User Experience**: Poor UX in current offerings
- **Pricing**: Gaps in pricing models or accessibility
- **Technology**: Newer tech approaches to old problems

*Note: This provides a framework for research. For real-time data, use web search tools or market research platforms.*`;

    return searchResults;
  } catch (error) {
    console.error('Web search error:', error);
    return 'Unable to perform comprehensive web search at this time. Please provide any known competitor information for analysis.';
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, preferredAgent, conversationHistory = [] } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Format conversation history for context
    const formatConversationHistory = (history: any[]) => {
      if (history.length === 0) return '';
      
      return '\n\nConversation History:\n' + 
        history.map((msg: any) => {
          const role = msg.sender === 'user' ? 'User' : 'Assistant';
          const agentInfo = msg.agentUsed ? ` (${msg.agentUsed} agent)` : '';
          return `${role}${agentInfo}: ${msg.text}`;
        }).join('\n') + '\n\nCurrent Message:';
    };

    const conversationContext = formatConversationHistory(conversationHistory);

    let result = {
      response: 'Sorry, I encountered an error processing your request.',
      agentUsed: 'triage'
    };

    // If a preferred agent is specified, run that agent directly
    if (preferredAgent && preferredAgent in agents) {
      const { run } = await import('@openai/agents');
      const agent = agents[preferredAgent as AgentType];
      
      let enhancedMessage = conversationContext + message;
      
      // For market research agent, perform web search first
      if (preferredAgent === 'market-research') {
        const searchQuery = `${message} competitors market analysis`;
        const searchResults = await performWebSearch(searchQuery);
        enhancedMessage = conversationContext + message + `\n\n${searchResults}`;
      }
      
      const agentResult = await run(agent, enhancedMessage);
      result = {
        response: agentResult.finalOutput || 'Sorry, I encountered an error processing your request.',
        agentUsed: preferredAgent
      };
    } else {
      // Run the triage agent with conversation context
      const triageResult = await runTriageAgent(conversationContext + message);
      result = {
        response: triageResult.response,
        agentUsed: triageResult.agentUsed || (triageResult.agentsUsed ? triageResult.agentsUsed.join(', ') : 'triage')
      };
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