import FinalReviewPage from "../../app/create/final-review/page";

export default {
  title: "Pages/Create Flow/Final review",
  component: FinalReviewPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Pre-finalize review: HeaderLockup + expanded RuleCard sections.",
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
