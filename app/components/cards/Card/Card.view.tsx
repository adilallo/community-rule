"use client";

import Tag from "../../utility/Tag";
import type { CardViewProps } from "./Card.types";

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

function CardTag({
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

export function CardView({
  label,
  supportText,
  recommended,
  selected,
  orientation,
  showInfoIcon,
  id: cardId,
  className,
  onClick,
  onKeyDown,
}: CardViewProps) {
  const borderClass = "border border-[var(--color-border-default-primary)]";
  const selectedBorder = selected
    ? "outline outline-2 outline-dashed outline-black outline-offset-[-2px]"
    : "";
  const baseClasses = `rounded-[var(--radius-measures-radius-small)] bg-[#FFFFFF] p-4 transition-all duration-200 cursor-pointer ${borderClass} ${selectedBorder} ${className}`;

  if (orientation === "horizontal") {
    return (
      <div
        {...(cardId ? { "data-card-id": cardId } : {})}
        role="button"
        tabIndex={0}
        aria-label={supportText ? `${label}: ${supportText}` : label}
        className={baseClasses}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        <div className="flex flex-col gap-2 items-start w-full">
          <CardTag recommended={recommended} selected={selected} />
          <span className="font-inter text-base font-semibold leading-6 text-black w-full">
            {label}
          </span>
          {supportText ? (
            <p className="font-inter text-sm font-normal leading-5 text-black w-full">
              {supportText}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      {...(cardId ? { "data-card-id": cardId } : {})}
      role="button"
      tabIndex={0}
      aria-label={supportText ? `${label}: ${supportText}` : label}
      className={`${baseClasses} flex flex-row items-center justify-between gap-4`}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <div className="min-w-0 flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-inter text-base font-semibold leading-6 text-black">
            {label}
          </span>
          {showInfoIcon ? <InfoIcon /> : null}
        </div>
        {supportText ? (
          <p className="font-inter text-sm font-normal leading-5 text-black">
            {supportText}
          </p>
        ) : null}
      </div>
      <div className="shrink-0">
        <CardTag recommended={recommended} selected={selected} />
      </div>
    </div>
  );
}
