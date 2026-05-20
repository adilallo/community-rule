import { useEffect, useLayoutEffect } from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, within } from "@testing-library/react";
import {
  renderWithProviders as render,
  screen,
  waitFor,
} from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import { FinalReviewScreen } from "../../app/(app)/create/screens/review/FinalReviewScreen";
import { useCreateFlow } from "../../app/(app)/create/context/CreateFlowContext";
import type { CreateFlowState } from "../../app/(app)/create/types";

/**
 * Mounts the screen with a Customize-style preset selection and exposes the
 * latest `state` to the test via `onState`. Used by the edit-modal save
 * semantics suite below to assert what the user's edits actually persist
 * (or don't, on close).
 */
function FinalReviewWithStateProbe({
  onState,
  initial,
}: {
  onState: (_state: CreateFlowState) => void;
  initial: CreateFlowState;
}) {
  const { state, replaceState } = useCreateFlow();
  useLayoutEffect(() => {
    replaceState(initial);
  }, [replaceState, initial]);
  useEffect(() => {
    onState(state);
  }, [state, onState]);
  return <FinalReviewScreen />;
}

const FALLBACK_CARD_TITLE = "Your community";

function FinalReviewWithFlowState({
  title,
  communityContext,
}: {
  title: string;
  communityContext?: string;
}) {
  const { replaceState } = useCreateFlow();
  useLayoutEffect(() => {
    replaceState({
      title,
      ...(communityContext !== undefined ? { communityContext } : {}),
    });
  }, [replaceState, title, communityContext]);
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

  it("renders Rule with fallback title when context has no name", () => {
    render(<FinalReviewScreen />);
    expect(screen.getByText(FALLBACK_CARD_TITLE)).toBeInTheDocument();
  });

  it("does not use summary as the card body when community context is empty", () => {
    function TitleAndSummaryHarness() {
      const { replaceState } = useCreateFlow();
      useLayoutEffect(() => {
        replaceState({
          title: "Oak Park Commons",
          summary:
            "Leftover template or one-line summary — must not appear as the Rule description.",
        });
      }, [replaceState]);
      return <FinalReviewScreen />;
    }
    render(<TitleAndSummaryHarness />);
    expect(
      screen.queryByText(/Leftover template or one-line summary/i),
    ).not.toBeInTheDocument();
  });

  it("renders Rule title from create flow state", async () => {
    render(
      <FinalReviewWithFlowState
        title="Oak Park Commons"
        communityContext="Local mutual aid."
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Oak Park Commons")).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Local mutual aid\./i),
    ).toBeInTheDocument();
  });

  it("renders Rule as a button (card is interactive)", () => {
    render(<FinalReviewScreen />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(
      buttons.some((el) => el.textContent?.includes(FALLBACK_CARD_TITLE)),
    ).toBe(true);
  });

  it("renders expanded Rule with category labels", () => {
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
 * snapshot) and asserts the final-review Rule renders the resolved
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

describe("FinalReviewScreen — chip detail modal", () => {
  async function enterMethodCustomizeFromDialog(dialog: HTMLElement) {
    fireEvent.click(
      within(dialog).getByRole("button", { name: /more options/i }),
    );
    const customize = await screen.findByRole("menuitem", {
      name: /^customize$/i,
    });
    fireEvent.click(customize);
  }

  async function enterCoreValueCustomizeFromDialog(dialog: HTMLElement) {
    fireEvent.click(
      within(dialog).getByRole("button", { name: /more options/i }),
    );
    const customize = await screen.findByRole("menuitem", {
      name: /^customize$/i,
    });
    fireEvent.click(customize);
  }

  it("opens the read-only detail modal when a chip is clicked, matching the preset copy", async () => {
    render(<FinalReviewWithCustomizeSelections />);

    const signalChip = await screen.findByRole("button", { name: "Signal" });
    fireEvent.click(signalChip);

    // Modal subtitle is the `supportText` from communication.json for the
    // "signal" method — proves the chip click resolved the correct preset
    // and reused the TemplateChipDetailModal's by-label lookup.
    await waitFor(() => {
      expect(
        screen.getByText(
          /Encrypted messaging for high-security, private coordination\./i,
        ),
      ).toBeInTheDocument();
    });
    // Core-principle section heading is shared copy from the same messages
    // file; assert it renders to confirm the modal body hydrated.
    expect(
      screen.getAllByText(/core principle/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("method chip modal kebab offers Customize but not Duplicate", async () => {
    render(<FinalReviewWithCustomizeSelections />);
    fireEvent.click(await screen.findByRole("button", { name: "Signal" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(
      within(dialog).getByRole("button", { name: /more options/i }),
    );
    await waitFor(() => {
      expect(
        screen.getByRole("menuitem", { name: /^customize$/i }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("menuitem", { name: /^duplicate$/i }),
    ).not.toBeInTheDocument();
  });

  it("values chip modal kebab offers Customize and Duplicate under the cap", async () => {
    function CoreValuesHarness() {
      const { replaceState } = useCreateFlow();
      useLayoutEffect(() => {
        replaceState({
          selectedCoreValueIds: ["1"],
          coreValuesChipsSnapshot: [
            { id: "1", label: "Accessibility", state: "selected" },
          ],
        });
      }, [replaceState]);
      return <FinalReviewScreen />;
    }
    render(<CoreValuesHarness />);
    fireEvent.click(
      await screen.findByRole("button", { name: "Accessibility" }),
    );
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(
      within(dialog).getByRole("button", { name: /more options/i }),
    );
    await waitFor(() => {
      expect(
        screen.getByRole("menuitem", { name: /^customize$/i }),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole("menuitem", { name: /^duplicate$/i }),
    ).toBeInTheDocument();
  });

  it("opens method chip modal read-only until Customize, then enables Save after an edit", async () => {
    render(<FinalReviewWithCustomizeSelections />);

    fireEvent.click(await screen.findByRole("button", { name: "Signal" }));
    const dialog = await screen.findByRole("dialog");

    expect(
      within(dialog).queryByRole("button", { name: "Save" }),
    ).not.toBeInTheDocument();

    const principleField = within(dialog).getByRole("textbox", {
      name: /core principle/i,
    });
    expect(principleField).toBeDisabled();

    await enterMethodCustomizeFromDialog(dialog);

    expect(
      within(dialog).getByRole("button", { name: "Save" }),
    ).toBeDisabled();

    fireEvent.change(principleField, { target: { value: "Edited principle" } });
    await waitFor(() => {
      expect(
        within(dialog).getByRole("button", { name: "Save" }),
      ).not.toBeDisabled();
    });
  });

  it("opens a core-values chip with the matching preset meaning/signals", async () => {
    function CoreValuesHarness() {
      const { replaceState } = useCreateFlow();
      useLayoutEffect(() => {
        replaceState({
          selectedCoreValueIds: ["1"],
          coreValuesChipsSnapshot: [
            { id: "1", label: "Accessibility", state: "selected" },
          ],
        });
      }, [replaceState]);
      return <FinalReviewScreen />;
    }
    render(<CoreValuesHarness />);

    const chip = await screen.findByRole("button", { name: "Accessibility" });
    fireEvent.click(chip);

    await waitFor(() => {
      expect(
        screen.getByText(/what does this value mean to your group\?/i),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(/signals of violation/i),
    ).toBeInTheDocument();
  });

  it("opens the editable Save modal for a values chip after Customize", async () => {
    // Customize / plain custom-rule path: snapshot is set, sections is not.
    function CoreValuesHarness() {
      const { replaceState } = useCreateFlow();
      useLayoutEffect(() => {
        replaceState({
          selectedCoreValueIds: ["1"],
          coreValuesChipsSnapshot: [
            { id: "1", label: "Accessibility", state: "selected" },
          ],
        });
      }, [replaceState]);
      return <FinalReviewScreen />;
    }
    render(<CoreValuesHarness />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Accessibility" }),
    );
    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).queryByRole("button", { name: "Save" }),
    ).not.toBeInTheDocument();
    await enterCoreValueCustomizeFromDialog(dialog);
    expect(
      within(dialog).getByRole("button", { name: "Save" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument();
  });

  it("opens Save for values chip after Customize (use-without-changes seeded snapshot)", async () => {
    // Mirrors the post-fix payload from `handleUseTemplateWithoutChanges`:
    // template Values section is stripped from `sections`, snapshot +
    // selected ids are seeded so the chip carries an `overrideKey`.
    function UseWithoutChangesHarness() {
      const { replaceState } = useCreateFlow();
      useLayoutEffect(() => {
        replaceState({
          title: "Oak Park Commons",
          // Values section deliberately absent — apply handler scrubs it.
          sections: [
            {
              categoryName: "Communication",
              entries: [{ title: "Signal", body: "…" }],
            },
          ],
          selectedCoreValueIds: ["1"],
          coreValuesChipsSnapshot: [
            { id: "1", label: "Accessibility", state: "selected" },
          ],
        });
      }, [replaceState]);
      return <FinalReviewScreen />;
    }
    render(<UseWithoutChangesHarness />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Accessibility" }),
    );
    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).queryByRole("button", { name: "Save" }),
    ).not.toBeInTheDocument();
    await enterCoreValueCustomizeFromDialog(dialog);
    expect(
      within(dialog).getByRole("button", { name: "Save" }),
    ).toBeInTheDocument();
  });

});

/**
 * Save semantics for {@link FinalReviewChipEditModal}. Mirrors the
 * "edits ride along to publish" promise documented in the modal:
 *
 * 1. Save starts disabled (no edits yet → nothing to persist).
 * 2. Editing any field flips Save on; clicking it writes the typed
 *    `{group}MethodDetailsById[id]` entry into create-flow state and
 *    closes the modal.
 * 3. Closing without Save discards every typed change.
 */
describe("FinalReviewScreen — chip edit modal save semantics", () => {
  async function enterMethodCustomizeFromDialog(dialog: HTMLElement) {
    fireEvent.click(
      within(dialog).getByRole("button", { name: /more options/i }),
    );
    const customize = await screen.findByRole("menuitem", {
      name: /^customize$/i,
    });
    fireEvent.click(customize);
  }

  const baseSelections: CreateFlowState = {
    title: "Oak Park Commons",
    selectedCommunicationMethodIds: ["signal"],
  };

  it("starts with the Save button disabled until the user edits a field", async () => {
    let latest: CreateFlowState = {};
    render(
      <FinalReviewWithStateProbe
        onState={(s) => {
          latest = s;
        }}
        initial={baseSelections}
      />,
    );
    void latest;

    fireEvent.click(await screen.findByRole("button", { name: "Signal" }));
    const dialog = await screen.findByRole("dialog");
    await enterMethodCustomizeFromDialog(dialog);
    const saveButton = within(dialog).getByRole("button", { name: "Save" });
    expect(saveButton).toBeDisabled();
    const principleField = within(dialog).getByRole("textbox", {
      name: /core principle/i,
    });

    fireEvent.change(principleField, {
      target: { value: "Edited principle" },
    });

    await waitFor(() => {
      expect(
        within(dialog).getByRole("button", { name: "Save" }),
      ).not.toBeDisabled();
    });
  });

  it("writes edits into communicationMethodDetailsById when Save is clicked", async () => {
    let latest: CreateFlowState = {};
    render(
      <FinalReviewWithStateProbe
        onState={(s) => {
          latest = s;
        }}
        initial={baseSelections}
      />,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Signal" }));
    const dialog = await screen.findByRole("dialog");
    await enterMethodCustomizeFromDialog(dialog);
    const principleField = within(dialog).getByRole("textbox", {
      name: /core principle/i,
    });
    fireEvent.change(principleField, {
      target: { value: "Edited principle" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(
        within(screen.getByRole("dialog")).queryByRole("button", {
          name: "Save",
        }),
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        latest.communicationMethodDetailsById?.signal?.corePrinciple,
      ).toBe("Edited principle");
    });
  });

  it("discards typed edits when the modal closes without Save", async () => {
    let latest: CreateFlowState = {};
    render(
      <FinalReviewWithStateProbe
        onState={(s) => {
          latest = s;
        }}
        initial={baseSelections}
      />,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Signal" }));
    const dialog = await screen.findByRole("dialog");
    await enterMethodCustomizeFromDialog(dialog);
    const principleField = within(dialog).getByRole("textbox", {
      name: /core principle/i,
    });
    fireEvent.change(principleField, {
      target: { value: "Should NOT persist" },
    });

    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    try {
      fireEvent.keyDown(document, { key: "Escape" });
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    } finally {
      confirmSpy.mockRestore();
    }

    expect(latest.communicationMethodDetailsById).toBeUndefined();
  });

  it("shows consolidated placeholder for user-authored communication chips", async () => {
    const customId = "550e8400-e29b-41d4-a716-446655440000";
    render(
      <FinalReviewWithStateProbe
        onState={() => {}}
        initial={{
          title: "Oak Park Commons",
          selectedCommunicationMethodIds: [customId],
          customMethodCardMetaById: {
            [customId]: {
              label: "Custom Comm",
              supportText: "Support line from wizard",
            },
          },
        }}
      />,
    );

    fireEvent.click(
      await screen.findByRole("button", { name: "Custom Comm" }),
    );
    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByText(/no custom fields yet/i),
    ).toBeInTheDocument();
    expect(within(dialog).queryByRole("textbox")).toBeNull();
  });

  it("shows custom communication chip when template sections exist (customize-from-template)", async () => {
    const customId = "550e8400-e29b-41d4-a716-446655440999";
    render(
      <FinalReviewWithStateProbe
        onState={() => {}}
        initial={{
          title: "Oak Park Commons",
          sections: [
            {
              categoryName: "Communication",
              entries: [{ title: "Signal", body: "…" }],
            },
          ],
          selectedCommunicationMethodIds: ["signal", customId],
          customMethodCardMetaById: {
            [customId]: {
              label: "Garden IRC",
              supportText: "Support line from wizard",
            },
          },
        }}
      />,
    );

    expect(
      await screen.findByRole("button", { name: "Garden IRC" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Signal" })).toBeInTheDocument();
  });

  it("shows editable field blocks for user-authored communication chips when configured", async () => {
    const customId = "550e8400-e29b-41d4-a716-446655440000";
    render(
      <FinalReviewWithStateProbe
        onState={() => {}}
        initial={{
          title: "Oak Park Commons",
          selectedCommunicationMethodIds: [customId],
          customMethodCardMetaById: {
            [customId]: {
              label: "Custom Comm",
              supportText: "Support line from wizard",
            },
          },
          customMethodCardFieldBlocksById: {
            [customId]: [
              {
                kind: "text",
                id: "f1",
                blockTitle: "Notes",
                placeholderText: "Detail here",
              },
            ],
          },
        }}
      />,
    );

    fireEvent.click(
      await screen.findByRole("button", { name: "Custom Comm" }),
    );
    const dialog = await screen.findByRole("dialog");
    await enterMethodCustomizeFromDialog(dialog);
    expect(
      within(dialog).queryByText(/no custom fields yet/i),
    ).not.toBeInTheDocument();
    const notesField = within(dialog).getByRole("textbox", { name: /notes/i });
    expect(notesField).not.toBeDisabled();
    expect(notesField).toHaveValue("Detail here");
  });

  it("persists field block edits for user-authored communication chips on Save", async () => {
    const customId = "550e8400-e29b-41d4-a716-446655440000";
    let latest: CreateFlowState = {};
    render(
      <FinalReviewWithStateProbe
        onState={(s) => {
          latest = s;
        }}
        initial={{
          title: "Oak Park Commons",
          selectedCommunicationMethodIds: [customId],
          customMethodCardMetaById: {
            [customId]: {
              label: "Custom Comm",
              supportText: "Support line from wizard",
            },
          },
          customMethodCardFieldBlocksById: {
            [customId]: [
              {
                kind: "text",
                id: "f1",
                blockTitle: "Notes",
                placeholderText: "Detail here",
              },
            ],
          },
        }}
      />,
    );

    fireEvent.click(
      await screen.findByRole("button", { name: "Custom Comm" }),
    );
    const dialog = await screen.findByRole("dialog");
    await enterMethodCustomizeFromDialog(dialog);
    const notesField = within(dialog).getByRole("textbox", { name: /notes/i });
    fireEvent.change(notesField, { target: { value: "Saved detail" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(
        latest.customMethodCardFieldBlocksById?.[customId]?.[0],
      ).toMatchObject({
        kind: "text",
        placeholderText: "Saved detail",
      });
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

function FinalReviewEditPublishedWithStateProbe({
  onState,
  initial,
}: {
  onState: (_state: CreateFlowState) => void;
  initial: CreateFlowState;
}) {
  const { state, replaceState } = useCreateFlow();
  useLayoutEffect(() => {
    replaceState(initial);
  }, [replaceState, initial]);
  useEffect(() => {
    onState(state);
  }, [state, onState]);
  return <FinalReviewScreen variant="editPublished" />;
}

describe("FinalReviewScreen — edit published title and description", () => {
  it("does not expose click-to-edit title or description on default final review", () => {
    render(
      <FinalReviewWithFlowState
        title="Oak"
        communityContext="Visible body"
      />,
    );
    expect(screen.queryByTestId("rule-title-edit")).not.toBeInTheDocument();
    expect(screen.queryByTestId("rule-description-edit")).not.toBeInTheDocument();
  });

  it("opens Save modal from title click and updates title", async () => {
    let latest: CreateFlowState = {};
    render(
      <FinalReviewEditPublishedWithStateProbe
        onState={(s) => {
          latest = s;
        }}
        initial={{
          title: "Oak Park Commons",
          communityContext: "Original",
          selectedCommunicationMethodIds: ["signal"],
        }}
      />,
    );

    fireEvent.click(await screen.findByTestId("rule-title-edit"));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(/Community name/i)).toBeInTheDocument();
    const input = within(dialog).getByRole("textbox");
    fireEvent.change(input, { target: { value: "Renamed Commons" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(latest.title).toBe("Renamed Commons");
    });
  });

  it("opens Save modal from description click and updates communityContext + summary", async () => {
    let latest: CreateFlowState = {};
    render(
      <FinalReviewEditPublishedWithStateProbe
        onState={(s) => {
          latest = s;
        }}
        initial={{
          title: "Oak Park Commons",
          communityContext: "Original",
          summary: "Original",
          selectedCommunicationMethodIds: ["signal"],
        }}
      />,
    );
    void latest;

    fireEvent.click(await screen.findByTestId("rule-description-edit"));
    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByText(/Community description/i),
    ).toBeInTheDocument();
    const input = within(dialog).getByRole("textbox");
    fireEvent.change(input, { target: { value: "Updated copy" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(latest.communityContext).toBe("Updated copy");
      expect(latest.summary).toBe("Updated copy");
    });
  });
});
