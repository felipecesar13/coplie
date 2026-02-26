// Integration tests for the Elysia server
import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { webhookRoutes } from '../../src/routes';
import { sampleWebhookPayloads } from '../fixtures';

describe('Server Integration', () => {
  let app: ReturnType<typeof Elysia.prototype.listen>;
  let baseUrl: string;

  beforeAll(() => {
    // Create test app
    const server = new Elysia()
      .use(cors())
      .get('/', () => ({ name: 'Coplie', version: '1.0.0' }))
      .use(webhookRoutes)
      .listen(0); // Use random available port

    app = server;
    baseUrl = `http://localhost:${server.server?.port}`;
  });

  afterAll(() => {
    app.stop();
  });

  describe('Root endpoint', () => {
    test('should return app info', async () => {
      const response = await fetch(`${baseUrl}/`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe('Coplie');
      expect(data.version).toBe('1.0.0');
    });
  });

  describe('Webhook endpoints', () => {
    test('GET /webhook/linear should return active status', async () => {
      const response = await fetch(`${baseUrl}/webhook/linear`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
      expect(data.message).toContain('active');
    });

    test('POST /webhook/linear should process valid webhook', async () => {
      const response = await fetch(`${baseUrl}/webhook/linear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleWebhookPayloads.issueCreated),
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('x-request-id')).toBeDefined();
    });

    test('POST /webhook/linear should handle invalid payload', async () => {
      const response = await fetch(`${baseUrl}/webhook/linear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleWebhookPayloads.invalidPayload),
      });

      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.status).toBe('error');
    });

    test('POST /webhook/linear should handle invalid JSON', async () => {
      const response = await fetch(`${baseUrl}/webhook/linear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'not valid json',
      });

      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.status).toBe('error');
    });

    test('POST /webhook/linear should include request ID header', async () => {
      const response = await fetch(`${baseUrl}/webhook/linear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleWebhookPayloads.featureRequest),
      });

      const requestId = response.headers.get('x-request-id');
      expect(requestId).toBeDefined();
      expect(requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });
  });
});
