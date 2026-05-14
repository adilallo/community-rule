"use client";

import { memo } from "react";
import LayoutAccordion from "../../layout/Accordion";
import type { FaqAccordionViewProps } from "./Accordion.types";

/**
 * Figma: "Sections / Accordion" (22130-889248; mobile FAQ 22132-889380). **xl** rows **Large** via `xlSize` (22135:890328).
 * Section title: Large Heading (32px, lh 40) below `lg`; X Large Heading (36px, lh 44) at `lg`; XX Large Heading (40px, lh 52) at `xl` (Figma desktop frame 22135:890398).
 */
function FaqAccordionView({
  title,
  items,
  size,
  lgSize,
  xlSize,
  headingId,
  className = "",
}: FaqAccordionViewProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={`bg-[#141414] px-[var(--spacing-scale-004)] py-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-160)] md:py-[var(--spacing-scale-096)] ${className}`.trim()}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-[var(--spacing-scale-096)] md:gap-[var(--spacing-scale-040)]">
        <h2
          id={headingId}
          className="w-full px-[var(--spacing-scale-016)] text-center font-bricolage-grotesque text-[length:var(--text-large-heading)] font-bold leading-[length:var(--text-large-heading--line-height)] text-[var(--color-content-default-brand-primary,#fefcc9)] md:px-0 lg:text-[length:var(--text-x-large-heading)] lg:leading-[length:var(--text-x-large-heading--line-height)] xl:text-[length:var(--text-xx-large-heading)] xl:leading-[length:var(--text-xx-large-heading--line-height)] xl:tracking-[var(--text-xx-large-heading--letter-spacing)]"
        >
          {title}
        </h2>
        <div className="w-full md:px-0">
          {items.map((item, index) => (
            <LayoutAccordion
              key={`${item.title}-${index}`}
              title={item.title}
              subhead={item.subhead}
              size={size}
              lgSize={lgSize}
              xlSize={xlSize}
            >
              {item.answer}
            </LayoutAccordion>
          ))}
        </div>
      </div>
    </section>
  );
}

FaqAccordionView.displayName = "FaqAccordionView";

export default memo(FaqAccordionView);
