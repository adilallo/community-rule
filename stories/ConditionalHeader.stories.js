import ConditionalHeader from "../app/components/ConditionalHeader";

export default {
  title: "Components/ConditionalHeader",
  component: ConditionalHeader,
  parameters: {
    docs: {
      description: {
        component:
          "The ConditionalHeader component conditionally renders either HomeHeader or Header based on the current pathname.",
      },
    },
  },
  argTypes: {
    pathname: {
      control: "text",
      description: "Current pathname to determine which header to render",
    },
  },
};

export const HomePage = {
  args: {
    pathname: "/",
  },
};

export const BlogPage = {
  args: {
    pathname: "/blog/sample-article",
  },
};

export const OtherPage = {
  args: {
    pathname: "/about",
  },
};
