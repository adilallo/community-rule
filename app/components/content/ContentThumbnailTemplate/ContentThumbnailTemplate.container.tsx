"use client";

/**
 * Figma: "Components" / Thumbnail (19428:22574).
 * Vertical 260×390; horizontal 320×225.5; per-article backgrounds in public/content/blog/.
 */
import { memo } from "react";
import {
  contentBlogHorizontalPath,
  contentBlogVerticalPath,
  contentCatalogSlugForFallback,
  CONTENT_CATALOG_SLUG_ORDER,
} from "../../../../lib/assetUtils";
import ContentThumbnailTemplateView from "./ContentThumbnailTemplate.view";
import type { ContentThumbnailTemplateProps } from "./ContentThumbnailTemplate.types";

const ContentThumbnailTemplateContainer = memo<ContentThumbnailTemplateProps>(
  ({
    post,
    className = "",
    variant: variantProp = "vertical",
    sizing: sizingProp = "fluid",
  }) => {
    const variant = variantProp;
    const sizing = sizingProp;
    const getBackgroundImage = (
      post: ContentThumbnailTemplateProps["post"],
      orientation: "vertical" | "horizontal",
    ): string => {
      if (post.frontmatter?.thumbnail) {
        const imageName =
          orientation === "vertical"
            ? post.frontmatter.thumbnail.vertical
            : post.frontmatter.thumbnail.horizontal;

        if (imageName) {
          return `/content/blog/${imageName}`;
        }
      }

      const slug = post.slug;
      const resolvedSlug =
        CONTENT_CATALOG_SLUG_ORDER.indexOf(
          slug as (typeof CONTENT_CATALOG_SLUG_ORDER)[number],
        ) >= 0
          ? slug
          : contentCatalogSlugForFallback(slug);

      return orientation === "vertical"
        ? contentBlogVerticalPath(resolvedSlug)
        : contentBlogHorizontalPath(resolvedSlug);
    };

    // For "responsive", emit both orientations so the <picture> source can
    // swap at smd without a second card in the DOM.
    const backgroundImage =
      variant === "responsive"
        ? getBackgroundImage(post, "horizontal")
        : getBackgroundImage(post, variant);
    const backgroundImageSmd =
      variant === "responsive"
        ? getBackgroundImage(post, "vertical")
        : undefined;

    return (
      <ContentThumbnailTemplateView
        post={post}
        className={className}
        variant={variant}
        sizing={sizing}
        backgroundImage={backgroundImage}
        backgroundImageSmd={backgroundImageSmd}
      />
    );
  },
);

ContentThumbnailTemplateContainer.displayName = "ContentThumbnailTemplate";

export default ContentThumbnailTemplateContainer;
