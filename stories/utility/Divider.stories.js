import Divider from "../../app/components/utility/Divider";

export default {
  title: "Components/Utility/Divider",
  component: Divider,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
    docs: {
      description: {
        component:
          "Figma Utility / Divider (450:1941). Content uses border secondary; Menu uses tertiary. Horizontal and vertical orientations.",
      },
    },
  },
  argTypes: {
    orientation: { control: { type: "select" }, options: ["horizontal", "vertical"] },
    type: { control: { type: "select" }, options: ["content", "menu"] },
  },
  tags: ["autodocs"],
};

export const ContentHorizontal = {
  args: {
    type: "content",
    orientation: "horizontal",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-[var(--color-surface-default-primary)] p-4">
        <Story />
      </div>
    ),
  ],
};

export const MenuHorizontal = {
  args: {
    type: "menu",
    orientation: "horizontal",
  },
  decorators: [ContentHorizontal.decorators[0]],
};

export const ContentVertical = {
  args: {
    type: "content",
    orientation: "vertical",
  },
  render: (args) => (
    <div className="flex h-20 w-full max-w-md items-stretch bg-[var(--color-surface-default-primary)] p-4">
      <span className="text-xs text-[var(--color-content-default-secondary)]">A</span>
      <Divider {...args} className="mx-2" />
      <span className="text-xs text-[var(--color-content-default-secondary)]">B</span>
    </div>
  ),
};

export const Matrix = {
  render: () => (
    <div className="space-y-8 bg-[var(--color-surface-default-primary)] p-6 text-[var(--color-content-default-primary)]">
      <div>
        <p className="mb-2 text-xs text-[var(--color-content-default-tertiary)]">Content</p>
        <div className="max-w-sm space-y-1">
          <Divider type="content" orientation="horizontal" />
        </div>
        <p className="mb-2 mt-6 text-xs text-[var(--color-content-default-tertiary)]">Menu</p>
        <div className="max-w-sm space-y-1">
          <Divider type="menu" orientation="horizontal" />
        </div>
      </div>
    </div>
  ),
};
