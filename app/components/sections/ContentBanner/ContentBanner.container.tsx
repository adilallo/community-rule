"use client";

import { memo } from "react";
import { getAssetPath } from "../../../../lib/assetUtils";
import type { BlogPost } from "../../../../lib/content";
import ContentBannerView from "./ContentBanner.view";
import type { ContentBannerProps } from "./ContentBanner.types";

/** Figma: Section / ContentBanner — article (blog) and guide (content page template 22078:791901). */
const ContentBannerContainer = memo<ContentBannerProps>(
  ({
    post,
    variant: variantProp = "article",
    leadingImageSrc,
    leadingImageAlt,
  }) => {
    const variant = variantProp;

    const getBackgroundImage = (blogPost: BlogPost): string => {
      if (blogPost.frontmatter?.thumbnail?.horizontal) {
        return `/content/blog/${blogPost.frontmatter.thumbnail.horizontal}`;
      }
      return getAssetPath("assets/Content_Banner.svg");
    };

    const getBannerImageMd = (blogPost: BlogPost): string => {
      if (blogPost.frontmatter?.banner?.horizontal) {
        return `/content/blog/${blogPost.frontmatter.banner.horizontal}`;
      }
      if (blogPost.frontmatter?.thumbnail?.horizontal) {
        return `/content/blog/${blogPost.frontmatter.thumbnail.horizontal}`;
      }
      return getAssetPath("assets/Content_Banner_2.svg");
    };

    const backgroundImageSm =
      variant === "article" ? getBackgroundImage(post) : undefined;
    const backgroundImageMd =
      variant === "article" ? getBannerImageMd(post) : undefined;

    return (
      <ContentBannerView
        variant={variant}
        post={post}
        leadingImageSrc={leadingImageSrc}
        leadingImageAlt={leadingImageAlt}
        backgroundImageSm={backgroundImageSm}
        backgroundImageMd={backgroundImageMd}
      />
    );
  },
);

ContentBannerContainer.displayName = "ContentBanner";

export default ContentBannerContainer;
