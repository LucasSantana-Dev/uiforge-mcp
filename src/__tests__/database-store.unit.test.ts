import Database from 'better-sqlite3';
import { CREATE_TABLES, SCHEMA_VERSION } from '../lib/design-references/database/schema.js';
import {
  getMemoryDatabase,
  isSeeded,
  seedComponents,
  queryComponents,
  getComponentById,
  getComponentsByCategory,
  getRelatedComponents,
  getComponentCount,
} from '../lib/design-references/database/store.js';
import type { IComponentSnippet } from '../lib/design-references/component-registry/types.js';

// ── Helper ─────────────────────────────────────────────────

function makeSnippet(overrides: Partial<IComponentSnippet> = {}): IComponentSnippet {
  return {
    id: overrides.id ?? 'test-btn-primary',
    name: overrides.name ?? 'Test Button',
    type: overrides.type ?? 'button',
    variant: overrides.variant ?? 'primary',
    category: overrides.category ?? 'atom',
    mood: overrides.mood ?? ['professional'],
    industry: overrides.industry ?? ['general'],
    visualStyles: overrides.visualStyles ?? ['linear-modern'],
    tags: overrides.tags ?? ['cta', 'action'],
    tailwindClasses: overrides.tailwindClasses ?? { root: 'px-4 py-2 rounded-lg bg-blue-600 text-white' },
    jsx: overrides.jsx ?? '<button>Click</button>',
    a11y: overrides.a11y ?? {
      roles: ['button'],
      ariaAttributes: ['aria-label'],
      keyboardNav: 'Enter/Space',
      contrastRatio: '7:1',
      focusVisible: true,
      reducedMotion: false,
    },
    responsive: overrides.responsive ?? { strategy: 'mobile-first', breakpoints: ['sm', 'md', 'lg'] },
    quality: overrides.quality ?? {
      antiGeneric: ['custom-radius'],
      inspirationSource: 'linear.app',
      craftDetails: ['subtle-shadow'],
    },
  };
}

function createTestDb(): Database.Database {
  return getMemoryDatabase();
}

// ── Schema ─────────────────────────────────────────────────

describe('database schema', () => {
  it('creates all tables without error', () => {
    const db = new Database(':memory:');
    expect(() => db.exec(CREATE_TABLES)).not.toThrow();
    db.close();
  });

  it('getMemoryDatabase returns a working database', () => {
    const db = createTestDb();
    const row = db.prepare('SELECT value FROM meta WHERE key = ?').get('schema_version') as { value: string };
    expect(row.value).toBe(String(SCHEMA_VERSION));
    db.close();
  });
});

// ── Seed ───────────────────────────────────────────────────

describe('database seed', () => {
  it('isSeeded returns false before seeding', () => {
    const db = createTestDb();
    expect(isSeeded(db)).toBe(false);
    db.close();
  });

  it('seedComponents inserts snippets and marks as seeded', () => {
    const db = createTestDb();
    const snippets = [
      makeSnippet({ id: 'btn-1' }),
      makeSnippet({ id: 'btn-2', variant: 'secondary', mood: ['calm'] }),
    ];
    seedComponents(snippets, db);
    expect(isSeeded(db)).toBe(true);
    expect(getComponentCount(db)).toBe(2);
    db.close();
  });

  it('seedComponents is idempotent (INSERT OR REPLACE)', () => {
    const db = createTestDb();
    const snippets = [makeSnippet({ id: 'btn-1' })];
    seedComponents(snippets, db);
    seedComponents(snippets, db);
    expect(getComponentCount(db)).toBe(1);
    db.close();
  });

  it('seedComponents stores tags, moods, industries, styles', () => {
    const db = createTestDb();
    seedComponents(
      [makeSnippet({ id: 'btn-1', tags: ['cta', 'hero'], mood: ['bold', 'professional'], industry: ['saas'], visualStyles: ['glassmorphism'] })],
      db
    );

    const tags = db.prepare('SELECT COUNT(*) as cnt FROM component_tags WHERE component_id = ?').get('btn-1') as { cnt: number };
    expect(tags.cnt).toBe(2);

    const moods = db.prepare('SELECT COUNT(*) as cnt FROM component_moods WHERE component_id = ?').get('btn-1') as { cnt: number };
    expect(moods.cnt).toBe(2);

    const industries = db.prepare('SELECT COUNT(*) as cnt FROM component_industries WHERE component_id = ?').get('btn-1') as { cnt: number };
    expect(industries.cnt).toBe(1);

    const styles = db.prepare('SELECT COUNT(*) as cnt FROM component_visual_styles WHERE component_id = ?').get('btn-1') as { cnt: number };
    expect(styles.cnt).toBe(1);

    db.close();
  });

  it('seedComponents stores tailwind classes', () => {
    const db = createTestDb();
    seedComponents(
      [makeSnippet({ id: 'btn-tw', tailwindClasses: { root: 'p-4', heading: 'text-xl' } })],
      db
    );
    const rows = db.prepare('SELECT role, classes FROM component_tailwind WHERE component_id = ?').all('btn-tw') as Array<{ role: string; classes: string }>;
    expect(rows.length).toBe(2);
    expect(rows.find((r) => r.role === 'root')?.classes).toBe('p-4');
    expect(rows.find((r) => r.role === 'heading')?.classes).toBe('text-xl');
    db.close();
  });
});

// ── getComponentById ───────────────────────────────────────

