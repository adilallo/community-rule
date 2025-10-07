"use client";

import React, { memo } from "react";
import { getAssetPath } from "../../lib/assetUtils";
import ContentContainer from "./ContentContainer";

const ContentBanner = memo(({ post }) => {
  // Get article-specific horizontal thumbnail (small) and banner (md+)
  const getBackgroundImage = (post) => {
    if (post.frontmatter?.thumbnail?.horizontal) {
      return `/content/blog/${post.frontmatter.thumbnail.horizontal}`;
    }
    // Fallback to default image
    return getAssetPath("assets/Content_Banner.svg");
  };

  const getBannerImageMd = (post) => {
    // Use banner.horizontal when provided; fallback to horizontal thumbnail
    if (post.frontmatter?.banner?.horizontal) {
      return `/content/blog/${post.frontmatter.banner.horizontal}`;
    }
    // Fallback to horizontal thumbnail, then default banner
    if (post.frontmatter?.thumbnail?.horizontal) {
      return `/content/blog/${post.frontmatter.thumbnail.horizontal}`;
    }
    return getAssetPath("assets/Content_Banner_2.svg");
  };

  const backgroundImage = getBackgroundImage(post);
  const bannerImageMd = getBannerImageMd(post);

  return (
    <div className="pt-[var(--measures-spacing-016)] md:pt-[var(--measures-spacing-008)] lg:pt-[50px] xl:pt-[112px] h-[275px] sm:h-[326px] md:h-[224px] lg:h-[358.4px] xl:h-[504px] relative w-full sm:overflow-hidden">
      {/* Background SVG - Default to sm breakpoint */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat aspect-[320/225.5]"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: "center bottom",
        }}
      />

      {/* Background SVG - md breakpoint and above (article banner image) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat aspect-[640/224] md:block hidden"
        style={{
          backgroundImage: `url(${bannerImageMd})`,
          backgroundPosition: "center bottom",
        }}
      />

      {/* Content Container */}
      <div
        className="
          relative z-10 h-full
          flex flex-col
          pl-[var(--measures-spacing-016)] md:pl-[var(--measures-spacing-024)] lg:pl-[var(--measures-spacing-064)]
          pr-[96px] md:pr-[350px]

          /* default: normal flow, top-aligned */
          justify-start

          /* only at md: take out of flow and center vertically */
          md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2 md:w-full md:h-auto

          /* after md (lg+): snap back to normal flow/top align */
          lg:static lg:translate-y-0 lg:top-auto lg:h-full lg:justify-start
        "
      >
        {/* ContentContainer with post data */}
        <ContentContainer post={post} size="responsive" />
      </div>
    </div>
  );
});

ContentBanner.displayName = "ContentBanner";

export default ContentBanner;
