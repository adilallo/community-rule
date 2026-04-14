const EMAIL_MAX_LEN = 254;

/** Pragmatic check for the create-flow “save progress” email field (draft + footer enablement). */
export function isValidCreateFlowSaveEmail(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const t = value.trim();
  if (t.length === 0 || t.length > EMAIL_MAX_LEN) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}
