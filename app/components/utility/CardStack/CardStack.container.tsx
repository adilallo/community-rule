"use client";

import { memo, useCallback, useState } from "react";
import { CardStackView } from "./CardStack.view";
import type { CardStackProps } from "./CardStack.types";

const DEFAULT_TOGGLE_LABEL = "See all communication approaches";
const DEFAULT_SHOW_LESS_LABEL = "Show less";

const CardStackContainer = memo<CardStackProps>(
  ({
    cards,
    selectedId: controlledSelectedId,
    selectedIds: controlledSelectedIds,
    onCardSelect: controlledOnCardSelect,
    expanded: controlledExpanded,
    onToggleExpand: controlledOnToggleExpand,
    hasMore = true,
    toggleLabel = DEFAULT_TOGGLE_LABEL,
    showLessLabel = DEFAULT_SHOW_LESS_LABEL,
    title = "",
    description = "",
    layout = "default",
    headerLockupSize,
    className = "",
  }) => {
    const [internalExpanded, setInternalExpanded] = useState(false);
    const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(
      [],
    );

    const expanded =
      controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

    const handleToggleExpand = useCallback(() => {
      if (controlledOnToggleExpand) {
        controlledOnToggleExpand();
      } else {
        setInternalExpanded((prev) => !prev);
      }
    }, [controlledOnToggleExpand]);

    const selectedIds =
      controlledSelectedIds !== undefined
        ? controlledSelectedIds
        : controlledSelectedId !== undefined
          ? controlledSelectedId
            ? [controlledSelectedId]
            : []
          : internalSelectedIds;

    const handleCardSelect = useCallback(
      (id: string) => {
        if (controlledOnCardSelect) {
          controlledOnCardSelect(id);
        } else {
          setInternalSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
          );
        }
      },
      [controlledOnCardSelect],
    );

    return (
      <CardStackView
        cards={cards}
        selectedIds={selectedIds}
        onCardSelect={handleCardSelect}
        expanded={expanded}
        onToggleExpand={handleToggleExpand}
        hasMore={hasMore}
        toggleLabel={toggleLabel}
        showLessLabel={showLessLabel}
        title={title}
        description={description}
        layout={layout}
        headerLockupSize={headerLockupSize}
        className={className}
      />
    );
  },
);

CardStackContainer.displayName = "CardStack";

export default CardStackContainer;
