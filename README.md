# UIForge MCP Server

MCP server for AI-driven UI generation — from code scaffolding to interactive prototypes and design images. Scaffold frontend apps (React, Next.js, Vue, Angular + Tailwind/Shadcn), generate UI components with style-aware context, create interactive HTML prototypes, render SVG/PNG mockups, and integrate with Figma for bidirectional design token flow.

Built on the [Model Context Protocol TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk).

## Tools

| #   | Tool                        | Category | Description                                                              |
| --- | --------------------------- | -------- | ------------------------------------------------------------------------ |
| 1   | `scaffold_full_application` | Code     | Generate full project boilerplate (React/Next.js/Vue/Angular + Tailwind) |
| 2   | `generate_ui_component`     | Code     | Create/iterate UI components with style audit + design context           |
| 3   | `generate_prototype`        | Design   | Create interactive HTML prototype with screen flows and navigation       |
| 4   | `generate_design_image`     | Design   | Generate SVG/PNG mockup images of UI screens/components                  |
| 5   | `fetch_design_inspiration`  | Context  | Extract visual metadata (colors, typography, layout) from URLs           |
| 6   | `analyze_design_references` | Context  | Analyze design references from URLs and images, detect common patterns   |
| 7   | `figma_context_parser`      | Context  | Read Figma file nodes, extract tokens, map to Tailwind                   |
| 8   | `figma_push_variables`      | Design   | Write design tokens back to Figma as Variables                           |

## Resource

| URI                            | Description                                                             |
| ------------------------------ | ----------------------------------------------------------------------- |
| `application://current-styles` | Current `IDesignContext` as JSON — session-scoped style source of truth |

## Quick Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Run (stdio transport)
node dist/index.js
```

## Development

```bash
# Watch mode
npm run dev

# Run tests
npm test

# Run tests in watch mode (only changed files)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Clean build artifacts
npm run clean

# Validate all checks (lint, format, typecheck, test)
npm run validate

# Docker commands
npm run docker:build
npm run docker:run
```

## Test Coverage

Current test coverage: **84.38%** (22 test suites, 236 tests)

- **Statements**: 84.38%
- **Branches**: 73.96%
- **Functions**: 88.18%
- **Lines**: 84.38%

Coverage thresholds are enforced via Jest configuration. All tests must pass and maintain coverage levels before merging.

## Docker

```bash
docker build -t uiforge-mcp .
docker run -i uiforge-mcp
```

## Environment Variables

| Variable             | Required             | Description                                       |
| -------------------- | -------------------- | ------------------------------------------------- |
| `FIGMA_ACCESS_TOKEN` | Only for Figma tools | Personal access token from Figma account settings |

## Project Structure

```text
uiforge-mcp/
├── package.json
├── tsconfig.json
├── Dockerfile
├── src/
│   ├── index.ts                        # McpServer + stdio transport
│   ├── tools/
│   │   ├── scaffold-full-application.ts
│   │   ├── generate-ui-component.ts
│   │   ├── generate-prototype.ts
│   │   ├── generate-design-image.ts
│   │   ├── fetch-design-inspiration.ts
│   │   ├── analyze-design-references.ts
│   │   ├── figma-context-parser.ts
│   │   └── figma-push-variables.ts
│   ├── resources/
│   │   └── current-styles.ts
│   ├── lib/
│   │   ├── types.ts
│   │   ├── design-context.ts
│   │   ├── style-audit.ts
│   │   ├── figma-client.ts
│   │   ├── design-extractor.ts
│   │   ├── browser-scraper.ts
│   │   ├── image-analyzer.ts
│   │   ├── pattern-detector.ts
│   │   ├── tailwind-mapper.ts
│   │   ├── image-renderer.ts
│   │   ├── prototype-builder.ts
│   │   ├── design-references/
│   │   │   ├── index.ts
│   │   │   ├── font-pairings.ts
│   │   │   ├── color-systems.ts
│   │   │   ├── inspiration-sources.ts
│   │   │   └── ...
│   │   └── templates/
│   │       ├── react.ts
│   │       ├── nextjs.ts
│   │       ├── vue.ts
│   │       ├── angular.ts
│   │       └── prototype-shell.ts
│   └── __tests__/
│       ├── *.unit.test.ts              # Unit tests for lib modules
│       ├── *.integration.test.ts       # Integration tests
│       ├── tools/                      # Tool-specific tests
│       │   └── *.unit.test.ts
│       └── resources/                  # Resource tests
│           └── *.unit.test.ts
```

## mcp-gateway Integration

To add UIForge to your mcp-gateway Docker Compose setup:

1. **`docker-compose.yml`**: Add a `uiforge` service on port `8026`.
2. **`scripts/gateways.txt`**: Add `uiforge|http://uiforge:8026/sse|SSE`.
3. **`.env.example`**: Add `UIFORGE_PORT=8026` and `FIGMA_ACCESS_TOKEN=`.

## Architecture

- **Transport**: stdio (gateway wraps via `mcpgateway.translate` → SSE)
- **Templates**: Embedded TS template functions per framework
- **Image generation**: `satori` (JSX → SVG) + `@resvg/resvg-js` (SVG → PNG)
- **Style consistency**: In-memory `IDesignContext` store exposed via `application://current-styles`
- **Figma write-back**: Variables REST API for design tokens (only supported write path)

## License

MIT
