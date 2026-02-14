import { generateReactProject } from '../../lib/templates/react.js';
import { generateNextjsProject } from '../../lib/templates/nextjs.js';
import { generateVueProject } from '../../lib/templates/vue.js';
import { generateAngularProject } from '../../lib/templates/angular.js';
import { designContextStore } from '../../lib/design-context.js';

describe('scaffold_full_application tool logic', () => {
  beforeEach(() => {
    designContextStore.reset();
  });

  it('generates React project with all required files', () => {
    const ctx = designContextStore.get();
    const files = generateReactProject('test-app', 'flat', 'zustand', ctx);

    expect(files.length).toBeGreaterThan(0);
    expect(files.some((f) => f.path.includes('package.json'))).toBe(true);
    expect(files.some((f) => f.path.includes('App.tsx'))).toBe(true);
    expect(files.some((f) => f.path.includes('index.html'))).toBe(true);
  });

  it('generates Next.js project with all required files', () => {
    const ctx = designContextStore.get();
    const files = generateNextjsProject('test-next', 'flat', 'none', ctx);

    expect(files.length).toBeGreaterThan(0);
    expect(files.some((f) => f.path.includes('next.config'))).toBe(true);
    expect(files.some((f) => f.path.includes('layout.tsx'))).toBe(true);
    expect(files.some((f) => f.path.includes('page.tsx'))).toBe(true);
  });

  it('generates Vue project with all required files', () => {
    const ctx = designContextStore.get();
    const files = generateVueProject('test-vue', 'flat', 'pinia', ctx);

    expect(files.length).toBeGreaterThan(0);
    expect(files.some((f) => f.path.includes('App.vue'))).toBe(true);
    expect(files.some((f) => f.path.includes('package.json'))).toBe(true);

    const pkg = files.find((f) => f.path.includes('package.json'));
    expect(pkg?.content).toContain('pinia');
  });

  it('generates Angular project with all required files', () => {
    const ctx = designContextStore.get();
    const files = generateAngularProject('test-ng', 'flat', 'signals', ctx);

    expect(files.length).toBeGreaterThan(0);
    expect(files.some((f) => f.path.includes('angular.json'))).toBe(true);
    expect(files.some((f) => f.path.includes('app.component'))).toBe(true);
  });

  it('includes design context in generated CSS', () => {
    const ctx = designContextStore.get();
    const files = generateReactProject('test', 'flat', 'none', ctx);

    const css = files.find((f) => f.path.includes('index.css'));
    expect(css).toBeDefined();
    expect(css!.content).toContain('--primary');
    expect(css!.content).toContain('--background');
  });
});
