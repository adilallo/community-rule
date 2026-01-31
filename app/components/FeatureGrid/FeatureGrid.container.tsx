"use client";

import { memo, useMemo } from "react";
import { useTranslation } from "../../contexts/MessagesContext";
import FeatureGridView from "./FeatureGrid.view";
import type { FeatureGridProps, Feature } from "./FeatureGrid.types";

const FeatureGridContainer = memo<FeatureGridProps>(
  ({ title, subtitle, className = "" }) => {
    const t = useTranslation();

    const features: Feature[] = useMemo(
      () => [
        {
          backgroundColor: "bg-[var(--color-surface-default-brand-royal)]",
          labelLine1: t(
            "pages.home.featureGrid.features.decisionMaking.labelLine1",
          ),
          labelLine2: t(
            "pages.home.featureGrid.features.decisionMaking.labelLine2",
          ),
          panelContent: "/assets/Feature_Support.png",
          ariaLabel: t("featureGrid.features.decisionMaking.ariaLabel"),
          href: "#decision-making",
        },
        {
          backgroundColor: "bg-[#D1FFE2]",
          labelLine1: t(
            "pages.home.featureGrid.features.valuesAlignment.labelLine1",
          ),
          labelLine2: t(
            "pages.home.featureGrid.features.valuesAlignment.labelLine2",
          ),
          panelContent: "/assets/Feature_Exercises.png",
          ariaLabel: t("featureGrid.features.valuesAlignment.ariaLabel"),
          href: "#values-alignment",
        },
        {
          backgroundColor: "bg-[#F4CAFF]",
          labelLine1: t(
            "pages.home.featureGrid.features.membershipGuidance.labelLine1",
          ),
          labelLine2: t(
            "pages.home.featureGrid.features.membershipGuidance.labelLine2",
          ),
          panelContent: "/assets/Feature_Guidance.png",
          ariaLabel: t("featureGrid.features.membershipGuidance.ariaLabel"),
          href: "#membership-guidance",
        },
        {
          backgroundColor: "bg-[#CBDDFF]",
          labelLine1: t(
            "pages.home.featureGrid.features.conflictResolution.labelLine1",
          ),
          labelLine2: t(
            "pages.home.featureGrid.features.conflictResolution.labelLine2",
          ),
          panelContent: "/assets/Feature_Tools.png",
          ariaLabel: t("featureGrid.features.conflictResolution.ariaLabel"),
          href: "#conflict-resolution",
        },
      ],
      [t],
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
