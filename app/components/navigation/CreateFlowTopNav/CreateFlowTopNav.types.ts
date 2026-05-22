/**
 * Type definitions for CreateFlowTopNav component
 *
 * Top navigation bar for the create rule flow.
 * Includes logo and action buttons (Share, Export, Edit, Exit).
 */

import type { Dispatch, RefObject, SetStateAction } from "react";
import type { IconName } from "../../asset/icon";

export type CreateFlowTopNavActionMenuItem = {
  id: string;
  label: string;
  leadingIcon: IconName;
  onClick: () => void;
};

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
   * Whether to show Duplicate instead of Edit (marketing completed demos).
   * @default false
   */
  hasDuplicate?: boolean;
  /**
   * Whether to show **Manage Stakeholders** (published-rule invite management).
   * Used on `/create/edit-rule` only.
   * @default false
   */
  hasManageStakeholders?: boolean;
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
   * Callback when Duplicate button is clicked
   */
  onDuplicate?: () => void;
  /**
   * Override exit button label (e.g. "Return" on marketing demos).
   */
  exitLabel?: string;
  /** Label for Duplicate when {@link hasDuplicate} is true. */
  duplicateLabel?: string;
  duplicateAriaLabel?: string;
  /**
   * Callback when Manage Stakeholders is clicked
   */
  onManageStakeholders?: () => void;
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

/** Resolved copy and menu state; supplied by the container. */
export type CreateFlowTopNavViewProps = CreateFlowTopNavProps & {
  exitButtonText: string;
  useKebabMenu: boolean;
  exportMenuOpen: boolean;
  setExportMenuOpen: Dispatch<SetStateAction<boolean>>;
  actionsMenuOpen: boolean;
  setActionsMenuOpen: Dispatch<SetStateAction<boolean>>;
  exportWrapRef: RefObject<HTMLDivElement | null>;
  actionsWrapRef: RefObject<HTMLDivElement | null>;
  exportMenuId: string;
  actionsMenuId: string;
  actionMenuItems: CreateFlowTopNavActionMenuItem[];
  exportPopoverMenuAriaLabel: string;
  exportPopoverPdfLabel: string;
  exportPopoverCsvLabel: string;
  exportPopoverMarkdownLabel: string;
  moreOptionsAriaLabel: string;
  actionsMenuAriaLabel: string;
  shareLabel: string;
  exportLabel: string;
  editLabel: string;
  manageStakeholdersLabel: string;
  shareAriaLabel: string;
  exportAriaLabel: string;
  editAriaLabel: string;
  manageStakeholdersAriaLabel: string;
  bannerAriaLabel: string;
  navAriaLabel: string;
};
