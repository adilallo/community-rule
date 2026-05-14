"use client";

import { memo } from "react";
import Button from "../../buttons/Button";
import ContentLockup from "../ContentLockup";
import type {
  TripleTextBlockColumn,
  TripleTextBlockViewProps,
} from "./TripleTextBlock.types";

function columnUsesLargeBreakpointCopy(column: TripleTextBlockColumn): boolean {
  return column.lgTitle !== undefined || column.lgDescription !== undefined;
}

function TripleTextBlockColumnLockup({
  column,
}: {
  column: TripleTextBlockColumn;
}) {
  const dual = columnUsesLargeBreakpointCopy(column);
  const lgSubtitle = column.lgTitle ?? column.title;
  const lgBody = column.lgDescription ?? column.description;

  if (!dual) {
    return (
      <ContentLockup
        variant="about"
        alignment="left"
        subtitle={column.title}
        description={column.description}
      />
    );
  }

  return (
    <>
      <div className="lg:hidden">
        <ContentLockup
          variant="about"
          alignment="left"
          subtitle={column.title}
          description={column.description}
        />
      </div>
      <div className="hidden lg:block">
        <ContentLockup
          variant="about"
          alignment="left"
          subtitle={lgSubtitle}
          description={lgBody}
        />
      </div>
    </>
  );
}

/**
 * Figma: "Type / TripleTextBlock" stacked **22137:890676**; lg 3-col **22128-888715**; xl typography + horizontal inset scale/160 **22135:889705** (Subtitle 32 Small/Display, Body X Large/Paragraph 24 / lh 32; section px scale/160, py scale/064).
 */
function TripleTextBlockView({
  title = "",
  columns,
  ctaText,
  ctaHref,
  headingId,
  className = "",
}: TripleTextBlockViewProps) {
  const sectionTitle = title.trim();
  const hasSectionTitle = sectionTitle.length > 0;

  return (
    <section
      aria-labelledby={hasSectionTitle ? headingId : undefined}
      className={`bg-black px-[var(--spacing-scale-032)] py-[var(--spacing-scale-064)] md:px-[var(--spacing-scale-096)] md:py-[var(--spacing-scale-064)] xl:px-[var(--spacing-scale-160)] ${className}`.trim()}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[var(--spacing-scale-032)]">
        {hasSectionTitle ? (
          <h2
            id={headingId}
            className="w-full text-left font-bricolage-grotesque text-[32px] font-medium leading-[1.1] text-[var(--color-content-default-primary,white)]"
          >
            {sectionTitle}
          </h2>
        ) : null}
        <div className="flex w-full flex-col gap-[var(--spacing-scale-032)] lg:flex-row lg:items-start lg:gap-[var(--spacing-scale-032)]">
          {columns.map((column, index) => (
            <div
              key={`${column.title}-${column.lgTitle ?? ""}-${index}`}
              className="w-full min-w-0 lg:flex-1"
            >
              <TripleTextBlockColumnLockup column={column} />
            </div>
          ))}
        </div>
        {ctaText ? (
          <div className="flex w-full justify-start">
            <Button
              buttonType="filled"
              palette="inverse"
              size="large"
              href={ctaHref}
            >
              {ctaText}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

TripleTextBlockView.displayName = "TripleTextBlockView";

export default memo(TripleTextBlockView);
