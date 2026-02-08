import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import CreateFlowTopNav from "../../app/components/utility/CreateFlowTopNav";
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
    loggedIn: true,
    onShare: vi.fn(),
    onExport: vi.fn(),
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

  it("shows Save & Exit when loggedIn is true", () => {
    render(<CreateFlowTopNav loggedIn={true} />);
    const exitButton = screen.getByRole("button", { name: "Save & Exit" });
    expect(exitButton).toBeInTheDocument();
  });

  it("shows Exit when loggedIn is false", () => {
    render(<CreateFlowTopNav loggedIn={false} />);
    const exitButton = screen.getByRole("button", { name: "Exit" });
    expect(exitButton).toBeInTheDocument();
  });

  it("renders Share button when hasShare is true", () => {
    render(<CreateFlowTopNav hasShare={true} />);
    const shareButton = screen.getByRole("button", { name: "Share" });
    expect(shareButton).toBeInTheDocument();
  });

  it("does not render Share button when hasShare is false", () => {
    render(<CreateFlowTopNav hasShare={false} />);
    expect(screen.queryByRole("button", { name: "Share" })).not.toBeInTheDocument();
  });

  it("renders Export button when hasExport is true", () => {
    render(<CreateFlowTopNav hasExport={true} />);
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

  it("calls onShare when Share button is clicked", async () => {
    const user = userEvent.setup();
    const handleShare = vi.fn();
    render(<CreateFlowTopNav hasShare={true} onShare={handleShare} />);

    const shareButton = screen.getByRole("button", { name: "Share" });
    await user.click(shareButton);

    expect(handleShare).toHaveBeenCalledTimes(1);
  });
});
