// Tests for agents configuration
import { describe, expect, test } from 'bun:test';
import { AGENT_NAME, getAgentName } from '../../config/agents.config';

describe('Agents Configuration', () => {
  describe('AGENT_NAME', () => {
    test('should be defined as product_manager', () => {
      expect(AGENT_NAME).toBe('product_manager');
    });
  });

  describe('getAgentName', () => {
    test('should always return product_manager', () => {
      const agentName = getAgentName();
      expect(agentName).toBe('product_manager');
    });
  });
});
