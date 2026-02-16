import {
  registerVisualStyle,
  getVisualStyle,
  getAllVisualStyles,
  getVisualStylesByMood,
  applyVisualStyle,
  initializeStyles,
} from '../lib/design-references/visual-styles/index.js';
import type { IVisualStyle } from '../lib/design-references/component-registry/types.js';
import type { IComponentSnippet } from '../lib/design-references/component-registry/types.js';

// ── Helper ─────────────────────────────────────────────────

function makeStyle(overrides: Partial<IVisualStyle> = {}): IVisualStyle {
  return {
    id: overrides.id ?? ('test-style' as IVisualStyle['id']),
    name: 'Test Style',
    description: 'A test visual style',
    mood: ['professional', 'minimal'],
    classModifiers: { root: 'bg-white/80 backdrop-blur-xl' },
    cssVariables: { '--glass-opacity': '0.8' },
    typography: { headingWeight: 'font-bold', bodyWeight: 'font-normal' },
    ...overrides,
  } as IVisualStyle;
}

function makeSnippet(): IComponentSnippet {
  return {
    id: 'style-test-snippet',
    name: 'Style Test Card',
    type: 'card',
    variant: 'default',
    category: 'molecule',
    mood: ['professional'],
    industry: ['general'],
    visualStyles: ['linear-modern'],
    tags: ['card'],
    tailwindClasses: { root: 'bg-white rounded-lg p-4', heading: 'text-xl font-bold' },
    jsx: '<div>Card</div>',
    a11y: {
      roles: ['article'],
      ariaAttributes: ['aria-label'],
      keyboardNav: 'Tab to navigate',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: false,
    },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm', 'md', 'lg'] },
    quality: {
      antiGeneric: ['custom-shadow'],
      inspirationSource: 'linear.app',
      craftDetails: ['border-radius-variation'],
    },
  };
}

// ── Visual Style Registry ──────────────────────────────────

// Minimum expected pre-registered visual styles (glassmorphism, neubrutalism, soft-depth, etc.)
const MIN_PREREGISTERED_VISUAL_STYLES = 10;

describe('visual-styles registry', () => {
  beforeEach(() => {
    initializeStyles();
  });

  it('has pre-registered styles', () => {
    const all = getAllVisualStyles();
    expect(all.length).toBeGreaterThanOrEqual(MIN_PREREGISTERED_VISUAL_STYLES);
  });

  it('every style has required fields', () => {
    for (const style of getAllVisualStyles()) {
      expect(style.id).toBeTruthy();
      expect(style.name).toBeTruthy();
      expect(style.description).toBeTruthy();
      expect(style.mood.length).toBeGreaterThan(0);
      expect(Object.keys(style.classModifiers).length).toBeGreaterThan(0);
    }
  });

  it('getVisualStyle returns a style by id', () => {
    const style = getVisualStyle('glassmorphism');
    expect(style).toBeDefined();
    expect(style!.id).toBe('glassmorphism');
  });

  it('getVisualStyle returns undefined for unknown id', () => {
    expect(getVisualStyle('nonexistent' as any)).toBeUndefined();
  });

  it('getVisualStylesByMood returns matching styles', () => {
    const allStyles = getAllVisualStyles();
    const allMoods = [...new Set(allStyles.flatMap((s) => s.mood))];
    for (const mood of allMoods) {
      const matching = getVisualStylesByMood(mood);
      expect(matching.length).toBeGreaterThan(0);
      expect(matching.every((s) => s.mood.includes(mood as any))).toBe(true);
    }
  });

  it('registerVisualStyle adds a new style', () => {
    const custom = makeStyle({ id: 'custom-test-style-xyz' as any, name: 'Custom' });
    registerVisualStyle(custom);
    expect(getVisualStyle('custom-test-style-xyz' as any)).toBeDefined();
  });

  it('registerVisualStyle updates existing style', () => {
    const style = makeStyle({ id: 'update-test-style' as any, name: 'Original' });
    registerVisualStyle(style);
    registerVisualStyle({ ...style, name: 'Updated' });
    expect(getVisualStyle('update-test-style' as any)!.name).toBe('Updated');
  });
});

// ── applyVisualStyle ───────────────────────────────────────

describe('visual-styles applyVisualStyle', () => {
  it('merges classModifiers into snippet tailwindClasses', () => {
    const snippet = makeSnippet();
    const style = getVisualStyle('glassmorphism');
    expect(style).toBeDefined();

    const result = applyVisualStyle(snippet, style!);
    // Root classes should be modified (not identical to original)
    const rootChanged = result.tailwindClasses.root !== snippet.tailwindClasses.root;
    expect(rootChanged).toBe(true);
    // Verify glassmorphism-specific classes are present
    expect(result.tailwindClasses.root).toContain('backdrop-blur');
  });

  it('preserves original snippet fields', () => {
    const snippet = makeSnippet();
    const style = getVisualStyle('glassmorphism');
    const result = applyVisualStyle(snippet, style!);
    expect(result.id).toBe(snippet.id);
    expect(result.type).toBe(snippet.type);
    expect(result.jsx).toBe(snippet.jsx);
  });
});
