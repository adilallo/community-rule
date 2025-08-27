"use client";

import React from "react";
import ContentLockup from "./ContentLockup";
import MiniCard from "./MiniCard";

const FeatureGrid = ({ title, subtitle, className = "" }) => {
  return (
    <section
      className={`p-0 lg:p-[var(--spacing-scale-064)] py-[var(--spacing-scale-032)] px-[var(--spacing-scale-020)] md:pt-[var(--spacing-scale-076)] md:pb-[var(--spacing-scale-048)] lg:pb-[var(--spacing-scale-076)] md:px-[var(--spacing-scale-048)] bg-[#171717] rounded-[var(--radius-measures-radius-xlarge)] focus-within:ring-2 focus-within:ring-[var(--color-surface-default-brand-royal)] focus-within:ring-offset-2 ${className}`}
      aria-labelledby="feature-grid-headline"
      role="region"
      tabIndex={-1}
    >
      <div className="w-full mx-auto gap-[var(--spacing-scale-048)] lg:flex lg:items-start lg:gap-[var(--spacing-scale-048)] [container-type:inline-size]">
        {/* Feature Content Lockup */}
        <div className="lg:shrink lg:min-w-0">
          <ContentLockup
            title={title}
            subtitle={subtitle}
            variant="feature"
            linkText="Learn more"
            linkHref="#"
          />
        </div>

        {/* MiniCard Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-scale-012)] mt-[var(--spacing-scale-048)] lg:mt-0 lg:flex-grow lg:shrink-0"
          role="grid"
          aria-label="Feature tools and services"
        >
          <MiniCard
            backgroundColor="bg-[var(--color-surface-default-brand-royal)]"
            labelLine1="Decision-making"
            labelLine2="support"
            panelContent="assets/Feature_Support.png"
            ariaLabel="Decision-making support tools"
            href="#decision-making"
          />
          <MiniCard
            backgroundColor="bg-[#D1FFE2]"
            labelLine1="Values alignment"
            labelLine2="exercises"
            panelContent="assets/Feature_Exercises.png"
            ariaLabel="Values alignment exercises"
            href="#values-alignment"
          />
          <MiniCard
            backgroundColor="bg-[#F4CAFF]"
            labelLine1="Membership"
            labelLine2="guidance"
            panelContent="assets/Feature_Guidance.png"
            ariaLabel="Membership guidance resources"
            href="#membership-guidance"
          />
          <MiniCard
            backgroundColor="bg-[#CBDDFF]"
            labelLine1="Conflict resolution"
            labelLine2="tools"
            panelContent="assets/Feature_Tools.png"
            ariaLabel="Conflict resolution tools"
            href="#conflict-resolution"
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
