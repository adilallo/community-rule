"use client";

import { memo, useMemo } from "react";
import FeatureGridView from "./FeatureGrid.view";
import type { FeatureGridProps, Feature } from "./FeatureGrid.types";

const FeatureGridContainer = memo<FeatureGridProps>(
  ({ title, subtitle, className = "" }) => {
    const features: Feature[] = useMemo(
      () => [
        {
          backgroundColor: "bg-[var(--color-surface-default-brand-royal)]",
          labelLine1: "Decision-making",
          labelLine2: "support",
          panelContent: "/assets/Feature_Support.png",
          ariaLabel: "Decision-making support tools",
          href: "#decision-making",
        },
        {
          backgroundColor: "bg-[#D1FFE2]",
          labelLine1: "Values alignment",
          labelLine2: "exercises",
          panelContent: "/assets/Feature_Exercises.png",
          ariaLabel: "Values alignment exercises",
          href: "#values-alignment",
        },
        {
          backgroundColor: "bg-[#F4CAFF]",
          labelLine1: "Membership",
          labelLine2: "guidance",
          panelContent: "/assets/Feature_Guidance.png",
          ariaLabel: "Membership guidance resources",
          href: "#membership-guidance",
        },
        {
          backgroundColor: "bg-[#CBDDFF]",
          labelLine1: "Conflict resolution",
          labelLine2: "tools",
          panelContent: "/assets/Feature_Tools.png",
          ariaLabel: "Conflict resolution tools",
          href: "#conflict-resolution",
        },
      ],
      [],
    );

    const labelledBy = title ? "feature-grid-headline" : undefined;

    return (
      <FeatureGridView
        title={title}
        subtitle={subtitle}
        className={className}
        features={features}
        labelledBy={labelledBy}
      />
    );
  },
);

FeatureGridContainer.displayName = "FeatureGrid";

export default FeatureGridContainer;

