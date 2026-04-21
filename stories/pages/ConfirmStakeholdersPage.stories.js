import { ConfirmStakeholdersScreen } from "../../app/(app)/create/screens/select/ConfirmStakeholdersScreen";

export default {
  title: "Pages/Create Flow/Confirm stakeholders",
  component: ConfirmStakeholdersScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Stacked lockup + MultiSelect; draft congratulations banner; before final review.",
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
