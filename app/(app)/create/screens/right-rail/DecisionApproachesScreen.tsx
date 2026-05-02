"use client";

/**
 * `decision-approaches` step — Figma “Flow — Right Rail” (node `20523-23509`).
 * Registry: `CREATE_FLOW_SCREEN_REGISTRY["decision-approaches"]` (`layoutKind: "right-rail"`).
 *
 * Layout matches {@link CreateFlowTwoColumnSelectShell}: one column below `lg` (1024px), two columns
 * at `lg+` with a scrollable rail — same breakpoint and height chain as select steps, distinct content.
 *
 * Card click opens the Figma "Add Approach" create modal (node `20870-72155`) with five controls
 * rendered by {@link DecisionApproachEditFields}: Core Principle, Applicable Scope, Step-by-Step
 * Instructions, Consensus Level, and Objections & Deadlocks. The same field set is reused on
 * `/create/final-review` — see `FinalReviewChipEditModal`. Confirm persists both the chip
 * selection and any user edits as a `decisionApproachDetailsById[id]` override; section
 * defaults come from `messages/en/create/customRule/decisionApproaches.json` and will be
 * replaced with DB-driven content.
 */

import { useState, useCallback, useMemo } from "react";
import CardStack from "../../../../components/cards/CardStack";
import HeaderLockup from "../../../../components/type/HeaderLockup";
import Create from "../../../../components/modals/Create";
import InlineTextButton from "../../../../components/buttons/InlineTextButton";
import InfoMessageBox from "../../../../components/controls/InfoMessageBox";
import type { InfoMessageBoxItem } from "../../../../components/controls/InfoMessageBox/InfoMessageBox.types";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { useMethodCardDeckOrdering } from "../../hooks/useMethodCardDeckOrdering";
import { CreateFlowTwoColumnSelectShell } from "../../components/CreateFlowTwoColumnSelectShell";
import { DecisionApproachEditFields } from "../../components/methodEditFields";
import CustomMethodCardWizard from "../../components/CustomMethodCardWizard";
import { decisionApproachPresetFor } from "../../../../../lib/create/finalReviewChipPresets";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";
import { mergePresetMethodsWithCustom } from "../../../../../lib/create/mergePresetMethodsWithCustom";
import { moveFacetSelectionIdToFront } from "../../../../../lib/create/methodCardSelectionOrder";
import { isCustomMethodCardId } from "../../../../../lib/create/isCustomMethodCardId";
import { removeMethodCardFromFacetSelection } from "../../../../../lib/create/removeMethodCardFromFacetSelection";
import type { DecisionApproachDetailEntry } from "../../types";
import CustomMethodCardModalBody from "../../components/CustomMethodCardModalBody";
import { useCustomMethodCardFieldBlocksChange } from "../../hooks/useCustomMethodCardFieldBlocksChange";

