import { describe, test, expect } from "vitest";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { renderWithProviders } from "../utils/test-utils";
import Scrollbar from "../../app/components/utility/Scrollbar";

describe("Scrollbar", () => {
  test("renders children", () => {
    renderWithProviders(
      <Scrollbar>
        <span>Scrollable content</span>
      </Scrollbar>,
    );
    expect(screen.getByText("Scrollable content")).toBeInTheDocument();
  });

  test("wrapper has scrollbar-design class and overflow-y-auto for default orientation", () => {
    const { container } = renderWithProviders(
      <Scrollbar>
        <div>Content</div>
      </Scrollbar>,
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("scrollbar-design");
    expect(wrapper).toHaveClass("overflow-y-auto");
  });

  test("applies horizontal overflow when orientation is horizontal", () => {
    const { container } = renderWithProviders(
      <Scrollbar orientation="horizontal">
        <div>Content</div>
      </Scrollbar>,
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("scrollbar-design");
    expect(wrapper).toHaveClass("overflow-x-auto");
  });

  test("applies overflow-auto when orientation is both", () => {
    const { container } = renderWithProviders(
      <Scrollbar orientation="both">
        <div>Content</div>
      </Scrollbar>,
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("scrollbar-design");
    expect(wrapper).toHaveClass("overflow-auto");
  });
});
