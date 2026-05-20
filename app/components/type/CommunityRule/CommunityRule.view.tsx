"use client";

import { memo } from "react";
import Section from "../Section";
import TextBlock from "../TextBlock";
import type { CommunityRuleProps } from "./CommunityRule.types";

/**
 * Figma: **Sections** canvas, “Community Rule” frame (16489:4507). Composes
 * **`Section`** (22002:30757) + **`TextBlock`** (22001:29793); canonical code under **`type/CommunityRule`**.
 */

const SECTION_GAP = "var(--measures-spacing-1200, 64px)";
const TEAL_BG = "var(--color-teal-teal50, #c9fef9)";

function CommunityRuleView({
  sections,
  className = "",
  useCardStyle = false,
  cardAccentColor,
}: CommunityRuleProps) {
  const accent = cardAccentColor ?? TEAL_BG;
  const rootClass = useCardStyle
    ? `rounded-[12px] bg-white pl-4 ${className}`
    : className;
  const rootStyle = useCardStyle
    ? {
        gap: SECTION_GAP,
        // Inset bar (not border) — Safari mishandles `border-left` + CSS variable accent colors.
        boxShadow: `inset 4px 0 0 0 ${accent}`,
      }
    : { gap: SECTION_GAP };

  return (
    <div className={`flex flex-col min-w-0 ${rootClass}`} style={rootStyle}>
      {sections.map((ruleSection, sectionIndex) => (
        <Section
          key={sectionIndex}
          categoryName={ruleSection.categoryName}
          showRail={!useCardStyle}
        >
          {ruleSection.entries.map((entry, entryIndex) => {
            const hasBlocks = Boolean(entry.blocks?.length);
            return (
              <TextBlock
                key={entryIndex}
                title={entry.title}
                body={hasBlocks ? undefined : entry.body}
                rows={hasBlocks ? entry.blocks : undefined}
              />
            );
          })}
        </Section>
      ))}
    </div>
  );
}

CommunityRuleView.displayName = "CommunityRuleView";

export default memo(CommunityRuleView);
