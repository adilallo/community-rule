export type StepperActive = 1 | 2 | 3 | 4 | 5;

export interface StepperProps {
  active?: StepperActive;
  totalSteps?: number;
  className?: string;
}

export interface StepperViewProps {
  active: StepperActive;
  totalSteps: number;
  className: string;
  stepperClasses: string;
}
