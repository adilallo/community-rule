"use client";

import { memo } from "react";
import HeaderLockupView from "./HeaderLockup.view";
import type { HeaderLockupProps } from "./HeaderLockup.types";
import {
  normalizeHeaderLockupJustification,
  normalizeHeaderLockupSize,
} from "../../../../lib/propNormalization";

const HeaderLockupContainer = memo<HeaderLockupProps>(
  ({
    title,
    description,
    justification: justificationProp = "left",
    size: sizeProp = "L",
  }) => {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const justification = normalizeHeaderLockupJustification(justificationProp);
    const size = normalizeHeaderLockupSize(sizeProp);

    return (
      <HeaderLockupView
        title={title}
        description={description}
        justification={justification}
        size={size}
      />
    );
  },
);

HeaderLockupContainer.displayName = "HeaderLockup";

export default HeaderLockupContainer;
