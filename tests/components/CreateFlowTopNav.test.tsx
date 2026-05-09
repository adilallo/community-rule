import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import CreateFlowTopNav from "../../app/components/navigation/CreateFlowTopNav";
import {
  componentTestSuite,
  ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

type CreateFlowTopNavProps = React.ComponentProps<typeof CreateFlowTopNav>;

const baseProps: CreateFlowTopNavProps = {};

const config: ComponentTestSuiteConfig<CreateFlowTopNavProps> = {
  component: CreateFlowTopNav,
  name: "CreateFlowTopNav",
  props: baseProps,
  requiredProps: [],
  optionalProps: {
    hasShare: true,
    hasExport: true,
    hasEdit: true,
    saveDraftOnExit: true,
    onShare: vi.fn(),
    onSelectExportFormat: vi.fn(),
    onEdit: vi.fn(),
    onExit: vi.fn(),
    className: "test-class",
  },
  primaryRole: "banner",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
};

componentTestSuite<CreateFlowTopNavProps>(config);

describe("CreateFlowTopNav (behavioral tests)", () => {
  it("renders Exit button by default", () => {
    render(<CreateFlowTopNav />);
    const exitButton = screen.getByRole("button", { name: "Exit" });
    expect(exitButton).toBeInTheDocument();
  });

  it("shows Save & Exit when saveDraftOnExit is true", () => {
    render(<CreateFlowTopNav saveDraftOnExit={true} />);
    const exitButton = screen.getByRole("button", { name: "Save & Exit" });
    expect(exitButton).toBeInTheDocument();
  });

  it.each([
    ["Download Markdown", "markdown"],
    ["Download PDF", "pdf"],
    ["Download CSV", "csv"],
  ] as const)(
    "opens export menu and calls onSelectExportFormat for %s",
    async (menuLabel, expectedFormat) => {
      const user = userEvent.setup();
      const handleExport = vi.fn();
      render(
        <CreateFlowTopNav
          hasExport={true}
          onSelectExportFormat={handleExport}
        />,
      );

      const exportButton = screen.getByRole("button", { name: "Export" });
      await user.click(exportButton);
      const item = screen.getByRole("menuitem", { name: menuLabel });
      await user.click(item);

      expect(handleExport).toHaveBeenCalledWith(expectedFormat);
    },
  );

  it("renders Share button when hasShare is true", () => {
    render(<CreateFlowTopNav hasShare={true} />);
    const shareButton = screen.getByRole("button", { name: "Share" });
    expect(shareButton).toBeInTheDocument();
  });

  it("does not render Share button when hasShare is false", () => {
    render(<CreateFlowTopNav hasShare={false} />);
    expect(
      screen.queryByRole("button", { name: "Share" }),
    ).not.toBeInTheDocument();
  });

  it("renders Export button when hasExport is true", () => {
    render(
      <CreateFlowTopNav
        hasExport={true}
        onSelectExportFormat={vi.fn()}
      />,
    );
    const exportButton = screen.getByRole("button", { name: "Export" });
    expect(exportButton).toBeInTheDocument();
  });

  it("renders Edit button when hasEdit is true", () => {
    render(<CreateFlowTopNav hasEdit={true} />);
    const editButton = screen.getByRole("button", { name: "Edit" });
    expect(editButton).toBeInTheDocument();
  });

  it("calls onExit when Exit button is clicked", async () => {
    const user = userEvent.setup();
    const handleExit = vi.fn();
    render(<CreateFlowTopNav onExit={handleExit} />);

    const exitButton = screen.getByRole("button", { name: "Exit" });
    await user.click(exitButton);

    expect(handleExit).toHaveBeenCalledTimes(1);
  });
});
