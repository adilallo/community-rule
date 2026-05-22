"use client";

/**
 * Figma: "Card / Icon" (see registry)
 */

import { memo, useId } from "react";
import { IconView } from "./Icon.view";
import type { IconProps } from "./Icon.types";

const IconContainer = memo<IconProps>(
  ({ icon, title, description, className = "", onClick, interactive: interactiveProp = true }) => {
    const layoutTitleId = useId();

    const handleClick = () => {
      if (!interactiveProp) return;
      if (onClick) onClick();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!interactiveProp) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    };

    return (
      <IconView
        icon={icon}
        title={title}
        description={description}
        className={className}
        interactive={interactiveProp}
        layoutTitleId={layoutTitleId}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      />
    );
  },
);

IconContainer.displayName = "Icon";

export default IconContainer;
