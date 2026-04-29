"use client";

/**
 * `communication-methods` step — Figma “Flow — Compact Card Stack” (node `20246-15828`).
 * Registry: `layoutKind: "card"` (`CREATE_FLOW_SCREEN_REGISTRY["communication-methods"]`).
 *
 * Lives under `screens/card/` (not `select/`): Figma **card stack** layout is a distinct shell from
 * two-column chip **select** frames. Future card-stack steps get their own `*Screen.tsx` here and
 * reuse `CardStack` / `CreateFlowStepShell` as needed.
 *
 * Card click opens the Figma "Add Platform" create modal (node `20246-15829`) with three
 * editable sections rendered by {@link CommunicationMethodEditFields}. The same field set is
 * reused on `/create/final-review` — see `FinalReviewChipEditModal`. Confirm persists both
 * the chip selection and any user edits as a `communicationMethodDetailsById[id]` override.
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
import CardStack from "../../../../components/cards/CardStack";
import Create from "../../../../components/modals/Create";
import InlineTextButton from "../../../../components/buttons/InlineTextButton";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import {
  CREATE_FLOW_CARD_STACK_AREA_MAX_CLASS,
  CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS,
} from "../../components/createFlowLayoutTokens";
import { CommunicationMethodEditFields } from "../../components/methodEditFields";
import { communicationPresetFor } from "../../../../../lib/create/finalReviewChipPresets";
import type { CommunicationMethodDetailEntry } from "../../types";

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

  const selectedIds = state.selectedCommunicationMethodIds ?? [];

  const { scoresBySlug, hasAnyFacets } =
    useFacetRecommendations("communication");
  const rankedMethods = useMemo(
    () => rankMethodsByScore(comm.methods, scoresBySlug),
    [comm.methods, scoresBySlug],
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

  const title = expanded ? comm.page.expandedTitle : comm.page.compactTitle;

  const description = expanded ? (
    comm.page.expandedDescription
  ) : (
    <>
      {comm.page.compactDescriptionBefore}
      <InlineTextButton
        onClick={() => {
          markCreateFlowInteraction();
          setExpanded(true);
        }}
      >
        {comm.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {comm.page.compactDescriptionAfter}
    </>
  );

  const modalConfig = pendingCardId
    ? (() => {
        const method = methodById.get(pendingCardId);
        return {
          title: method?.label ?? comm.confirmModal.title,
          description: method?.supportText ?? comm.confirmModal.description,
          nextButtonText: comm.addPlatform.nextButtonText,
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
      selectedCommunicationMethodIds: selectedIds.includes(pendingCardId)
        ? selectedIds
        : [...selectedIds, pendingCardId],
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
    state.communicationMethodDetailsById,
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
        onNext={handleCreateModalConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        nextButtonText={modalConfig.nextButtonText}
        showBackButton={false}
        backdropVariant="blurredYellow"
      >
        {pendingCardId && pendingDraft ? (
          <CommunicationMethodEditFields
            key={pendingCardId}
            value={pendingDraft}
            onChange={handleDraftChange}
          />
        ) : null}
      </Create>
    </CreateFlowStepShell>
  );
}
