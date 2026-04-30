/**
 * Reorders facet-ranked method presets so explicitly confirmed selections pin
 * to the top while the remainder keeps score-based ranking (recommended before
 * default).
 */

/** Selected ids first (selection array order); then tail in `ranked` order. */
export function orderRankedMethodsWithPinnedSelection<T extends { id: string }>(
  rankedMethods: readonly T[],
  selectedIds: readonly string[],
  pinActive: boolean,
): T[] {
  if (!pinActive || selectedIds.length === 0) {
    return [...rankedMethods];
  }
  const byId = new Map(rankedMethods.map((m) => [m.id, m] as const));
  const head: T[] = [];
  const picked = new Set<string>();
  for (const id of selectedIds) {
    const row = byId.get(id);
    if (!row || picked.has(id)) continue;
    picked.add(id);
    head.push(row);
  }
  const tail = rankedMethods.filter((m) => !picked.has(m.id));
  return [...head, ...tail];
}

/**
 * Prefer selected ids in compact slots (up to `limit`), then facet-derived
 * `baseCompact.compactCardIds`, then remaining methods in showcase order so
 * selected cards surface even when they are outside the unpinned facet top-N.
 */
export function mergeCompactCardIdsWithPinnedSelected(
  showcaseOrderIds: readonly string[],
  baseCompactCardIds: readonly string[],
  selectedIds: readonly string[],
  pinActive: boolean,
  limit: number,
): string[] {
  if (!pinActive || selectedIds.length === 0) {
    return [...baseCompactCardIds].slice(0, limit);
  }
  const valid = new Set(showcaseOrderIds);
  const out: string[] = [];
  const seen = new Set<string>();

  for (const id of selectedIds) {
    if (out.length >= limit) break;
    if (!valid.has(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  for (const id of baseCompactCardIds) {
    if (out.length >= limit) break;
    if (!valid.has(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  for (const id of showcaseOrderIds) {
    if (out.length >= limit) break;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}
