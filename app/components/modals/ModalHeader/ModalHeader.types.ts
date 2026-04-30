export interface ModalHeaderProps {
  onClose?: () => void;
  onMoreOptions?: () => void;
  showCloseButton?: boolean;
  showMoreOptionsButton?: boolean;
  /** When set, used for the close control’s accessible name (e.g. localized). */
  closeButtonAriaLabel?: string;
  /** When set, used for the more-options control’s accessible name (e.g. localized). */
  moreOptionsAriaLabel?: string;
  className?: string;
}
