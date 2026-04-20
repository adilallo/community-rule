"use client";

/**
 * `communication-methods` step — Figma “Flow — Compact Card Stack” (node `20246-15828`).
 * Registry: `layoutKind: "card"` (`CREATE_FLOW_SCREEN_REGISTRY["communication-methods"]`).
 *
 * Lives under `screens/card/` (not `select/`): Figma **card stack** layout is a distinct shell from
 * two-column chip **select** frames. Future card-stack steps get their own `*Screen.tsx` here and
 * reuse `CardStack` / `CreateFlowStepShell` as needed.
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
import ModalTextAreaField from "../../components/ModalTextAreaField";

const SECTION_FIELDS = [
  "corePrinciple",
  "logisticsAdmin",
  "codeOfConduct",
] as const;
type SectionField = (typeof SECTION_FIELDS)[number];

function AddPlatformModalContent({
  platformCardId,
}: {
  platformCardId: string;
}) {
  const { markCreateFlowInteraction } = useCreateFlow();
  const m = useMessages();
  const comm = m.create.customRule.communication;
  const method = comm.methods.find((entry) => entry.id === platformCardId);
  const sections = method?.sections;
  const defaults: Record<SectionField, string> = {
    corePrinciple: sections?.corePrinciple ?? "",
    logisticsAdmin: sections?.logisticsAdmin ?? "",
    codeOfConduct: sections?.codeOfConduct ?? "",
  };

  const [sectionValues, setSectionValues] = useState<
    Record<SectionField, string>
  >(() => ({
    corePrinciple: defaults.corePrinciple,
    logisticsAdmin: defaults.logisticsAdmin,
    codeOfConduct: defaults.codeOfConduct,
  }));

  const updateSection = useCallback(
    (key: SectionField, value: string) => {
      markCreateFlowInteraction();
      setSectionValues((prev) => ({ ...prev, [key]: value }));
    },
    [markCreateFlowInteraction],
  );

  return (
    <div className="flex flex-col gap-6">
      {SECTION_FIELDS.map((field) => (
        <ModalTextAreaField
          key={field}
          label={comm.sectionHeadings[field]}
          rows={6}
          value={sectionValues[field]}
          onChange={(v) => updateSection(field, v)}
        />
      ))}
    </div>
  );
}

export function CommunicationMethodsScreen() {
  const m = useMessages();
  const comm = m.create.customRule.communication;
  const mdUp = useCreateFlowMdUp();
  const { state, updateState, markCreateFlowInteraction } = useCreateFlow();
  const [expanded, setExpanded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);

  const selectedIds = state.selectedCommunicationMethodIds ?? [];

  const setSelectedIds = useCallback(
    (next: string[]) => {
      updateState({ selectedCommunicationMethodIds: next });
    },
    [updateState],
  );

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

  const modalConfig = (() => {
    if (!pendingCardId) {
      return {
        title: comm.confirmModal.title,
        description: comm.confirmModal.description,
        nextButtonText: comm.confirmModal.nextButtonText,
        showBackButton: false as const,
        currentStep: undefined,
        totalSteps: undefined,
      };
    }

    const method = methodById.get(pendingCardId);
    return {
      title: method?.label ?? comm.confirmModal.title,
      description: method?.supportText ?? comm.confirmModal.description,
      nextButtonText: comm.addPlatform.nextButtonText,
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
        showBackButton={modalConfig.showBackButton}
        currentStep={modalConfig.currentStep}
        totalSteps={modalConfig.totalSteps}
        backdropVariant="loginYellow"
      >
        {pendingCardId ? (
          <AddPlatformModalContent
            key={pendingCardId}
            platformCardId={pendingCardId}
          />
        ) : null}
      </Create>
    </CreateFlowStepShell>
  );
}
