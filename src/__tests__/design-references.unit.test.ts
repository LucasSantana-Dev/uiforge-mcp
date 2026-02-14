import { describe, it, expect } from 'vitest';
import {
  FONT_PAIRINGS,
  DEFAULT_FONT_PAIRING,
  getFontPairing,
  getFontPairingsByMood,
  TYPE_SCALE,
  COLOR_SYSTEMS,
  DEFAULT_COLOR_SYSTEM,
  getColorSystem,
  getColorSystemsByMood,
  SPACING_SYSTEM,
  ICON_LIBRARIES,
  getDefaultIconLibrary,
  ANIMATION_PRESETS,
  getAnimationsByCategory,
  LAYOUT_PATTERNS,
  getLayoutPattern,
  getLayoutPatternsByUseCase,
  INSPIRATION_SOURCES,
  getInspirationByCategory,
  getInspirationByPriority,
  getPrimaryDesignReference,
  getFallbackDesignReference,
  getPreset,
  listPresets,
  PRESETS,
  DEFAULT_PRESET,
} from '../lib/design-references/index.js';

// ── Font Pairings ───────────────────────────────────────────
describe('font-pairings', () => {
  it('has at least 5 pairings', () => {
    expect(FONT_PAIRINGS.length).toBeGreaterThanOrEqual(5);
  });

  it('every pairing has required fields', () => {
    for (const fp of FONT_PAIRINGS) {
      expect(fp.name).toBeTruthy();
      expect(fp.heading.family).toBeTruthy();
      expect(fp.body.family).toBeTruthy();
      expect(fp.mood.length).toBeGreaterThan(0);
    }
  });

  it('DEFAULT_FONT_PAIRING is a valid id', () => {
    expect(getFontPairing(DEFAULT_FONT_PAIRING)).toBeDefined();
  });

  it('getFontPairing returns undefined for unknown id', () => {
    expect(getFontPairing('nonexistent')).toBeUndefined();
  });

  it('getFontPairingsByMood returns non-empty for known mood', () => {
    const moods = [...new Set(FONT_PAIRINGS.flatMap((fp) => fp.mood))];
    for (const mood of moods) {
      expect(getFontPairingsByMood(mood).length).toBeGreaterThan(0);
    }
  });

  it('TYPE_SCALE has standard sizes', () => {
    expect(TYPE_SCALE.xs).toBeDefined();
    expect(TYPE_SCALE.base).toBeDefined();
    expect(TYPE_SCALE['2xl']).toBeDefined();
  });
});

// ── Color Systems ───────────────────────────────────────────
describe('color-systems', () => {
  it('has at least 5 color systems', () => {
    expect(COLOR_SYSTEMS.length).toBeGreaterThanOrEqual(5);
  });

  it('every color system has required HSL values', () => {
    const requiredKeys = ['background', 'foreground', 'primary', 'secondary', 'muted', 'border', 'destructive'];
    for (const cs of COLOR_SYSTEMS) {
      expect(cs.name).toBeTruthy();
      expect(cs.description).toBeTruthy();
      for (const key of requiredKeys) {
        expect(cs.light[key]).toBeDefined();
        // HSL format: "H S% L%" — should contain at least one space
        expect(cs.light[key]).toMatch(/\S+\s+\S+/);
      }
    }
  });

  it('DEFAULT_COLOR_SYSTEM is a valid id', () => {
    expect(getColorSystem(DEFAULT_COLOR_SYSTEM)).toBeDefined();
  });

  it('getColorSystem returns undefined for unknown id', () => {
    expect(getColorSystem('nonexistent')).toBeUndefined();
  });

  it('getColorSystemsByMood returns non-empty for known mood', () => {
    const moods = [...new Set(COLOR_SYSTEMS.flatMap((cs) => cs.mood))];
    for (const mood of moods) {
      expect(getColorSystemsByMood(mood).length).toBeGreaterThan(0);
    }
  });
});

// ── Spacing & Layout ────────────────────────────────────────
describe('spacing-layout', () => {
  it('has a positive baseUnit', () => {
    expect(SPACING_SYSTEM.baseUnit).toBeGreaterThan(0);
  });

  it('has scale entries', () => {
    expect(Object.keys(SPACING_SYSTEM.scale).length).toBeGreaterThan(5);
  });

  it('has breakpoints', () => {
    expect(SPACING_SYSTEM.breakpoints.sm).toBeDefined();
    expect(SPACING_SYSTEM.breakpoints.lg).toBeDefined();
  });

  it('has border radius values', () => {
    expect(SPACING_SYSTEM.borderRadius.sm).toBeDefined();
    expect(SPACING_SYSTEM.borderRadius.lg).toBeDefined();
    expect(SPACING_SYSTEM.borderRadius.full).toBeDefined();
  });

  it('has shadow definitions', () => {
    expect(SPACING_SYSTEM.shadows.sm).toBeDefined();
    expect(SPACING_SYSTEM.shadows.lg).toBeDefined();
  });
});

// ── Icon References ─────────────────────────────────────────
describe('icon-references', () => {
  it('has at least 3 icon libraries', () => {
    expect(ICON_LIBRARIES.length).toBeGreaterThanOrEqual(3);
  });

  it('every library has required fields', () => {
    for (const lib of ICON_LIBRARIES) {
      expect(lib.name).toBeTruthy();
      expect(lib.style).toBeTruthy();
      expect(lib.count).toBeTruthy();
      expect(lib.importPackage).toBeDefined();
    }
  });

  it('getDefaultIconLibrary returns a valid library', () => {
    const def = getDefaultIconLibrary('react');
    expect(def.name).toBeTruthy();
  });
});

