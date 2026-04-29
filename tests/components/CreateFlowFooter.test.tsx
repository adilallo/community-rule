import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import CreateFlowFooter from "../../app/components/navigation/CreateFlowFooter";
import Button from "../../app/components/buttons/Button";
import {
  componentTestSuite,
  ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type CreateFlowFooterProps = React.ComponentProps<typeof CreateFlowFooter>;

const baseProps: CreateFlowFooterProps = {};

const config: ComponentTestSuiteConfig<CreateFlowFooterProps> = {
  component: CreateFlowFooter,
  name: "CreateFlowFooter",
  props: baseProps,
  requiredProps: [],
  optionalProps: {
    secondButton: <Button>Next</Button>,
    progressBar: true,
    className: "test-class",
  },
  primaryRole: "contentinfo",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
};

componentTestSuite<CreateFlowFooterProps>(config);

// Pure presentational; no provider context needed (no useMessages/useAuthModal/useCreateFlow consumers).
describe("CreateFlowFooter (behavioral tests)", () => {
  it("renders Back button", () => {
    render(<CreateFlowFooter />);
    const backButton = screen.getByRole("button", { name: "Back" });
    expect(backButton).toBeInTheDocument();
  });

  it("renders progress bar when progressBar is true", () => {
    render(<CreateFlowFooter progressBar={true} />);
    const footer = screen.getByRole("contentinfo", {
      name: "Create Flow Footer",
    });
    expect(footer).toBeInTheDocument();
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", String(1 / 6));
  });

  it("passes proportionBarProgress to the progress bar", () => {
    render(
      <CreateFlowFooter
        progressBar={true}
        proportionBarProgress="1-1"
        proportionBarVariant="segmented"
      />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      String(2 / 6),
    );
  });

  it("does not render progress bar when progressBar is false", () => {
    const { container } = render(<CreateFlowFooter progressBar={false} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).not.toBeInTheDocument();
  });

  it("renders secondButton when provided", () => {
    const secondButton = <Button>Next</Button>;
    render(<CreateFlowFooter secondButton={secondButton} />);
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeInTheDocument();
  });

  it("does not render secondButton when not provided", () => {
    render(<CreateFlowFooter />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent("Back");
  });
});
