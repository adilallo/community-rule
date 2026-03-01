"use client";

import { useState, useCallback } from "react";
import HeaderLockup from "../../components/type/HeaderLockup";
import CardStack from "../../components/utility/CardStack";
import Create from "../../components/modals/Create";
import TextArea from "../../components/controls/TextArea";

const COMPACT_TITLE = "How should this community communicate with each-other?";
const COMPACT_DESCRIPTION =
  "You can select multiple methods for different needs or add your own";
const EXPANDED_TITLE =
  "What method should this community use to communicate with eachother?";
const EXPANDED_DESCRIPTION = COMPACT_DESCRIPTION;

/** Create is a shell; which variant shows is determined by which card was clicked; we pass different props and children by pendingCardId. */

/** Card ids for "Add platform" Create modal variants. */
const IN_PERSON_CARD_ID = "in-person-meetings";
const SIGNAL_CARD_ID = "signal";
const VIDEO_MEETINGS_CARD_ID = "video-meetings";

/** Copy for the default confirm modal (non–add-platform cards). */
const CONFIRM_MODAL = {
  title: "Confirm selection",
  description: "Confirm to select this option.",
  nextButtonText: "Confirm",
  showBackButton: false,
  currentStep: undefined,
  totalSteps: undefined,
} as const;

/**
 * "Add platform" variants share the same header pattern and "Add Platform" button.
 * Each has its own title, description, and body (three TextArea sections).
 */
const ADD_PLATFORM_MODALS: Record<
  string,
  { title: string; description: string; nextButtonText: string }
> = {
  [IN_PERSON_CARD_ID]: {
    title: "In-Person Meetings",
    description:
      "Physical gatherings for high-bandwidth communication and relationship building.",
    nextButtonText: "Add Platform",
  },
  [SIGNAL_CARD_ID]: {
    title: "Signal",
    description:
      "End-to-end encrypted messaging ideal for small, security-minded groups",
    nextButtonText: "Add Platform",
  },
  [VIDEO_MEETINGS_CARD_ID]: {
    title: "Video Meetings",
    description: "Synchronous video calls for remote face-to-face interaction.",
    nextButtonText: "Add Platform",
  },
};

const SECTION_KEYS = [
  "Core Principle & Scope",
  "Logistics, Admin & Norms",
  "Code of Conduct",
] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

/** Default section text per platform (Figma 20647-18271, 20647-18273, 20736-12668). */
const ADD_PLATFORM_SECTION_DEFAULTS: Record<
  string,
  Record<SectionKey, string>
