"use client";

/**
 * `membership-methods` step — Figma compact card stack (node `20858-13947`).
 * Registry: `CREATE_FLOW_SCREEN_REGISTRY["membership-methods"]`.
 *
 * Card click opens the Figma create modal (node `20858-13948`) with three
 * editable sections rendered by {@link MembershipMethodEditFields}. The same
 * field set is reused on `/create/final-review` — see `FinalReviewChipEditModal`.
 * Confirm persists both the chip selection and any user edits as a
 * `membershipMethodDetailsById[id]` override; section defaults come from
 * `messages/en/create/customRule/membership.json` and will be replaced with
 * DB-driven content.
 */

import { useState, useCallback, useMemo } from "react";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { useMethodCardDeckOrdering } from "../../hooks/useMethodCardDeckOrdering";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import CardStack from "../../../../components/cards/CardStack";
import Create from "../../../../components/modals/Create";
import InlineTextButton from "../../../../components/buttons/InlineTextButton";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import {
  CREATE_FLOW_CARD_STACK_AREA_MAX_CLASS,
  CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS,
} from "../../components/createFlowLayoutTokens";
import { MembershipMethodEditFields } from "../../components/methodEditFields";
import CustomMethodCardWizard from "../../components/CustomMethodCardWizard";
import { membershipPresetFor } from "../../../../../lib/create/finalReviewChipPresets";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";
import { mergePresetMethodsWithCustom } from "../../../../../lib/create/mergePresetMethodsWithCustom";
import { moveFacetSelectionIdToFront } from "../../../../../lib/create/methodCardSelectionOrder";
import { isCustomMethodCardId } from "../../../../../lib/create/isCustomMethodCardId";
import { removeMethodCardFromFacetSelection } from "../../../../../lib/create/removeMethodCardFromFacetSelection";
import type { MembershipMethodDetailEntry } from "../../types";
import CustomMethodCardModalBody from "../../components/CustomMethodCardModalBody";
import { useCustomMethodCardFieldBlocksChange } from "../../hooks/useCustomMethodCardFieldBlocksChange";

