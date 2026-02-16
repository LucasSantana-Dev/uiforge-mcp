/**
 * Pattern promotion — auto-expand the registry from proven user-accepted patterns.
 *
 * When a code pattern is generated frequently with high feedback scores,
 * it gets promoted to a first-class registry snippet so the RAG system
 * returns it directly in future searches.
 */

import type Database from 'better-sqlite3';
import { createHash } from 'node:crypto';
import pino from 'pino';
import type { ICodePattern } from './types.js';
import { isPromotable } from './pattern-detector.js';
import { registerSnippet } from '../design-references/component-registry/index.js';
import type { IComponentSnippet, ComponentCategory } from '../design-references/component-registry/types.js';

const logger = pino({ name: 'pattern-promotion' });

// Schema for the patterns table (created alongside feedback tables)
export const PATTERNS_TABLE = `
  CREATE TABLE IF NOT EXISTS code_patterns (
    id             TEXT PRIMARY KEY,
    skeleton_hash  TEXT NOT NULL UNIQUE,
    skeleton       TEXT NOT NULL,
    snippet        TEXT NOT NULL,
    component_type TEXT,
    category       TEXT,
    frequency      INTEGER NOT NULL DEFAULT 1,
    avg_score      REAL NOT NULL DEFAULT 0,
    promoted       INTEGER NOT NULL DEFAULT 0,
    created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at     INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE INDEX IF NOT EXISTS idx_patterns_hash ON code_patterns(skeleton_hash);
  CREATE INDEX IF NOT EXISTS idx_patterns_promoted ON code_patterns(promoted);
`;

/**
 * Ensure the patterns table exists in the database.
 */
export function ensurePatternsTable(db: Database.Database): void {
  db.exec(PATTERNS_TABLE);
}

/**
 * Record or update a code pattern from a generation.
 */
export function recordPattern(
  skeletonHash: string,
  skeleton: string,
  code: string,
  componentType: string | undefined,
  category: ComponentCategory | undefined,
  feedbackScore: number,
  db: Database.Database
): ICodePattern {
  ensurePatternsTable(db);

  const existing = db
    .prepare('SELECT * FROM code_patterns WHERE skeleton_hash = ?')
    .get(skeletonHash) as any | undefined;

  if (existing) {
    // Update frequency and running average score
    const newFreq = existing.frequency + 1;
    const newAvg =
      (existing.avg_score * existing.frequency + feedbackScore) / newFreq;

    db.prepare(
      `UPDATE code_patterns
       SET frequency = ?, avg_score = ?, updated_at = ?
       WHERE skeleton_hash = ?`
    ).run(newFreq, newAvg, Math.floor(Date.now() / 1000), skeletonHash);

    return {
      id: existing.id,
      skeletonHash,
      skeleton,
      snippet: existing.snippet,
      frequency: newFreq,
      avgScore: newAvg,
      promoted: existing.promoted === 1,
    };
  } else {
    const id = `pat-${createHash('sha256').update(skeletonHash + Date.now()).digest('hex').slice(0, 12)}`;

    db.prepare(
      `INSERT INTO code_patterns (id, skeleton_hash, skeleton, snippet, component_type, category, frequency, avg_score, promoted)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, 0)`
    ).run(id, skeletonHash, skeleton, code, componentType ?? null, category ?? null, feedbackScore);

    return {
      id,
      skeletonHash,
      skeleton,
      snippet: code,
      frequency: 1,
      avgScore: feedbackScore,
      promoted: false,
    };
  }
}

/**
 * Get all patterns eligible for promotion.
 */
export function getPromotablePatternsFromDb(db: Database.Database): ICodePattern[] {
  ensurePatternsTable(db);

  const rows = db
    .prepare(
      `SELECT id, skeleton_hash, skeleton, snippet, frequency, avg_score, promoted, component_type, category
       FROM code_patterns
       WHERE promoted = 0 AND frequency >= 3 AND avg_score > 0.5
       ORDER BY avg_score DESC, frequency DESC`
    )
    .all() as Array<{
      id: string;
      skeleton_hash: string;
      skeleton: string;
      snippet: string;
      frequency: number;
      avg_score: number;
      promoted: number;
    }>;

  return rows.map((r) => ({
    id: r.id,
    skeletonHash: r.skeleton_hash,
    skeleton: r.skeleton,
    snippet: r.snippet,
    frequency: r.frequency,
    avgScore: r.avg_score,
    promoted: r.promoted === 1,
  }));
}

