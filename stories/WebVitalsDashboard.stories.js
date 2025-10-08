import WebVitalsDashboard from "../app/components/WebVitalsDashboard";

export default {
  title: "Components/WebVitalsDashboard",
  component: WebVitalsDashboard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A comprehensive dashboard component that displays real-time and historical Web Vitals data. Shows Core Web Vitals metrics, performance ratings, and optimization recommendations.",
      },
    },
  },
  argTypes: {},
};

export const Default = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "The default Web Vitals dashboard showing real-time performance metrics and historical data.",
      },
    },
  },
};

export const Loading = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "The dashboard in loading state while fetching Web Vitals data.",
      },
    },
  },
};
