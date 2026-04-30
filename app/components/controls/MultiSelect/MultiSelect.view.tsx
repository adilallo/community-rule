"use client";

import { memo } from "react";
import Chip from "../Chip";
import InputLabel from "../../type/InputLabel";
import type { MultiSelectViewProps } from "./MultiSelect.types";

function MultiSelectView({
  label,
  showHelpIcon,
  size,
  palette,
  options,
  onChipClick,
  onAddClick,
  addButton,
  addButtonText,
  formHeader = true,
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

  const chipSize = size;

  return (
    <div
      className={`flex flex-col ${isSmall ? "gap-[var(--measures-spacing-200,8px)]" : "gap-[var(--measures-spacing-300,12px)]"} items-start relative w-full ${className}`}
    >
      {/* Label using InputLabel component */}
      {formHeader && label && (
        <InputLabel
          label={label}
          helpIcon={showHelpIcon}
          asterisk={false}
          helperText={false}
          size={size}
          palette={palette}
        />
      )}

      {/* Chips container */}
      <div
        className={`flex flex-wrap ${gapClass} items-center relative shrink-0 w-full`}
      >
        {options.map((option) => (
          <Chip
            key={option.id}
            label={option.state === "custom" ? "" : option.label}
            state={option.state || "unselected"}
            palette={palette}
            size={chipSize}
            onClick={() => {
              if (option.state !== "custom" && onChipClick) {
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

        {/* Add button — icon-only: bordered circle + brand icon (chips stay yellow). With label: Figma 19688:38288 — brand + icon, primary label text, no fill/border. */}
        {addButton && (
          <button
            type="button"
            aria-label={addButtonText || "Add option"}
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.();
            }}
            className={
              !addButtonText
                ? // Circular button with border (Rule style)
                  `cursor-pointer bg-[var(--color-surface-default-transparent,rgba(0,0,0,0))] border-[1.25px] ${isInverse ? "border-[var(--color-border-default-primary,#141414)]" : "border-[var(--color-border-default-tertiary,#464646)]"} border-solid flex items-center justify-center ${isSmall ? "size-[30px]" : "size-[40px]"} rounded-[var(--measures-radius-full,9999px)] shrink-0 hover:opacity-80 transition-opacity`
                : // Text add control (default palette: white label + brand “+”; inverse: inverse primary for both)
                  `cursor-pointer flex items-center justify-center overflow-hidden rounded-[var(--measures-radius-full,9999px)] shrink-0 hover:opacity-80 transition-opacity ${
                    isSmall
                      ? "gap-[var(--measures-spacing-100,4px)] px-[var(--measures-spacing-300,12px)] py-[var(--measures-spacing-200,8px)]"
                      : "gap-[var(--measures-spacing-150,6px)] px-[var(--space-400,16px)] py-[var(--measures-spacing-300,12px)]"
                  }`
            }
          >
            {/* Plus icon — brand accent; selection chips keep full yellow fill separately */}
            <svg
              width={isSmall ? "14" : "20"}
              height={isSmall ? "14" : "20"}
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`shrink-0 ${
                !addButtonText && isInverse
                  ? "text-[var(--color-content-inverse-primary,black)]"
                  : "text-[var(--color-content-default-brand-primary,#fefcc9)]"
              }`}
            >
              <path
                d="M7 3V11M3 7H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {addButtonText && (
              <span
                className={`font-inter font-medium ${isSmall ? "text-[length:var(--sizing-300,12px)] leading-[14px]" : "text-[length:var(--sizing-400,16px)] leading-[20px]"} ${
                  isInverse
                    ? "text-[color:var(--color-content-inverse-primary,black)]"
                    : "text-[color:var(--color-content-default-primary,white)]"
                }`}
              >
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
