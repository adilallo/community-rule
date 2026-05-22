"use client";

import { useTranslation } from "../../../contexts/MessagesContext";
import ContentLockup from "../../type/ContentLockup";
import Mini from "../../cards/Mini";
import type { FeatureGridViewProps } from "./FeatureGrid.types";

/** Figma **Section / Feature-Grid** [18847:22410](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=18847-22410&m=dev). */
function FeatureGridView({
  title,
  subtitle,
  className = "",
  features,
  labelledBy,
}: FeatureGridViewProps) {
  const t = useTranslation();
  const ariaLabel = t("featureGrid.ariaLabel");
  const linkText = t("featureGrid.linkText");
  const linkHref = t("featureGrid.linkHref");

  return (
    <section
      className={`p-0 lg:p-[var(--spacing-scale-064)] ${className}`}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
    >
      <div
        data-figma-node="18847-22410"
        className="rounded-[var(--measures-radius-500,20px)] bg-[var(--color-surface-default-secondary)] px-[var(--spacing-scale-020)] py-[var(--spacing-scale-032)] focus-within:ring-2 focus-within:ring-[var(--color-surface-default-brand-royal)] focus-within:ring-offset-2 md:px-[var(--spacing-scale-048)] md:pb-[var(--spacing-scale-048)] md:pt-[var(--spacing-scale-076)] lg:pb-[var(--spacing-scale-076)]"
      >
        <div className="mx-auto w-full gap-[var(--spacing-scale-048)] [container-type:inline-size] lg:flex lg:items-start lg:gap-[var(--spacing-scale-048)]">
          <div className="lg:min-w-0 lg:shrink">
            <ContentLockup
              title={title}
              subtitle={subtitle}
              variant="feature"
              linkText={linkText}
              linkHref={linkHref}
              titleId={labelledBy}
            />
          </div>

          <div className="mt-[var(--spacing-scale-048)] grid grid-cols-2 grid-rows-[repeat(2,minmax(0,1fr))] gap-x-[12px] gap-y-[12px] max-md:min-h-[384px] md:grid-cols-4 md:grid-rows-1 md:min-h-0 lg:mt-0 lg:shrink-0 lg:flex-grow">
            {features.map((feature, index) => (
              <Mini
                key={index}
                backgroundColor={feature.backgroundColor}
                labelLine1={feature.labelLine1}
                labelLine2={feature.labelLine2}
              panelContent={feature.panelContent}
              panelWidth={feature.panelWidth}
              panelHeight={feature.panelHeight}
              panelImageClassName={feature.panelImageClassName}
              ariaLabel={feature.ariaLabel}
                href={feature.href}
                featureGridShell
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureGridView;
