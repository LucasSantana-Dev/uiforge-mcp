import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGenerateDesignImage } from '../../tools/generate-design-image.js';

describe('generate_design_image tool', () => {
  it('registers without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });
    expect(() => registerGenerateDesignImage(server)).not.toThrow();
  });
});
