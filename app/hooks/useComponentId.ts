import { useId } from "react";

/**
 * Hook to generate unique component IDs for accessibility
 * Provides consistent ID generation pattern across components
 *
 * @param prefix - Prefix for the generated ID (e.g., "input", "select")
 * @param providedId - Optional ID provided via props (takes precedence)
 *
 * @returns Object with component ID and associated label ID
 *
 * @example
 * ```tsx
 * const { id, labelId } = useComponentId("input", props.id);
 * // id: "input-123" or props.id if provided
 * // labelId: "input-123-label"
 * ```
 */
export function useComponentId(
  prefix: string,
  providedId?: string,
): { id: string; labelId: string } {
  const generatedId = useId();
  const id = providedId || `${prefix}-${generatedId}`;
  const labelId = `${id}-label`;

  return { id, labelId };
}
