"use client";

/**
 * `membership-methods` step — Figma compact card stack (node `20858-13947`).
 * Registry: `CREATE_FLOW_SCREEN_REGISTRY["membership-methods"]`.
 *
 * Card click opens the Figma create modal (node `20858-13948`) with three
 * editable sections — Eligibility & Philosophy, Joining Process, and
 * Expectations & Removal. Section defaults come from
 * `messages/en/create/customRule/membership.json` and will be replaced with DB-driven
 * content.
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
  "eligibility",
  "joiningProcess",
  "expectations",
] as const;
type SectionField = (typeof SECTION_FIELDS)[number];

function AddMembershipModalContent({
  membershipCardId,
}: {
  membershipCardId: string;
}) {
  const { markCreateFlowInteraction } = useCreateFlow();
  const m = useMessages();
  const mem = m.create.customRule.membership;
  const method = mem.methods.find((entry) => entry.id === membershipCardId);
  const sections = method?.sections;
  const defaults: Record<SectionField, string> = {
    eligibility: sections?.eligibility ?? "",
    joiningProcess: sections?.joiningProcess ?? "",
    expectations: sections?.expectations ?? "",
  };

  const [sectionValues, setSectionValues] = useState<
    Record<SectionField, string>
  >(() => ({
    eligibility: defaults.eligibility,
    joiningProcess: defaults.joiningProcess,
    expectations: defaults.expectations,
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
          label={mem.sectionHeadings[field]}
          rows={6}
          value={sectionValues[field]}
          onChange={(v) => updateSection(field, v)}
        />
      ))}
    </div>
  );
}

export function MembershipMethodsScreen() {
  const m = useMessages();
  const mem = m.create.customRule.membership;
  const mdUp = useCreateFlowMdUp();
  const { state, updateState, markCreateFlowInteraction } = useCreateFlow();
  const [expanded, setExpanded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);

  const selectedIds = state.selectedMembershipMethodIds ?? [];

  const setSelectedIds = useCallback(
    (next: string[]) => {
      updateState({ selectedMembershipMethodIds: next });
    },
    [updateState],
  );

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

  const modalConfig = (() => {
    if (!pendingCardId) {
      return {
        title: mem.confirmModal.title,
        description: mem.confirmModal.description,
        nextButtonText: mem.confirmModal.nextButtonText,
        showBackButton: false as const,
        currentStep: undefined,
        totalSteps: undefined,
      };
    }

    const method = methodById.get(pendingCardId);
    return {
      title: method?.label ?? mem.confirmModal.title,
      description: method?.supportText ?? mem.confirmModal.description,
      nextButtonText: mem.addPlatform.nextButtonText,
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
        showBackButton={modalConfig.showBackButton}
        currentStep={modalConfig.currentStep}
        totalSteps={modalConfig.totalSteps}
        backdropVariant="loginYellow"
      >
        {pendingCardId ? (
          <AddMembershipModalContent
            key={pendingCardId}
            membershipCardId={pendingCardId}
          />
        ) : null}
      </Create>
    </CreateFlowStepShell>
  );
}
