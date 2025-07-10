import { billingAgent, billingAgentConfig } from './billing';
import { supportAgent, supportAgentConfig } from './support';
import { salesAgent, salesAgentConfig } from './sales';

// All available agents
export const agents = {
  billing: billingAgent,
  support: supportAgent,
  sales: salesAgent
};

// Agent configurations for UI
export const agentConfigs = [
  billingAgentConfig,
  supportAgentConfig,
  salesAgentConfig
];

// Export individual agents
export { billingAgent, supportAgent, salesAgent };
export { billingAgentConfig, supportAgentConfig, salesAgentConfig };

// Agent type
export type AgentType = keyof typeof agents; 