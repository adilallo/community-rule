"use client";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import HeaderLockup from "../../components/type/HeaderLockup";

/**
 * Final review step (right before completed).
 * Figma: 20907-212767
 */
export default function FinalReviewPage() {
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");

  return (
    <div className="w-full flex flex-col items-center px-[var(--spacing-measures-spacing-500,20px)] md:px-[64px]">
      <div className="flex flex-col gap-[48px] items-center w-full max-w-[640px]">
        <HeaderLockup
          title="Review before submitting"
          description="One last look at your CommunityRule before you complete. Submit when you're ready."
          justification={isMdOrLarger ? "center" : "left"}
          size={isMdOrLarger ? "L" : "M"}
        />
        {/* Content area: summary or checklist can be added per Figma */}
      </div>
    </div>
  );
}
