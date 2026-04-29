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
import { MembershipMethodEditFields } from "../../components/methodEditFields";
import { membershipPresetFor } from "../../../../../lib/create/finalReviewChipPresets";
import type { MembershipMethodDetailEntry } from "../../types";

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

  const selectedIds = state.selectedMembershipMethodIds ?? [];

  const { scoresBySlug, hasAnyFacets } =
    useFacetRecommendations("membership");
  const rankedMethods = useMemo(
    () => rankMethodsByScore(mem.methods, scoresBySlug),
    [mem.methods, scoresBySlug],
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

  const title = expanded ? mem.page.expandedTitle : mem.page.compactTitle;

  const description = expanded ? (
    mem.page.expandedDescription
  ) : (
    <>
      {mem.page.compactDescriptionBefore}
      <InlineTextButton
        onClick={() => {
          markCreateFlowInteraction();
          setExpanded(true);
        }}
      >
        {mem.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {mem.page.compactDescriptionAfter}
    </>
  );

  const modalConfig = pendingCardId
    ? (() => {
        const method = methodById.get(pendingCardId);
        return {
          title: method?.label ?? mem.confirmModal.title,
          description: method?.supportText ?? mem.confirmModal.description,
          nextButtonText: mem.addPlatform.nextButtonText,
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
      selectedMembershipMethodIds: selectedIds.includes(pendingCardId)
        ? selectedIds
        : [...selectedIds, pendingCardId],
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
    state.membershipMethodDetailsById,
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
        onNext={handleCreateModalConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        nextButtonText={modalConfig.nextButtonText}
        showBackButton={false}
        backdropVariant="blurredYellow"
      >
        {pendingCardId && pendingDraft ? (
          <MembershipMethodEditFields
            key={pendingCardId}
            value={pendingDraft}
            onChange={handleDraftChange}
          />
        ) : null}
      </Create>
    </CreateFlowStepShell>
  );
}
