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
   * Additional CSS classes
   */
  className?: string;
}
