"use client";

import type { ReactNode } from "react";

export type CreateFlowStepShellVariant =
  | "centeredNarrow"
  | "centeredNarrowBottomPad"
  | "wideGrid"
  | "wideGridLoosePadding"
  | "bare";

/** Top padding below `md` between top nav and step content (semantic space tokens). */
export type CreateFlowContentTopBelowMd = "none" | "space-1400" | "space-800";

const outerByVariant: Record<CreateFlowStepShellVariant, string> = {
  centeredNarrow:
    "flex w-full min-w-0 flex-col items-center px-5 md:px-16",
  centeredNarrowBottomPad:
    "flex w-full min-w-0 flex-col items-center px-5 pb-28 md:px-[var(--measures-spacing-1800,64px)] md:pb-32",
  wideGrid: "w-full min-w-0 max-w-[1280px] shrink-0 px-5 md:px-12",
  wideGridLoosePadding:
    "w-full min-w-0 max-w-[1280px] shrink-0 px-5 md:px-16",
  bare: "w-full min-w-0",
};

const contentTopBelowMdClass: Record<CreateFlowContentTopBelowMd, string> = {
  none: "",
  "space-1400": "max-md:pt-[var(--space-1400)]",
  "space-800": "max-md:pt-[var(--space-800)]",
};

interface CreateFlowStepShellProps {
  children: ReactNode;
  variant?: CreateFlowStepShellVariant;
  /** Padding-top below `md` only; `text` step uses `none`. */
  contentTopBelowMd?: CreateFlowContentTopBelowMd;
  className?: string;
}

/**
 * Shared horizontal padding and width constraints for create-flow step pages.
 * Horizontal padding uses Tailwind `md:` so it tracks `--breakpoint-md` (640px in `app/tailwind.css`).
 */
export function CreateFlowStepShell({
  children,
  variant = "centeredNarrow",
  contentTopBelowMd = "none",
  className = "",
}: CreateFlowStepShellProps) {
  const topClass = contentTopBelowMdClass[contentTopBelowMd];
  return (
    <div
      className={`${outerByVariant[variant]} ${topClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
