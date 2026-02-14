import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerFigmaContextParser } from '../../tools/figma-context-parser.js';

describe('figma_context_parser tool', () => {
  it('registers without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });
    expect(() => registerFigmaContextParser(server)).not.toThrow();
  });
});
