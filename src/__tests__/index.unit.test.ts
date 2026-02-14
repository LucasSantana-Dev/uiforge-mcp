import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

describe('MCP Server Index', () => {
  it('imports all tool registration functions', async () => {
    const { registerScaffoldFullApplication } = await import('../tools/scaffold-full-application.js');
    const { registerGenerateUiComponent } = await import('../tools/generate-ui-component.js');
    const { registerGeneratePrototype } = await import('../tools/generate-prototype.js');
    const { registerGenerateDesignImage } = await import('../tools/generate-design-image.js');
    const { registerFetchDesignInspiration } = await import('../tools/fetch-design-inspiration.js');
    const { registerFigmaContextParser } = await import('../tools/figma-context-parser.js');
    const { registerFigmaPushVariables } = await import('../tools/figma-push-variables.js');
    const { registerAnalyzeDesignReferences } = await import('../tools/analyze-design-references.js');

    expect(registerScaffoldFullApplication).toBeDefined();
    expect(registerGenerateUiComponent).toBeDefined();
    expect(registerGeneratePrototype).toBeDefined();
    expect(registerGenerateDesignImage).toBeDefined();
    expect(registerFetchDesignInspiration).toBeDefined();
    expect(registerFigmaContextParser).toBeDefined();
    expect(registerFigmaPushVariables).toBeDefined();
    expect(registerAnalyzeDesignReferences).toBeDefined();
  });

  it('imports resource registration function', async () => {
    const { registerCurrentStylesResource } = await import('../resources/current-styles.js');
    expect(registerCurrentStylesResource).toBeDefined();
  });

  it('can create MCP server instance', () => {
    const server = new McpServer({ name: 'uiforge', version: '0.1.0' });
    expect(server).toBeDefined();
  });
});
