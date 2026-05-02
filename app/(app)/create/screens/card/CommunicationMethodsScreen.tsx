"use client";

/**
 * `communication-methods` step — Figma “Flow — Compact Card Stack” (node `20246-15828`).
 * Registry: `layoutKind: "card"` (`CREATE_FLOW_SCREEN_REGISTRY["communication-methods"]`).
 *
 * Lives under `screens/card/` (not `select/`): Figma **card stack** layout is a distinct shell from
 * two-column chip **select** frames. Future card-stack steps get their own `*Screen.tsx` here and
 * reuse `CardStack` / `CreateFlowStepShell` as needed.
 *
 * Card click opens the Figma create modal (node `20246-15829`) with three
 * editable sections rendered by {@link CommunicationMethodEditFields}. The primary
 * action is **Add Platform** for an unselected card or **Remove** when the card is
 * already selected — remove clears `selectedCommunicationMethodIds` and
 * `communicationMethodDetailsById` via {@link removeMethodCardFromFacetSelection}.
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
import { CommunicationMethodEditFields } from "../../components/methodEditFields";
import CustomMethodCardWizard from "../../components/CustomMethodCardWizard";
import { communicationPresetFor } from "../../../../../lib/create/finalReviewChipPresets";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";
import { mergePresetMethodsWithCustom } from "../../../../../lib/create/mergePresetMethodsWithCustom";
import { moveFacetSelectionIdToFront } from "../../../../../lib/create/methodCardSelectionOrder";
import { isCustomMethodCardId } from "../../../../../lib/create/isCustomMethodCardId";
import { removeMethodCardFromFacetSelection } from "../../../../../lib/create/removeMethodCardFromFacetSelection";
import type { CommunicationMethodDetailEntry } from "../../types";
import CustomMethodCardModalBody from "../../components/CustomMethodCardModalBody";
import { useCustomMethodCardFieldBlocksChange } from "../../hooks/useCustomMethodCardFieldBlocksChange";

export function CommunicationMethodsScreen() {
  const m = useMessages();
  const comm = m.create.customRule.communication;
  const mdUp = useCreateFlowMdUp();
  const { state, updateState, markCreateFlowInteraction } = useCreateFlow();
  const [expanded, setExpanded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);
  const [pendingDraft, setPendingDraft] =
    useState<CommunicationMethodDetailEntry | null>(null);
  const [addCustomWizardOpen, setAddCustomWizardOpen] = useState(false);

  const selectedIds = state.selectedCommunicationMethodIds ?? [];

  const mergedMethods = useMemo(
    () =>
      mergePresetMethodsWithCustom(
        comm.methods,
        selectedIds,
        state.customMethodCardMetaById,
      ),
    [comm.methods, selectedIds, state.customMethodCardMetaById],
  );

  const { sampleCards, compactCardIds, methodById } = useMethodCardDeckOrdering(
    "communication",
    mergedMethods,
    selectedIds,
  );

  const handleOpenAddWizard = useCallback(() => {
    markCreateFlowInteraction();
    setAddCustomWizardOpen(true);
  }, [markCreateFlowInteraction]);

  const title = expanded ? comm.page.expandedTitle : comm.page.compactTitle;

  const description = expanded ? (
    <>
      {comm.page.expandedDescriptionBefore}
      <InlineTextButton onClick={handleOpenAddWizard}>
        {comm.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {comm.page.expandedDescriptionAfter}
    </>
  ) : (
    <>
      {comm.page.compactDescriptionBefore}
      <InlineTextButton onClick={handleOpenAddWizard}>
        {comm.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {comm.page.compactDescriptionAfter}
    </>
  );

  const modalConfig = pendingCardId
    ? (() => {
        const method = methodById.get(pendingCardId);
        const alreadySelected = selectedIds.includes(pendingCardId);
        return {
          title: method?.label ?? comm.confirmModal.title,
          description: method?.supportText ?? comm.confirmModal.description,
          nextButtonText: alreadySelected
            ? comm.removePlatform.nextButtonText
            : comm.addPlatform.nextButtonText,
        };
      })()
    : {
        title: comm.confirmModal.title,
        description: comm.confirmModal.description,
        nextButtonText: comm.confirmModal.nextButtonText,
      };

  const seedDraft = useCallback(
    (id: string): CommunicationMethodDetailEntry => {
      const saved = state.communicationMethodDetailsById?.[id];
      if (saved) {
        return { ...saved };
      }
      return communicationPresetFor(id);
    },
    [state.communicationMethodDetailsById],
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
    (next: CommunicationMethodDetailEntry) => {
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
        selectedCommunicationMethodIds: moveFacetSelectionIdToFront(
          selectedIds,
          id,
        ),
        customMethodCardMetaById: {
          ...(state.customMethodCardMetaById ?? {}),
          [id]: { label: title, supportText: description },
        },
        communicationMethodDetailsById: {
          ...(state.communicationMethodDetailsById ?? {}),
          [id]: communicationPresetFor(id),
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
      state.communicationMethodDetailsById,
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
          "communication",
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
      selectedCommunicationMethodIds: moveFacetSelectionIdToFront(
        selectedIds,
        pendingCardId,
      ),
      communicationMethodDetailsById: {
        ...(state.communicationMethodDetailsById ?? {}),
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
            toggleLabel={comm.page.seeAllLink}
            compactRecommendedLimit={5}
            compactCardIds={compactCardIds}
            compactDesktopLayout="flexWrap"
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
            <CommunicationMethodEditFields
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
