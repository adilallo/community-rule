/**
 * Immutable reorder for custom method card field blocks (wizard step 3, edit modal).
 */
export function reorderCustomMethodCardFieldBlocks<T>(
  blocks: readonly T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (fromIndex === toIndex) return [...blocks];
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= blocks.length) {
    return [...blocks];
  }
  if (toIndex >= blocks.length) return [...blocks];
  const next = [...blocks];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next;
}
