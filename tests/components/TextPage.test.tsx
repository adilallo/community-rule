import { describe, it, expect } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import TextPage from "../../app/create/text/page";

describe("TextPage", () => {
  it("renders main heading", () => {
    render(<TextPage />);
    expect(
      screen.getByRole("heading", {
        name: "What is your community called?",
      }),
    ).toBeInTheDocument();
  });

  it("renders description and text field", () => {
    render(<TextPage />);
    expect(
      screen.getByText("This will be the name of your community"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your community name"),
    ).toBeInTheDocument();
  });
});
