import ContentLockup from "../ContentLockup";
import MiniCard from "../MiniCard";
import type { FeatureGridViewProps } from "./FeatureGrid.types";

function FeatureGridView({
  title,
  subtitle,
  className = "",
  features,
  labelledBy,
}: FeatureGridViewProps) {
  return (
    <section
      className={`p-0 lg:p-[var(--spacing-scale-064)] ${className}`}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : "Feature tools and services"}
    >
      <div className="py-[var(--spacing-scale-032)] px-[var(--spacing-scale-020)] md:pt-[var(--spacing-scale-076)] md:pb-[var(--spacing-scale-048)] lg:pb-[var(--spacing-scale-076)] md:px-[var(--spacing-scale-048)] bg-[#171717] rounded-[var(--radius-measures-radius-xlarge)] focus-within:ring-2 focus-within:ring-[var(--color-surface-default-brand-royal)] focus-within:ring-offset-2">
        <div className="w-full mx-auto gap-[var(--spacing-scale-048)] lg:flex lg:items-start lg:gap-[var(--spacing-scale-048)] [container-type:inline-size]">
          {/* Feature Content Lockup */}
          <div className="lg:shrink lg:min-w-0">
            <ContentLockup
              title={title}
              subtitle={subtitle}
              variant="feature"
              linkText="Learn more"
              linkHref="#"
              titleId={labelledBy}
            />
          </div>

          {/* MiniCard Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-scale-012)] mt-[var(--spacing-scale-048)] lg:mt-0 lg:flex-grow lg:shrink-0">
            {features.map((feature, index) => (
              <MiniCard
                key={index}
                backgroundColor={feature.backgroundColor}
                labelLine1={feature.labelLine1}
                labelLine2={feature.labelLine2}
                panelContent={feature.panelContent}
                ariaLabel={feature.ariaLabel}
                href={feature.href}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureGridView;
