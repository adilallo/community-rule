import RelatedArticles from "../app/components/RelatedArticles";

const mockRelatedPosts = [
  {
    slug: "related-article-1",
    frontmatter: {
      title: "Related Article One",
      description: "This is the first related article description.",
      author: "Author One",
      date: "2025-01-10",
    },
  },
  {
    slug: "related-article-2",
    frontmatter: {
      title: "Related Article Two",
      description: "This is the second related article description.",
      author: "Author Two",
      date: "2025-01-12",
    },
  },
  {
    slug: "related-article-3",
    frontmatter: {
      title: "Related Article Three",
      description: "This is the third related article description.",
      author: "Author Three",
      date: "2025-01-14",
    },
  },
];

export default {
  title: "Components/RelatedArticles",
  component: RelatedArticles,
  parameters: {
    docs: {
      description: {
        component:
          "The RelatedArticles component displays a carousel of related blog posts with progress bars on mobile and a scrollable slider on desktop.",
      },
    },
  },
  argTypes: {
    relatedPosts: {
      control: "object",
      description: "Array of related blog post objects",
    },
    currentPostSlug: {
      control: "text",
      description: "Slug of the current post to exclude from related articles",
    },
  },
};

export const Default = {
  args: {
    relatedPosts: mockRelatedPosts,
    currentPostSlug: "current-article",
  },
};

export const TwoArticles = {
  args: {
    relatedPosts: mockRelatedPosts.slice(0, 2),
    currentPostSlug: "current-article",
  },
};

export const OneArticle = {
  args: {
    relatedPosts: mockRelatedPosts.slice(0, 1),
    currentPostSlug: "current-article",
  },
};

export const Empty = {
  args: {
    relatedPosts: [],
    currentPostSlug: "current-article",
  },
};

export const LongTitles = {
  args: {
    relatedPosts: [
      {
        slug: "long-title-1",
        frontmatter: {
          title:
            "This is a Very Long Article Title That Tests Text Wrapping and Display",
          description:
            "This is a longer description that tests how the component handles extended text content.",
          author: "Author One",
          date: "2025-01-10",
        },
      },
      {
        slug: "long-title-2",
        frontmatter: {
          title: "Another Very Long Article Title for Testing Purposes",
          description:
            "Another longer description for testing text handling in the component.",
          author: "Author Two",
          date: "2025-01-12",
        },
      },
      {
        slug: "long-title-3",
        frontmatter: {
          title: "Third Long Article Title to Complete the Set",
          description:
            "Final longer description to test the component's text handling capabilities.",
          author: "Author Three",
          date: "2025-01-14",
        },
      },
    ],
    currentPostSlug: "current-article",
  },
};
