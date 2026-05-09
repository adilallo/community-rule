"use client";

import ContentLockup from "../../../components/type/ContentLockup";
import { useMessages } from "../../../contexts/MessagesContext";
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
  policyMeta,
  /**
   * When false, omit {@link ContentLockup} for title/description (Customize mode:
   * {@link MethodCardCustomizeModalHeader} already edits them). Summary line still shows.
   * @default true
   */
  showPolicyContentLockupWhenNoBlocks = true,
}: {
  cardId: string;
  blocksById: CreateFlowState["customMethodCardFieldBlocksById"];
  blocksOverride?: CustomMethodCardFieldBlock[] | null;
  onFieldBlocksChange?: (_blocks: CustomMethodCardFieldBlock[]) => void;
  policyMeta?: { label: string; supportText: string };
  showPolicyContentLockupWhenNoBlocks?: boolean;
}) {
  const m = useMessages();
  const blocks = blocksOverride ?? blocksById?.[cardId];
  if (blocks && blocks.length > 0) {
    return (
      <CustomMethodCardFieldBlocksSummary
        blocks={blocks}
        onBlocksChange={onFieldBlocksChange}
      />
    );
  }

  const label = policyMeta?.label?.trim() ?? "";
  const support = policyMeta?.supportText?.trim() ?? "";
  if (label.length > 0 || support.length > 0) {
    const noFieldsHint = m.create.customRule.customMethodCardWizard.editModal
      .noCustomFieldsYet;
    return (
      <div className="flex flex-col gap-4">
        {showPolicyContentLockupWhenNoBlocks ? (
          <ContentLockup
            title={label.length > 0 ? label : undefined}
            description={support.length > 0 ? support : undefined}
            variant="modal"
            alignment="left"
          />
        ) : null}
        {noFieldsHint.trim().length > 0 ? (
          <p className="font-[family-name:var(--font-body)] text-[length:var(--font-size-body-m,15px)] leading-[var(--line-height-body-m,22px)] text-[var(--color-content-default-secondary)]">
            {noFieldsHint}
          </p>
        ) : null}
      </div>
    );
  }

  return <CustomMethodCardPresetEditPlaceholder />;
}
