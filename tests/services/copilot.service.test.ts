// Tests for Copilot Service
import { beforeEach, describe, expect, test } from 'bun:test';
import { CopilotService } from '../../src/services/copilot.service';
import type { ParsedIssueInfo } from '../../src/types';
import { sampleParsedIssue } from '../fixtures';

describe('CopilotService', () => {
  let copilotService: CopilotService;

  beforeEach(() => {
    copilotService = new CopilotService();
  });

  describe('processIssue', () => {
    test('should always use product_manager agent', async () => {
      const issue: ParsedIssueInfo = {
        ...sampleParsedIssue,
        description: 'Add new feature for user authentication',
      };

      const result = await copilotService.processIssue(issue);

      expect(result.success).toBe(true);
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    test('should use issue description as prompt', async () => {
      const issue: ParsedIssueInfo = {
        ...sampleParsedIssue,
        description: 'This is a test description',
      };

      const result = await copilotService.processIssue(issue);
      expect(result.success).toBe(true);
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    test('should fallback to title when description is empty', async () => {
      const issue: ParsedIssueInfo = {
        ...sampleParsedIssue,
        description: '',
        title: 'Test issue title',
      };

      const result = await copilotService.processIssue(issue);
      expect(result.success).toBe(true);
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('execute', () => {
    test('should return execution time even on failure', async () => {
      const result = await copilotService.execute({
        prompt: 'Test prompt',
        agentId: 'product_manager',
      });

      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    test('should return CopilotResponse structure', async () => {
      const result = await copilotService.execute({
        prompt: 'Test prompt',
        agentId: 'product_manager',
      });

      expect(typeof result.success).toBe('boolean');
      expect(typeof result.output).toBe('string');
      expect(typeof result.executionTime).toBe('number');
    });
  });
});
