"use client";

import type { ReactNode } from "react";
import { CreateFlowHeaderLockup } from "./CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "./CreateFlowStepShell";
import {
  CREATE_FLOW_MD_UP_GRID_CELL_CLASS,
  CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS,
} from "./createFlowLayoutTokens";

/** Shared `RuleCard` / template card chrome: width + radius; padding comes from `RuleCard` (L+expanded = 24px). */
export const CREATE_FLOW_REVIEW_RULE_CARD_LAYOUT_CLASS =
  "w-full min-w-0 rounded-[12px] md:rounded-[24px] md:max-w-[640px]";

type CreateFlowLockupCardStepShellProps = {
  lockupTitle: string;
  lockupDescription?: string;
  children: ReactNode;
};

/** Final-review layout: `wideGrid`, two columns from `md:`, column widths from `createFlowLayoutTokens`. */
export function CreateFlowLockupCardStepShell({
  lockupTitle,
  lockupDescription,
  children,
}: CreateFlowLockupCardStepShellProps) {
  return (
    <CreateFlowStepShell variant="wideGrid" contentTopBelowMd="space-800">
      <div
        className={`mx-auto flex w-full min-w-0 flex-col gap-4 md:grid md:w-full md:grid-cols-2 md:justify-items-center md:gap-[var(--measures-spacing-1200,48px)] ${CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS}`}
      >
        <div
          className={`flex min-w-0 flex-col justify-start md:justify-center ${CREATE_FLOW_MD_UP_GRID_CELL_CLASS}`}
        >
          <CreateFlowHeaderLockup
            title={lockupTitle}
            description={lockupDescription}
            justification="left"
          />
        </div>
        <div
          className={`flex min-w-0 flex-col items-stretch ${CREATE_FLOW_MD_UP_GRID_CELL_CLASS}`}
        >
          {children}
        </div>
      </div>
    </CreateFlowStepShell>
  );
}
