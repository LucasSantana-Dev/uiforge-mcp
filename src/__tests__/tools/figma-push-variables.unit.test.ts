import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerFigmaPushVariables } from '../../tools/figma-push-variables.js';

describe('figma_push_variables tool', () => {
  it('registers without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });
    expect(() => registerFigmaPushVariables(server)).not.toThrow();
  });
});
