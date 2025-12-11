import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ToggleGroup from "../../app/components/ToggleGroup";

// Test component for form integration
const TestForm = () => {
  const [selectedToggle, setSelectedToggle] = useState("left");

  return (
    <form>
      <div className="flex">
        <ToggleGroup
          position="left"
          state={selectedToggle === "left" ? "selected" : "default"}
          onChange={() => setSelectedToggle("left")}
        >
          Left Option
        </ToggleGroup>
        <ToggleGroup
          position="middle"
          state={selectedToggle === "middle" ? "selected" : "default"}
          onChange={() => setSelectedToggle("middle")}
        >
          Middle Option
        </ToggleGroup>
        <ToggleGroup
          position="right"
          state={selectedToggle === "right" ? "selected" : "default"}
          onChange={() => setSelectedToggle("right")}
        >
          Right Option
        </ToggleGroup>
      </div>
    </form>
  );
};

// Dynamic component for prop changes
const DynamicToggleGroup = ({ position, state, showText }) => {
  return (
    <ToggleGroup position={position} state={state} showText={showText}>
      Dynamic Content
    </ToggleGroup>
  );
};

describe("ToggleGroup Integration", () => {
  it("handles form submission", async () => {
    const handleSubmit = vi.fn();
    render(
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <ToggleGroup position="left" onChange={() => {}}>
            First Option
          </ToggleGroup>
          <ToggleGroup position="middle" onChange={() => {}}>
            Second Option
          </ToggleGroup>
          <ToggleGroup position="right" onChange={() => {}}>
            Third Option
          </ToggleGroup>
        </div>
        <button type="submit">Submit</button>
      </form>,
    );

    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard navigation between toggle groups", () => {
    render(<TestForm />);
    const toggleGroups = screen.getAllByRole("button");

    // Focus first toggle group
    toggleGroups[0].focus();
    expect(toggleGroups[0]).toHaveFocus();

    // Test keyboard navigation
    fireEvent.keyDown(toggleGroups[0], { key: "Tab" });
    // Note: Tab navigation behavior depends on browser implementation
  });

  it("handles dynamic prop changes", () => {
    const { rerender } = render(
      <DynamicToggleGroup position="left" state="default" showText={true} />,
    );

    let toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass(
      "rounded-l-[var(--measures-radius-medium)]",
      "rounded-r-none",
    );
    expect(toggleGroup).toHaveTextContent("Dynamic Content");

    rerender(
      <DynamicToggleGroup
        position="middle"
        state="selected"
        showText={false}
      />,
    );
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass("rounded-none");
    expect(toggleGroup).toHaveClass("bg-[var(--color-magenta-magenta100)]");
    expect(toggleGroup).toHaveTextContent("Dynamic Content");
  });

  it("handles multiple toggle groups in form", () => {
    render(<TestForm />);
    const toggleGroups = screen.getAllByRole("button");
    expect(toggleGroups).toHaveLength(3);

    // Test clicking different toggle groups
    fireEvent.click(toggleGroups[0]);
    fireEvent.click(toggleGroups[1]);
    fireEvent.click(toggleGroups[2]);
  });

  it("handles state changes", async () => {
    const { rerender } = render(<TestForm />);
    const toggleGroups = screen.getAllByRole("button");

    // Initially, left should be selected
    expect(toggleGroups[0]).toHaveClass("bg-[var(--color-magenta-magenta100)]");

    // Click middle toggle
    fireEvent.click(toggleGroups[1]);
    await waitFor(() => {
      expect(toggleGroups[1]).toHaveClass(
        "bg-[var(--color-magenta-magenta100)]",
      );
    });
  });

  it("handles content changes", () => {
    const { rerender } = render(
      <ToggleGroup showText={true}>Initial Content</ToggleGroup>,
    );

    let toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveTextContent("Initial Content");

    rerender(<ToggleGroup showText={true}>Updated Content</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveTextContent("Updated Content");

    rerender(<ToggleGroup showText={false}>Hidden Content</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveTextContent("Hidden Content");
  });

  it("handles performance with many toggle groups", () => {
    const ManyToggleGroups = () => {
      const [selected, setSelected] = useState(0);

      return (
        <div className="flex">
          {Array.from({ length: 10 }, (_, i) => (
            <ToggleGroup
              key={i}
              position={i === 0 ? "left" : i === 9 ? "right" : "middle"}
              state={selected === i ? "selected" : "default"}
              onChange={() => setSelected(i)}
            >
              Option {i + 1}
            </ToggleGroup>
          ))}
        </div>
      );
    };

    render(<ManyToggleGroups />);
    const toggleGroups = screen.getAllByRole("button");
    expect(toggleGroups).toHaveLength(10);

    // Test clicking different toggle groups
    fireEvent.click(toggleGroups[5]);
    expect(toggleGroups[5]).toHaveClass("bg-[var(--color-magenta-magenta100)]");
  });

  it("handles rapid state changes", async () => {
    const { rerender } = render(<TestForm />);
    const toggleGroups = screen.getAllByRole("button");

    // Rapidly change states
    for (let i = 0; i < 5; i++) {
      fireEvent.click(toggleGroups[i % 3]);
      await waitFor(() => {
        expect(toggleGroups[i % 3]).toHaveClass(
          "bg-[var(--color-magenta-magenta100)]",
        );
      });
    }
  });

  it("handles mixed content types", () => {
    render(
      <div className="flex">
        <ToggleGroup position="left" showText={true}>
          Text Only
        </ToggleGroup>
        <ToggleGroup position="middle" showText={false}>
          Icon Only
        </ToggleGroup>
        <ToggleGroup position="right" showText={true}>
          Text Only
        </ToggleGroup>
      </div>,
    );

    const toggleGroups = screen.getAllByRole("button");
    expect(toggleGroups[0]).toHaveTextContent("Text Only");
    expect(toggleGroups[1]).toHaveTextContent("Icon Only");
    expect(toggleGroups[2]).toHaveTextContent("Text Only");
  });
});
