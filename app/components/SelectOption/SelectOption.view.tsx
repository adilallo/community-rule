import { forwardRef } from "react";
import type { SelectOptionViewProps } from "./SelectOption.types";

export const SelectOptionView = forwardRef<HTMLDivElement, SelectOptionViewProps>(
  (
    {
      children,
      selected,
      disabled,
      itemClasses,
      handleClick,
      handleKeyDown,
      ...props
    },
    ref,
  ) => {
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

SelectOptionView.displayName = "SelectOptionView";
