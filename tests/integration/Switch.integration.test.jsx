import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Switch from "../../app/components/Switch";

// Test form component
const TestForm = ({ onSubmit }) => {
  const [switch1, setSwitch1] = React.useState(false);
  const [switch2, setSwitch2] = React.useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ switch1, switch2 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Switch
        checked={switch1}
        onChange={() => setSwitch1(!switch1)}
        label="First Switch"
      />
      <Switch
        checked={switch2}
        onChange={() => setSwitch2(!switch2)}
        label="Second Switch"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

// Dynamic switch component
const DynamicSwitch = ({ initialState = false }) => {
  const [checked, setChecked] = React.useState(initialState);

  // Update state when initialState prop changes
  React.useEffect(() => {
    setChecked(initialState);
  }, [initialState]);

  return (
    <div>
      <Switch
        checked={checked}
        onChange={() => setChecked(!checked)}
        label="Dynamic Switch"
      />
    </div>
  );
};

describe("Switch Integration", () => {
  it("handles form submission", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<TestForm onSubmit={handleSubmit} />);

    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      switch1: false,
      switch2: true,
    });
  });

  it("handles keyboard navigation between switches", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Switch label="First Switch" />
        <Switch label="Second Switch" />
        <Switch label="Third Switch" />
      </div>,
    );

    const switches = screen.getAllByRole("switch");
    expect(switches).toHaveLength(3);

    // Focus first switch
    await user.tab();
    expect(switches[0]).toHaveFocus();

    // Tab to second switch
    await user.tab();
    expect(switches[1]).toHaveFocus();

    // Tab to third switch
    await user.tab();
    expect(switches[2]).toHaveFocus();
  });

  it("handles dynamic prop changes", () => {
    const { rerender } = render(<DynamicSwitch initialState={false} />);

    let switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveAttribute("aria-checked", "false");

    // Change initial state - the DynamicSwitch component should handle this internally
    rerender(<DynamicSwitch initialState={true} />);
    switchButton = screen.getByRole("switch");
    // The DynamicSwitch component manages its own state, so it should be checked
    expect(switchButton).toHaveAttribute("aria-checked", "true");
  });

  it("handles multiple switches in form", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    const TestForm = () => {
      const [switch1, setSwitch1] = React.useState(false);
      const [switch2, setSwitch2] = React.useState(false);
      const [switch3, setSwitch3] = React.useState(false);

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Switch
            label="Switch 1"
            checked={switch1}
            onChange={() => setSwitch1(!switch1)}
          />
          <Switch
            label="Switch 2"
            checked={switch2}
            onChange={() => setSwitch2(!switch2)}
          />
          <Switch
            label="Switch 3"
            checked={switch3}
            onChange={() => setSwitch3(!switch3)}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    render(<TestForm />);

    const switches = screen.getAllByRole("switch");
    expect(switches).toHaveLength(3);

    // Toggle first switch
    await user.click(switches[0]);
    expect(switches[0]).toHaveAttribute("aria-checked", "true");

    // Toggle second switch
    await user.click(switches[1]);
    expect(switches[1]).toHaveAttribute("aria-checked", "true");

    // Submit form
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("handles state changes", async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [checked, setChecked] = React.useState(false);

      return (
        <div>
          <Switch
            checked={checked}
            onChange={() => setChecked(!checked)}
            label="Test Switch"
          />
        </div>
      );
    };

    render(<TestComponent />);

    const switchButton = screen.getByRole("switch");

    // Initially unchecked
    expect(switchButton).toHaveAttribute("aria-checked", "false");

    // Toggle checked state
    await user.click(switchButton);
    expect(switchButton).toHaveAttribute("aria-checked", "true");
  });

  it("handles content changes", () => {
    const { rerender } = render(<Switch label="Original Label" />);
    expect(screen.getByText("Original Label")).toBeInTheDocument();

    rerender(<Switch label="Updated Label" />);
    expect(screen.getByText("Updated Label")).toBeInTheDocument();
    expect(screen.queryByText("Original Label")).not.toBeInTheDocument();
  });

  it("handles performance with many switches", () => {
    const switches = Array.from({ length: 100 }, (_, i) => (
      <Switch key={i} label={`Switch ${i + 1}`} />
    ));

    const startTime = performance.now();
    render(<div>{switches}</div>);
    const endTime = performance.now();

    // Should render within reasonable time (less than 1 second)
    expect(endTime - startTime).toBeLessThan(1000);

    const renderedSwitches = screen.getAllByRole("switch");
    expect(renderedSwitches).toHaveLength(100);
  });

  it("handles rapid state changes", async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [checked, setChecked] = React.useState(false);

      return (
        <Switch
          checked={checked}
          onChange={() => setChecked(!checked)}
          label="Rapid Toggle Switch"
        />
      );
    };

    render(<TestComponent />);

    const switchButton = screen.getByRole("switch");

    // Rapidly toggle the switch
    for (let i = 0; i < 10; i++) {
      await user.click(switchButton);
      await waitFor(() => {
        expect(switchButton).toHaveAttribute(
          "aria-checked",
          i % 2 === 0 ? "true" : "false",
        );
      });
    }
  });

  it("handles mixed content types", () => {
    render(
      <div>
        <Switch label="Text Switch" />
        <Switch label="Another Text Switch" />
        <Switch />
        <Switch label="Final Switch" />
      </div>,
    );

    const switches = screen.getAllByRole("switch");
    expect(switches).toHaveLength(4);

    // Check that labels are rendered correctly
    expect(screen.getByText("Text Switch")).toBeInTheDocument();
    expect(screen.getByText("Another Text Switch")).toBeInTheDocument();
    expect(screen.getByText("Final Switch")).toBeInTheDocument();
  });
});
