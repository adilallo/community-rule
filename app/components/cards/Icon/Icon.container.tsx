"use client";

import { memo } from "react";
import { IconView } from "./Icon.view";
import type { IconProps } from "./Icon.types";

const IconContainer = memo<IconProps>(
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
      <IconView
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

IconContainer.displayName = "Icon";

export default IconContainer;
