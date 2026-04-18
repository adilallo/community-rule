import type { ProportionBarViewProps } from "./ProportionBar.types";

/**
 * Per-step fill ratio for the second (middle) segment at `2-X` progress states.
 * Values are taken directly from Figma (`17861:33241`, `18861:15250`, `21434:17632`)
 * and are intentionally non-uniform — they are NOT `X/3`.
 */
const SECOND_SEGMENT_FILL_RATIO: Record<number, number> = {
  0: 0,
  1: 1 / 4,
  2: 1 / 2,
  3: 3 / 4,
};

function getSecondSegmentFillRatio(partial: number): number {
  return SECOND_SEGMENT_FILL_RATIO[partial] ?? 0;
}

export function ProportionBarView({
  progress,
  className,
  barClasses,
  // `variant` is kept in the prop API for callers, but both `default` and
  // `segmented` now render identical fill geometry (square leading edges).
  variant: _variant,
}: ProportionBarViewProps) {
  // Proportion bar type
  const [fullSegments, partialSegment] = progress.split("-").map(Number);
  // Calculate total progress:
  // - For 1-X: first section is (X+1)/6 filled
  // - For 2-X: first section full, second section filled per Figma ratios (see `SECOND_SEGMENT_FILL_RATIO`)
  // - For 3-X: first two sections full, third section X/3 filled
  // Max is 3 full segments = 9 units
  let totalProgress = 0;
  if (fullSegments === 1) {
    totalProgress = (partialSegment + 1) / 6; // 1/6 to 6/6 of first section
  } else if (fullSegments === 2) {
    totalProgress = 1 + getSecondSegmentFillRatio(partialSegment);
  } else if (fullSegments === 3) {
    totalProgress = 2 + partialSegment / 3; // 2 full + 0/3 to 2/3 of third
  }
  const maxProgress = 3;
  const progressPercentage = Math.round((totalProgress / maxProgress) * 100);
  // Check if at 100% completion (all 3 segments fully filled)
  // Note: Current type system max is "3-2" (88.9%), true 100% would require "3-3" or all segments fully filled
  const isFull = totalProgress >= maxProgress;
  // Generate descriptive aria-label
  const ariaLabelText = isFull
    ? "Progress: Complete (100%)"
    : fullSegments === 3 && partialSegment === 2
      ? `Progress: ${fullSegments} segments complete, maximum state (${progressPercentage}%)`
      : fullSegments === 3
        ? `Progress: ${fullSegments} segments, ${partialSegment} of 3 parts filled (${progressPercentage}%)`
        : fullSegments === 2
          ? `Progress: ${fullSegments} segments, ${partialSegment} of 3 parts filled (${progressPercentage}%)`
          : `Progress: ${fullSegments} segment, ${partialSegment + 1} of 6 parts filled (${progressPercentage}%)`;

  return (
    <div
      className={`${barClasses} ${className}`}
      role="progressbar"
      aria-valuenow={totalProgress}
      aria-valuemin={0}
      aria-valuemax={3}
      aria-label={ariaLabelText}
    >
      {/* Background layer - 3 segments */}
      <div className="absolute inset-0 flex gap-[var(--spacing-scale-008)] px-[4px]">
        <div className="flex-1 h-full bg-[var(--color-surface-default-secondary)] rounded-l-[var(--radius-full)]" />
        <div className="flex-1 h-full bg-[var(--color-surface-default-secondary)]" />
        <div className="flex-1 h-full bg-[var(--color-surface-default-secondary)] rounded-r-[var(--radius-full)]" />
      </div>

      {/* Fill layer - always show 3 sections, fill amount varies */}
      {/*
        The leading (right) edge of every partial fill is a straight (square) edge —
        only the outermost left/right edges of the whole bar can round to match the
        background capsule.
      */}
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
        {/* Second section — for 2-X: Figma ratio fill (see `SECOND_SEGMENT_FILL_RATIO`); for 3-X: full; otherwise empty. */}
        <div className="flex-1 h-full relative">
          {fullSegments === 2 ? (
            partialSegment > 0 ? (
              <div
                className="absolute inset-y-0 left-0 bg-[var(--color-content-default-brand-primary)]"
                style={{
                  width: `${getSecondSegmentFillRatio(partialSegment) * 100}%`,
                }}
              />
            ) : null
          ) : fullSegments >= 3 ? (
            <div className="absolute inset-0 bg-[var(--color-content-default-brand-primary)]" />
          ) : null}
        </div>
        {/* Third section - for 3-X: X/3 filled, otherwise empty */}
        {/* Round right corner only when the fill reaches the absolute right edge of the bar (partialSegment >= 3) */}
        <div className="flex-1 h-full relative">
          {fullSegments === 3 && partialSegment > 0 ? (
            <div
              className={`absolute inset-y-0 left-0 bg-[var(--color-content-default-brand-primary)] ${
                partialSegment >= 3 ? "rounded-r-[var(--radius-full)]" : ""
              }`.trim()}
              style={{ width: `${Math.min((partialSegment / 3) * 100, 100)}%` }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
