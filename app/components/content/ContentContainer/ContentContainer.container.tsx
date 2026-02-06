"use client";

import { memo } from "react";
import { getAssetPath, ASSETS } from "../../../../lib/assetUtils";
import ContentContainerView from "./ContentContainer.view";
import type { ContentContainerProps } from "./ContentContainer.types";
import { normalizeContentContainerSize } from "../../../../lib/propNormalization";

const ContentContainerContainer = memo<ContentContainerProps>(
  ({ post, width = "200px", size: sizeProp = "responsive" }) => {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const size = normalizeContentContainerSize(sizeProp);
    // Get the corresponding icon based on the same logic as background images
    const getIconImage = (slug: string): string => {
      const icons = [
        getAssetPath(ASSETS.ICON_1),
        getAssetPath(ASSETS.ICON_2),
        getAssetPath(ASSETS.ICON_3),
      ];

      if (!slug) return icons[0];

      // Use the same cycling logic as background images to ensure matching
      const slugOrder = [
        "building-community-trust",
        "operational-security-mutual-aid",
        "making-decisions-without-hierarchy",
        "resolving-active-conflicts",
      ];
      const index = slugOrder.indexOf(slug);
      const finalIndex = index >= 0 ? index % icons.length : 0;
      return icons[finalIndex];
    };

    const iconImage = getIconImage(post.slug);

    // Format date
    const formattedDate = new Date(post.frontmatter.date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
      },
    );

    // Choose styling based on size prop
    const containerClasses =
      size === "xs"
        ? "relative z-20 h-full flex flex-col gap-[var(--measures-spacing-012)]"
        : "relative z-20 h-full flex flex-col gap-[var(--measures-spacing-012)] sm:gap-[var(--measures-spacing-016)] md:gap-[18px] lg:gap-[var(--measures-spacing-024)]";

    const contentGapClasses =
      size === "xs"
        ? "flex flex-col gap-[var(--measures-spacing-008)]"
        : "flex flex-col gap-[var(--measures-spacing-008)] sm:gap-[var(--measures-spacing-012)] md:gap-[var(--measures-spacing-008)] lg:gap-[var(--measures-spacing-016)] xl:gap-[var(--measures-spacing-004)]";

    const textGapClasses =
      size === "xs"
        ? "flex flex-col gap-[var(--measures-spacing-004)]"
        : "flex flex-col gap-[var(--measures-spacing-004)] md:gap-[var(--measures-spacing-002)] lg:gap-[var(--measures-spacing-004)]";

    const titleClasses =
      size === "xs"
        ? "font-bricolage font-medium text-[18px] leading-[120%] text-[var(--color-content-inverse-brand-royal)] group-hover:text-blue-200 transition-colors"
        : "font-bricolage font-medium text-[18px] leading-[120%] sm:text-[24px] sm:leading-[24px] md:text-[32px] md:leading-[110%] lg:text-[44px] lg:leading-[110%] xl:text-[64px] xl:leading-[110%] text-[var(--color-content-inverse-brand-royal)] group-hover:text-blue-200 transition-colors";

    const descriptionClasses =
      size === "xs"
        ? "font-inter font-normal text-[12px] leading-[16px] text-[var(--color-content-inverse-brand-royal)] max-w-md"
        : "font-inter font-normal text-[12px] leading-[16px] sm:text-[14px] sm:leading-[20px] md:text-[14px] md:leading-[20px] lg:text-[18px] lg:leading-[130%] xl:text-[24px] xl:leading-[32px] text-[var(--color-content-inverse-brand-royal)]";

    const authorClasses =
      size === "xs"
        ? "font-inter font-normal text-[10px] leading-[14px] text-[var(--color-content-inverse-brand-royal)]"
        : "font-inter font-normal text-[10px] leading-[14px] md:text-[12px] md:leading-[16px] lg:text-[14px] lg:leading-[20px] xl:text-[18px] xl:leading-[130%] text-[var(--color-content-inverse-brand-royal)]";

    const dateClasses =
      size === "xs"
        ? "font-inter font-normal text-[10px] leading-[14px] text-[var(--color-content-inverse-brand-royal)]"
        : "font-inter font-normal text-[10px] leading-[14px] md:text-[12px] md:leading-[16px] lg:text-[14px] lg:leading-[20px] xl:text-[18px] xl:leading-[130%] text-[var(--color-content-inverse-brand-royal)]";

    return (
      <ContentContainerView
        post={post}
        width={width}
        size={size}
        iconImage={iconImage}
        containerClasses={containerClasses}
        contentGapClasses={contentGapClasses}
        textGapClasses={textGapClasses}
        titleClasses={titleClasses}
        descriptionClasses={descriptionClasses}
        authorClasses={authorClasses}
        dateClasses={dateClasses}
        formattedDate={formattedDate}
      />
    );
  },
);

ContentContainerContainer.displayName = "ContentContainer";

export default ContentContainerContainer;
