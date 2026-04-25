import ListEntry from "../../app/components/layout/ListEntry";

export default {
  title: "Components/Layout/ListEntry",
  component: ListEntry,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
    docs: {
      description: {
        component:
          'Figma "Base / Interactive" (21844:4118). One row: rules, icon, title, description, chevron.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[200px] bg-[var(--color-surface-default-primary)] p-6">
        <div className="mx-auto max-w-[1044px]">
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    size: { control: { type: "select" }, options: ["s", "m", "l"] },
    topDivider: { control: { type: "boolean" } },
    bottomDivider: { control: { type: "boolean" } },
    showDescription: { control: { type: "boolean" } },
    leadingIcon: {
      control: { type: "select" },
      options: ["edit", "mail", "warning"],
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "Item",
    description: "Description/text only option here.",
    size: "m",
    href: "#",
    topDivider: true,
    bottomDivider: true,
    showDescription: true,
    leadingIcon: "edit",
  },
};

export const SizeSmall = {
  args: {
    ...Default.args,
    size: "s",
  },
};

export const SizeLarge = {
  args: {
    ...Default.args,
    size: "l",
  },
};