> = {
  [IN_PERSON_CARD_ID]: {
    "Core Principle & Scope": `We value the highest bandwidth of communication, physical presence, to build trust that digital tools cannot match. Consequently, we reserve this high-trust space for annual retreats, strategic planning, and high-stakes interpersonal repair where body language is essential.`,
    "Logistics, Admin & Norms": `Logistics focus on physical accessibility, venue security, and travel equity. Organizers control entry via keys or door staff. Culturally, participants are expected to maintain mission focus and adhere strictly to the itinerary to respect everyone's time. Side conversations or distracting behaviors that derail the agenda are discouraged.`,
    "Code of Conduct": `We aspire to operate within these principles. We don't need to see eye to eye on everything, but we believe the world can be improved by collective action. Aspire to do no harm to members of this community. Violence or physical intimidation will not be tolerated. We have a zero-tolerance policy for racism, sexism, and bigotry.`,
  },
  [SIGNAL_CARD_ID]: {
    "Core Principle & Scope": `We use Signal for all operational communication. To keep our workspace organized, official channels are prepended with an emoji (e.g., 🤓). Public channels are open to all volunteers, while Core Channels are restricted to coordinators. All Core Members are designated as admins to share the technical workload.`,
    "Logistics, Admin & Norms": `We encourage direct messages to build friendship, but all operational logistics must happen in group channels. To respect everyone's time, use "Emoji Reactions" (👍, ♥️) to acknowledge messages rather than typing "thanks," which triggers notifications for everyone. Text is a poor medium for nuance: if a conversation needs more context, move it to a call or in person.`,
    "Code of Conduct": `This space relies on collective responsibility. Posting content that attracts unwanted legal attention or exposes members' real-world identities without consent is prohibited. We aspire to do no harm by practicing strict operational security. Intentionally leaking information violates our safety. We have a zero-tolerance policy for harassment or abuse.`,
  },
  [VIDEO_MEETINGS_CARD_ID]: {
    "Core Principle & Scope": `We prioritize synchronous connection to read facial expressions without the barrier of travel, using this tool for weekly syncs and quick consensus checks that benefit from real-time debate before moving to a vote.`,
    "Logistics, Admin & Norms": `The host manages technical security via waiting rooms to prevent intrusion. Culturally, the focus is on maximizing the value of synchronous time. Norms include muting when not speaking, using the "Raise Hand" feature to queue, and utilizing the chat box for non-interruptive side comments. Distractions should be minimized.`,
    "Code of Conduct": `We have a zero-tolerance policy for racism, sexism, and bigotry, whether spoken or shared in the chat. We aspire to do no harm. "Zoom-bombing" or broadcasting graphic content is prohibited. Willfully spreading obviously false information will not be tolerated. Do not discuss sensitive data that could attract legal or security risk.`,
  },
};

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
  const defaults = ADD_PLATFORM_SECTION_DEFAULTS[platformCardId];
  const [sectionValues, setSectionValues] = useState<
    Record<SectionKey, string>
  >(
    defaults ?? {
      "Core Principle & Scope": "",
      "Logistics, Admin & Norms": "",
      "Code of Conduct": "",
    },
  );

  const updateSection = useCallback((key: SectionKey, value: string) => {
    setSectionValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  if (!defaults) return null;

  return (
    <div className="flex flex-col gap-6">
      {SECTION_KEYS.map((key) => (
        <CreateModalSection
          key={key}
          title={key}
          value={sectionValues[key]}
          onChange={(v) => updateSection(key, v)}
        />
      ))}
    </div>
  );
}

/** Communication method cards (Figma 20246-15828). First three are recommended. */
const SAMPLE_CARDS = [
  {
    id: IN_PERSON_CARD_ID,
    label: "In-Person Meetings",
    supportText:
      "Physical gatherings for high-bandwidth communication and relationship building.",
    recommended: true,
  },
  {
    id: SIGNAL_CARD_ID,
    label: "Signal",
    supportText: "Encrypted messaging for high-security, private coordination.",
    recommended: true,
  },
  {
    id: VIDEO_MEETINGS_CARD_ID,
    label: "Video Meetings",
    supportText: "Synchronous video calls for remote face-to-face interaction.",
    recommended: true,
  },
  {
    id: "4",
    label: "Label",
    supportText:
      "Collaborative work to reach a resolution that all parties can agree upon.",
    recommended: true,
  },
  {
    id: "5",
    label: "Label",
    supportText:
      "Structured sessions where parties collaboratively resolve disputes.",
    recommended: true,
  },
  {
    id: "6",
    label: "Label",
    supportText: "Members vote to resolve a dispute democratically.",
    recommended: true,
  },
  {
    id: "7",
    label: "Label",
    supportText: "Invite-only",
    recommended: true,
  },
];

/** Whether this card id uses the "Add platform" modal (shared header, platform-specific body). */
function isAddPlatformCard(cardId: string | null): cardId is string {
  return cardId !== null && cardId in ADD_PLATFORM_MODALS;
}

/** Resolve Create modal header/buttons: Add platform variant or default confirm. */
function getCreateModalConfig(pendingCardId: string | null) {
  if (isAddPlatformCard(pendingCardId)) {
    return {
      ...ADD_PLATFORM_MODALS[pendingCardId],
      showBackButton: false,
      currentStep: undefined,
      totalSteps: undefined,
    };
  }
  return CONFIRM_MODAL;
}

/** Create flow card stack step: compact grid with optional expand to full list. */
export default function CardsPage() {
  const [expanded, setExpanded] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);

  const title = expanded ? EXPANDED_TITLE : COMPACT_TITLE;
  const description = expanded ? EXPANDED_DESCRIPTION : COMPACT_DESCRIPTION;
  const modalConfig = getCreateModalConfig(pendingCardId);

  const handleCardClick = useCallback((id: string) => {
    setPendingCardId(id);
    setCreateModalOpen(true);
  }, []);

  const handleCreateModalClose = useCallback(() => {
    setCreateModalOpen(false);
    setPendingCardId(null);
  }, []);

  const handleCreateModalConfirm = useCallback(() => {
    if (pendingCardId) {
      setSelectedIds((prev) =>
        prev.includes(pendingCardId) ? prev : [...prev, pendingCardId],
      );
    }
    setCreateModalOpen(false);
    setPendingCardId(null);
  }, [pendingCardId]);

  return (
    <div className="w-full max-w-[1280px] shrink-0 px-5 md:px-16">
      <div className="flex w-full flex-col gap-6 min-w-0">
        <div className="min-w-0">
          <HeaderLockup
            title={title}
            description={description}
            justification="center"
            size="L"
          />
        </div>
        <div className="min-w-0 w-full">
          <CardStack
            cards={SAMPLE_CARDS}
            selectedIds={selectedIds}
            onCardSelect={handleCardClick}
            expanded={expanded}
            onToggleExpand={() => setExpanded((prev) => !prev)}
            hasMore={true}
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
        {isAddPlatformCard(pendingCardId) ? (
          <AddPlatformModalContent platformCardId={pendingCardId} />
        ) : null}
      </Create>
    </div>
  );
}
