"use client";

import { useState, useCallback, useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import DecisionMakingSidebar from "../../components/utility/DecisionMakingSidebar";
import CardStack from "../../components/utility/CardStack";
import type { InfoMessageBoxItem } from "../../components/utility/InfoMessageBox/InfoMessageBox.types";
import type { CardStackItem } from "../../components/utility/CardStack/CardStack.types";

const SIDEBAR_TITLE = "How should conflicts be resolved?";

const SIDEBAR_DESCRIPTION = (
  <>
    You can also combine or <span className="underline">add</span> new
    approaches to the list
  </>
);

const MESSAGE_BOX_TITLE =
  "Consider defining approaches to steward key resources:";

const MESSAGE_BOX_ITEMS: InfoMessageBoxItem[] = [
  { id: "amend", label: "Amend your CommunityRule" },
  { id: "finances", label: "Steward finances" },
  { id: "project", label: "Project level decisions" },
  { id: "discipline", label: "Discipline and member termination" },
];

const SAMPLE_CARDS: CardStackItem[] = [
  {
    id: "mediation",
    label: "Mediation",
    supportText:
      "Collaborative work to reach a resolution that all parties can agree upon.",
    recommended: true,
  },
  {
    id: "facilitation",
    label: "Facilitated dialogue",
    supportText:
      "Structured sessions where parties collaboratively resolve disputes.",
    recommended: true,
  },
  {
    id: "invite-only",
    label: "Invite-only",
    supportText: "Private discussions with selected participants.",
    recommended: true,
  },
  {
    id: "arbitration",
    label: "Arbitration",
    supportText: "Arbitrators are chosen specifically for a particular case.",
    recommended: true,
  },
  {
    id: "direct-dialogue",
    label: "Direct dialogue",
    supportText:
      "Encouraging direct, respectful dialogue between those involved.",
    recommended: true,
  },
  // Extra cards to test scrolling (only visible when "See all" is expanded)
  { id: "label-1", label: "Label", supportText: "", recommended: false },
  { id: "label-2", label: "Label", supportText: "", recommended: false },
  { id: "label-3", label: "Label", supportText: "", recommended: false },
  { id: "label-4", label: "Label", supportText: "", recommended: false },
  { id: "label-5", label: "Label", supportText: "", recommended: false },
  { id: "label-6", label: "Label", supportText: "", recommended: false },
  { id: "label-7", label: "Label", supportText: "", recommended: false },
  { id: "label-8", label: "Label", supportText: "", recommended: false },
  { id: "label-9", label: "Label", supportText: "", recommended: false },
  { id: "label-10", label: "Label", supportText: "", recommended: false },
];

/**
 * Right Rail step of the create flow.
 * Two-column layout (sidebar + card stack) at 640+, single column at 320-639.
 */
export default function RightRailPage() {
  const [isMounted, setIsMounted] = useState(false);
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");
  const [messageBoxCheckedIds, setMessageBoxCheckedIds] = useState<string[]>(
    [],
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  // Avoid flash: only use breakpoint after mount so SSR and first paint use same layout (desktop).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer layout breakpoint until after mount to prevent flash
    setIsMounted(true);
  }, []);

  const showDesktopLayout = !isMounted || isMdOrLarger;

  const handleMessageBoxCheckboxChange = useCallback(
    (id: string, checked: boolean) => {
      setMessageBoxCheckedIds((prev) =>
        checked ? [...prev, id] : prev.filter((x) => x !== id),
      );
    },
    [],
  );

  const handleCardSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const handleToggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  if (showDesktopLayout) {
    return (
      <div className="w-full flex flex-col items-center px-5 md:px-12">
        <div className="flex gap-12 items-stretch w-full max-w-[1280px] min-w-0">
          <div className="flex flex-1 flex-col justify-center gap-3 min-w-0">
            <DecisionMakingSidebar
              title={SIDEBAR_TITLE}
              description={SIDEBAR_DESCRIPTION}
              messageBoxTitle={MESSAGE_BOX_TITLE}
              messageBoxItems={MESSAGE_BOX_ITEMS}
              messageBoxCheckedIds={messageBoxCheckedIds}
              onMessageBoxCheckboxChange={handleMessageBoxCheckboxChange}
              size="L"
              justification="left"
            />
          </div>
          <div className="flex flex-1 flex-col gap-6 items-center min-w-0">
            <CardStack
              cards={SAMPLE_CARDS}
              selectedIds={selectedIds}
              onCardSelect={handleCardSelect}
              expanded={expanded}
              onToggleExpand={handleToggleExpand}
              hasMore={true}
              toggleLabel="See all decision approaches"
              showLessLabel="Show less"
              title=""
              description=""
              layout="singleStack"
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center px-5">
      <div className="flex flex-col gap-6 w-full min-w-0">
        <DecisionMakingSidebar
          title={SIDEBAR_TITLE}
          description={SIDEBAR_DESCRIPTION}
          messageBoxTitle={MESSAGE_BOX_TITLE}
          messageBoxItems={MESSAGE_BOX_ITEMS}
          messageBoxCheckedIds={messageBoxCheckedIds}
          onMessageBoxCheckboxChange={handleMessageBoxCheckboxChange}
          size="M"
          justification="center"
        />
        <div className="flex flex-col gap-6 items-center w-full">
          <CardStack
            cards={SAMPLE_CARDS}
            selectedIds={selectedIds}
            onCardSelect={handleCardSelect}
            expanded={expanded}
            onToggleExpand={handleToggleExpand}
            hasMore={true}
            toggleLabel="See all decision approaches"
            showLessLabel="Show less"
            title=""
            description=""
            layout="singleStack"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
