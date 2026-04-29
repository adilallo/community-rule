import Link from "../../app/components/navigation/Link";

export default {
  title: "Components/Navigation/Link",
  component: Link,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Figma Navigation / Link (21861:21428). States are CSS-only (hover, focus-visible, active).",
      },
    },
  },
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["primary", "secondary"],
    },
    variant: {
      control: { type: "select" },
      options: ["default", "paragraph"],
    },
    theme: {
      control: { type: "select" },
      options: ["light", "dark"],
    },
    leadingIcon: { control: { type: "boolean" } },
    trailingIcon: { control: { type: "boolean" } },
    href: { control: { type: "text" } },
    children: { control: { type: "text" } },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    children: "Link Text",
    type: "primary",
    variant: "paragraph",
    theme: "light",
    href: "#",
  },
};

/**
 * Static grid: type × variant × theme (use browser :hover / Tab for states).
 */
export const Matrix = {
  render: () => (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <p className="mb-3 font-inter text-sm text-[var(--color-content-default-secondary)]">
          Light background
        </p>
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
          <div className="flex flex-wrap gap-6">
            <Link type="primary" variant="default" theme="light" href="#">
              Primary / default
            </Link>
            <Link type="primary" variant="paragraph" theme="light" href="#">
              Primary / paragraph
            </Link>
            <Link type="secondary" variant="default" theme="light" href="#">
              Secondary / default
            </Link>
            <Link type="secondary" variant="paragraph" theme="light" href="#">
              Secondary / paragraph
            </Link>
          </div>
        </div>
      </div>
      <div>
        <p className="mb-3 font-inter text-sm text-[var(--color-content-default-secondary)]">
          Dark background
        </p>
        <div className="flex flex-col gap-4 rounded-lg bg-[var(--color-gray-800)] p-4">
          <div className="flex flex-wrap gap-6">
            <Link type="primary" variant="default" theme="dark" href="#">
              Primary / default
            </Link>
            <Link type="primary" variant="paragraph" theme="dark" href="#">
              Primary / paragraph
            </Link>
            <Link type="secondary" variant="default" theme="dark" href="#">
              Secondary / default
            </Link>
            <Link type="secondary" variant="paragraph" theme="dark" href="#">
              Secondary / paragraph
            </Link>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AsButton = {
  args: {
    children: "Action",
    type: "primary",
    variant: "paragraph",
    theme: "light",
    onClick: () => {},
  },
};
