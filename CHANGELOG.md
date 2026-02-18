# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0/).

## [0.5.0] - 2026-02-18

### Added
- **Component Library Integration**: Full support for 6 major component libraries across all frameworks:
  - React/Next.js: shadcn/ui, Radix UI, Headless UI, Material UI
  - Vue: PrimeVue, shadcn-vue, Radix Vue, Headless UI
  - Angular: Angular Material, CDK, PrimeNG
  - Svelte: bits-ui, @radix-ui/svelte, @headlessui/svelte, SMUI
  - HTML: Tailwind CSS CDN for all library styles
- **File Generation**: All generators now produce paired files (component + test); React also produces Storybook stories

### Fixed
- **TypeScript Build Errors**: Resolved 3 critical TypeScript compilation errors:
  - `src/lib/utils/index.ts`: Removed duplicate re-export of `jsx.utils.js` (TS2308 ambiguous export)
  - `src/tools/generate-ui-component.ts`: Removed duplicate `recordGeneration` call with undefined variable (TS2345)
  - `src/lib/utils/consolidated.utils.ts`: Fixed strict-null errors in `htmlEscapes`, `mergeStyles`, `getFileName`
- **Service Integration Tests**: Added `initializeServices()` in beforeEach to populate singleton container before `getServices()` calls
- **Integration Test File Counts**: Corrected per-framework file expectations (React=3, Vue/Angular/Svelte=2, HTML=1)

### Changed
- **Version**: Bumped to 0.5.0 for component library integration milestone
- **Documentation**: Updated README.md with Component Library Support section

## [0.4.3] - 2026-02-18

### Fixed
- **ESLint**: Resolved all ESLint warnings and errors (32 issues fixed)
  - Removed unused imports (`ConfigNotInitializedError`, `ModelId`, `designContextStore`)
  - Replaced logical OR (`||`) with nullish coalescing (`??`) operators
  - Fixed non-null assertions with safer nullish coalescing
  - Prefixed unused variables and parameters with underscore
  - Replaced string concatenation with template literals
  - Added proper ESLint disable comments for external library `any` types
  - Removed deprecated `.eslintignore` file (migrated to config `ignores`)
- **Code Quality**: Achieved zero ESLint warnings and errors
- **Files Modified**: 15+ files across `src/lib/`, `src/tools/`, and `src/scripts/`

### Technical Details
- **Embeddings**: Properly handled `@huggingface/transformers` dynamic imports with ESLint disable comments
- **Database**: Fixed unused variable references in `design-references/database/store.ts`
- **ML Components**: Updated all ML-related files to use nullish coalescing
- **Tools**: Fixed unused parameters in `generate-ui-component.ts` and other tool files

## [0.4.2] - 2026-02-17

### Added
- **Security**: Integrated Codecov and Snyk security scanning
- **CI/CD**: Added comprehensive GitHub workflows for security and coverage
- **Documentation**: Updated deployment documentation with new setup instructions
- **Memory**: Added memory entries for security and coverage integrations

### Changed
- **Workflows**: Replaced deployment scripts with admin-only GitHub workflows
- **Strategy**: Implemented Trunk Based Development strategy
- **CI**: Updated test matrix to use Node.js 22 and 24

### Fixed
- **Compatibility**: Resolved ESLint compatibility issues with Node.js 24
- **Deployment**: Simplified ESLint config to avoid project service issues

## [0.4.1] - 2026-02-15

### Added
- **Docker**: Multi-stage Docker build for production deployment
- **Documentation**: Comprehensive deployment and setup guides
- **CI/CD**: GitHub Actions workflows for automated testing and deployment
- **Security**: Snyk integration for vulnerability scanning
- **Coverage**: Codecov integration for test coverage reporting

### Fixed
- **Dependencies**: Updated all dependencies to latest stable versions
- **TypeScript**: Fixed type issues and improved type safety
- **Testing**: Improved test coverage and fixed failing tests

## [0.4.0] - 2026-02-10

### Added
- **Major Refactor**: Complete architecture overhaul with service layer
- **Component Library**: Added support for multiple UI component libraries
- **ML Integration**: Enhanced ML capabilities with local model support
- **Templates**: Added comprehensive template system for rapid development
- **API**: New REST API endpoints for external integrations

### Changed
- **Performance**: Significant performance improvements across all features
- **UI**: Completely redesigned user interface with modern design patterns
- **Architecture**: Moved to microservices architecture for better scalability

### Fixed
- **Memory**: Fixed memory leaks and improved resource management
- **Security**: Enhanced security measures and vulnerability fixes
- **Compatibility**: Improved browser and Node.js compatibility

## [0.3.0] - 2026-01-20

### Added
- **Figma Integration**: Full Figma API integration for design tokens
- **Prototyping**: Interactive prototype generation
- **Accessibility**: WCAG 2.1 AA compliance checking
- **Components**: Enhanced component library with 50+ components

### Changed
- **Performance**: Optimized rendering and generation algorithms
- **UX**: Improved user experience with better error handling

## [0.2.0] - 2025-12-15

### Added
- **Multi-framework Support**: Vue, Angular, Svelte support
- **Image Analysis**: Advanced design pattern recognition
- **Training Data**: ML training data export and management
- **Quality Scoring**: Automated quality assessment for generated code

### Fixed
- **Generation**: Improved code generation quality and accuracy
- **Dependencies**: Updated all dependencies for security

## [0.1.0] - 2025-11-01

### Added
- **Initial Release**: Basic UI generation from natural language
- **React Support**: Full React component generation
- **Design Context**: Basic design system integration
- **CLI Tool**: Command-line interface for batch operations
