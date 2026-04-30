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
   * When true, exit control is "Save & Exit" and `onExit` receives `{ saveDraft: true }`.
   * When false, shows "Exit" and `{ saveDraft: false }` (caller may confirm data loss).
   * @default false
   */
  saveDraftOnExit?: boolean;
  /**
   * Callback when Share button is clicked
   */
  onShare?: () => void;
  /**
   * Callback when user picks an export format from the Export menu.
   */
  onSelectExportFormat?: (_format: "pdf" | "csv" | "markdown") => void;
  /**
   * Callback when Edit button is clicked
   */
  onEdit?: () => void;
  /**
   * Callback when Exit/Save & Exit button is clicked.
   * When `saveDraftOnExit` is true, called with `{ saveDraft: true }`.
   */
  onExit?: (options?: { saveDraft?: boolean }) => void;
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

/** Resolved copy for the export popover; supplied by the container. */
export type CreateFlowTopNavViewProps = CreateFlowTopNavProps & {
  exportPopoverMenuAriaLabel: string;
  exportPopoverPdfLabel: string;
  exportPopoverCsvLabel: string;
  exportPopoverMarkdownLabel: string;
};
