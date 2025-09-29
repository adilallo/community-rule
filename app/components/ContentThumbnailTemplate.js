"use client";

import React from "react";
import Link from "next/link";
import ContentContainer from "./ContentContainer";
import { getAssetPath, ASSETS } from "../../lib/assetUtils";

/**
 * ContentThumbnailTemplate component for displaying blog post previews
 * Simplified version to debug infinite loop
 */
const ContentThumbnailTemplate = ({
  post,
  className = "",
  variant = "vertical", // Internal prop for testing/development
  slugOrder = [], // Array of slugs for consistent icon cycling
}) => {
  // Post-specific background selection - different SVG for each post
  const getBackgroundImage = (slug, variant, slugOrder) => {
    const verticalImages = [
      getAssetPath(ASSETS.VERTICAL_1),
      getAssetPath(ASSETS.VERTICAL_2),
      getAssetPath(ASSETS.VERTICAL_3),
    ];

    const horizontalImages = [
      getAssetPath(ASSETS.HORIZONTAL_1),
      getAssetPath(ASSETS.HORIZONTAL_2),
      getAssetPath(ASSETS.HORIZONTAL_3),
    ];

    if (!slug)
      return variant === "vertical" ? verticalImages[0] : horizontalImages[0];

    // Use the passed slugOrder for consistent cycling through background variants
    const index = slugOrder.indexOf(slug);
    const backgroundIndex = index >= 0 ? index % 3 : 0; // Cycle through 3 background variants

    // Return the same background index for both vertical and horizontal variants
    return variant === "vertical"
      ? verticalImages[backgroundIndex]
      : horizontalImages[backgroundIndex];
  };

  const backgroundImage = getBackgroundImage(post.slug, variant, slugOrder);

  if (variant === "vertical") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={`block transition-transform duration-200 hover:scale-[1.02] ${className}`}
      >
        <div className="relative w-[260px] h-[390px] overflow-hidden pt-[18px] pl-[18px] pr-[42px] pb-[212px]">
          {/* Background SVG - sized to fit the 260x390 container exactly */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backgroundImage}
              alt={`Background for ${post.frontmatter.title}`}
              className="w-[260px] h-[390px] object-cover"
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
      <div className="relative min-w-[320px] h-[225.5px] overflow-hidden pt-[13.75px] pr-[76px] pb-[73.75px] pl-[14px]">
        {/* Background SVG - sized to fit the 320x225.5 container exactly */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt={`Background for ${post.frontmatter.title}`}
            className="w-full h-[225.5px] object-cover object-bottom"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/70 z-10" />
        </div>

        {/* Content - positioned within the padding constraints */}
        <ContentContainer post={post} width="230px" size="xs" />
      </div>
    </Link>
  );
};

export default ContentThumbnailTemplate;
