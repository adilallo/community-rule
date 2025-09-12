import ContentThumbnailTemplate from "../app/components/ContentThumbnailTemplate";

const mockPost = {
  slug: "sample-article",
  frontmatter: {
    title: "Sample Article Title",
    description:
      "This is a sample article description that explains what the article covers.",
    author: "Sample Author",
    date: "2025-01-15",
  },
};

export default {
  title: "Components/ContentThumbnailTemplate",
  component: ContentThumbnailTemplate,
  parameters: {
    docs: {
      description: {
        component:
          "The ContentThumbnailTemplate component displays blog post previews with background images, content, and metadata in both vertical and horizontal layouts.",
      },
    },
  },
  argTypes: {
    post: {
      control: "object",
      description: "Blog post object with frontmatter",
    },
    slugOrder: {
      control: "number",
      description:
        "Order index for cycling through different background and icon styles",
    },
    variant: {
      control: { type: "select" },
      options: ["vertical", "horizontal"],
      description: "Layout variant for the thumbnail",
    },
  },
};

export const Vertical = {
  args: {
    post: mockPost,
    slugOrder: 0,
    variant: "vertical",
  },
};

export const Horizontal = {
  args: {
    post: mockPost,
    slugOrder: 0,
    variant: "horizontal",
  },
};

export const SecondStyle = {
  args: {
    post: mockPost,
    slugOrder: 1,
    variant: "vertical",
  },
};

export const ThirdStyle = {
  args: {
    post: mockPost,
    slugOrder: 2,
    variant: "vertical",
  },
};

export const LongContent = {
  args: {
    post: {
      ...mockPost,
      frontmatter: {
        ...mockPost.frontmatter,
        title: "This is a Very Long Article Title That Tests Text Wrapping",
        description:
          "This is a longer description that tests how the component handles extended text content and ensures proper wrapping and display within the thumbnail.",
      },
    },
    slugOrder: 0,
    variant: "vertical",
  },
};
