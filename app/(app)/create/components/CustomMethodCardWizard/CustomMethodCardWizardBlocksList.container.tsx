"use client";

import { memo, useCallback, useState, type DragEvent } from "react";
import { reorderCustomMethodCardFieldBlocks } from "../../../../../lib/create/reorderCustomMethodCardFieldBlocks";
import { CustomMethodCardWizardBlocksListView } from "./CustomMethodCardWizardBlocksList.view";
import type { CustomMethodCardWizardBlocksListProps } from "./CustomMethodCardWizardBlocksList.types";

function CustomMethodCardWizardBlocksListContainerComponent({
  blocks,
  fieldTypeLabels,
  dragHandleAriaLabel,
  listLabel,
  onBlocksReorder,
}: CustomMethodCardWizardBlocksListProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const clearDragUi = useCallback(() => {
    setDraggingIndex(null);
    setOverIndex(null);
  }, []);

  const handleDragStart = useCallback(
    (index: number) => (e: DragEvent) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
      setDraggingIndex(index);
    },
    [],
  );

  const handleDragOver = useCallback((index: number) => {
    return (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setOverIndex(index);
    };
  }, []);

  const handleDrop = useCallback(
    (index: number) => (e: DragEvent) => {
      e.preventDefault();
      const from = Number.parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (Number.isNaN(from)) {
        clearDragUi();
        return;
      }
      onBlocksReorder(
        reorderCustomMethodCardFieldBlocks(blocks, from, index),
      );
      clearDragUi();
    },
    [blocks, clearDragUi, onBlocksReorder],
  );

  return (
    <CustomMethodCardWizardBlocksListView
      blocks={blocks}
      fieldTypeLabels={fieldTypeLabels}
      dragHandleAriaLabel={dragHandleAriaLabel}
      listLabel={listLabel}
      onBlocksReorder={onBlocksReorder}
      draggingIndex={draggingIndex}
      overIndex={overIndex}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={clearDragUi}
    />
  );
}

export const CustomMethodCardWizardBlocksList = memo(
  CustomMethodCardWizardBlocksListContainerComponent,
);
CustomMethodCardWizardBlocksList.displayName =
  "CustomMethodCardWizardBlocksList";
