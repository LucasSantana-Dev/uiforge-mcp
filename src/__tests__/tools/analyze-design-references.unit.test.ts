import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAnalyzeDesignReferences } from '../../tools/analyze-design-references.js';

describe('analyze_design_references tool', () => {
  it('registers without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });
    expect(() => registerAnalyzeDesignReferences(server)).not.toThrow();
  });
});
