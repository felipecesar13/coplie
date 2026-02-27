# Coplie

Linear Webhook + Copilot CLI Integration

A TypeScript application built with Bun and Elysia that connects to Linear webhooks, automatically detects when issues are created in backlog, and passes them to the Copilot CLI's `product_manager` agent for automated processing.

## Features

- 🔗 **Linear Webhook Integration**: Receives and processes Linear issue webhooks
- 🎯 **Backlog Detection**: Automatically detects issues created in backlog state
- 🤖 **Product Manager Agent**: Uses the Copilot CLI `product_manager` agent for issue analysis
- 📝 **Simple Prompts**: Uses issue description directly as prompt for the agent
- ✅ **Fully Tested**: Comprehensive test suite using Bun's test runner
- 🔒 **Secure**: HMAC signature verification for webhooks

## Requirements

- [Bun](https://bun.sh/) >= 1.0
- [GitHub CLI](https://cli.github.com/) with Copilot extension
- A Copilot CLI agent named `product_manager` configured
- Linear account with webhook access

## Installation

```bash
# Clone the repository
cd coplie

# Install dependencies
# Note: This will automatically install @github/copilot globally via the postinstall script
bun install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Automated Setup

The project includes a `postinstall` script that automatically installs the GitHub Copilot CLI (`@github/copilot`) globally when you run `bun install`. This ensures all developers have the required Copilot CLI tool without manual installation steps.

If you need to manually install the Copilot CLI:
```bash
npm install -g @github/copilot
```

## Configuration

### Environment Variables

| Variable                | Description                   | Default      |
| ----------------------- | ----------------------------- | ------------ |
| `PORT`                  | Server port                   | `3000`       |
| `HOST`                  | Server host                   | `0.0.0.0`    |
| `LINEAR_WEBHOOK_SECRET` | Linear webhook signing secret | -            |
| `LINEAR_API_KEY`        | Linear API key (optional)     | -            |
| `COPILOT_CLI_PATH`      | Path to Copilot CLI           | `gh copilot` |
| `COPILOT_TIMEOUT`       | CLI execution timeout (ms)    | `30000`      |
| `LOG_LEVEL`             | Logging level                 | `info`       |
| `LOG_FORMAT`            | Log format (json/text)        | `json`       |

### Configuration Files

Configuration files are located in the `config/` directory:

- **`app.config.ts`**: Application settings (server, Linear, Copilot, logging)
- **`agents.config.ts`**: Agent name configuration
- **`templates.config.ts`**: Response templates for webhook responses

**Note**: The `product_manager` agent must be configured in the Copilot CLI. This application only invokes it when backlog issues are created.

## Usage

### Development

```bash
# Start development server with hot reload
bun run dev
```

### Production

```bash
# Start production server
bun run start
```

### Testing

```bash
# Run all tests
bun test

# Run tests with watch mode
bun test --watch
```

## API Endpoints

### Webhook

```
GET  /webhook/linear  - Verify webhook endpoint
POST /webhook/linear  - Receive Linear webhooks
```

## Linear Webhook Setup

1. Go to Linear Settings → API → Webhooks
2. Create a new webhook with URL: `https://your-server.com/webhook/linear`
3. Select "Issues" as the resource type
4. Copy the signing secret to your `.env` file

## Project Structure

```
coplie/
├── config/                 # Configuration files
│   ├── app.config.ts      # Application settings
│   ├── agents.config.ts   # Agent name mappings
│   ├── templates.config.ts # Response templates
│   └── index.ts           # Config exports
├── src/
│   ├── routes/            # API routes
│   │   ├── webhook.routes.ts
│   │   └── index.ts
│   ├── services/          # Business logic
│   │   ├── copilot.service.ts
│   │   ├── webhook.service.ts
│  How It Works

1. **Webhook Reception**: Linear sends webhook events when issues are created
2. **Signature Verification**: The webhook signature is verified using HMAC SHA256
3. **Payload Parsing**: The webhook payload is validated using Zod schemas
4. **Backlog Detection**: Only issues created in the backlog state are processed
5. **Copilot Execution**: The issue description is sent to the `product_manager` agent via Copilot CLI
6. **Response Generation**: The result is formatted and returned

## Processing Flow

```
Linear Issue Created (Backlog)
        ↓
Webhook Received
        ↓
Signature Verified
        ↓
Backlog State Detected
        ↓
Issue Description Extracted
        ↓
Copilot CLI (product_manager agent)
        ↓
Response Logged
```