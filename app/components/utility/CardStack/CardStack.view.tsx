"use client";

import HeaderLockup from "../../type/HeaderLockup";
import Card from "../../cards/Card";
import type { CardStackViewProps } from "./CardStack.types";

export function CardStackView({
  cards,
  selectedIds,
  onCardSelect,
  expanded,
  onToggleExpand,
  hasMore,
  toggleLabel,
  showLessLabel,
  title,
  description,
  className,
}: CardStackViewProps) {
  const isSelected = (id: string) => selectedIds.includes(id);
  // Compact: recommended only (up to 5). Expanded: all cards.
  const compactCards = cards
    .filter((c) => c.recommended ?? false)
    .slice(0, 5);

  return (
    <div className={`flex w-full flex-col gap-6 min-w-0 ${className}`}>
      {(title || description) ? (
        <div className="min-w-0">
          <HeaderLockup
            title={title}
            description={description}
            justification="center"
            size="L"
          />
        </div>
      ) : null}

      {expanded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 w-full">
          {cards.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              label={item.label}
              supportText={item.supportText}
              recommended={item.recommended ?? false}
              selected={isSelected(item.id)}
              orientation="vertical"
              showInfoIcon={true}
              onClick={() => onCardSelect(item.id)}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Compact under 640: single column, up to 5 recommended cards */}
          <div className="flex flex-col gap-6 w-full md:hidden">
            {compactCards.map((item) => (
              <Card
                key={item.id}
                id={item.id}
                label={item.label}
                supportText={item.supportText}
                recommended={item.recommended ?? false}
                selected={isSelected(item.id)}
                orientation="vertical"
                showInfoIcon={true}
                onClick={() => onCardSelect(item.id)}
              />
            ))}
          </div>
          {/* Compact 640+: 6-col grid so each card spans 2; second row centered (cols 2–3 and 4–5) */}
          <div className="hidden md:grid grid-cols-6 gap-x-4 gap-y-6 w-full">
            {compactCards.map((item, index) => {
              const colClass =
                index <= 2
                  ? "md:col-span-2"
                  : index === 3 && compactCards.length === 4
                    ? "md:col-start-3 md:col-span-2"
                    : index === 3
                      ? "md:col-start-2 md:col-span-2"
                      : "md:col-start-4 md:col-span-2";
              return (
                <div key={item.id} className={colClass}>
                  <Card
                    id={item.id}
                    label={item.label}
                    supportText={item.supportText}
                    recommended={item.recommended ?? false}
                    selected={isSelected(item.id)}
                    orientation="horizontal"
                    showInfoIcon={false}
                    onClick={() => onCardSelect(item.id)}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}

      {hasMore ? (
        <button
          type="button"
          onClick={onToggleExpand}
          className="font-inter text-base font-normal leading-6 text-[var(--color-gray-000)] underline hover:opacity-90 focus:outline-none self-center cursor-pointer"
        >
          {expanded ? showLessLabel : toggleLabel}
        </button>
      ) : null}
    </div>
  );
}
