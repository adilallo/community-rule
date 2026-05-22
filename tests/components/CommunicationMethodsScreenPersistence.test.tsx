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

async function confirmDiscardCustomizeEdits() {
  fireEvent.click(
    await screen.findByRole("button", { name: "Discard" }),
  );
}

async function declineDiscardCustomizeEdits() {
  fireEvent.click(
    await screen.findByRole("button", { name: "Keep editing" }),
  );
}

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
    fireEvent.click(within(dialog).getByRole("button", { name: "More options" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Customize" }));

    const textboxes = within(screen.getByRole("dialog")).getAllByRole("textbox");
    expect(textboxes.length).toBe(5);
    const corePrincipleField = textboxes[2] as HTMLTextAreaElement;
    // Preset corePrinciple must seed into the first body textarea so the user
    // edits a real starting point rather than an empty field.
    expect(corePrincipleField.value.length).toBeGreaterThan(0);

    fireEvent.change(corePrincipleField, { target: { value: "Custom principle" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Add Platform",
      }),
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
    void dialog;
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
    expect(textareas.length).toBe(3);
    expect(textareas[0].value).toBe("Saved principle");
    expect(textareas[1].value).toBe("Saved logistics");
    expect(textareas[2].value).toBe("Saved coc");
  });

  it("Cancel customize reverts edited preset without persisting (no confirm when unchanged)", async () => {
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
    fireEvent.click(within(dialog).getByRole("button", { name: "More options" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Customize" }));

    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        (within(screen.getByRole("dialog")).getAllByRole(
          "textbox",
        )[0] as HTMLTextAreaElement).disabled,
      ).toBe(true);
    });
    expect(latest.communicationMethodDetailsById).toBeUndefined();
    expect(screen.queryByRole("button", { name: "Discard" })).not.toBeInTheDocument();
  });

  it("Cancel customize with edits restores snapshot after confirm", async () => {
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

    fireEvent.click(
      screen.getAllByRole("button", { name: /Signal: Encrypted messaging/ })[0],
    );
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "More options" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Customize" }));

    const textboxes = within(dialog).getAllByRole(
      "textbox",
    ) as HTMLTextAreaElement[];
    fireEvent.change(textboxes[2], { target: { value: "Edited principle" } });

    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await confirmDiscardCustomizeEdits();

    await waitFor(() => {
      expect(
        (
          within(screen.getByRole("dialog")).getAllByRole(
            "textbox",
          )[0] as HTMLTextAreaElement
        ).value,
      ).toBe("Saved principle");
    });
    expect(
      latest.communicationMethodDetailsById?.signal?.corePrinciple,
    ).toBe("Saved principle");
  });

  it("dirty Escape close stays open when user declines discard confirm", async () => {
    render(
      <ScreenWithStateProbe
        onState={() => {
          /* noop */
        }}
      />,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: /Signal: Encrypted messaging/ })[0],
    );
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "More options" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Customize" }));

    const textboxes = within(dialog).getAllByRole(
      "textbox",
    ) as HTMLTextAreaElement[];
    fireEvent.change(textboxes[2], { target: { value: "Edited principle" } });

    fireEvent.keyDown(document, { key: "Escape" });
    await screen.findByRole("button", { name: "Keep editing" });
    await declineDiscardCustomizeEdits();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("persists customized policy title for a custom UUID card on Save", async () => {
    const customId = "00000000-0000-4000-8000-0000000000aa";
    let latest: CreateFlowState = {};
    render(
      <ScreenWithStateProbe
        onState={(s) => {
          latest = s;
        }}
        initial={{
          selectedCommunicationMethodIds: [customId],
          customMethodCardMetaById: {
            [customId]: { label: "Original title", supportText: "Sub" },
          },
          communicationMethodDetailsById: {
            [customId]: {
              corePrinciple: "p",
              logisticsAdmin: "l",
              codeOfConduct: "c",
            },
          },
        }}
      />,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: /Original title/ })[0],
    );
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "More options" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Customize" }));

    const titleInput = within(screen.getByRole("dialog")).getAllByRole(
      "textbox",
    )[0] as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: "Renamed policy" } });
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Save" }),
    );

    await waitFor(() => {
      expect(latest.customMethodCardMetaById?.[customId]?.label).toBe(
        "Renamed policy",
      );
    });
  });

  it("stores preset id title override in customMethodCardMetaById on Save", async () => {
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
    fireEvent.click(within(dialog).getByRole("button", { name: "More options" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Customize" }));

    const titleInput = within(screen.getByRole("dialog")).getAllByRole(
      "textbox",
    )[0] as HTMLInputElement;
    fireEvent.change(titleInput, {
      target: { value: "Custom Signal header" },
    });
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Save" }),
    );

    await waitFor(() => {
      expect(latest.customMethodCardMetaById?.signal?.label).toBe(
        "Custom Signal header",
      );
    });
  });
});
