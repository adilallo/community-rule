"use client";

import React, { forwardRef, memo, useCallback } from "react";

const SelectOption = forwardRef(
  (
    {
      children,
      selected = false,
      disabled = false,
      className = "",
      onClick,
      size = "medium",
      ...props
    },
    ref,
  ) => {
    const getTextSize = () => {
      switch (size) {
        case "small":
          return "text-[10px] leading-[14px]";
        case "medium":
          return "text-[14px] leading-[20px]";
        case "large":
          return "text-[16px] leading-[24px]";
        default:
          return "text-[14px] leading-[20px]";
      }
    };

    const itemClasses = `
      flex items-center justify-between
      px-[8px] py-[4px]
      text-[var(--color-content-default-brand-primary)]
      ${getTextSize()}
      cursor-pointer
      transition-colors duration-150
      ${
        selected
          ? "bg-[var(--color-surface-default-secondary)] rounded-[var(--measures-radius-small)]"
          : ""
      }
      ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:!bg-[var(--color-surface-default-secondary)] hover:!rounded-[var(--measures-radius-small)]"
      }
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    const handleClick = useCallback(
      (e) => {
        if (!disabled && onClick) {
          onClick(e);
        }
      },
      [disabled, onClick],
    );

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!disabled && onClick) {
            onClick(e);
          }
        }
      },
      [disabled, onClick],
    );

    return (
      <div
        ref={ref}
        className={itemClasses}
        role="option"
        tabIndex={disabled ? -1 : 0}
        aria-selected={selected}
        aria-disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div className="flex items-center gap-[8px]">
          {selected && (
            <svg
              className="w-4 h-4 text-[var(--color-content-default-brand-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          <span>{children}</span>
        </div>
      </div>
    );
  },
);

SelectOption.displayName = "SelectOption";

export default memo(SelectOption);
