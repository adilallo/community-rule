"use client";

import { useState, useCallback, useMemo } from "react";
import { useMessages } from "../../contexts/MessagesContext";
import { useCreateFlow } from "../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../components/CreateFlowHeaderLockup";
import CardStack from "../../components/utility/CardStack";
import Create from "../../components/modals/Create";
import TextArea from "../../components/controls/TextArea";
import { CreateFlowStepShell } from "../components/CreateFlowStepShell";

const IN_PERSON_CARD_ID = "in-person-meetings";
const SIGNAL_CARD_ID = "signal";
const VIDEO_MEETINGS_CARD_ID = "video-meetings";

const ADD_PLATFORM_CARD_IDS = [
  IN_PERSON_CARD_ID,
  SIGNAL_CARD_ID,
  VIDEO_MEETINGS_CARD_ID,
] as const;

const SECTION_FIELDS = [
  "corePrinciple",
  "logisticsAdmin",
  "codeOfConduct",
] as const;
type SectionField = (typeof SECTION_FIELDS)[number];

const COMMUNICATION_CARD_ORDER = [
  IN_PERSON_CARD_ID,
  SIGNAL_CARD_ID,
  VIDEO_MEETINGS_CARD_ID,
  "4",
  "5",
  "6",
  "7",
] as const;

/**
 * Section with heading + info icon and an editable TextArea.
 * This variant uses TextArea only (no TextInput); design is "Add Signal" / "Add Video Meetings".
 */
function CreateModalSection({
  title,
  value: _value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (_value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold leading-tight text-[var(--color-content-default-primary)]">
          {title}
        </h3>
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--color-content-invert-brand-secondary)] bg-transparent text-[10px] font-medium leading-none text-[var(--color-content-invert-brand-secondary)]"
          aria-hidden
        >
          ?
        </span>
      </div>
      <TextArea
        formHeader={false}
        value={_value}
        onChange={(e) => onChange(e.target.value)}
        size="large"
        rows={6}
        appearance="embedded"
      />
    </div>
  );
}

/** Body for any "Add platform" modal: three editable sections (TextArea only). */
function AddPlatformModalContent({
  platformCardId,
}: {
  platformCardId: string;
}) {
  const { markCreateFlowInteraction } = useCreateFlow();
  const m = useMessages();
  const comm = m.create.communication;
  const modal = comm.modals[platformCardId as keyof typeof comm.modals];
  const defaults =
    modal && "sections" in modal
      ? modal.sections
      : {
          corePrinciple: "",
          logisticsAdmin: "",
          codeOfConduct: "",
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

  if (!modal || !("sections" in modal)) return null;

  return (
    <div className="flex flex-col gap-6">
      {SECTION_FIELDS.map((field) => (
        <CreateModalSection
          key={field}
          title={comm.sectionHeadings[field]}
          value={sectionValues[field]}
          onChange={(v) => updateSection(field, v)}
        />
      ))}
    </div>
  );
}

function isAddPlatformCard(cardId: string | null): boolean {
  return (
    cardId !== null &&
    (ADD_PLATFORM_CARD_IDS as readonly string[]).includes(cardId)
  );
}

/** Create flow card stack step: compact grid with optional expand to full list. */
export default function CardsPage() {
  const m = useMessages();
  const comm = m.create.communication;
  const mdUp = useCreateFlowMdUp();
  const { markCreateFlowInteraction } = useCreateFlow();
  const [expanded, setExpanded] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);

  const sampleCards = useMemo(
    () =>
      COMMUNICATION_CARD_ORDER.map((id) => {
        const row = comm.cards[id as keyof typeof comm.cards];
        return {
          id,
          label: row.label,
          supportText: row.supportText,
          recommended: true,
        };
      }),
    [comm],
  );

  const title = expanded ? comm.page.expandedTitle : comm.page.compactTitle;
  const description = expanded
    ? comm.page.expandedDescription
    : comm.page.compactDescription;

  const modalConfig =
    pendingCardId && pendingCardId in comm.modals
      ? (() => {
          const modal =
            comm.modals[pendingCardId as keyof typeof comm.modals];
          return {
            title: modal.title,
            description: modal.description,
            nextButtonText: comm.addPlatform.nextButtonText,
            showBackButton: false as const,
            currentStep: undefined,
            totalSteps: undefined,
          };
        })()
      : {
          title: comm.confirmModal.title,
          description: comm.confirmModal.description,
          nextButtonText: comm.confirmModal.nextButtonText,
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
      setSelectedIds((prev) =>
        prev.includes(pendingCardId) ? prev : [...prev, pendingCardId],
      );
    }
    setCreateModalOpen(false);
    setPendingCardId(null);
  }, [markCreateFlowInteraction, pendingCardId]);

  return (
    <CreateFlowStepShell
      variant="wideGridLoosePadding"
      contentTopBelowMd="space-800"
    >
      <div className="flex w-full min-w-0 flex-col gap-6">
        <div className="min-w-0">
          <CreateFlowHeaderLockup
            title={title}
            description={description}
            justification="center"
          />
        </div>
        <div className="min-w-0 w-full">
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
      >
        {isAddPlatformCard(pendingCardId) && pendingCardId ? (
          <AddPlatformModalContent
            key={pendingCardId}
            platformCardId={pendingCardId}
          />
        ) : null}
      </Create>
    </CreateFlowStepShell>
  );
}
