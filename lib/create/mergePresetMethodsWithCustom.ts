/**
 * Merge JSON preset method rows with user-created cards (stable UUID ids + meta).
 * Custom rows follow `selectedIds` order (most-recent add at index 0 in create flow)
 * but appear after all presets in this merged list; CardStack display order is
 * layered separately via `useMethodCardDeckOrdering`.
 */

export function mergePresetMethodsWithCustom<
  T extends { id: string; label: string; supportText?: string },
>(
  presets: readonly T[],
  selectedIds: readonly string[],
  meta: Record<string, { label: string; supportText: string }> | undefined,
): T[] {
  const presetIds = new Set(presets.map((p) => p.id));
  const customRows: T[] = [];
  const seenCustom = new Set<string>();

  for (const id of selectedIds) {
    if (presetIds.has(id)) continue;
    const row = meta?.[id];
    if (!row || seenCustom.has(id)) continue;
    seenCustom.add(id);
    customRows.push({
      id,
      label: row.label,
      supportText: row.supportText,
    } as T);
  }

  return [...presets, ...customRows];
}
