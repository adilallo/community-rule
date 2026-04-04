import { describe, test, expect } from "vitest";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { renderWithProviders } from "../utils/test-utils";
import Tag from "../../app/components/utility/Tag";

describe("Tag", () => {
  test("renders with variant recommended and shows default label RECOMMENDED", () => {
    renderWithProviders(<Tag variant="recommended" />);
    expect(screen.getByText("RECOMMENDED")).toBeInTheDocument();
  });

  test("renders with variant selected and shows default label SELECTED", () => {
    renderWithProviders(<Tag variant="selected" />);
    expect(screen.getByText("SELECTED")).toBeInTheDocument();
  });

  test("renders custom children when provided", () => {
    renderWithProviders(<Tag variant="recommended">Custom label</Tag>);
    expect(screen.getByText("Custom label")).toBeInTheDocument();
    expect(screen.queryByText("RECOMMENDED")).not.toBeInTheDocument();
  });
});
