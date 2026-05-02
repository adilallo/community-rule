"use client";

/**
 * `conflict-management` step — Figma compact card stack (node `20879-15979`).
 * Registry: `CREATE_FLOW_SCREEN_REGISTRY["conflict-management"]`.
 *
 * Card click opens the Figma "Add Approach" create modal (node `20874-172292`)
 * with four controls rendered by {@link ConflictManagementEditFields}: Core
 * Principle, Applicable Scope (text area), Process Protocol, and Restoration
 * & Fallbacks. The same field set is reused on `/create/final-review` — see
 * `FinalReviewChipEditModal`. Confirm persists both the chip selection and
 * any user edits as a `conflictManagementDetailsById[id]` override.
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
import { ConflictManagementEditFields } from "../../components/methodEditFields";
import CustomMethodCardWizard from "../../components/CustomMethodCardWizard";
import { conflictManagementPresetFor } from "../../../../../lib/create/finalReviewChipPresets";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";
import { mergePresetMethodsWithCustom } from "../../../../../lib/create/mergePresetMethodsWithCustom";
import { moveFacetSelectionIdToFront } from "../../../../../lib/create/methodCardSelectionOrder";
import { isCustomMethodCardId } from "../../../../../lib/create/isCustomMethodCardId";
import { removeMethodCardFromFacetSelection } from "../../../../../lib/create/removeMethodCardFromFacetSelection";
import type { ConflictManagementDetailEntry } from "../../types";
import CustomMethodCardModalBody from "../../components/CustomMethodCardModalBody";
import { useCustomMethodCardFieldBlocksChange } from "../../hooks/useCustomMethodCardFieldBlocksChange";

export function ConflictManagementScreen() {
  const m = useMessages();
  const cm = m.create.customRule.conflictManagement;
  const mdUp = useCreateFlowMdUp();
  const { state, updateState, markCreateFlowInteraction } = useCreateFlow();
  const [expanded, setExpanded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);
  const [pendingDraft, setPendingDraft] =
    useState<ConflictManagementDetailEntry | null>(null);
  const [addCustomWizardOpen, setAddCustomWizardOpen] = useState(false);

  const selectedIds = state.selectedConflictManagementIds ?? [];

  const mergedMethods = useMemo(
    () =>
      mergePresetMethodsWithCustom(
        cm.methods,
        selectedIds,
        state.customMethodCardMetaById,
      ),
    [cm.methods, selectedIds, state.customMethodCardMetaById],
  );

  const { sampleCards, compactCardIds, methodById } = useMethodCardDeckOrdering(
    "conflictManagement",
    mergedMethods,
    selectedIds,
  );

  const handleOpenAddWizard = useCallback(() => {
    markCreateFlowInteraction();
    setAddCustomWizardOpen(true);
  }, [markCreateFlowInteraction]);

  const title = expanded ? cm.page.expandedTitle : cm.page.compactTitle;

  const description = expanded ? (
    <>
      {cm.page.expandedDescriptionBefore}
      <InlineTextButton onClick={handleOpenAddWizard}>
        {cm.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {cm.page.expandedDescriptionAfter}
    </>
  ) : (
    <>
      {cm.page.compactDescriptionBefore}
      <InlineTextButton onClick={handleOpenAddWizard}>
        {cm.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {cm.page.compactDescriptionAfter}
    </>
  );

  const modalConfig = pendingCardId
    ? (() => {
        const method = methodById.get(pendingCardId);
        const alreadySelected = selectedIds.includes(pendingCardId);
        return {
          title: method?.label ?? cm.confirmModal.title,
          description: method?.supportText ?? cm.confirmModal.description,
          nextButtonText: alreadySelected
            ? cm.removeApproach.nextButtonText
            : cm.addApproach.nextButtonText,
        };
      })()
    : {
        title: cm.confirmModal.title,
        description: cm.confirmModal.description,
        nextButtonText: cm.confirmModal.nextButtonText,
      };

  const seedDraft = useCallback(
    (id: string): ConflictManagementDetailEntry => {
      const saved = state.conflictManagementDetailsById?.[id];
      if (saved) {
        return {
          ...saved,
          applicableScope: [...saved.applicableScope],
          selectedApplicableScope: [...saved.selectedApplicableScope],
        };
      }
      return conflictManagementPresetFor(id);
    },
    [state.conflictManagementDetailsById],
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
    (next: ConflictManagementDetailEntry) => {
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
        selectedConflictManagementIds: moveFacetSelectionIdToFront(
          selectedIds,
          id,
        ),
        customMethodCardMetaById: {
          ...(state.customMethodCardMetaById ?? {}),
          [id]: { label: title, supportText: description },
        },
        conflictManagementDetailsById: {
          ...(state.conflictManagementDetailsById ?? {}),
          [id]: conflictManagementPresetFor(id),
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
      state.conflictManagementDetailsById,
      state.customMethodCardFieldBlocksById,
      state.customMethodCardMetaById,
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
        removeMethodCardFromFacetSelection(
          state,
          "conflictManagement",
          pendingCardId,
        ),
      );
      handleCreateModalClose();
      return;
    }
    if (!pendingDraft) {
      handleCreateModalClose();
      return;
    }
    updateState({
      selectedConflictManagementIds: moveFacetSelectionIdToFront(
        selectedIds,
        pendingCardId,
      ),
      conflictManagementDetailsById: {
        ...(state.conflictManagementDetailsById ?? {}),
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
            toggleLabel={cm.page.seeAllLink}
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
            <ConflictManagementEditFields
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
