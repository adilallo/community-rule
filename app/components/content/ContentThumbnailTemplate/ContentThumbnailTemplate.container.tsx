"use client";

/**
 * Figma: "Components" / ContentThumnailTemplate (19614-14838, 19041-13415).
 * Vertical 260×390 (19060-15787); horizontal 320×225.5 (19041-13550).
 */
import { memo } from "react";
import { getAssetPath, ASSETS } from "../../../../lib/assetUtils";
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
      // Check if post has thumbnail images defined in frontmatter
      if (post.frontmatter?.thumbnail) {
        const imageName =
          variant === "vertical"
            ? post.frontmatter.thumbnail.vertical
            : post.frontmatter.thumbnail.horizontal;

        if (imageName) {
          // Return path to image in public/content/blog directory
          return `/content/blog/${imageName}`;
        }
      }

      // Fallback to default images if no thumbnail specified
      const fallbackImages: Record<string, string> = {
        vertical: getAssetPath(ASSETS.VERTICAL_1),
        horizontal: getAssetPath(ASSETS.HORIZONTAL_1),
      };

      return fallbackImages[variant] || fallbackImages.vertical;
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
