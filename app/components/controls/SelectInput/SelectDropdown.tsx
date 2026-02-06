"use client";

import { forwardRef, memo } from "react";

interface SelectDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const SelectDropdown = forwardRef<HTMLDivElement, SelectDropdownProps>(
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
        role="listbox"
        aria-label="Select an option"
        style={{ backgroundColor: "#000000" }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

SelectDropdown.displayName = "SelectDropdown";

export default memo(SelectDropdown);
