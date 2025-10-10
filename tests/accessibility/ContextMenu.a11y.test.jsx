import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, describe, it, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import ContextMenu from "../../app/components/ContextMenu";
import ContextMenuItem from "../../app/components/ContextMenuItem";
import ContextMenuSection from "../../app/components/ContextMenuSection";
import ContextMenuDivider from "../../app/components/ContextMenuDivider";

expect.extend(toHaveNoViolations);

describe("ContextMenu Components Accessibility", () => {
  describe("ContextMenu Accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuItem onClick={vi.fn()}>Item 1</ContextMenuItem>
          <ContextMenuItem onClick={vi.fn()}>Item 2</ContextMenuItem>
        </ContextMenu>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper role and structure", () => {
      render(
        <ContextMenu>
          <ContextMenuItem onClick={vi.fn()}>Item 1</ContextMenuItem>
          <ContextMenuItem onClick={vi.fn()}>Item 2</ContextMenuItem>
        </ContextMenu>
      );

      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();

      const items = screen.getAllByRole("menuitem");
      expect(items).toHaveLength(2);
    });

    it("has proper focus management", async () => {
      const user = userEvent.setup();
      render(
        <ContextMenu>
          <ContextMenuItem onClick={vi.fn()}>Item 1</ContextMenuItem>
          <ContextMenuItem onClick={vi.fn()}>Item 2</ContextMenuItem>
        </ContextMenu>
      );

      const firstItem = screen.getByRole("menuitem", { name: "Item 1" });
      expect(firstItem).toHaveAttribute("tabIndex", "0");
      expect(firstItem).toBeInTheDocument();
    });
  });

  describe("ContextMenuItem Accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuItem onClick={vi.fn()}>Test Item</ContextMenuItem>
        </ContextMenu>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper ARIA attributes", () => {
      render(
        <ContextMenu>
          <ContextMenuItem onClick={vi.fn()}>Test Item</ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByRole("menuitem");
      expect(item).not.toHaveAttribute("aria-current");
    });

    it("updates aria-current when selected", () => {
      render(
        <ContextMenu>
          <ContextMenuItem onClick={vi.fn()} selected={true}>
            Test Item
          </ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByRole("menuitem");
      expect(item).toHaveAttribute("aria-current", "true");
    });

    it("is keyboard accessible", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <ContextMenu>
          <ContextMenuItem onClick={onClick}>Test Item</ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByRole("menuitem");
      item.focus();

      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalled();
    });

    it("is accessible with Space key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <ContextMenu>
          <ContextMenuItem onClick={onClick}>Test Item</ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByRole("menuitem");
      item.focus();

      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalled();
    });

    it("has proper focus indicators", () => {
      render(
        <ContextMenu>
          <ContextMenuItem onClick={vi.fn()}>Test Item</ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByRole("menuitem");
      expect(item).toHaveClass(
        "hover:!bg-[var(--color-surface-default-secondary)]"
      );
    });

    it("announces selection state to screen readers", () => {
      render(
        <ContextMenu>
          <ContextMenuItem onClick={vi.fn()} selected={true}>
            Test Item
          </ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByRole("menuitem");
      expect(item).toHaveAttribute("aria-current", "true");
    });
  });

  describe("ContextMenuSection Accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuSection title="Test Section">
            <ContextMenuItem onClick={vi.fn()}>Item 1</ContextMenuItem>
          </ContextMenuSection>
        </ContextMenu>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper heading structure", () => {
      render(
        <ContextMenu>
          <ContextMenuSection title="Test Section">
            <ContextMenuItem onClick={vi.fn()}>Item 1</ContextMenuItem>
          </ContextMenuSection>
        </ContextMenu>
      );

      const title = screen.getByText("Test Section");
      expect(title).toBeInTheDocument();
    });

    it("has sufficient color contrast for section title", () => {
      render(
        <ContextMenu>
          <ContextMenuSection title="Test Section">
            <ContextMenuItem onClick={vi.fn()}>Item 1</ContextMenuItem>
          </ContextMenuSection>
        </ContextMenu>
      );

      const title = screen.getByText("Test Section");
      expect(title).toHaveClass("text-[var(--color-content-default-primary)]");
    });
  });

  describe("ContextMenuDivider Accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<ContextMenuDivider />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper semantic structure", () => {
      render(<ContextMenuDivider />);

      const divider = screen.getByRole("separator");
      expect(divider).toBeInTheDocument();
    });

    it("has sufficient visual contrast", () => {
      render(<ContextMenuDivider />);

      const divider = screen.getByRole("separator");
      expect(divider).toHaveClass(
        "border-[var(--color-border-default-tertiary)]"
      );
    });
  });

  describe("Integrated Menu Accessibility", () => {
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

    it("has no accessibility violations when integrated", async () => {
      const { container } = render(<TestMenu />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper menu structure", () => {
      render(<TestMenu />);

      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();

      const items = screen.getAllByRole("menuitem");
      expect(items).toHaveLength(3);

      expect(screen.getByText("First Section")).toBeInTheDocument();
      expect(screen.getByText("Second Section")).toBeInTheDocument();
    });

    it("maintains proper focus order", async () => {
      const user = userEvent.setup();
      render(<TestMenu />);

      const items = screen.getAllByRole("menuitem");
      expect(items).toHaveLength(3);

      // Check that all items are focusable
      items.forEach((item) => {
        expect(item).toHaveAttribute("tabIndex", "0");
      });
    });

    it("handles keyboard navigation correctly", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <ContextMenu>
          <ContextMenuItem onClick={onClick}>Item 1</ContextMenuItem>
          <ContextMenuItem onClick={vi.fn()}>Item 2</ContextMenuItem>
        </ContextMenu>
      );

      const items = screen.getAllByRole("menuitem");
      items[0].focus();

      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("Color Contrast", () => {
    it("has sufficient contrast for menu items", () => {
      render(
        <ContextMenu>
          <ContextMenuItem onClick={vi.fn()}>Test Item</ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByRole("menuitem");
      expect(item).toHaveClass(
        "text-[var(--color-content-default-brand-primary)]"
      );
    });

    it("has sufficient contrast for section titles", () => {
      render(
        <ContextMenu>
          <ContextMenuSection title="Test Section" />
        </ContextMenu>
      );

      const title = screen.getByText("Test Section");
      expect(title).toHaveClass("text-[var(--color-content-default-primary)]");
    });

    it("has sufficient contrast for dividers", () => {
      render(
        <ContextMenu>
          <ContextMenuDivider />
        </ContextMenu>
      );

      const divider = screen.getByRole("separator");
      expect(divider).toHaveClass(
        "border-[var(--color-border-default-tertiary)]"
      );
    });
  });

  describe("Screen Reader Support", () => {
    it("announces menu structure correctly", () => {
      render(
        <ContextMenu>
          <ContextMenuSection title="Test Section">
            <ContextMenuItem onClick={vi.fn()}>Item 1</ContextMenuItem>
            <ContextMenuItem onClick={vi.fn()} selected={true}>
              Item 2
            </ContextMenuItem>
          </ContextMenuSection>
        </ContextMenu>
      );

      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();

      const items = screen.getAllByRole("menuitem");
      expect(items[0]).not.toHaveAttribute("aria-current");
      expect(items[1]).toHaveAttribute("aria-current", "true");
    });

    it("announces selection state changes", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <ContextMenuItem onClick={vi.fn()} selected={false}>
          Test Item
        </ContextMenuItem>
      );

      const item = screen.getByRole("menuitem");
      expect(item).not.toHaveAttribute("aria-current");

      rerender(
        <ContextMenuItem onClick={vi.fn()} selected={true}>
          Test Item
        </ContextMenuItem>
      );

      expect(item).toHaveAttribute("aria-current", "true");
    });
  });

  describe("WCAG Compliance", () => {
    it("meets WCAG 2.1 AA standards", async () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuSection title="Test Section">
            <ContextMenuItem onClick={vi.fn()}>Item 1</ContextMenuItem>
            <ContextMenuItem onClick={vi.fn()} selected={true}>
              Item 2
            </ContextMenuItem>
          </ContextMenuSection>
          <ContextMenuDivider />
          <ContextMenuItem onClick={vi.fn()}>Item 3</ContextMenuItem>
        </ContextMenu>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("meets WCAG standards in all states", async () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuItem onClick={vi.fn()} selected={true}>
            Selected Item
          </ContextMenuItem>
          <ContextMenuItem onClick={vi.fn()} hasSubmenu={true}>
            Submenu Item
          </ContextMenuItem>
          <ContextMenuItem onClick={vi.fn()} disabled={true}>
            Disabled Item
          </ContextMenuItem>
        </ContextMenu>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
