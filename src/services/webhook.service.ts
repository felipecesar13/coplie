// Linear webhook handler service

import { getAgentName, renderTemplate } from '../../config';
import {
  type LinearWebhookPayload,
  LinearWebhookPayloadSchema,
  type ParsedIssueInfo,
  type ProcessingResult,
  parseIssueInfo,
} from '../types';
import { logger, verifyLinearWebhookSignature } from '../utils';
import { copilotService } from './copilot.service';

export class WebhookService {
  /**
   * Process an incoming webhook request
   */
  async processWebhook(body: string, signature: string | null): Promise<ProcessingResult> {
    const timestamp = new Date().toISOString();

    try {
      // Verify signature
      const isValid = await verifyLinearWebhookSignature(body, signature);
      if (!isValid) {
        logger.warn('Invalid webhook signature');
        return {
          success: false,
          issueId: '',
          issueIdentifier: '',
          agentId: '',
          error: 'Invalid webhook signature',
          timestamp,
        };
      }

      // Parse and validate payload
      const payload = this.parsePayload(body);
      if (!payload) {
        return {
          success: false,
          issueId: '',
          issueIdentifier: '',
          agentId: '',
          error: 'Invalid webhook payload',
          timestamp,
        };
      }

      // Only process Issue type webhooks
      if (payload.type !== 'Issue') {
        logger.info('Ignoring non-Issue webhook', { type: payload.type });
        return {
          success: true,
          issueId: '',
          issueIdentifier: '',
          agentId: '',
          timestamp,
        };
      }

      // Only process 'create' actions
      if (payload.action !== 'create') {
        logger.info('Ignoring non-create action', { action: payload.action });
        return {
          success: true,
          issueId: payload.data.id,
          issueIdentifier: payload.data.identifier,
          agentId: '',
          timestamp,
        };
      }

      // Parse issue info
      const issueInfo = parseIssueInfo(payload.data);

      // Only process backlog issues
      if (issueInfo.stateType !== 'backlog') {
        logger.info('Ignoring non-backlog issue', {
          issueId: issueInfo.id,
          identifier: issueInfo.identifier,
          stateType: issueInfo.stateType,
        });
        return {
          success: true,
          issueId: issueInfo.id,
          issueIdentifier: issueInfo.identifier,
          agentId: '',
          timestamp,
        };
      }

      // Log the action
      logger.info('Processing backlog issue', {
        action: payload.action,
        issueId: issueInfo.id,
        identifier: issueInfo.identifier,
        title: issueInfo.title,
      });

      // Process based on action
      return await this.handleIssueAction(payload.action, issueInfo, timestamp);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Webhook processing error', { error: errorMessage });

      return {
        success: false,
        issueId: '',
        issueIdentifier: '',
        agentId: '',
        error: errorMessage,
        timestamp,
      };
    }
  }

  /**
   * Handle issue action (create)
   */
  private async handleIssueAction(
    action: string,
    issueInfo: ParsedIssueInfo,
    timestamp: string,
  ): Promise<ProcessingResult> {
    // Get agent name
    const agentName = getAgentName();

    // Process with Copilot
    logger.info('Processing issue with Copilot', {
      issueId: issueInfo.id,
      identifier: issueInfo.identifier,
      agentId: agentName,
      action,
    });

    const copilotResponse = await copilotService.processIssue(issueInfo);

    if (copilotResponse.success) {
      logger.info('Issue processed successfully', {
        issueId: issueInfo.id,
        identifier: issueInfo.identifier,
        agentId: agentName,
        executionTime: copilotResponse.executionTime,
      });
    } else {
      logger.error('Issue processing failed', {
        issueId: issueInfo.id,
        identifier: issueInfo.identifier,
        agentId: agentName,
        error: copilotResponse.error,
      });
    }

    return {
      success: copilotResponse.success,
      issueId: issueInfo.id,
      issueIdentifier: issueInfo.identifier,
      agentId: agentName,
      copilotResponse,
      error: copilotResponse.error,
      timestamp,
    };
  }

  /**
   * Parse and validate webhook payload
   */
  private parsePayload(body: string): LinearWebhookPayload | null {
    try {
      const parsed = JSON.parse(body);

      // Check if this is an Issue webhook first
      if (parsed.type && parsed.type !== 'Issue') {
        // For non-Issue webhooks, return a minimal valid payload
        // We'll handle this gracefully in processWebhook
        logger.info('Non-Issue webhook received', { type: parsed.type });
        return {
          action: parsed.action || 'create',
          type: parsed.type,
          createdAt: parsed.createdAt || new Date().toISOString(),
          data: {
            id: '',
            identifier: '',
            title: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        } as LinearWebhookPayload;
      }

      const validated = LinearWebhookPayloadSchema.safeParse(parsed);

      if (!validated.success) {
        logger.warn('Webhook payload validation failed', {
          errors: validated.error.errors,
        });
        return null;
      }

      return validated.data;
    } catch (error) {
      logger.error('Failed to parse webhook payload', {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Format the processing result for response
   */
  formatResponse(result: ProcessingResult): string {
    if (result.success) {
      return renderTemplate('webhook-success', {
        message: 'Webhook processed successfully',
        issueId: result.issueIdentifier || 'N/A',
        action: result.agentId,
        timestamp: result.timestamp,
      });
    } else {
      return renderTemplate('webhook-error', {
        error: result.error || 'Unknown error',
        code: 'PROCESSING_ERROR',
        timestamp: result.timestamp,
      });
    }
  }
}

// Singleton instance
export const webhookService = new WebhookService();
