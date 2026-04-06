export interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  /** Rendered below the dialog card (e.g. “Back to home”) on the dimmed backdrop */
  belowCard?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  /**
   * When false, render the overlay in the React tree instead of `document.body`.
   * Use on the dedicated `/login` page so the shell (and heading) mount on first paint
   * without waiting for a portal gate (more reliable across engines).
   */
  usePortal?: boolean;
}

export interface LoginViewProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  belowCard?: React.ReactNode;
  className: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  dialogRef: React.RefObject<HTMLDivElement | null>;
  backdropRef: React.RefObject<HTMLDivElement | null>;
  /** False until client mount — avoids SSR/client HTML mismatch for createPortal. */
  portalReady: boolean;
  usePortal: boolean;
}
