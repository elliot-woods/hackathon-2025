import { billingAgent, billingAgentConfig } from './billing';
import { supportAgent, supportAgentConfig } from './support';
import { salesAgent, salesAgentConfig } from './sales';
import { fleshItOutAgent, fleshItOutAgentConfig } from './fleshit';
import { marketResearchAgent, marketResearchAgentConfig } from './market-research';
import { painpointsAgent, painpointsAgentConfig } from './painpoints';

// All available agents
export const agents = {
  billing: billingAgent,
  support: supportAgent,
  sales: salesAgent,
  fleshit: fleshItOutAgent,
  'market-research': marketResearchAgent,
  painpoints: painpointsAgent,
};

// Agent configurations for UI
export const agentConfigs = [
  billingAgentConfig,
  supportAgentConfig,
  salesAgentConfig,
  fleshItOutAgentConfig,
  marketResearchAgentConfig,
  painpointsAgentConfig,
];

// Export individual agents
export { billingAgent, supportAgent, salesAgent, fleshItOutAgent, marketResearchAgent, painpointsAgent };
export {
  billingAgentConfig,
  supportAgentConfig,
  salesAgentConfig,
  fleshItOutAgentConfig,
  marketResearchAgentConfig,
  painpointsAgentConfig,
};

// Agent type
export type AgentType = keyof typeof agents; 