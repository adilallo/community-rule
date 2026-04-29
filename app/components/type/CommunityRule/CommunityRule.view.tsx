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
}: CommunityRuleProps) {
  const rootClass = useCardStyle
    ? `rounded-[12px] bg-white pl-3 border-l-4 ${className}`
    : className;
  const rootStyle = useCardStyle ? { borderLeftColor: TEAL_BG } : undefined;

  return (
    <div
      className={`flex flex-col min-w-0 ${rootClass}`}
      style={{ gap: SECTION_GAP, ...rootStyle }}
    >
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
