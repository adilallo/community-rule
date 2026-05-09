"use client";

import { useCallback } from "react";
import { useCreateFlow } from "../context/CreateFlowContext";
import type { CustomMethodCardFieldBlock } from "../../../../lib/create/customMethodCardFieldBlocks";

/**
 * Stable writer for `customMethodCardFieldBlocksById[id]` used from facet card
 * modals. Uses {@link replaceState} so merges read the latest draft (no stale
 * closure over `customMethodCardFieldBlocksById`).
 */
export function useCustomMethodCardFieldBlocksChange(cardId: string | null) {
  const { replaceState, markCreateFlowInteraction } = useCreateFlow();

  return useCallback(
    (nextBlocks: CustomMethodCardFieldBlock[]) => {
      if (!cardId) return;
      markCreateFlowInteraction();
      replaceState((prev) => ({
        ...prev,
        customMethodCardFieldBlocksById: {
          ...(prev.customMethodCardFieldBlocksById ?? {}),
          [cardId]: nextBlocks,
        },
      }));
    },
    [cardId, markCreateFlowInteraction, replaceState],
  );
}
