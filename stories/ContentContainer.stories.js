import ContentContainer from "../app/components/ContentContainer";

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
  title: "Components/ContentContainer",
  component: ContentContainer,
  parameters: {
    docs: {
      description: {
        component:
          "The ContentContainer component displays article metadata including title, description, author, and date in a structured layout.",
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
      description: "Order index for cycling through different icon styles",
    },
  },
};

export const Default = {
  args: {
    post: mockPost,
    slugOrder: 0,
  },
};

export const SecondStyle = {
  args: {
    post: mockPost,
    slugOrder: 1,
  },
};

export const ThirdStyle = {
  args: {
    post: mockPost,
    slugOrder: 2,
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
          "This is a longer description that tests how the component handles extended text content and ensures proper wrapping and display within the container.",
      },
    },
    slugOrder: 0,
  },
};
