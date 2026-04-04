import ReviewPage from "../../app/create/review/page";

export default {
  title: "Pages/Create Flow/Review",
  component: ReviewPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Mid-flow review step (after upload). 640px+: HeaderLockup left (L), RuleCard right (L, collapsed). Below 640px: single column with HeaderLockup M and RuleCard M. Figma: 19688-13891, 19706-12120.",
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
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
