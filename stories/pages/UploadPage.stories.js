import UploadPage from "../../app/create/upload/page";

export default {
  title: "Pages/Create Flow/Upload",
  component: UploadPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Upload step: HeaderLockup + Upload control. Centered lockup at 640px+.",
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
