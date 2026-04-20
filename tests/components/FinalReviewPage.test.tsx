import { useLayoutEffect } from "react";
import { describe, it, expect } from "vitest";
import {
  renderWithProviders as render,
  screen,
  waitFor,
} from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import { FinalReviewScreen } from "../../app/(app)/create/screens/review/FinalReviewScreen";
import { useCreateFlow } from "../../app/(app)/create/context/CreateFlowContext";

const FALLBACK_CARD_TITLE = "Your community";
const FALLBACK_CARD_DESCRIPTION_SNIPPET =
  "Add a short description of your community";

function FinalReviewWithFlowState({
  title,
  summary,
}: {
  title: string;
  summary?: string;
}) {
  const { replaceState } = useCreateFlow();
  useLayoutEffect(() => {
    replaceState({ title, ...(summary !== undefined ? { summary } : {}) });
  }, [replaceState, title, summary]);
  return <FinalReviewScreen />;
}

describe("FinalReviewScreen", () => {
  it("renders without crashing", () => {
    render(<FinalReviewScreen />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders lockup title", () => {
    render(<FinalReviewScreen />);
    expect(
      screen.getByRole("heading", {
        name: "Review your CommunityRule",
      }),
    ).toBeInTheDocument();
  });

  it("renders lockup description", () => {
    render(<FinalReviewScreen />);
    expect(
      screen.getByText(
        /Here's what other people will see. Make sure everything looks good before you finalize everything. Once the rule is finalized, you must use one of your decision-making mechanisms to edit it again./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders RuleCard with fallback title when context has no name", () => {
    render(<FinalReviewScreen />);
    expect(screen.getByText(FALLBACK_CARD_TITLE)).toBeInTheDocument();
  });

  it("renders RuleCard with fallback description when context has no summary", () => {
    render(<FinalReviewScreen />);
    expect(
      screen.getByText(new RegExp(FALLBACK_CARD_DESCRIPTION_SNIPPET, "i")),
    ).toBeInTheDocument();
  });

  it("renders RuleCard title from create flow state", async () => {
    render(
      <FinalReviewWithFlowState title="Oak Park Commons" summary="Local mutual aid." />,
    );
    await waitFor(() => {
      expect(screen.getByText("Oak Park Commons")).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Local mutual aid\./i),
    ).toBeInTheDocument();
  });

  it("renders RuleCard as a button (card is interactive)", () => {
    render(<FinalReviewScreen />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(
      buttons.some((el) => el.textContent?.includes(FALLBACK_CARD_TITLE)),
    ).toBe(true);
  });

  it("renders expanded RuleCard with category labels", () => {
    render(<FinalReviewScreen />);
    expect(screen.getByText("Values")).toBeInTheDocument();
    expect(screen.getByText("Communication")).toBeInTheDocument();
    expect(screen.getByText("Membership")).toBeInTheDocument();
    expect(screen.getByText("Decision-making")).toBeInTheDocument();
    expect(screen.getByText("Conflict management")).toBeInTheDocument();
  });

  it("renders category chips", () => {
    render(<FinalReviewScreen />);
    expect(screen.getByText("Consciousness")).toBeInTheDocument();
    expect(screen.getByText("Signal")).toBeInTheDocument();
    expect(screen.getByText("Open Admission")).toBeInTheDocument();
  });
});

/**
 * Seeds a Customize-from-template style state (method ids + core-value
 * snapshot) and asserts the final-review RuleCard renders the resolved
 * labels — the fix for "preselected chips don't register on final review".
 */
function FinalReviewWithCustomizeSelections() {
  const { replaceState } = useCreateFlow();
  useLayoutEffect(() => {
    replaceState({
      title: "Oak Park Commons",
      selectedCoreValueIds: ["1"],
      coreValuesChipsSnapshot: [
        { id: "1", label: "Accessibility", state: "selected" },
        { id: "2", label: "Accountability", state: "unselected" },
      ],
      selectedCommunicationMethodIds: ["signal"],
      selectedMembershipMethodIds: ["open-access"],
      selectedDecisionApproachIds: ["lazy-consensus"],
      selectedConflictManagementIds: ["peer-mediation"],
    });
  }, [replaceState]);
  return <FinalReviewScreen />;
}

describe("FinalReviewScreen — prefilled selections", () => {
  it("renders chips resolved from selection ids, not demo fallbacks", async () => {
    render(<FinalReviewWithCustomizeSelections />);
    await waitFor(() => {
      expect(screen.getByText("Accessibility")).toBeInTheDocument();
    });
    expect(screen.getByText("Signal")).toBeInTheDocument();
    expect(screen.getByText("Open Access")).toBeInTheDocument();
    expect(screen.getByText("Lazy Consensus")).toBeInTheDocument();
    expect(screen.getByText("Peer Mediation")).toBeInTheDocument();

    // Demo chips from `finalReview.json` must not leak through once the
    // user has real selections: "Open Admission" is shipped as fallback,
    // while the customize flow resolves to "Open Access".
    expect(screen.queryByText("Open Admission")).not.toBeInTheDocument();
    expect(screen.queryByText("Consciousness")).not.toBeInTheDocument();
  });
});
