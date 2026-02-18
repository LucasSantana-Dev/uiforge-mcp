import { describe, it, expect, beforeEach } from '@jest/globals';
import { generateComponent } from '../../tools/generate-ui-component.js';
import type { IDesignContext } from '../../lib/types.js';

describe('Component Library Integration', () => {
  let mockDesignContext: IDesignContext;

  beforeEach(() => {
    mockDesignContext = {
      typography: { fontFamily: 'Inter', fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem' }, fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700' }, lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.75' } },
      colorPalette: { primary: '#3b82f6', primaryForeground: '#ffffff', secondary: '#64748b', secondaryForeground: '#ffffff', accent: '#f59e0b', accentForeground: '#000000', background: '#ffffff', foreground: '#0f172a', muted: '#f1f5f9', mutedForeground: '#64748b', border: '#e2e8f0', destructive: '#ef4444', destructiveForeground: '#ffffff' },
      spacing: { unit: 4, scale: [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24] },
      borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem', full: '9999px' },
      shadows: { sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)', md: '0 4px 6px -1px rgb(0 0 0 / 0.1)', lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
    };
  });

  function findComponentFile(files: ReturnType<typeof generateComponent>, ext: string) {
    return files.find(f => f.path.endsWith(ext) && !f.path.includes('.test.') && !f.path.includes('.spec.') && !f.path.includes('.stories.'));
  }

  describe('shadcn/ui Integration', () => {
    it('should generate shadcn/ui button for React', () => {
      const files = generateComponent('button', 'react', mockDesignContext, {}, undefined, undefined, 'shadcn');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.tsx');
      expect(f).toBeDefined();
      expect(f!.content).toContain('import { cn } from "@/lib/utils"');
      expect(f!.content).toContain('<Button');
    });
    it('should generate shadcn/ui card for React', () => {
      const files = generateComponent('card', 'react', mockDesignContext, {}, undefined, undefined, 'shadcn');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.tsx');
      expect(f).toBeDefined();
      expect(f!.content).toContain('Card');
      expect(f!.content).toContain('CardContent');
    });
    it('should generate shadcn/ui dialog for React', () => {
      const files = generateComponent('dialog', 'react', mockDesignContext, {}, undefined, undefined, 'shadcn');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.tsx');
      expect(f).toBeDefined();
      expect(f!.content).toContain('Dialog');
    });
  });

  describe('Radix UI Integration', () => {
    it('should generate Radix button for React', () => {
      const files = generateComponent('button', 'react', mockDesignContext, {}, undefined, undefined, 'radix');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.tsx');
      expect(f).toBeDefined();
      expect(f!.content).toContain('@radix-ui');
      expect(f!.content).toContain('<Button');
    });
    it('should generate Radix dialog for React', () => {
      const files = generateComponent('dialog', 'react', mockDesignContext, {}, undefined, undefined, 'radix');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.tsx');
      expect(f).toBeDefined();
      expect(f!.content).toContain('@radix-ui');
    });
  });

  describe('Headless UI Integration', () => {
    it('should generate Headless UI button for React', () => {
      const files = generateComponent('button', 'react', mockDesignContext, {}, undefined, undefined, 'headlessui');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.tsx');
      expect(f).toBeDefined();
      expect(f!.content).toContain('@headlessui/react');
      expect(f!.content).toContain('<Button');
    });
    it('should generate Headless UI dialog for React', () => {
      const files = generateComponent('dialog', 'react', mockDesignContext, {}, undefined, undefined, 'headlessui');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.tsx');
      expect(f).toBeDefined();
      expect(f!.content).toContain('@headlessui/react');
      expect(f!.content).toContain('Dialog');
    });
  });

  describe('Material UI Integration', () => {
    it('should generate MUI button for React', () => {
      const files = generateComponent('button', 'react', mockDesignContext, {}, undefined, undefined, 'material');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.tsx');
      expect(f).toBeDefined();
      expect(f!.content).toContain('@mui/material');
      expect(f!.content).toContain('<Button');
    });
    it('should generate MUI card for React', () => {
      const files = generateComponent('card', 'react', mockDesignContext, {}, undefined, undefined, 'material');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.tsx');
      expect(f).toBeDefined();
      expect(f!.content).toContain('@mui/material');
      expect(f!.content).toContain('Card');
    });
    it('should generate MUI TextField for React', () => {
      const files = generateComponent('input', 'react', mockDesignContext, {}, undefined, undefined, 'material');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.tsx');
      expect(f).toBeDefined();
      expect(f!.content).toContain('TextField');
    });
  });

  describe('No Component Library', () => {
    it('should generate Tailwind CSS when library is none', () => {
      const files = generateComponent('button', 'react', mockDesignContext, {}, undefined, undefined, 'none');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.tsx');
      expect(f).toBeDefined();
      expect(f!.content).not.toMatch(/import\s*\{\s*Button\s*\}\s*from\s*"@/);
    });
  });

  describe('Cross-Framework Support', () => {
    it('should support Vue with PrimeVue', () => {
      const files = generateComponent('button', 'vue', mockDesignContext, {}, undefined, undefined, 'primevue');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.vue');
      expect(f).toBeDefined();
      expect(f!.content).toContain('<template>');
      expect(f!.content).toContain('primevue/button');
    });
    it('should support Angular with Material UI', () => {
      const files = generateComponent('button', 'angular', mockDesignContext, {}, undefined, undefined, 'material');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.component.ts');
      expect(f).toBeDefined();
      expect(f!.content).toContain('@Component');
      expect(f!.content).toContain('@angular/material/button');
    });
    it('should support Svelte with Headless UI', () => {
      const files = generateComponent('button', 'svelte', mockDesignContext, {}, undefined, undefined, 'headlessui');
      expect(files.length).toBeGreaterThanOrEqual(1);
      const f = findComponentFile(files, '.svelte');
      expect(f).toBeDefined();
      expect(f!.content).toContain('@headlessui/svelte');
    });
    it('should support HTML with shadcn styles', () => {
      const files = generateComponent('button', 'html', mockDesignContext, {}, undefined, undefined, 'shadcn');
      expect(files.length).toBeGreaterThanOrEqual(1);
      expect(files[0].path).toContain('.html');
      expect(files[0].content).toContain('<!DOCTYPE html>');
      expect(files[0].content).toContain('tailwindcss');
    });
  });

  describe('File Output Structure', () => {
    it('React generates 3 files (component + storybook + test)', () => {
      const files = generateComponent('button', 'react', mockDesignContext, {}, undefined, undefined, 'shadcn');
      expect(files.length).toBe(3);
      expect(files.some(f => f.path.endsWith('.tsx') && !f.path.includes('.test.') && !f.path.includes('.stories.'))).toBe(true);
      expect(files.some(f => f.path.includes('.stories.'))).toBe(true);
      expect(files.some(f => f.path.includes('.test.'))).toBe(true);
    });
    it('Vue generates 2 files (component + test)', () => {
      const files = generateComponent('button', 'vue', mockDesignContext, {}, undefined, undefined, 'shadcn');
      expect(files.length).toBe(2);
      expect(files.some(f => f.path.endsWith('.vue'))).toBe(true);
      expect(files.some(f => f.path.includes('.test.'))).toBe(true);
    });
    it('Angular generates 2 files (component + spec)', () => {
      const files = generateComponent('button', 'angular', mockDesignContext, {}, undefined, undefined, 'shadcn');
      expect(files.length).toBe(2);
      expect(files.some(f => f.path.endsWith('.component.ts'))).toBe(true);
      expect(files.some(f => f.path.endsWith('.spec.ts'))).toBe(true);
    });
    it('Svelte generates 2 files (component + test)', () => {
      const files = generateComponent('button', 'svelte', mockDesignContext, {}, undefined, undefined, 'shadcn');
      expect(files.length).toBe(2);
      expect(files.some(f => f.path.endsWith('.svelte'))).toBe(true);
      expect(files.some(f => f.path.includes('.test.'))).toBe(true);
    });
    it('HTML generates 1 file', () => {
      const files = generateComponent('button', 'html', mockDesignContext, {}, undefined, undefined, 'shadcn');
      expect(files.length).toBe(1);
      expect(files[0].path).toContain('.html');
    });
  });
});
