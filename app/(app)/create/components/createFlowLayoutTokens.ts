/** Single column/section: full width under `md`, max 640px from `--breakpoint-md` up. */
export const CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS =
  "w-full min-w-0 md:max-w-[640px]";

/** Grid cell: same cap as column max, centered when the track is wider than 640px. */
export const CREATE_FLOW_MD_UP_GRID_CELL_CLASS =
  "w-full min-w-0 md:mx-auto md:max-w-[640px]";

/** Two 640px columns + `--measures-spacing-1200` (48px) gutter. */
export const CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS = "md:max-w-[1328px]";

/**
 * Card-stack steps only (Figma compact card stack): wider than header lockup so the card grid /
 * pyramid fits (max 860px). Header lockup stays {@link CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS}.
 * Card–card gap uses `gap-2` in `CardStack` (same on mobile and md+).
 */
export const CREATE_FLOW_CARD_STACK_AREA_MAX_CLASS =
  "w-full min-w-0 md:max-w-[min(100%,860px)]";
