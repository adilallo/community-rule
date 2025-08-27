"use client";

import React from "react";
import ContentLockup from "./ContentLockup";
import MiniCard from "./MiniCard";

const FeatureGrid = ({ title, subtitle, className = "" }) => {
  return (
    <section
      className={`py-[var(--spacing-scale-032)] px-[var(--spacing-scale-020)] md:pt-[var(--spacing-scale-076)] md:pb-[var(--spacing-scale-048)] md:px-[var(--spacing-scale-048)] bg-transparent ${className}`}
      aria-labelledby="feature-grid-headline"
      role="region"
    >
      <div className="max-w-[1200px] mx-auto gap-[var(--spacing-scale-048)]">
        {/* Feature Content Lockup */}
        <ContentLockup
          title={title}
          subtitle={subtitle}
          variant="feature"
          linkText="Learn more"
          linkHref="#"
        />

        {/* MiniCard Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-scale-012)] mt-[var(--spacing-scale-048)]">
          <MiniCard
            backgroundColor="bg-[var(--color-surface-default-brand-royal)]"
            labelLine1="Decision-making"
            labelLine2="support"
            panelContent="assets/Feature_Support.png"
          />
          <MiniCard
            backgroundColor="bg-[#D1FFE2]"
            labelLine1="Values alignment"
            labelLine2="exercises"
            panelContent="assets/Feature_Exercises.png"
          />
          <MiniCard
            backgroundColor="bg-[#F4CAFF]"
            labelLine1="Membership"
            labelLine2="guidance"
            panelContent="assets/Feature_Guidance.png"
          />
          <MiniCard
            backgroundColor="bg-[#CBDDFF]"
            labelLine1="Conflict resolution"
            labelLine2="tools"
            panelContent="assets/Feature_Tools.png"
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
