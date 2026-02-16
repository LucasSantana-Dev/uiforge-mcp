/**
 * Rule-based prompt classifier for implicit feedback.
 *
 * Analyzes consecutive generation calls to infer user satisfaction
 * without requiring any external ML model or API.
 */

import type { IGeneration, IImplicitSignal, IPromptClassification } from './types.js';

// --- Keyword dictionaries ---

const NEGATIVE_KEYWORDS = [
  'redo', 'wrong', 'fix', 'change', 'not what i', 'try again',
  'different', 'instead', 'actually', 'no,', 'nope', 'bad',
  'ugly', 'broken', 'doesn\'t work', 'not right', 'scrap',
];

const POSITIVE_KEYWORDS = [
  'perfect', 'great', 'looks good', 'thanks', 'love it',
  'awesome', 'nice', 'exactly', 'good job', 'well done',
  'that\'s it', 'keep', 'ship it', 'deploy', 'done',
];

const TWEAK_KEYWORDS = [
  'darker', 'lighter', 'bigger', 'smaller', 'more', 'less',
  'adjust', 'tweak', 'slightly', 'a bit', 'little',
  'spacing', 'padding', 'margin', 'color', 'font',
];

// --- Signal detectors ---

/**
 * Detect if the user moved to a completely different task.
 */
function detectNewTask(prev: IGeneration, curr: IGeneration): IImplicitSignal | null {
  const diffType = prev.componentType !== curr.componentType;
  const diffTool = prev.tool !== curr.tool;

  if (diffType || diffTool) {
    return {
      type: 'new_task',
      score: 1.0,
      confidence: 0.8,
      reason: diffTool
        ? `Switched tools: ${prev.tool} → ${curr.tool}`
        : `Changed component type: ${prev.componentType} → ${curr.componentType}`,
    };
  }
  return null;
}

/**
 * Detect keyword signals in the current prompt context.
 */
function detectKeywordSignals(promptContext: string): IImplicitSignal[] {
  const signals: IImplicitSignal[] = [];
  const lower = promptContext.toLowerCase();

  // Check positive keywords
  for (const kw of POSITIVE_KEYWORDS) {
    if (lower.includes(kw)) {
      signals.push({
        type: 'praise',
        score: 2.0,
        confidence: 0.9,
        reason: `Positive keyword detected: "${kw}"`,
      });
      break; // One positive signal is enough
    }
  }

  // Check negative keywords
  for (const kw of NEGATIVE_KEYWORDS) {
    if (lower.includes(kw)) {
      signals.push({
        type: 'major_redo',
        score: -1.0,
        confidence: 0.7,
        reason: `Negative keyword detected: "${kw}"`,
      });
      break;
    }
  }

  // Check tweak keywords (only if no strong positive/negative)
  if (signals.length === 0) {
    for (const kw of TWEAK_KEYWORDS) {
      if (lower.includes(kw)) {
        signals.push({
          type: 'minor_tweak',
          score: 0.5,
          confidence: 0.6,
          reason: `Tweak keyword detected: "${kw}"`,
        });
        break;
      }
    }
  }

  return signals;
}

/**
 * Detect time-based signals between consecutive generations.
 */
function detectTimeSignal(prev: IGeneration, curr: IGeneration): IImplicitSignal | null {
  const gap = curr.timestamp - prev.timestamp;
  const gapSeconds = gap / 1000;

  if (gapSeconds < 30) {
    return {
      type: 'rapid_followup',
      score: -0.3,
      confidence: 0.5,
      reason: `Rapid follow-up: ${gapSeconds.toFixed(0)}s gap`,
    };
  }

  if (gapSeconds > 300) {
    return {
      type: 'time_gap',
      score: 0.8,
      confidence: 0.6,
      reason: `Long gap: ${(gapSeconds / 60).toFixed(1)} minutes`,
    };
  }

  return null;
}

/**
 * Detect if the user is re-requesting the same component type with same params.
 */
function detectSameParamsIteration(prev: IGeneration, curr: IGeneration): boolean {
  return (
    prev.componentType === curr.componentType &&
    prev.framework === curr.framework &&
    prev.tool === curr.tool
  );
}

// --- Main classifier ---

/**
 * Classify a pair of consecutive generation events to produce implicit feedback
 * for the previous generation.
 *
 * @param prev The previous generation event
 * @param curr The current generation event
 * @param promptContext Optional text context from the current prompt/description
 */
export function classifyPromptPair(
  prev: IGeneration,
  curr: IGeneration,
  promptContext: string = ''
): IPromptClassification {
  const signals: IImplicitSignal[] = [];

  // 1. Parameter diff
  const newTask = detectNewTask(prev, curr);
  if (newTask) {
    signals.push(newTask);
  }

  // 2. Keyword signals
  if (promptContext) {
    signals.push(...detectKeywordSignals(promptContext));
  }

  // 3. Time-based signals
  const timeSignal = detectTimeSignal(prev, curr);
  if (timeSignal) {
    signals.push(timeSignal);
  }

  // 4. Same-params iteration penalty (only if no new_task)
  if (!newTask && detectSameParamsIteration(prev, curr)) {
    // Same params = likely correcting, unless positive keywords found
    const hasPositive = signals.some((s) => s.type === 'praise');
    if (!hasPositive) {
      signals.push({
        type: 'minor_tweak',
        score: 0.0,
        confidence: 0.4,
        reason: 'Same params iteration (neutral — may be refining)',
      });
    }
  }

  // Combine scores: weighted average by confidence
  let totalWeight = 0;
  let weightedScore = 0;
  let maxConfidence = 0;

  for (const signal of signals) {
    weightedScore += signal.score * signal.confidence;
    totalWeight += signal.confidence;
    if (signal.confidence > maxConfidence) {
      maxConfidence = signal.confidence;
    }
  }

  const combinedScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
  const combinedConfidence = maxConfidence;

  return {
    signals,
    combinedScore,
    combinedConfidence,
  };
}

/**
 * Classify a single keyword context without a previous generation.
 * Useful for explicit prompt analysis.
 */
export function classifyPromptText(promptContext: string): IPromptClassification {
  const signals = detectKeywordSignals(promptContext);

  let totalWeight = 0;
  let weightedScore = 0;
  let maxConfidence = 0;

  for (const signal of signals) {
    weightedScore += signal.score * signal.confidence;
    totalWeight += signal.confidence;
    if (signal.confidence > maxConfidence) maxConfidence = signal.confidence;
  }

  return {
    signals,
    combinedScore: totalWeight > 0 ? weightedScore / totalWeight : 0,
    combinedConfidence: maxConfidence,
  };
}
