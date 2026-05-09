import type { IconName } from "../../asset/icon";

export interface ModalHeaderMenuItem {
  id: string;
  label: string;
  leadingIcon: IconName;
  onClick?: () => void;
  /** Kebab rows only; omit for default lockup styling. */
  variant?: "default" | "destructive";
}

export interface ModalHeaderProps {
  onClose?: () => void;
  onMoreOptions?: () => void;
  showCloseButton?: boolean;
  showMoreOptionsButton?: boolean;
  /** When set, used for the close control’s accessible name (e.g. localized). */
  closeButtonAriaLabel?: string;
  /** When set, used for the more-options control’s accessible name (e.g. localized). */
  moreOptionsAriaLabel?: string;
  menuAriaLabel?: string;
  menuItems?: ModalHeaderMenuItem[];
  menuId?: string;
  menuOpen?: boolean;
  onToggleMenu?: () => void;
  onMenuItemClick?: (_item: ModalHeaderMenuItem) => void;
  className?: string;
}
