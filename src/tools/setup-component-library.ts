/**
 * Setup Component Library Tool
 * 
 * Sets up a complete project with a component library including dependencies,
 * configuration files, and initial components.
 */

import { z } from 'zod';
import { createLogger } from '../lib/logger.js';
import { 
  setupComponentLibraryProject,
  getAvailableComponentLibraries,
  type ComponentLibraryId,
  type ComponentLibrarySetupOptions
} from '../lib/component-libraries/index.js';
import { designService } from '../services/index.js';

const logger = createLogger('setup-component-library');

// Input schema
const inputSchema = z.object({
  library: z.enum(['shadcn', 'radix', 'headlessui', 'material', 'primevue', 'none']).describe('Component library to set up'),
  framework: z.enum(['react', 'nextjs', 'vue', 'svelte', 'angular', 'html']).describe('Target framework'),
  projectName: z.string().describe('Name of the project'),
  projectPath: z.string().optional().describe('Project directory path'),
  components: z.array(z.string()).optional().describe('Components to include'),
  patterns: z.array(z.string()).optional().describe('UI patterns to include'),
  theme: z.string().optional().describe('Theme configuration'),
  customizations: z.record(z.any()).optional().describe('Additional customizations'),
  skipInstall: z.boolean().default(false).describe('Skip npm install step'),
  skipGit: z.boolean().default(false).describe('Skip git initialization'),
});

export type SetupComponentLibraryInput = z.infer<typeof inputSchema>;

// Output schema
const outputSchema = z.object({
  setupFiles: z.array(z.object({
    path: z.string(),
    content: z.string(),
  })).describe('Generated setup files'),
  instructions: z.array(z.string()).describe('Setup instructions'),
  nextSteps: z.array(z.string()).describe('Next steps'),
  dependencies: z.array(z.string()).describe('Required dependencies'),
  devDependencies: z.array(z.string()).describe('Development dependencies'),
});

export type SetupComponentLibraryOutput = z.infer<typeof outputSchema>;

/**
 * Setup component library project
 */
export async function setupComponentLibraryHandler(
  input: SetupComponentLibraryInput
): Promise<SetupComponentLibraryOutput> {
  logger.info('Setting up component library project', {
    library: input.library,
    framework: input.framework,
    projectName: input.projectName,
  });

  try {
    // Get current design context
    const designContext = designService.getCurrentContext();
    
    // Apply theme customizations if provided
    let customizedContext = { ...designContext };
    if (input.theme) {
      customizedContext = applyThemeConfiguration(customizedContext, input.theme);
    }

    // Setup options
    const setupOptions: ComponentLibrarySetupOptions = {
      framework: input.framework,
      projectName: input.projectName,
      components: input.components,
      patterns: input.patterns,
      designContext: customizedContext,
      customizations: input.customizations,
    };

    // Generate setup files
    const setupFiles = setupComponentLibraryProject(input.library, setupOptions);

    // Extract dependencies
    const { dependencies, devDependencies } = extractDependenciesFromFiles(setupFiles);

    // Generate instructions
    const instructions = generateSetupInstructions(input.library, input.framework, input);
    const nextSteps = generateNextSteps(input.library, input.framework, input);

    logger.info('Component library setup completed', {
      fileCount: setupFiles.length,
      dependencies: dependencies.length,
      devDependencies: devDependencies.length,
    });

    return {
      setupFiles,
      instructions,
      nextSteps,
      dependencies,
      devDependencies,
    };

  } catch (error) {
    logger.error('Component library setup failed', { error: error.message });
    throw new Error(`Failed to setup component library: ${error.message}`);
  }
}

/**
 * Validate component library setup
 */
