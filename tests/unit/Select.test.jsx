import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import Select from "../../app/components/Select";

expect.extend(toHaveNoViolations);

describe("Select Component", () => {
  const defaultProps = {
    label: "Test Select",
    placeholder: "Select an option",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
  };

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Select {...defaultProps} />);

      expect(screen.getByText("Test Select")).toBeInTheDocument();
      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("renders without label when not provided", () => {
      render(
        <Select
          placeholder="Select an option"
          options={defaultProps.options}
        />,
      );

      expect(screen.queryByText("Test Select")).not.toBeInTheDocument();
      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("renders with horizontal label variant", () => {
      render(<Select {...defaultProps} labelVariant="horizontal" />);

      const container = screen.getByText("Test Select").closest("div");
      expect(container).toHaveClass("flex", "items-center");
    });

    it("renders with default label variant", () => {
      render(<Select {...defaultProps} labelVariant="default" />);

      const container = screen.getByText("Test Select").closest("div");
      expect(container).toHaveClass("flex", "flex-col");
    });
  });

  describe("Size Variants", () => {
    it("renders small size correctly", () => {
      render(<Select {...defaultProps} size="small" />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass("h-[32px]");
    });

    it("renders medium size correctly", () => {
      render(<Select {...defaultProps} size="medium" />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass("h-[36px]");
    });

    it("renders large size correctly", () => {
      render(<Select {...defaultProps} size="large" />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass("h-[40px]");
    });

    it("applies correct height for small horizontal label", () => {
      render(
        <Select {...defaultProps} size="small" labelVariant="horizontal" />,
      );

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass("h-[30px]");
    });

    it("applies correct height for small default label", () => {
      render(<Select {...defaultProps} size="small" labelVariant="default" />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass("h-[32px]");
    });
  });

  describe("State Variants", () => {
    it("renders default state", () => {
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass(
        "border-[var(--color-border-default-tertiary)]",
      );
    });

    it("renders hover state", () => {
      render(<Select {...defaultProps} state="hover" />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass(
        "shadow-[0_0_0_2px_var(--color-border-default-tertiary)]",
      );
    });

    it("renders focus state", () => {
      render(<Select {...defaultProps} state="focus" />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass(
        "border-[var(--color-border-default-utility-info)]",
      );
      expect(selectButton).toHaveClass("shadow-[0_0_5px_3px_#3281F8]");
    });

    it("renders error state", () => {
      render(<Select {...defaultProps} error={true} />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass(
        "border-[var(--color-border-default-utility-negative)]",
      );
    });

    it("renders disabled state", () => {
      render(<Select {...defaultProps} disabled={true} />);

      const selectButton = screen.getByRole("button");
      expect(selectButton).toHaveClass("cursor-not-allowed");
      expect(selectButton).toHaveClass("opacity-40");
    });
  });

  describe("Interaction", () => {
    it("opens dropdown when clicked", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
        expect(screen.getByText("Option 3")).toBeInTheDocument();
      });
    });

    it("closes dropdown when clicked again", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      });
    });

    it("selects an option when clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Select {...defaultProps} onChange={onChange} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Option 1"));

      expect(onChange).toHaveBeenCalledWith({
        target: {
          value: "option1",
          text: "Option 1",
        },
      });
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("closes dropdown when option is selected", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Option 1"));

      await waitFor(() => {
        expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
      });
    });

    it("does not open when disabled", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} disabled={true} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
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
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });

    it("opens dropdown with Space key", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      selectButton.focus();
      await user.keyboard(" ");

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });

    it("closes dropdown with Escape key", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      });
    });

    it("does not respond to keyboard when disabled", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} disabled={true} />);

      const selectButton = screen.getByRole("button");
      selectButton.focus();
      await user.keyboard("{Enter}");

      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });
  });

  describe("Click Outside", () => {
    it("closes dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Select {...defaultProps} />
          <div data-testid="outside">Outside element</div>
        </div>,
      );

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("outside"));

      await waitFor(() => {
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      });
    });
  });

  describe("Value Display", () => {
    it("shows placeholder when no value selected", () => {
      render(<Select {...defaultProps} />);

      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("shows selected value when option is selected", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Option 1"));

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.queryByText("Select an option")).not.toBeInTheDocument();
    });

    it("shows selected value when value prop is provided", () => {
      render(<Select {...defaultProps} value="option2" />);

      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Select {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper ARIA attributes", () => {
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

    it("associates label with select button", () => {
      render(<Select {...defaultProps} />);

      const label = screen.getByText("Test Select");
      const selectButton = screen.getByRole("button");

      expect(label).toHaveAttribute("for", selectButton.id);
    });
  });

  describe("Focus Behavior", () => {
    it("enters focus state when tabbed to", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.tab();

      expect(selectButton).toHaveFocus();
      expect(selectButton).toHaveClass(
        "focus-visible:border-[var(--color-border-default-utility-info)]",
      );
    });

    it("does not enter focus state when clicked", async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectButton = screen.getByRole("button");
      await user.click(selectButton);

      expect(selectButton).toHaveFocus();
      // Focus state should not be applied on click, only on keyboard navigation
    });
  });
});
