"use client";

import { memo } from "react";
import { ProgressView } from "./Progress.view";
import type { ProgressProps } from "./Progress.types";

const ProgressContainer = memo<ProgressProps>(
  ({ progress = "3-2", className = "" }) => {
    const barClasses = `h-[8px] relative w-full`;

    return (
      <ProgressView
        progress={progress}
        className={className}
        barClasses={barClasses}
      />
    );
  },
);

ProgressContainer.displayName = "Progress";

export default ProgressContainer;
