"use client";

import { memo } from "react";
import Icon from "../../asset/icon/Icon";
import Divider from "../../utility/Divider";
import type { AccordionSizeValue, AccordionViewProps } from "./Accordion.types";

const SIZE_CLASSES: Record<
  AccordionSizeValue,
  { header: string; title: string; subhead: string }
> = {
  s: {
    header:
      "gap-[var(--spacing-scale-016)] px-[var(--spacing-scale-016)] py-[var(--spacing-scale-020)] items-center",
    title: "text-[14px] font-medium leading-[18px]",
    subhead: "text-[12px] leading-[14px]",
  },
  /** Figma: Layout / Accordion — Medium (22135-890258; header gap/px/py + Large/Label 18/24). */
  m: {
    header:
      "gap-[var(--spacing-scale-024)] px-[var(--spacing-scale-016)] py-[var(--spacing-scale-024)] items-center",
    title: "text-[18px] font-medium leading-6",
    subhead: "text-[14px] leading-[18px]",
  },
  l: {
    header:
      "gap-[var(--spacing-scale-048)] px-[var(--spacing-scale-016)] py-[var(--spacing-scale-032)] items-center",
    /** Figma Large: X Large Label 24 Regular, lh 28 (21842-2869). */
    title: "text-[24px] font-normal leading-7",
    subhead: "text-[18px] leading-6",
  },
};

const PANEL_CLASSES: Record<AccordionSizeValue, string> = {
  s: "px-[var(--spacing-scale-016)] pb-[var(--spacing-scale-020)] font-inter text-[14px] font-normal leading-5 text-[var(--color-content-default-secondary,#d2d2d2)]",
  m: "px-[var(--spacing-scale-016)] pb-[var(--spacing-scale-024)] font-inter text-[16px] font-normal leading-6 text-[var(--color-content-default-secondary,#d2d2d2)]",
  l: "px-[var(--spacing-scale-016)] pb-[var(--spacing-scale-032)] font-inter text-[18px] font-normal leading-[26px] text-[var(--color-content-default-secondary,#d2d2d2)]",
};

function withLgClasses(base: string, lg: string): string {
  const prefixed = lg
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((c) => `lg:${c}`)
    .join(" ");
  return `${base} ${prefixed}`.trim();
}

function withXlClasses(base: string, xl: string): string {
  const prefixed = xl
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((c) => `xl:${c}`)
    .join(" ");
  return `${base} ${prefixed}`.trim();
}

function resolvedLayoutClasses(
  size: AccordionSizeValue,
  lgSize: AccordionSizeValue | undefined,
  xlSize: AccordionSizeValue | undefined,
): { header: string; title: string; subhead: string; panel: string } {
  const sm = SIZE_CLASSES[size];
  let header = sm.header;
  let title = sm.title;
  let subhead = sm.subhead;
  let panel = PANEL_CLASSES[size];

  if (lgSize && lgSize !== size) {
    const lg = SIZE_CLASSES[lgSize];
    header = withLgClasses(header, lg.header);
    title = withLgClasses(title, lg.title);
    subhead = withLgClasses(subhead, lg.subhead);
    panel = withLgClasses(panel, PANEL_CLASSES[lgSize]);
  }

  if (
    xlSize === undefined ||
    xlSize === size ||
    xlSize === lgSize
  ) {
    return { header, title, subhead, panel };
  }

  const xls = SIZE_CLASSES[xlSize];
  header = withXlClasses(header, xls.header);
  title = withXlClasses(title, xls.title);
  subhead = withXlClasses(subhead, xls.subhead);
  panel = withXlClasses(panel, PANEL_CLASSES[xlSize]);

  return { header, title, subhead, panel };
}

/**
 * Figma: "Layout / Accordion" (21842-2813); Medium 22135-890258; FAQ **s**→**m** `lg`, **l** `xl` (22135-890328) via `lgSize` / `xlSize`.
 */
function AccordionView({
  title,
  subhead,
  children,
  size,
  lgSize,
  xlSize,
  isOpen,
  panelId,
  buttonId,
  onToggle,
  className,
}: AccordionViewProps) {
  const sizeClass = resolvedLayoutClasses(size, lgSize, xlSize);

  return (
    <div className={`w-full ${className}`.trim()}>
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className={`flex w-full ${sizeClass.header} text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-content-default-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]`}
        >
          <span className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-scale-004)]">
            <span
              className={`font-inter text-[var(--color-content-default-primary,white)] ${sizeClass.title}`}
            >
              {title}
            </span>
            {subhead ? (
              <span
                className={`font-inter font-medium text-[var(--color-content-default-tertiary,#b4b4b4)] ${sizeClass.subhead}`}
              >
                {subhead}
              </span>
            ) : null}
          </span>
          <span
            className={`flex size-6 shrink-0 items-center justify-center text-[var(--color-content-default-primary,white)] transition-transform ${isOpen ? "-rotate-90" : "rotate-90"}`}
            aria-hidden
          >
            <Icon name="chevron_right" size={24} />
          </span>
        </button>
      </h3>
      {isOpen && children ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={sizeClass.panel}
        >
          {children}
        </div>
      ) : null}
      <Divider type="content" orientation="horizontal" />
    </div>
  );
}

AccordionView.displayName = "AccordionView";

export default memo(AccordionView);
