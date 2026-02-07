"use client";

import { memo } from "react";
import { useSchemaData } from "../../../hooks";
import NumberedCardsView from "./NumberedCards.view";
import type { NumberedCardsProps } from "./NumberedCards.types";

const NumberedCardsContainer = memo<NumberedCardsProps>(
  ({ title, subtitle, cards }) => {
    const schemaData = useSchemaData({
      type: "HowTo",
      name: title,
      description: subtitle,
      steps: cards.map((card) => ({
        name: card.text,
        text: card.text,
      })),
    });

    const schemaJson = JSON.stringify(schemaData);

    return (
      <NumberedCardsView
        title={title}
        subtitle={subtitle}
        cards={cards}
        schemaJson={schemaJson}
      />
    );
  },
);

NumberedCardsContainer.displayName = "NumberedCards";

export default NumberedCardsContainer;
