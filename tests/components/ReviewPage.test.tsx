import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import ReviewPage from "../../app/create/review/page";

describe("ReviewPage", () => {
  it("renders without crashing", () => {
    render(<ReviewPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders HeaderLockup with expected title", () => {
    render(<ReviewPage />);
    expect(
      screen.getByRole("heading", {
        name: "Your community is added - congrats!",
      }),
    ).toBeInTheDocument();
  });

  it("renders HeaderLockup with expected description", () => {
    render(<ReviewPage />);
    expect(
      screen.getByText(
        /In the next section, we'll go through membership, decision-making, conflict resolution, and community values and create a custom operating manual for your organization based on the specifics you just shared./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders RuleCard with title", () => {
    render(<ReviewPage />);
    expect(screen.getByText("Mutual Aid Mondays")).toBeInTheDocument();
  });

  it("renders RuleCard with description", () => {
    render(<ReviewPage />);
    expect(
      screen.getByText(
        /Mutual Aid Monday is a grassroots community in Denver, founded in November 2020 by Kelsang Virya, dedicated to supporting neighbors experiencing homelessness./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders RuleCard as a button (card is interactive)", () => {
    render(<ReviewPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(
      buttons.some((el) => el.textContent?.includes("Mutual Aid Mondays")),
    ).toBe(true);
  });
});
