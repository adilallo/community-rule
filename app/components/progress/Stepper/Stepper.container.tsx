"use client";

import { memo } from "react";
import { StepperView } from "./Stepper.view";
import type { StepperProps } from "./Stepper.types";

const StepperContainer = memo<StepperProps>(
  ({ active = 1, totalSteps = 5, className = "" }) => {
    const stepperClasses = `flex gap-[var(--spacing-scale-012)] items-center relative`;

    return (
      <StepperView
        active={active}
        totalSteps={totalSteps}
        className={className}
        stepperClasses={stepperClasses}
      />
    );
  },
);

StepperContainer.displayName = "Stepper";

export default StepperContainer;
