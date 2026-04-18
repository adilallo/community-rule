"use client";

/**
 * `decision-approaches` step — Figma “Flow — Right Rail” (node `20523-23509`).
 * Registry: `CREATE_FLOW_SCREEN_REGISTRY["decision-approaches"]` (`layoutKind: "right-rail"`).
 *
 * Layout matches {@link CreateFlowTwoColumnSelectShell}: one column below `lg` (1024px), two columns
 * at `lg+` with a scrollable rail — same breakpoint and height chain as select steps, distinct content.
 *
 * Card click opens the Figma "Add Approach" create modal (node `20870-72155`) with five controls:
 * Core Principle, Applicable Scope, Step-by-Step Instructions, Consensus Level, and Objections &
 * Deadlocks. Section defaults are sourced from `messages/en/create/rightRail.json` and will be
 * replaced with DB-driven content; labels are hard-coded per the Figma design.
 */

import { useState, useCallback, useMemo } from "react";
import DecisionMakingSidebar from "../../../../components/utility/DecisionMakingSidebar";
import CardStack from "../../../../components/utility/CardStack";
import Create from "../../../../components/modals/Create";
import IncrementerBlock from "../../../../components/controls/IncrementerBlock";
import InlineTextButton from "../../../../components/buttons/InlineTextButton";
import type { InfoMessageBoxItem } from "../../../../components/utility/InfoMessageBox/InfoMessageBox.types";
import type { CardStackItem } from "../../../../components/utility/CardStack/CardStack.types";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { CreateFlowTwoColumnSelectShell } from "../../components/CreateFlowTwoColumnSelectShell";
import ModalTextAreaField from "../../components/ModalTextAreaField";
import ApplicableScopeField from "../../components/ApplicableScopeField";

const CONSENSUS_LEVEL_MIN = 0;
const CONSENSUS_LEVEL_MAX = 100;
const CONSENSUS_LEVEL_STEP = 5;
const CONSENSUS_LEVEL_DEFAULT = 75;

type RightRailModalSections = {
  corePrinciple: string;
  applicableScope: string[];
  selectedApplicableScope: string[];
  stepByStepInstructions: string;
  consensusLevel: number;
  objectionsDeadlocks: string;
};

function AddDecisionApproachModalContent({
  approachCardId,
}: {
  approachCardId: string;
}) {
  const { markCreateFlowInteraction } = useCreateFlow();
  const m = useMessages();
  const rr = m.create.rightRail;
  const modal =
    approachCardId in rr.modals
      ? rr.modals[approachCardId as keyof typeof rr.modals]
      : null;
  const modalSections = modal?.sections;
  const defaults: RightRailModalSections = {
    corePrinciple: modalSections?.corePrinciple ?? "",
    applicableScope: modalSections?.applicableScope ?? [],
    selectedApplicableScope: [],
    stepByStepInstructions: modalSections?.stepByStepInstructions ?? "",
    consensusLevel: modalSections?.consensusLevel ?? CONSENSUS_LEVEL_DEFAULT,
    objectionsDeadlocks: modalSections?.objectionsDeadlocks ?? "",
  };

  const [sections, setSections] = useState<RightRailModalSections>(() => ({
    corePrinciple: defaults.corePrinciple,
    applicableScope: [...defaults.applicableScope],
    selectedApplicableScope: [...defaults.selectedApplicableScope],
    stepByStepInstructions: defaults.stepByStepInstructions,
    consensusLevel: defaults.consensusLevel,
    objectionsDeadlocks: defaults.objectionsDeadlocks,
  }));

  const patch = useCallback(
    <K extends keyof RightRailModalSections>(
      key: K,
      value: RightRailModalSections[K],
    ) => {
      markCreateFlowInteraction();
      setSections((prev) => ({ ...prev, [key]: value }));
    },
    [markCreateFlowInteraction],
  );

  return (
    <div className="flex flex-col gap-6">
      <ModalTextAreaField
        label={rr.sectionHeadings.corePrinciple}
        value={sections.corePrinciple}
        onChange={(v) => patch("corePrinciple", v)}
      />
      <ApplicableScopeField
        label={rr.sectionHeadings.applicableScope}
        addLabel={rr.scopeAddButtonLabel}
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
        label={rr.sectionHeadings.stepByStepInstructions}
        value={sections.stepByStepInstructions}
        onChange={(v) => patch("stepByStepInstructions", v)}
      />
      <IncrementerBlock
        label={rr.sectionHeadings.consensusLevel}
        value={sections.consensusLevel}
        min={CONSENSUS_LEVEL_MIN}
        max={CONSENSUS_LEVEL_MAX}
        step={CONSENSUS_LEVEL_STEP}
        onChange={(next) => patch("consensusLevel", next)}
        formatValue={(v) => `${v}%`}
        decrementAriaLabel="Decrease consensus level"
        incrementAriaLabel="Increase consensus level"
      />
      <ModalTextAreaField
        label={rr.sectionHeadings.objectionsDeadlocks}
        value={sections.objectionsDeadlocks}
        onChange={(v) => patch("objectionsDeadlocks", v)}
      />
    </div>
  );
}

