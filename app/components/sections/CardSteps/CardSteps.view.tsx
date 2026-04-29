"use client";

import { useTranslation } from "../../../contexts/MessagesContext";
import SectionHeader from "../../type/SectionHeader";
import Step from "../../cards/Step";
import Button from "../../buttons/Button";
import type { CardStepsViewProps } from "./CardSteps.types";

function CardStepsView({
  title,
  subtitle,
  steps,
  headingDesktopLines,
  schemaJson,
}: CardStepsViewProps) {
  const t = useTranslation();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
      <section className="bg-transparent py-[var(--spacing-scale-032)] px-[var(--spacing-scale-020)] sm:py-[var(--spacing-scale-048)] sm:px-[var(--spacing-scale-032)] lg:py-[var(--spacing-scale-064)] lg:px-[var(--spacing-scale-064)] xl:py-[var(--spacing-scale-076)] xl:px-[var(--spacing-scale-064)]">
        <div className="max-w-[var(--spacing-measures-max-width-lg)] mx-auto">
          <div className="grid grid-cols-1 gap-y-[var(--spacing-scale-032)] sm:gap-y-[var(--spacing-scale-048)] lg:gap-y-[var(--spacing-scale-056)]">
            <div>
              <SectionHeader
                variant="multi-line"
                title={title}
                subtitle={subtitle}
                titleLg={t("cardSteps.titleLg")}
                stackedDesktopLines={headingDesktopLines}
              />
            </div>

            <div className="grid grid-cols-1 gap-y-[var(--spacing-scale-024)] lg:grid-cols-3 lg:gap-[var(--spacing-scale-024)]">
              {steps.map((item, index) => (
                <Step
                  key={index}
                  number={index + 1}
                  text={item.text}
                  iconShape={item.iconShape}
                  iconColor={item.iconColor}
                />
              ))}
            </div>

            <div className="text-center">
              <Button buttonType="outline" palette="default" size="large">
                {t("cardSteps.buttons.seeHowItWorks")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CardStepsView;
