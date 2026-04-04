import { describe, it, expect } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import CompletedPage from "../../app/create/completed/page";

describe("CompletedPage", () => {
  it("renders without crashing", () => {
    render(<CompletedPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders HeaderLockup with expected title", () => {
    render(<CompletedPage />);
    expect(
      screen.getByRole("heading", {
        name: "Mutual Aid Mondays",
      }),
    ).toBeInTheDocument();
  });

  it("renders HeaderLockup with expected description", () => {
    render(<CompletedPage />);
    expect(
      screen.getByText(
        /Mutual Aid Monday is a grassroots community in Denver, founded in November 2020 by Kelsang Virya, dedicated to supporting neighbors experiencing homelessness./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders Community Rule document with section labels", () => {
    render(<CompletedPage />);
    expect(screen.getByText("Values")).toBeInTheDocument();
    expect(screen.getByText("Communication")).toBeInTheDocument();
    expect(screen.getByText("Membership")).toBeInTheDocument();
    expect(screen.getByText("Decision-making")).toBeInTheDocument();
    expect(screen.getByText("Conflict management")).toBeInTheDocument();
  });

  it("renders document entry titles", () => {
    render(<CompletedPage />);
    expect(screen.getByText("Solidarity Forever")).toBeInTheDocument();
    expect(screen.getByText("Shared Leadership")).toBeInTheDocument();
    expect(screen.getByText("Organizing Offline")).toBeInTheDocument();
    expect(screen.getByText("Circular Food Systems")).toBeInTheDocument();
  });

  it("renders toast alert when page loads", () => {
    render(<CompletedPage />);
    expect(
      screen.getByText(
        "This is what folks see when you share your CommunityRule",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your group can use this document as an operating manual.",
      ),
    ).toBeInTheDocument();
  });

  it("renders toast with role status", () => {
    render(<CompletedPage />);
    const statusRegions = screen.getAllByRole("status");
    expect(statusRegions.length).toBeGreaterThanOrEqual(1);
    expect(
      statusRegions.some((el) =>
        el.textContent?.includes("This is what folks see when you share"),
      ),
    ).toBe(true);
  });
});
