"use client";

import { useTranslation } from "../../../contexts/MessagesContext";

/**
 * Placeholder grid matching GovernanceTemplateGrid layout (loading state).
 */
export function GovernanceTemplateGridSkeleton({
  count,
  twoColumnsFromMd = false,
}: {
  count: number;
  twoColumnsFromMd?: boolean;
}) {
  const t = useTranslation("controlsChrome");
  const gridLayoutClasses = twoColumnsFromMd
    ? `
        flex flex-col gap-[18px]
        md:grid md:grid-cols-2 md:gap-[18px]
        lg:gap-[24px]
      `
    : `
        flex flex-col gap-[18px]
        min-[768px]:grid min-[768px]:grid-cols-2 min-[768px]:gap-[18px]
        min-[1024px]:gap-[24px]
      `;

  return (
    <div
      className={gridLayoutClasses}
      aria-busy
      aria-label={t("governanceTemplateGridLoading")}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="
            flex min-h-[120px] animate-pulse flex-col gap-3 rounded-[var(--measures-radius-200,8px)]
            bg-[var(--color-surface-default-secondary,#262626)] p-4
            min-[640px]:min-h-[140px] min-[640px]:rounded-[var(--measures-radius-300,12px)]
            min-[1024px]:min-h-[160px] min-[1024px]:rounded-[var(--radius-measures-radius-small)]
          "
        >
          <div className="h-10 w-10 rounded bg-[var(--color-surface-default-tertiary,#404040)] min-[640px]:h-14 min-[640px]:w-14" />
          <div className="h-4 w-[55%] max-w-[280px] rounded bg-[var(--color-surface-default-tertiary,#404040)]" />
          <div className="h-3 w-full max-w-[400px] rounded bg-[var(--color-surface-default-tertiary,#404040)]" />
          <div className="h-3 w-[72%] max-w-[360px] rounded bg-[var(--color-surface-default-tertiary,#404040)]" />
        </div>
      ))}
    </div>
  );
}
