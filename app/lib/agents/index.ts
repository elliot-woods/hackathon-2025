import { fleshItOutAgent, fleshItOutAgentConfig } from './fleshit';
import { marketResearchAgent, marketResearchAgentConfig } from './market-research';
import { marketingPlanAgent, marketingPlanAgentConfig } from './marketing-plan';
import { painpointsAgent, painpointsAgentConfig } from './painpoints';
import { seoAgent, seoAgentConfig } from './seo';

// All available agents
export const agents = {
  fleshit: fleshItOutAgent,
  'market-research': marketResearchAgent,
  painpoints: painpointsAgent,
  seo: seoAgent,
  'marketing-plan': marketingPlanAgent,
};

// Agent configurations for UI
export const agentConfigs = [
  fleshItOutAgentConfig,
  marketResearchAgentConfig,
  painpointsAgentConfig,
  seoAgentConfig,
  marketingPlanAgentConfig,
];

// Export individual agents
export { fleshItOutAgent, marketResearchAgent, painpointsAgent, seoAgent, marketingPlanAgent };
export {
  fleshItOutAgentConfig,
  marketResearchAgentConfig,
  painpointsAgentConfig,
  seoAgentConfig,
  marketingPlanAgentConfig,
};

// Agent type
export type AgentType = keyof typeof agents; 