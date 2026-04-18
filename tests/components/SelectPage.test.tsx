import { describe, it, expect } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import { CommunitySizeSelectScreen } from "../../app/(app)/create/screens/select/CommunitySizeSelectScreen";

describe("CommunitySizeSelectScreen", () => {
  it("renders HeaderLockup title", () => {
    render(<CommunitySizeSelectScreen />);
    expect(
      screen.getByRole("heading", {
        name: "How many people will be in your community in the near term?",
      }),
    ).toBeInTheDocument();
  });

  it("renders preset size chips", () => {
    render(<CommunitySizeSelectScreen />);
    expect(screen.getByText("1 member")).toBeInTheDocument();
    expect(screen.getByText("2-5 members")).toBeInTheDocument();
  });
});
