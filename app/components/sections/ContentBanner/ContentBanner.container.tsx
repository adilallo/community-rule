"use client";

import { memo } from "react";
import {
  getAssetPath,
  contentBlogHorizontalPath,
  contentBlogSectionPath,
  CONTENT_CATALOG_SLUG_ORDER,
} from "../../../../lib/assetUtils";
import type { BlogPost } from "../../../../lib/content";
import ContentBannerView from "./ContentBanner.view";
import type { ContentBannerProps } from "./ContentBanner.types";

/** Figma: Content page Template (19003:23305) — article ContentBanner per breakpoint. */
const ContentBannerContainer = memo<ContentBannerProps>(
  ({
    post,
    variant: variantProp = "article",
    leadingImageSrc,
    leadingImageAlt,
    rulePreview,
    contentTone,
  }) => {
    const variant = variantProp;

    const resolveHorizontalImage = (blogPost: BlogPost): string => {
      if (blogPost.frontmatter?.thumbnail?.horizontal) {
        return `/content/blog/${blogPost.frontmatter.thumbnail.horizontal}`;
      }

      if (
        CONTENT_CATALOG_SLUG_ORDER.includes(
          blogPost.slug as (typeof CONTENT_CATALOG_SLUG_ORDER)[number],
        )
      ) {
        return contentBlogHorizontalPath(blogPost.slug);
      }

      return getAssetPath("assets/Content_Banner.svg");
    };

    const resolveSectionImage = (blogPost: BlogPost): string => {
      if (blogPost.frontmatter?.banner?.horizontal) {
        return `/content/blog/${blogPost.frontmatter.banner.horizontal}`;
      }

      if (
        CONTENT_CATALOG_SLUG_ORDER.includes(
          blogPost.slug as (typeof CONTENT_CATALOG_SLUG_ORDER)[number],
        )
      ) {
        return contentBlogSectionPath(blogPost.slug);
      }

      return resolveHorizontalImage(blogPost);
    };

    const backgroundImageHorizontal =
      variant === "article" ? resolveHorizontalImage(post) : undefined;
    const backgroundImageSection =
      variant === "article" ? resolveSectionImage(post) : undefined;

    return (
      <ContentBannerView
        variant={variant}
        post={post}
        leadingImageSrc={leadingImageSrc}
        leadingImageAlt={leadingImageAlt}
        backgroundImageHorizontal={backgroundImageHorizontal}
        backgroundImageSection={backgroundImageSection}
        rulePreview={rulePreview}
        contentTone={contentTone}
      />
    );
  },
);

ContentBannerContainer.displayName = "ContentBanner";

export default ContentBannerContainer;
