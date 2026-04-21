import { useEffect, useLayoutEffect } from "react";
import { describe, it, expect, afterEach } from "vitest";
import {
  renderWithProviders as render,
  screen,
  cleanup,
  within,
  waitFor,
} from "../utils/test-utils";
import { fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CommunicationMethodsScreen } from "../../app/(app)/create/screens/card/CommunicationMethodsScreen";
import { useCreateFlow } from "../../app/(app)/create/context/CreateFlowContext";
import type { CreateFlowState } from "../../app/(app)/create/types";

afterEach(() => {
  cleanup();
});

/**
 * Mounts the screen with optional starting state and exposes the latest
 * `state` to the test harness so we can assert the persistence side of
 * the Add Platform flow without driving the wizard's Next chain.
 */
const EMPTY_STATE: CreateFlowState = {};

function ScreenWithStateProbe({
  onState,
  initial = EMPTY_STATE,
}: {
  onState: (_state: CreateFlowState) => void;
  initial?: CreateFlowState;
}) {
  const { state, replaceState } = useCreateFlow();
  useLayoutEffect(() => {
    replaceState(initial);
  }, [replaceState, initial]);
  useEffect(() => {
    onState(state);
  }, [state, onState]);
  return <CommunicationMethodsScreen />;
}

/**
 * Confirms the persistence half of the Add-Platform flow that lets the
 * final-review chip edit modal start from a known seed instead of always
 * snapping back to preset copy. See {@link CommunicationMethodEditFields}
 * and `buildPublishPayload` for the read side.
 */
describe("CommunicationMethodsScreen — Add Platform persistence", () => {
  it("seeds the modal from preset and persists edits + selection on Confirm", async () => {
    let latest: CreateFlowState = {};
    render(
      <ScreenWithStateProbe
        onState={(s) => {
          latest = s;
        }}
      />,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: /Signal: Encrypted messaging/ })[0],
    );

    const dialog = await screen.findByRole("dialog");
    const textareas = within(dialog).getAllByRole("textbox");
    expect(textareas.length).toBe(3);
    // Preset corePrinciple must seed into the first textarea so the user
    // edits a real starting point rather than an empty field.
    expect((textareas[0] as HTMLTextAreaElement).value.length).toBeGreaterThan(
      0,
    );

    fireEvent.change(textareas[0], { target: { value: "Custom principle" } });
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Add Platform" }),
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(latest.selectedCommunicationMethodIds).toContain("signal");
    });
    expect(
      latest.communicationMethodDetailsById?.signal?.corePrinciple,
    ).toBe("Custom principle");
  });

  it("does not persist edits when the modal closes without Confirm", async () => {
    let latest: CreateFlowState = {};
    render(
      <ScreenWithStateProbe
        onState={(s) => {
          latest = s;
        }}
      />,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: /Signal: Encrypted messaging/ })[0],
    );
    const dialog = await screen.findByRole("dialog");
    const [firstTextarea] = within(dialog).getAllByRole("textbox");
    fireEvent.change(firstTextarea, {
      target: { value: "Should NOT persist" },
    });

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(latest.selectedCommunicationMethodIds ?? []).not.toContain("signal");
    expect(latest.communicationMethodDetailsById).toBeUndefined();
  });

  it("re-seeds the modal from a saved override when reopening the same chip", async () => {
    let latest: CreateFlowState = {};
    render(
      <ScreenWithStateProbe
        onState={(s) => {
          latest = s;
        }}
        initial={{
          selectedCommunicationMethodIds: ["signal"],
          communicationMethodDetailsById: {
            signal: {
              corePrinciple: "Saved principle",
              logisticsAdmin: "Saved logistics",
              codeOfConduct: "Saved coc",
            },
          },
        }}
      />,
    );
    void latest;

    fireEvent.click(
      screen.getAllByRole("button", { name: /Signal: Encrypted messaging/ })[0],
    );
    const dialog = await screen.findByRole("dialog");
    const textareas = within(dialog).getAllByRole(
      "textbox",
    ) as HTMLTextAreaElement[];
    expect(textareas[0].value).toBe("Saved principle");
    expect(textareas[1].value).toBe("Saved logistics");
    expect(textareas[2].value).toBe("Saved coc");
  });
});
