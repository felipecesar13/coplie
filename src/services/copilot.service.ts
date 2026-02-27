// Copilot CLI integration service
import { spawn } from 'bun';
import { appConfig, getAgentName } from '../../config';
import type { CopilotRequest, CopilotResponse, ParsedIssueInfo } from '../types';
import { logger } from '../utils';

// Check if we're in test mode (skip actual CLI calls)
const isTestMode = process.env.NODE_ENV === 'test' || process.env.BUN_ENV === 'test';

export class CopilotService {
  private cliPath: string;
  private timeout: number;

  constructor() {
    this.cliPath = appConfig.copilot.cliPath;
    this.timeout = appConfig.copilot.timeout;
  }

  /**
   * Execute a prompt using the Copilot CLI
   */
  async execute(request: CopilotRequest): Promise<CopilotResponse> {
    const startTime = Date.now();

    // In test mode, return a mock response
    if (isTestMode) {
      return {
        success: true,
        output: 'Mock Copilot response for testing',
        executionTime: Date.now() - startTime,
      };
    }

    try {
      logger.info('Executing Copilot CLI command', {
        agentId: request.agentId,
        promptLength: request.prompt.length,
      });

      // Build the command
      const args = this.buildCommandArgs(request);

      // Execute the command
      const proc = spawn({
        cmd: args,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      // Handle timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          proc.kill();
          reject(new Error(`Command timed out after ${this.timeout}ms`));
        }, this.timeout);
      });

      // Wait for the process to complete
      const result = await Promise.race([this.waitForProcess(proc), timeoutPromise]);

      const executionTime = Date.now() - startTime;

      logger.info('Copilot CLI command completed', {
        agentId: request.agentId,
        executionTime,
        success: true,
      });

      return {
        success: true,
        output: result,
        executionTime,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      logger.error('Copilot CLI command failed', {
        agentId: request.agentId,
        error: errorMessage,
        executionTime,
      });

      return {
        success: false,
        output: '',
        error: errorMessage,
        executionTime,
      };
    }
  }

  /**
   * Process an issue and get Copilot analysis
   * Uses only the issue description as the prompt
   */
  async processIssue(issue: ParsedIssueInfo): Promise<CopilotResponse> {
    // Get the agent name
    const agentName = getAgentName();

    // Use the issue description as the prompt
    const prompt = issue.description || issue.title;

    return this.execute({
      prompt,
      agentId: agentName,
    });
  }

  /**
   * Build command arguments for Copilot CLI
   * The agent is configured in the CLI, we just pass the agent name
   */
  private buildCommandArgs(request: CopilotRequest): string[] {
    // The Copilot CLI command structure with agent parameter
    // Example: copilot --agent bug-fixer "issue data"
    const cliParts = this.cliPath.split(' ');

    // Escape the prompt for shell
    const escapedPrompt = request.prompt.replace(/"/g, '\\"');

    // Pass the agent name and the issue data to the CLI
    return [...cliParts, '--agent', request.agentId, escapedPrompt];
  }

  /**
   * Wait for process to complete and collect output
   */
  private async waitForProcess(proc: ReturnType<typeof spawn>): Promise<string> {
    let stdout = '';
    let stderr = '';

    if (proc.stdout && typeof proc.stdout !== 'number') {
      stdout = await new Response(proc.stdout).text();
    }
    if (proc.stderr && typeof proc.stderr !== 'number') {
      stderr = await new Response(proc.stderr).text();
    }

    const exitCode = await proc.exited;

    if (exitCode !== 0) {
      throw new Error(`Process exited with code ${exitCode}: ${stderr}`);
    }

    return stdout || stderr;
  }
}

// Singleton instance
export const copilotService = new CopilotService();
