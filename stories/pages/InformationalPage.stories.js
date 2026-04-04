import InformationalPage from "../../app/create/informational/page";

export default {
  title: "Pages/Create Flow/Informational",
  component: InformationalPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Create flow entry: HeaderLockup + NumberedList. Responsive L/M and M/S at 640px.",
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
