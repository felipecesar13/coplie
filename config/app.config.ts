// Application configuration
export const appConfig = {
  // Server settings
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
  },

  // Linear webhook settings
  linear: {
    webhookSecret: process.env.LINEAR_WEBHOOK_SECRET || '',
    apiKey: process.env.LINEAR_API_KEY || '',
  },

  // Copilot CLI settings
  copilot: {
    cliPath: process.env.COPILOT_CLI_PATH || 'copilot',
    timeout: parseInt(process.env.COPILOT_TIMEOUT || '30000', 10),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
};

export type AppConfig = typeof appConfig;
