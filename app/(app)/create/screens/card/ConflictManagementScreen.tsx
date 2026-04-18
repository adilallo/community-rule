"use client";

/**
 * `conflict-management` step — Figma compact card stack (node `20879-15979`).
 * Registry: `CREATE_FLOW_SCREEN_REGISTRY["conflict-management"]`.
 *
 * Card click opens the Figma "Add Approach" create modal (node `20874-172292`) with four
 * controls: Core Principle, Applicable Scope (capsules), Process Protocol, and Restoration
 * & Fallbacks. Section defaults are sourced from
 * `messages/en/create/conflictManagement.json` and will be replaced with DB-driven
 * content; labels are hard-coded per the Figma design.
 */

import { useState, useCallback, useMemo } from "react";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import CardStack from "../../../../components/utility/CardStack";
import Create from "../../../../components/modals/Create";
import InlineTextButton from "../../../../components/buttons/InlineTextButton";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import {
  CREATE_FLOW_CARD_STACK_AREA_MAX_CLASS,
  CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS,
} from "../../components/createFlowLayoutTokens";
import ModalTextAreaField from "../../components/ModalTextAreaField";
import ApplicableScopeField from "../../components/ApplicableScopeField";

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

type ConflictModalSections = {
  corePrinciple: string;
  applicableScope: string[];
  selectedApplicableScope: string[];
  processProtocol: string;
  restorationFallbacks: string;
};

function AddConflictApproachModalContent({
  approachCardId,
}: {
  approachCardId: string;
}) {
  const { markCreateFlowInteraction } = useCreateFlow();
  const m = useMessages();
  const cm = m.create.conflictManagement;
  const modal =
    approachCardId in cm.modals
      ? cm.modals[approachCardId as keyof typeof cm.modals]
      : null;
  const modalSections = modal?.sections;
  const defaults: ConflictModalSections = {
    corePrinciple: modalSections?.corePrinciple ?? "",
    applicableScope: modalSections?.applicableScope ?? [],
    selectedApplicableScope: [],
    processProtocol: modalSections?.processProtocol ?? "",
    restorationFallbacks: modalSections?.restorationFallbacks ?? "",
  };

  const [sections, setSections] = useState<ConflictModalSections>(() => ({
    corePrinciple: defaults.corePrinciple,
    applicableScope: [...defaults.applicableScope],
    selectedApplicableScope: [...defaults.selectedApplicableScope],
    processProtocol: defaults.processProtocol,
    restorationFallbacks: defaults.restorationFallbacks,
  }));

  const patch = useCallback(
    <K extends keyof ConflictModalSections>(
      key: K,
      value: ConflictModalSections[K],
    ) => {
      markCreateFlowInteraction();
      setSections((prev) => ({ ...prev, [key]: value }));
    },
    [markCreateFlowInteraction],
  );

  return (
    <div className="flex flex-col gap-6">
      <ModalTextAreaField
        label={cm.sectionHeadings.corePrinciple}
        value={sections.corePrinciple}
        onChange={(v) => patch("corePrinciple", v)}
      />
      <ApplicableScopeField
        label={cm.sectionHeadings.applicableScope}
        addLabel={cm.scopeAddButtonLabel}
        scopes={sections.applicableScope}
        selectedScopes={sections.selectedApplicableScope}
        onToggleScope={(scope) =>
          patch(
            "selectedApplicableScope",
            sections.selectedApplicableScope.includes(scope)
              ? sections.selectedApplicableScope.filter((s) => s !== scope)
              : [...sections.selectedApplicableScope, scope],
          )
        }
        onAddScope={(scope) =>
          patch("applicableScope", [...sections.applicableScope, scope])
        }
      />
      <ModalTextAreaField
        label={cm.sectionHeadings.processProtocol}
        value={sections.processProtocol}
        onChange={(v) => patch("processProtocol", v)}
      />
      <ModalTextAreaField
        label={cm.sectionHeadings.restorationFallbacks}
        value={sections.restorationFallbacks}
        onChange={(v) => patch("restorationFallbacks", v)}
      />
    </div>
  );
}

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

  const modalConfig = (() => {
    if (!pendingCardId) {
      return {
        title: cm.confirmModal.title,
        description: cm.confirmModal.description,
        nextButtonText: cm.confirmModal.nextButtonText,
        showBackButton: false as const,
        currentStep: undefined,
        totalSteps: undefined,
      };
    }

    if (pendingCardId in cm.modals) {
      const modal = cm.modals[pendingCardId as keyof typeof cm.modals];
      return {
        title: modal.title,
        description: modal.description,
        nextButtonText: cm.addApproach.nextButtonText,
        showBackButton: false as const,
        currentStep: undefined,
        totalSteps: undefined,
      };
    }

    const cardRow =
      pendingCardId in cm.cards
        ? cm.cards[pendingCardId as keyof typeof cm.cards]
        : null;
    return {
      title: cardRow?.label ?? cm.confirmModal.title,
      description: cardRow?.supportText ?? cm.confirmModal.description,
      nextButtonText: cm.addApproach.nextButtonText,
      showBackButton: false as const,
      currentStep: undefined,
      totalSteps: undefined,
    };
  })();

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
        backdropVariant="loginYellow"
      >
        {pendingCardId ? (
          <AddConflictApproachModalContent
            key={pendingCardId}
            approachCardId={pendingCardId}
          />
        ) : null}
      </Create>
    </CreateFlowStepShell>
  );
}
