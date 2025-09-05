"use client";

import React from "react";

const ContentContainer = ({ post, width = "200px", variant = "vertical" }) => {
  // Get the corresponding icon based on the same logic as background images
  const getIconImage = (slug, variant) => {
    const verticalIcons = [
      "/assets/Content_Thumbnail/Icon_1.svg",
      "/assets/Content_Thumbnail/Icon_2.svg",
      "/assets/Content_Thumbnail/Icon_3.svg",
    ];

    const horizontalIcons = [
      "/assets/Content_Thumbnail/Icon_1.svg",
      "/assets/Content_Thumbnail/Icon_2.svg",
      "/assets/Content_Thumbnail/Icon_3.svg",
    ];

    const icons = variant === "vertical" ? verticalIcons : horizontalIcons;

    if (!slug) return icons[0];

    // Use the same hash logic as background images to ensure matching
    const hash = slug.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return icons[Math.abs(hash) % icons.length];
  };

  const iconImage = getIconImage(post.slug, variant);

  return (
    <div className="relative z-20 h-full flex flex-col gap-3" style={{ width }}>
      {/* Content Container - 8px gap between icon and text */}
      <div className="flex flex-col gap-2">
        {/* Icon */}
        <div className="w-6 h-6 flex items-center justify-center">
          <img
            src={iconImage}
            alt={`Icon for ${post.frontmatter.title}`}
            className="w-6 h-6 object-contain"
          />
        </div>

        {/* Text Container */}
        <div className="space-y-2">
          {/* Title */}
          <h3
            className="text-lg font-medium group-hover:text-blue-200 transition-colors"
            style={{
              fontFamily: "Bricolage Grotesque",
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: "120%",
              color: "var(--color-content-inverse-brand-royal)",
            }}
          >
            {post.frontmatter.title}
          </h3>

          {/* Description */}
          <p
            className="max-w-md"
            style={{
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              color: "var(--color-content-inverse-brand-royal)",
            }}
          >
            {post.frontmatter.description}
          </p>
        </div>
      </div>

      {/* Metadata Container - horizontal with 8px gap */}
      <div className="flex items-center gap-2">
        {/* Author Name */}
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: "10px",
            lineHeight: "14px",
            color: "var(--color-content-inverse-brand-royal)",
          }}
        >
          {post.frontmatter.author}
        </span>

        {/* Date */}
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: "10px",
            lineHeight: "14px",
            color: "var(--color-content-inverse-brand-royal)",
          }}
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
