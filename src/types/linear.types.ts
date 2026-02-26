// Linear webhook payload types
import { z } from 'zod';

// Linear user schema
export const LinearUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
});

// Linear label schema
export const LinearLabelSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional(),
});

// Linear state schema
export const LinearStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  color: z.string().optional(),
});

// Linear team schema
export const LinearTeamSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
});

// Linear project schema
export const LinearProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: z.string().optional(),
});

// Linear issue schema
export const LinearIssueSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  priority: z.number().optional(),
  priorityLabel: z.string().optional(),
  state: LinearStateSchema.optional(),
  assignee: LinearUserSchema.nullable().optional(),
  creator: LinearUserSchema.nullable().optional(),
  team: LinearTeamSchema.optional(),
  project: LinearProjectSchema.nullable().optional(),
  labels: z.array(LinearLabelSchema).optional(),
  url: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  dueDate: z.string().nullable().optional(),
  estimate: z.number().nullable().optional(),
  subscriberIds: z.array(z.string()).optional(),
});

// Webhook action types
export const WebhookActionSchema = z.enum(['create', 'update', 'remove']);

// Webhook payload schema
export const LinearWebhookPayloadSchema = z.object({
  action: WebhookActionSchema,
  type: z.string(),
  createdAt: z.string(),
  data: LinearIssueSchema,
  updatedFrom: z.record(z.unknown()).optional(),
  url: z.string().optional(),
  organizationId: z.string().optional(),
  webhookTimestamp: z.number().optional(),
  webhookId: z.string().optional(),
});

// Infer types from schemas
export type LinearUser = z.infer<typeof LinearUserSchema>;
export type LinearLabel = z.infer<typeof LinearLabelSchema>;
export type LinearState = z.infer<typeof LinearStateSchema>;
export type LinearTeam = z.infer<typeof LinearTeamSchema>;
export type LinearProject = z.infer<typeof LinearProjectSchema>;
export type LinearIssue = z.infer<typeof LinearIssueSchema>;
export type WebhookAction = z.infer<typeof WebhookActionSchema>;
export type LinearWebhookPayload = z.infer<typeof LinearWebhookPayloadSchema>;

// Parsed issue info for processing
export interface ParsedIssueInfo {
  id: string;
  identifier: string;
  title: string;
  description: string;
  priority: number;
  priorityLabel: string;
  state: string;
  stateType: string;
  labels: string[];
  assignee: string | null;
  creator: string | null;
  teamKey: string;
  teamName: string;
  projectName: string | null;
  url: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
}

// Parse webhook issue to simplified format
export function parseIssueInfo(issue: LinearIssue): ParsedIssueInfo {
  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    description: issue.description || '',
    priority: issue.priority || 0,
    priorityLabel: issue.priorityLabel || 'No Priority',
    state: issue.state?.name || 'Unknown',
    stateType: issue.state?.type || 'unknown',
    labels: issue.labels?.map(l => l.name) || [],
    assignee: issue.assignee?.name || null,
    creator: issue.creator?.name || null,
    teamKey: issue.team?.key || '',
    teamName: issue.team?.name || '',
    projectName: issue.project?.name || null,
    url: issue.url || '',
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    dueDate: issue.dueDate || null,
  };
}
