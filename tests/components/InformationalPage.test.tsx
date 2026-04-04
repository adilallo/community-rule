import { describe, it, expect } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import InformationalPage from "../../app/create/informational/page";

describe("InformationalPage", () => {
  it("renders without crashing", () => {
    render(<InformationalPage />);
    expect(
      screen.getByRole("heading", {
        name: "How CommunityRule helps groups like yours",
      }),
    ).toBeInTheDocument();
  });

  it("renders lockup description", () => {
    render(<InformationalPage />);
    expect(
      screen.getByText(
        /This flow will give you recommendations to improve your community/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders first numbered list item title", () => {
    render(<InformationalPage />);
    expect(
      screen.getByText("Tell us about your organization"),
    ).toBeInTheDocument();
  });
});
