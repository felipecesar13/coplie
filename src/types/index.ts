// Type exports
export {
  type LinearIssue,
  LinearIssueSchema,
  type LinearLabel,
  LinearLabelSchema,
  type LinearProject,
  LinearProjectSchema,
  type LinearState,
  LinearStateSchema,
  type LinearTeam,
  LinearTeamSchema,
  type LinearUser,
  LinearUserSchema,
  type LinearWebhookPayload,
  LinearWebhookPayloadSchema,
  type ParsedIssueInfo,
  parseIssueInfo,
  type WebhookAction,
  WebhookActionSchema,
} from './linear.types';

// Copilot types
export interface CopilotRequest {
  prompt: string;
  context?: string;
  agentId: string;
}

export interface CopilotResponse {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
}

// Processing result
export interface ProcessingResult {
  success: boolean;
  issueId: string;
  issueIdentifier: string;
  agentId: string;
  copilotResponse?: CopilotResponse;
  error?: string;
  timestamp: string;
}
