import "../app/globals.css";

/** @type { import('@storybook/nextjs-vite').Preview } */
const preview = {
  parameters: {
    nextjs: { appDirectory: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },

    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#000000",
        },
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },

    viewport: {
      defaultViewport: "md",
      viewports: {
        xsm: {
          name: "XSmall (≤429px)",
          styles: { width: "429px", height: "800px" },
        },
        sm: {
          name: "Small (≥430px)",
          styles: { width: "430px", height: "800px" },
        },
        md: {
          name: "Medium (≥640px)",
          styles: { width: "640px", height: "800px" },
        },
        lg: {
          name: "Large (≥1024px)",
          styles: { width: "1024px", height: "800px" },
        },
        xl: {
          name: "XLarge (≥1440px)",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },
  },
};

export default preview;
