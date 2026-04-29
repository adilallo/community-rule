import List from "../../app/components/layout/List";

const fiveItems = [
  {
    id: "1",
    title: "Item",
    description: "Description/text only option here.",
    href: "#",
  },
  {
    id: "2",
    title: "Item",
    description: "Description/text only option here.",
    href: "#",
  },
  {
    id: "3",
    title: "Item",
    description: "Description/text only option here.",
    href: "#",
  },
  {
    id: "4",
    title: "Item",
    description: "Description/text only option here.",
    href: "#",
  },
  {
    id: "5",
    title: "Item",
    description: "Description/text only option here.",
    href: "#",
  },
];

export default {
  title: "Components/Layout/List",
  component: List,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
    docs: {
      description: {
        component:
          "Figma list frames: S (21863:45631), M (21863:45493), L (21844:4405). Built from ListEntry (21844:4118).",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[480px] bg-[var(--color-surface-default-primary)] p-6">
        <div className="mx-auto max-w-[1044px]">
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    size: { control: { type: "select" }, options: ["s", "m", "l"] },
    topDivider: { control: { type: "boolean" } },
    leadingIcon: {
      control: { type: "select" },
      options: ["edit", "mail", "warning"],
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    items: fiveItems,
    size: "m",
    topDivider: true,
    leadingIcon: "edit",
  },
};

export const NoTopDivider = {
  args: {
    ...Default.args,
    topDivider: false,
  },
};

export const Small = {
  args: {
    ...Default.args,
    size: "s",
  },
};

export const Large = {
  args: {
    ...Default.args,
    size: "l",
  },
};
