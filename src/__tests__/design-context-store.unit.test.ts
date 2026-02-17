import { loadConfig } from '../lib/config.js';
import { designContextStore, DEFAULT_CONTEXT } from '../lib/design-context.js';
import { getPreset } from '../lib/design-references/index.js';

// Load config before any dynamic imports that use config
beforeAll(async () => {
  loadConfig();
});

// ── Design Context Store ────────────────────────────────────
describe('DesignContextStore', () => {
  beforeEach(() => {
    designContextStore.reset();
  });

  it('get() returns a clone, not the internal reference', () => {
    const a = designContextStore.get();
    const b = designContextStore.get();
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
  });

  it('DEFAULT_CONTEXT is preset-driven and has valid hex colors', () => {
    const hexRe = /^#[0-9a-f]{6}$/i;
    expect(DEFAULT_CONTEXT.colorPalette.primary).toMatch(hexRe);
    expect(DEFAULT_CONTEXT.colorPalette.background).toMatch(hexRe);
    expect(DEFAULT_CONTEXT.typography.fontFamily).toBeTruthy();
  });

  it('update() deep-merges nested objects', () => {
    const original = designContextStore.get();
    designContextStore.update({
      colorPalette: {
        ...original.colorPalette,
        primary: '#ff0000',
      },
    });
    const updated = designContextStore.get();
    expect(updated.colorPalette.primary).toBe('#ff0000');
    // Other color fields should be preserved
    expect(updated.colorPalette.background).toBe(original.colorPalette.background);
    expect(updated.colorPalette.foreground).toBe(original.colorPalette.foreground);
  });

  it('update() preserves non-updated top-level keys', () => {
    const original = designContextStore.get();
    designContextStore.update({ iconSet: 'heroicons' });
    const updated = designContextStore.get();
    expect(updated.iconSet).toBe('heroicons');
    expect(updated.typography).toEqual(original.typography);
    expect(updated.colorPalette).toEqual(original.colorPalette);
  });

  it('set() replaces entire context', () => {
    const preset = getPreset('ocean-manrope');
    designContextStore.set(preset);
    const ctx = designContextStore.get();
    expect(ctx.colorPalette.primary).toBe(preset.colorPalette.primary);
  });

  it('selectPreset() switches to a named preset', () => {
    const ctx = designContextStore.selectPreset('emerald-dmsans');
    expect(ctx.colorPalette.primary).toBe(getPreset('emerald-dmsans').colorPalette.primary);
  });

  it('listPresets() returns available preset names', () => {
    const presets = designContextStore.listPresets();
    expect(presets.length).toBeGreaterThan(5);
    expect(presets).toContain('zinc-manrope');
  });

  it('reset() restores to default preset', () => {
    designContextStore.update({ iconSet: 'heroicons' });
    designContextStore.reset();
    const ctx = designContextStore.get();
    expect(ctx.iconSet).toBe(DEFAULT_CONTEXT.iconSet);
  });

  // Edge cases
  it('handles empty update gracefully', () => {
    const original = designContextStore.get();
    designContextStore.update({});
    const updated = designContextStore.get();
    expect(updated).toEqual(original);
  });

  it('handles null/undefined values in update', () => {
    const original = designContextStore.get();
    designContextStore.update({
      colorPalette: {
        ...original.colorPalette,
        primary: undefined as any,
      },
    });
    const updated = designContextStore.get();
    // Should preserve original value when undefined is passed
    expect(updated.colorPalette.primary).toBe(original.colorPalette.primary);
  });

  it('prevents direct mutation of returned context', () => {
    const ctx1 = designContextStore.get();
    ctx1.colorPalette.primary = '#000000';
    const ctx2 = designContextStore.get();
    expect(ctx2.colorPalette.primary).not.toBe('#000000');
  });
});
