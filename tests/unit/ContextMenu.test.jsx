import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi, beforeEach } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import ContextMenu from "../../app/components/ContextMenu";
import ContextMenuItem from "../../app/components/ContextMenuItem";
import ContextMenuSection from "../../app/components/ContextMenuSection";
import ContextMenuDivider from "../../app/components/ContextMenuDivider";

expect.extend(toHaveNoViolations);

describe("ContextMenu Component", () => {
  const defaultProps = {
    children: "Context Menu Content",
  };

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<ContextMenu {...defaultProps} />);

      expect(screen.getByText("Context Menu Content")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<ContextMenu {...defaultProps} className="custom-class" />);

      const menu = screen.getByText("Context Menu Content").closest("div");
      expect(menu).toHaveClass("custom-class");
    });

    it("applies correct base styles", () => {
      render(<ContextMenu {...defaultProps} />);

      const menu = screen.getByText("Context Menu Content").closest("div");
      expect(menu).toHaveClass(
        "bg-black",
        "border",
        "rounded-[var(--measures-radius-medium)]",
        "shadow-lg",
        "p-[4px]",
      );
    });

    it("has solid black background", () => {
      render(<ContextMenu {...defaultProps} />);

      const menu = screen.getByText("Context Menu Content").closest("div");
      expect(menu).toHaveStyle({ backgroundColor: "#000000" });
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <ContextMenu {...defaultProps}>
          <ContextMenuItem onClick={vi.fn()}>Menu Item</ContextMenuItem>
        </ContextMenu>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper role", () => {
      render(<ContextMenu {...defaultProps} />);

      const menu = screen.getByText("Context Menu Content").closest("div");
      expect(menu).toHaveAttribute("role", "menu");
    });
  });
});

describe("ContextMenuItem Component", () => {
  const defaultProps = {
    children: "Menu Item",
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<ContextMenuItem {...defaultProps} />);

      expect(screen.getByText("Menu Item")).toBeInTheDocument();
    });

    it("renders as selected when selected prop is true", () => {
      render(<ContextMenuItem {...defaultProps} selected={true} />);

      const item = screen.getByRole("menuitem");
      expect(item).toHaveClass(
        "bg-[var(--color-surface-default-secondary)]",
        "rounded-[var(--measures-radius-small)]",
      );
    });

    it("renders with submenu arrow when hasSubmenu prop is true", () => {
      render(<ContextMenuItem {...defaultProps} hasSubmenu={true} />);

      // Check for the right-pointing chevron SVG
      const item = screen.getByRole("menuitem");
      const svg = item.querySelector("svg:last-child");
      expect(svg).toBeInTheDocument();
    });

    it("renders with checkmark when selected prop is true", () => {
      render(<ContextMenuItem {...defaultProps} selected={true} />);

      // Check for the checkmark SVG
      const item = screen.getByRole("menuitem");
      const svg = item.querySelector("svg:first-child");
      expect(svg).toBeInTheDocument();
    });

    it("applies correct size styles", () => {
      render(<ContextMenuItem {...defaultProps} size="small" />);

      const item = screen.getByRole("menuitem");
      expect(item).toHaveClass("text-[10px]", "leading-[14px]");
    });

    it("applies medium size styles", () => {
      render(<ContextMenuItem {...defaultProps} size="medium" />);

      const item = screen.getByRole("menuitem");
      expect(item).toHaveClass("text-[14px]", "leading-[20px]");
    });

    it("applies large size styles", () => {
      render(<ContextMenuItem {...defaultProps} size="large" />);

      const item = screen.getByRole("menuitem");
      expect(item).toHaveClass("text-[16px]", "leading-[24px]");
    });
  });

  describe("Interaction", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      render(<ContextMenuItem {...defaultProps} />);

      const item = screen.getByText("Menu Item");
      await user.click(item);

      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      render(<ContextMenuItem {...defaultProps} disabled={true} />);

      const item = screen.getByText("Menu Item");
      await user.click(item);

      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });

    it("has hover effects", () => {
      render(<ContextMenuItem {...defaultProps} />);

      const item = screen.getByRole("menuitem");
      expect(item).toHaveClass(
        "hover:!bg-[var(--color-surface-default-secondary)]",
      );
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuItem {...defaultProps} />
        </ContextMenu>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper role", () => {
      render(<ContextMenuItem {...defaultProps} />);

      const item = screen.getByRole("menuitem");
      expect(item).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies correct text color", () => {
      render(<ContextMenuItem {...defaultProps} />);

      const item = screen.getByRole("menuitem");
      expect(item).toHaveClass(
        "text-[var(--color-content-default-brand-primary)]",
      );
    });

    it("applies correct padding", () => {
      render(<ContextMenuItem {...defaultProps} />);

      const item = screen.getByRole("menuitem");
      expect(item).toHaveClass("px-[8px]", "py-[4px]");
    });

    it("applies correct gap between checkmark and text", () => {
      render(<ContextMenuItem {...defaultProps} selected={true} />);

      const item = screen.getByText("Menu Item").closest("div");
      expect(item).toHaveClass("gap-[8px]");
    });
  });
});

describe("ContextMenuSection Component", () => {
  const defaultProps = {
    title: "Section Title",
    children: "Section Content",
  };

  describe("Rendering", () => {
    it("renders with title and children", () => {
      render(<ContextMenuSection {...defaultProps} />);

      expect(screen.getByText("Section Title")).toBeInTheDocument();
      expect(screen.getByText("Section Content")).toBeInTheDocument();
    });

    it("renders without title when not provided", () => {
      render(<ContextMenuSection>Section Content</ContextMenuSection>);

      expect(screen.getByText("Section Content")).toBeInTheDocument();
      expect(screen.queryByText("Section Title")).not.toBeInTheDocument();
    });

    it("applies correct title styling", () => {
      render(<ContextMenuSection {...defaultProps} />);

      const title = screen.getByText("Section Title");
      expect(title).toHaveClass(
        "text-[var(--color-content-default-primary)]",
        "font-medium",
      );
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<ContextMenuSection {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe("ContextMenuDivider Component", () => {
  describe("Rendering", () => {
    it("renders divider", () => {
      render(<ContextMenuDivider />);

      const divider = screen.getByRole("separator");
      expect(divider).toBeInTheDocument();
    });

    it("applies correct styling", () => {
      render(<ContextMenuDivider />);

      const divider = screen.getByRole("separator");
      expect(divider).toHaveClass(
        "border-t",
        "border-[var(--color-border-default-tertiary)]",
        "my-1",
      );
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<ContextMenuDivider />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe("ContextMenu Components Integration", () => {
  const TestMenu = () => (
    <ContextMenu>
      <ContextMenuSection title="First Section">
        <ContextMenuItem onClick={vi.fn()}>Item 1</ContextMenuItem>
        <ContextMenuItem onClick={vi.fn()} selected={true}>
          Item 2
        </ContextMenuItem>
      </ContextMenuSection>
      <ContextMenuDivider />
      <ContextMenuSection title="Second Section">
        <ContextMenuItem onClick={vi.fn()} hasSubmenu={true}>
          Item 3
        </ContextMenuItem>
      </ContextMenuSection>
    </ContextMenu>
  );

  it("renders all components together", () => {
    render(<TestMenu />);

    expect(screen.getByText("First Section")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Second Section")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("has no accessibility violations when integrated", async () => {
    const { container } = render(<TestMenu />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
