import { memo } from "react";
import type { MenuBarItemViewProps } from "./MenuBarItem.types";

function MenuBarItemView({
  href,
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

  return (
    <a href={href} className={combinedStyles} {...accessibilityProps}>
      {children}
    </a>
  );
}

MenuBarItemView.displayName = "MenuBarItemView";

export default memo(MenuBarItemView);
