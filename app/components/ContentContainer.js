"use client";

import React from "react";
import { getAssetPath, ASSETS } from "../../lib/assetUtils";

const ContentContainer = ({ post, width = "200px", size = "responsive" }) => {
  // Get the corresponding icon based on the same logic as background images
  const getIconImage = (slug) => {
    const icons = [
      getAssetPath(ASSETS.ICON_1),
      getAssetPath(ASSETS.ICON_2),
      getAssetPath(ASSETS.ICON_3),
    ];

    if (!slug) return icons[0];

    // Use the same hash logic as background images to ensure matching
    const hash = slug.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return icons[Math.abs(hash) % icons.length];
  };

  const iconImage = getIconImage(post.slug);

  // Choose styling based on size prop
  const containerClasses =
    size === "xs"
      ? "relative z-20 h-full flex flex-col gap-[var(--measures-spacing-012)]"
      : "relative z-20 h-full flex flex-col gap-[var(--measures-spacing-012)] sm:gap-[var(--measures-spacing-016)] md:gap-[18px] lg:gap-[var(--measures-spacing-024)]";

  return (
    <div className={containerClasses} style={{ width }}>
      {/* Content Container - gap between icon and text */}
      <div
        className={
          size === "xs"
            ? "flex flex-col gap-[var(--measures-spacing-008)]"
            : "flex flex-col gap-[var(--measures-spacing-008)] sm:gap-[var(--measures-spacing-012)] md:gap-[var(--measures-spacing-008)] lg:gap-[var(--measures-spacing-016)] xl:gap-[var(--measures-spacing-004)]"
        }
      >
        {/* Icon */}
        <div className="w-[60px] h-[30px] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={iconImage}
            alt={`Icon for ${post.frontmatter.title}`}
            className="w-[60px] h-[30px] object-contain"
          />
        </div>

        {/* Text Container */}
        <div
          className={
            size === "xs"
              ? "flex flex-col gap-[var(--measures-spacing-004)]"
              : "flex flex-col gap-[var(--measures-spacing-004)] md:gap-[var(--measures-spacing-002)] lg:gap-[var(--measures-spacing-004)]"
          }
        >
          {/* Title */}
          <h3
            className={
              size === "xs"
                ? "font-bricolage font-medium text-[18px] leading-[120%] text-[var(--color-content-inverse-brand-royal)] group-hover:text-blue-200 transition-colors"
                : "font-bricolage font-medium text-[18px] leading-[120%] sm:text-[24px] sm:leading-[24px] md:text-[32px] md:leading-[110%] lg:text-[44px] lg:leading-[110%] xl:text-[64px] xl:leading-[110%] text-[var(--color-content-inverse-brand-royal)] group-hover:text-blue-200 transition-colors"
            }
          >
            {post.frontmatter.title}
          </h3>

          {/* Description */}
          <p
            className={
              size === "xs"
                ? "font-inter font-normal text-[12px] leading-[16px] text-[var(--color-content-inverse-brand-royal)] max-w-md"
                : "font-inter font-normal text-[12px] leading-[16px] sm:text-[14px] sm:leading-[20px] md:text-[14px] md:leading-[20px] lg:text-[18px] lg:leading-[130%] xl:text-[24px] xl:leading-[32px] text-[var(--color-content-inverse-brand-royal)] max-w-md"
            }
          >
            {post.frontmatter.description}
          </p>
        </div>
      </div>

      {/* Metadata Container - horizontal with 8px gap */}
      <div className="flex items-center gap-[var(--measures-spacing-008)]">
        {/* Author Name */}
        <span
          className={
            size === "xs"
              ? "font-inter font-normal text-[10px] leading-[14px] text-[var(--color-content-inverse-brand-royal)]"
              : "font-inter font-normal text-[10px] leading-[14px] md:text-[12px] md:leading-[16px] lg:text-[14px] lg:leading-[20px] xl:text-[18px] xl:leading-[130%] text-[var(--color-content-inverse-brand-royal)]"
          }
        >
          {post.frontmatter.author}
        </span>

        {/* Date */}
        <span
          className={
            size === "xs"
              ? "font-inter font-normal text-[10px] leading-[14px] text-[var(--color-content-inverse-brand-royal)]"
              : "font-inter font-normal text-[10px] leading-[14px] md:text-[12px] md:leading-[16px] lg:text-[14px] lg:leading-[20px] xl:text-[18px] xl:leading-[130%] text-[var(--color-content-inverse-brand-royal)]"
          }
        >
          {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </span>
      </div>
    </div>
  );
};

export default ContentContainer;
