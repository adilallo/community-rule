"use client";

import { memo } from "react";
import InputLabel from "../../utility/InputLabel";
import type { UploadViewProps } from "./Upload.types";

function UploadView({
  active = true,
  label,
  showHelpIcon = true,
  hintText,
  onClick,
  className = "",
}: UploadViewProps) {
  const isActive = active;

  // Button styles based on active state
  const buttonBgClass = isActive
    ? "bg-[var(--color-surface-invert-primary,white)]"
    : "bg-[var(--color-surface-default-secondary,#141414)]";

  const buttonTextColor = isActive
    ? "text-[color:var(--color-content-invert-primary,black)]"
    : "text-[color:var(--color-content-invert-tertiary,#2d2d2d)]";

  // Description text color based on active state
  const descriptionTextColor = isActive
    ? "text-[color:var(--color-content-default-primary,white)]"
    : "text-[color:var(--color-content-default-tertiary,#b4b4b4)]";

  // Icon color based on active state
  const iconColor = isActive
    ? "text-[color:var(--color-content-invert-primary,black)]"
    : "text-[color:var(--color-content-invert-tertiary,#2d2d2d)]";

  return (
    <div
      className={`flex flex-col gap-[var(--measures-spacing-300,12px)] items-start relative w-full ${className}`}
    >
      {/* Label using InputLabel component */}
      {label && (
        <InputLabel
          label={label}
          helpIcon={showHelpIcon}
          asterisk={false}
          helperText={false}
          size="S"
          palette="Default"
        />
      )}

      {/* Upload container — max width per create-flow spec */}
      <div className="bg-[var(--color-surface-default-secondary,#141414)] mx-auto flex w-full max-w-[474px] shrink-0 items-center justify-center gap-[24px] rounded-[var(--measures-radius-200,8px)] px-[var(--measures-spacing-600,24px)] py-[var(--measures-spacing-1200,48px)]">
        {/* Upload button */}
        <button
          type="button"
          onClick={onClick}
          className={`${buttonBgClass} flex gap-[var(--measures-spacing-150,6px)] items-center justify-center overflow-clip px-[var(--space-400,16px)] py-[var(--measures-spacing-300,12px)] rounded-[var(--measures-radius-full,9999px)] shrink-0 hover:opacity-80 transition-opacity`}
          aria-label="Upload"
        >
          {/* Upload icon */}
          <div className={`relative shrink-0 size-[20px] ${iconColor}`}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-full"
            >
              <path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="17 8 12 3 7 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="3"
                x2="12"
                y2="15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {/* Button text */}
          <div
            className={`flex flex-col font-inter font-medium justify-center leading-[0] relative shrink-0 text-[length:var(--sizing-400,16px)] whitespace-nowrap ${buttonTextColor}`}
          >
            <p className="leading-[20px]">Upload</p>
          </div>
        </button>

        {/* Description text */}
        <div
          className={`flex flex-[1_0_0] flex-col font-inter font-normal h-[32px] justify-center leading-[0] min-h-px min-w-px relative text-[length:var(--sizing-350,14px)] ${descriptionTextColor}`}
        >
          <p className="leading-[20px] whitespace-pre-wrap">{hintText}</p>
        </div>
      </div>
    </div>
  );
}

UploadView.displayName = "UploadView";

export default memo(UploadView);
