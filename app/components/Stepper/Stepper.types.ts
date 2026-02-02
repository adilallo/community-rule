export type StepperActive = number;

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
