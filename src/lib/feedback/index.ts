/**
 * Feedback & self-learning system for UIForge MCP.
 *
 * Collects explicit user feedback and implicit signals from prompt sequences
 * to train the RAG retrieval layer over time.
 */

export type {
  IGeneration,
  IFeedback,
  ICodePattern,
  IImplicitSignal,
  IExplicitFeedbackInput,
  IPromptClassification,
} from './types.js';

export { classifyPromptPair, classifyPromptText } from './prompt-classifier.js';

export { extractSkeleton, hashSkeleton, fingerprint, isPromotable } from './pattern-detector.js';

export {
  recordGeneration,
  recordExplicitFeedback,
  getAggregateScore,
  getFeedbackCount,
  getFeedbackStats,
  exportTrainingData,
  clearSessionCache,
} from './feedback-tracker.js';

export { feedbackBoostedSearch, getFeedbackBoost } from './feedback-boosted-search.js';

export {
  recordPattern,
  getPromotablePatternsFromDb,
  promotePattern,
  runPromotionCycle,
  getPatternStats,
  ensurePatternsTable,
} from './pattern-promotion.js';
