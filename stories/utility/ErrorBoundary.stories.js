import ErrorBoundary from "../../app/components/utility/ErrorBoundary";

export default {
  title: "Components/Utility/ErrorBoundary",
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

export const Default = {
  args: {
    children: <div>Normal content</div>,
  },
};

export const WithError = {
  render: () => {
    const ThrowError = () => {
      throw new Error("Test error for ErrorBoundary");
    };
    return (
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
  },
};
