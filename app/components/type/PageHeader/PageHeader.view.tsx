"use client";

import { Fragment, memo } from "react";
import Button from "../../buttons/Button";
import type { PageHeaderViewProps } from "./PageHeader.types";

function PageHeaderView({
  title,
  description,
  ctaText,
  ctaHref,
  headingAlign = "start",
  sectionMinimal = false,
  singleLineTitleFromLg = false,
  titleId,
  className = "",
}: PageHeaderViewProps) {
  const hasCta = Boolean(ctaText?.trim() && ctaHref?.trim());
  const hasDescription = Boolean(description?.trim());
  const isCenter = headingAlign === "center";
  const titleLines = typeof title === "string" ? [title] : title;
  const collapseTitleAtLg =
    singleLineTitleFromLg && titleLines.length > 1;

  const lockupAlign = isCenter
    ? "items-center text-center"
    : "items-start text-[var(--color-content-default-primary)]";
  const h1Align = isCenter ? "text-center" : "";

  const sectionPadding = sectionMinimal
    ? "py-[var(--spacing-scale-032)] md:py-[var(--spacing-scale-056)]"
    : "py-[var(--spacing-scale-032)] md:py-[var(--spacing-scale-032)]";

  const titleTypeClasses = sectionMinimal
    ? "font-bricolage-grotesque text-[32px] font-medium leading-[1.1] text-[var(--color-content-default-primary)] md:text-[52px] md:leading-[1.1] lg:text-[52px] lg:leading-[1.1] xl:text-[length:var(--sizing-1600)] xl:leading-[1.1]"
    : "font-bricolage-grotesque text-[32px] font-medium leading-[1.1] text-[var(--color-content-default-primary)] md:text-[44px] md:leading-[110%] lg:text-[52px]";

  const sectionFigmaNode =
    sectionMinimal && collapseTitleAtLg
      ? "21004-24825"
      : sectionMinimal
        ? "22085-862431"
        : "21004-22394";

  return (
    <section
      data-figma-node={sectionFigmaNode}
      className={`bg-[var(--color-surface-default-primary)] px-[var(--spacing-scale-020)] md:px-[var(--spacing-scale-064)] ${sectionPadding} ${className}`.trim()}
    >
      <div
        className={`mx-auto flex w-full max-w-[1440px] flex-col gap-[var(--spacing-scale-024)] ${isCenter ? "items-center" : ""}`}
      >
        <div
          className={`flex w-full flex-col gap-[var(--spacing-scale-020)] ${lockupAlign}`}
        >
          <h1
            id={titleId}
            className={`${titleTypeClasses} ${h1Align}${collapseTitleAtLg ? " lg:whitespace-nowrap" : ""}`.trim()}
          >
            {titleLines.length === 1 ? (
              titleLines[0]
            ) : collapseTitleAtLg ? (
              titleLines.map((line, index) => (
                <Fragment key={`${index}-${line}`}>
                  {index > 0 ? (
                    <span className="hidden lg:inline">{" "}</span>
                  ) : null}
                  <span className="block lg:inline">{line}</span>
                </Fragment>
              ))
            ) : (
              titleLines.map((line, index) => (
                <span key={`${index}-${line}`} className="block">
                  {line}
                </span>
              ))
            )}
          </h1>
          {hasDescription ? (
            <p className="font-inter text-[18px] font-normal leading-[28px] text-[var(--color-content-default-primary)] lg:text-[24px] lg:leading-[28px]">
              {description}
            </p>
          ) : null}
        </div>
        {hasCta ? (
          <div
            className={`flex ${isCenter ? "justify-center" : "justify-start"}`}
          >
            <Button
              href={ctaHref}
              buttonType="filled"
              palette="inverse"
              size="large"
            >
              {ctaText}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

PageHeaderView.displayName = "PageHeaderView";

export default memo(PageHeaderView);
