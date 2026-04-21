"use client";

import { memo } from "react";
import HeaderLockupView from "./HeaderLockup.view";
import type { HeaderLockupProps } from "./HeaderLockup.types";

const HeaderLockupContainer = memo<HeaderLockupProps>(
  ({
    title,
    description,
    justification: justificationProp = "left",
    size: sizeProp = "L",
    palette: paletteProp = "default",
  }) => {
    const justification = justificationProp;
    const size = sizeProp;
    const palette = paletteProp;

    return (
      <HeaderLockupView
        title={title}
        description={description}
        justification={justification}
        size={size}
        palette={palette}
      />
    );
  },
);

HeaderLockupContainer.displayName = "HeaderLockup";

export default HeaderLockupContainer;
