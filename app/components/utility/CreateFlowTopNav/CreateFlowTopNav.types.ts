/**
 * Type definitions for CreateFlowTopNav component
 *
 * Top navigation bar for the create rule flow.
 * Includes logo and action buttons (Share, Export, Edit, Exit).
 */

export interface CreateFlowTopNavProps {
  /**
   * Whether to show the Share button
   * @default false
   */
  hasShare?: boolean;
  /**
   * Whether to show the Export button
   * @default false
   */
  hasExport?: boolean;
  /**
   * Whether to show the Edit button
   * @default false
   */
  hasEdit?: boolean;
  /**
   * Whether the user is logged in
   * @default false
   */
  loggedIn?: boolean;
  /**
   * Callback when Share button is clicked
   */
  onShare?: () => void;
  /**
   * Callback when Export button is clicked
   */
  onExport?: () => void;
  /**
   * Callback when Edit button is clicked
   */
  onEdit?: () => void;
  /**
   * Callback when Exit/Save & Exit button is clicked
   */
  onExit?: () => void;
  /**
   * Palette for nav buttons (e.g. "inverse" on completed page to match teal background)
   * @default "default"
   */
  buttonPalette?: "default" | "inverse";
  /**
   * Additional CSS classes
   */
  className?: string;
}
