import { FinalReviewScreen } from "../../app/(app)/create/screens/review/FinalReviewScreen";

export default {
  title: "Pages/Create Flow/Final review",
  component: FinalReviewScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Pre-finalize review: HeaderLockup + expanded Rule sections.",
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
