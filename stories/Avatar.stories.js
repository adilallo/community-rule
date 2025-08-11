import Avatar from "../app/components/Avatar";

export default {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large", "xlarge"],
    },
    src: {
      control: { type: "text" },
    },
    alt: {
      control: { type: "text" },
    },
  },
  args: {
    src: "/assets/Avatar_1.png",
    alt: "User Avatar",
    size: "medium",
  },
};

export const Default = {
  args: {
    src: "/assets/Avatar_1.png",
    alt: "User Avatar",
  },
};

export const Small = {
  args: {
    size: "small",
    src: "/assets/Avatar_2.png",
    alt: "Small Avatar",
  },
};

export const Medium = {
  args: {
    size: "medium",
    src: "/assets/Avatar_3.png",
    alt: "Medium Avatar",
  },
};

export const Large = {
  args: {
    size: "large",
    src: "/assets/Avatar_1.png",
    alt: "Large Avatar",
  },
};

export const XLarge = {
  args: {
    size: "xlarge",
    src: "/assets/Avatar_2.png",
    alt: "XLarge Avatar",
  },
};
