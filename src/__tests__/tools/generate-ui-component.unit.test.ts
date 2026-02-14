import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGenerateUiComponent } from '../../tools/generate-ui-component.js';

describe('generate_ui_component tool', () => {
  it('registers without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });
    expect(() => registerGenerateUiComponent(server)).not.toThrow();
  });
});
