"use client";

/**
 * `membership-methods` step — Figma compact card stack (node `20858-13947`).
 * Registry: `CREATE_FLOW_SCREEN_REGISTRY["membership-methods"]`.
 *
 * Card click opens the Figma create modal (node `20858-13948`) with three
 * editable sections — Eligibility & Philosophy, Joining Process, and
 * Expectations & Removal. Section defaults come from
 * `messages/en/create/membership.json` and will be replaced with DB-driven
 * content.
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

const SECTION_FIELDS = [
  "eligibility",
  "joiningProcess",
  "expectations",
] as const;
type SectionField = (typeof SECTION_FIELDS)[number];

const MEMBERSHIP_CARD_ORDER = [
  "open-access",
  "orientation-required",
  "invitation-only",
  "contribution-based",
  "mentorship",
  "6",
  "7",
  "8",
] as const;

function AddMembershipModalContent({
  membershipCardId,
}: {
  membershipCardId: string;
}) {
  const { markCreateFlowInteraction } = useCreateFlow();
  const m = useMessages();
  const mem = m.create.membership;
  const modal =
    membershipCardId in mem.modals
      ? mem.modals[membershipCardId as keyof typeof mem.modals]
      : null;
  const defaults = modal?.sections ?? {
    eligibility: "",
    joiningProcess: "",
    expectations: "",
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
  const mem = m.create.membership;
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

  const sampleCards = useMemo(
    () =>
      MEMBERSHIP_CARD_ORDER.map((id) => {
        const row = mem.cards[id as keyof typeof mem.cards];
        return {
          id,
          label: row.label,
          supportText: row.supportText,
          recommended: true,
        };
      }),
    [mem],
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

    if (pendingCardId in mem.modals) {
      const modal = mem.modals[pendingCardId as keyof typeof mem.modals];
      return {
        title: modal.title,
        description: modal.description,
        nextButtonText: mem.addPlatform.nextButtonText,
        showBackButton: false as const,
        currentStep: undefined,
        totalSteps: undefined,
      };
    }

    const cardRow =
      pendingCardId in mem.cards
        ? mem.cards[pendingCardId as keyof typeof mem.cards]
        : null;
    return {
      title: cardRow?.label ?? mem.confirmModal.title,
      description: cardRow?.supportText ?? mem.confirmModal.description,
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
