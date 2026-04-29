import { memo } from "react";
import type { MenuItemViewProps } from "./MenuItem.types";

function MenuItemView({
  href,
  buttonOnClick,
  children,
  disabled,
  combinedStyles,
  accessibilityProps,
}: MenuItemViewProps) {
  if (disabled) {
    return (
      <span className={combinedStyles} {...accessibilityProps}>
        {children}
      </span>
    );
  }

  if (buttonOnClick) {
    return (
      <button
        type="button"
        className={combinedStyles}
        onClick={buttonOnClick}
        {...accessibilityProps}
      >
        {children}
      </button>
    );
  }

  return (
    <a href={href} className={combinedStyles} {...accessibilityProps}>
      {children}
    </a>
  );
}

MenuItemView.displayName = "MenuItemView";

export default memo(MenuItemView);
