import { fleshItOutAgent, fleshItOutAgentConfig } from './fleshit';
import { marketResearchAgent, marketResearchAgentConfig } from './market-research';
import { painpointsAgent, painpointsAgentConfig } from './painpoints';
import { eyepopAgent, eyepopAgentConfig } from './eyepop';

// All available agents
export const agents = {
  fleshit: fleshItOutAgent,
  'market-research': marketResearchAgent,
  painpoints: painpointsAgent,
  eyepop: eyepopAgent,
};

// Agent configurations for UI
export const agentConfigs = [
  fleshItOutAgentConfig,
  marketResearchAgentConfig,
  painpointsAgentConfig,
  eyepopAgentConfig,
];

// Export individual agents
export { fleshItOutAgent, marketResearchAgent, painpointsAgent, eyepopAgent };
export {
  fleshItOutAgentConfig,
  marketResearchAgentConfig,
  painpointsAgentConfig,
  eyepopAgentConfig,
};

// Agent type
export type AgentType = keyof typeof agents; 