// ── Animation Presets ───────────────────────────────────────
describe('animation-presets', () => {
  it('has at least 5 presets', () => {
    expect(ANIMATION_PRESETS.length).toBeGreaterThanOrEqual(5);
  });

  it('every preset has css field and optional tailwindClass', () => {
    for (const ap of ANIMATION_PRESETS) {
      expect(ap.name).toBeTruthy();
      expect(ap.category).toBeTruthy();
      expect(ap.css).toBeTruthy();
      if (ap.tailwindClass !== undefined) {
        expect(typeof ap.tailwindClass).toBe('string');
      }
    }
  });

  it('getAnimationsByCategory filters correctly', () => {
    const categories = [...new Set(ANIMATION_PRESETS.map((a) => a.category))];
    for (const cat of categories) {
      const filtered = getAnimationsByCategory(cat);
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((a) => a.category === cat)).toBe(true);
    }
  });
});

// ── Layout Patterns ─────────────────────────────────────────
describe('layout-patterns', () => {
  it('has at least 5 patterns', () => {
    expect(LAYOUT_PATTERNS.length).toBeGreaterThanOrEqual(5);
  });

  it('every pattern has required fields', () => {
    for (const lp of LAYOUT_PATTERNS) {
      expect(lp.name).toBeTruthy();
      expect(lp.description).toBeTruthy();
      expect(lp.useCase).toBeTruthy();
      expect(lp.components.length).toBeGreaterThan(0);
    }
  });

  it('getLayoutPattern returns correct pattern', () => {
    const first = LAYOUT_PATTERNS[0]!;
    expect(getLayoutPattern(first.name)).toEqual(first);
  });

  it('getLayoutPattern returns undefined for unknown', () => {
    expect(getLayoutPattern('nonexistent-pattern')).toBeUndefined();
  });

  it('getLayoutPatternsByUseCase filters correctly', () => {
    const useCases = [
      ...new Set(LAYOUT_PATTERNS.flatMap((lp) => (Array.isArray(lp.useCase) ? lp.useCase : [lp.useCase]))),
    ];
    for (const uc of useCases) {
      const filtered = getLayoutPatternsByUseCase(uc);
      expect(filtered.length).toBeGreaterThan(0);
    }
  });
});

// ── Inspiration Sources ─────────────────────────────────────
describe('inspiration-sources', () => {
  it('has at least 5 sources', () => {
    expect(INSPIRATION_SOURCES.length).toBeGreaterThanOrEqual(5);
  });

  it('every source has valid URL', () => {
    for (const src of INSPIRATION_SOURCES) {
      expect(src.name).toBeTruthy();
      expect(src.url).toMatch(/^https?:\/\//);
      expect(src.category).toBeTruthy();
    }
  });

  it('getPrimaryDesignReference returns a source', () => {
    const primary = getPrimaryDesignReference();
    expect(primary).toBeDefined();
    expect(primary.url).toMatch(/^https?:\/\//);
  });

  it('getFallbackDesignReference returns a source', () => {
    const fallback = getFallbackDesignReference();
    expect(fallback).toBeDefined();
  });

  it('getInspirationByCategory filters correctly', () => {
    const categories = [...new Set(INSPIRATION_SOURCES.map((s) => s.category))];
    for (const cat of categories) {
      expect(getInspirationByCategory(cat).length).toBeGreaterThan(0);
    }
  });

  it('getInspirationByPriority filters correctly', () => {
    const priorities = [...new Set(INSPIRATION_SOURCES.map((s) => s.priority))];
    for (const p of priorities) {
      expect(getInspirationByPriority(p).length).toBeGreaterThan(0);
    }
  });
});

// ── Presets & getPreset ─────────────────────────────────────
describe('presets', () => {
  it('DEFAULT_PRESET exists in PRESETS', () => {
    expect(PRESETS[DEFAULT_PRESET]).toBeDefined();
  });

  it('listPresets returns all preset names', () => {
    const names = listPresets();
    expect(names.length).toBe(Object.keys(PRESETS).length);
    expect(names).toContain(DEFAULT_PRESET);
  });

  it('getPreset returns a valid IDesignContext for default', () => {
    const ctx = getPreset();
    expect(ctx.typography.fontFamily).toBeTruthy();
    expect(ctx.typography.headingFont).toBeTruthy();
    expect(ctx.colorPalette.primary).toMatch(/^#[0-9a-f]{6}$/i);
    expect(ctx.colorPalette.background).toMatch(/^#[0-9a-f]{6}$/i);
    expect(ctx.colorPalette.foreground).toMatch(/^#[0-9a-f]{6}$/i);
    expect(ctx.spacing.unit).toBeGreaterThan(0);
    expect(ctx.borderRadius.md).toBeTruthy();
    expect(ctx.shadows.md).toBeTruthy();
  });

  it('getPreset returns valid context for every preset', () => {
    for (const name of listPresets()) {
      const ctx = getPreset(name);
      expect(ctx.typography.fontFamily).toBeTruthy();
      expect(ctx.colorPalette.primary).toMatch(/^#[0-9a-f]{6}$/i);
      expect(ctx.colorPalette.background).toMatch(/^#[0-9a-f]{6}$/i);
      expect(ctx.borderRadius.md).toBeTruthy();
    }
  });

  it('getPreset falls back to default for unknown name', () => {
    const ctx = getPreset('nonexistent');
    const def = getPreset(DEFAULT_PRESET);
    expect(ctx.colorPalette.primary).toBe(def.colorPalette.primary);
  });

  it('all preset color values are valid hex', () => {
    const hexRe = /^#[0-9a-f]{6}$/i;
    for (const name of listPresets()) {
      const ctx = getPreset(name);
      for (const [key, val] of Object.entries(ctx.colorPalette)) {
        expect(val, `${name}.colorPalette.${key}`).toMatch(hexRe);
      }
    }
  });
});
