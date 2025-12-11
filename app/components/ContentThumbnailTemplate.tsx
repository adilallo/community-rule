"use client";

import React, { memo } from "react";
import Link from "next/link";
import ContentContainer from "./ContentContainer";
import { getAssetPath, ASSETS } from "../../lib/assetUtils";
import type { BlogPost } from "../../lib/content";

/**
 * ContentThumbnailTemplate component for displaying blog post previews
 * Simplified version to debug infinite loop
 */
interface ContentThumbnailTemplateProps {
  post: BlogPost;
  className?: string;
  variant?: "vertical" | "horizontal";
  slugOrder?: string[];
}

const ContentThumbnailTemplate = memo<ContentThumbnailTemplateProps>(
  ({ post, className = "", variant = "vertical", slugOrder }) => {
    // Get article-specific background image from frontmatter
    const getBackgroundImage = (
      post: BlogPost,
      variant: "vertical" | "horizontal"
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

    if (variant === "vertical") {
      return (
        <Link
          href={`/blog/${post.slug}`}
          className={`block transition-transform duration-200 hover:scale-[1.02] ${className}`}
        >
          <div className="relative w-full aspect-[2/3] overflow-hidden pt-[18px] pl-[18px] pr-[42px] pb-[212px]">
            {/* Background SVG - fills container with maintained aspect */}
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={backgroundImage}
                alt={`Background for ${post.frontmatter.title}`}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
            </div>

            {/* Content Section - positioned within the padding constraints */}
            <ContentContainer post={post} width="200px" size="xs" />
          </div>
        </Link>
      );
    }

    // Horizontal variant
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={`block transition-transform duration-200 hover:scale-[1.02] ${className}`}
      >
        <div className="relative min-w-[320px] max-w-[800px] h-[225.5px] overflow-hidden pt-[13.75px] pr-[76px] pb-[73.75px] pl-[14px]">
          {/* Background SVG - sized to fit the 320x225.5 container exactly */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backgroundImage}
              alt={`Background for ${post.frontmatter.title}`}
              className="w-full h-[225.5px] object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/70 z-10" />
          </div>

          {/* Content - positioned within the padding constraints */}
          <ContentContainer post={post} width="230px" size="xs" />
        </div>
      </Link>
    );
  }
);

ContentThumbnailTemplate.displayName = "ContentThumbnailTemplate";

export default ContentThumbnailTemplate;
