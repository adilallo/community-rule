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
  layout,
  compactRecommendedLimit,
  compactDesktopLayout,
  headerLockupSize,
  toggleAlignment,
  className,
}: CardStackViewProps) {
  const lockupSize = headerLockupSize ?? "L";
  const isSelected = (id: string) => selectedIds.includes(id);
  // Compact: recommended only (default up to 5). Expanded: all cards.
  const compactCards = cards
    .filter((c) => c.recommended ?? false)
    .slice(0, compactRecommendedLimit);

  // Single stack: always one column; expand reveals more in same stack (scrollable)
  if (layout === "singleStack") {
    const displayedCards = expanded ? cards : compactCards;
    return (
      <div className={`flex w-full flex-col gap-6 min-w-0 ${className}`}>
        {title || description ? (
          <div className="min-w-0 shrink-0">
            <HeaderLockup
              title={title}
              description={description}
              justification="center"
              size={lockupSize}
            />
          </div>
        ) : null}
        <div className="flex w-full min-w-0 flex-col gap-2">
          {displayedCards.map((item) => (
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
        {hasMore ? (
          <button
            type="button"
            onClick={onToggleExpand}
            className={`font-inter text-base font-normal leading-6 text-[var(--color-gray-000)] underline hover:opacity-90 focus:outline-none cursor-pointer ${
              toggleAlignment === "end" ? "self-end" : "self-center"
            }`}
          >
            {expanded ? showLessLabel : toggleLabel}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`flex w-full flex-col gap-6 min-w-0 ${className}`}>
      {title || description ? (
        <div className="min-w-0">
          <HeaderLockup
            title={title}
            description={description}
            justification="center"
            size={lockupSize}
          />
        </div>
      ) : null}

      {expanded ? (
        <div className="mx-auto grid w-full max-w-[min(100%,860px)] grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
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
      ) : compactDesktopLayout === "pyramidFive" ? (
        <>
          <div className="flex w-full flex-col gap-2 md:hidden">
            {compactCards.map((item) => (
              <Card
                key={item.id}
                id={item.id}
                label={item.label}
                supportText={item.supportText}
                recommended={item.recommended ?? false}
                selected={isSelected(item.id)}
                orientation="horizontal"
                showInfoIcon={false}
                className="min-h-[142px]"
                onClick={() => onCardSelect(item.id)}
              />
            ))}
          </div>
          <div className="mx-auto hidden w-full max-w-[min(100%,860px)] md:block">
            {/*
              lg+: fixed 3 + 2 rows (no flex-wrap on the top row — avoids 2+1+2 when the first row wraps).
              md–lg: same shell as the 3-card step — each row is `flex justify-center gap-2` so cards
              stay a tight cluster with gap-2 until lg expands to the 3+2 pyramid.
            */}
            <div className="hidden flex-col gap-2 lg:flex">
              <div className="flex justify-center gap-2">
                {compactCards.slice(0, 3).map((item) => (
                  <Card
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    supportText={item.supportText}
                    recommended={item.recommended ?? false}
                    selected={isSelected(item.id)}
                    orientation="horizontal"
                    showInfoIcon={false}
                    className="h-[142px] min-h-[142px] max-h-[142px] w-[281px] max-w-[281px] shrink-0"
                    onClick={() => onCardSelect(item.id)}
                  />
                ))}
              </div>
              {compactCards.length > 3 ? (
                <div className="flex justify-center gap-2">
                  {compactCards
                    .slice(3, compactRecommendedLimit)
                    .map((item) => (
                      <Card
                        key={item.id}
                        id={item.id}
                        label={item.label}
                        supportText={item.supportText}
                        recommended={item.recommended ?? false}
                        selected={isSelected(item.id)}
                        orientation="horizontal"
                        showInfoIcon={false}
                        className="h-[142px] min-h-[142px] max-h-[142px] w-[281px] max-w-[281px] shrink-0"
                        onClick={() => onCardSelect(item.id)}
                      />
                    ))}
                </div>
              ) : null}
            </div>
            <div className="hidden flex-col gap-2 md:flex lg:hidden">
              <div className="flex justify-center gap-2">
                {compactCards.slice(0, 2).map((item) => (
                  <Card
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    supportText={item.supportText}
                    recommended={item.recommended ?? false}
                    selected={isSelected(item.id)}
                    orientation="horizontal"
                    showInfoIcon={false}
                    className="h-[142px] min-h-[142px] max-h-[142px] w-[281px] max-w-[281px] shrink-0"
                    onClick={() => onCardSelect(item.id)}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-2">
                {compactCards.slice(2, 4).map((item) => (
                  <Card
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    supportText={item.supportText}
                    recommended={item.recommended ?? false}
                    selected={isSelected(item.id)}
                    orientation="horizontal"
                    showInfoIcon={false}
                    className="h-[142px] min-h-[142px] max-h-[142px] w-[281px] max-w-[281px] shrink-0"
                    onClick={() => onCardSelect(item.id)}
                  />
                ))}
              </div>
              {compactCards[4] ? (
                <div className="flex justify-center gap-2">
                  <Card
                    id={compactCards[4].id}
                    label={compactCards[4].label}
                    supportText={compactCards[4].supportText}
                    recommended={compactCards[4].recommended ?? false}
                    selected={isSelected(compactCards[4].id)}
                    orientation="horizontal"
                    showInfoIcon={false}
                    className="h-[142px] min-h-[142px] max-h-[142px] w-[281px] max-w-[281px] shrink-0"
                    onClick={() => onCardSelect(compactCards[4].id)}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : compactDesktopLayout === "flexWrap" ? (
        <>
          <div className="flex w-full flex-col gap-2 md:hidden">
            {compactCards.map((item) => (
              <Card
                key={item.id}
                id={item.id}
                label={item.label}
                supportText={item.supportText}
                recommended={item.recommended ?? false}
                selected={isSelected(item.id)}
                orientation="horizontal"
                showInfoIcon={false}
                className="min-h-[142px]"
                onClick={() => onCardSelect(item.id)}
              />
            ))}
          </div>
          {/* md–lg: pyramid (2 + 1), each row centered; lg+: one centered row (not edge-to-edge in a 2-col grid) */}
          {compactCards.length === 3 ? (
            <>
              <div className="mx-auto hidden w-full max-w-[min(100%,860px)] flex-col gap-2 md:flex lg:hidden">
                <div className="flex justify-center gap-2">
                  {compactCards.slice(0, 2).map((item) => (
                    <Card
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      supportText={item.supportText}
                      recommended={item.recommended ?? false}
                      selected={isSelected(item.id)}
                      orientation="horizontal"
                      showInfoIcon={false}
                      className="h-[142px] min-h-[142px] max-h-[142px] w-[281px] max-w-[281px] shrink-0"
                      onClick={() => onCardSelect(item.id)}
                    />
                  ))}
                </div>
                <div className="flex justify-center">
                  <Card
                    id={compactCards[2].id}
                    label={compactCards[2].label}
                    supportText={compactCards[2].supportText}
                    recommended={compactCards[2].recommended ?? false}
                    selected={isSelected(compactCards[2].id)}
                    orientation="horizontal"
                    showInfoIcon={false}
                    className="h-[142px] min-h-[142px] max-h-[142px] w-[281px] max-w-[281px] shrink-0"
                    onClick={() => onCardSelect(compactCards[2].id)}
                  />
                </div>
              </div>
              <div className="mx-auto hidden w-full max-w-[min(100%,860px)] flex-wrap justify-center gap-2 lg:flex">
                {compactCards.map((item) => (
                  <Card
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    supportText={item.supportText}
                    recommended={item.recommended ?? false}
                    selected={isSelected(item.id)}
                    orientation="horizontal"
                    showInfoIcon={false}
                    className="h-[142px] min-h-[142px] max-h-[142px] w-[281px] max-w-[281px] shrink-0"
                    onClick={() => onCardSelect(item.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="mx-auto hidden w-full max-w-[min(100%,860px)] flex-wrap justify-center gap-2 md:flex">
              {compactCards.map((item) => (
                <div
                  key={item.id}
                  className="flex w-full min-w-0 shrink-0 justify-center md:w-[281px] md:max-w-[281px]"
                >
                  <Card
                    id={item.id}
                    label={item.label}
                    supportText={item.supportText}
                    recommended={item.recommended ?? false}
                    selected={isSelected(item.id)}
                    orientation="horizontal"
                    showInfoIcon={false}
                    className="h-[142px] min-h-[142px] max-h-[142px] w-full max-w-[281px]"
                    onClick={() => onCardSelect(item.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Compact under 640: single column, up to 5 recommended cards */}
          <div className="flex w-full flex-col gap-2 md:hidden">
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
