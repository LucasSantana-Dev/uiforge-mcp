import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGeneratePrototype } from '../../tools/generate-prototype.js';
import { buildPrototype } from '../../lib/prototype-builder.js';

describe('generate_prototype tool', () => {
  it('registers without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });
    expect(() => registerGeneratePrototype(server)).not.toThrow();
  });

  it('builds HTML prototype', () => {
    const html = buildPrototype({
      screens: [
        {
          name: 'Home',
          elements: [{ id: 'h1', type: 'heading', label: 'Welcome' }],
        },
      ],
      navigationFlow: [],
    });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Welcome');
  });
});
