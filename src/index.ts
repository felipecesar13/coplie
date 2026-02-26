// Main application entry point

import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { appConfig } from '../config';
import { webhookRoutes } from './routes';
import { logger } from './utils';

// Create the Elysia application
const app = new Elysia()
  // CORS middleware
  .use(cors())

  // Request logging middleware
  .onRequest(({ request }) => {
    logger.debug('Incoming request', {
      method: request.method,
      url: request.url,
    });
  })

  // Response logging middleware
  .onAfterHandle(({ request, set }) => {
    logger.debug('Request completed', {
      method: request.method,
      url: request.url,
      status: set.status,
    });
  })

  // Error handler
  .onError(({ error, set }) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    logger.error('Unhandled error', {
      error: errorMessage,
      stack: errorStack,
    });

    set.status = 500;
    return {
      status: 'error',
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    };
  })

  // Root endpoint
  .get('/', () => ({
    name: 'Coplie',
    description: 'Linear Webhook + Copilot CLI Integration',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      webhook: '/webhook/linear',
    },
  }))

  // Register routes
  .use(webhookRoutes)

  // Start the server
  .listen(appConfig.server.port);

logger.info(`🚀 Coplie server running`, {
  host: appConfig.server.host,
  port: appConfig.server.port,
  url: `http://${appConfig.server.host}:${appConfig.server.port}`,
});

export { app };
