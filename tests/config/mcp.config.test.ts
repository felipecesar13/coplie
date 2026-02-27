// Tests for MCP configuration
import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('MCP Configuration', () => {
  const mcpConfigPath = join(__dirname, '../../.copilot/mcp.json');

  describe('mcp.json', () => {
    test('should exist and be valid JSON', () => {
      const configContent = readFileSync(mcpConfigPath, 'utf-8');
      const config = JSON.parse(configContent);
      expect(config).toBeDefined();
    });

    test('should have mcpServers defined', () => {
      const configContent = readFileSync(mcpConfigPath, 'utf-8');
      const config = JSON.parse(configContent);
      expect(config.mcpServers).toBeDefined();
      expect(typeof config.mcpServers).toBe('object');
    });

    test('should have linear server configured', () => {
      const configContent = readFileSync(mcpConfigPath, 'utf-8');
      const config = JSON.parse(configContent);
      expect(config.mcpServers.linear).toBeDefined();
    });

    test('linear server should have correct command', () => {
      const configContent = readFileSync(mcpConfigPath, 'utf-8');
      const config = JSON.parse(configContent);
      expect(config.mcpServers.linear.command).toBe('npx');
      expect(config.mcpServers.linear.args).toContain('@linear/mcp-server-linear');
    });

    test('linear server should use LINEAR_API_KEY environment variable', () => {
      const configContent = readFileSync(mcpConfigPath, 'utf-8');
      const config = JSON.parse(configContent);
      expect(config.mcpServers.linear.env).toBeDefined();
      // The config should reference the LINEAR_API_KEY environment variable
      const expectedValue = '$' + '{LINEAR_API_KEY}';
      expect(config.mcpServers.linear.env.LINEAR_API_KEY).toBe(expectedValue);
    });
  });
});
