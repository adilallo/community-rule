import { beforeEach, describe, it, expect } from "vitest";
import React, { useEffect } from "react";
import {
  renderWithProviders as render,
  screen,
  waitFor,
} from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import { CommunityReviewScreen } from "../../app/(app)/create/screens/review/CommunityReviewScreen";
import { useCreateFlow } from "../../app/(app)/create/context/CreateFlowContext";
import { testRouter } from "../mocks/navigation";

describe("CommunityReviewScreen", () => {
  beforeEach(() => {
    testRouter.replace.mockReset();
    testRouter.push.mockReset();
  });

  it("renders without crashing", () => {
    render(<CommunityReviewScreen />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders HeaderLockup with expected title", () => {
    render(<CommunityReviewScreen />);
    expect(
      screen.getByRole("heading", {
        name: "Your community is added - congrats!",
      }),
    ).toBeInTheDocument();
  });

  it("renders HeaderLockup with expected description", () => {
    render(<CommunityReviewScreen />);
    expect(
      screen.getByText(
        /In the next section, we'll go through membership, decision-making, conflict resolution, and community values and create a custom operating manual for your organization based on the specifics you just shared./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders RuleCard with title fallback when no community name is set", () => {
    render(<CommunityReviewScreen />);
    expect(screen.getByText("Mutual Aid Mondays")).toBeInTheDocument();
  });

  it("omits the RuleCard description when the user has not entered community context", () => {
    render(<CommunityReviewScreen />);
    expect(
      screen.queryByText(
        /Mutual Aid Monday is a grassroots community in Denver/i,
      ),
    ).not.toBeInTheDocument();
  });

  it("renders RuleCard as a button (card is interactive)", () => {
    render(<CommunityReviewScreen />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(
      buttons.some((el) => el.textContent?.includes("Mutual Aid Mondays")),
    ).toBe(true);
  });
});

/**
 * Seeds `pendingTemplateAction` into CreateFlowContext before the screen
 * under test mounts, so we can assert its mount-time redirect behavior.
 * Mirrors the flow `handleCustomizeTemplate` / `handleUseTemplateWithoutChanges`
 * create when the user picks a template before completing community stage.
 */
function ReviewWithPendingAction({
  mode,
}: {
  mode: "customize" | "useWithoutChanges";
}) {
  const { state, updateState } = useCreateFlow();
  const seededRef = React.useRef(false);
  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    updateState({
      title: "Neighborhood",
      pendingTemplateAction: { slug: "mutual-aid-mondays", mode },
    });
  }, [mode, updateState]);
  // Block the real screen from mounting until the seed landed — otherwise
  // its own `useEffect` reads an empty state on the first pass and bails.
  if (!state.pendingTemplateAction) return null;
  return <CommunityReviewScreen />;
}

describe("CommunityReviewScreen — pendingTemplateAction redirect", () => {
  beforeEach(() => {
    testRouter.replace.mockReset();
    testRouter.push.mockReset();
  });

  it("redirects to /create/core-values when mode === 'customize'", async () => {
    render(<ReviewWithPendingAction mode="customize" />);
    await waitFor(() => {
      expect(testRouter.replace).toHaveBeenCalledWith("/create/core-values");
    });
    expect(testRouter.push).not.toHaveBeenCalled();
  });

  it("redirects to /create/confirm-stakeholders when mode === 'useWithoutChanges'", async () => {
    render(<ReviewWithPendingAction mode="useWithoutChanges" />);
    await waitFor(() => {
      expect(testRouter.replace).toHaveBeenCalledWith(
        "/create/confirm-stakeholders",
      );
    });
    expect(testRouter.push).not.toHaveBeenCalled();
  });

  it("does not redirect when no pendingTemplateAction is set", () => {
    render(<CommunityReviewScreen />);
    expect(testRouter.replace).not.toHaveBeenCalled();
  });
});
