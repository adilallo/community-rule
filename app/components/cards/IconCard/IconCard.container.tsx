"use client";

import { memo } from "react";
import { IconCardView } from "./IconCard.view";
import type { IconCardProps } from "./IconCard.types";

const IconCardContainer = memo<IconCardProps>(
  ({ icon, title, description, className = "", onClick }) => {
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
      <IconCardView
        icon={icon}
        title={title}
        description={description}
        className={className}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      />
    );
  },
);

IconCardContainer.displayName = "IconCard";

export default IconCardContainer;
