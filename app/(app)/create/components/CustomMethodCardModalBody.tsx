"use client";

import type { CustomMethodCardFieldBlock } from "../../../../lib/create/customMethodCardFieldBlocks";
import type { CreateFlowState } from "../types";
import CustomMethodCardFieldBlocksSummary from "./CustomMethodCardFieldBlocksSummary";
import CustomMethodCardPresetEditPlaceholder from "./CustomMethodCardPresetEditPlaceholder";

/** Body for Create modals when the card is user-authored (custom UUID). */
export default function CustomMethodCardModalBody({
  cardId,
  blocksById,
  /** When set, used instead of `blocksById[cardId]` (e.g. final-review draft). */
  blocksOverride,
  onFieldBlocksChange,
}: {
  cardId: string;
  blocksById: CreateFlowState["customMethodCardFieldBlocksById"];
  blocksOverride?: CustomMethodCardFieldBlock[] | null;
  onFieldBlocksChange?: (_blocks: CustomMethodCardFieldBlock[]) => void;
}) {
  const blocks = blocksOverride ?? blocksById?.[cardId];
  if (blocks && blocks.length > 0) {
    return (
      <CustomMethodCardFieldBlocksSummary
        blocks={blocks}
        onBlocksChange={onFieldBlocksChange}
      />
    );
  }
  return <CustomMethodCardPresetEditPlaceholder />;
}
