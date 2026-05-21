"use client";

import { memo, useId } from "react";
import PageHeaderView from "./PageHeader.view";
import type { PageHeaderProps } from "./PageHeader.types";

/**
 * Figma: "Type / PageHeader" (21004-15902).
 * Minimal headline-only: Section/PageHeader (22112-871523); md density **22085-862431** when `sectionMinimal` is set;
 * Use cases **`lg`** single-line title **21004-24825** when `singleLineTitleFromLg` is set;
 * **`xl`** headline scale **22085-860408** when `sectionMinimal` (X Large/Display / `--sizing-1600`).
 */
const PageHeaderContainer = memo<PageHeaderProps>(
  ({
    title,
    description,
    ctaText,
    ctaHref,
    headingAlign = "start",
    sectionMinimal = false,
    singleLineTitleFromLg = false,
    titleId: titleIdProp,
    className = "",
  }) => {
    const reactId = useId();
    const titleId = titleIdProp ?? `${reactId}-page-header-title`;

    return (
      <PageHeaderView
        title={title}
        description={description}
        ctaText={ctaText}
        ctaHref={ctaHref}
        headingAlign={headingAlign}
        sectionMinimal={sectionMinimal}
        singleLineTitleFromLg={singleLineTitleFromLg}
        titleId={titleId}
        className={className}
      />
    );
  },
);

PageHeaderContainer.displayName = "PageHeader";

export default PageHeaderContainer;
