import Scrollbar from "../../app/components/utility/Scrollbar";

const tallContent = (
  <div style={{ height: 400 }}>
    <p>Line 1</p>
    <p>Line 2</p>
    <p>Line 3</p>
    <p>Line 4</p>
    <p>Line 5</p>
    <p>Line 6</p>
    <p>Line 7</p>
    <p>Line 8</p>
    <p>Line 9</p>
    <p>Line 10</p>
  </div>
);

const wideContent = (
  <div style={{ display: "flex", width: 800, gap: 16 }}>
    <span>Item A</span>
    <span>Item B</span>
    <span>Item C</span>
    <span>Item D</span>
    <span>Item E</span>
  </div>
);

export default {
  title: "Components/Utility/Scrollbar",
  component: Scrollbar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A scrollable container that applies the design system scrollbar styling. Supports vertical, horizontal, or both overflow.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["vertical", "horizontal", "both"],
      description: "Scroll direction",
    },
  },
};

export const Default = {
  args: {
    children: tallContent,
    orientation: "vertical",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300, maxHeight: 200, border: "1px solid #ccc" }}>
        <Story />
      </div>
    ),
  ],
};

export const Horizontal = {
  args: {
    children: wideContent,
    orientation: "horizontal",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300, overflow: "hidden" }}>
        <Story />
      </div>
    ),
  ],
};

export const Both = {
  args: {
    children: (
      <div style={{ width: 400, height: 400 }}>
        <div style={{ width: 500, height: 500, padding: 8 }}>
          Scroll both directions. Content is larger than the container.
        </div>
      </div>
    ),
    orientation: "both",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300, height: 200, border: "1px solid #ccc" }}>
        <Story />
      </div>
    ),
  ],
};
