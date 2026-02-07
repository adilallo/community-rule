"use client";

import { memo } from "react";
import { ProportionBarView } from "./ProportionBar.view";
import type { ProportionBarProps } from "./ProportionBar.types";

const ProportionBarContainer = memo<ProportionBarProps>(
  ({ progress = "3-2", className = "" }) => {
    const barClasses = `h-[8px] relative w-full`;

    return (
      <ProportionBarView
        progress={progress}
        className={className}
        barClasses={barClasses}
      />
    );
  },
);

ProportionBarContainer.displayName = "ProportionBar";

export default ProportionBarContainer;
