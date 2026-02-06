import { memo } from "react";
import type { ContentContainerViewProps } from "./ContentContainer.types";

function ContentContainerView({
  post,
  width,
  size,
  iconImage,
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
