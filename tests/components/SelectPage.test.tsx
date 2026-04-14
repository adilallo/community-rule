import { describe, it, expect } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import { CommunitySizeSelectScreen } from "../../app/create/screens/select/CommunitySizeSelectScreen";

describe("CommunitySizeSelectScreen", () => {
  it("renders HeaderLockup title", () => {
    render(<CommunitySizeSelectScreen />);
    expect(
      screen.getByRole("heading", {
        name: "How large is your community?",
      }),
    ).toBeInTheDocument();
  });

  it("renders MultiSelect add control", () => {
    render(<CommunitySizeSelectScreen />);
    const addButtons = screen.getAllByRole("button", {
      name: "Add organization type",
    });
    expect(addButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders preset chip labels", () => {
    render(<CommunitySizeSelectScreen />);
    expect(screen.getByText("1 member")).toBeInTheDocument();
    expect(screen.getByText("2-10 members")).toBeInTheDocument();
  });
});