/**
 * Promote a pattern to a registry snippet.
 * Creates a new IComponentSnippet from the pattern and registers it.
 */
export function promotePattern(
  pattern: ICodePattern,
  componentType: string,
  category: ComponentCategory,
  db: Database.Database
): IComponentSnippet | null {
  if (!isPromotable(pattern)) {
    logger.debug({ patternId: pattern.id }, 'Pattern not eligible for promotion');
    return null;
  }

  const snippet: IComponentSnippet = {
    id: `promoted-${pattern.skeletonHash.slice(0, 8)}`,
    name: `User-Proven ${componentType} Pattern`,
    category,
    type: componentType.toLowerCase(),
    variant: 'user-proven',
    tags: ['promoted', 'user-proven', componentType.toLowerCase()],
    mood: [],
    industry: ['general'],
    visualStyles: [],
    jsx: pattern.snippet,
    tailwindClasses: {},
    a11y: {
      roles: ['generic'],
      ariaAttributes: [],
      keyboardNav: 'standard',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: false,
    },
    responsive: {
      strategy: 'mobile-first',
      breakpoints: ['sm', 'md', 'lg'],
    },
    quality: {
      antiGeneric: [],
      inspirationSource: `user-proven pattern (${pattern.frequency} gens, avg ${pattern.avgScore.toFixed(2)})`,
      craftDetails: ['auto-promoted from feedback loop'],
    },
  };

  try {
    registerSnippet(snippet);

    // Mark as promoted in DB
    db.prepare('UPDATE code_patterns SET promoted = 1, updated_at = ? WHERE id = ?').run(
      Math.floor(Date.now() / 1000),
      pattern.id
    );

    logger.info(
      { patternId: pattern.id, snippetId: snippet.id, freq: pattern.frequency, score: pattern.avgScore },
      'Pattern promoted to registry snippet'
    );

    return snippet;
  } catch (err) {
    logger.error({ err, patternId: pattern.id }, 'Failed to promote pattern');
    return null;
  }
}

/**
 * Run the promotion cycle: find eligible patterns and promote them.
 * Returns the count of newly promoted patterns.
 */
export function runPromotionCycle(db: Database.Database): number {
  const candidates = getPromotablePatternsFromDb(db);
  let promoted = 0;

  for (const pattern of candidates) {
    // Infer type/category from the stored pattern data
    const row = db
      .prepare('SELECT component_type, category FROM code_patterns WHERE id = ?')
      .get(pattern.id) as { component_type: string | null; category: string | null } | undefined;

    const componentType = row?.component_type ?? 'unknown';
    const category = (row?.category as ComponentCategory) ?? 'atom';

    const result = promotePattern(pattern, componentType, category, db);
    if (result) promoted++;
  }

  if (promoted > 0) {
    logger.info({ promoted, candidates: candidates.length }, 'Promotion cycle complete');
  }

  return promoted;
}

/**
 * Get pattern statistics.
 */
export function getPatternStats(db: Database.Database): {
  total: number;
  promoted: number;
  eligible: number;
  avgFrequency: number;
  avgScore: number;
} {
  ensurePatternsTable(db);

  const total = db.prepare('SELECT COUNT(*) as cnt FROM code_patterns').get() as { cnt: number };
  const promoted = db.prepare('SELECT COUNT(*) as cnt FROM code_patterns WHERE promoted = 1').get() as { cnt: number };
  const eligible = db
    .prepare('SELECT COUNT(*) as cnt FROM code_patterns WHERE promoted = 0 AND frequency >= 3 AND avg_score > 0.5')
    .get() as { cnt: number };
  const stats = db
    .prepare('SELECT AVG(frequency) as avg_freq, AVG(avg_score) as avg_sc FROM code_patterns')
    .get() as { avg_freq: number | null; avg_sc: number | null };

  return {
    total: total.cnt,
    promoted: promoted.cnt,
    eligible: eligible.cnt,
    avgFrequency: stats.avg_freq ?? 0,
    avgScore: stats.avg_sc ?? 0,
  };
}
