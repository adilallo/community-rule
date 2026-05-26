import { memo } from "react";
import Link from "next/link";
import ContentContainer from "../ContentContainer";
import type { ContentThumbnailTemplateViewProps } from "./ContentThumbnailTemplate.types";

function ContentThumbnailTemplateView({
  post,
  className,
  variant,
  sizing,
  backgroundImage,
  backgroundImageSmd,
}: ContentThumbnailTemplateViewProps) {
  if (variant === "responsive") {
    // Single card; <picture> swaps the orientation-specific image at smd
    // (530px), aspect-ratio and content positioning switch via Tailwind.
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={`group block w-full transition-transform duration-200 hover:scale-[1.02] ${className}`}
      >
        <div className="relative aspect-[320/225.5] w-full overflow-hidden smd:aspect-[260/390]">
          <div className="absolute inset-0 z-0">
            <picture>
              {backgroundImageSmd ? (
                <source
                  media="(min-width: 530px)"
                  srcSet={backgroundImageSmd}
                />
              ) : null}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={backgroundImage}
                alt=""
                className="pointer-events-none size-full object-cover"
              />
            </picture>
          </div>
          <div className="absolute left-[4.375%] top-[6.099%] z-20 w-[71.875%] smd:left-[6.923%] smd:top-[4.615%] smd:w-[76.923%]">
            <ContentContainer post={post} size="xs" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "vertical") {
    if (sizing === "fixed") {
      return (
        <Link
          href={`/blog/${post.slug}`}
          className={`group block transition-transform duration-200 hover:scale-[1.02] ${className}`}
        >
          <div className="relative h-[390px] w-[260px] overflow-hidden">
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={backgroundImage}
                alt=""
                className="pointer-events-none size-full object-cover"
              />
            </div>
            <div className="absolute left-[18px] top-[18px] z-20 w-[200px]">
              <ContentContainer post={post} width="200px" size="xs" />
            </div>
          </div>
        </Link>
      );
    }

    return (
      <Link
        href={`/blog/${post.slug}`}
        className={`group block w-full transition-transform duration-200 hover:scale-[1.02] ${className}`}
      >
        <div className="relative aspect-[260/390] w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backgroundImage}
              alt=""
              className="pointer-events-none size-full object-cover"
            />
          </div>
          <div className="absolute left-[6.923%] top-[4.615%] z-20 w-[76.923%]">
            <ContentContainer post={post} size="xs" />
          </div>
        </div>
      </Link>
    );
  }

  if (sizing === "fixed") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={`group block transition-transform duration-200 hover:scale-[1.02] ${className}`}
      >
        <div className="relative h-[225.5px] w-[320px] overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backgroundImage}
              alt=""
              className="pointer-events-none size-full object-cover"
            />
          </div>
          <div className="absolute left-[14px] top-[13.75px] z-20 w-[230px]">
            <ContentContainer post={post} width="230px" size="xs" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block w-full transition-transform duration-200 hover:scale-[1.02] ${className}`}
    >
      <div className="relative aspect-[320/225.5] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt=""
            className="pointer-events-none size-full object-cover"
          />
        </div>
        <div className="absolute left-[4.375%] top-[6.099%] z-20 w-[71.875%]">
          <ContentContainer post={post} size="xs" />
        </div>
      </div>
    </Link>
  );
}

ContentThumbnailTemplateView.displayName = "ContentThumbnailTemplateView";

export default memo(ContentThumbnailTemplateView);
