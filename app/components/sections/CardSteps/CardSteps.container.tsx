"use client";

import { memo } from "react";
import { useSchemaData } from "../../../hooks";
import CardStepsView from "./CardSteps.view";
import type { CardStepsProps } from "./CardSteps.types";

/**
 * Figma: "Community Rule System" → Sections → SectionCardSteps ([17434:19695](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=17434-19695)).
 * Composes **`cards/Step`** (Figma Card / Step), not **`progress/Stepper`**.
 */
const CardStepsContainer = memo<CardStepsProps>(
  ({ title, subtitle, steps, headingDesktopLines }) => {
    const schemaData = useSchemaData({
      type: "HowTo",
      name: title,
      description: subtitle,
      steps: steps.map((item) => ({
        name: item.text,
        text: item.text,
      })),
    });

    const schemaJson = JSON.stringify(schemaData);

    return (
      <CardStepsView
        title={title}
        subtitle={subtitle}
        steps={steps}
        headingDesktopLines={headingDesktopLines}
        schemaJson={schemaJson}
      />
    );
  },
);

CardStepsContainer.displayName = "CardSteps";

export default CardStepsContainer;
