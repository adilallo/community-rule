"use client";

/**
 * `decision-approaches` step — Figma “Flow — Right Rail” (node `20523-23509`).
 * Registry: `CREATE_FLOW_SCREEN_REGISTRY["decision-approaches"]` (`layoutKind: "right-rail"`).
 *
 * Layout matches {@link CreateFlowTwoColumnSelectShell}: one column below `lg` (1024px), two columns
 * at `lg+` with a scrollable rail — same breakpoint and height chain as select steps, distinct content.
 */

import { useState, useCallback, useMemo } from "react";
import DecisionMakingSidebar from "../../../components/utility/DecisionMakingSidebar";
import CardStack from "../../../components/utility/CardStack";
import type { InfoMessageBoxItem } from "../../../components/utility/InfoMessageBox/InfoMessageBox.types";
import type { CardStackItem } from "../../../components/utility/CardStack/CardStack.types";
import { useMessages } from "../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { CreateFlowTwoColumnSelectShell } from "../../components/CreateFlowTwoColumnSelectShell";

export function RightRailScreen() {
  const m = useMessages();
  const rr = m.create.rightRail;
  const mdUp = useCreateFlowMdUp();
  const { state, updateState, markCreateFlowInteraction } = useCreateFlow();
  const [messageBoxCheckedIds, setMessageBoxCheckedIds] = useState<string[]>(
    [],
  );
  const [expanded, setExpanded] = useState(false);

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

  const sidebarDescription = (
    <>
      {rr.sidebar.descriptionBefore}
      <button
        type="button"
        className="cursor-pointer border-none bg-transparent p-0 font-inherit text-[length:inherit] leading-[inherit] text-[var(--color-content-default-tertiary)] underline decoration-solid underline-offset-2 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-invert-primary)]"
        onClick={() => {
          markCreateFlowInteraction();
          setExpanded(true);
        }}
      >
        {rr.sidebar.descriptionLinkLabel}
      </button>
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
      setSelectedIds(
        selectedIds.includes(id)
          ? selectedIds.filter((x) => x !== id)
          : [...selectedIds, id],
      );
    },
    [markCreateFlowInteraction, selectedIds, setSelectedIds],
  );

  const handleToggleExpand = useCallback(() => {
    markCreateFlowInteraction();
    setExpanded((prev) => !prev);
  }, [markCreateFlowInteraction]);

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
    </CreateFlowTwoColumnSelectShell>
  );
}
