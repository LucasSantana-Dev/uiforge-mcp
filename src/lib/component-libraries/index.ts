/**
 * Component Libraries Integration
 * 
 * Centralized access to all component library integrations including:
 * - shadcn/ui
 * - Radix UI
 * - Headless UI
 * - Material-UI
 */

import type { IGeneratedFile, IDesignContext, Framework, ComponentLibraryId } from '../types.js';

// Re-export types for convenience
export type { IGeneratedFile, IDesignContext, Framework, ComponentLibraryId } from '../types.js';

export * from './shadcn/index.js';

/**
 * Component library interface
 */
export interface ComponentLibraryIntegration {
  name: string;
  id: ComponentLibraryId;
  description: string;
  setupProject(options: ComponentLibrarySetupOptions): IGeneratedFile[];
  generateComponent(name: string, designContext: IDesignContext, customizations?: Record<string, any>): IGeneratedFile[];
  getAvailableComponents(): string[];
  getAvailablePatterns(): string[];
}

/**
 * Component library setup options
 */
export interface ComponentLibrarySetupOptions {
  framework: Framework;
  projectName: string;
  components?: string[];
  patterns?: string[];
  designContext?: IDesignContext;
  customizations?: Record<string, any>;
}

/**
 * Get component library integration by ID
 */
export function getComponentLibrary(libraryId: ComponentLibraryId): ComponentLibraryIntegration | undefined {
  switch (libraryId) {
    case 'shadcn':
      return {
        name: 'shadcn/ui',
        id: 'shadcn',
        description: 'Beautifully designed components built with Radix UI and Tailwind CSS',
        setupProject: (options) => {
          // Import dynamically to avoid circular dependencies
          const { setupShadcnProject } = require('./shadcn/index.js');
          return setupShadcnProject(options);
        },
        generateComponent: (name, designContext, customizations) => {
          const { generateShadcnComponent } = require('./shadcn/templates.js');
          return generateShadcnComponent(name, designContext, customizations);
        },
        getAvailableComponents: () => {
          const { getAvailableShadcnComponents } = require('./shadcn/index.js');
          return getAvailableShadcnComponents();
        },
        getAvailablePatterns: () => {
          const { getAvailableShadcnPatterns } = require('./shadcn/index.js');
          return getAvailableShadcnPatterns();
        }
      };
    case 'radix':
      return {
        name: 'Radix UI',
        id: 'radix',
        description: 'Unstyled, accessible components for building high-quality design systems and web apps',
        setupProject: () => {
          // TODO: Implement Radix UI setup
          throw new Error('Radix UI integration not yet implemented');
        },
        generateComponent: () => {
          // TODO: Implement Radix UI component generation
          throw new Error('Radix UI component generation not yet implemented');
        },
        getAvailableComponents: () => {
          // TODO: Return available Radix UI components
          return [];
        },
        getAvailablePatterns: () => {
          // TODO: Return available Radix UI patterns
          return [];
        }
      };
    case 'headlessui':
      return {
        name: 'Headless UI',
        id: 'headlessui',
        description: 'Unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS',
        setupProject: () => {
          // TODO: Implement Headless UI setup
          throw new Error('Headless UI integration not yet implemented');
        },
        generateComponent: () => {
          // TODO: Implement Headless UI component generation
          throw new Error('Headless UI component generation not yet implemented');
        },
        getAvailableComponents: () => {
          // TODO: Return available Headless UI components
          return [];
        },
        getAvailablePatterns: () => {
          // TODO: Return available Headless UI patterns
          return [];
        }
      };
    case 'material':
      return {
        name: 'Material-UI',
        id: 'material',
        description: 'React components that implement Google\'s Material Design',
        setupProject: () => {
          // TODO: Implement Material-UI setup
          throw new Error('Material-UI integration not yet implemented');
        },
        generateComponent: () => {
          // TODO: Implement Material-UI component generation
          throw new Error('Material-UI component generation not yet implemented');
        },
        getAvailableComponents: () => {
          // TODO: Return available Material-UI components
          return [];
        },
        getAvailablePatterns: () => {
          // TODO: Return available Material-UI patterns
          return [];
        }
      };
    case 'primevue':
      return {
        name: 'PrimeVue',
        id: 'primevue',
        description: 'Rich set of open source native Vue UI components',
        setupProject: () => {
          // TODO: Implement PrimeVue setup
          throw new Error('PrimeVue integration not yet implemented');
        },
        generateComponent: () => {
          // TODO: Implement PrimeVue component generation
          throw new Error('PrimeVue component generation not yet implemented');
        },
        getAvailableComponents: () => {
          // TODO: Return available PrimeVue components
          return [];
        },
        getAvailablePatterns: () => {
          // TODO: Return available PrimeVue patterns
          return [];
        }
      };
    case 'none':
      return {
        name: 'None',
        id: 'none',
        description: 'No component library - use custom components',
        setupProject: () => [],
        generateComponent: () => [],
        getAvailableComponents: () => [],
        getAvailablePatterns: () => []
      };
    default:
      return undefined;
  }
}

/**
 * Get all available component libraries
 */
export function getAvailableComponentLibraries(): ComponentLibraryIntegration[] {
  const libraries: ComponentLibraryId[] = ['shadcn', 'radix', 'headlessui', 'material', 'primevue', 'none'];
  
  return libraries
    .map(id => getComponentLibrary(id))
    .filter((library): library is ComponentLibraryIntegration => library !== undefined);
}

/**
 * Setup component library project
 */
export function setupComponentLibraryProject(
  libraryId: ComponentLibraryId,
  options: ComponentLibrarySetupOptions
): IGeneratedFile[] {
  const library = getComponentLibrary(libraryId);
  
  if (!library) {
    throw new Error(`Component library "${libraryId}" not found`);
  }
  
  return library.setupProject(options);
}

/**
 * Generate component from library
 */
export function generateComponentFromLibrary(
  libraryId: ComponentLibraryId,
  componentName: string,
  designContext: IDesignContext,
  customizations?: Record<string, any>
): IGeneratedFile[] {
  const library = getComponentLibrary(libraryId);
  
  if (!library) {
    throw new Error(`Component library "${libraryId}" not found`);
  }
  
  return library.generateComponent(componentName, designContext, customizations);
}

/**
 * Get available components for library
 */
export function getAvailableComponentsForLibrary(libraryId: ComponentLibraryId): string[] {
  const library = getComponentLibrary(libraryId);
  
  if (!library) {
    return [];
  }
  
  return library.getAvailableComponents();
}

/**
 * Get available patterns for library
 */
export function getAvailablePatternsForLibrary(libraryId: ComponentLibraryId): string[] {
  const library = getComponentLibrary(libraryId);
  
  if (!library) {
    return [];
  }
  
  return library.getAvailablePatterns();
}