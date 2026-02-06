"use client";

import { forwardRef, memo } from "react";

interface ContextMenuSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const ContextMenuSection = forwardRef<HTMLDivElement, ContextMenuSectionProps>(
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
  },
);

ContextMenuSection.displayName = "ContextMenuSection";

export default memo(ContextMenuSection);
