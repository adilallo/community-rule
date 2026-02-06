import ConditionalHeader from "../../app/components/navigation/ConditionalHeader";

export default {
  title: "Components/Navigation/ConditionalHeader",
  component: ConditionalHeader,
  parameters: {
    docs: {
      description: {
        component:
          "The ConditionalHeader component conditionally renders either HomeHeader (for home page) or Header (for other pages) based on the current pathname. HomeHeader is not sticky, while Header has sticky positioning.",
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
