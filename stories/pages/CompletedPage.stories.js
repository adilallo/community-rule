import { CompletedScreen } from "../../app/(app)/create/screens/completed/CompletedScreen";
import { CREATE_FLOW_LAST_PUBLISHED_KEY } from "../../lib/create/lastPublishedRule";

const storySessionFixture = {
  id: "story-rule",
  title: "Storybook Community Rule",
  summary: "Preview copy loaded from sessionStorage for this story.",
  document: {
    sections: [
      {
        categoryName: "Values",
        entries: [
          {
            title: "Preview value",
            body: "Example body so the document column is populated in Storybook.",
          },
        ],
      },
    ],
  },
};

export default {
  title: "Pages/Create Flow/Completed",
  component: CompletedScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Completed flow: teal background, inverse HeaderLockup, CommunityRule body, optional bottom toast.",
      },
    },
  },
  decorators: [
    (Story) => {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(
          CREATE_FLOW_LAST_PUBLISHED_KEY,
          JSON.stringify(storySessionFixture),
        );
      }
      return (
        <div className="min-h-screen bg-[var(--color-teal-teal50,#c9fef9)] flex flex-col items-center">
          <Story />
        </div>
      );
    },
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
