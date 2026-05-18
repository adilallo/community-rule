import { memo } from "react";
import type { ContentContainerViewProps } from "./ContentContainer.types";

function ContentContainerView({
  post,
  width,
  size,
  iconImage,
  iconAlt,
  showLeadingImage,
  containerClasses,
  contentGapClasses,
  textGapClasses,
  titleClasses,
  descriptionClasses,
  authorClasses,
  dateClasses,
  formattedDate,
}: ContentContainerViewProps) {
  return (
    <div
      className={containerClasses}
      style={size === "responsive" ? {} : { width }}
    >
      {/* Content Container - gap between icon and text */}
      <div className={contentGapClasses}>
        {showLeadingImage ? (
          <div className="flex h-[30px] w-[60px] items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={iconImage}
              alt={iconAlt}
              className="h-[30px] w-[60px] object-contain"
            />
          </div>
        ) : null}

        {/* Text Container */}
        <div className={textGapClasses}>
          {/* Title */}
          <h3 className={titleClasses}>{post.frontmatter.title}</h3>

          {/* Description */}
          <p className={descriptionClasses}>{post.frontmatter.description}</p>
        </div>
      </div>

      {/* Metadata Container - horizontal with 8px gap */}
      <div className="flex items-center gap-[var(--measures-spacing-008)]">
        {/* Author Name */}
        <span className={authorClasses}>{post.frontmatter.author}</span>

        {/* Date */}
        <span className={dateClasses}>{formattedDate}</span>
      </div>
    </div>
  );
}

ContentContainerView.displayName = "ContentContainerView";

export default memo(ContentContainerView);
