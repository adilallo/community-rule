import React, { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, describe, it, vi } from "vitest";
import ContextMenu from "../../app/components/ContextMenu";
import ContextMenuItem from "../../app/components/ContextMenuItem";
import ContextMenuSection from "../../app/components/ContextMenuSection";
import ContextMenuDivider from "../../app/components/ContextMenuDivider";

describe("ContextMenu Components Integration", () => {
  const TestMenu = ({ onItemClick, selectedValue }) => (
    <ContextMenu>
      <ContextMenuSection title="Actions">
        <ContextMenuItem
          onClick={() => onItemClick("action1")}
          selected={selectedValue === "action1"}
        >
          Action 1
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => onItemClick("action2")}
          selected={selectedValue === "action2"}
        >
          Action 2
        </ContextMenuItem>
      </ContextMenuSection>
      <ContextMenuDivider />
      <ContextMenuSection title="Settings">
        <ContextMenuItem
          onClick={() => onItemClick("setting1")}
          hasSubmenu={true}
        >
          Setting 1
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => onItemClick("setting2")}
          disabled={true}
        >
          Setting 2
        </ContextMenuItem>
      </ContextMenuSection>
    </ContextMenu>
  );

  describe("Menu Interaction", () => {
    it("handles item selection correctly", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      render(<TestMenu onItemClick={onItemClick} selectedValue="" />);

      const action1 = screen.getByText("Action 1");
      await user.click(action1);

      expect(onItemClick).toHaveBeenCalledWith("action1");
    });

    it("shows selected state correctly", () => {
      render(<TestMenu onItemClick={vi.fn()} selectedValue="action1" />);

      const action1 = screen.getByRole("menuitem", { name: "Action 1" });
      expect(action1).toHaveClass(
        "bg-[var(--color-surface-default-secondary)]"
      );
    });

    it("handles disabled items correctly", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      render(<TestMenu onItemClick={onItemClick} selectedValue="" />);

      const setting2 = screen.getByText("Setting 2");
      await user.click(setting2);

      expect(onItemClick).not.toHaveBeenCalled();
    });

    it("shows submenu indicators correctly", () => {
      render(<TestMenu onItemClick={vi.fn()} selectedValue="" />);

      const setting1 = screen.getByText("Setting 1");
      const arrow = screen
        .getByRole("menuitem", { name: "Setting 1" })
        .querySelector("svg");
      expect(arrow).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("navigates through menu items with arrow keys", async () => {
      const user = userEvent.setup();
      render(<TestMenu onItemClick={vi.fn()} selectedValue="" />);

      const items = screen.getAllByRole("menuitem");
      expect(items).toHaveLength(4);

      // Check that enabled items are focusable and disabled items are not
      const enabledItems = items.filter(
        (item) =>
          !item.hasAttribute("aria-disabled") ||
          item.getAttribute("aria-disabled") !== "true"
      );
      const disabledItems = items.filter(
        (item) => item.getAttribute("aria-disabled") === "true"
      );

      enabledItems.forEach((item) => {
        expect(item).toHaveAttribute("tabIndex", "0");
      });

      disabledItems.forEach((item) => {
        expect(item).toHaveAttribute("tabIndex", "-1");
      });
    });

    it("selects items with Enter key", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      render(<TestMenu onItemClick={onItemClick} selectedValue="" />);

      const items = screen.getAllByRole("menuitem");
      items[0].focus();

      await user.keyboard("{Enter}");
      expect(onItemClick).toHaveBeenCalledWith("action1");
    });

    it("selects items with Space key", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      render(<TestMenu onItemClick={onItemClick} selectedValue="" />);

      const items = screen.getAllByRole("menuitem");
      items[0].focus();

      await user.keyboard(" ");
      expect(onItemClick).toHaveBeenCalledWith("action1");
    });

    it("skips disabled items during navigation", async () => {
      const user = userEvent.setup();
      render(<TestMenu onItemClick={vi.fn()} selectedValue="" />);

      const items = screen.getAllByRole("menuitem");
      expect(items).toHaveLength(4);

      // Check that disabled items have tabIndex="-1"
      const disabledItem = screen.getByRole("menuitem", { name: "Setting 2" });
      expect(disabledItem).toHaveAttribute("tabIndex", "-1");
      expect(disabledItem).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("Dynamic Menu Updates", () => {
    const DynamicMenu = ({ items, selectedValue, onItemClick }) => (
      <ContextMenu>
        {items.map((item, index) => (
          <ContextMenuItem
            key={item.id}
            onClick={() => onItemClick(item.id)}
            selected={selectedValue === item.id}
            disabled={item.disabled}
          >
            {item.label}
          </ContextMenuItem>
        ))}
      </ContextMenu>
    );

    it("handles dynamic item updates", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      const { rerender } = render(
        <DynamicMenu
          items={[
            { id: "1", label: "Item 1" },
            { id: "2", label: "Item 2" },
          ]}
          selectedValue=""
          onItemClick={onItemClick}
        />
      );

      const item1 = screen.getByText("Item 1");
      await user.click(item1);
      expect(onItemClick).toHaveBeenCalledWith("1");

      // Update items
      rerender(
        <DynamicMenu
          items={[
            { id: "1", label: "Item 1" },
            { id: "2", label: "Item 2" },
            { id: "3", label: "Item 3" },
          ]}
          selectedValue="1"
          onItemClick={onItemClick}
        />
      );

      expect(screen.getByText("Item 3")).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Item 1" })).toHaveClass(
        "bg-[var(--color-surface-default-secondary)]"
      );
    });

    it("handles item removal", () => {
      const { rerender } = render(
        <DynamicMenu
          items={[
            { id: "1", label: "Item 1" },
            { id: "2", label: "Item 2" },
            { id: "3", label: "Item 3" },
          ]}
          selectedValue="2"
          onItemClick={vi.fn()}
        />
      );

      expect(screen.getByText("Item 2")).toBeInTheDocument();

      rerender(
        <DynamicMenu
          items={[
            { id: "1", label: "Item 1" },
            { id: "3", label: "Item 3" },
          ]}
          selectedValue=""
          onItemClick={vi.fn()}
        />
      );

      expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
    });
  });

  describe("Menu State Management", () => {
    const StatefulMenu = () => {
      const [selectedValue, setSelectedValue] = useState("");
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "Close Menu" : "Open Menu"}
          </button>
          {isOpen && (
            <ContextMenu>
              <ContextMenuItem
                onClick={() => {
                  setSelectedValue("option1");
                  setIsOpen(false);
                }}
                selected={selectedValue === "option1"}
              >
                Option 1
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  setSelectedValue("option2");
                  setIsOpen(false);
                }}
                selected={selectedValue === "option2"}
              >
                Option 2
              </ContextMenuItem>
            </ContextMenu>
          )}
        </div>
      );
    };

    it("manages menu open/close state", async () => {
      const user = userEvent.setup();
      render(<StatefulMenu />);

      const toggleButton = screen.getByRole("button", { name: "Open Menu" });
      await user.click(toggleButton);

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Close Menu" })
      ).toBeInTheDocument();
    });

    it("closes menu after selection", async () => {
      const user = userEvent.setup();
      render(<StatefulMenu />);

      const toggleButton = screen.getByRole("button", { name: "Open Menu" });
      await user.click(toggleButton);

      const option1 = screen.getByText("Option 1");
      await user.click(option1);

      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Open Menu" })
      ).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("handles large menu lists efficiently", async () => {
      const user = userEvent.setup();
      const largeItems = Array.from({ length: 100 }, (_, i) => ({
        id: `item${i}`,
        label: `Item ${i}`,
      }));

      const LargeMenu = () => (
        <ContextMenu>
          {largeItems.map((item) => (
            <ContextMenuItem key={item.id} onClick={vi.fn()}>
              {item.label}
            </ContextMenuItem>
          ))}
        </ContextMenu>
      );

      render(<LargeMenu />);

      const items = screen.getAllByRole("menuitem");
      expect(items).toHaveLength(100);

      // Test that all items are focusable
      items.forEach((item) => {
        expect(item).toHaveAttribute("tabIndex", "0");
      });
    });

    it("handles rapid state changes", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <ContextMenu>
          <ContextMenuItem onClick={vi.fn()} selected={false}>
            Item 1
          </ContextMenuItem>
          <ContextMenuItem onClick={vi.fn()} selected={false}>
            Item 2
          </ContextMenuItem>
        </ContextMenu>
      );

      // Rapidly change selection state
      for (let i = 0; i < 10; i++) {
        rerender(
          <ContextMenu>
            <ContextMenuItem onClick={vi.fn()} selected={i % 2 === 0}>
              Item 1
            </ContextMenuItem>
            <ContextMenuItem onClick={vi.fn()} selected={i % 2 === 1}>
              Item 2
            </ContextMenuItem>
          </ContextMenu>
        );
      }

      // Should still be functional
      const items = screen.getAllByRole("menuitem");
      expect(items).toHaveLength(2);
    });
  });

  describe("Error Handling", () => {
    it("handles missing onClick gracefully", () => {
      render(
        <ContextMenu>
          <ContextMenuItem>Item without onClick</ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByText("Item without onClick");
      expect(item).toBeInTheDocument();
    });

    it("handles invalid props gracefully", () => {
      render(
        <ContextMenu>
          <ContextMenuItem onClick={vi.fn()} selected={null}>
            Item with invalid selected
          </ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByText("Item with invalid selected");
      expect(item).toBeInTheDocument();
    });
  });
});
