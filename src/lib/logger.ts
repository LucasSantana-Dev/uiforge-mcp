import pino, { type Logger } from 'pino';
import { getConfig } from './config.js';

let loggerInstance: Logger | null = null;

function initLogger(): Logger {
  if (loggerInstance) return loggerInstance;

  const config = getConfig();
  const isDevelopment = config.NODE_ENV !== 'production';

  loggerInstance = pino({
    level: config.LOG_LEVEL,
    transport: isDevelopment
      ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
      : undefined,
  });

  return loggerInstance;
}

export const logger = new Proxy({} as Logger, {
  get(target, prop) {
    const instance = initLogger();
    return instance[prop as keyof Logger];
  },
});

export function createLogger(name: string) {
  return initLogger().child({ module: name });
}
