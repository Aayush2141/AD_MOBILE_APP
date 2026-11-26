/**
 * config.ts — App-wide runtime configuration flags.
 */

/**
 * When true, verificationService uses hardcoded mock extractions instead of
 * calling the remote IDP backend. Set to false once EXPO_PUBLIC_API_URL is live.
 */
export const USE_MOCK = true;

/** Base URL for the Intelligent Document Processing (IDP) backend. */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

/** Request timeout in milliseconds (10 seconds). */
export const API_TIMEOUT_MS = 10_000;
