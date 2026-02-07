import type { StepperViewProps } from "./Stepper.types";

export function StepperView({
  active,
  totalSteps,
  className,
  stepperClasses,
}: StepperViewProps) {
  return (
    <div
      className={`${stepperClasses} ${className}`}
      role="progressbar"
      aria-valuenow={active}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${active} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === active;

        return (
          <div
            key={stepNumber}
            className="shrink-0 w-[12px] h-[12px] flex items-center justify-center"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className={isActive ? "opacity-100" : "opacity-30"}
            >
              <circle
                cx="6"
                cy="6"
                r="5.5"
                fill="var(--color-surface-inverse-secondary)"
                stroke="var(--color-surface-inverse-secondary)"
                strokeWidth="1"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
