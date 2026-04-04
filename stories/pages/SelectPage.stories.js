import SelectPage from "../../app/create/select/page";

export default {
  title: "Pages/Create Flow/Select",
  component: SelectPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Multi-select template: two columns at 640px+, stacked below. MultiSelect with add → custom chip.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export const Desktop = {
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
};

export const Mobile = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
