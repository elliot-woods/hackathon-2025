import { billingAgent, billingAgentConfig } from './billing';
import { supportAgent, supportAgentConfig } from './support';
import { salesAgent, salesAgentConfig } from './sales';
import { marketResearchAgent, marketResearchAgentConfig } from './market-research';

// All available agents
export const agents = {
  billing: billingAgent,
  support: supportAgent,
  sales: salesAgent,
  'market-research': marketResearchAgent
};

// Agent configurations for UI
export const agentConfigs = [
  billingAgentConfig,
  supportAgentConfig,
  salesAgentConfig,
  marketResearchAgentConfig
];

// Export individual agents
export { billingAgent, supportAgent, salesAgent, marketResearchAgent };
export { billingAgentConfig, supportAgentConfig, salesAgentConfig, marketResearchAgentConfig };

// Agent type
export type AgentType = keyof typeof agents; 