describe('database getComponentById', () => {
  it('returns undefined for nonexistent id', () => {
    const db = createTestDb();
    seedComponents([makeSnippet()], db);
    expect(getComponentById('nonexistent', db)).toBeUndefined();
    db.close();
  });

  it('returns a fully hydrated snippet', () => {
    const db = createTestDb();
    const original = makeSnippet({
      id: 'hydrate-test',
      tags: ['cta', 'landing'],
      mood: ['bold', 'premium'],
      industry: ['saas', 'fintech'],
      visualStyles: ['glassmorphism', 'dark-premium'],
      tailwindClasses: { root: 'p-4', label: 'font-bold' },
    });
    seedComponents([original], db);

    const hydrated = getComponentById('hydrate-test', db)!;
    expect(hydrated).toBeDefined();
    expect(hydrated.id).toBe('hydrate-test');
    expect(hydrated.name).toBe(original.name);
    expect(hydrated.type).toBe(original.type);
    expect(hydrated.tags).toEqual(expect.arrayContaining(['cta', 'landing']));
    expect(hydrated.mood).toEqual(expect.arrayContaining(['bold', 'premium']));
    expect(hydrated.industry).toEqual(expect.arrayContaining(['saas', 'fintech']));
    expect(hydrated.visualStyles).toEqual(expect.arrayContaining(['glassmorphism', 'dark-premium']));
    expect(hydrated.tailwindClasses.root).toBe('p-4');
    expect(hydrated.tailwindClasses.label).toBe('font-bold');
    expect(hydrated.a11y.roles).toEqual(['button']);
    expect(hydrated.responsive.strategy).toBe('mobile-first');
    db.close();
  });
});

// ── getComponentsByCategory ────────────────────────────────

describe('database getComponentsByCategory', () => {
  it('returns only components of the given category', () => {
    const db = createTestDb();
    seedComponents(
      [
        makeSnippet({ id: 'atom-1', category: 'atom' }),
        makeSnippet({ id: 'mol-1', category: 'molecule' }),
        makeSnippet({ id: 'org-1', category: 'organism' }),
      ],
      db
    );

    const atoms = getComponentsByCategory('atom', db);
    expect(atoms.length).toBe(1);
    expect(atoms[0]!.id).toBe('atom-1');

    const molecules = getComponentsByCategory('molecule', db);
    expect(molecules.length).toBe(1);
    expect(molecules[0]!.id).toBe('mol-1');

    db.close();
  });
});

// ── queryComponents ────────────────────────────────────────

describe('database queryComponents', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    seedComponents(
      [
        makeSnippet({ id: 'btn-primary', type: 'button', variant: 'primary', mood: ['professional'], industry: ['saas'], visualStyles: ['linear-modern'] }),
        makeSnippet({ id: 'btn-ghost', type: 'button', variant: 'ghost', mood: ['minimal'], industry: ['general'], visualStyles: ['minimal-editorial'] }),
        makeSnippet({ id: 'card-pricing', type: 'card', variant: 'pricing', mood: ['bold', 'premium'], industry: ['fintech'], visualStyles: ['dark-premium'] }),
        makeSnippet({ id: 'hero-centered', type: 'hero', variant: 'centered', category: 'organism', mood: ['professional', 'bold'], industry: ['saas', 'startup'], visualStyles: ['glassmorphism'] }),
      ],
      db
    );
  });

  afterEach(() => {
    db.close();
  });

  it('returns empty for no matching type', () => {
    const results = queryComponents({ type: 'zzzwidget' }, db);
    expect(results).toEqual([]);
  });

  it('finds components by type', () => {
    const results = queryComponents({ type: 'button' }, db);
    expect(results.length).toBe(2);
    expect(results.every((r) => r.snippet.type === 'button')).toBe(true);
  });

  it('finds components by variant', () => {
    const results = queryComponents({ type: 'button', variant: 'ghost' }, db);
    expect(results.length).toBeGreaterThanOrEqual(1);
    const ghostResult = results.find((r) => r.snippet.variant === 'ghost');
    expect(ghostResult).toBeDefined();
  });

  it('scores mood match', () => {
    const results = queryComponents({ type: 'button', mood: 'professional' }, db);
    expect(results.length).toBeGreaterThanOrEqual(1);
    const primary = results.find((r) => r.snippet.id === 'btn-primary');
    expect(primary).toBeDefined();
  });

  it('scores industry match higher than general', () => {
    const results = queryComponents({ type: 'button', industry: 'saas' }, db);
    const saasResult = results.find((r) => r.snippet.id === 'btn-primary');
    const generalResult = results.find((r) => r.snippet.id === 'btn-ghost');
    expect(saasResult).toBeDefined();
    expect(generalResult).toBeDefined();
    expect(saasResult!.score).toBeGreaterThan(generalResult!.score);
  });

  it('scores visual style match', () => {
    const results = queryComponents({ type: 'card', style: 'dark-premium' }, db);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0]!.snippet.id).toBe('card-pricing');
  });

  it('category filter gives higher score', () => {
    const results = queryComponents({ type: 'hero', category: 'organism' }, db);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0]!.snippet.category).toBe('organism');
  });
});

// ── getRelatedComponents ───────────────────────────────────

describe('database getRelatedComponents', () => {
  it('finds components sharing moods or industries', () => {
    const db = createTestDb();
    seedComponents(
      [
        makeSnippet({ id: 'a', mood: ['bold'], industry: ['saas'] }),
        makeSnippet({ id: 'b', mood: ['bold'], industry: ['fintech'] }),
        makeSnippet({ id: 'c', mood: ['calm'], industry: ['healthcare'] }),
      ],
      db
    );

    const related = getRelatedComponents('a', db);
    const relatedIds = related.map((r) => r.id);
    expect(relatedIds).toContain('b'); // shares mood 'bold'
    expect(relatedIds).not.toContain('c'); // no shared mood or industry
    db.close();
  });
});
