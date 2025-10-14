"use client";

import React, { forwardRef, memo } from "react";

const ContextMenu = forwardRef(
  ({ className = "", children, ...props }, ref) => {
    const menuClasses = `
      bg-black
      border border-[var(--color-border-default-tertiary)]
      rounded-[var(--measures-radius-medium)]
      shadow-lg
      p-[4px]
      min-w-[200px]
      max-w-[300px]
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <div
        ref={ref}
        className={menuClasses}
        role="menu"
        style={{ backgroundColor: "#000000" }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ContextMenu.displayName = "ContextMenu";

export default memo(ContextMenu);
