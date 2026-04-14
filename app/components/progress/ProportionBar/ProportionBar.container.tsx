"use client";

import { memo } from "react";
import { normalizeProportionBarVariant } from "../../../../lib/propNormalization";
import { ProportionBarView } from "./ProportionBar.view";
import type { ProportionBarProps } from "./ProportionBar.types";

const ProportionBarContainer = memo<ProportionBarProps>(
  ({ progress = "3-2", className = "", variant: variantProp }) => {
    const variant = normalizeProportionBarVariant(variantProp);
    const barClasses = `h-[8px] relative w-full`;

    return (
      <ProportionBarView
        progress={progress}
        className={className}
        barClasses={barClasses}
        variant={variant}
      />
    );
  },
);

ProportionBarContainer.displayName = "ProportionBar";

export default ProportionBarContainer;
