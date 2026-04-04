"use client";

import { memo } from "react";
import type { CommunityRuleDocumentProps } from "./CommunityRuleDocument.types";

const SECTION_GAP = "var(--measures-spacing-1200, 64px)";
const TEAL_BG = "var(--color-teal-teal50, #c9fef9)";
const SECTION_LINE_COLOR = "var(--color-border-default-tertiary, #464646)";

function CommunityRuleDocumentView({
  sections,
  className = "",
  useCardStyle = false,
}: CommunityRuleDocumentProps) {
  const rootClass = useCardStyle
    ? `rounded-[12px] bg-white pl-3 border-l-4 ${className}`
    : className;
  const rootStyle = useCardStyle ? { borderLeftColor: TEAL_BG } : undefined;

  const sectionLineStyle = useCardStyle
    ? undefined
    : { borderLeftColor: SECTION_LINE_COLOR };

  return (
    <div
      className={`flex flex-col min-w-0 ${rootClass}`}
      style={{ gap: SECTION_GAP, ...rootStyle }}
    >
      {sections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className={`flex flex-col min-w-0 ${!useCardStyle ? "border-l pl-3" : ""}`}
          style={sectionLineStyle}
        >
          {/* Section content: line runs full height of this block via border-left */}
          <div className="flex flex-1 flex-col gap-4 min-w-0">
            <p className="font-inter font-medium text-[16px] leading-[20px] text-[var(--color-content-invert-secondary,#1f1f1f)] shrink-0">
              {section.categoryName}
            </p>
            <div className="flex flex-col min-w-0" style={{ gap: "24px" }}>
              {section.entries.map((entry, entryIndex) => (
                <div
                  key={entryIndex}
                  className="flex flex-col min-w-0"
                  style={{ gap: "6px" }}
                >
                  <p className="font-inter font-bold text-[20px] leading-[28px] text-[var(--color-content-invert-primary)] shrink-0">
                    {entry.title}
                  </p>
                  <p className="font-inter font-normal text-[14px] leading-[20px] text-[var(--color-content-invert-primary)] shrink-0">
                    {entry.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

CommunityRuleDocumentView.displayName = "CommunityRuleDocumentView";

export default memo(CommunityRuleDocumentView);
