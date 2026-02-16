import { getMemoryDatabase } from '../lib/design-references/database/store.js';
import { cosineSimilarity, findSimilar } from '../lib/ml/embeddings.js';
import {
  storeEmbedding,
  storeEmbeddings,
  loadEmbeddings,
  getEmbedding,
  semanticSearch,
  getEmbeddingCount,
  deleteEmbeddings,
} from '../lib/ml/embedding-store.js';
import type { IEmbedding } from '../lib/ml/types.js';
import type Database from 'better-sqlite3';

// ── Helpers ────────────────────────────────────────────────

function makeVector(dims: number, seed: number): Float32Array {
  const v = new Float32Array(dims);
  for (let i = 0; i < dims; i++) {
    v[i] = Math.sin(seed * (i + 1));
  }
  // Normalize
  let norm = 0;
  for (let i = 0; i < dims; i++) norm += v[i]! * v[i]!;
  norm = Math.sqrt(norm);
  for (let i = 0; i < dims; i++) v[i] = v[i]! / norm;
  return v;
}

function makeEmbedding(id: string, seed: number, dims = 384): IEmbedding {
  return {
    sourceId: id,
    sourceType: 'component',
    text: `Test text for ${id}`,
    vector: makeVector(dims, seed),
    dimensions: dims,
    createdAt: Date.now(),
  };
}

// ── cosineSimilarity ───────────────────────────────────────

describe('cosineSimilarity', () => {
  it('returns 1 for identical normalized vectors', () => {
    const v = makeVector(384, 42);
    expect(cosineSimilarity(v, v)).toBeCloseTo(1, 5);
  });

  it('returns ~0 for orthogonal vectors', () => {
    const a = new Float32Array([1, 0, 0]);
    const b = new Float32Array([0, 1, 0]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(0, 5);
  });

  it('returns -1 for opposite normalized vectors', () => {
    const a = new Float32Array([1, 0, 0]);
    const b = new Float32Array([-1, 0, 0]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(-1, 5);
  });

  it('returns 0 for mismatched dimensions', () => {
    const a = new Float32Array([1, 0]);
    const b = new Float32Array([1, 0, 0]);
    expect(cosineSimilarity(a, b)).toBe(0);
  });
});

// ── findSimilar ────────────────────────────────────────────

describe('findSimilar', () => {
  it('ranks identical vector first', () => {
    const query = makeVector(16, 1);
    const candidates: IEmbedding[] = [
      makeEmbedding('same', 1, 16),
      makeEmbedding('different', 99, 16),
    ];
    const results = findSimilar(query, candidates, 5, 0);
    expect(results[0]!.id).toBe('same');
    expect(results[0]!.similarity).toBeCloseTo(1, 3);
  });

  it('respects threshold', () => {
    const query = makeVector(16, 1);
    const candidates: IEmbedding[] = [
      makeEmbedding('close', 1, 16),
      makeEmbedding('far', 99, 16),
    ];
    const results = findSimilar(query, candidates, 5, 0.99);
    expect(results.length).toBe(1);
    expect(results[0]!.id).toBe('close');
  });

  it('respects topK', () => {
    const query = makeVector(8, 1);
    const candidates = Array.from({ length: 10 }, (_, i) => makeEmbedding(`e-${i}`, i + 1, 8));
    const results = findSimilar(query, candidates, 3, 0);
    expect(results.length).toBe(3);
  });
});

// ── Embedding Store (SQLite) ───────────────────────────────

describe('embedding-store', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = getMemoryDatabase();
  });

  afterEach(() => {
    db.close();
  });

  it('stores and retrieves a single embedding', () => {
    const emb = makeEmbedding('btn-1', 42);
    storeEmbedding(emb, db);

    const retrieved = getEmbedding('btn-1', 'component', db);
    expect(retrieved).toBeDefined();
    expect(retrieved!.sourceId).toBe('btn-1');
    expect(retrieved!.dimensions).toBe(384);
    expect(retrieved!.vector.length).toBe(384);
    // Verify vector data survived round-trip
    expect(cosineSimilarity(emb.vector, retrieved!.vector)).toBeCloseTo(1, 5);
  });

  it('returns undefined for nonexistent embedding', () => {
    expect(getEmbedding('nope', 'component', db)).toBeUndefined();
  });

  it('storeEmbeddings batch inserts', () => {
    const embs = [makeEmbedding('a', 1), makeEmbedding('b', 2), makeEmbedding('c', 3)];
    storeEmbeddings(embs, db);
    expect(getEmbeddingCount('component', db)).toBe(3);
  });

  it('loadEmbeddings returns all of a type', () => {
    storeEmbeddings(
      [
        makeEmbedding('comp-1', 1),
        makeEmbedding('comp-2', 2),
        { ...makeEmbedding('prompt-1', 3), sourceType: 'prompt' as const },
      ],
      db
    );

    const components = loadEmbeddings('component', db);
    expect(components.length).toBe(2);

    const prompts = loadEmbeddings('prompt', db);
    expect(prompts.length).toBe(1);
  });

  it('deleteEmbeddings removes by type', () => {
    storeEmbeddings([makeEmbedding('a', 1), makeEmbedding('b', 2)], db);
    expect(getEmbeddingCount('component', db)).toBe(2);

    const deleted = deleteEmbeddings('component', db);
    expect(deleted).toBe(2);
    expect(getEmbeddingCount('component', db)).toBe(0);
  });

  it('upserts on duplicate (source_id, source_type)', () => {
    storeEmbedding(makeEmbedding('btn-1', 1), db);
    storeEmbedding(makeEmbedding('btn-1', 99), db);
    expect(getEmbeddingCount('component', db)).toBe(1);

    const retrieved = getEmbedding('btn-1', 'component', db)!;
    // Should have the updated vector (seed 99)
    const expected = makeVector(384, 99);
    expect(cosineSimilarity(retrieved.vector, expected)).toBeCloseTo(1, 3);
  });
});

// ── semanticSearch ─────────────────────────────────────────

describe('semanticSearch', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = getMemoryDatabase();
    storeEmbeddings(
      [
        makeEmbedding('hero-centered', 1),
        makeEmbedding('hero-split', 2),
        makeEmbedding('card-pricing', 50),
        makeEmbedding('footer-default', 99),
      ],
      db
    );
  });

  afterEach(() => {
    db.close();
  });

  it('finds the most similar component', () => {
    const queryVec = makeVector(384, 1); // Same seed as hero-centered
    const results = semanticSearch(queryVec, 'component', db, 5, 0);
    expect(results[0]!.id).toBe('hero-centered');
    expect(results[0]!.similarity).toBeCloseTo(1, 3);
  });

  it('returns results sorted by similarity', () => {
    const queryVec = makeVector(384, 1);
    const results = semanticSearch(queryVec, 'component', db, 10, 0);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1]!.similarity).toBeGreaterThanOrEqual(results[i]!.similarity);
    }
  });

  it('respects topK', () => {
    const queryVec = makeVector(384, 1);
    const results = semanticSearch(queryVec, 'component', db, 2, 0);
    expect(results.length).toBe(2);
  });

  it('returns empty for nonexistent type', () => {
    const queryVec = makeVector(384, 1);
    const results = semanticSearch(queryVec, 'prompt', db);
    expect(results).toEqual([]);
  });
});
