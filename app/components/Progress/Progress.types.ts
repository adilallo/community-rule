export type ProgressBarState =
  | "1-0"
  | "1-1"
  | "1-2"
  | "1-3"
  | "1-4"
  | "1-5"
  | "2-0"
  | "2-1"
  | "2-2"
  | "3-0"
  | "3-1"
  | "3-2";

export interface ProgressProps {
  progress?: ProgressBarState;
  className?: string;
}

export interface ProgressViewProps {
  progress: ProgressBarState;
  className: string;
  barClasses: string;
}
