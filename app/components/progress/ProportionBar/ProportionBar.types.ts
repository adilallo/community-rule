import type { ProportionBarVariantValue } from "../../../../lib/propNormalization";

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
  | "2-3"
  | "3-0"
  | "3-1"
  | "3-2";

export type ProportionBarVariant = ProportionBarVariantValue;

export interface ProportionBarProps {
  progress?: ProportionBarState;
  className?: string;
  /**
   * Kept for backwards compatibility. Both `default` and `segmented` render the
   * same fill geometry. Future variants can differentiate here without API
   * changes.
   */
  variant?: ProportionBarVariant;
}

export interface ProportionBarViewProps {
  progress: ProportionBarState;
  className: string;
  barClasses: string;
  variant: "default" | "segmented";
}
