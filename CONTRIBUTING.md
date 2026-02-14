# Contributing to UIForge MCP

Thank you for your interest in contributing to UIForge MCP! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js 22.x or higher
- npm 10.x or higher
- Docker (optional, for container testing)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/uiforge-mcp.git
   cd uiforge-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Start development mode**
   ```bash
   npm run dev
   ```

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use explicit return types for functions
- Use interfaces for object shapes
- Avoid `any` type unless absolutely necessary

### Formatting

- **Prettier**: Code is automatically formatted on commit
- **ESLint**: Linting rules are enforced
- Run `npm run lint` to check for issues
- Run `npm run format` to auto-format code

### Naming Conventions

- **Files**: kebab-case (e.g., `design-context.ts`)
- **Functions**: camelCase (e.g., `generateReactProject`)
- **Classes/Interfaces**: PascalCase (e.g., `IDesignContext`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `INSPIRATION_SOURCES`)

## Testing Requirements

### Coverage Thresholds

All code must maintain these coverage thresholds:

- **Statements**: 84%
- **Branches**: 73%
- **Functions**: 85%
- **Lines**: 84%

### Writing Tests

1. **Unit Tests**: Test individual functions in isolation
   - Place in `src/__tests__/*.unit.test.ts`
   - Mock external dependencies
   - Focus on single responsibility

2. **Integration Tests**: Test complete workflows
   - Place in `src/__tests__/*.integration.test.ts`
   - Test end-to-end scenarios
   - Verify cross-module interactions

3. **Tool Tests**: Test MCP tool registration
   - Place in `src/__tests__/tools/*.unit.test.ts`
   - Verify registration without errors
   - Test basic handler functionality

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- path/to/test.ts
```

## Pull Request Process

### Before Submitting

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Run the verification checklist**
   ```bash
   npm run build    # Must succeed
   npm test         # All tests must pass
   npm run lint     # No linting errors
   npm run format:check  # Code must be formatted
   npm run test:coverage # Coverage must meet thresholds
   ```

### PR Checklist

Before submitting your PR, ensure:

- [ ] Code builds successfully (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Coverage thresholds maintained (`npm run test:coverage`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is formatted (`npm run format:check`)
- [ ] Documentation updated (README, TESTING, etc.)
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains what and why

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code builds successfully
- [ ] All tests pass
- [ ] Coverage maintained
- [ ] Documentation updated
```

## Adding New Features

### Adding a New Tool

1. **Create tool file**: `src/tools/your-tool.ts`
   ```typescript
   import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
   import { z } from 'zod';

   const inputSchema = z.object({
     // Define your schema
   });

   export function registerYourTool(server: McpServer): void {
     server.tool(
       'your_tool',
       'Description of your tool',
       inputSchema,
       async (args) => {
         // Implementation
         return {
           content: [{ type: 'text', text: 'Result' }],
         };
       }
     );
   }
   ```

2. **Register in index**: Add to `src/index.ts`
   ```typescript
   import { registerYourTool } from './tools/your-tool.js';
   registerYourTool(server);
   ```

3. **Add tests**: Create `src/__tests__/tools/your-tool.unit.test.ts`

4. **Update documentation**: Add to README tools table

### Adding a New Template

1. **Create template**: `src/lib/templates/your-framework.ts`
2. **Export generator function**: Follow existing template patterns
3. **Add tests**: Test file generation and design context integration
4. **Update scaffold tool**: Add framework option

### Adding a New Library Module

1. **Create module**: `src/lib/your-module.ts`
2. **Export types**: Define in `src/lib/types.ts` if needed
3. **Add unit tests**: `src/__tests__/your-module.unit.test.ts`
4. **Document**: Add JSDoc comments

## Commit Message Guidelines

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(tools): add design system analyzer tool

Implements a new tool that analyzes design systems from URLs
and extracts component patterns, spacing scales, and color tokens.

Closes #123
```

```
fix(templates): correct Next.js app router layout structure

The layout.tsx was missing the required children prop type.
This fix adds proper TypeScript typing for the layout component.
```

## Code Review Process

### For Contributors

- Respond to review comments promptly
- Make requested changes in new commits
- Don't force-push after review has started
- Mark conversations as resolved when addressed

### For Reviewers

- Be constructive and respectful
- Focus on code quality and maintainability
- Check test coverage and documentation
- Verify CI passes before approving

## Release Process

Releases are managed by maintainers:

1. Version bump in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v0.x.0`
4. Push tag: `git push origin v0.x.0`
5. GitHub Actions builds and publishes

## Getting Help

- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check README and TESTING.md

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors are recognized in:
- GitHub contributors page
- CHANGELOG.md for significant contributions
- README.md for major features

Thank you for contributing to UIForge MCP! 🎨
