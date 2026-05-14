"use client";

import { memo } from "react";
import Stat from "../../cards/Stat";
import type { StatsViewProps } from "./Stats.types";

/** First word vs remainder for mobile two-tone title line (Sections / Stats, 22132:889582). */
function splitLeadingWord(phrase: string): { leading: string; rest: string } {
  const t = phrase.trim();
  const idx = t.indexOf(" ");
  if (idx === -1) {
    return { leading: t, rest: "" };
  }
  return { leading: t.slice(0, idx), rest: t.slice(idx + 1).trimEnd() };
}

/**
 * Figma: "Sections / Stats" (22132-889500; md 22137-890674 / mobile 22137-891194 / 22132:889576). Four-up from `lg`; cards fill grid columns; md + lg staggers per Figma; title md nudge reset at lg. Section inset uses spacing-scale-160 at lg.
 */
function StatsView({
  titlePrefix,
  titleEmphasis,
  titleSuffix,
  items,
  headingId,
  className = "",
}: StatsViewProps) {
  const { leading: suffixLead, rest: suffixTail } = titleSuffix
    ? splitLeadingWord(titleSuffix)
    : { leading: "", rest: "" };

  return (
    <section
      aria-labelledby={headingId}
      className={`bg-black px-[var(--spacing-scale-032)] py-[var(--spacing-scale-048)] md:px-[var(--spacing-scale-064)] md:py-[var(--spacing-scale-064)] lg:px-[var(--spacing-scale-160)] ${className}`.trim()}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[var(--spacing-scale-010)] sm:gap-[var(--spacing-scale-032)]">
        <h2
          id={headingId}
          className="max-w-[116px] font-inter text-[24px] font-normal leading-[32px] md:text-[length:var(--spacing-scale-016)] md:leading-[length:var(--spacing-scale-020)] md:translate-y-24 lg:translate-y-0"
        >
          <span className="-mb-1 block whitespace-nowrap md:-mb-0 md:inline md:whitespace-normal md:leading-[inherit]">
            {titlePrefix ? (
              <span className="text-[#636363]">
                {titlePrefix}{" "}
              </span>
            ) : null}
            {titleEmphasis ? (
              <span className="font-normal text-[#e0e0e0]">
                {titleEmphasis}
              </span>
            ) : null}
          </span>
          {titleSuffix ? (
            <>
              <span className="hidden md:inline md:leading-[inherit]">{" "}</span>
              <span className="block whitespace-nowrap md:inline md:whitespace-normal md:leading-[inherit]">
                <span className="text-[#636363]">
                  {suffixLead}
                  {suffixTail ? "\u00a0" : null}
                </span>
                {suffixTail ? (
                  <span className="text-[#e0e0e0]">{suffixTail}</span>
                ) : null}
              </span>
            </>
          ) : null}
        </h2>
        <ul className="grid w-full flex-1 grid-cols-1 gap-[var(--spacing-scale-014)] md:grid-cols-2 md:gap-[var(--spacing-scale-016)] lg:grid-cols-4">
          {items.map((item, index) => {
            /* Figma mobile Card / Stat rows: 182px (1st, 4th) vs 260px (2nd, 3rd) */
            const isShortCard = index === 0 || index === items.length - 1;
            const heightClass = isShortCard
              ? "!h-[182px] !min-h-0"
              : "!h-[260px] !min-h-0";

            /* md 2-col stagger (22137:890674); lg 4-col stagger (22132:889576). */
            let staggerClass = "";
            if (index % 2 === 1) {
              staggerClass = "md:-translate-y-4 lg:-translate-y-4";
            } else if (index === 0) {
              staggerClass = "md:translate-y-24 lg:translate-y-4";
            } else if (index === 2) {
              staggerClass = "md:translate-y-4 lg:translate-y-8";
            } else {
              staggerClass = "md:translate-y-4 lg:translate-y-4";
            }

            return (
              <li key={`${item.value}-${index}`} className={staggerClass}>
                <Stat {...item} className={heightClass} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

StatsView.displayName = "StatsView";

export default memo(StatsView);
