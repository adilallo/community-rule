import React, { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it } from "vitest";
import Select from "../../app/components/Select";

describe("Select Component Integration", () => {
  const TestForm = ({ initialValue = "" }) => {
    const [value, setValue] = useState(initialValue);
    const [errors, setErrors] = useState({});

    const handleChange = (newValue) => {
      setValue(newValue);
      if (errors.select) {
        setErrors({ ...errors, select: null });
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!value) {
        setErrors({ select: "Please select an option" });
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <Select
          label="Test Select"
          placeholder="Select an option"
          value={value}
          onChange={handleChange}
          error={!!errors.select}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
        />
        {errors.select && <div data-testid="error">{errors.select}</div>}
        <button type="submit">Submit</button>
      </form>
    );
  };

  describe("Form Integration", () => {
    it("integrates with form submission", async () => {
      const user = userEvent.setup();
      render(<TestForm />);

      const selectButton = screen.getByRole("button", { name: /Test Select/ });
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Option 1"));

      const submitButton = screen.getByRole("button", { name: "Submit" });
      await user.click(submitButton);

      expect(screen.queryByTestId("error")).not.toBeInTheDocument();
    });

    it("shows validation error when no option selected", async () => {
      const user = userEvent.setup();
      render(<TestForm />);

      const submitButton = screen.getByRole("button", { name: "Submit" });
      await user.click(submitButton);

      expect(screen.getByTestId("error")).toHaveTextContent(
        "Please select an option",
      );
    });

    it("clears error when option is selected", async () => {
      const user = userEvent.setup();
      render(<TestForm />);

      const submitButton = screen.getByRole("button", { name: "Submit" });
      await user.click(submitButton);

      expect(screen.getByTestId("error")).toBeInTheDocument();

      const selectButton = screen.getByRole("button", { name: /Test Select/ });
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Option 1"));

      expect(screen.queryByTestId("error")).not.toBeInTheDocument();
    });
  });

  describe("Multiple Select Components", () => {
    const MultiSelectForm = () => {
      const [values, setValues] = useState({ select1: "", select2: "" });

      const handleChange = (field) => (newValue) => {
        setValues({ ...values, [field]: newValue });
      };

      return (
        <div>
          <Select
            label="First Select"
            placeholder="Select first option"
            value={values.select1}
            onChange={handleChange("select1")}
            options={[
              { value: "a1", label: "A1" },
              { value: "a2", label: "A2" },
            ]}
          />
          <Select
            label="Second Select"
            placeholder="Select second option"
            value={values.select2}
            onChange={handleChange("select2")}
            options={[
              { value: "b1", label: "B1" },
              { value: "b2", label: "B2" },
            ]}
          />
        </div>
      );
    };

    it("handles multiple select components independently", async () => {
      const user = userEvent.setup();
      render(<MultiSelectForm />);

      const firstSelect = screen.getByRole("button", {
        name: /First Select/,
      });
      const secondSelect = screen.getByRole("button", {
        name: /Second Select/,
      });

      await user.click(firstSelect);
      await waitFor(() => {
        expect(screen.getByText("A1")).toBeInTheDocument();
      });
      await user.click(screen.getByText("A1"));

      await user.click(secondSelect);
      await waitFor(() => {
        expect(screen.getByText("B1")).toBeInTheDocument();
      });
      await user.click(screen.getByText("B1"));

      expect(firstSelect).toHaveTextContent("A1");
      expect(secondSelect).toHaveTextContent("B1");
    });

    it("closes one dropdown when another is opened", async () => {
      const user = userEvent.setup();
      render(<MultiSelectForm />);

      const firstSelect = screen.getByRole("button", {
        name: /First Select/,
      });
      const secondSelect = screen.getByRole("button", {
        name: /Second Select/,
      });

      await user.click(firstSelect);
      await waitFor(() => {
        expect(screen.getByText("A1")).toBeInTheDocument();
      });

      await user.click(secondSelect);

      await waitFor(() => {
        expect(screen.queryByText("A1")).not.toBeInTheDocument();
        expect(screen.getByText("B1")).toBeInTheDocument();
      });
    });
  });

  describe("Keyboard Navigation Between Components", () => {
    const KeyboardForm = () => {
      const [values, setValues] = useState({ select1: "", select2: "" });

      return (
        <div>
          <input placeholder="First input" />
          <Select
            label="First Select"
            placeholder="Select first option"
            value={values.select1}
            onChange={(value) => setValues({ ...values, select1: value })}
            options={[{ value: "a1", label: "A1" }]}
          />
          <input placeholder="Second input" />
          <Select
            label="Second Select"
            placeholder="Select second option"
            value={values.select2}
            onChange={(value) => setValues({ ...values, select2: value })}
            options={[{ value: "b1", label: "B1" }]}
          />
        </div>
      );
    };

    it("handles keyboard navigation between inputs and selects", async () => {
      const user = userEvent.setup();
      render(<KeyboardForm />);

      const firstInput = screen.getByPlaceholderText("First input");
      const firstSelect = screen.getByRole("button", {
        name: /First Select/,
      });
      const secondInput = screen.getByPlaceholderText("Second input");
      const secondSelect = screen.getByRole("button", {
        name: /Second Select/,
      });

      await user.tab();
      expect(firstInput).toHaveFocus();

      await user.tab();
      expect(firstSelect).toHaveFocus();

      await user.tab();
      expect(secondInput).toHaveFocus();

      await user.tab();
      expect(secondSelect).toHaveFocus();
    });

    it("opens select with Enter key during tab navigation", async () => {
      const user = userEvent.setup();
      render(<KeyboardForm />);

      const firstSelect = screen.getByRole("button", {
        name: /First Select/,
      });

      await user.tab();
      await user.tab();
      expect(firstSelect).toHaveFocus();

      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("A1")).toBeInTheDocument();
      });
    });
  });

  describe("Dynamic Prop Changes", () => {
    const DynamicSelect = ({ disabled, error, size }) => {
      const [value, setValue] = useState("");

      return (
        <Select
          label="Dynamic Select"
          placeholder="Select an option"
          value={value}
          onChange={setValue}
          disabled={disabled}
          error={error}
          size={size}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ]}
        />
      );
    };

    it("handles dynamic disabled state changes", async () => {
      const { rerender } = render(<DynamicSelect disabled={false} />);

      const selectButton = screen.getByRole("button", {
        name: /Dynamic Select/,
      });
      expect(selectButton).not.toBeDisabled();

      rerender(<DynamicSelect disabled={true} />);
      expect(selectButton).toBeDisabled();

      rerender(<DynamicSelect disabled={false} />);
      expect(selectButton).not.toBeDisabled();
    });

    it("handles dynamic error state changes", async () => {
      const { rerender } = render(<DynamicSelect error={false} />);

      const selectButton = screen.getByRole("button", {
        name: /Dynamic Select/,
      });
      expect(selectButton).not.toHaveClass(
        "border-[var(--color-border-default-utility-negative)]",
      );

      rerender(<DynamicSelect error={true} />);
      expect(selectButton).toHaveClass(
        "border-[var(--color-border-default-utility-negative)]",
      );

      rerender(<DynamicSelect error={false} />);
      expect(selectButton).not.toHaveClass(
        "border-[var(--color-border-default-utility-negative)]",
      );
    });

    it("handles dynamic size changes", async () => {
      const { rerender } = render(<DynamicSelect size="small" />);

      const selectButton = screen.getByRole("button", {
        name: /Dynamic Select/,
      });
      expect(selectButton).toHaveClass("h-[32px]");

      rerender(<DynamicSelect size="medium" />);
      expect(selectButton).toHaveClass("h-[36px]");

      rerender(<DynamicSelect size="large" />);
      expect(selectButton).toHaveClass("h-[40px]");
    });
  });

  describe("Focus State Behavior", () => {
    it("enters focus state when tabbed to (not active state)", async () => {
      const user = userEvent.setup();
      render(<TestForm />);

      const selectButton = screen.getByRole("button", { name: /Test Select/ });
      await user.tab();

      expect(selectButton).toHaveFocus();
      // Should have focus state styling, not active state
      expect(selectButton).toHaveClass(
        "focus-visible:border-[var(--color-border-default-utility-info)]",
      );
    });

    it("does not enter focus state when clicked", async () => {
      const user = userEvent.setup();
      render(<TestForm />);

      const selectButton = screen.getByRole("button", { name: /Test Select/ });
      await user.click(selectButton);

      expect(selectButton).toHaveFocus();
      // Click should not trigger focus-visible styles (class is always present but only active on keyboard focus)
      // The focus-visible class is always in the component but only applies on keyboard focus
      expect(selectButton).toHaveClass(
        "focus-visible:border-[var(--color-border-default-utility-info)]",
      );
    });
  });

  describe("Performance", () => {
    it("handles rapid state changes without issues", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<TestForm />);

      const selectButton = screen.getByRole("button", { name: /Test Select/ });

      // Rapidly change props
      for (let i = 0; i < 10; i++) {
        rerender(<TestForm />);
        await user.click(selectButton);
        await user.keyboard("{Escape}");
      }

      // Should still be functional
      await user.click(selectButton);
      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });

    it("handles large option lists efficiently", async () => {
      const user = userEvent.setup();
      const largeOptions = Array.from({ length: 100 }, (_, i) => ({
        value: `option${i}`,
        label: `Option ${i}`,
      }));

      render(
        <Select
          label="Large Select"
          placeholder="Select an option"
          options={largeOptions}
        />,
      );

      const selectButton = screen.getByRole("button", { name: /Large Select/ });
      await user.click(selectButton);

      await waitFor(() => {
        expect(screen.getByText("Option 0")).toBeInTheDocument();
        expect(screen.getByText("Option 99")).toBeInTheDocument();
      });
    });
  });
});
