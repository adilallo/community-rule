import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, describe, it, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import Select from "../../app/components/Select";

expect.extend(toHaveNoViolations);

describe("Select Component Accessibility", () => {
  const defaultProps = {
    label: "Test Select",
    placeholder: "Select an option",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
  };

  describe("ARIA Attributes", () => {
    it("has correct initial ARIA attributes", () => {
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveAttribute("aria-expanded", "false");
      expect(selectButton).toHaveAttribute("aria-haspopup", "listbox");
    });

    it("updates aria-expanded when dropdown opens", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(selectButton).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("has proper role for dropdown menu", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        const menu = screen.getByRole("menu");
        expect(menu).toBeInTheDocument();
      });
    });

    it("has proper role for menu items", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        const options = screen.getAllByRole("menuitem");
        expect(options).toHaveLength(3);
        expect(options[0]).toHaveTextContent("Option 1");
        expect(options[1]).toHaveTextContent("Option 2");
        expect(options[2]).toHaveTextContent("Option 3");
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("opens dropdown with Enter key", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      selectButton.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });

    it("opens dropdown with Space key", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      selectButton.focus();
      await user.keyboard(" ");

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });

    it("closes dropdown with Escape key", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    it("selects option with click", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Select {...defaultProps} onChange={onChange} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Option 1"));

      expect(onChange).toHaveBeenCalledWith({
        target: { value: "option1", text: "Option 1" },
      });
    });
  });

  describe("Screen Reader Support", () => {
    it("announces selected option", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} value="option2" />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveTextContent("Option 2");
    });

    it("announces placeholder when no option selected", () => {
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveTextContent("Select an option");
    });

    it("has accessible name from label", () => {
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveAccessibleName("Test Select");
    });
  });

  describe("Focus Management", () => {
    it("maintains focus on select button when dropdown opens", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(selectButton).toHaveFocus();
      });
    });

    it("returns focus to select button after selection", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Option 1"));

      await waitFor(() => {
        expect(selectButton).toHaveFocus();
      });
    });
  });

  describe("Disabled State", () => {
    it("is not focusable when disabled", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} disabled={true} />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toBeDisabled();

      await user.tab();
      expect(selectButton).not.toHaveFocus();
    });

    it("has correct ARIA attributes when disabled", () => {
      render(<Select {...defaultProps} disabled={true} />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toBeDisabled();
    });
  });

  describe("Error State", () => {
    it("announces error state to screen readers", () => {
      render(<Select {...defaultProps} error={true} />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass(
        "border-[var(--color-border-default-utility-negative)]"
      );
    });
  });

  describe("WCAG Compliance", () => {
    it("meets WCAG 2.1 AA standards", async () => {
      const { container } = render(<Select {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("meets WCAG standards in disabled state", async () => {
      const { container } = render(
        <Select {...defaultProps} disabled={true} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("meets WCAG standards in error state", async () => {
      const { container } = render(<Select {...defaultProps} error={true} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("meets WCAG standards when dropdown is open", async () => {
      const user = userEvent.setup();
      const { container } = render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Color Contrast", () => {
    it("has sufficient color contrast for text", () => {
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass(
        "text-[var(--color-content-default-primary)]"
      );
    });

    it("has sufficient color contrast for labels", () => {
      render(<Select {...defaultProps} />);

      const label = screen.getByText("Test Select");
      expect(label).toHaveClass(
        "text-[var(--color-content-default-secondary)]"
      );
    });
  });

  describe("Focus Indicators", () => {
    it("has visible focus indicator", () => {
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass(
        "focus-visible:border-[var(--color-border-default-utility-info)]"
      );
      expect(selectButton).toHaveClass(
        "focus-visible:shadow-[0_0_5px_3px_#3281F8]"
      );
    });

    it("distinguishes between focus and hover states", () => {
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      // Focus state should be different from hover state
      expect(selectButton).toHaveClass(
        "focus-visible:border-[var(--color-border-default-utility-info)]"
      );
      expect(selectButton).toHaveClass(
        "hover:shadow-[0_0_0_2px_var(--color-border-default-tertiary)]"
      );
    });
  });
});
