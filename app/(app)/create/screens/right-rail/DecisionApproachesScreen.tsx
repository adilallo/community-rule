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
 * Deadlocks. Section defaults are sourced from `messages/en/create/customRule/decisionApproaches.json` (read
 * via `m.create.customRule.decisionApproaches`) and will be replaced with DB-driven content; labels are
 * hard-coded per the Figma design.
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
import {
  deriveCompactCards,
  rankMethodsByScore,
  useFacetRecommendations,
} from "../../hooks/useFacetRecommendations";
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
  const da = m.create.customRule.decisionApproaches;
  const method = da.methods.find((entry) => entry.id === approachCardId);
  const modalSections = method?.sections;
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
        label={da.sectionHeadings.corePrinciple}
        value={sections.corePrinciple}
        onChange={(v) => patch("corePrinciple", v)}
      />
      <ApplicableScopeField
        label={da.sectionHeadings.applicableScope}
        addLabel={da.scopeAddButtonLabel}
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
        label={da.sectionHeadings.stepByStepInstructions}
        value={sections.stepByStepInstructions}
        onChange={(v) => patch("stepByStepInstructions", v)}
      />
      <IncrementerBlock
        label={da.sectionHeadings.consensusLevel}
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
        label={da.sectionHeadings.objectionsDeadlocks}
        value={sections.objectionsDeadlocks}
        onChange={(v) => patch("objectionsDeadlocks", v)}
      />
    </div>
  );
}

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

  const selectedIds = state.selectedDecisionApproachIds ?? [];

  const setSelectedIds = useCallback(
    (next: string[]) => {
      updateState({ selectedDecisionApproachIds: next });
    },
    [updateState],
  );

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
        title: da.confirmModal.title,
        description: da.confirmModal.description,
        nextButtonText: da.confirmModal.nextButtonText,
      };
    }

    const method = methodById.get(pendingCardId);
    return {
      title: method?.label ?? da.confirmModal.title,
      description: method?.supportText ?? da.confirmModal.description,
      nextButtonText: da.addApproach.nextButtonText,
    };
  })();

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
