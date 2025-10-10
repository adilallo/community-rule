"use client";

import React, { forwardRef, memo } from "react";

const ContextMenuSection = forwardRef(
  ({ title, children, className = "", ...props }, ref) => {
    const sectionClasses = `
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <div ref={ref} className={sectionClasses} role="group" {...props}>
        {title && (
          <div className="px-3 py-2">
            <div className="text-[var(--color-content-default-primary)] text-sm font-medium">
              {title}
            </div>
          </div>
        )}
        {children}
      </div>
    );
  }
);

ContextMenuSection.displayName = "ContextMenuSection";

export default memo(ContextMenuSection);
