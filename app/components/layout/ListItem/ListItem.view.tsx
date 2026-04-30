"use client";

import { memo } from "react";
import Icon from "../../asset/icon";
import type { ListItemProps } from "./ListItem.types";

export const ListItemView = memo(function ListItemView({
  label,
  leadingIcon,
  onClick,
  showDivider,
  className = "",
}: ListItemProps) {
  const dividerClass = showDivider
    ? "border-b border-solid border-[var(--color-border-default-tertiary)]"
    : "";

  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`relative flex w-full shrink-0 cursor-pointer items-center gap-[6px] px-[4px] py-[16px] text-left hover:bg-[var(--color-surface-default-tertiary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-invert-primary)] ${dividerClass} ${className}`}
    >
      <span className="flex size-6 shrink-0 items-center justify-center overflow-visible text-[var(--color-content-default-primary)]">
        <Icon name={leadingIcon} size={24} />
      </span>
      <span className="min-w-0 flex-1 text-left font-inter text-[12px] font-normal leading-4 whitespace-normal text-[var(--color-content-default-primary)]">
        {label}
      </span>
    </button>
  );
});

ListItemView.displayName = "ListItemView";
