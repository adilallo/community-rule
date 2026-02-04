"use client";

import { memo } from "react";
import { getAssetPath, ASSETS } from "../../../lib/assetUtils";
import ContentThumbnailTemplateView from "./ContentThumbnailTemplate.view";
import type { ContentThumbnailTemplateProps } from "./ContentThumbnailTemplate.types";
import { normalizeContentThumbnailVariant } from "../../../lib/propNormalization";

const ContentThumbnailTemplateContainer = memo<ContentThumbnailTemplateProps>(
  ({ post, className = "", variant: variantProp = "vertical" }) => {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const variant = normalizeContentThumbnailVariant(variantProp);
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
        backgroundImage={backgroundImage}
      />
    );
  },
);

ContentThumbnailTemplateContainer.displayName = "ContentThumbnailTemplate";

export default ContentThumbnailTemplateContainer;
