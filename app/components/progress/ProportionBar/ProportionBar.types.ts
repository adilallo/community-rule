export type ProportionBarState =
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

export interface ProportionBarProps {
  progress?: ProportionBarState;
  className?: string;
}

export interface ProportionBarViewProps {
  progress: ProportionBarState;
  className: string;
  barClasses: string;
}
