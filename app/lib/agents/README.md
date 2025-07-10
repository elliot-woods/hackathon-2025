# Agents Directory

This directory contains modular agent definitions that make it easy to add new handoff agents.

## Structure

- `fleshit.ts` - Flesh It Out Agent for startup idea development
- `market-research.ts` - Does It Exist Agent for idea validation and competitor analysis
- `painpoints.ts` - Pain Points Agent for customer pain point analysis
- `index.ts` - Exports all agents and configurations

## Adding a New Agent

### 1. Create the Agent File

Create a new file `app/lib/agents/yourAgent.ts`:

```typescript
import { Agent } from '@openai/agents';

export const yourAgent = new Agent({
  name: 'Your Agent Name',
  instructions: `You are a specialist that helps with:
  - Task 1
  - Task 2
  - Task 3
  
  Always be helpful and professional.`
});

export const yourAgentConfig = {
  name: 'Your Agent Name',
  type: 'yourAgent' as const,
  description: 'Brief description of what this agent does',
  icon: '🎯', // Pick an emoji
  color: 'from-red-500 to-red-600' // Pick a Tailwind gradient
};
```

### 2. Add to Index

Update `app/lib/agents/index.ts`:

```typescript
// Add import
import { yourAgent, yourAgentConfig } from './yourAgent';

// Add to agents object
export const agents = {
  fleshit: fleshItOutAgent,
  'market-research': marketResearchAgent,
  painpoints: painpointsAgent,
  yourAgent: yourAgent // Add here
};

// Add to configs array
export const agentConfigs = [
  fleshItOutAgentConfig,
  marketResearchAgentConfig,
  painpointsAgentConfig,
  yourAgentConfig // Add here
];

// Add to exports
export { yourAgent, yourAgentConfig };
```

### 3. Update Triage Agent

Update `app/lib/agents.ts` to include your agent in handoffs:

```typescript
import { yourAgent } from './agents/yourAgent';

export const triageAgent = Agent.create({
  // ... existing config
  handoffs: [
    handoff(fleshItOutAgent),
    handoff(marketResearchAgent),
    handoff(painpointsAgent),
    handoff(yourAgent) // Add here
  ]
});
```

### 4. Update Agent Detection

Update the `runTriageAgent` function to detect your agent:

```typescript
return {
  response: response,
  agentUsed: response.includes('Flesh It Out Agent') ? 'fleshit' :
             response.includes('Does It Exist Agent') ? 'market-research' : 
             response.includes('Pain Points Agent') ? 'painpoints' :
             response.includes('Your Agent Name') ? 'yourAgent' : 'triage'
};
```

That's it! Your new agent will automatically appear in the AgentCards interface and be available for direct interaction. 