"use client";

import { forwardRef, memo, useCallback } from "react";
import { ContextMenuItemView } from "./ContextMenuItem.view";
import type { ContextMenuItemProps } from "./ContextMenuItem.types";
import { normalizeContextMenuItemSize } from "../../../lib/propNormalization";

const ContextMenuItemContainer = forwardRef<
  HTMLDivElement,
  ContextMenuItemProps
>(
  (
    {
      children,
      selected = false,
      hasSubmenu = false,
      disabled = false,
      className = "",
      onClick,
      size: sizeProp = "medium",
      ...props
    },
    ref,
  ) => {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const size = normalizeContextMenuItemSize(sizeProp);
    const getTextSize = (): string => {
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
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!disabled && onClick) {
          onClick(e);
        }
      },
      [disabled, onClick],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
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
      <ContextMenuItemView
        ref={ref}
        selected={selected}
        hasSubmenu={hasSubmenu}
        disabled={disabled}
        className={className}
        itemClasses={itemClasses}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </ContextMenuItemView>
    );
  },
);

ContextMenuItemContainer.displayName = "ContextMenuItem";

export default memo(ContextMenuItemContainer);
