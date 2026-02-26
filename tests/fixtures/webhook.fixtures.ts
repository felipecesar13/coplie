// Test fixture: Sample Linear webhook payloads
export const sampleWebhookPayloads = {
  // Create issue payload
  issueCreated: {
    action: 'create',
    type: 'Issue',
    createdAt: '2026-02-22T10:00:00.000Z',
    data: {
      id: 'issue-123',
      identifier: 'ENG-456',
      title: 'Fix authentication bug in login flow',
      description:
        'Users are experiencing intermittent login failures. The error occurs when the session token expires.',
      priority: 1,
      priorityLabel: 'Urgent',
      state: {
        id: 'state-1',
        name: 'Todo',
        type: 'unstarted',
        color: '#e2e2e2',
      },
      assignee: {
        id: 'user-1',
        name: 'John Developer',
        email: 'john@example.com',
      },
      creator: {
        id: 'user-2',
        name: 'Jane Manager',
        email: 'jane@example.com',
      },
      team: {
        id: 'team-1',
        key: 'ENG',
        name: 'Engineering',
      },
      project: {
        id: 'project-1',
        name: 'Q1 Sprint',
        state: 'started',
      },
      labels: [
        { id: 'label-1', name: 'bug', color: '#ff0000' },
        { id: 'label-2', name: 'authentication', color: '#00ff00' },
      ],
      url: 'https://linear.app/workspace/issue/ENG-456',
      createdAt: '2026-02-22T10:00:00.000Z',
      updatedAt: '2026-02-22T10:00:00.000Z',
      dueDate: '2026-02-25',
      estimate: 3,
      subscriberIds: ['user-1', 'user-2'],
    },
    organizationId: 'org-123',
    webhookTimestamp: 1708596000000,
    webhookId: 'webhook-123',
  },

  // Update issue payload
  issueUpdated: {
    action: 'update',
    type: 'Issue',
    createdAt: '2026-02-22T11:00:00.000Z',
    data: {
      id: 'issue-123',
      identifier: 'ENG-456',
      title: 'Fix authentication bug in login flow',
      description:
        'Users are experiencing intermittent login failures. The error occurs when the session token expires.',
      priority: 1,
      priorityLabel: 'Urgent',
      state: {
        id: 'state-2',
        name: 'In Progress',
        type: 'started',
        color: '#0000ff',
      },
      assignee: {
        id: 'user-1',
        name: 'John Developer',
        email: 'john@example.com',
      },
      creator: {
        id: 'user-2',
        name: 'Jane Manager',
        email: 'jane@example.com',
      },
      team: {
        id: 'team-1',
        key: 'ENG',
        name: 'Engineering',
      },
      labels: [
        { id: 'label-1', name: 'bug', color: '#ff0000' },
        { id: 'label-2', name: 'authentication', color: '#00ff00' },
      ],
      url: 'https://linear.app/workspace/issue/ENG-456',
      createdAt: '2026-02-22T10:00:00.000Z',
      updatedAt: '2026-02-22T11:00:00.000Z',
      dueDate: '2026-02-25',
      estimate: 3,
    },
    updatedFrom: {
      stateId: 'state-1',
      updatedAt: '2026-02-22T10:00:00.000Z',
    },
    organizationId: 'org-123',
    webhookTimestamp: 1708599600000,
    webhookId: 'webhook-124',
  },

  // Feature request payload
  featureRequest: {
    action: 'create',
    type: 'Issue',
    createdAt: '2026-02-22T12:00:00.000Z',
    data: {
      id: 'issue-789',
      identifier: 'ENG-789',
      title: 'Add dark mode support',
      description:
        'Users have requested dark mode support for the application. This would improve accessibility and reduce eye strain.',
      priority: 2,
      priorityLabel: 'High',
      state: {
        id: 'state-1',
        name: 'Backlog',
        type: 'backlog',
        color: '#e2e2e2',
      },
      assignee: null,
      creator: {
        id: 'user-3',
        name: 'Product Owner',
        email: 'product@example.com',
      },
      team: {
        id: 'team-1',
        key: 'ENG',
        name: 'Engineering',
      },
      labels: [
        { id: 'label-3', name: 'feature', color: '#00ff00' },
        { id: 'label-4', name: 'enhancement', color: '#ffff00' },
      ],
      url: 'https://linear.app/workspace/issue/ENG-789',
      createdAt: '2026-02-22T12:00:00.000Z',
      updatedAt: '2026-02-22T12:00:00.000Z',
      dueDate: null,
      estimate: null,
    },
    organizationId: 'org-123',
    webhookTimestamp: 1708603200000,
    webhookId: 'webhook-125',
  },

  // Remove issue payload
  issueRemoved: {
    action: 'remove',
    type: 'Issue',
    createdAt: '2026-02-22T13:00:00.000Z',
    data: {
      id: 'issue-999',
      identifier: 'ENG-999',
      title: 'Duplicate issue - to be deleted',
      description: 'This issue is a duplicate.',
      priority: 4,
      priorityLabel: 'Low',
      state: {
        id: 'state-3',
        name: 'Cancelled',
        type: 'canceled',
      },
      team: {
        id: 'team-1',
        key: 'ENG',
        name: 'Engineering',
      },
      labels: [],
      url: 'https://linear.app/workspace/issue/ENG-999',
      createdAt: '2026-02-22T13:00:00.000Z',
      updatedAt: '2026-02-22T13:00:00.000Z',
    },
    organizationId: 'org-123',
    webhookTimestamp: 1708606800000,
    webhookId: 'webhook-126',
  },

  // Invalid payload (missing required fields)
  invalidPayload: {
    action: 'create',
    type: 'Issue',
    data: {
      id: 'issue-invalid',
      // Missing required fields like title, identifier
    },
  },

  // Non-issue webhook (Comment)
  commentCreated: {
    action: 'create',
    type: 'Comment',
    createdAt: '2026-02-22T14:00:00.000Z',
    data: {
      id: 'comment-123',
      body: 'This is a comment on the issue',
      issueId: 'issue-123',
    },
    organizationId: 'org-123',
  },
};

// Export parsed issue for testing
export const sampleParsedIssue = {
  id: 'issue-123',
  identifier: 'ENG-456',
  title: 'Fix authentication bug in login flow',
  description: 'Users are experiencing intermittent login failures. The error occurs when the session token expires.',
  priority: 1,
  priorityLabel: 'Urgent',
  state: 'Todo',
  stateType: 'unstarted',
  labels: ['bug', 'authentication'],
  assignee: 'John Developer',
  creator: 'Jane Manager',
  teamKey: 'ENG',
  teamName: 'Engineering',
  projectName: 'Q1 Sprint',
  url: 'https://linear.app/workspace/issue/ENG-456',
  createdAt: '2026-02-22T10:00:00.000Z',
  updatedAt: '2026-02-22T10:00:00.000Z',
  dueDate: '2026-02-25',
};
