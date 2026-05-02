/**
 * Canonical ordering for method-card facet `selected*Ids` when the user adds a card:
 * most recently confirmed id is index 0 so stack / compact layouts stay consistent
 * with {@link orderRankedMethodsWithPinnedSelection}.
 */
export function moveFacetSelectionIdToFront(
  prev: readonly string[],
  id: string,
): string[] {
  const without = prev.filter((x) => x !== id);
  return [id, ...without];
}
