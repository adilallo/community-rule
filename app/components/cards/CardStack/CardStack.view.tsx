"use client";

import type { ReactNode } from "react";
import HeaderLockup from "../../type/HeaderLockup";
import type { HeaderLockupSizeValue } from "../../type/HeaderLockup/HeaderLockup.types";
import Selection from "../Selection";
import type { CardStackViewProps } from "./CardStack.types";

function CardStackHeaderLockup({
  title,
  description,
  justification,
  size,
  wrapperClassName,
}: {
  title: string;
  description: ReactNode;
  justification: "center" | "left";
  size: HeaderLockupSizeValue;
  wrapperClassName?: string;
}) {
  if (!title && !description) {
    return null;
  }
  return (
    <div className={wrapperClassName ?? "min-w-0"}>
      <HeaderLockup
        title={title}
        description={description}
        justification={justification}
        size={size}
      />
    </div>
  );
}

function CardStackAddCardButton({
  label,
  ariaLabel,
  onClick,
}: {
  label: string;
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex min-h-[88px] w-full shrink-0 items-center justify-center rounded-[var(--measures-radius-medium,8px)] bg-[var(--color-surface-default-secondary)] font-inter text-base font-medium text-[var(--color-content-default-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-invert-primary)]"
    >
      <span className="flex items-center gap-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {label}
      </span>
    </button>
  );
}

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
  compactCardIds,
  compactDesktopLayout,
  headerLockupSize,
  toggleAlignment,
  className,
  showAddCard,
  addCardLabel,
  addCardAriaLabel,
  onAddCard,
}: CardStackViewProps) {
  const addTile =
    showAddCard && onAddCard && addCardLabel.length > 0 ? (
      <CardStackAddCardButton
        label={addCardLabel}
        ariaLabel={addCardAriaLabel || addCardLabel}
        onClick={onAddCard}
      />
    ) : null;
  const lockupSize = headerLockupSize ?? "L";
  const isSelected = (id: string) => selectedIds.includes(id);
  // Compact: explicit `compactCardIds` (caller-driven, used by create-flow
  // facet ranker) takes precedence over the legacy `recommended`-filter so
  // the screen can show un-tagged cards in the compact slot when there is
  // no facet signal yet (CR-88 §10).
  const compactCards = (() => {
    if (compactCardIds && compactCardIds.length > 0) {
      const byId = new Map(cards.map((c) => [c.id, c]));
      return compactCardIds
        .map((id) => byId.get(id))
        .filter((c): c is (typeof cards)[number] => c !== undefined)
        .slice(0, compactRecommendedLimit);
    }
    return cards
      .filter((c) => c.recommended ?? false)
      .slice(0, compactRecommendedLimit);
  })();

  // Single stack: always one column; expand reveals more in same stack (scrollable)
  if (layout === "singleStack") {
    const displayedCards = expanded ? cards : compactCards;
    return (
      <div className={`flex w-full flex-col gap-6 min-w-0 ${className}`}>
        <CardStackHeaderLockup
          title={title}
          description={description}
          justification="center"
          size={lockupSize}
          wrapperClassName="min-w-0 shrink-0"
        />
        <div className="flex w-full min-w-0 flex-col gap-2">
          {displayedCards.map((item) => (
            <Selection
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
          {addTile}
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
      <CardStackHeaderLockup
        title={title}
        description={description}
        justification="center"
        size={lockupSize}
      />

      {expanded ? (
        <div className="mx-auto grid w-full max-w-[min(100%,860px)] grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
          {cards.map((item) => (
            <Selection
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
          {addTile ? (
            <div className="min-w-0 md:col-span-2">{addTile}</div>
          ) : null}
        </div>
      ) : compactDesktopLayout === "pyramidFive" ? (
        <>
          <div className="flex w-full flex-col gap-2 md:hidden">
            {compactCards.map((item) => (
              <Selection
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
            {addTile}
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
                  <Selection
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
                      <Selection
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
                  <Selection
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
                  <Selection
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
                  <Selection
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
          {addTile ? (
            <div className="mx-auto hidden w-full max-w-[min(100%,860px)] md:block">
              {addTile}
            </div>
          ) : null}
        </>
      ) : compactDesktopLayout === "flexWrap" ? (
        <>
          <div className="flex w-full flex-col gap-2 md:hidden">
            {compactCards.map((item) => (
              <Selection
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
            {addTile}
          </div>
          {/* md–lg: pyramid (2 + 1), each row centered; lg+: one centered row (not edge-to-edge in a 2-col grid) */}
          {compactCards.length === 3 ? (
            <>
              <div className="mx-auto hidden w-full max-w-[min(100%,860px)] flex-col gap-2 md:flex lg:hidden">
                <div className="flex justify-center gap-2">
                  {compactCards.slice(0, 2).map((item) => (
                    <Selection
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
                  <Selection
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
                {addTile ? (
                  <div className="flex w-full justify-center px-2">{addTile}</div>
                ) : null}
              </div>
              <div className="mx-auto hidden w-full max-w-[min(100%,860px)] flex-wrap justify-center gap-2 lg:flex">
                {compactCards.map((item) => (
                  <Selection
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
              {addTile ? (
                <div className="mx-auto hidden w-full max-w-[min(100%,860px)] lg:flex lg:justify-center">
                  <div className="w-full min-w-[281px] max-w-[574px]">{addTile}</div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="mx-auto hidden w-full max-w-[min(100%,860px)] flex-wrap justify-center gap-2 md:flex">
              {compactCards.map((item) => (
                <div
                  key={item.id}
                  className="flex w-full min-w-0 shrink-0 justify-center md:w-[281px] md:max-w-[281px]"
                >
                  <Selection
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
              {addTile ? (
                <div className="flex w-full min-w-0 shrink-0 justify-center md:w-[281px] md:max-w-[574px] md:flex-[1_1_100%]">
                  {addTile}
                </div>
              ) : null}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Compact under 640: single column, up to 5 recommended cards */}
          <div className="flex w-full flex-col gap-2 md:hidden">
            {compactCards.map((item) => (
              <Selection
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
            {addTile}
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
                  <Selection
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
            {addTile ? (
              <div className="col-span-6 min-w-0">{addTile}</div>
            ) : null}
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