export function DecisionApproachesScreen() {
  const m = useMessages();
  const rr = m.create.rightRail;
  const mdUp = useCreateFlowMdUp();
  const { state, updateState, markCreateFlowInteraction } = useCreateFlow();
  const [messageBoxCheckedIds, setMessageBoxCheckedIds] = useState<string[]>(
    [],
  );
  const [expanded, setExpanded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);

  const selectedIds = state.selectedDecisionApproachIds ?? [];

  const setSelectedIds = useCallback(
    (next: string[]) => {
      updateState({ selectedDecisionApproachIds: next });
    },
    [updateState],
  );

  const messageBoxItems: InfoMessageBoxItem[] = useMemo(
    () =>
      rr.messageBox.items.map((item) => ({
        id: item.id,
        label: item.label,
      })),
    [rr.messageBox.items],
  );

  const sampleCards: CardStackItem[] = useMemo(
    () =>
      rr.cards.map((c) => ({
        id: c.id,
        label: c.label,
        supportText: c.supportText,
        recommended: c.recommended,
      })),
    [rr.cards],
  );

  const cardById = useMemo(
    () => new Map(rr.cards.map((c) => [c.id, c])),
    [rr.cards],
  );

  const sidebarDescription = (
    <>
      {rr.sidebar.descriptionBefore}
      <InlineTextButton
        onClick={() => {
          markCreateFlowInteraction();
          setExpanded(true);
        }}
      >
        {rr.sidebar.descriptionLinkLabel}
      </InlineTextButton>
      {rr.sidebar.descriptionAfter}
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

  const handleCardSelect = useCallback(
    (id: string) => {
      markCreateFlowInteraction();
      setPendingCardId(id);
      setCreateModalOpen(true);
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

  const modalConfig = (() => {
    if (!pendingCardId) {
      return {
        title: rr.confirmModal.title,
        description: rr.confirmModal.description,
        nextButtonText: rr.confirmModal.nextButtonText,
      };
    }

    if (pendingCardId in rr.modals) {
      const modal = rr.modals[pendingCardId as keyof typeof rr.modals];
      return {
        title: modal.title,
        description: modal.description,
        nextButtonText: rr.addApproach.nextButtonText,
      };
    }

    const card = cardById.get(pendingCardId);
    return {
      title: card?.label ?? rr.confirmModal.title,
      description: card?.supportText ?? rr.confirmModal.description,
      nextButtonText: rr.addApproach.nextButtonText,
    };
  })();

  return (
    <CreateFlowTwoColumnSelectShell
      contentTopBelowMd="space-800"
      lgVerticalAlign="start"
      header={
        <DecisionMakingSidebar
          title={rr.sidebar.title}
          description={sidebarDescription}
          messageBoxTitle={rr.messageBox.title}
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
          toggleLabel={rr.cardStack.toggleSeeAll}
          showLessLabel={rr.cardStack.toggleShowLess}
          title=""
          description=""
          layout="singleStack"
          compactRecommendedLimit={5}
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
        backdropVariant="loginYellow"
      >
        {pendingCardId ? (
          <AddDecisionApproachModalContent
            key={pendingCardId}
            approachCardId={pendingCardId}
          />
        ) : null}
      </Create>
    </CreateFlowTwoColumnSelectShell>
  );
}
