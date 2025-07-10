import { fleshItOutAgent, fleshItOutAgentConfig } from './fleshit';
import { marketResearchAgent, marketResearchAgentConfig } from './market-research';
import { painpointsAgent, painpointsAgentConfig } from './painpoints';
import { seoAgent, seoAgentConfig } from './seo';

// All available agents
export const agents = {
  fleshit: fleshItOutAgent,
  'market-research': marketResearchAgent,
  painpoints: painpointsAgent,
  seo: seoAgent,
};

// Agent configurations for UI
export const agentConfigs = [
  fleshItOutAgentConfig,
  marketResearchAgentConfig,
  painpointsAgentConfig,
  seoAgentConfig,
];

// Export individual agents
export { fleshItOutAgent, marketResearchAgent, painpointsAgent, seoAgent };
export {
  fleshItOutAgentConfig,
  marketResearchAgentConfig,
  painpointsAgentConfig,
  seoAgentConfig,
};

// Agent type
export type AgentType = keyof typeof agents; 