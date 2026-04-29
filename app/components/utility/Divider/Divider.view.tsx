"use client";

import { memo } from "react";
import type { DividerViewProps } from "./Divider.types";

const lineColor: Record<"content" | "menu", string> = {
  content: "bg-[var(--color-border-default-secondary)]",
  menu: "bg-[var(--color-border-default-tertiary)]",
};

/**
 * Figma: "Utility / Divider" — horizontal Content (6894:22988), vertical Content
 * (6894:22990), Menu horizontal (450:1940), Menu vertical (2002:30943).
 */
export const DividerView = memo(function DividerView({
  orientation = "horizontal",
  type: dividerType = "content",
  className = "",
}: DividerViewProps) {
  const color = lineColor[dividerType];

  if (orientation === "vertical") {
    return (
      <div
        className={`w-px shrink-0 self-stretch ${color} ${className}`}
        data-figma-node={dividerType === "content" ? "6894:22990" : "2002:30943"}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`flex w-full flex-col items-center ${className}`}
      data-figma-node={dividerType === "content" ? "6894:22988" : "450:1940"}
    >
      <div
        className={`h-px w-full shrink-0 ${color}`}
        data-figma-node={dividerType === "content" ? "6894:22989" : "2002:30856"}
        aria-hidden="true"
      />
    </div>
  );
});

DividerView.displayName = "DividerView";
