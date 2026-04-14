"use client";

import type { ReactNode } from "react";

export type CreateFlowStepShellVariant =
  | "centeredNarrow"
  | "centeredNarrowBottomPad"
  | "wideGrid"
  | "wideGridLoosePadding"
  | "bare";

/** Semantic top padding below create-flow top nav (applied at all breakpoints; name is legacy). */
export type CreateFlowContentTopBelowMd = "none" | "space-1400" | "space-800";

const outerByVariant: Record<CreateFlowStepShellVariant, string> = {
  centeredNarrow:
    "flex w-full min-w-0 flex-col items-center px-5 md:px-16",
  centeredNarrowBottomPad:
    "flex w-full min-w-0 flex-col items-center px-5 pb-28 md:px-[var(--measures-spacing-1800,64px)] md:pb-32",
  /** Wide two-column steps; 1328px = two 640px columns + 48px gutter. */
  wideGrid: "w-full min-w-0 max-w-[1328px] shrink-0 px-5 md:px-12",
  /** Create Community review + card grid (Figma Flow — Review `19706:12135`): max width 1440. */
  wideGridLoosePadding:
    "w-full min-w-0 max-w-[1440px] shrink-0 px-5 md:px-16",
  bare: "w-full min-w-0",
};

const contentTopBelowMdClass: Record<CreateFlowContentTopBelowMd, string> = {
  none: "",
  "space-1400": "pt-[var(--space-1400)]",
  "space-800": "pt-[var(--space-800)]",
};

interface CreateFlowStepShellProps {
  children: ReactNode;
  variant?: CreateFlowStepShellVariant;
  /** Top spacing below top chrome (`CreateFlowTextFieldScreen` defaults to `space-1400`). */
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
