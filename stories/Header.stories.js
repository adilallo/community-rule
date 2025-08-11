import Header from "../app/components/Header";

export default {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onToggle: { action: "toggle" },
  },
};

export const Default = {
  args: {},
};

export const WithToggleHandler = {
  args: {
    onToggle: () => console.log("Header toggle clicked"),
  },
};

export const ResponsiveView = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm font-medium mb-2">
        Responsive Header Component
      </div>
      <Header />
      <div className="p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          This header adapts to different screen sizes with responsive
          navigation, logo sizing, and button layouts.
        </p>
      </div>
    </div>
  ),
};
