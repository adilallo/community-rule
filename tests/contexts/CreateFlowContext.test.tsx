import { describe, it, expect } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {
  CreateFlowProvider,
  useCreateFlow,
} from "../../app/(app)/create/context/CreateFlowContext";

/**
 * Harness: mounts a consumer that renders the state we want to assert on and
 * exposes imperative handles (updateState, resetCustomRuleSelections) via
 * window globals. Keeps the test readable vs. threading refs everywhere.
 */
function Harness() {
  const { state, updateState, resetCustomRuleSelections } = useCreateFlow();
  (window as unknown as { __updateState: typeof updateState }).__updateState =
    updateState;
  (
    window as unknown as { __resetCustomRule: typeof resetCustomRuleSelections }
  ).__resetCustomRule = resetCustomRuleSelections;
  return (
    <>
      <div data-testid="title">{state.title ?? ""}</div>
      <div data-testid="core">
        {(state.selectedCoreValueIds ?? []).join(",")}
      </div>
      <div data-testid="comm">
        {(state.selectedCommunicationMethodIds ?? []).join(",")}
      </div>
      <div data-testid="details">
        {Object.keys(state.coreValueDetailsByChipId ?? {}).join(",")}
      </div>
      <div data-testid="snapshot">
        {(state.coreValuesChipsSnapshot ?? []).map((r) => r.id).join(",")}
      </div>
    </>
  );
}

function getUpdateState() {
  return (window as unknown as { __updateState: (u: unknown) => void })
    .__updateState;
}

function getResetCustomRule() {
  return (window as unknown as { __resetCustomRule: () => void })
    .__resetCustomRule;
}

describe("CreateFlowContext — resetCustomRuleSelections", () => {
  it("clears all custom-rule stage selections while keeping community stage", () => {
    render(
      <CreateFlowProvider>
        <Harness />
      </CreateFlowProvider>,
    );

    act(() => {
      getUpdateState()({
        title: "Mutual Aid Mondays",
        communityContext: "Neighborhood",
        selectedCoreValueIds: ["1", "3"],
        coreValuesChipsSnapshot: [
          { id: "1", label: "Trust", state: "selected" },
        ],
        coreValueDetailsByChipId: {
          "1": { meaning: "m", signals: "s" },
        },
        selectedCommunicationMethodIds: ["consensus-decision-making"],
        selectedMembershipMethodIds: ["open"],
        selectedDecisionApproachIds: ["consensus-decision-making"],
        selectedConflictManagementIds: ["mediation"],
      });
    });

    expect(screen.getByTestId("title").textContent).toBe("Mutual Aid Mondays");
    expect(screen.getByTestId("core").textContent).toBe("1,3");
    expect(screen.getByTestId("comm").textContent).toBe(
      "consensus-decision-making",
    );

    act(() => {
      getResetCustomRule()();
    });

    expect(screen.getByTestId("title").textContent).toBe("Mutual Aid Mondays");
    expect(screen.getByTestId("core").textContent).toBe("");
    expect(screen.getByTestId("comm").textContent).toBe("");
    expect(screen.getByTestId("details").textContent).toBe("");
    expect(screen.getByTestId("snapshot").textContent).toBe("");
  });

  it("is a no-op when no custom-rule selections were set", () => {
    render(
      <CreateFlowProvider>
        <Harness />
      </CreateFlowProvider>,
    );

    act(() => {
      getUpdateState()({ title: "Just a Community" });
    });

    act(() => {
      getResetCustomRule()();
    });

    expect(screen.getByTestId("title").textContent).toBe("Just a Community");
    expect(screen.getByTestId("core").textContent).toBe("");
  });
});
