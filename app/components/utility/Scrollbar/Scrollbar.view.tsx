"use client";

import type { ScrollbarProps } from "./Scrollbar.types";

const overflowClass = {
  vertical: "overflow-x-clip overflow-y-auto",
  horizontal: "overflow-y-clip overflow-x-auto",
  both: "overflow-auto",
} as const;

export function ScrollbarView({
  children,
  className = "",
  orientation = "vertical",
}: ScrollbarProps) {
  return (
    <div
      className={`scrollbar-design ${overflowClass[orientation]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
