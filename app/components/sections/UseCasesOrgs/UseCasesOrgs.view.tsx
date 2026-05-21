"use client";

import { memo } from "react";
import type { UseCasesOrgsViewProps } from "./UseCasesOrgs.types";

function UseCasesOrgsView({ children, className = "" }: UseCasesOrgsViewProps) {
  return (
    <section
      data-figma-node="21993-33687"
      className={`bg-[var(--color-surface-default-primary)] px-[var(--spacing-scale-024)] pb-[var(--spacing-scale-048)] ${className}`.trim()}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap content-center items-center justify-center gap-[var(--spacing-scale-008)] lg:flex-nowrap">
        {children}
      </div>
    </section>
  );
}

UseCasesOrgsView.displayName = "UseCasesOrgsView";

export default memo(UseCasesOrgsView);
