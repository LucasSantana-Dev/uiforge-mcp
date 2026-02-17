import { z } from 'zod';
import { ConfigNotInitializedError } from './errors/config.error.js';
import { logger } from './logger.js';

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  FIGMA_ACCESS_TOKEN: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type Config = z.infer<typeof configSchema>;

let config: Config | null = null;

export function loadConfig(): Config {
  if (config) return config;

  const result = configSchema.safeParse(process.env);

  if (!result.success) {
    const errorMessage = `Configuration validation failed: ${JSON.stringify(result.error.format(), null, 2)}`;
    throw new Error(errorMessage);
  }

  config = result.data;
  return config;
}

export function getConfig(): Config {
  if (!config) {
    throw new ConfigNotInitializedError();
  }
  return config;
}

/**
 * Safely parse JSON with fallback.
 * @param jsonString - JSON string to parse
 * @param defaultValue - Fallback value if parsing fails
 */
export function safeJSONParse<T>(jsonString: string | null | undefined, defaultValue: T): T;
export function safeJSONParse<T extends Record<string, unknown>>(jsonString: string | null | undefined): T;
export function safeJSONParse<T>(jsonString: string | null | undefined, defaultValue?: T): T {
  const fallback = (defaultValue ?? {}) as T;
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (err) {
    logger.error({ err, jsonString: jsonString.substring(0, 100) }, 'Failed to parse JSON, returning fallback');
    return fallback;
  }
}