export function DecisionApproachesScreen() {
  const m = useMessages();
  const da = m.create.customRule.decisionApproaches;
  const mdUp = useCreateFlowMdUp();
  const { state, updateState, markCreateFlowInteraction } = useCreateFlow();
  const [messageBoxCheckedIds, setMessageBoxCheckedIds] = useState<string[]>(
    [],
  );
  const [expanded, setExpanded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);
  const [pendingDraft, setPendingDraft] =
    useState<DecisionApproachDetailEntry | null>(null);
  const [addCustomWizardOpen, setAddCustomWizardOpen] = useState(false);

  const selectedIds = state.selectedDecisionApproachIds ?? [];

  const messageBoxItems: InfoMessageBoxItem[] = useMemo(
    () =>
      da.messageBox.items.map((item) => ({
        id: item.id,
        label: item.label,
      })),
    [da.messageBox.items],
  );

  const mergedMethods = useMemo(
    () =>
      mergePresetMethodsWithCustom(
        da.methods,
        selectedIds,
        state.customMethodCardMetaById,
      ),
    [da.methods, selectedIds, state.customMethodCardMetaById],
  );

  const { sampleCards, compactCardIds, methodById } = useMethodCardDeckOrdering(
    "decisionApproaches",
    mergedMethods,
    selectedIds,
  );

  const handleOpenAddWizard = useCallback(() => {
    markCreateFlowInteraction();
    setAddCustomWizardOpen(true);
  }, [markCreateFlowInteraction]);

  const sidebarDescription = (
    <>
      {da.sidebar.descriptionBefore}
      <InlineTextButton onClick={handleOpenAddWizard}>
        {da.sidebar.descriptionLinkLabel}
      </InlineTextButton>
      {da.sidebar.descriptionAfter}
    </>
  );

  const handleMessageBoxCheckboxChange = useCallback(
    (id: string, checked: boolean) => {
      markCreateFlowInteraction();
      setMessageBoxCheckedIds((prev) =>
        checked ? [...prev, id] : prev.filter((x) => x !== id),
      );
    },
    [markCreateFlowInteraction],
  );

  const seedDraft = useCallback(
    (id: string): DecisionApproachDetailEntry => {
      const saved = state.decisionApproachDetailsById?.[id];
      if (saved) {
        return {
          ...saved,
          applicableScope: [...saved.applicableScope],
          selectedApplicableScope: [...saved.selectedApplicableScope],
        };
      }
      return decisionApproachPresetFor(id);
    },
    [state.decisionApproachDetailsById],
  );

  const handleCardSelect = useCallback(
    (id: string) => {
      markCreateFlowInteraction();
      setPendingCardId(id);
      setPendingDraft(seedDraft(id));
      setCreateModalOpen(true);
    },
    [markCreateFlowInteraction, seedDraft],
  );

  const handleDraftChange = useCallback(
    (next: DecisionApproachDetailEntry) => {
      markCreateFlowInteraction();
      setPendingDraft(next);
    },
    [markCreateFlowInteraction],
  );

  const onCustomFieldBlocksChange = useCustomMethodCardFieldBlocksChange(
    createModalOpen ? pendingCardId : null,
  );

  const handleToggleExpand = useCallback(() => {
    markCreateFlowInteraction();
    setExpanded((prev) => !prev);
  }, [markCreateFlowInteraction]);

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
        selectedDecisionApproachIds: moveFacetSelectionIdToFront(
          selectedIds,
          id,
        ),
        customMethodCardMetaById: {
          ...(state.customMethodCardMetaById ?? {}),
          [id]: { label: title, supportText: description },
        },
        decisionApproachDetailsById: {
          ...(state.decisionApproachDetailsById ?? {}),
          [id]: decisionApproachPresetFor(id),
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
      state.decisionApproachDetailsById,
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
          "decisionApproaches",
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
      selectedDecisionApproachIds: moveFacetSelectionIdToFront(
        selectedIds,
        pendingCardId,
      ),
      decisionApproachDetailsById: {
        ...(state.decisionApproachDetailsById ?? {}),
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

  const modalConfig = pendingCardId
    ? (() => {
        const method = methodById.get(pendingCardId);
        const alreadySelected = selectedIds.includes(pendingCardId);
        return {
          title: method?.label ?? da.confirmModal.title,
          description: method?.supportText ?? da.confirmModal.description,
          nextButtonText: alreadySelected
            ? da.removeApproach.nextButtonText
            : da.addApproach.nextButtonText,
        };
      })()
    : {
        title: da.confirmModal.title,
        description: da.confirmModal.description,
        nextButtonText: da.confirmModal.nextButtonText,
      };

  return (
    <>
    <CreateFlowTwoColumnSelectShell
      contentTopBelowMd="space-800"
      lgVerticalAlign="start"
      header={
        <div className="flex w-full min-w-0 flex-col gap-3">
          <HeaderLockup
            title={da.sidebar.title}
            description={sidebarDescription}
            size={mdUp ? "L" : "M"}
            justification={mdUp ? "left" : "center"}
          />
          <InfoMessageBox
            title={da.messageBox.title}
            items={messageBoxItems}
            checkedIds={messageBoxCheckedIds}
            onCheckboxChange={handleMessageBoxCheckboxChange}
          />
        </div>
      }
    >
      <div className="flex w-full min-w-0 flex-col items-stretch gap-6 py-0">
        <CardStack
          cards={sampleCards}
          selectedIds={selectedIds}
          onCardSelect={handleCardSelect}
          expanded={expanded}
          onToggleExpand={handleToggleExpand}
          hasMore={true}
          toggleLabel={da.cardStack.toggleSeeAll}
          showLessLabel={da.cardStack.toggleShowLess}
          title=""
          description={
            expanded ? (
              <>
                {da.cardStack.expandedStackDescriptionBefore}
                <InlineTextButton onClick={handleOpenAddWizard}>
                  {da.sidebar.descriptionLinkLabel}
                </InlineTextButton>
                {da.cardStack.expandedStackDescriptionAfter}
              </>
            ) : (
              ""
            )
          }
          layout="singleStack"
          compactRecommendedLimit={5}
          compactCardIds={compactCardIds}
          className="w-full"
          headerLockupSize={mdUp ? "L" : "M"}
        />
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
            <DecisionApproachEditFields
              key={pendingCardId}
              value={pendingDraft}
              onChange={handleDraftChange}
            />
          )
        ) : null}
      </Create>
    </CreateFlowTwoColumnSelectShell>
      <CustomMethodCardWizard
        isOpen={addCustomWizardOpen}
        onClose={handleCloseAddWizard}
        onFinalize={handleFinalizeCustomCard}
      />
    </>
  );
}
