/**
 * Web vitals persistence mode (CR-80). Default: external in production, local in dev.
 * Does not require a specific observability vendor — ops can pipe structured logs to any stack.
 */
export type WebVitalsStorageMode = "external" | "local";

const VALID: WebVitalsStorageMode[] = ["external", "local"];

function normalizeEnv(
  raw: string | undefined,
): WebVitalsStorageMode | undefined {
  const v = raw?.trim().toLowerCase();
  if (v === "external" || v === "local") return v;
  if (v === "database") {
    // Reserved for Ticket 9 option C — not implemented yet; safe default.
    return "external";
  }
  return undefined;
}

/**
 * Resolves storage mode from `WEB_VITALS_STORAGE` or defaults:
 * - `production` → `external` (no `.next` writes; ingest logs only)
 * - otherwise → `local` (file-based under `.next/web-vitals` for dev/admin)
 */
export function getWebVitalsStorageMode(): WebVitalsStorageMode {
  const fromEnv = normalizeEnv(process.env.WEB_VITALS_STORAGE);
  if (fromEnv && VALID.includes(fromEnv)) return fromEnv;

  return process.env.NODE_ENV === "production" ? "external" : "local";
}
