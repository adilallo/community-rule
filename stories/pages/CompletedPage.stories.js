import { CompletedScreen } from "../../app/create/screens/completed/CompletedScreen";

export default {
  title: "Pages/Create Flow/Completed",
  component: CompletedScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Completed flow: teal background, inverse HeaderLockup, CommunityRule document, optional bottom toast.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-[var(--color-teal-teal50,#c9fef9)] flex flex-col items-center">
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
