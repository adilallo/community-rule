import type { ReactNode, RefObject } from "react";
import type { CreateModalBackdropVariant } from "../Create/CreateModalFrame.view";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Primary actions row (e.g. Cancel + Confirm) — use design-system `Button`s. */
  footer: ReactNode;
  /** Optional body below the title block (scrolls when tall). */
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  /**
   * Same backdrop options as the Create modal shell.
   * @default "default"
   */
  backdropVariant?: CreateModalBackdropVariant;
}

export interface DialogViewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer: ReactNode;
  children?: ReactNode;
  className: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  titleId: string;
  backdropVariant: CreateModalBackdropVariant;
  overlayRef: RefObject<HTMLDivElement | null>;
  dialogRef: RefObject<HTMLDivElement | null>;
}
