/**
 * Bridges final-review → completed without query strings, and re-opens a rule
 * from profile (`/create/completed?ruleId=…`) after GET /api/rules/[id]. Profile
 * "Manage" links here; "View" uses `/rules/[id]`.
 */
export const CREATE_FLOW_LAST_PUBLISHED_KEY = "createFlow.lastPublished";

export type StoredLastPublishedRule = {
  id: string;
  title: string;
  summary?: string | null;
  document: Record<string, unknown>;
};

export function writeLastPublishedRule(data: StoredLastPublishedRule): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(CREATE_FLOW_LAST_PUBLISHED_KEY, JSON.stringify(data));
}

export function readLastPublishedRule(): StoredLastPublishedRule | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(CREATE_FLOW_LAST_PUBLISHED_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const o = parsed as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.title !== "string") return null;
    const doc = o.document;
    if (doc === null || typeof doc !== "object" || Array.isArray(doc)) {
      return null;
    }
    const summaryVal = o.summary;
    let summary: string | null | undefined;
    if (typeof summaryVal === "string") {
      summary = summaryVal;
    } else if (summaryVal === null) {
      summary = null;
    } else {
      summary = undefined;
    }
    return {
      id: o.id,
      title: o.title,
      summary,
      document: doc as Record<string, unknown>,
    };
  } catch {
    return null;
  }
}
