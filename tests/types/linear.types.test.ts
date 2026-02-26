// Tests for Linear types and parsing
import { describe, expect, test } from 'bun:test';
import { LinearWebhookPayloadSchema, parseIssueInfo } from '../../src/types/linear.types';
import { sampleParsedIssue, sampleWebhookPayloads } from '../fixtures';

describe('Linear Types', () => {
  describe('LinearWebhookPayloadSchema', () => {
    test('should validate issue created payload', () => {
      const result = LinearWebhookPayloadSchema.safeParse(sampleWebhookPayloads.issueCreated);
      expect(result.success).toBe(true);
    });

    test('should validate issue updated payload', () => {
      const result = LinearWebhookPayloadSchema.safeParse(sampleWebhookPayloads.issueUpdated);
      expect(result.success).toBe(true);
    });

    test('should validate issue removed payload', () => {
      const result = LinearWebhookPayloadSchema.safeParse(sampleWebhookPayloads.issueRemoved);
      expect(result.success).toBe(true);
    });

    test('should validate feature request payload', () => {
      const result = LinearWebhookPayloadSchema.safeParse(sampleWebhookPayloads.featureRequest);
      expect(result.success).toBe(true);
    });

    test('should reject invalid payload', () => {
      const result = LinearWebhookPayloadSchema.safeParse(sampleWebhookPayloads.invalidPayload);
      expect(result.success).toBe(false);
    });

    test('should validate all action types', () => {
      for (const action of ['create', 'update', 'remove']) {
        const payload = {
          ...sampleWebhookPayloads.issueCreated,
          action,
        };
        const result = LinearWebhookPayloadSchema.safeParse(payload);
        expect(result.success).toBe(true);
      }
    });

    test('should reject invalid action type', () => {
      const payload = {
        ...sampleWebhookPayloads.issueCreated,
        action: 'invalid',
      };
      const result = LinearWebhookPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('parseIssueInfo', () => {
    test('should parse issue with all fields', () => {
      const result = LinearWebhookPayloadSchema.parse(sampleWebhookPayloads.issueCreated);
      const parsed = parseIssueInfo(result.data);

      expect(parsed.id).toBe(sampleParsedIssue.id);
      expect(parsed.identifier).toBe(sampleParsedIssue.identifier);
      expect(parsed.title).toBe(sampleParsedIssue.title);
      expect(parsed.description).toBe(sampleParsedIssue.description);
      expect(parsed.priority).toBe(sampleParsedIssue.priority);
      expect(parsed.priorityLabel).toBe(sampleParsedIssue.priorityLabel);
      expect(parsed.state).toBe(sampleParsedIssue.state);
      expect(parsed.stateType).toBe(sampleParsedIssue.stateType);
      expect(parsed.labels).toEqual(sampleParsedIssue.labels);
      expect(parsed.assignee).toBe(sampleParsedIssue.assignee);
      expect(parsed.creator).toBe(sampleParsedIssue.creator);
      expect(parsed.teamKey).toBe(sampleParsedIssue.teamKey);
      expect(parsed.teamName).toBe(sampleParsedIssue.teamName);
      expect(parsed.projectName).toBe(sampleParsedIssue.projectName);
    });

    test('should handle missing optional fields', () => {
      const payload = LinearWebhookPayloadSchema.parse(sampleWebhookPayloads.featureRequest);
      const parsed = parseIssueInfo(payload.data);

      expect(parsed.assignee).toBeNull();
      expect(parsed.dueDate).toBeNull();
      expect(parsed.projectName).toBeNull();
    });

    test('should extract labels correctly', () => {
      const payload = LinearWebhookPayloadSchema.parse(sampleWebhookPayloads.featureRequest);
      const parsed = parseIssueInfo(payload.data);

      expect(parsed.labels).toContain('feature');
      expect(parsed.labels).toContain('enhancement');
    });

    test('should handle empty labels array', () => {
      const payload = LinearWebhookPayloadSchema.parse(sampleWebhookPayloads.issueRemoved);
      const parsed = parseIssueInfo(payload.data);

      expect(parsed.labels).toEqual([]);
    });

    test('should handle null description', () => {
      const payload = {
        ...sampleWebhookPayloads.issueCreated,
        data: {
          ...sampleWebhookPayloads.issueCreated.data,
          description: null,
        },
      };
      const validated = LinearWebhookPayloadSchema.parse(payload);
      const parsed = parseIssueInfo(validated.data);

      expect(parsed.description).toBe('');
    });
  });
});
