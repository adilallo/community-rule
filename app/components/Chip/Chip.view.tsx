"use client";

import { memo } from "react";
import type { ChipViewProps } from "./Chip.types";

function ChipView({
  label,
  state,
  palette,
  size,
  className = "",
  disabled = false,
  onClick,
  onRemove,
  onCheck,
  onClose,
  inputValue,
  onInputChange,
  onInputKeyDown,
  inputRef,
  ariaLabel,
}: ChipViewProps) {
  const isDisabled = disabled || state === "disabled";
  const isSelected = state === "selected";
  const isCustom = state === "custom";

  const isInverse = palette === "inverse";
  const isDefault = palette === "default";

  const isSmall = size === "s";

  // Size-based styles from Figma tokens
  // Custom state has different padding
  const sizeClasses = isCustom
    ? isSmall
      ? "px-[var(--measures-spacing-100,4px)] py-[3px] text-[length:var(--sizing-300,12px)] leading-[16px]"
      : "px-[var(--measures-spacing-150,6px)] py-[10px] text-[length:var(--sizing-400,16px)] leading-[24px]"
    : isSmall
      ? "h-[30px] px-[var(--measures-spacing-200,8px)] gap-[var(--measures-spacing-050,2px)] text-[length:var(--sizing-300,12px)] leading-[14px]"
      : "px-[var(--measures-spacing-300,12px)] py-[var(--measures-spacing-300,12px)] gap-[var(--measures-spacing-150,6px)] text-[length:var(--sizing-400,16px)] leading-[20px]";

  // Palette + state styling based on Figma examples
  // Use consistent border width to prevent layout shift
  const borderWidth = isSmall ? "border-[1.25px]" : "border-2";
  
  let background = "bg-[var(--color-surface-default-transparent,rgba(0,0,0,0))]";
  let border =
    `${borderWidth} border-[var(--color-border-default-tertiary,#464646)]`;
  let textColor =
    "text-[color:var(--color-content-default-brand-primary,#fefcc9)]";

  if (isDefault) {
    if (state === "custom") {
      background =
        "bg-[var(--color-surface-default-secondary,#141414)]"; // dark background for custom
      border = "border-none";
      textColor =
        "text-[color:var(--color-content-default-tertiary,#b4b4b4)]";
    } else if (state === "disabled") {
      background =
        "bg-[var(--color-surface-default-secondary,#141414)]"; // dark background
      border = "border-none";
      textColor =
        "text-[color:var(--color-content-default-tertiary,#b4b4b4)]";
    } else if (isSelected) {
      background =
        "bg-[var(--color-surface-inverse-brandaccent,#fdfaa8)]"; // yellow selected
      border = `${borderWidth} border-[var(--color-border-default-brand-primary,#fdfaa8)]`;
      textColor =
        "text-[color:var(--color-content-inverse-primary,black)]";
    } else {
      // Unselected default
      background =
        "bg-[var(--color-surface-default-transparent,rgba(0,0,0,0))]";
      border = `${borderWidth} border-[var(--color-border-default-tertiary,#464646)]`;
      textColor =
        "text-[color:var(--color-content-default-brand-primary,#fefcc9)]";
    }
  } else if (isInverse) {
    if (state === "disabled") {
      background =
        "bg-[var(--color-surface-inverse-tertiary,#d2d2d2)]";
      border = "border-none";
      textColor =
        "text-[color:var(--color-content-inverse-primary,black)]";
    } else if (isSelected) {
      background =
        "bg-[var(--color-surface-default-semi-opaque,rgba(0,0,0,0.05))]";
      border = `${borderWidth} border-[var(--color-border-default-primary,#141414)]`;
      textColor =
        "text-[color:var(--color-content-inverse-primary,black)]";
    } else {
      // Unselected / custom inverse
      background =
        "bg-[var(--color-surface-default-transparent,rgba(0,0,0,0))]";
      border = `${borderWidth} border-[var(--color-border-default-primary,#141414)]`;
      textColor =
        "text-[color:var(--color-content-inverse-primary,black)]";
    }
  }

  const baseClasses = `
    inline-flex
    items-center
    justify-center
    rounded-[var(--measures-radius-full,9999px)]
    overflow-clip
    box-border
    focus:outline-none
    focus-visible:ring-2
    focus-visible:ring-[var(--color-border-default-primary,#141414)]
    focus-visible:ring-offset-2
    focus-visible:ring-offset-transparent
    transition-[background,border-color,color,box-shadow,transform]
    duration-200
    ease-in-out
  `
    .trim()
    .replace(/\s+/g, " ");

  const stateClasses = isDisabled
    ? "cursor-not-allowed opacity-60"
    : "cursor-pointer hover:scale-[1.02]";

  const combinedClasses = [
    baseClasses,
    sizeClasses,
    background,
    border,
    textColor,
    stateClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const sharedA11y = {
    "aria-label": ariaLabel,
  };

  // Custom state rendering with check/close buttons
  if (isCustom) {
    return (
      <div
        className={combinedClasses}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
          }
        }}
        {...sharedA11y}
      >
        <div className={`flex items-center ${isSmall ? "gap-[8px]" : "gap-[12px]"}`}>
          {/* Check button */}
          {onCheck && (
            <button
              type="button"
              className="flex items-center justify-center p-[var(--measures-spacing-150,6px)] rounded-full hover:bg-[var(--color-surface-default-semi-opaque,rgba(0,0,0,0.1))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Confirm"
              disabled={!inputValue || !inputValue.trim()}
              onClick={(event) => {
                event.stopPropagation();
                // The container's handleCheck will get the value from state
                if (inputValue && inputValue.trim() && onCheck) {
                  onCheck(inputValue.trim(), event);
                }
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[var(--color-content-default-brand-primary,#fefcc9)]"
              >
                <path
                  d="M10 3L4.5 8.5L2 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Input field */}
          <div className="flex items-center flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={inputValue ?? ""}
              onChange={(e) => onInputChange?.(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Type to add"
              className="bg-transparent border-none outline-none flex-1 min-w-0 font-inter font-normal text-[color:var(--color-content-default-tertiary,#b4b4b4)] placeholder:text-[color:var(--color-content-default-tertiary,#b4b4b4)]"
              style={{
                fontSize: isSmall ? "var(--sizing-300,12px)" : "var(--sizing-400,16px)",
                lineHeight: isSmall ? "16px" : "24px",
              }}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
            />
          </div>

          {/* Close button */}
          {onClose && (
            <button
              type="button"
              className="flex items-center justify-center p-[var(--measures-spacing-150,6px)] rounded-full hover:bg-[var(--color-surface-default-semi-opaque,rgba(0,0,0,0.1))] transition-colors"
              aria-label="Close"
              onClick={(event) => {
                event.stopPropagation();
                onClose(event);
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[var(--color-content-default-brand-primary,#fefcc9)]"
              >
                <path
                  d="M9 3L3 9M3 3L9 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Regular state rendering
  return (
    <button
      type="button"
      className={combinedClasses}
      disabled={isDisabled}
      onClick={handleClick}
      {...sharedA11y}
    >
      <span className="flex items-center justify-center">
        {label}
      </span>
      {onRemove && !isDisabled && (
        <button
          type="button"
          className="ml-[var(--measures-spacing-050,2px)] p-[var(--measures-spacing-050,2px)] rounded-full hover:bg-[var(--color-surface-default-semi-opaque,rgba(0,0,0,0.05))]"
          aria-label={`Remove ${label}`}
          onClick={(event) => {
            event.stopPropagation();
            onRemove(event);
          }}
        >
          <span className="block w-[12px] h-[12px] leading-none text-[10px]">
            ×
          </span>
        </button>
      )}
    </button>
  );
}

ChipView.displayName = "ChipView";

export default memo(ChipView);

