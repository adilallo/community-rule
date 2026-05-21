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
    // Get article-specific background image from frontmatter
    const getBackgroundImage = (
      post: ContentThumbnailTemplateProps["post"],
      variant: "vertical" | "horizontal",
    ): string => {
      if (post.frontmatter?.thumbnail) {
        const imageName =
          variant === "vertical"
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

      return variant === "vertical"
        ? contentBlogVerticalPath(resolvedSlug)
        : contentBlogHorizontalPath(resolvedSlug);
    };

    const backgroundImage = getBackgroundImage(post, variant);

    return (
      <ContentThumbnailTemplateView
        post={post}
        className={className}
        variant={variant}
        sizing={sizing}
        backgroundImage={backgroundImage}
      />
    );
  },
);

ContentThumbnailTemplateContainer.displayName = "ContentThumbnailTemplate";

export default ContentThumbnailTemplateContainer;
