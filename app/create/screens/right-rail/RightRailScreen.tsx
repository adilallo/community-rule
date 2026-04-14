"use client";

import { useState, useCallback, useMemo } from "react";
import DecisionMakingSidebar from "../../../components/utility/DecisionMakingSidebar";
import CardStack from "../../../components/utility/CardStack";
import type { InfoMessageBoxItem } from "../../../components/utility/InfoMessageBox/InfoMessageBox.types";
import type { CardStackItem } from "../../../components/utility/CardStack/CardStack.types";
import { useMessages } from "../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import {
  CREATE_FLOW_MD_UP_GRID_CELL_CLASS,
  CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS,
} from "../../components/createFlowLayoutTokens";

export function RightRailScreen() {
  const m = useMessages();
  const rr = m.create.rightRail;
  const mdUp = useCreateFlowMdUp();
  const { markCreateFlowInteraction } = useCreateFlow();
  const [messageBoxCheckedIds, setMessageBoxCheckedIds] = useState<string[]>(
    [],
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

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
      <span className="underline">{rr.sidebar.descriptionLink}</span>
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
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    },
    [markCreateFlowInteraction],
  );

  const handleToggleExpand = useCallback(() => {
    markCreateFlowInteraction();
    setExpanded((prev) => !prev);
  }, [markCreateFlowInteraction]);

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden md:h-full">
      <div className="flex min-h-0 flex-1 overflow-hidden px-5 max-md:overflow-y-auto md:px-12">
        <div
          className={`mx-auto grid h-auto min-h-0 w-full shrink-0 grid-cols-1 gap-6 min-w-0 max-md:pt-[var(--space-800)] max-md:pb-8 md:h-full md:grid-cols-2 md:justify-items-center md:gap-12 md:pb-8 ${CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS}`}
        >
          <div
            className={`flex flex-col items-stretch justify-start overflow-hidden md:justify-center ${CREATE_FLOW_MD_UP_GRID_CELL_CLASS}`}
          >
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
          </div>
          <div
            className={`scrollbar-hide relative flex min-h-0 flex-col overflow-x-hidden max-md:overflow-visible md:overflow-y-auto ${CREATE_FLOW_MD_UP_GRID_CELL_CLASS}`}
          >
            <div className="flex w-full min-w-0 flex-col items-center gap-6 py-0 md:pb-8">
              <CardStack
                cards={sampleCards}
                selectedIds={selectedIds}
                onCardSelect={handleCardSelect}
                expanded={expanded}
                onToggleExpand={handleToggleExpand}
                hasMore={true}
                toggleLabel={rr.cardStack.toggleSeeAll}
                showLessLabel={rr.cardStack.toggleShowLess}
                title={rr.cardStack.emptyTitle}
                description={rr.cardStack.emptyDescription}
                layout="singleStack"
                className="w-full"
                headerLockupSize={mdUp ? "L" : "M"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
