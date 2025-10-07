import ErrorBoundary from "../app/components/ErrorBoundary";

export default {
  title: "Components/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An error boundary component that catches JavaScript errors in its child component tree. Displays a fallback UI when errors occur and logs error information for debugging.",
      },
    },
  },
  argTypes: {
    children: {
      control: { type: "text" },
      description: "Child components to wrap with error boundary",
    },
  },
};

export default ErrorBoundary;
