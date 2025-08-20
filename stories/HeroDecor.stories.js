import HeroDecor from "../app/components/HeroDecor";

export default {
  title: "Components/HeroDecor",
  component: HeroDecor,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A decorative SVG component that provides background visual elements for the HeroBanner. Features grain effects and organic shapes that enhance the visual appeal without interfering with content readability.",
      },
    },
  },
  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes for positioning and styling",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    className: "w-[400px] h-[200px]",
  },
  parameters: {
    docs: {
      description: {
        story: "Default hero decoration with standard sizing and positioning.",
      },
    },
  },
};

export const WithBackground = {
  args: {
    className: "w-[600px] h-[300px]",
  },
  render: (args) => (
    <div className="bg-[var(--color-surface-default-brand-primary)] p-8 rounded-lg relative overflow-hidden">
      <HeroDecor {...args} />
      <div className="relative z-10 text-white mt-4">
        <h3>Content Overlay</h3>
        <p>This demonstrates how the decoration appears behind content.</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Hero decoration with background color to show how it integrates with content.",
      },
    },
  },
};
