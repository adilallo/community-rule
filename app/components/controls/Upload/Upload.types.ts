export interface UploadProps {
  /**
   * Whether the upload component is in active state.
   * When active, button has white background with black text.
   * When inactive, button has dark background with gray text.
   * @default true
   */
  active?: boolean;
  /**
   * Label text displayed above the upload component
   */
  label?: string;
  /**
   * Whether to show help icon next to label
   * @default true
   */
  showHelpIcon?: boolean;
  /**
   * Callback when upload button is clicked
   */
  onClick?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface UploadViewProps {
  active: boolean;
  label?: string;
  showHelpIcon: boolean;
  onClick?: () => void;
  className: string;
}
