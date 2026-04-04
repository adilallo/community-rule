import RightRailPage from "../../app/create/right-rail/page";

export default {
  title: "Pages/Create Flow/Right rail",
  component: RightRailPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Decision-making sidebar layout with CardStack and supporting content.",
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
