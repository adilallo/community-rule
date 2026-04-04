import TextPage from "../../app/create/text/page";

export default {
  title: "Pages/Create Flow/Text",
  component: TextPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Community name step: HeaderLockup + TextInput. Responsive sizing at 640px.",
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