export function MembershipMethodsScreen() {
  const m = useMessages();
  const mem = m.create.customRule.membership;
  const mdUp = useCreateFlowMdUp();
  const { state, updateState, markCreateFlowInteraction } = useCreateFlow();
  const [expanded, setExpanded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);
  const [pendingDraft, setPendingDraft] =
    useState<MembershipMethodDetailEntry | null>(null);
  const [addCustomWizardOpen, setAddCustomWizardOpen] = useState(false);

  const selectedIds = state.selectedMembershipMethodIds ?? [];

  const mergedMethods = useMemo(
    () =>
      mergePresetMethodsWithCustom(
        mem.methods,
        selectedIds,
        state.customMethodCardMetaById,
      ),
    [mem.methods, selectedIds, state.customMethodCardMetaById],
  );

  const { sampleCards, compactCardIds, methodById } = useMethodCardDeckOrdering(
    "membership",
    mergedMethods,
    selectedIds,
  );

  const handleOpenAddWizard = useCallback(() => {
    markCreateFlowInteraction();
    setAddCustomWizardOpen(true);
  }, [markCreateFlowInteraction]);

  const title = expanded ? mem.page.expandedTitle : mem.page.compactTitle;

  const description = expanded ? (
    <>
      {mem.page.expandedDescriptionBefore}
      <InlineTextButton onClick={handleOpenAddWizard}>
        {mem.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {mem.page.expandedDescriptionAfter}
    </>
  ) : (
    <>
      {mem.page.compactDescriptionBefore}
      <InlineTextButton onClick={handleOpenAddWizard}>
        {mem.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {mem.page.compactDescriptionAfter}
    </>
  );

  const modalConfig = pendingCardId
    ? (() => {
        const method = methodById.get(pendingCardId);
        const alreadySelected = selectedIds.includes(pendingCardId);
        return {
          title: method?.label ?? mem.confirmModal.title,
          description: method?.supportText ?? mem.confirmModal.description,
          nextButtonText: alreadySelected
            ? mem.removePlatform.nextButtonText
            : mem.addPlatform.nextButtonText,
        };
      })()
    : {
        title: mem.confirmModal.title,
        description: mem.confirmModal.description,
        nextButtonText: mem.confirmModal.nextButtonText,
      };

  const seedDraft = useCallback(
    (id: string): MembershipMethodDetailEntry => {
      const saved = state.membershipMethodDetailsById?.[id];
      if (saved) {
        return { ...saved };
      }
      return membershipPresetFor(id);
    },
    [state.membershipMethodDetailsById],
  );

  const handleCardClick = useCallback(
    (id: string) => {
      markCreateFlowInteraction();
      setPendingCardId(id);
      setPendingDraft(seedDraft(id));
      setCreateModalOpen(true);
    },
    [markCreateFlowInteraction, seedDraft],
  );

  const handleDraftChange = useCallback(
    (next: MembershipMethodDetailEntry) => {
      markCreateFlowInteraction();
      setPendingDraft(next);
    },
    [markCreateFlowInteraction],
  );

  const onCustomFieldBlocksChange = useCustomMethodCardFieldBlocksChange(
    createModalOpen ? pendingCardId : null,
  );

  const handleCreateModalClose = useCallback(() => {
    setCreateModalOpen(false);
    setPendingCardId(null);
    setPendingDraft(null);
  }, []);

  const handleCloseAddWizard = useCallback(() => {
    setAddCustomWizardOpen(false);
  }, []);

  const handleFinalizeCustomCard = useCallback(
    ({
      title,
      description,
      fieldBlocks,
    }: {
      title: string;
      description: string;
      fieldBlocks: CustomMethodCardFieldBlock[];
    }) => {
      markCreateFlowInteraction();
      const id = crypto.randomUUID();
      updateState({
        selectedMembershipMethodIds: moveFacetSelectionIdToFront(
          selectedIds,
          id,
        ),
        customMethodCardMetaById: {
          ...(state.customMethodCardMetaById ?? {}),
          [id]: { label: title, supportText: description },
        },
        membershipMethodDetailsById: {
          ...(state.membershipMethodDetailsById ?? {}),
          [id]: membershipPresetFor(id),
        },
        customMethodCardFieldBlocksById: {
          ...(state.customMethodCardFieldBlocksById ?? {}),
          [id]: fieldBlocks,
        },
      });
    },
    [
      markCreateFlowInteraction,
      selectedIds,
      state.customMethodCardFieldBlocksById,
      state.customMethodCardMetaById,
      state.membershipMethodDetailsById,
      updateState,
    ],
  );

  const handleCreateModalPrimary = useCallback(() => {
    if (!pendingCardId) {
      handleCreateModalClose();
      return;
    }
    markCreateFlowInteraction();
    if (selectedIds.includes(pendingCardId)) {
      updateState(
        removeMethodCardFromFacetSelection(state, "membership", pendingCardId),
      );
      handleCreateModalClose();
      return;
    }
    if (!pendingDraft) {
      handleCreateModalClose();
      return;
    }
    updateState({
      selectedMembershipMethodIds: moveFacetSelectionIdToFront(
        selectedIds,
        pendingCardId,
      ),
      membershipMethodDetailsById: {
        ...(state.membershipMethodDetailsById ?? {}),
        [pendingCardId]: pendingDraft,
      },
    });
    handleCreateModalClose();
  }, [
    handleCreateModalClose,
    markCreateFlowInteraction,
    pendingCardId,
    pendingDraft,
    selectedIds,
    state,
    updateState,
  ]);

  return (
    <>
    <CreateFlowStepShell
      variant="wideGridLoosePadding"
      contentTopBelowMd="space-800"
    >
      <div className="flex w-full min-w-0 flex-col items-center gap-6">
        <div className={CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS}>
          <CreateFlowHeaderLockup
            title={title}
            description={description}
            justification="center"
          />
        </div>
        <div className={CREATE_FLOW_CARD_STACK_AREA_MAX_CLASS}>
          <CardStack
            cards={sampleCards}
            selectedIds={selectedIds}
            onCardSelect={handleCardClick}
            expanded={expanded}
            onToggleExpand={() => {
              markCreateFlowInteraction();
              setExpanded((prev) => !prev);
            }}
            hasMore={true}
            toggleLabel={mem.page.seeAllLink}
            compactRecommendedLimit={5}
            compactCardIds={compactCardIds}
            compactDesktopLayout="pyramidFive"
            headerLockupSize={mdUp ? "L" : "M"}
          />
        </div>
      </div>

      <Create
        isOpen={createModalOpen}
        onClose={handleCreateModalClose}
        onNext={handleCreateModalPrimary}
        title={modalConfig.title}
        description={modalConfig.description}
        nextButtonText={modalConfig.nextButtonText}
        showBackButton={false}
        backdropVariant="blurredYellow"
      >
        {pendingCardId && pendingDraft ? (
          isCustomMethodCardId(
            pendingCardId,
            state.customMethodCardMetaById,
          ) ? (
            <CustomMethodCardModalBody
              key={pendingCardId}
              cardId={pendingCardId}
              blocksById={state.customMethodCardFieldBlocksById}
              onFieldBlocksChange={onCustomFieldBlocksChange}
            />
          ) : (
            <MembershipMethodEditFields
              key={pendingCardId}
              value={pendingDraft}
              onChange={handleDraftChange}
            />
          )
        ) : null}
      </Create>
    </CreateFlowStepShell>
      <CustomMethodCardWizard
        isOpen={addCustomWizardOpen}
        onClose={handleCloseAddWizard}
        onFinalize={handleFinalizeCustomCard}
      />
    </>
  );
}
