import { forwardRef } from "react";
import type { ContextMenuItemViewProps } from "./ContextMenuItem.types";

export const ContextMenuItemView = forwardRef<
  HTMLDivElement,
  ContextMenuItemViewProps
>(
  (
    {
      children,
      selected,
      hasSubmenu,
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
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-current={selected ? "true" : undefined}
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
        {hasSubmenu && (
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </div>
    );
  },
);

ContextMenuItemView.displayName = "ContextMenuItemView";
