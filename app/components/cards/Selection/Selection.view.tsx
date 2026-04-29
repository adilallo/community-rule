"use client";

import Tag from "../../utility/Tag";
import type { SelectionViewProps } from "./Selection.types";

function InfoIcon() {
  return (
    <span
      className="flex h-[var(--spacing-scale-016)] w-[var(--spacing-scale-016)] shrink-0 items-center justify-center rounded-full border border-[var(--color-content-invert-brand-secondary)] bg-transparent font-inter text-[10px] font-medium leading-none text-[var(--color-content-invert-brand-secondary)]"
      aria-hidden
    >
      ?
    </span>
  );
}

function SelectionTag({
  recommended,
  selected,
}: {
  recommended: boolean;
  selected: boolean;
}) {
  if (selected) return <Tag variant="selected" />;
  if (recommended) return <Tag variant="recommended" />;
  return null;
}

export function SelectionView({
  label,
  supportText,
  recommended,
  selected,
  orientation,
  showInfoIcon,
  id: selectionId,
  className,
  onClick,
  onKeyDown,
}: SelectionViewProps) {
  const borderClass = "border border-[var(--color-border-default-primary)]";
  const selectedBorder = selected
    ? "outline outline-2 outline-dashed outline-black outline-offset-[-2px]"
    : "";

  // Figma: "Card / CardSelection" vertical stack — node `16775:28762` (dev).
  // Prop `orientation="horizontal"` is this stacked layout (historical naming).
  if (orientation === "horizontal") {
    const baseClasses = `select-none rounded-[var(--measures-radius-200,8px)] bg-[var(--color-gray-000)] px-4 py-3 transition-[border-color,box-shadow,outline] duration-200 cursor-pointer ${borderClass} ${selectedBorder} ${className}`;

    return (
      <div
        {...(selectionId ? { "data-card-id": selectionId } : {})}
        role="button"
        tabIndex={0}
        aria-label={supportText ? `${label}: ${supportText}` : label}
        className={`${baseClasses} flex min-h-0 w-full flex-col items-start justify-center gap-1`}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        <SelectionTag recommended={recommended} selected={selected} />
        <span className="w-full font-inter text-base font-medium leading-5 text-[var(--color-content-invert-secondary)]">
          {label}
        </span>
        {supportText ? (
          <p className="w-full font-inter text-xs font-normal leading-4 text-[var(--color-content-invert-tertiary)]">
            {supportText}
          </p>
        ) : null}
      </div>
    );
  }

  const baseClasses = `select-none rounded-[var(--measures-radius-200,8px)] bg-[var(--color-gray-000)] p-4 transition-[border-color,box-shadow,outline] duration-200 cursor-pointer ${borderClass} ${selectedBorder} ${className}`;

  return (
    <div
      {...(selectionId ? { "data-card-id": selectionId } : {})}
      role="button"
      tabIndex={0}
      aria-label={supportText ? `${label}: ${supportText}` : label}
      className={`${baseClasses} flex flex-row items-center justify-between gap-4`}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="font-inter text-base font-medium leading-5 text-[var(--color-content-invert-secondary)]">
            {label}
          </span>
          {showInfoIcon ? <InfoIcon /> : null}
        </div>
        {supportText ? (
          <p className="font-inter text-xs font-normal leading-4 text-[var(--color-content-invert-tertiary)]">
            {supportText}
          </p>
        ) : null}
      </div>
      <div className="shrink-0">
        <SelectionTag recommended={recommended} selected={selected} />
      </div>
    </div>
  );
}
