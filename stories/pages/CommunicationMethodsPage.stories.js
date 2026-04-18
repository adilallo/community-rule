import { CommunicationMethodsScreen } from "../../app/create/screens/card/CommunicationMethodsScreen";

export default {
  title: "Pages/Create Flow/Communication methods",
  component: CommunicationMethodsScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Communication methods step (`/create/communication-methods`): card stack, modals, responsive layout.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-screen items-center justify-center bg-black">
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
