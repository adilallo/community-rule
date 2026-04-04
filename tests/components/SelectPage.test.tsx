import { describe, it, expect } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import SelectPage from "../../app/create/select/page";

describe("SelectPage", () => {
  it("renders HeaderLockup title", () => {
    render(<SelectPage />);
    expect(
      screen.getByRole("heading", {
        name: "What is your community called?",
      }),
    ).toBeInTheDocument();
  });

  it("renders MultiSelect add control", () => {
    render(<SelectPage />);
    const addButtons = screen.getAllByRole("button", {
      name: "Add organization type",
    });
    expect(addButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders preset chip labels", () => {
    render(<SelectPage />);
    expect(screen.getByText("1 member")).toBeInTheDocument();
    expect(screen.getByText("Non-profit")).toBeInTheDocument();
  });
});
