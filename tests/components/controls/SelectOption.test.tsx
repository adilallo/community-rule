import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import SelectOption from "../../../app/components/controls/SelectOption";
import { renderWithProviders, screen } from "../../utils/test-utils";

describe("SelectOption", () => {
  it("renders option label", () => {
    renderWithProviders(
      <SelectOption selected={false}>Option one</SelectOption>,
    );

    expect(screen.getByRole("option", { name: "Option one" })).toBeInTheDocument();
  });
});
