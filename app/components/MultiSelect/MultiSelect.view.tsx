"use client";

import { memo } from "react";
import Chip from "../Chip";
import InputLabel from "../InputLabel";
import type { MultiSelectViewProps } from "./MultiSelect.types";

function MultiSelectView({
  label,
  showHelpIcon,
  size,
  palette,
  options,
  onChipClick,
  onAddClick,
  showAddButton,
  addButtonText,
  onCustomChipConfirm,
  onCustomChipClose,
  className,
}: MultiSelectViewProps) {
  const isSmall = size === "s";
  const isInverse = palette === "inverse";

  // Size-based spacing
  const gapClass = isSmall
    ? "gap-[var(--measures-spacing-200,8px)]"
    : "gap-[var(--measures-spacing-300,12px)]";

  const chipSize = isSmall ? "S" : "M";

  return (
    <div className={`flex flex-col ${isSmall ? "gap-[var(--measures-spacing-200,8px)]" : "gap-[var(--measures-spacing-300,12px)]"} items-start relative w-full ${className}`}>
      {/* Label using InputLabel component */}
      {label && (
        <InputLabel
          label={label}
          helpIcon={showHelpIcon}
          asterisk={false}
          helperText={false}
          size={size === "s" ? "S" : "M"}
          palette={palette === "inverse" ? "Inverse" : "Default"}
        />
      )}

      {/* Chips container */}
      <div className={`flex flex-wrap ${gapClass} items-center relative shrink-0 w-full`}>
        {options.map((option) => (
          <Chip
            key={option.id}
            label={option.state === "Custom" ? "" : option.label}
            state={option.state || "Unselected"}
            palette={palette === "inverse" ? "Inverse" : "Default"}
            size={chipSize}
            onClick={() => {
              // Only toggle if not in Custom state
              if (option.state !== "Custom" && onChipClick) {
                onChipClick(option.id);
              }
            }}
            onCheck={(value, e) => {
              e.stopPropagation();
              if (onCustomChipConfirm) {
                onCustomChipConfirm(option.id, value);
              }
            }}
            onClose={(e) => {
              e.stopPropagation();
              if (onCustomChipClose) {
                onCustomChipClose(option.id);
              }
            }}
          />
        ))}

        {/* Add button - Circular button with border (not ghost) when no text, ghost style when text provided */}
        {showAddButton && (
          <button
            type="button"
            aria-label={addButtonText || "Add option"}
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.();
            }}
            className={
              !addButtonText
                ? // Circular button with border (RuleCard style)
                  `bg-[var(--color-surface-default-transparent,rgba(0,0,0,0))] border-[1.25px] ${isInverse ? "border-[var(--color-border-default-primary,#141414)]" : "border-[var(--color-border-default-tertiary,#464646)]"} border-solid flex items-center justify-center ${isSmall ? "size-[30px]" : "size-[40px]"} rounded-[var(--measures-radius-full,9999px)] shrink-0 hover:opacity-80 transition-opacity`
                : // Ghost button style (standalone MultiSelect)
                  `flex ${isSmall ? "gap-[var(--measures-spacing-050,2px)]" : "gap-[var(--measures-spacing-150,6px)]"} items-center justify-center ${isSmall ? "p-[var(--measures-spacing-200,8px)]" : "p-[var(--measures-spacing-300,12px)]"} rounded-[var(--measures-radius-full,9999px)] shrink-0 hover:opacity-80 transition-opacity`
            }
          >
            {/* Plus icon */}
            <svg
              width={isSmall ? "14" : "20"}
              height={isSmall ? "14" : "20"}
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${isInverse ? "text-[var(--color-content-inverse-primary,black)]" : "text-[var(--color-content-default-brand-primary,#fefcc9)]"} shrink-0`}
            >
              <path
                d="M7 3V11M3 7H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Text - only show if addButtonText is provided */}
            {addButtonText && (
              <span className={`font-inter font-medium ${isSmall ? "text-[length:var(--sizing-300,12px)] leading-[14px]" : "text-[length:var(--sizing-400,16px)] leading-[20px]"} ${isInverse ? "text-[color:var(--color-content-inverse-primary,black)]" : "text-[color:var(--color-content-default-brand-primary,#fefcc9)]"}`}>
                {addButtonText}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

MultiSelectView.displayName = "MultiSelectView";

export default memo(MultiSelectView);
