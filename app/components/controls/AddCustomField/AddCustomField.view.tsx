"use client";

import { memo } from "react";
import Icon from "../../asset/icon";
import Vertical from "../../buttons/Vertical";
import {
  ADD_CUSTOM_FIELD_TYPE_ICONS,
  type AddCustomFieldType,
  type AddCustomFieldViewProps,
} from "./AddCustomField.types";

function FieldTypeButton({
  type,
  label,
  onSelect,
}: {
  type: AddCustomFieldType;
  label: string;
  onSelect?: (t: AddCustomFieldType) => void;
}) {
  return (
    <Vertical
      type="button"
      ariaLabel={label}
      onClick={() => onSelect?.(type)}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center">
        <Icon
          name={ADD_CUSTOM_FIELD_TYPE_ICONS[type]}
          size={32}
          className="text-[var(--color-content-default-brand-primary,#fefcc9)]"
        />
      </span>
      <span className="w-full text-center font-inter text-[14px] font-medium leading-[18px] text-[var(--color-content-default-brand-primary,#fefcc9)]">
        {label}
      </span>
    </Vertical>
  );
}

/**
 * Stable block height for collapsed vs expanded so the Create dialog (`top-1/2 -translate-y-1/2`)
 * does not shrink and re-center when toggling `active`.
 *
 * - Collapsed CTA: `py-12` (48+48) + inner row (`py-3` + 20px icon/line) ≈ 140px border-box.
 * - Expanded: inner `p-4` (32) + Vertical tile (py 12+12, gap 8, 32px icon, 18px label) ≈ 114px — shorter without this floor.
 */
const ADD_CUSTOM_FIELD_SHELL_MIN_H_PX = 140;

function AddCustomFieldViewComponent({
  active,
  onPressAdd,
  onSelectFieldType,
  ctaLabel,
  fieldTypeLabels,
  className,
}: AddCustomFieldViewProps) {
  const shellStyle = {
    minHeight: ADD_CUSTOM_FIELD_SHELL_MIN_H_PX,
  } as const;

  if (!active) {
    return (
      <button
        type="button"
        onClick={onPressAdd}
        style={shellStyle}
        className={`flex w-full shrink-0 cursor-pointer items-center justify-center rounded-[var(--measures-radius-medium,8px)] bg-[var(--color-surface-default-secondary)] px-6 py-12 font-inter text-[16px] font-medium leading-5 text-[var(--color-content-default-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-invert-primary)] ${className ?? ""}`.trim()}
      >
        <span className="flex items-center gap-[var(--spacing-scale-006)] rounded-full px-4 py-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {ctaLabel}
        </span>
      </button>
    );
  }

  const expandedShellClasses = ["flex w-full shrink-0 flex-col", className ?? ""]
    .join(" ")
    .trim();

  return (
    <div className={expandedShellClasses} style={shellStyle}>
      <div className="flex w-full flex-col gap-3 rounded-[var(--measures-radius-medium,8px)] bg-[var(--color-surface-default-secondary)] p-4">
        <div className="flex w-full flex-row flex-nowrap justify-center gap-3 overflow-x-auto max-sm:justify-start">
          <FieldTypeButton
            type="text"
            label={fieldTypeLabels.text}
            onSelect={onSelectFieldType}
          />
          <FieldTypeButton
            type="badges"
            label={fieldTypeLabels.badges}
            onSelect={onSelectFieldType}
          />
          <FieldTypeButton
            type="upload"
            label={fieldTypeLabels.upload}
            onSelect={onSelectFieldType}
          />
          <FieldTypeButton
            type="proportion"
            label={fieldTypeLabels.proportion}
            onSelect={onSelectFieldType}
          />
        </div>
      </div>
    </div>
  );
}

export const AddCustomFieldView = memo(AddCustomFieldViewComponent);
AddCustomFieldView.displayName = "AddCustomFieldView";
