import { memo } from "react";
import type { NavigationItemViewProps } from "./NavigationItem.types";

function NavigationItemView({
  href,
  children,
  disabled,
  combinedStyles,
  ...props
}: NavigationItemViewProps) {
  if (disabled) {
    return (
      <span className={combinedStyles} {...props}>
        {children}
      </span>
    );
  }

  return (
    <a href={href} className={combinedStyles} {...props}>
      {children}
    </a>
  );
}

NavigationItemView.displayName = "NavigationItemView";

export default memo(NavigationItemView);
