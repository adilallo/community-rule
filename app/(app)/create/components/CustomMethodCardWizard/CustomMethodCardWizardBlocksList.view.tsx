"use client";

import { memo } from "react";
import Icon from "../../../../components/asset/icon";
import { ADD_CUSTOM_FIELD_TYPE_ICONS } from "../../../../components/controls/AddCustomField/AddCustomField.types";
import type { AddCustomFieldType } from "../../../../components/controls/AddCustomField/AddCustomField.types";
import type { CustomMethodCardWizardBlocksListViewProps } from "./CustomMethodCardWizardBlocksList.types";

function DragHandleGlyph({ className }: { className?: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx={4} cy={4} r={1.25} fill="currentColor" />
      <circle cx={12} cy={4} r={1.25} fill="currentColor" />
      <circle cx={4} cy={8} r={1.25} fill="currentColor" />
      <circle cx={12} cy={8} r={1.25} fill="currentColor" />
      <circle cx={4} cy={12} r={1.25} fill="currentColor" />
      <circle cx={12} cy={12} r={1.25} fill="currentColor" />
    </svg>
  );
}

function CustomMethodCardWizardBlocksListViewComponent({
  blocks,
  fieldTypeLabels,
  dragHandleAriaLabel,
  listLabel,
  draggingIndex,
  overIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: CustomMethodCardWizardBlocksListViewProps) {
  return (
    <ul className="flex list-none flex-col gap-2 p-0" aria-label={listLabel}>
      {blocks.map((block, index) => {
        const kind = block.kind as AddCustomFieldType;
        const typeLabel = fieldTypeLabels[kind];
        const isOver = overIndex === index && draggingIndex !== index;
        return (
          <li
            key={block.id}
            className={`flex min-h-[52px] items-stretch gap-2 rounded-[var(--measures-radius-medium,8px)] border border-[var(--color-border-default-primary)] bg-[var(--color-surface-default-secondary)] pl-1 pr-3 py-2 transition-shadow ${
              isOver
                ? "ring-2 ring-[var(--color-border-invert-primary)] ring-offset-2 ring-offset-[var(--color-surface-default-primary)]"
                : ""
            } ${draggingIndex === index ? "opacity-60" : ""}`}
            onDragOver={onDragOver(index)}
            onDrop={onDrop(index)}
          >
            <button
              type="button"
              draggable
              onDragStart={onDragStart(index)}
              onDragEnd={onDragEnd}
              className="flex shrink-0 cursor-grab touch-manipulation items-center justify-center rounded-[var(--measures-radius-200,8px)] border-0 bg-transparent px-1 text-[var(--color-content-default-secondary)] active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-invert-primary)]"
              aria-label={dragHandleAriaLabel}
            >
              <DragHandleGlyph />
            </button>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center self-center">
              <Icon
                name={ADD_CUSTOM_FIELD_TYPE_ICONS[kind]}
                size={24}
                className="text-[var(--color-content-default-brand-primary,#fefcc9)]"
              />
            </span>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
              <span className="truncate font-inter text-[14px] font-medium leading-[18px] text-[var(--color-content-default-primary)]">
                {block.blockTitle.trim() || typeLabel}
              </span>
              <span className="font-inter text-[12px] leading-4 text-[var(--color-content-default-secondary)]">
                {typeLabel}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export const CustomMethodCardWizardBlocksListView = memo(
  CustomMethodCardWizardBlocksListViewComponent,
);
CustomMethodCardWizardBlocksListView.displayName =
  "CustomMethodCardWizardBlocksListView";
