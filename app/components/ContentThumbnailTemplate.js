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
}) => {
  // Post-specific background selection - different SVG for each post
  const getBackgroundImage = (slug, variant) => {
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

    const images = variant === "vertical" ? verticalImages : horizontalImages;

    if (!slug) return images[0];

    // Simple cycling approach to ensure different styles
    const slugOrder = [
      "building-community-trust",
      "operational-security-mutual-aid",
      "making-decisions-without-hierarchy",
      "resolving-active-conflicts",
    ];
    const index = slugOrder.indexOf(slug);
    const finalIndex = index >= 0 ? index % images.length : 0;
    return images[finalIndex];
  };

  const backgroundImage = getBackgroundImage(post.slug, variant);

  if (variant === "vertical") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={`block group transition-transform duration-300 hover:scale-105 ${className}`}
      >
        <div className="relative w-[260px] h-[390px] overflow-hidden rounded-lg shadow-lg pt-[18px] pl-[18px] pr-[42px] pb-[212px]">
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
      className={`block group transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <div className="relative w-[320px] h-[225.5px] overflow-hidden rounded-lg shadow-lg pt-[13.75px] pr-[76px] pb-[73.75px] pl-[14px]">
        {/* Background SVG - sized to fit the 320x225.5 container exactly */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt={`Background for ${post.frontmatter.title}`}
            className="w-[320px] h-[225.5px] object-cover"
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
