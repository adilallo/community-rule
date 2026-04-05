/**
 * Validates that a value is JSON-like (finite numbers, plain objects, no prototype tricks).
 * Used after JSON.parse for defense in depth against odd clients.
 */

export const DEFAULT_PLAIN_JSON_LIMITS = {
  maxDepth: 40,
  maxStringLength: 50_000,
  maxArrayLength: 5_000,
  maxObjectKeys: 500,
} as const;

export type PlainJsonLimits = typeof DEFAULT_PLAIN_JSON_LIMITS;

/**
 * @returns `null` if valid, otherwise a short error message for API responses.
 */
export function assertPlainJsonValue(
  val: unknown,
  depth: number,
  limits: PlainJsonLimits = DEFAULT_PLAIN_JSON_LIMITS,
): string | null {
  if (depth > limits.maxDepth) {
    return "Maximum nesting depth exceeded";
  }
  if (val === null) {
    return null;
  }
  const t = typeof val;
  if (t === "string") {
    const s = val as string;
    return s.length > limits.maxStringLength ? "String value too long" : null;
  }
  if (t === "number") {
    return Number.isFinite(val as number) ? null : "Invalid number value";
  }
  if (t === "boolean") {
    return null;
  }
  if (t === "bigint" || t === "function" || t === "symbol") {
    return "Invalid value type";
  }
  if (Array.isArray(val)) {
    if (val.length > limits.maxArrayLength) {
      return "Array too long";
    }
    for (let i = 0; i < val.length; i++) {
      const inner = assertPlainJsonValue(val[i], depth + 1, limits);
      if (inner) {
        return inner;
      }
    }
    return null;
  }
  if (t === "object") {
    const o = val as Record<string, unknown>;
    const keys = Object.keys(o);
    if (keys.length > limits.maxObjectKeys) {
      return "Object has too many keys";
    }
    for (const k of keys) {
      if (k === "__proto__" || k === "constructor" || k === "prototype") {
        return "Unsafe object key";
      }
      const inner = assertPlainJsonValue(o[k], depth + 1, limits);
      if (inner) {
        return inner;
      }
    }
    return null;
  }
  return "Invalid value type";
}
