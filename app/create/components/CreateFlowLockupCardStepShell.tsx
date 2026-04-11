"use client";

import type { ReactNode } from "react";
import { CreateFlowHeaderLockup } from "./CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "./CreateFlowStepShell";

/** Shared `RuleCard` / template card chrome: matches final-review desktop + mobile padding and radius. */
export const CREATE_FLOW_REVIEW_RULE_CARD_LAYOUT_CLASS =
  "w-full min-w-0 rounded-[12px] p-4 md:rounded-[24px] md:!max-w-full md:!w-full md:p-0";

type CreateFlowLockupCardStepShellProps = {
  lockupTitle: string;
  lockupDescription?: string;
  children: ReactNode;
};

/**
 * Final-review-style create-flow step: `wideGrid` shell, two-column grid at `md+`,
 * left `CreateFlowHeaderLockup` (vertically centered in column), right column for card content.
 */
export function CreateFlowLockupCardStepShell({
  lockupTitle,
  lockupDescription,
  children,
}: CreateFlowLockupCardStepShellProps) {
  return (
    <CreateFlowStepShell variant="wideGrid" contentTopBelowMd="space-800">
      <div className="flex w-full min-w-0 flex-col gap-4 md:grid md:grid-cols-2 md:gap-[var(--measures-spacing-1200,48px)]">
        <div className="flex min-w-0 flex-col justify-start md:justify-center">
          <CreateFlowHeaderLockup
            title={lockupTitle}
            description={lockupDescription}
            justification="left"
          />
        </div>
        <div className="flex min-w-0 w-full flex-col items-stretch">{children}</div>
      </div>
    </CreateFlowStepShell>
  );
}
