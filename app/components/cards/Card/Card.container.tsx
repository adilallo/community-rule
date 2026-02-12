"use client";

import { memo } from "react";
import { CardView } from "./Card.view";
import type { CardProps } from "./Card.types";

const CardContainer = memo<CardProps>(
  ({
    label,
    supportText = "",
    recommended = false,
    selected = false,
    orientation = "horizontal",
    showInfoIcon = false,
    id,
    className = "",
    onClick,
  }) => {
    const handleClick = () => {
      if (onClick) onClick();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    };

    return (
      <CardView
        label={label}
        supportText={supportText}
        recommended={recommended}
        selected={selected}
        orientation={orientation}
        showInfoIcon={showInfoIcon}
        id={id}
        className={className}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      />
    );
  },
);

CardContainer.displayName = "Card";

export default CardContainer;
