"use client";

/**
 * Figma: "Section / Feature-Grid" (18847:22410)
 */

import { memo, useMemo } from "react";
import { getAssetPath, featurePanelLayout, featurePanelPath } from "../../../../lib/assetUtils";
import { useTranslation } from "../../../contexts/MessagesContext";
import FeatureGridView from "./FeatureGrid.view";
import type { FeatureGridProps, Feature } from "./FeatureGrid.types";

const FeatureGridContainer = memo<FeatureGridProps>(
  ({ title, subtitle, className = "" }) => {
    const t = useTranslation();

    const features: Feature[] = useMemo(
      () => [
        {
          backgroundColor: "bg-[var(--color-surface-invert-brand-royal)]",
          labelLine1: t(
            "pages.home.featureGrid.features.decisionMaking.labelLine1",
          ),
          labelLine2: t(
            "pages.home.featureGrid.features.decisionMaking.labelLine2",
          ),
          panelContent: getAssetPath(featurePanelPath("support")),
          ...featurePanelLayout("support"),
          ariaLabel: t("featureGrid.features.decisionMaking.ariaLabel"),
        },
        {
          backgroundColor: "bg-[var(--color-surface-invert-brand-lime)]",
          labelLine1: t(
            "pages.home.featureGrid.features.valuesAlignment.labelLine1",
          ),
          labelLine2: t(
            "pages.home.featureGrid.features.valuesAlignment.labelLine2",
          ),
          panelContent: getAssetPath(featurePanelPath("exercises")),
          ...featurePanelLayout("exercises"),
          ariaLabel: t("featureGrid.features.valuesAlignment.ariaLabel"),
        },
        {
          backgroundColor: "bg-[var(--color-surface-invert-brand-rust)]",
          labelLine1: t(
            "pages.home.featureGrid.features.membershipGuidance.labelLine1",
          ),
          labelLine2: t(
            "pages.home.featureGrid.features.membershipGuidance.labelLine2",
          ),
          panelContent: getAssetPath(featurePanelPath("guidance")),
          ...featurePanelLayout("guidance"),
          ariaLabel: t("featureGrid.features.membershipGuidance.ariaLabel"),
        },
        {
          backgroundColor: "bg-[var(--color-surface-invert-brand-teal)]",
          labelLine1: t(
            "pages.home.featureGrid.features.conflictResolution.labelLine1",
          ),
          labelLine2: t(
            "pages.home.featureGrid.features.conflictResolution.labelLine2",
          ),
          panelContent: getAssetPath(featurePanelPath("tools")),
          ...featurePanelLayout("tools"),
          ariaLabel: t("featureGrid.features.conflictResolution.ariaLabel"),
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
