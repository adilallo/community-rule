import CardsPage from "../../app/create/cards/page";

export default {
  title: "Pages/Create Flow/Cards",
  component: CardsPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Communication / card selection step with modals and responsive layout.",
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
