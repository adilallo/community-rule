import type {
  CommunityRuleEntry,
  CommunityRuleLabeledBlock,
} from "../../app/components/type/CommunityRule/CommunityRule.types";

function isLabeledBlock(x: unknown): x is CommunityRuleLabeledBlock {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.label !== "string" || typeof o.body !== "string") return false;
  if (o.imageUrl !== undefined && typeof o.imageUrl !== "string") return false;
  if (o.fileUrl !== undefined && typeof o.fileUrl !== "string") return false;
  return true;
}

/** Shared by publish payload parsing and template body parsing — keep in sync. */
export function isDocumentEntry(x: unknown): x is CommunityRuleEntry {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.title !== "string" || o.title.trim().length === 0) {
    return false;
  }
  if (o.blocks !== undefined) {
    if (!Array.isArray(o.blocks) || !o.blocks.every(isLabeledBlock)) {
      return false;
    }
  }
  const blocks = Array.isArray(o.blocks) ? o.blocks : [];
  const hasBlocks = blocks.length > 0;
  if (hasBlocks) {
    if (o.body !== undefined && typeof o.body !== "string") {
      return false;
    }
    return true;
  }
  if (typeof o.body !== "string") return false;
  return true;
}
