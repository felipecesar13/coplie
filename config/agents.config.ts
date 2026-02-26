// Agent configuration for Copilot CLI integration
// The agent is configured in the Copilot CLI and we only pass the agent name

export const AGENT_NAME = 'product_manager';

/**
 * Returns the agent name for issue processing
 * Currently uses a single product_manager agent for all backlog issues
 */
export function getAgentName(): string {
  return AGENT_NAME;
}
