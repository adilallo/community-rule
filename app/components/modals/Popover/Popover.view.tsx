"use client";

import { memo } from "react";
import type { PopoverProps } from "./Popover.types";

export const PopoverView = memo(function PopoverView({
  id,
  menuAriaLabel,
  children,
  className = "",
}: PopoverProps) {
  return (
    <div
      id={id}
      role="menu"
      aria-label={menuAriaLabel}
      data-figma-node="21998:22612"
      className={`flex min-w-[171px] w-max max-w-[calc(100vw-32px)] flex-col items-stretch overflow-hidden rounded-[var(--radius-300)] bg-[var(--color-surface-default-secondary)] px-[12px] [filter:drop-shadow(0px_0px_6px_rgba(254,252,201,0.2))] ${className}`}
    >
      {children}
    </div>
  );
});

PopoverView.displayName = "PopoverView";
