"use client";

import { memo, useCallback, useState } from "react";
import InfoMessageBoxView from "./InfoMessageBox.view";
import type { InfoMessageBoxProps } from "./InfoMessageBox.types";

/**
 * Figma: "Utility / InfoMessageBox"; canonical code under `controls/`.
 * Bordered message box that lists checkbox items under a title with optional
 * leading icon.
 */
const InfoMessageBoxContainer = memo<InfoMessageBoxProps>(
  ({
    title,
    items,
    icon,
    checkedIds: controlledCheckedIds,
    onCheckboxChange,
    className = "",
  }) => {
    const [internalCheckedIds, setInternalCheckedIds] = useState<string[]>([]);
    const checkedIds =
      controlledCheckedIds !== undefined
        ? controlledCheckedIds
        : internalCheckedIds;

    const handleGroupChange = useCallback(
      (newValue: string[]) => {
        if (controlledCheckedIds === undefined) {
          setInternalCheckedIds(newValue);
        }
        if (!onCheckboxChange) return;
        const prevSet = new Set(checkedIds);
        const newSet = new Set(newValue);
        items.forEach((item) => {
          const nowChecked = newSet.has(item.id);
          const wasChecked = prevSet.has(item.id);
          if (nowChecked !== wasChecked) {
            onCheckboxChange(item.id, nowChecked);
          }
        });
      },
      [checkedIds, controlledCheckedIds, items, onCheckboxChange],
    );

    return (
      <InfoMessageBoxView
        title={title}
        items={items}
        icon={icon}
        checkedIds={checkedIds}
        onGroupChange={handleGroupChange}
        className={className}
      />
    );
  },
);

InfoMessageBoxContainer.displayName = "InfoMessageBox";

export default InfoMessageBoxContainer;
