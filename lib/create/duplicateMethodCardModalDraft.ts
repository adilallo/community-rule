import type { CustomMethodCardFieldBlock } from "./customMethodCardFieldBlocks";

/**
 * Localized label for a duplicated method card. Supports a "%s" placeholder or
 * a suffix appended to the base label (e.g. `" (copy)"`).
 */
export function duplicateMethodCardTitle(
  baseLabel: string,
  duplicateTitleSuffix: string,
): string {
  if (duplicateTitleSuffix.includes("%s")) {
    return duplicateTitleSuffix.replaceAll("%s", baseLabel);
  }
  return `${baseLabel}${duplicateTitleSuffix}`;
}

export function omitIdFromStringRecord<V>(
  record: Record<string, V> | undefined,
  id: string,
): Record<string, V> | undefined {
  if (!record || !(id in record)) {
    return record;
  }
  const next: Record<string, V> = { ...record };
  delete next[id];
  return Object.keys(next).length > 0 ? next : undefined;
}

/** Prefer in-modal draft, then persisted facet entry; deep-clone for state writes. */
export function cloneMethodCardDetailsForDuplicate<T>(
  pendingDraft: T | null,
  persisted: T | undefined,
  fallback: () => T,
): T {
  const base = pendingDraft ?? persisted;
  if (base === undefined || base === null) {
    return structuredClone(fallback());
  }
  return structuredClone(base);
}

export function cloneMethodCardBlocksForDuplicate(
  blocksById: Record<string, CustomMethodCardFieldBlock[]> | undefined,
  sourceId: string,
): CustomMethodCardFieldBlock[] {
  return structuredClone(blocksById?.[sourceId] ?? []);
}

/** Shallow-copy facet maps and drop `omitId` if set (chained duplicate of staged card). */
export function forkMethodCardFacetMapsForDuplicate<TDetail>(params: {
  customMethodCardMetaById:
    | Record<string, { label: string; supportText: string }>
    | undefined;
  facetDetailsById: Record<string, TDetail> | undefined;
  customMethodCardFieldBlocksById:
    | Record<string, CustomMethodCardFieldBlock[]>
    | undefined;
  omitId: string | null;
}): {
  customMethodCardMetaById: Record<string, { label: string; supportText: string }>;
  facetDetailsById: Record<string, TDetail>;
  customMethodCardFieldBlocksById: Record<string, CustomMethodCardFieldBlock[]>;
} {
  const customMethodCardMetaById = {
    ...(params.customMethodCardMetaById ?? {}),
  };
  const facetDetailsById = { ...(params.facetDetailsById ?? {}) };
  const customMethodCardFieldBlocksById = {
    ...(params.customMethodCardFieldBlocksById ?? {}),
  };
  if (params.omitId) {
    delete customMethodCardMetaById[params.omitId];
    delete facetDetailsById[params.omitId];
    delete customMethodCardFieldBlocksById[params.omitId];
  }
  return {
    customMethodCardMetaById,
    facetDetailsById,
    customMethodCardFieldBlocksById,
  };
}
