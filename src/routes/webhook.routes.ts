// Webhook routes
import { Elysia } from 'elysia';
import { webhookService } from '../services';
import { generateRequestId, logger } from '../utils';

export const webhookRoutes = new Elysia({ prefix: '/webhook' })
  // Linear webhook endpoint
  .post('/linear', async ({ request, set }) => {
    const requestId = generateRequestId();

    logger.info('Received Linear webhook', { requestId });

    try {
      // Get raw body for signature verification
      const body = await request.text();
      const signature = request.headers.get('linear-signature');

      // Process the webhook
      const result = await webhookService.processWebhook(body, signature);

      // Format and return response
      const response = webhookService.formatResponse(result);

      set.headers['content-type'] = 'application/json';
      set.headers['x-request-id'] = requestId;

      if (!result.success && result.error) {
        set.status = result.error.includes('signature') ? 401 : 400;
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      logger.error('Webhook route error', {
        requestId,
        error: errorMessage,
      });

      set.status = 500;
      set.headers['content-type'] = 'application/json';
      set.headers['x-request-id'] = requestId;

      return JSON.stringify({
        status: 'error',
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  })

  // Webhook verification endpoint (for Linear setup)
  .get('/linear', ({ set }) => {
    set.headers['content-type'] = 'application/json';

    return JSON.stringify({
      status: 'ok',
      message: 'Linear webhook endpoint is active',
      timestamp: new Date().toISOString(),
    });
  });
