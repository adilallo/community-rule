import type {
  CommunityRuleEntry,
  CommunityRuleLabeledBlock,
} from "../../app/components/type/CommunityRule/CommunityRule.types";

function isLabeledBlock(x: unknown): x is CommunityRuleLabeledBlock {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.label === "string" && typeof o.body === "string";
}

/** Shared by publish payload parsing and template body parsing — keep in sync. */
export function isDocumentEntry(x: unknown): x is CommunityRuleEntry {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.title !== "string" || o.title.trim().length === 0) {
    return false;
  }
  if (typeof o.body !== "string") return false;
  if (o.blocks !== undefined) {
    if (!Array.isArray(o.blocks) || !o.blocks.every(isLabeledBlock)) {
      return false;
    }
  }
  return true;
}
