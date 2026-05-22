import React from "react";
import ContentBanner from "../../app/components/sections/ContentBanner";

const mockBlogPost = {
  slug: "sample-article",
  frontmatter: {
    title: "Sample Article Title",
    description:
      "This is a sample article description that explains what the article covers.",
    author: "Sample Author",
    date: "2025-01-15",
    thumbnail: {
      horizontal: "resolving-active-conflicts-horizontal.svg",
      vertical: "resolving-active-conflicts-vertical.svg",
    },
    banner: {
      horizontal: "resolving-active-conflicts-section.svg",
    },
  },
  htmlContent:
    "<p>This is the main content of the sample article.</p><p>It has multiple paragraphs.</p>",
};

const guidePost = {
  slug: "__how-it-works__",
  frontmatter: {
    title: "A Guide to CommunityRule",
    description:
      "CommunityRule is a modular governance toolkit designed to help democratic groups build, customize, and publish their own Operating Manual.",
    author: "CommunityRule",
    date: "2026-01-15",
  },
  content: "",
  htmlContent: "",
  filePath: "messages/en/pages/howItWorks.json",
  lastModified: new Date("2026-01-15"),
};

export default {
  title: "Components/Sections/ContentBanner",
  component: ContentBanner,
  parameters: {
    docs: {
      description: {
        component:
          "Section / ContentBanner — `article` variant for blog posts (thumbnail/banner imagery, icon, author, date); `guide` variant for static content pages (left: title + description, right: logo mark — Figma 22078:791901 + 22078:806960).",
      },
    },
    layout: "fullscreen",
  },
  argTypes: {
    post: {
      control: "object",
      description: "Blog post object with frontmatter and content",
    },
    variant: {
      control: "select",
      options: ["article", "guide", "useCase"],
    },
    rulePreview: {
      control: "object",
      description: "useCase variant only",
    },
  },
};

export const Article = {
  args: {
    post: mockBlogPost,
    variant: "article",
  },
};

const useCaseRulePreview = {
  title: "Mutual Aid Colorado Operating Manual",
  description:
    "Shared values, resource distribution, volunteer shifts, and consensus-minus-one decisions.",
  backgroundColor: "bg-[var(--color-surface-invert-brand-lavender)]",
  iconPath: "assets/case-study/case-study-mutual-aid.svg",
};

export const UseCase = {
  args: {
    post: guidePost,
    variant: "useCase",
    rulePreview: useCaseRulePreview,
    leadingImageAlt: "Mutual Aid Colorado logo",
    contentTone: "onLight",
  },
  decorators: [
    (Story) => (
      <div
        className="min-h-screen"
        style={{ background: "var(--color-content-default-brand-lavender)" }}
      >
        <Story />
      </div>
    ),
  ],
};

export const Guide = {
  args: {
    post: guidePost,
    variant: "guide",
  },
  decorators: [
    (Story) => (
      <div className="bg-[var(--color-surface-default-primary)]">
        <Story />
      </div>
    ),
  ],
};

export const NoBannerFallbackToThumbnail = {
  args: {
    post: {
      ...mockBlogPost,
      frontmatter: {
        ...mockBlogPost.frontmatter,
        banner: undefined,
      },
    },
  },
};

export const NoImagesFallbackToDefault = {
  args: {
    post: {
      ...mockBlogPost,
      frontmatter: {
        ...mockBlogPost.frontmatter,
        thumbnail: undefined,
        banner: undefined,
      },
    },
  },
};

export const LongTitle = {
  args: {
    post: {
      ...mockBlogPost,
      frontmatter: {
        ...mockBlogPost.frontmatter,
        title:
          "This is a Very Long Article Title That Tests How the Component Handles Extended Text",
        description:
          "This is a longer description that tests how the component handles extended text content and ensures proper wrapping and display.",
      },
    },
  },
};

export const DifferentAuthor = {
  args: {
    post: {
      ...mockBlogPost,
      frontmatter: {
        ...mockBlogPost.frontmatter,
        title: "Article by Different Author",
        author: "Community Organizer",
        date: "2025-02-20",
      },
    },
  },
};
