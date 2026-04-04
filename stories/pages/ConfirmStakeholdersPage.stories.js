import ConfirmStakeholdersPage from "../../app/create/confirm-stakeholders/page";

export default {
  title: "Pages/Create Flow/Confirm stakeholders",
  component: ConfirmStakeholdersPage,
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
