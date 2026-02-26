// Tests for templates configuration
import { describe, expect, test } from 'bun:test';
import { getTemplateFormat, renderTemplate, templatesConfig } from '../../config/templates.config';

describe('Templates Configuration', () => {
  describe('templatesConfig', () => {
    test('should have required templates defined', () => {
      expect(templatesConfig['webhook-success']).toBeDefined();
      expect(templatesConfig['webhook-error']).toBeDefined();
      expect(templatesConfig['copilot-result']).toBeDefined();
      expect(templatesConfig['linear-comment']).toBeDefined();
      expect(templatesConfig['summary-report']).toBeDefined();
    });

    test('all templates should have required properties', () => {
      for (const [id, template] of Object.entries(templatesConfig)) {
        expect(template.id).toBe(id);
        expect(template.name).toBeDefined();
        expect(['markdown', 'json', 'plain']).toContain(template.format);
        expect(template.template).toBeDefined();
      }
    });
  });

  describe('renderTemplate', () => {
    test('should render webhook-success template', () => {
      const result = renderTemplate('webhook-success', {
        message: 'Success!',
        issueId: 'ENG-123',
        action: 'bug-fixer',
        timestamp: '2026-02-22T10:00:00.000Z',
      });

      const parsed = JSON.parse(result);
      expect(parsed.status).toBe('success');
      expect(parsed.message).toBe('Success!');
      expect(parsed.issueId).toBe('ENG-123');
      expect(parsed.action).toBe('bug-fixer');
    });

    test('should render webhook-error template', () => {
      const result = renderTemplate('webhook-error', {
        error: 'Something went wrong',
        code: 'ERR_001',
        timestamp: '2026-02-22T10:00:00.000Z',
      });

      const parsed = JSON.parse(result);
      expect(parsed.status).toBe('error');
      expect(parsed.error).toBe('Something went wrong');
      expect(parsed.code).toBe('ERR_001');
    });

    test('should render copilot-result template in markdown', () => {
      const result = renderTemplate('copilot-result', {
        title: 'Test Issue',
        agentName: 'Bug Fixer',
        timestamp: '2026-02-22T10:00:00.000Z',
        analysis: 'This is the analysis',
        recommendations: '- Fix this\n- Fix that',
      });

      expect(result).toContain('## Copilot Analysis Result');
      expect(result).toContain('Test Issue');
      expect(result).toContain('Bug Fixer');
      expect(result).toContain('This is the analysis');
    });

    test('should handle undefined variables as empty string', () => {
      const result = renderTemplate('webhook-success', {
        message: 'Test',
        issueId: undefined,
        action: 'test',
        timestamp: '2026-02-22T10:00:00.000Z',
      });

      expect(result).toContain('"issueId": ""');
    });

    test('should handle number variables', () => {
      const result = renderTemplate('summary-report', {
        totalProcessed: 10,
        successful: 8,
        failed: 2,
        startDate: '2026-02-01',
        endDate: '2026-02-22',
        details: 'Details here',
        timestamp: '2026-02-22T10:00:00.000Z',
      });

      expect(result).toContain('10');
      expect(result).toContain('8');
      expect(result).toContain('2');
    });

    test('should throw error for unknown template', () => {
      expect(() => renderTemplate('non-existent', {})).toThrow('Template not found: non-existent');
    });
  });

  describe('getTemplateFormat', () => {
    test('should return json for webhook templates', () => {
      expect(getTemplateFormat('webhook-success')).toBe('json');
      expect(getTemplateFormat('webhook-error')).toBe('json');
    });

    test('should return markdown for copilot templates', () => {
      expect(getTemplateFormat('copilot-result')).toBe('markdown');
      expect(getTemplateFormat('linear-comment')).toBe('markdown');
      expect(getTemplateFormat('summary-report')).toBe('markdown');
    });

    test('should return plain for unknown template', () => {
      expect(getTemplateFormat('non-existent')).toBe('plain');
    });
  });
});
