import { getMemoryDatabase } from '../lib/design-references/database/store.js';
import { initializeRegistry, resetInitialization } from '../lib/design-references/component-registry/init.js';
import { getRegistrySize } from '../lib/design-references/component-registry/index.js';
import {
  recordPattern,
  getPromotablePatternsFromDb,
  promotePattern,
  runPromotionCycle,
  getPatternStats,
  ensurePatternsTable,
} from '../lib/feedback/pattern-promotion.js';
import { isPromotable } from '../lib/feedback/pattern-detector.js';
import type { ICodePattern } from '../lib/feedback/types.js';
import type Database from 'better-sqlite3';

describe('pattern-promotion', () => {
  let db: Database.Database;

  beforeAll(() => {
    resetInitialization();
    initializeRegistry();
  });

  beforeEach(() => {
    db = getMemoryDatabase();
    ensurePatternsTable(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('recordPattern', () => {
    it('creates a new pattern', () => {
      const pattern = recordPattern('hash1', 'div>h2+p', '<div><h2>Title</h2><p>Body</p></div>', 'card', 'molecule', 0.8, db);
      expect(pattern.id).toBeTruthy();
      expect(pattern.frequency).toBe(1);
      expect(pattern.avgScore).toBe(0.8);
      expect(pattern.promoted).toBe(false);
    });

    it('increments frequency on duplicate hash', () => {
      recordPattern('hash2', 'div>button', '<div><button>CTA</button></div>', 'button', 'atom', 1.0, db);
      const updated = recordPattern('hash2', 'div>button', '<div><button>CTA</button></div>', 'button', 'atom', 0.6, db);
      expect(updated.frequency).toBe(2);
      expect(updated.avgScore).toBeCloseTo(0.8, 1); // (1.0 + 0.6) / 2
    });

    it('computes running average correctly over multiple updates', () => {
      recordPattern('hash3', 'section>h1', '<section><h1>Hero</h1></section>', 'hero', 'organism', 1.0, db);
      recordPattern('hash3', 'section>h1', '<section><h1>Hero</h1></section>', 'hero', 'organism', 0.5, db);
      const p = recordPattern('hash3', 'section>h1', '<section><h1>Hero</h1></section>', 'hero', 'organism', 0.8, db);
      expect(p.frequency).toBe(3);
      // (1.0 + 0.5 + 0.8) / 3 ≈ 0.767
      expect(p.avgScore).toBeCloseTo(0.767, 1);
    });
  });

  describe('getPromotablePatternsFromDb', () => {
    it('returns empty when no patterns exist', () => {
      expect(getPromotablePatternsFromDb(db)).toEqual([]);
    });

    it('returns patterns meeting promotion criteria', () => {
      // Insert a pattern with freq >= 3 and avgScore > 0.5
      db.prepare(
        `INSERT INTO code_patterns (id, skeleton_hash, skeleton, snippet, component_type, category, frequency, avg_score, promoted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run('p1', 'h1', 'div>h2', '<div><h2>T</h2></div>', 'card', 'molecule', 5, 0.9, 0);

      const results = getPromotablePatternsFromDb(db);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBeDefined();
      expect(results[0]!.id).toBe('p1');
    });

    it('excludes already promoted patterns', () => {
      db.prepare(
        `INSERT INTO code_patterns (id, skeleton_hash, skeleton, snippet, component_type, category, frequency, avg_score, promoted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run('p2', 'h2', 'div>p', '<div><p>B</p></div>', 'text', 'atom', 5, 0.9, 1);

      expect(getPromotablePatternsFromDb(db)).toEqual([]);
    });

    it('excludes low-frequency patterns', () => {
      db.prepare(
        `INSERT INTO code_patterns (id, skeleton_hash, skeleton, snippet, component_type, category, frequency, avg_score, promoted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run('p3', 'h3', 'div>span', '<div><span>X</span></div>', 'badge', 'atom', 1, 0.9, 0);

      expect(getPromotablePatternsFromDb(db)).toEqual([]);
    });

    it('excludes low-score patterns', () => {
      db.prepare(
        `INSERT INTO code_patterns (id, skeleton_hash, skeleton, snippet, component_type, category, frequency, avg_score, promoted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run('p4', 'h4', 'div>img', '<div><img/></div>', 'avatar', 'atom', 5, 0.2, 0);

      expect(getPromotablePatternsFromDb(db)).toEqual([]);
    });
  });

  describe('promotePattern', () => {
    it('promotes an eligible pattern to registry', () => {
      const sizeBefore = getRegistrySize();

      const pattern: ICodePattern = {
        id: 'prom-1',
        skeletonHash: 'abc12345',
        skeleton: 'div>h2+p+button',
        snippet: '<div><h2>Title</h2><p>Body</p><button>CTA</button></div>',
        frequency: 5,
        avgScore: 0.9,
        promoted: false,
      };

      // Insert into DB so the UPDATE works
      db.prepare(
        `INSERT INTO code_patterns (id, skeleton_hash, skeleton, snippet, component_type, category, frequency, avg_score, promoted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(pattern.id, pattern.skeletonHash, pattern.skeleton, pattern.snippet, 'card', 'molecule', pattern.frequency, pattern.avgScore, 0);

      const result = promotePattern(pattern, 'card', 'molecule', db);
      expect(result).not.toBeNull();
      expect(result!.id).toContain('promoted-');
      expect(result!.variant).toBe('user-proven');

      // Registry should have grown by 1
      expect(getRegistrySize()).toBe(sizeBefore + 1);

      // DB should be marked promoted
      const row = db.prepare('SELECT promoted FROM code_patterns WHERE id = ?').get('prom-1') as { promoted: number };
      expect(row.promoted).toBe(1);
    });

    it('returns null for ineligible pattern', () => {
      const pattern: ICodePattern = {
        id: 'prom-2',
        skeletonHash: 'xyz',
        skeleton: 'div',
        snippet: '<div></div>',
        frequency: 1, // Too low
        avgScore: 0.9,
        promoted: false,
      };

      expect(promotePattern(pattern, 'card', 'atom', db)).toBeNull();
    });
  });

  describe('runPromotionCycle', () => {
    it('promotes eligible patterns and returns count', () => {
      // Insert 2 eligible patterns
      db.prepare(
        `INSERT INTO code_patterns (id, skeleton_hash, skeleton, snippet, component_type, category, frequency, avg_score, promoted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run('cycle-1', 'ch1', 'div>h2+p', '<div>A</div>', 'card', 'molecule', 4, 0.8, 0);
      db.prepare(
        `INSERT INTO code_patterns (id, skeleton_hash, skeleton, snippet, component_type, category, frequency, avg_score, promoted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run('cycle-2', 'ch2', 'section>nav', '<section>B</section>', 'nav', 'organism', 3, 0.6, 0);

      const promoted = runPromotionCycle(db);
      expect(promoted).toBe(2);
    });

    it('returns 0 when no patterns are eligible', () => {
      expect(runPromotionCycle(db)).toBe(0);
    });
  });

  describe('getPatternStats', () => {
    it('returns zeros for empty DB', () => {
      const stats = getPatternStats(db);
      expect(stats.total).toBe(0);
      expect(stats.promoted).toBe(0);
      expect(stats.eligible).toBe(0);
    });

    it('returns correct stats', () => {
      db.prepare(
        `INSERT INTO code_patterns (id, skeleton_hash, skeleton, snippet, frequency, avg_score, promoted)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run('s1', 'sh1', 'a', '<a>1</a>', 5, 0.9, 0);
      db.prepare(
        `INSERT INTO code_patterns (id, skeleton_hash, skeleton, snippet, frequency, avg_score, promoted)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run('s2', 'sh2', 'b', '<b>2</b>', 3, 0.6, 1);
      db.prepare(
        `INSERT INTO code_patterns (id, skeleton_hash, skeleton, snippet, frequency, avg_score, promoted)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run('s3', 'sh3', 'c', '<c>3</c>', 1, 0.1, 0);

      const stats = getPatternStats(db);
      expect(stats.total).toBe(3);
      expect(stats.promoted).toBe(1);
      expect(stats.eligible).toBe(1); // s1 is eligible (freq>=3, avg>0.5, not promoted)
    });
  });
});
