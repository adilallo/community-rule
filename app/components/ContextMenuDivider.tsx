"use client";

import { forwardRef, memo } from "react";

interface ContextMenuDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const ContextMenuDivider = forwardRef<HTMLDivElement, ContextMenuDividerProps>(
  ({ className = "", ...props }, ref) => {
    const dividerClasses = `
    border-t border-[var(--color-border-default-tertiary)]
    my-1
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <div ref={ref} className={dividerClasses} role="separator" {...props} />
    );
  },
);

ContextMenuDivider.displayName = "ContextMenuDivider";

export default memo(ContextMenuDivider);
