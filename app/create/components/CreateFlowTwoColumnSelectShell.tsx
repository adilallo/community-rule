"use client";

import type { ReactNode } from "react";
import { CreateFlowStepShell } from "./CreateFlowStepShell";
import { CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS } from "./createFlowLayoutTokens";

export type CreateFlowSelectShellLgVerticalAlign = "center" | "start";

interface CreateFlowTwoColumnSelectShellProps {
  header: ReactNode;
  children: ReactNode;
  /**
   * At `lg+`, layout variant: `"center"` = vertically centered pair (community size/structure).
   * `"start"` = top-weighted layout with a scrollable right column (core values): uses `items-stretch`
   * so the right column gets a bounded height; `items-start` would grow with content and break scroll.
   */
  lgVerticalAlign?: CreateFlowSelectShellLgVerticalAlign;
}

/**
 * Two-column layout for create-flow select steps (community size/structure, core values).
 * Below `lg`, layout and scrolling match the previous single-column behavior (full page scroll).
 * At `lg+`, mirrors {@link CompletedScreen}: static header column + scrollable controls column
 * (`min-h-0` + `overflow-y-auto` height chain; see completed page right rail).
 */
export function CreateFlowTwoColumnSelectShell({
  header,
  children,
  lgVerticalAlign = "center",
}: CreateFlowTwoColumnSelectShellProps) {
  /** `stretch` is required for `min-h-0` + `overflow-y-auto` on the right column. */
  const rowLgCrossAlignClass =
    lgVerticalAlign === "start" ? "lg:items-stretch" : "lg:items-center";

  const leftLgMainJustifyClass =
    lgVerticalAlign === "start" ? "lg:justify-start" : "lg:justify-center";

  return (
    <CreateFlowStepShell
      variant="centeredNarrow"
      contentTopBelowMd="space-1400"
      className={
        /* Below `lg`: natural height — same as legacy select screens (main scrolls). */
        /* At `lg+`: fill main + clip so only the right column scrolls (CompletedScreen pattern). */
        "w-full min-w-0 max-lg:flex-none lg:min-h-0 lg:h-full lg:max-h-full lg:flex-1 lg:overflow-hidden lg:items-stretch lg:self-stretch"
      }
    >
      <div
        className={
          "flex w-full min-w-0 flex-col items-start gap-[var(--measures-spacing-400,16px)] md:max-w-[640px] " +
          "max-lg:flex-none lg:max-h-full lg:max-w-[1328px] lg:min-h-0 lg:flex-1 lg:flex-row lg:flex-nowrap " +
          `${rowLgCrossAlignClass} lg:justify-center lg:gap-[var(--measures-spacing-1200,48px)] lg:overflow-hidden`
        }
      >
        <div
          className={
            `flex w-full min-w-0 shrink-0 flex-col items-start gap-[var(--measures-spacing-200,8px)] ` +
            `lg:flex-1 ${leftLgMainJustifyClass} lg:py-[12px] lg:max-w-[640px] ${CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS}`
          }
        >
          {header}
        </div>
        <div
          className={
            `scrollbar-hide relative flex w-full min-w-0 flex-col items-start gap-[var(--measures-spacing-800,32px)] ` +
            `overflow-x-hidden lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pb-[var(--measures-spacing-300,12px)] ` +
            CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS
          }
        >
          {children}
        </div>
      </div>
    </CreateFlowStepShell>
  );
}
