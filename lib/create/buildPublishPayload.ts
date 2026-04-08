import type { CreateFlowState } from "../../app/create/types";
import type { CommunityRuleDocumentSection } from "../../app/components/sections/CommunityRuleDocument/CommunityRuleDocument.types";

function isDocumentEntry(x: unknown): x is { title: string; body: string } {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.title === "string" && typeof o.body === "string";
}

function isDocumentSection(x: unknown): x is CommunityRuleDocumentSection {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.categoryName !== "string") return false;
  if (!Array.isArray(o.entries)) return false;
  return o.entries.every(isDocumentEntry);
}

/** Narrow `CreateFlowState.sections` into Community Rule document sections. */
export function parseSectionsFromCreateFlowState(
  state: CreateFlowState,
): CommunityRuleDocumentSection[] {
  const raw = state.sections;
  if (!Array.isArray(raw)) return [];
  const out: CommunityRuleDocumentSection[] = [];
  for (const x of raw) {
    if (isDocumentSection(x)) out.push(x);
  }
  return out;
}

export type BuildPublishPayloadResult =
  | {
      ok: true;
      title: string;
      summary?: string;
      document: Record<string, unknown>;
    }
  | { ok: false; error: string };

const FALLBACK_CATEGORY = "Overview";

const DEFAULT_FALLBACK_BODY =
  "This CommunityRule was created in the create flow. Add more detail in a future edit.";

export function buildPublishPayload(
  state: CreateFlowState,
): BuildPublishPayloadResult {
  const title = typeof state.title === "string" ? state.title.trim() : "";
  if (!title) {
    return { ok: false, error: "missingCommunityName" };
  }

  let summary: string | undefined;
  if (typeof state.summary === "string") {
    const t = state.summary.trim();
    if (t.length > 0) summary = t;
  }

  let sections = parseSectionsFromCreateFlowState(state);
  if (sections.length === 0) {
    const body = summary ?? DEFAULT_FALLBACK_BODY;
    sections = [
      {
        categoryName: FALLBACK_CATEGORY,
        entries: [{ title: "Community", body }],
      },
    ];
  }

  if (summary !== undefined) {
    return { ok: true, title, summary, document: { sections } };
  }
  return { ok: true, title, document: { sections } };
}

/** Read `document.sections` from a stored published payload for display. */
export function parseDocumentSectionsForDisplay(
  document: unknown,
): CommunityRuleDocumentSection[] {
  if (!document || typeof document !== "object") return [];
  const sections = (document as Record<string, unknown>).sections;
  if (!Array.isArray(sections)) return [];
  return sections.filter(isDocumentSection);
}
