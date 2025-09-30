import ContentBanner from "../app/components/ContentBanner";

const mockBlogPost = {
  slug: "sample-article",
  frontmatter: {
    title: "Sample Article Title",
    description:
      "This is a sample article description that explains what the article covers.",
    author: "Sample Author",
    date: "2025-01-15",
  },
  htmlContent:
    "<p>This is the main content of the sample article.</p><p>It has multiple paragraphs.</p>",
};

export default {
  title: "Components/ContentBanner",
  component: ContentBanner,
  parameters: {
    docs: {
      description: {
        component:
          "The ContentBanner component displays the header information for blog articles, including title, description, author, and date. Note: page background colors are applied at the blog page level using a hex color from frontmatter (background.color), not inside this component. Thumbnail images should be uploaded via the content pipeline to public/content/blog/ and referenced in frontmatter (thumbnail.horizontal / thumbnail.vertical).",
      },
    },
  },
  argTypes: {
    post: {
      control: "object",
      description: "Blog post object with frontmatter and content",
    },
  },
};

export const Default = {
  args: {
    post: mockBlogPost,
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
