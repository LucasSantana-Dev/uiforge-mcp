/**
 * Initialize the full component registry with all atoms, molecules, organisms,
 * visual styles, and micro-interactions.
 *
 * Call this once at startup before using any registry search/retrieval functions.
 */

import { clearRegistry, getAllSnippets } from './index.js';
import { registerAtoms } from './atoms/index.js';
import { registerMolecules } from './molecules/index.js';
import { registerOrganisms } from './organisms/index.js';
import { initializeInteractions } from '../micro-interactions/index.js';
import { initializeStyles } from '../visual-styles/index.js';
import { getDatabase, isSeeded, seedComponents } from '../database/store.js';
import pino from 'pino';

const logger = pino({ name: 'registry-init' });

let initialized = false;

export function initializeRegistry(): void {
  if (initialized) return;

  // Clear registry first for clean state
  clearRegistry();

  // Initialize dependencies
  initializeInteractions();
  initializeStyles();

  // Then register component snippets
  registerAtoms();
  registerMolecules();
  registerOrganisms();

  // Seed the SQLite database from the in-memory registry
  try {
    const db = getDatabase();
    if (!isSeeded(db)) {
      const snippets = getAllSnippets();
      seedComponents(snippets, db);
      logger.info({ count: snippets.length }, 'Seeded SQLite database from registry');
    }
  } catch (err) {
    // DB is an optimization layer — registry still works without it
    logger.warn({ err }, 'Failed to seed SQLite database; falling back to in-memory only');
  }

  initialized = true;
}

export function isRegistryInitialized(): boolean {
  return initialized;
}

/**
 * Reset the initialization flag and clear the registry (useful for testing).
 */
export function resetInitialization(): void {
  initialized = false;
  // Note: Registry will be cleared and re-populated on next initializeRegistry() call
}
