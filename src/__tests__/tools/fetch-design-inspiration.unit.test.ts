import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerFetchDesignInspiration } from '../../tools/fetch-design-inspiration.js';

describe('fetch_design_inspiration tool', () => {
  it('registers without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });
    expect(() => registerFetchDesignInspiration(server)).not.toThrow();
  });
});