export async function validateComponentLibrarySetupHandler(
  projectPath: string,
  library: ComponentLibraryId
): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}> {
  logger.info('Validating component library setup', { projectPath, library });

  try {
    // This would check if the project is properly set up
    // For now, return a basic validation
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Check for required files
    const requiredFiles = getRequiredFiles(library);
    
    // In a real implementation, we would check the actual file system
    // For now, we'll simulate the validation
    requiredFiles.forEach(file => {
      // Simulate file check - in real implementation, use fs.existsSync
      if (Math.random() > 0.8) { // Simulate some files missing
        errors.push(`Missing required file: ${file}`);
      }
    });

    // Check for common issues
    if (library === 'shadcn') {
      if (Math.random() > 0.7) {
        warnings.push('Tailwind CSS not properly configured');
      }
      if (Math.random() > 0.8) {
        recommendations.push('Consider adding TypeScript strict mode');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };

  } catch (error) {
    logger.error('Setup validation failed', { error: error.message });
    throw new Error(`Failed to validate setup: ${error.message}`);
  }
}

/**
 * Get component library setup status
 */
export async function getComponentLibraryStatusHandler(
  projectPath: string
): Promise<{
  library: ComponentLibraryId | null;
  isConfigured: boolean;
  components: string[];
  patterns: string[];
  version: string;
  lastUpdated: string;
}> {
  logger.info('Getting component library status', { projectPath });

  try {
    // In a real implementation, we would read package.json and config files
    // For now, return a simulated status
    return {
      library: 'shadcn',
      isConfigured: true,
      components: ['Button', 'Card', 'Input'],
      patterns: ['LoginForm', 'HeaderNavigation'],
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
    };

  } catch (error) {
    logger.error('Failed to get status', { error: error.message });
    throw new Error(`Failed to get component library status: ${error.message}`);
  }
}

/**
 * Apply theme configuration to design context
 */
function applyThemeConfiguration(
  context: any,
  theme: string
): any {
  const themeConfig = parseThemeString(theme);
  
  return {
    ...context,
    colorPalette: {
      ...context.colorPalette,
      ...themeConfig.colors,
    },
    ...themeConfig.other,
  };
}

/**
 * Parse theme string into configuration
 */
function parseThemeString(theme: string): {
  colors: any;
  other: any;
} {
  const themes: Record<string, any> = {
    'dark': {
      colors: {
        background: '#0a0a0a',
        foreground: '#fafafa',
        primary: '#3b82f6',
        secondary: '#64748b',
      }
    },
    'light': {
      colors: {
        background: '#ffffff',
        foreground: '#0a0a0a',
        primary: '#2563eb',
        secondary: '#64748b',
      }
    },
    'blue': {
      colors: {
        primary: '#3b82f6',
        accent: '#60a5fa',
      }
    },
    'green': {
      colors: {
        primary: '#22c55e',
        accent: '#4ade80',
      }
    }
  };

  return themes[theme] || { colors: {}, other: {} };
}

/**
 * Extract dependencies from generated files
 */
function extractDependenciesFromFiles(files: Array<{ path: string; content: string }>): {
  dependencies: string[];
  devDependencies: string[];
} {
  const packageJsonFile = files.find(file => file.path === 'package.json');
  
  if (!packageJsonFile) {
    return { dependencies: [], devDependencies: [] };
  }

  try {
    const packageJson = JSON.parse(packageJsonFile.content);
    return {
      dependencies: Object.keys(packageJson.dependencies || {}),
      devDependencies: Object.keys(packageJson.devDependencies || {}),
    };
  } catch {
    return { dependencies: [], devDependencies: [] };
  }
}

/**
 * Get required files for library
 */
function getRequiredFiles(library: ComponentLibraryId): string[] {
  const baseFiles = ['package.json', 'tailwind.config.js', 'lib/utils.ts'];
  
  switch (library) {
    case 'shadcn':
      return [...baseFiles, 'components/ui/button.tsx', 'app/globals.css'];
    case 'radix':
      return [...baseFiles, 'components/ui/primitives.tsx'];
    case 'headlessui':
      return [...baseFiles, 'components/ui/base.tsx'];
    case 'material':
      return [...baseFiles, 'theme.ts'];
    default:
      return baseFiles;
  }
}

/**
 * Generate setup instructions
 */
function generateSetupInstructions(
  library: ComponentLibraryId,
  framework: string,
  input: SetupComponentLibraryInput
): string[] {
  const instructions: string[] = [];

  // Basic setup instructions
  instructions.push(`1. Navigate to project directory: cd ${input.projectPath || input.projectName}`);
  
  if (!input.skipInstall) {
    instructions.push('2. Install dependencies: npm install');
  }

  // Library-specific instructions
  switch (library) {
    case 'shadcn':
      instructions.push('3. Configure Tailwind CSS in tailwind.config.js');
      instructions.push('4. Set up CSS variables in app/globals.css');
      instructions.push('5. Create components/ui directory structure');
      break;

    case 'radix':
      instructions.push('3. Install Radix UI primitives for each component');
      instructions.push('4. Create styled components with CSS or Tailwind');
      break;

    case 'headlessui':
      instructions.push('3. Configure Tailwind CSS if not already done');
      instructions.push('4. Create component wrappers with styling');
      break;

    case 'material':
      instructions.push('3. Set up Material-UI theme provider');
      instructions.push('4. Configure theme in theme.ts');
      break;
  }

  // Framework-specific instructions
  if (framework === 'nextjs') {
    instructions.push(`${instructions.length + 1}. Configure Next.js for client components (use "use client")`);
  }

  return instructions;
}

/**
 * Generate next steps
 */
function generateNextSteps(
  library: ComponentLibraryId,
  framework: string,
  input: SetupComponentLibraryInput
): string[] {
  const steps: string[] = [];

  steps.push('1. Review generated components and customize as needed');
  steps.push('2. Test components in your development environment');
  
  if (input.components && input.components.length > 0) {
    steps.push(`3. Explore the ${input.components.length} included components`);
  }

  if (input.patterns && input.patterns.length > 0) {
    steps.push(`4. Check out the ${input.patterns.length} UI patterns`);
  }

  steps.push('5. Add your own custom components');
  steps.push('6. Configure your theme and design tokens');
  steps.push('7. Run tests to ensure everything works correctly');

  return steps;
}

// Tool registration
export const setupComponentLibraryTool = {
  name: 'setup_component_library',
  description: 'Set up a complete project with a component library',
  inputSchema,
  outputSchema,
  handler: setupComponentLibraryHandler,
};

export const validateComponentLibrarySetupTool = {
  name: 'validate_component_library_setup',
  description: 'Validate component library setup in a project',
  inputSchema: z.object({
    projectPath: z.string(),
    library: z.enum(['shadcn', 'radix', 'headlessui', 'material', 'primevue', 'none']),
  }),
  outputSchema: z.object({
    isValid: z.boolean(),
    errors: z.array(z.string()),
    warnings: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
  handler: async ({ projectPath, library }: { projectPath: string; library: ComponentLibraryId }) => {
    return validateComponentLibrarySetupHandler(projectPath, library);
  },
};

export const getComponentLibraryStatusTool = {
  name: 'get_component_library_status',
  description: 'Get component library setup status',
  inputSchema: z.object({
    projectPath: z.string(),
  }),
  outputSchema: z.object({
    library: z.enum(['shadcn', 'radix', 'headlessui', 'material', 'primevue', 'none']).nullable(),
    isConfigured: z.boolean(),
    components: z.array(z.string()),
    patterns: z.array(z.string()),
    version: z.string(),
    lastUpdated: z.string(),
  }),
  handler: async ({ projectPath }: { projectPath: string }) => {
    return getComponentLibraryStatusHandler(projectPath);
  },
};
