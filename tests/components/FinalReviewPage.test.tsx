import React from "react";
import { describe, it, expect } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import FinalReviewPage from "../../app/create/final-review/page";

describe("FinalReviewPage", () => {
  it("renders without crashing", () => {
    render(<FinalReviewPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders HeaderLockup with expected title", () => {
    render(<FinalReviewPage />);
    expect(
      screen.getByRole("heading", {
        name: "Review your CommunityRule",
      }),
    ).toBeInTheDocument();
  });

  it("renders HeaderLockup with expected description", () => {
    render(<FinalReviewPage />);
    expect(
      screen.getByText(
        /Here's what other people will see. Make sure everything looks good before you finalize everything. Once the rule is finalized, you must use one of your decision-making mechanisms to edit it again./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders RuleCard with title", () => {
    render(<FinalReviewPage />);
    expect(screen.getByText("Mutual Aid Mondays")).toBeInTheDocument();
  });

  it("renders RuleCard with description", () => {
    render(<FinalReviewPage />);
    expect(
      screen.getByText(
        /Mutual Aid Monday is a grassroots community in Denver, founded in November 2020 by Kelsang Virya, dedicated to supporting neighbors experiencing homelessness./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders RuleCard as a button (card is interactive)", () => {
    render(<FinalReviewPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(
      buttons.some((el) => el.textContent?.includes("Mutual Aid Mondays")),
    ).toBe(true);
  });

  it("renders expanded RuleCard with category labels", () => {
    render(<FinalReviewPage />);
    expect(screen.getByText("Values")).toBeInTheDocument();
    expect(screen.getByText("Communication")).toBeInTheDocument();
    expect(screen.getByText("Membership")).toBeInTheDocument();
    expect(screen.getByText("Decision-making")).toBeInTheDocument();
    expect(screen.getByText("Conflict management")).toBeInTheDocument();
  });

  it("renders category chips", () => {
    render(<FinalReviewPage />);
    expect(screen.getByText("Consciousness")).toBeInTheDocument();
    expect(screen.getByText("Signal")).toBeInTheDocument();
    expect(screen.getByText("Open Admission")).toBeInTheDocument();
  });
});
