import { memo } from "react";
import type { MenuBarItemViewProps } from "./MenuBarItem.types";

function MenuBarItemView({
  href,
  buttonOnClick,
  children,
  disabled,
  combinedStyles,
  accessibilityProps,
}: MenuBarItemViewProps) {
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

MenuBarItemView.displayName = "MenuBarItemView";

export default memo(MenuBarItemView);
