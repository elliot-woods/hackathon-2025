import { fleshItOutAgent, fleshItOutAgentConfig } from './fleshit';
import { marketResearchAgent, marketResearchAgentConfig } from './market-research';
import { painpointsAgent, painpointsAgentConfig } from './painpoints';

// All available agents
export const agents = {
  fleshit: fleshItOutAgent,
  'market-research': marketResearchAgent,
  painpoints: painpointsAgent,
};

// Agent configurations for UI
export const agentConfigs = [
  fleshItOutAgentConfig,
  marketResearchAgentConfig,
  painpointsAgentConfig,
];

// Export individual agents
export { fleshItOutAgent, marketResearchAgent, painpointsAgent };
export {
  fleshItOutAgentConfig,
  marketResearchAgentConfig,
  painpointsAgentConfig,
};

// Agent type
export type AgentType = keyof typeof agents; 