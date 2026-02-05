"use client";

import { memo } from "react";
import { getAssetPath, ASSETS } from "../../../lib/assetUtils";
import Chip from "../Chip";
import type { MultiSelectViewProps } from "./MultiSelect.types";

function MultiSelectView({
  label,
  showHelpIcon,
  size,
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

  // Size-based spacing and typography
  const gapClass = isSmall
    ? "gap-[var(--measures-spacing-200,8px)]"
    : "gap-[var(--measures-spacing-300,12px)]";

  const labelGapClass = isSmall
    ? "gap-[var(--measures-spacing-200,4px_8px)]"
    : "gap-[4px]";

  const labelTextSize = isSmall
    ? "text-[length:var(--sizing-350,14px)] leading-[20px]"
    : "text-[length:var(--sizing-400,16px)] leading-[24px]";

  const helpIconSize = isSmall ? "size-[12px]" : "size-[16px]";

  const chipSize = isSmall ? "S" : "M";

  return (
    <div className={`flex flex-col ${isSmall ? "gap-[var(--measures-spacing-200,8px)]" : "gap-[var(--measures-spacing-300,12px)]"} items-start relative w-full ${className}`}>
      {/* Label with help icon */}
      {label && (
        <div className={`flex flex-wrap ${labelGapClass} items-baseline ${isSmall ? "pr-[var(--measures-spacing-100,4px)]" : ""} relative shrink-0 w-full`}>
          <div className={`flex ${isSmall ? "gap-[var(--measures-spacing-050,2px)]" : "gap-[var(--measures-spacing-100,4px)]"} items-center relative shrink-0`}>
            <label className={`font-inter font-normal ${labelTextSize} text-[color:var(--color-content-default-primary,white)]`}>
              {label}
            </label>
            {showHelpIcon && (
              <div className={`relative shrink-0 ${helpIconSize}`}>
                <img
                  src={getAssetPath(ASSETS.ICON_HELP)}
                  alt="Help"
                  className="block max-w-none size-full"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chips container */}
      <div className={`flex flex-wrap ${gapClass} items-center relative shrink-0 w-full`}>
        {options.map((option) => (
          <Chip
            key={option.id}
            label={option.state === "Custom" ? "" : option.label}
            state={option.state || "Unselected"}
            palette="Default"
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

        {/* Add button - Ghost button style */}
        {showAddButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.();
            }}
            className={`flex ${isSmall ? "gap-[var(--measures-spacing-050,2px)]" : "gap-[var(--measures-spacing-150,6px)]"} items-center justify-center ${isSmall ? "p-[var(--measures-spacing-200,8px)]" : "p-[var(--measures-spacing-300,12px)]"} rounded-[var(--measures-radius-full,9999px)] shrink-0 hover:opacity-80 transition-opacity`}
          >
            {/* Plus icon */}
            <svg
              width={isSmall ? "14" : "20"}
              height={isSmall ? "14" : "20"}
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[var(--color-content-default-brand-primary,#fefcc9)] shrink-0"
            >
              <path
                d="M7 3V11M3 7H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Text */}
            <span className={`font-inter font-medium ${isSmall ? "text-[length:var(--sizing-300,12px)] leading-[14px]" : "text-[length:var(--sizing-400,16px)] leading-[20px]"} text-[color:var(--color-content-default-brand-primary,#fefcc9)]`}>
              {addButtonText}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

MultiSelectView.displayName = "MultiSelectView";

export default memo(MultiSelectView);
