import type { ListSize } from "./ListEntry/ListEntry.types";

export const rowShellBase =
  "flex w-full cursor-pointer items-center text-left text-[var(--color-content-default-primary)] outline-none " +
  "transition-colors " +
  "hover:bg-[var(--color-surface-default-tertiary)] " +
  "focus-visible:ring-2 focus-visible:ring-[var(--color-content-default-primary)] " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-default-primary)]";

/**
 * Figma: "ListEntry" / Base Interactive (21844:4118) — S/M/L row + outer shell node ids.
 * Full list frame roots: 21863:45631 (S), 21863:45493 (M), 21844:4405 (L).
 */
export const FIGMA_LIST_ENTRY_OUTER: Record<ListSize, string> = {
  s: "21863:45436",
  m: "21863:45422",
  l: "21844:4119",
};

export const FIGMA_LIST_ROOT: Record<ListSize, string> = {
  s: "21863:45631",
  m: "21863:45493",
  l: "21844:4405",
};

export const FIGMA_LIST_ENTRY_ROW: Record<ListSize, string> = {
  s: "21863:45438",
  m: "21863:45424",
  l: "21844:4120",
};

type RowLayout = {
  shell: string;
  textCol: string;
  title: string;
  description: string;
  rowFigma: string;
};

export const listEntrySizeLayout: Record<ListSize, RowLayout> = {
  s: {
    shell: `${rowShellBase} min-h-0 gap-1.5 py-[var(--spacing-scale-012)]`,
    textCol: "flex min-w-0 flex-1 flex-col items-start justify-center",
    title:
      "min-w-0 flex-1 font-inter text-sm font-medium leading-[18px] text-[var(--color-content-default-primary)]",
    description:
      "w-full font-inter text-xs font-normal leading-4 text-[var(--color-content-default-secondary)]",
    rowFigma: FIGMA_LIST_ENTRY_ROW.s,
  },
  m: {
    shell: `${rowShellBase} min-h-16 gap-[var(--spacing-scale-008)] py-[var(--spacing-scale-012)]`,
    textCol: "flex min-w-0 flex-1 flex-col items-start justify-center",
    title:
      "min-w-0 flex-1 font-inter text-lg font-medium leading-6 text-[var(--color-content-default-primary)]",
    description:
      "w-full font-inter text-base font-normal leading-6 text-[var(--color-content-default-secondary)]",
    rowFigma: FIGMA_LIST_ENTRY_ROW.m,
  },
  l: {
    shell: `${rowShellBase} min-h-16 gap-[var(--spacing-scale-012)] py-[var(--spacing-scale-016)]`,
    textCol:
      "flex min-w-0 flex-1 flex-col items-start justify-center gap-[var(--spacing-scale-004)]",
    title:
      "min-w-0 flex-1 font-inter text-2xl font-normal leading-7 text-[var(--color-content-default-primary)]",
    description:
      "w-full font-inter text-lg font-normal leading-[1.3] text-[var(--color-content-default-secondary)]",
    rowFigma: FIGMA_LIST_ENTRY_ROW.l,
  },
};
