/* eslint-disable no-console */
/**
 * Minimal logger wrapper.
 *
 * - Centralizes logging so we can swap implementations later (e.g. pino/sentry).
 * - Avoids sprinkling `console.*` throughout app code.
 */

type LoggerArgs = unknown[];

const isProd = process.env.NODE_ENV === "production";

export const logger = {
  debug: (...args: LoggerArgs) => {
    if (!isProd) console.debug(...args);
  },
  info: (...args: LoggerArgs) => {
    console.info(...args);
  },
  warn: (...args: LoggerArgs) => {
    console.warn(...args);
  },
  error: (...args: LoggerArgs) => {
    console.error(...args);
  },
};

