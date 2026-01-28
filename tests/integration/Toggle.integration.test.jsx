import React from "react";
import { expect, test, describe, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toggle from "../../app/components/Toggle";

describe("Toggle Integration", () => {
  test("handles form submission", () => {
    const handleSubmit = vi.fn();

    render(
      <form onSubmit={handleSubmit}>
        <Toggle label="Test Toggle" name="toggle" />
        <button type="submit">Submit</button>
      </form>,
    );

    const toggle = screen.getByRole("switch", { name: "Test Toggle" });
    const submitButton = screen.getByRole("button", { name: "Submit" });

    fireEvent.click(toggle);
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  test("handles keyboard navigation between toggles", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Toggle label="First Toggle" />
        <Toggle label="Second Toggle" />
        <Toggle label="Third Toggle" />
      </div>,
    );

    const firstToggle = screen.getByRole("switch", { name: "First Toggle" });
    const secondToggle = screen.getByRole("switch", { name: "Second Toggle" });
    const thirdToggle = screen.getByRole("switch", { name: "Third Toggle" });

    await user.tab();
    expect(firstToggle).toHaveFocus();

    await user.tab();
    expect(secondToggle).toHaveFocus();

    await user.tab();
    expect(thirdToggle).toHaveFocus();
  });

  test("handles dynamic prop changes", () => {
    const { rerender } = render(<Toggle label="Test Toggle" checked={false} />);

    let toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");

    rerender(<Toggle label="Test Toggle" checked={true} />);
    toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");

    rerender(<Toggle label="Test Toggle" disabled={true} />);
    toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("disabled");
  });

  test("handles multiple toggles in form", () => {
    const handleChange1 = vi.fn();
    const handleChange2 = vi.fn();

    render(
      <div>
        <Toggle label="First Toggle" onChange={handleChange1} />
        <Toggle label="Second Toggle" onChange={handleChange2} />
      </div>,
    );

    const firstToggle = screen.getByRole("switch", { name: "First Toggle" });
    const secondToggle = screen.getByRole("switch", { name: "Second Toggle" });

    fireEvent.click(firstToggle);
    expect(handleChange1).toHaveBeenCalledTimes(1);
    expect(handleChange2).not.toHaveBeenCalled();

    fireEvent.click(secondToggle);
    expect(handleChange2).toHaveBeenCalledTimes(1);
    expect(handleChange1).toHaveBeenCalledTimes(1);
  });

  test("handles state changes", () => {
    const { rerender } = render(<Toggle label="Test Toggle" state="default" />);

    let toggle = screen.getByRole("switch");
    expect(toggle).not.toHaveClass("shadow-[0_0_5px_1px_#3281F8]");

    rerender(<Toggle label="Test Toggle" state="focus" />);
    toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("shadow-[0_0_5px_1px_#3281F8]");
  });

  test("handles content changes", () => {
    const { rerender } = render(<Toggle label="Test Toggle" />);

    let toggle = screen.getByRole("switch");
    expect(toggle).not.toHaveTextContent("I");
    expect(toggle).not.toHaveTextContent("Toggle");

    rerender(<Toggle label="Test Toggle" showIcon={true} icon="I" />);
    toggle = screen.getByRole("switch");
    expect(toggle).toHaveTextContent("I");

    rerender(<Toggle label="Test Toggle" showText={true} text="Toggle" />);
    toggle = screen.getByRole("switch");
    expect(toggle).toHaveTextContent("Toggle");

    rerender(
      <Toggle
        label="Test Toggle"
        showIcon={true}
        showText={true}
        icon="I"
        text="Toggle"
      />,
    );
    toggle = screen.getByRole("switch");
    expect(toggle).toHaveTextContent("I");
    expect(toggle).toHaveTextContent("Toggle");
  });

  test("handles performance with many toggles", () => {
    const toggles = Array.from({ length: 100 }, (_, i) => (
      <Toggle key={i} label={`Toggle ${i}`} />
    ));

    const startTime = performance.now();
    render(<div>{toggles}</div>);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(1000); // Should render in less than 1 second
    expect(screen.getAllByRole("switch")).toHaveLength(100);
  });

  test("handles rapid state changes", () => {
    const handleChange = vi.fn();
    render(<Toggle label="Test Toggle" onChange={handleChange} />);

    const toggle = screen.getByRole("switch");

    // Rapid clicks
    for (let i = 0; i < 10; i++) {
      fireEvent.click(toggle);
    }

    expect(handleChange).toHaveBeenCalledTimes(10);
  });

  test("handles mixed content types", () => {
    render(
      <div>
        <Toggle label="Icon Toggle" showIcon={true} icon="I" />
        <Toggle label="Text Toggle" showText={true} text="Toggle" />
        <Toggle
          label="Both Toggle"
          showIcon={true}
          showText={true}
          icon="I"
          text="Toggle"
        />
        <Toggle label="Empty Toggle" />
      </div>,
    );

    const iconToggle = screen.getByRole("switch", { name: "Icon Toggle" });
    const textToggle = screen.getByRole("switch", { name: "Text Toggle" });
    const bothToggle = screen.getByRole("switch", { name: "Both Toggle" });
    const emptyToggle = screen.getByRole("switch", { name: "Empty Toggle" });

    expect(iconToggle).toHaveTextContent("I");
    expect(textToggle).toHaveTextContent("Toggle");
    expect(bothToggle).toHaveTextContent("I");
    expect(bothToggle).toHaveTextContent("Toggle");
    expect(emptyToggle).not.toHaveTextContent("I");
    expect(emptyToggle).not.toHaveTextContent("Toggle");
  });
});
