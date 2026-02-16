/**
 * Type definitions for the feedback & self-learning system.
 */

/** A recorded generation event. */
export interface IGeneration {
  id: string;
  tool: 'generate_ui_component' | 'generate_page_template';
  params: Record<string, string>;
  componentType: string;
  framework: string;
  outputHash: string;
  timestamp: number;
  sessionId: string;
}

/** Feedback for a generation (explicit or implicit). */
export interface IFeedback {
  id: string;
  generationId: string;
  rating: 'positive' | 'negative' | 'neutral';
  source: 'explicit' | 'implicit';
  score: number; // -1.0 to +2.0
  confidence: number; // 0.0 to 1.0
  comment?: string;
  timestamp: number;
}

/** A detected code pattern from generated outputs. */
export interface ICodePattern {
  id: string;
  skeletonHash: string;
  skeleton: string;
  snippet: string;
  frequency: number;
  avgScore: number;
  promoted: boolean;
}

/** Implicit signal derived from analyzing the next prompt. */
export interface IImplicitSignal {
  type: 'new_task' | 'minor_tweak' | 'major_redo' | 'praise' | 'time_gap' | 'rapid_followup';
  score: number;
  confidence: number;
  reason: string;
}

/** Input for the submit_feedback MCP tool. */
export interface IExplicitFeedbackInput {
  generationId: string;
  rating: 'positive' | 'negative';
  comment?: string;
}

/** Result of classifying a prompt pair. */
export interface IPromptClassification {
  signals: IImplicitSignal[];
  combinedScore: number;
  combinedConfidence: number;
}
