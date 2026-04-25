"use client";

/**
 * `conflict-management` step — Figma compact card stack (node `20879-15979`).
 * Registry: `CREATE_FLOW_SCREEN_REGISTRY["conflict-management"]`.
 *
 * Card click opens the Figma "Add Approach" create modal (node `20874-172292`)
 * with four controls rendered by {@link ConflictManagementEditFields}: Core
 * Principle, Applicable Scope (capsules), Process Protocol, and Restoration
 * & Fallbacks. The same field set is reused on `/create/final-review` — see
 * `FinalReviewChipEditModal`. Confirm persists both the chip selection and
 * any user edits as a `conflictManagementDetailsById[id]` override.
 */

import { useState, useCallback, useMemo } from "react";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import {
  deriveCompactCards,
  rankMethodsByScore,
  useFacetRecommendations,
} from "../../hooks/useFacetRecommendations";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import CardStack from "../../../../components/utility/CardStack";
import Create from "../../../../components/modals/Create";
import InlineTextButton from "../../../../components/buttons/InlineTextButton";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import {
  CREATE_FLOW_CARD_STACK_AREA_MAX_CLASS,
  CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS,
} from "../../components/createFlowLayoutTokens";
import { ConflictManagementEditFields } from "../../components/methodEditFields";
import { conflictManagementPresetFor } from "../../../../../lib/create/finalReviewChipPresets";
import type { ConflictManagementDetailEntry } from "../../types";

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

  const selectedIds = state.selectedConflictManagementIds ?? [];

  const { scoresBySlug, hasAnyFacets } =
    useFacetRecommendations("conflictManagement");
  const rankedMethods = useMemo(
    () => rankMethodsByScore(cm.methods, scoresBySlug),
    [cm.methods, scoresBySlug],
  );

  const { compactCardIds, recommendedIds } = useMemo(
    () => deriveCompactCards(rankedMethods, scoresBySlug, hasAnyFacets, 5),
    [rankedMethods, scoresBySlug, hasAnyFacets],
  );

  const sampleCards = useMemo(
    () =>
      rankedMethods.map((entry) => ({
        id: entry.id,
        label: entry.label,
        supportText: entry.supportText,
        recommended: recommendedIds.has(entry.id),
      })),
    [rankedMethods, recommendedIds],
  );

  const methodById = useMemo(
    () => new Map(rankedMethods.map((entry) => [entry.id, entry])),
    [rankedMethods],
  );

  const title = expanded ? cm.page.expandedTitle : cm.page.compactTitle;

  const description = expanded ? (
    cm.page.expandedDescription
  ) : (
    <>
      {cm.page.compactDescriptionBefore}
      <InlineTextButton
        onClick={() => {
          markCreateFlowInteraction();
          setExpanded(true);
        }}
      >
        {cm.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {cm.page.compactDescriptionAfter}
    </>
  );

  const modalConfig = pendingCardId
    ? (() => {
        const method = methodById.get(pendingCardId);
        return {
          title: method?.label ?? cm.confirmModal.title,
          description: method?.supportText ?? cm.confirmModal.description,
          nextButtonText: cm.addApproach.nextButtonText,
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

  const handleCreateModalClose = useCallback(() => {
    setCreateModalOpen(false);
    setPendingCardId(null);
    setPendingDraft(null);
  }, []);

  const handleCreateModalConfirm = useCallback(() => {
    if (!pendingCardId || !pendingDraft) {
      handleCreateModalClose();
      return;
    }
    markCreateFlowInteraction();
    updateState({
      selectedConflictManagementIds: selectedIds.includes(pendingCardId)
        ? selectedIds
        : [...selectedIds, pendingCardId],
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
    state.conflictManagementDetailsById,
    updateState,
  ]);

  return (
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
        onNext={handleCreateModalConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        nextButtonText={modalConfig.nextButtonText}
        showBackButton={false}
        backdropVariant="blurredYellow"
      >
        {pendingCardId && pendingDraft ? (
          <ConflictManagementEditFields
            key={pendingCardId}
            value={pendingDraft}
            onChange={handleDraftChange}
          />
        ) : null}
      </Create>
    </CreateFlowStepShell>
  );
}
