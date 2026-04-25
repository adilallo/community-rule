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
import DecisionMakingSidebar from "../../../../components/utility/DecisionMakingSidebar";
import CardStack from "../../../../components/utility/CardStack";
import Create from "../../../../components/modals/Create";
import InlineTextButton from "../../../../components/buttons/InlineTextButton";
import type { InfoMessageBoxItem } from "../../../../components/utility/InfoMessageBox/InfoMessageBox.types";
import type { CardStackItem } from "../../../../components/utility/CardStack/CardStack.types";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import {
  deriveCompactCards,
  rankMethodsByScore,
  useFacetRecommendations,
} from "../../hooks/useFacetRecommendations";
import { CreateFlowTwoColumnSelectShell } from "../../components/CreateFlowTwoColumnSelectShell";
import { DecisionApproachEditFields } from "../../components/methodEditFields";
import { decisionApproachPresetFor } from "../../../../../lib/create/finalReviewChipPresets";
import type { DecisionApproachDetailEntry } from "../../types";

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

  const selectedIds = state.selectedDecisionApproachIds ?? [];

  const messageBoxItems: InfoMessageBoxItem[] = useMemo(
    () =>
      da.messageBox.items.map((item) => ({
        id: item.id,
        label: item.label,
      })),
    [da.messageBox.items],
  );

  const { scoresBySlug, hasAnyFacets } =
    useFacetRecommendations("decisionApproaches");
  const rankedMethods = useMemo(
    () => rankMethodsByScore(da.methods, scoresBySlug),
    [da.methods, scoresBySlug],
  );

  const { compactCardIds, recommendedIds } = useMemo(
    () => deriveCompactCards(rankedMethods, scoresBySlug, hasAnyFacets, 5),
    [rankedMethods, scoresBySlug, hasAnyFacets],
  );

  const sampleCards: CardStackItem[] = useMemo(
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

  const sidebarDescription = (
    <>
      {da.sidebar.descriptionBefore}
      <InlineTextButton
        onClick={() => {
          markCreateFlowInteraction();
          setExpanded(true);
        }}
      >
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

  const handleToggleExpand = useCallback(() => {
    markCreateFlowInteraction();
    setExpanded((prev) => !prev);
  }, [markCreateFlowInteraction]);

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
      selectedDecisionApproachIds: selectedIds.includes(pendingCardId)
        ? selectedIds
        : [...selectedIds, pendingCardId],
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
    state.decisionApproachDetailsById,
    updateState,
  ]);

  const modalConfig = pendingCardId
    ? (() => {
        const method = methodById.get(pendingCardId);
        return {
          title: method?.label ?? da.confirmModal.title,
          description: method?.supportText ?? da.confirmModal.description,
          nextButtonText: da.addApproach.nextButtonText,
        };
      })()
    : {
        title: da.confirmModal.title,
        description: da.confirmModal.description,
        nextButtonText: da.confirmModal.nextButtonText,
      };

  return (
    <CreateFlowTwoColumnSelectShell
      contentTopBelowMd="space-800"
      lgVerticalAlign="start"
      header={
        <DecisionMakingSidebar
          title={da.sidebar.title}
          description={sidebarDescription}
          messageBoxTitle={da.messageBox.title}
          messageBoxItems={messageBoxItems}
          messageBoxCheckedIds={messageBoxCheckedIds}
          onMessageBoxCheckboxChange={handleMessageBoxCheckboxChange}
          size={mdUp ? "L" : "M"}
          justification={mdUp ? "left" : "center"}
        />
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
          description=""
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
        onNext={handleCreateModalConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        nextButtonText={modalConfig.nextButtonText}
        showBackButton={false}
        backdropVariant="blurredYellow"
      >
        {pendingCardId && pendingDraft ? (
          <DecisionApproachEditFields
            key={pendingCardId}
            value={pendingDraft}
            onChange={handleDraftChange}
          />
        ) : null}
      </Create>
    </CreateFlowTwoColumnSelectShell>
  );
}
