// Tests for MCP configuration
import { beforeAll, describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('MCP Configuration', () => {
  const mcpConfigPath = join(__dirname, '../../.copilot/mcp.json');

  // biome-ignore lint/suspicious/noTemplateCurlyInString: This is the expected literal value in the config
  const ENV_VAR_PLACEHOLDER = '${LINEAR_API_KEY}';

  let config: Record<string, unknown>;

  beforeAll(() => {
    const configContent = readFileSync(mcpConfigPath, 'utf-8');
    config = JSON.parse(configContent);
  });

  describe('mcp.json', () => {
    test('should exist and be valid JSON', () => {
      expect(config).toBeDefined();
    });

    test('should have mcpServers defined', () => {
      expect(config.mcpServers).toBeDefined();
      expect(typeof config.mcpServers).toBe('object');
    });

    test('should have linear server configured', () => {
      const mcpServers = config.mcpServers as Record<string, unknown>;
      expect(mcpServers.linear).toBeDefined();
    });

    test('linear server should have correct command', () => {
      const mcpServers = config.mcpServers as Record<string, unknown>;
      const linear = mcpServers.linear as Record<string, unknown>;
      expect(linear.command).toBe('npx');
      expect(linear.args).toContain('@linear/mcp-server-linear');
    });

    test('linear server should use LINEAR_API_KEY environment variable', () => {
      const mcpServers = config.mcpServers as Record<string, unknown>;
      const linear = mcpServers.linear as Record<string, unknown>;
      const env = linear.env as Record<string, string>;
      expect(env).toBeDefined();
      expect(env.LINEAR_API_KEY).toBe(ENV_VAR_PLACEHOLDER);
    });
  });
});
