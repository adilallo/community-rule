import React from "react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import {
  renderWithProviders as render,
  screen,
  waitFor,
} from "../utils/test-utils";
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
    hasManageStakeholders: true,
    onManageStakeholders: vi.fn(),
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

  it("renders Manage Stakeholders when hasManageStakeholders is true", () => {
    render(
      <CreateFlowTopNav
        hasManageStakeholders={true}
        onManageStakeholders={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Manage Stakeholders" }),
    ).toBeInTheDocument();
  });

  it("calls onManageStakeholders when Manage Stakeholders is clicked", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <CreateFlowTopNav
        hasManageStakeholders={true}
        onManageStakeholders={handler}
      />,
    );
    await user.click(
      screen.getByRole("button", { name: "Manage Stakeholders" }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("renders Duplicate button when hasDuplicate is true", () => {
    render(
      <CreateFlowTopNav
        hasDuplicate={true}
        duplicateLabel="Duplicate"
        duplicateAriaLabel="Duplicate"
        onDuplicate={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Duplicate" }),
    ).toBeInTheDocument();
  });

  it("uses exitLabel override when provided", () => {
    render(<CreateFlowTopNav exitLabel="Return" />);
    expect(screen.getByRole("button", { name: "Return" })).toBeInTheDocument();
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

describe("CreateFlowTopNav (viewport < sm2 / 440px)", () => {
  const defaultInnerWidth = 1200;

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 320,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: defaultInnerWidth,
    });
  });

  const completedScreenProps = {
    hasShare: true,
    hasExport: true,
    hasEdit: true,
    saveDraftOnExit: true,
    onShare: vi.fn(),
    onSelectExportFormat: vi.fn(),
    onEdit: vi.fn(),
    onExit: vi.fn(),
  } as const;

  it("collapses secondary actions into a kebab menu", async () => {
    render(<CreateFlowTopNav {...completedScreenProps} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "More options" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: "Share" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Export" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Save & Exit" }),
    ).not.toBeInTheDocument();
  });

  it("opens kebab menu with share, export formats, edit, and save & exit", async () => {
    const user = userEvent.setup();
    render(<CreateFlowTopNav {...completedScreenProps} />);

    const kebab = await screen.findByRole("button", { name: "More options" });
    await user.click(kebab);

    expect(screen.getByRole("menuitem", { name: "Share" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Download PDF" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Download CSV" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Download Markdown" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Save & Exit" }),
    ).toBeInTheDocument();
  });

  it("invokes handlers from kebab menu items", async () => {
    const user = userEvent.setup();
    const handleShare = vi.fn();
    const handleEdit = vi.fn();
    const handleExit = vi.fn();

    render(
      <CreateFlowTopNav
        {...completedScreenProps}
        onShare={handleShare}
        onEdit={handleEdit}
        onExit={handleExit}
      />,
    );

    const kebab = await screen.findByRole("button", { name: "More options" });
    await user.click(kebab);
    await user.click(screen.getByRole("menuitem", { name: "Share" }));
    expect(handleShare).toHaveBeenCalledTimes(1);

    await user.click(kebab);
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(handleEdit).toHaveBeenCalledTimes(1);

    await user.click(kebab);
    await user.click(screen.getByRole("menuitem", { name: "Save & Exit" }));
    expect(handleExit).toHaveBeenCalledTimes(1);
  });
});
