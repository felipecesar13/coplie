// Tests for Webhook Service
import { beforeEach, describe, expect, test } from 'bun:test';
import { WebhookService } from '../../src/services/webhook.service';
import { sampleWebhookPayloads } from '../fixtures';

describe('WebhookService', () => {
  let webhookService: WebhookService;

  beforeEach(() => {
    webhookService = new WebhookService();
  });

  describe('processWebhook', () => {
    test('should process valid backlog issue creation', async () => {
      const body = JSON.stringify(sampleWebhookPayloads.featureRequest);
      const result = await webhookService.processWebhook(body, null);

      expect(result.issueId).toBe('issue-789');
      expect(result.issueIdentifier).toBe('ENG-789');
      expect(result.agentId).toBe('product_manager');
      expect(result.timestamp).toBeDefined();
    });

    test('should ignore non-backlog issue creation', async () => {
      const body = JSON.stringify(sampleWebhookPayloads.issueCreated);
      const result = await webhookService.processWebhook(body, null);

      expect(result.success).toBe(true);
      expect(result.issueId).toBe('issue-123');
      expect(result.agentId).toBe('');
    });

    test('should ignore update actions', async () => {
      const body = JSON.stringify(sampleWebhookPayloads.issueUpdated);
      const result = await webhookService.processWebhook(body, null);

      expect(result.success).toBe(true);
      expect(result.issueId).toBe('issue-123');
      expect(result.agentId).toBe('');
    });

    test('should ignore remove actions', async () => {
      const body = JSON.stringify(sampleWebhookPayloads.issueRemoved);
      const result = await webhookService.processWebhook(body, null);

      expect(result.success).toBe(true);
      expect(result.issueId).toBe('issue-999');
      expect(result.agentId).toBe('');
    });

    test('should ignore non-Issue webhooks', async () => {
      const body = JSON.stringify(sampleWebhookPayloads.commentCreated);
      const result = await webhookService.processWebhook(body, null);

      // Should succeed but not process
      expect(result.success).toBe(true);
      expect(result.issueId).toBe('');
    });

    test('should return error for invalid JSON', async () => {
      const body = 'not valid json';
      const result = await webhookService.processWebhook(body, null);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should return error for invalid payload', async () => {
      const body = JSON.stringify(sampleWebhookPayloads.invalidPayload);
      const result = await webhookService.processWebhook(body, null);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid webhook payload');
    });
  });

  describe('formatResponse', () => {
    test('should format success response', () => {
      const result = {
        success: true,
        issueId: 'issue-123',
        issueIdentifier: 'ENG-456',
        agentId: 'product_manager',
        timestamp: '2026-02-22T10:00:00.000Z',
      };

      const response = webhookService.formatResponse(result);
      const parsed = JSON.parse(response);

      expect(parsed.status).toBe('success');
      expect(parsed.issueId).toBe('ENG-456');
    });

    test('should format error response', () => {
      const result = {
        success: false,
        issueId: '',
        issueIdentifier: '',
        agentId: '',
        error: 'Something went wrong',
        timestamp: '2026-02-22T10:00:00.000Z',
      };

      const response = webhookService.formatResponse(result);
      const parsed = JSON.parse(response);

      expect(parsed.status).toBe('error');
      expect(parsed.error).toBe('Something went wrong');
    });
  });
});
