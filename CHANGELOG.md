# Changelog

## 0.2.0 (2026-02-14)

### Added

- **Logging**: Integrated Pino logger with pretty printing in development and structured JSON logging in production
- **Configuration**: Added Zod-based configuration validation with environment variable support (NODE_ENV, LOG_LEVEL, FIGMA_ACCESS_TOKEN)
- **CI/CD**: Enhanced GitHub Actions workflow with parallel jobs (lint, typecheck, test, build, docker), caching, and multi-node testing (Node 20, 22)
- **Security**: SSRF protection in design-extractor with private/local URL blocking (IPv4, IPv6, loopback, link-local)
- **Security**: XSS protection in prototype-builder with dangerous content validation (script tags, event handlers, data URIs)
- **Reliability**: Browser launcher race condition fix with promise-based synchronization
- **Reliability**: Figma API retry logic with exponential backoff (500ms-5s delays, 60s timeout, 3 retries)
- **Error Handling**: Improved error messages in Figma client with detailed API error context
- **Validation**: Hex color validation in Figma client (supports #RGB, #RGBA, #RRGGBB, #RRGGBBAA)
- **Font Loading**: Enhanced font fallback logic with Inter as ultimate fallback
- **Docker**: Added health checks, security labels, and optimized multi-stage builds with BuildKit cache
- **Documentation**: Added CONTRIBUTING.md, TESTING.md, and CodeRabbit setup guide

### Changed

- Improved browser scraper resource cleanup with proper error handling
- Enhanced Figma variable creation with mode ID retrieval and validation
- Updated CI workflow to use parallel jobs for faster feedback (lint, typecheck, test, build, docker)
- Improved test coverage infrastructure with Jest caching and Codecov integration
- Enhanced Docker image with tini for proper signal handling and non-root user
- Updated typography token extraction to use rem units for font-size and unitless line-height

### Fixed

- Browser launcher race condition preventing multiple concurrent launches
- Config/logger initialization order to prevent "Config not loaded" errors
- Figma API timeout handling during collection creation
- Font loading fallback chain to ensure at least one font is always available
- Division by zero protection in tailwind-mapper line-height calculation

## 0.1.0 (2026-02-14)

### Added

- **Server**: MCP server `uiforge` v0.1.0 with stdio transport
- **Tool `scaffold_full_application`**: Generate full project boilerplate for React, Next.js, Vue, and Angular with Tailwind CSS, Shadcn/ui, and optional state management (Zustand, Pinia, Signals)
- **Tool `generate_ui_component`**: Create UI components with style audit integration and design context awareness (button, card, form, navbar, hero, modal, etc.)
- **Tool `generate_prototype`**: Create interactive HTML prototypes with screen flows, navigation transitions (fade, slide), and embedded design tokens
- **Tool `generate_design_image`**: Generate SVG/PNG mockup images via satori + resvg (wireframe, mockup, component preview modes)
- **Tool `fetch_design_inspiration`**: Extract colors, typography, and layout hints from any URL
- **Tool `analyze_design_references`**: Analyze design references from URLs and images, detect common patterns across sources
- **Tool `figma_context_parser`**: Read Figma file nodes, extract design tokens, map to Tailwind CSS utilities
- **Tool `figma_push_variables`**: Write design tokens back to Figma as Variables via the REST API
- **Resource `application://current-styles`**: Session-scoped IDesignContext as JSON
- **Lib**: Style audit (Tailwind config + CSS variable parsing), design extractor, browser scraper (Playwright), image analyzer (Sharp), pattern detector, Figma client, Tailwind mapper, image renderer, prototype builder
- **Design References**: Curated font pairings, color systems, inspiration sources (Dribbble primary, Pinterest fallback), icon libraries, animation presets, layout patterns
- **Templates**: React + Vite + Shadcn/ui, Next.js App Router + Shadcn/ui, Vue 3 + Pinia, Angular standalone + Signals
- **Tests**: 236 tests across 22 test suites with 84.38% coverage
- **Docker**: Multi-stage Dockerfile for production builds with legacy peer deps support
- **Documentation**: Comprehensive TESTING.md and CONTRIBUTING.md guides

### Changed

- Improved test coverage from 71 tests to 236 tests (22 suites)
- Added coverage enforcement: 84% statements/lines, 73% branches, 85% functions
- Updated project structure to include all tools, resources, and test organization
- Enhanced Docker build process with `--legacy-peer-deps` flag for dependency resolution
