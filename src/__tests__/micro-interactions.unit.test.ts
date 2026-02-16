import {
  registerInteraction,
  registerInteractions,
  getMicroInteraction,
  getInteractionsByCategory,
  getAllInteractions,
  initializeInteractions,
  clearAllMicroInteractions,
} from '../lib/design-references/micro-interactions/index.js';
import type { IMicroInteraction } from '../lib/design-references/component-registry/types.js';

// ── Helper ─────────────────────────────────────────────────

function makeInteraction(overrides: Partial<IMicroInteraction> = {}): IMicroInteraction {
  return {
    id: overrides.id ?? 'test-anim',
    name: 'Test Animation',
    category: 'entrance',
    purpose: ['orientation'],
    tailwindClasses: 'animate-in fade-in-0 duration-300',
    reducedMotionFallback: 'motion-reduce:animate-none',
    duration: '300ms',
    description: 'A test animation',
    ...overrides,
  };
}

// ── Micro-Interaction Registry ─────────────────────────────

describe('micro-interactions registry', () => {
  beforeEach(() => {
    clearAllMicroInteractions();
    initializeInteractions();
  });

  it('has pre-registered interactions', () => {
    const all = getAllInteractions();
    expect(all.length).toBeGreaterThanOrEqual(20);
  });

  it('every interaction has required fields', () => {
    for (const anim of getAllInteractions()) {
      expect(anim.id).toBeTruthy();
      expect(anim.name).toBeTruthy();
      expect(anim.category).toBeTruthy();
      expect(Array.isArray(anim.purpose)).toBe(true);
      expect(anim.purpose.length).toBeGreaterThan(0);
      expect(typeof anim.tailwindClasses).toBe('string');
      expect(typeof anim.reducedMotionFallback).toBe('string');
      expect(anim.duration).toBeTruthy();
    }
  });

  it('getMicroInteraction returns a known animation', () => {
    const fadeUp = getMicroInteraction('fade-up');
    expect(fadeUp).toBeDefined();
    expect(fadeUp!.id).toBe('fade-up');
    expect(fadeUp!.category).toBe('entrance');
  });

  it('getMicroInteraction returns undefined for unknown id', () => {
    expect(getMicroInteraction('nonexistent-anim-xyz')).toBeUndefined();
  });

  it('getInteractionsByCategory returns entrance animations', () => {
    const entrance = getInteractionsByCategory('entrance');
    expect(entrance.length).toBeGreaterThan(0);
    expect(entrance.every((a) => a.category === 'entrance')).toBe(true);
  });

  it('getInteractionsByCategory returns hover animations', () => {
    const hover = getInteractionsByCategory('hover');
    expect(hover.length).toBeGreaterThan(0);
    expect(hover.every((a) => a.category === 'hover')).toBe(true);
  });

  it('getInteractionsByCategory returns loading animations', () => {
    const loading = getInteractionsByCategory('loading');
    expect(loading.length).toBeGreaterThan(0);
    expect(loading.every((a) => a.category === 'loading')).toBe(true);
  });

  it('getInteractionsByCategory returns feedback animations', () => {
    const feedback = getInteractionsByCategory('feedback');
    expect(feedback.length).toBeGreaterThan(0);
    expect(feedback.every((a) => a.category === 'feedback')).toBe(true);
  });

  it('getInteractionsByCategory returns text animations', () => {
    const text = getInteractionsByCategory('text');
    expect(text.length).toBeGreaterThan(0);
    expect(text.every((a) => a.category === 'text')).toBe(true);
  });

  it('getInteractionsByCategory returns transition animations', () => {
    const transition = getInteractionsByCategory('transition');
    expect(transition.length).toBeGreaterThan(0);
    expect(transition.every((a) => a.category === 'transition')).toBe(true);
  });

  it('registerInteraction adds a new animation', () => {
    const custom = makeInteraction({ id: 'custom-test-anim-xyz' });
    registerInteraction(custom);
    expect(getMicroInteraction('custom-test-anim-xyz')).toBeDefined();
  });

  it('registerInteraction updates existing animation', () => {
    const anim = makeInteraction({ id: 'update-test-anim' });
    registerInteraction(anim);
    registerInteraction({ ...anim, name: 'Updated Name' });
    expect(getMicroInteraction('update-test-anim')!.name).toBe('Updated Name');
  });

  it('registerInteractions adds multiple at once', () => {
    const before = getAllInteractions().length;
    registerInteractions([
      makeInteraction({ id: 'bulk-anim-1' }),
      makeInteraction({ id: 'bulk-anim-2' }),
    ]);
    expect(getAllInteractions().length).toBe(before + 2);
  });

  it('most animations have reduced motion fallback', () => {
    const withFallback = getAllInteractions().filter((a) => a.reducedMotionFallback.length > 0);
    // At least half should have a fallback
    expect(withFallback.length).toBeGreaterThan(getAllInteractions().length / 2);
    for (const anim of withFallback) {
      expect(anim.reducedMotionFallback).toContain('motion-reduce');
    }
  });
});
