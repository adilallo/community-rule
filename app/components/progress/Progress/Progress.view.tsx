import type { ProgressViewProps } from "./Progress.types";

export function ProgressView({
  progress,
  className,
  barClasses,
}: ProgressViewProps) {
  // Progress bar type
  const [fullSegments, partialSegment] = progress.split("-").map(Number);
  // Calculate total progress:
  // - For 1-X: first section is (X+1)/6 filled
  // - For 2-X: first section full, second section X/3 filled
  // - For 3-X: first two sections full, third section X/3 filled
  // Max is 3 full segments = 9 units
  let totalProgress = 0;
  if (fullSegments === 1) {
    totalProgress = (partialSegment + 1) / 6; // 1/6 to 6/6 of first section
  } else if (fullSegments === 2) {
    totalProgress = 1 + partialSegment / 3; // 1 full + 0/3 to 2/3 of second
  } else if (fullSegments === 3) {
    totalProgress = 2 + partialSegment / 3; // 2 full + 0/3 to 2/3 of third
  }
  const maxProgress = 3;
  const progressPercentage = Math.round((totalProgress / maxProgress) * 100);

  return (
    <div
      className={`${barClasses} ${className}`}
      role="progressbar"
      aria-valuenow={totalProgress}
      aria-valuemin={0}
      aria-valuemax={3}
      aria-label={`Progress: ${progressPercentage}%`}
    >
      {/* Background layer - 3 segments */}
      <div className="absolute inset-0 flex gap-[var(--spacing-scale-008)] px-[4px]">
        <div className="flex-1 h-full bg-[var(--color-surface-default-secondary)] rounded-l-[var(--radius-full)]" />
        <div className="flex-1 h-full bg-[var(--color-surface-default-secondary)]" />
        <div className="flex-1 h-full bg-[var(--color-surface-default-secondary)] rounded-r-[var(--radius-full)]" />
      </div>

      {/* Fill layer - always show 3 sections, fill amount varies */}
      <div className="absolute inset-0 flex gap-[var(--spacing-scale-008)] px-[4px] overflow-hidden">
        {/* First section - for 1-X: (X+1)/6 filled, for 2-X and 3-X: fully filled */}
        <div className="flex-1 h-full relative">
          {fullSegments === 1 ? (
            <div
              className="absolute inset-y-0 left-0 bg-[var(--color-content-default-brand-primary)] rounded-l-[var(--radius-full)]"
              style={{ width: `${((partialSegment + 1) / 6) * 100}%` }}
            />
          ) : fullSegments >= 2 ? (
            <div className="absolute inset-0 bg-[var(--color-content-default-brand-primary)] rounded-l-[var(--radius-full)]" />
          ) : null}
        </div>
        {/* Second section - for 2-X: X/3 filled, for 3-X: fully filled, otherwise empty */}
        <div className="flex-1 h-full relative">
          {fullSegments === 2 ? (
            partialSegment > 0 ? (
              <div
                className="absolute inset-y-0 left-0 bg-[var(--color-content-default-brand-primary)]"
                style={{ width: `${(partialSegment / 3) * 100}%` }}
              />
            ) : null
          ) : fullSegments >= 3 ? (
            <div className="absolute inset-0 bg-[var(--color-content-default-brand-primary)]" />
          ) : null}
        </div>
        {/* Third section - for 3-X: X/3 filled, otherwise empty */}
        <div className="flex-1 h-full relative">
          {fullSegments === 3 && partialSegment > 0 ? (
            <div
              className="absolute inset-y-0 left-0 bg-[var(--color-content-default-brand-primary)]"
              style={{ width: `${(partialSegment / 3) * 100}%` }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
