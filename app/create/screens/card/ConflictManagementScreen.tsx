"use client";

/**
 * `conflict-management` step — Figma compact card stack (node `20879-15979`).
 * Registry: `CREATE_FLOW_SCREEN_REGISTRY["conflict-management"]`.
 */

import { useState, useCallback, useMemo } from "react";
import { useMessages } from "../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import CardStack from "../../../components/utility/CardStack";
import Create from "../../../components/modals/Create";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import {
  CREATE_FLOW_CARD_STACK_AREA_MAX_CLASS,
  CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS,
} from "../../components/createFlowLayoutTokens";

const CONFLICT_CARD_ORDER = [
  "peer-mediation",
  "conflict-resolution-council",
  "facilitated-negotiation",
  "ad-hoc-arbitration",
  "conflict-workshops",
  "6",
  "7",
  "8",
] as const;

export function ConflictManagementScreen() {
  const m = useMessages();
  const cm = m.create.conflictManagement;
  const mdUp = useCreateFlowMdUp();
  const { state, updateState, markCreateFlowInteraction } = useCreateFlow();
  const [expanded, setExpanded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);

  const selectedIds = state.selectedConflictManagementIds ?? [];

  const setSelectedIds = useCallback(
    (next: string[]) => {
      updateState({ selectedConflictManagementIds: next });
    },
    [updateState],
  );

  const sampleCards = useMemo(
    () =>
      CONFLICT_CARD_ORDER.map((id) => {
        const row = cm.cards[id as keyof typeof cm.cards];
        return {
          id,
          label: row.label,
          supportText: row.supportText,
          recommended: true,
        };
      }),
    [cm],
  );

  const title = expanded ? cm.page.expandedTitle : cm.page.compactTitle;

  const description = expanded ? (
    cm.page.expandedDescription
  ) : (
    <>
      {cm.page.compactDescriptionBefore}
      <button
        type="button"
        className="cursor-pointer border-none bg-transparent p-0 font-inherit text-[length:inherit] leading-[inherit] text-[var(--color-content-default-tertiary)] underline decoration-solid underline-offset-2 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-invert-primary)]"
        onClick={() => {
          markCreateFlowInteraction();
          setExpanded(true);
        }}
      >
        {cm.page.compactDescriptionLinkLabel}
      </button>
      {cm.page.compactDescriptionAfter}
    </>
  );

  const modalConfig =
    pendingCardId && pendingCardId in cm.modals
      ? (() => {
          const modal = cm.modals[pendingCardId as keyof typeof cm.modals];
          return {
            title: modal.title,
            description: modal.description,
            nextButtonText: cm.confirmModal.nextButtonText,
            showBackButton: false as const,
            currentStep: undefined,
            totalSteps: undefined,
          };
        })()
      : {
          title: cm.confirmModal.title,
          description: cm.confirmModal.description,
          nextButtonText: cm.confirmModal.nextButtonText,
          showBackButton: false as const,
          currentStep: undefined,
          totalSteps: undefined,
        };

  const handleCardClick = useCallback(
    (id: string) => {
      markCreateFlowInteraction();
      setPendingCardId(id);
      setCreateModalOpen(true);
    },
    [markCreateFlowInteraction],
  );

  const handleCreateModalClose = useCallback(() => {
    setCreateModalOpen(false);
    setPendingCardId(null);
  }, []);

  const handleCreateModalConfirm = useCallback(() => {
    markCreateFlowInteraction();
    if (pendingCardId) {
      setSelectedIds(
        selectedIds.includes(pendingCardId)
          ? selectedIds
          : [...selectedIds, pendingCardId],
      );
    }
    setCreateModalOpen(false);
    setPendingCardId(null);
  }, [markCreateFlowInteraction, pendingCardId, selectedIds, setSelectedIds]);

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
        showBackButton={modalConfig.showBackButton}
        currentStep={modalConfig.currentStep}
        totalSteps={modalConfig.totalSteps}
      />
    </CreateFlowStepShell>
  );
}
