import type {
  ProportionBarState,
  ProportionBarVariant,
} from "../../progress/ProportionBar/ProportionBar.types";

/**
 * Type definitions for CreateFlowFooter component
 *
 * Footer component for the create rule flow with progress bar and buttons.
 */
export interface CreateFlowFooterProps {
  /**
   * The second button (typically "Next" button) to display on the right side
   */
  secondButton?: React.ReactNode;
  /**
   * Whether to show the progress bar
   * @default true
   */
  progressBar?: boolean;
  /**
   * `ProportionBar` state when the bar is shown (driven by create-flow step).
   * @default "1-0"
   */
  proportionBarProgress?: ProportionBarState;
  /**
   * `ProportionBar` layout variant (Figma create-flow footer uses `segmented`).
   * @default "default"
   */
  proportionBarVariant?: ProportionBarVariant;
  /**
   * Callback function for Back button click
   */
  onBackClick?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}
